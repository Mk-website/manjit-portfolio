import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  title:{type:String,required:true},
  description:{type:String,default:''},
  displayOrder:{type:Number,default:0},
  isActive:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.model('Achievement',schema);