import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: { type: String, default: '' },
  type: { type: String, enum: ['image', 'video', 'file'], default: 'image' },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
  provider: { type: String, default: '' },
  publicId: { type: String, default: '' },
  size: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
}, { _id: false });

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  categoryName: { type: String, default: '' },
  categorySlug: { type: String, default: '' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillCategory', default: null },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  proficiency: { type: Number, min: 0, max: 100, default: 70 },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  media: { type: [mediaSchema], default: [] },
  imageUrl: { type: String, default: '' },
}, { timestamps: true });

schema.index({ category: 1, displayOrder: 1 });
export default mongoose.model('Skill', schema);