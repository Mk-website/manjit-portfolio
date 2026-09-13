import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: { type: String, default: '' },
  type: { type: String, enum: ['image', 'video', 'file'], default: 'image' },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isPrimary: { type: Boolean, default: false },
  provider: { type: String, default: '' },
  publicId: { type: String, default: '' },
  size: { type: Number, default: 0 },
}, { _id: false });

const linkSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  url: { type: String, default: '' },
}, { _id: false });

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, default: '' },
  category: { type: String, default: 'Embedded Systems' },
  categoryName: { type: String, default: '' },
  categorySlug: { type: String, default: '' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectCategory', default: null },
  shortDesc: { type: String, required: true },
  fullDesc: { type: String, default: '' },
  problem: { type: String, default: '' },
  solution: { type: String, default: '' },
  architecture: { type: String, default: '' },
  implementation: { type: String, default: '' },
  hardware: { type: String, default: '' },
  firmware: { type: String, default: '' },
  testing: { type: String, default: '' },
  challenges: { type: String, default: '' },
  results: { type: String, default: '' },
  role: { type: String, default: '' },
  protocols: { type: [String], default: [] },
  technologies: { type: [String], default: [] },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  documentationUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  coverImage: { type: mediaSchema, default: { url: '', alt: '', caption: '', isPrimary: true } },
  gallery: { type: [mediaSchema], default: [] },
  galleryImages: { type: [String], default: [] },
  links: { type: [linkSchema], default: [] },
  videoUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  displayOrder: { type: Number, default: 0 },
  media: { type: [mediaSchema], default: [] },
}, { timestamps: true });

schema.index({ featured: -1, displayOrder: 1, status: 1, isActive: 1 });
export default mongoose.model('Project', schema);