import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  name:{type:String,required:true},
  shortDesc:{type:String,required:true},
  fullDesc:{type:String,default:''},
  technologies:{type:[String],default:[]},
  githubUrl:{type:String,default:''},
  liveUrl:{type:String,default:''},
  imageUrl:{type:String,default:''},
  featured:{type:Boolean,default:false},
  status:{type:String,enum:['published','draft'],default:'published'},
  displayOrder:{type:Number,default:0}
},{timestamps:true});
schema.index({featured:-1,displayOrder:1,status:1});
export default mongoose.model('Project',schema);