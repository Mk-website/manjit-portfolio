import express from 'express';
import Skill from '../models/Skill.js';
import SkillCategory from '../models/SkillCategory.js';
import { requireAuth, requireAdminRole } from '../middleware/auth.js';
import { normalizeSkillRecord } from '../utils/content.js';
import { isObjectId } from '../utils/validation.js';

const router = express.Router();

const applyCategoryContext = async (payload = {}) => {
  const next = normalizeSkillRecord(payload);
  if (payload.categoryId && !isObjectId(payload.categoryId)) {
    const error = new Error('Invalid skill category ID.'); error.statusCode = 400; throw error;
  }
  if (payload.categoryId) {
    const category = await SkillCategory.findById(payload.categoryId);
    if (!category || !category.isActive) {
      const error = new Error('Skill category does not exist or is inactive.'); error.statusCode = 400; throw error;
    }
    if (category) {
      next.category = category.name;
      next.categoryName = category.name;
      next.categorySlug = category.slug;
      next.categoryId = category._id;
    }
  }
  if (!next.categoryName && next.category) next.categoryName = next.category;
  if (!next.category && next.categoryName) next.category = next.categoryName;
  return next;
};

router.get('/', async (req, res, next) => {
  try {
    const items = await Skill.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, data: items.map((item) => normalizeSkillRecord(item.toObject())) });
  } catch (error) { next(error); }
});

router.get('/all', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    const items = await Skill.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, data: items.map((item) => normalizeSkillRecord(item.toObject())) });
  } catch (error) { next(error); }
});

router.post('/', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    if (!req.body?.categoryId) return res.status(400).json({ success: false, message: 'A skill category is required.' });
    const payload = await applyCategoryContext(req.body);
    const item = await Skill.create(payload);
    res.status(201).json({ success: true, data: normalizeSkillRecord(item.toObject()) });
  } catch (error) { next(error); }
});

router.put('/:id', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    const payload = await applyCategoryContext(req.body);
    const item = await Skill.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: normalizeSkillRecord(item.toObject()) });
  } catch (error) { next(error); }
});

router.delete('/:id', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    const item = await Skill.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) { next(error); }
});

export default router;