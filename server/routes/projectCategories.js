import express from 'express';
import ProjectCategory from '../models/ProjectCategory.js';
import Project from '../models/Project.js';
import { requireAuth, requireAdminRole } from '../middleware/auth.js';
import { isObjectId, slugify } from '../utils/validation.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const items = await ProjectCategory.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
});

router.get('/all', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    const items = await ProjectCategory.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
});

router.post('/', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (!payload.name) return res.status(400).json({ success: false, message: 'Name is required.' });
    payload.slug = slugify(payload.slug || payload.name);
    if (!payload.slug) return res.status(400).json({ success: false, message: 'A valid slug is required.' });
    if (await ProjectCategory.exists({ $or: [{ name: payload.name }, { slug: payload.slug }] })) return res.status(409).json({ success: false, message: 'Category name or slug already exists.' });
    const item = await ProjectCategory.create(payload);
    res.status(201).json({ success: true, data: item });
  } catch (error) { next(error); }
});

router.put('/:id', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    const payload = { ...req.body, slug: slugify(req.body.slug || req.body.name) };
    if (!payload.slug) return res.status(400).json({ success: false, message: 'A valid slug is required.' });
    if (await ProjectCategory.exists({ _id: { $ne: req.params.id }, $or: [{ name: payload.name }, { slug: payload.slug }] })) return res.status(409).json({ success: false, message: 'Category name or slug already exists.' });
    const previous = await ProjectCategory.findById(req.params.id);
    const item = await ProjectCategory.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Category not found.' });
    if (previous && previous.name !== item.name) await Project.updateMany({ categoryId: item._id }, { $set: { category: item.name, categoryName: item.name, categorySlug: item.slug } });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
});

router.delete('/:id', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    const inUseProject = await Project.exists({ categoryId: req.params.id });
    if (inUseProject) {
      return res.status(409).json({ success: false, message: 'This category is still assigned to one or more projects.' });
    }
    const item = await ProjectCategory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, message: 'Category deleted.' });
  } catch (error) { next(error); }
});

export default router;
