import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  degree:{type:String,required:true},
  institution:{type:String,required:true},
  startYear:{type:Number,required:true},
  endYear:{type:Number,required:true},
  grade:{type:String,default:''},
  description:{type:String,default:''},
  displayOrder:{type:Number,default:0},
  isActive:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.model('Education',schema);