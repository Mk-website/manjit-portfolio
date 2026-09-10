import express from 'express';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import Message from '../models/Message.js';
import {requireAuth,requireAdminRole} from '../middleware/auth.js';
const router=express.Router();
const limiter=rateLimit({windowMs:60000,max:5,message:{success:false,message:'Too many requests, please try again later.'}});
router.post('/',limiter,async(req,res,next)=>{
  try{
    const{name,email,subject,body}=req.body;
    if(!name||!email||!subject||!body)return res.status(400).json({success:false,message:'All fields are required'});
    const ipHash=crypto.createHash('sha256').update(req.ip||'').digest('hex').slice(0,16);
    const item=await Message.create({name,email,subject,body,ipHash});
    res.status(201).json({success:true,message:'Message sent',data:{id:item._id}});
  }catch(e){next(e);}
});
router.get('/',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    res.json({success:true,data:await Message.find().sort({createdAt:-1}).limit(100)});
  }catch(e){next(e);}
});
router.patch('/:id/read',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    const item=await Message.findByIdAndUpdate(req.params.id,{isRead:!!req.body.isRead},{new:true});
    if(!item)return res.status(404).json({success:false,message:'Not found'});
    res.json({success:true,data:item});
  }catch(e){next(e);}
});
router.delete('/:id',requireAuth,requireAdminRole,async(req,res,next)=>{
  try{
    await Message.findByIdAndDelete(req.params.id);
    res.json({success:true,message:'Deleted'});
  }catch(e){next(e);}
});
export default router;