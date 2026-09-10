import express from 'express';
import Profile from '../models/Profile.js';
import {requireAuth,requireAdminRole} from '../middleware/auth.js';
const router=express.Router();
router.get('/',async(req,res,next)=>{
  try{
    let profile=await Profile.findOne();
    if(!profile)profile=await Profile.create({});
    res.json({success:true,data:profile});
  }catch(e){next(e);}
});
router.put('/',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    const profile=await Profile.findOneAndUpdate({},req.body,{new:true,upsert:true,runValidators:true});
    res.json({success:true,data:profile});
  }catch(e){next(e);}
});
export default router;