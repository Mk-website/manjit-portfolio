import express from 'express';
import SiteSettings from '../models/SiteSettings.js';
import {requireAuth,requireAdminRole} from '../middleware/auth.js';
const router=express.Router();
router.get('/',async(req,res,next)=>{
  try{
    let item=await SiteSettings.findOne();
    if(!item)item=await SiteSettings.create({});
    res.json({success:true,data:item});
  }catch(e){next(e);}
});
router.put('/',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    const item=await SiteSettings.findOneAndUpdate({},req.body,{new:true,upsert:true,runValidators:true});
    res.json({success:true,data:item});
  }catch(e){next(e);}
});
export default router;