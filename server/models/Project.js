import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  name:{type:String,required:true},
  slug:{type:String,default:''},
  category:{type:String,default:'Embedded Systems'},
  shortDesc:{type:String,required:true},
  fullDesc:{type:String,default:''},
  problem:{type:String,default:''},
  solution:{type:String,default:''},
  architecture:{type:String,default:''},
  implementation:{type:String,default:''},
  hardware:{type:String,default:''},
  firmware:{type:String,default:''},
  protocols:{type:[String],default:[]},
  technologies:{type:[String],default:[]},
  githubUrl:{type:String,default:''},
  liveUrl:{type:String,default:''},
  documentationUrl:{type:String,default:''},
  imageUrl:{type:String,default:''},
  galleryImages:{type:[String],default:[]},
  videoUrl:{type:String,default:''},
  featured:{type:Boolean,default:false},
  isActive:{type:Boolean,default:true},
  status:{type:String,enum:['published','draft'],default:'published'},
  displayOrder:{type:Number,default:0}
},{timestamps:true});
schema.index({featured:-1,displayOrder:1,status:1,isActive:1});
export default mongoose.model('Project',schema);