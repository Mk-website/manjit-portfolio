import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  name:{type:String,default:'Manjit Kumar'},
  title:{type:String,default:'Embedded Firmware Engineer'},
  heroEyebrow:{type:String,default:'Embedded firmware portfolio'},
  heroTitle:{type:String,default:''},
  heroSubtitle:{type:String,default:''},
  heroDescription:{type:String,default:''},
  summary:{type:String,default:'Embedded Firmware Engineer with 1 year of experience building wireless TX/RX and IoT-oriented systems on STM32 and Arduino, with strong hardware testing and debugging skills.'},
  phone:{type:String,default:'+91-7625836330'},
  email:{type:String,default:'manjitit33@gmail.com'},
  github:{type:String,default:'https://github.com/Mk-website'},
  linkedin:{type:String,default:'https://linkedin.com/in/manjit-kumar-432397270'},
  location:{type:String,default:''},
  yearsExperience:{type:Number,default:1},
  availabilityStatus:{type:String,default:'Available for embedded systems work'},
  resumeUrl:{type:String,default:''},
  primaryCtaText:{type:String,default:'View projects'},
  primaryCtaUrl:{type:String,default:'/projects'},
  secondaryCtaText:{type:String,default:'Contact me'},
  secondaryCtaUrl:{type:String,default:'/contact'},
  techStack:{type:[String],default:['STM32F401','LoRa SX1262','Wireless TX/RX','UART / SPI / I2C','IoT']},
  interests:{type:[String],default:['Firmware Design','IoT & Wireless Systems','Drone Control Systems']},
  strengths:{type:[String],default:['Hardware debugging','Low-power wireless links','Bare-metal STM32']},
  photoUrl:{type:String,default:''},
  socials:{
    github:{type:String,default:'https://github.com/Mk-website'},
    linkedin:{type:String,default:'https://linkedin.com/in/manjit-kumar-432397270'},
    email:{type:String,default:'manjitit33@gmail.com'}
  }
},{timestamps:true});
export default mongoose.model('Profile',schema);