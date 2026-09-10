import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  fileUrl:{type:String,required:true},
  fileName:{type:String,required:true},
  isActive:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.model('Resume',schema);