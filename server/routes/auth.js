import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Admin from '../models/Admin.js';
import {requireAuth} from '../middleware/auth.js';
const router=express.Router();
const loginLimiter=rateLimit({windowMs:15*60*1000,max:10,standardHeaders:true,legacyHeaders:false,message:{success:false,message:'Too many login attempts, please try again later.'}});
const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'lax',path:'/',maxAge:604800000};
router.post('/login',loginLimiter,async(req,res,next)=>{
  try{
    const email=typeof req.body?.email==='string'?req.body.email.trim().toLowerCase():'';
    const password=typeof req.body?.password==='string'?req.body.password:'';
    if(!email||!password||email.length>254||password.length>256)return res.status(400).json({success:false,message:'Valid email and password required'});
    const admin=await Admin.findOne({email});
    if(!admin||!(await admin.comparePassword(password)))return res.status(401).json({success:false,message:'Invalid credentials'});
    const token=jwt.sign({sub:admin._id,role:admin.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'7d'});
    res.cookie('accessToken',token,cookieOptions);
    res.json({success:true,message:'Logged in',data:{email:admin.email,role:admin.role}});
  }catch(e){next(e);}
});
router.post('/logout',(req,res)=>{res.clearCookie('accessToken',cookieOptions);res.json({success:true,message:'Logged out'});});
router.get('/me',requireAuth,(req,res)=>res.json({success:true,data:{email:req.admin.email,role:req.admin.role}}));
export default router;