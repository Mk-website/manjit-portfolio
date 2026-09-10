import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  company:{type:String,required:true},
  position:{type:String,required:true},
  location:{type:String,default:'On-site'},
  startDate:{type:Date,required:true},
  endDate:Date,
  isCurrent:{type:Boolean,default:false},
  description:{type:String,default:''},
  responsibilities:{type:[String],default:[]},
  technologies:{type:[String],default:[]},
  displayOrder:{type:Number,default:0},
  isActive:{type:Boolean,default:true}
},{timestamps:true});
schema.index({displayOrder:1});
export default mongoose.model('Experience',schema);