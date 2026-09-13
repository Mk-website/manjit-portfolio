import express from 'express';
import SiteSettings from '../models/SiteSettings.js';
import {requireAuth,requireAdminRole} from '../middleware/auth.js';
import { safeUrl } from '../utils/validation.js';
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
    const payload = { ...req.body };
    for (const field of ['ogImage', 'canonicalUrl', 'resumeUrl']) if (payload[field] && !safeUrl(payload[field], { allowRelative: field === 'resumeUrl' })) return res.status(400).json({ success: false, message: `Invalid ${field}.` });
    if (payload.socials) for (const field of ['github', 'linkedin']) if (payload.socials[field] && !safeUrl(payload.socials[field])) return res.status(400).json({ success: false, message: `Invalid social ${field} URL.` });
    const item=await SiteSettings.findOneAndUpdate({},payload,{new:true,upsert:true,runValidators:true});
    res.json({success:true,data:item});
  }catch(e){next(e);}
});
export default router;