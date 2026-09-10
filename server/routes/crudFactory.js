import express from 'express';
import {requireAuth,requireAdminRole} from '../middleware/auth.js';
export const makeCrudRouter=(Model,{publicFilter={isActive:true},publicSort={displayOrder:1}}={})=>{
  const router=express.Router();
  router.get('/',async(req,res,next)=>{try{res.json({success:true,data:await Model.find(publicFilter).sort(publicSort)});}catch(e){next(e);}});
  router.get('/all',requireAuth,requireAdminRole,async(req,res,next)=>{try{res.json({success:true,data:await Model.find().sort(publicSort)});}catch(e){next(e);}});
  router.post('/',requireAuth,requireAdminRole,async(req,res,next)=>{try{res.status(201).json({success:true,data:await Model.create(req.body)});}catch(e){next(e);}});
  router.put('/:id',requireAuth,requireAdminRole,async(req,res,next)=>{try{const item=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!item)return res.status(404).json({success:false,message:'Not found'});res.json({success:true,data:item});}catch(e){next(e);}});
  router.delete('/:id',requireAuth,requireAdminRole,async(req,res,next)=>{try{const item=await Model.findByIdAndDelete(req.params.id);if(!item)return res.status(404).json({success:false,message:'Not found'});res.json({success:true,message:'Deleted'});}catch(e){next(e);}});
  return router;
};