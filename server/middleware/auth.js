import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
export async function requireAuth(req,res,next){
  const token=req.cookies?.accessToken;
  if(!token)return res.status(401).json({success:false,message:'Unauthorized'});
  try{
    const payload=jwt.verify(token,process.env.JWT_SECRET);
    const admin=await Admin.findById(payload.sub);
    if(!admin)return res.status(401).json({success:false,message:'Unauthorized'});
    req.admin=admin;
    next();
  }catch{return res.status(401).json({success:false,message:'Unauthorized'});}
}
export function requireAdminRole(req,res,next){
  if(req.admin?.role!=='superadmin')return res.status(403).json({success:false,message:'Forbidden'});
  next();
}