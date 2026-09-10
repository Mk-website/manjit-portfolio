import express from 'express';
import Resume from '../models/Resume.js';
import {requireAuth,requireAdminRole} from '../middleware/auth.js';
const router=express.Router();
router.get('/',async(req,res,next)=>{
  try{
    res.json({success:true,data:await Resume.findOne({isActive:true})});
  }catch(e){next(e);}
});
router.post('/',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    const{fileUrl,fileName}=req.body;
    if(!fileUrl||!fileName)return res.status(400).json({success:false,message:'fileUrl and fileName required'});
    await Resume.updateMany({},{$set:{isActive:false}});
    res.status(201).json({success:true,data:await Resume.create({fileUrl,fileName,isActive:true})});
  }catch(e){next(e);}
});
router.delete('/:id',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    await Resume.findByIdAndDelete(req.params.id);
    res.json({success:true,message:'Deleted'});
  }catch(e){next(e);}
});
export default router;