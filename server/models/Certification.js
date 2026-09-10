import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  name:{type:String,required:true},
  issuer:{type:String,required:true},
  issueDate:Date,
  credentialId:{type:String,default:''},
  credentialUrl:{type:String,default:''},
  isActive:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.model('Certification',schema);