import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  siteTitle:{type:String,default:'Manjit Kumar | Embedded Firmware Engineer'},
  metaDescription:{type:String,default:'Portfolio of Manjit Kumar, an Embedded Firmware Engineer specializing in STM32, LoRa, and wireless TX/RX systems.'},
  socials:{
    github:{type:String,default:'https://github.com/Mk-website'},
    linkedin:{type:String,default:'https://linkedin.com/in/manjit-kumar-432397270'},
    email:{type:String,default:'manjitit33@gmail.com'}
  },
  theme:{type:String,enum:['dark','light'],default:'dark'},
  footerText:{type:String,default:'Built with MERN. All rights reserved.'}
},{timestamps:true});
export default mongoose.model('SiteSettings',schema);