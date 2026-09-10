import express from 'express';
import Project from '../models/Project.js';
import {requireAuth,requireAdminRole} from '../middleware/auth.js';
const router=express.Router();
router.get('/',async(req,res,next)=>{
  try{
    res.json({success:true,data:await Project.find({status:'published'}).sort({featured:-1,displayOrder:1})});
  }catch(e){next(e);}
});
router.get('/all',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    res.json({success:true,data:await Project.find().sort({featured:-1,displayOrder:1})});
  }catch(e){next(e);}
});
router.get('/:id',async(req,res,next)=>{
  try{
    const item=await Project.findById(req.params.id);
    if(!item)return res.status(404).json({success:false,message:'Not found'});
    res.json({success:true,data:item});
  }catch(e){next(e);}
});
router.post('/',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    res.status(201).json({success:true,data:await Project.create(req.body)});
  }catch(e){next(e);}
});
router.put('/:id',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    const item=await Project.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!item)return res.status(404).json({success:false,message:'Not found'});
    res.json({success:true,data:item});
  }catch(e){next(e);}
});
router.delete('/:id',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    await Project.findByIdAndDelete(req.params.id);
    res.json({success:true,message:'Deleted'});
  }catch(e){next(e);}
});
export default router;