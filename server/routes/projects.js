import express from 'express';
import Project from '../models/Project.js';
import ProjectCategory from '../models/ProjectCategory.js';
import {requireAuth,requireAdminRole} from '../middleware/auth.js';
import { normalizeProjectRecord } from '../utils/content.js';
import { isObjectId, safeUrl } from '../utils/validation.js';

const router=express.Router();

const applyCategoryContext = async (payload = {}) => {
  const next = normalizeProjectRecord(payload);
  if (payload.categoryId && !isObjectId(payload.categoryId)) {
    const error = new Error('Invalid project category ID.'); error.statusCode = 400; throw error;
  }
  if (payload.categoryId) {
    const category = await ProjectCategory.findById(payload.categoryId);
    if (!category || !category.isActive) {
      const error = new Error('Project category does not exist or is inactive.'); error.statusCode = 400; throw error;
    }
    if (category) {
      next.category = category.name;
      next.categoryName = category.name;
      next.categorySlug = category.slug;
      next.categoryId = category._id;
    }
  }
  for (const field of ['githubUrl', 'liveUrl', 'documentationUrl', 'videoUrl']) {
    if (next[field] && !safeUrl(next[field])) { const error = new Error(`Invalid ${field}.`); error.statusCode = 400; throw error; }
  }
  if (!next.categoryName && next.category) next.categoryName = next.category;
  if (!next.category && next.categoryName) next.category = next.categoryName;
  return next;
};

router.get('/',async(req,res,next)=>{
  try{
    const items = await Project.find({ status:'published', isActive:true }).sort({ featured:-1, displayOrder:1 });
    res.json({success:true,data:items.map((item) => normalizeProjectRecord(item.toObject())) });
  }catch(e){next(e);}
});
router.get('/all',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    const items = await Project.find().sort({ featured:-1, displayOrder:1 });
    res.json({success:true,data:items.map((item) => normalizeProjectRecord(item.toObject())) });
  }catch(e){next(e);}
});
router.get('/:id',async(req,res,next)=>{
  try{
    const item=await Project.findOne({ _id: req.params.id, status: 'published', isActive: true });
    if(!item)return res.status(404).json({success:false,message:'Not found'});
    res.json({success:true,data:normalizeProjectRecord(item.toObject())});
  }catch(e){next(e);}
});
router.post('/',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    if (!req.body?.categoryId) return res.status(400).json({ success: false, message: 'A project category is required.' });
    const payload = await applyCategoryContext(req.body);
    const item = await Project.create(payload);
    res.status(201).json({success:true,data:normalizeProjectRecord(item.toObject())});
  }catch(e){next(e);}
});
router.put('/:id',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    const payload = await applyCategoryContext(req.body);
    const item=await Project.findByIdAndUpdate(req.params.id,payload,{new:true,runValidators:true});
    if(!item)return res.status(404).json({success:false,message:'Not found'});
    res.json({success:true,data:normalizeProjectRecord(item.toObject())});
  }catch(e){next(e);}
});
router.delete('/:id',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    await Project.findByIdAndDelete(req.params.id);
    res.json({success:true,message:'Deleted'});
  }catch(e){next(e);}
});
export default router;