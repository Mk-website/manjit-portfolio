import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const schema = new mongoose.Schema({
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  passwordHash:{type:String,required:true},
  role:{type:String,enum:['superadmin'],default:'superadmin'}
},{timestamps:true});
schema.methods.comparePassword=function(password){ return bcrypt.compare(password,this.passwordHash); };
export default mongoose.model('Admin',schema);