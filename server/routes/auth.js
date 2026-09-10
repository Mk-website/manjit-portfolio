import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import {requireAuth} from '../middleware/auth.js';
const router=express.Router();
router.post('/login',async(req,res,next)=>{
  try{
    const{email,password}=req.body;
    if(!email||!password)return res.status(400).json({success:false,message:'Email and password required'});
    const admin=await Admin.findOne({email:email.toLowerCase()});
    if(!admin||!(await admin.comparePassword(password)))return res.status(401).json({success:false,message:'Invalid credentials'});
    const token=jwt.sign({sub:admin._id,role:admin.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'7d'});
    res.cookie('accessToken',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'lax',maxAge:604800000});
    res.json({success:true,message:'Logged in',data:{email:admin.email,role:admin.role}});
  }catch(e){next(e);}
});
router.post('/logout',(req,res)=>{res.clearCookie('accessToken');res.json({success:true,message:'Logged out'});});
router.get('/me',requireAuth,(req,res)=>res.json({success:true,data:{email:req.admin.email,role:req.admin.role}}));
export default router;