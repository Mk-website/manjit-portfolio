import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  subject:{type:String,required:true},
  body:{type:String,required:true},
  isRead:{type:Boolean,default:false},
  ipHash:{type:String,default:''}
},{timestamps:true});
schema.index({createdAt:-1});
export default mongoose.model('Message',schema);