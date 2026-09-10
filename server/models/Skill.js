import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  name:{type:String,required:true},
  category:{type:String,required:true},
  icon:{type:String,default:''},
  proficiency:{type:Number,min:0,max:100,default:70},
  displayOrder:{type:Number,default:0},
  isActive:{type:Boolean,default:true}
},{timestamps:true});
schema.index({category:1,displayOrder:1});
export default mongoose.model('Skill',schema);