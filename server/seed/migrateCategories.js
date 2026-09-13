import 'dotenv/config';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import ProjectCategory from '../models/ProjectCategory.js';
import Skill from '../models/Skill.js';
import SkillCategory from '../models/SkillCategory.js';
import { slugify } from '../utils/validation.js';

async function migrate(Model, CategoryModel, label) {
  const categories = await CategoryModel.find();
  const byName = new Map(categories.map((category) => [category.name.trim().toLowerCase(), category]));
  const records = await Model.find({ categoryId: null });
  let matched = 0;
  for (const record of records) {
    const legacyName = String(record.categoryName || record.category || '').trim().toLowerCase();
    if (!legacyName) continue;
    let category = byName.get(legacyName);
    if (!category) {
      const displayName = String(record.categoryName || record.category).trim();
      category = await CategoryModel.findOneAndUpdate(
        { slug: slugify(displayName) },
        { $setOnInsert: { name: displayName, slug: slugify(displayName), isActive: true } },
        { upsert: true, new: true },
      );
      byName.set(legacyName, category);
    }
    await Model.updateOne({ _id: record._id, categoryId: null }, { $set: { categoryId: category._id, category: category.name, categoryName: category.name, categorySlug: category.slug } });
    matched += 1;
  }
  console.log(`${label}: matched ${matched} of ${records.length}`);
}

await mongoose.connect(process.env.MONGO_URI);
await migrate(Project, ProjectCategory, 'projects');
await migrate(Skill, SkillCategory, 'skills');
await mongoose.disconnect();