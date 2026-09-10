import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Project from '../models/Project.js';
import Education from '../models/Education.js';
import Achievement from '../models/Achievement.js';
import SiteSettings from '../models/SiteSettings.js';

const seed=async()=>{
  await mongoose.connect(process.env.MONGO_URI);
  const email=process.env.ADMIN_EMAIL,password=process.env.ADMIN_PASSWORD;
  if(!email||!password)throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  if(!await Admin.findOne({email})){
    await Admin.create({email,passwordHash:await bcrypt.hash(password,12),role:'superadmin'});
  }
  if(!await Profile.findOne())await Profile.create({});
  if(!await Skill.countDocuments()){
    await Skill.insertMany(
      ['Embedded C','C++','STM32 HAL','STM32F401','Arduino Nano/AVR','Bare-metal programming','FreeRTOS','LoRa SX1262','NRF24L01','GPS NEO-6M','LoRaWAN concepts','UART','SPI','I2C','STM32CubeIDE','STM32CubeProgrammer','Arduino IDE','Keil IDE','PCB debugging','DSO','Logic Analyzer','Spectrum Analyzer','LCR Meter','Multimeter','RF Signal Generator','VNA','Git','GitHub']
      .map((name,displayOrder)=>({
        name,
        category:['Embedded C','C++'].includes(name)?'Languages':
                 ['STM32 HAL','STM32F401','Arduino Nano/AVR','Bare-metal programming'].includes(name)?'Microcontrollers':
                 name==='FreeRTOS'?'RTOS':
                 ['LoRa SX1262','NRF24L01','GPS NEO-6M','LoRaWAN concepts'].includes(name)?'Wireless & IoT':
                 ['UART','SPI','I2C'].includes(name)?'Protocols':
                 ['STM32CubeIDE','STM32CubeProgrammer','Arduino IDE','Keil IDE'].includes(name)?'Tools':
                 ['PCB debugging'].includes(name)?'Hardware':
                 ['DSO','Logic Analyzer','Spectrum Analyzer','LCR Meter','Multimeter','RF Signal Generator','VNA'].includes(name)?'Testing':'Version Control',
        displayOrder
      }))
    );
  }
  if(!await Experience.countDocuments()){
    await Experience.insertMany([
      {
        company:'Nerve Cells AI (P) Ltd',
        position:'Junior Embedded Firmware Engineer',
        location:'On-site',
        startDate:new Date('2025-10-01'),
        isCurrent:true,
        description:'V2 wireless TX/RX on STM32F401 with LoRa SX1262, 10-channel Quadcopter/Fixed-Wing, PPM/PWM, RTC, OLED, GPS and MicroSD.',
        responsibilities:[
          'Developed V2 TX/RX on STM32F401 using HAL and LoRa SX1262',
          'Expanded to 10 channels with Quadcopter & Fixed-Wing modes and PPM/PWM output',
          'Integrated RTC, OLED, GPS (NEO-6M), MicroSD (SPI) for telemetry and logging',
          'Debugged custom PCB firmware and hardware interfaces through UART diagnostics',
          'Collaborated on UART/SPI/I2C module and protocol integration'
        ],
        technologies:['STM32F401','STM32 HAL','LoRa SX1262','PPM/PWM','RTC','OLED','GPS','MicroSD','SPI','UART','I2C'],
        displayOrder:0
      },
      {
        company:'Nerve Cells AI (P) Ltd',
        position:'Embedded Firmware Intern',
        location:'On-site',
        startDate:new Date('2025-06-01'),
        endDate:new Date('2025-09-30'),
        description:'V1 wireless TX/RX on Arduino Nano with 6-channel control and RTC/EEPROM licensing.',
        responsibilities:[
          'Built V1 wireless TX/RX on Arduino Nano with 6-channel control using joysticks and switches',
          'Implemented trial/permanent licensing using RTC and EEPROM'
        ],
        technologies:['Arduino Nano','RTC','EEPROM'],
        displayOrder:1
      }
    ]);
  }
  if(!await Project.countDocuments()){
    await Project.insertMany([
      {
        name:'Bare-Metal STM32 Programming',
        shortDesc:'Register-level peripheral interfacing on STM32F401CCU6 without HAL.',
        fullDesc:'Implemented LCD interfacing, ADXL345 accelerometer over I2C and SPI, and register-level UART routines.',
        technologies:['STM32F401CCU6','Register-level','LCD','ADXL345','I2C','SPI','UART'],
        featured:true,
        displayOrder:0
      },
      {
        name:'Smart Weather Monitoring System',
        shortDesc:'ESP32 weather node publishing telemetry to Azure IoT Hub with Logic Apps alerts.',
        fullDesc:'Built an ESP32-based weather node for real-time sensor telemetry and configured Azure Logic Apps for cloud-side automation and alerts.',
        technologies:['ESP32','Azure IoT Hub','Logic Apps','IoT'],
        displayOrder:1
      }
    ]);
  }
  if(!await Education.countDocuments()){
    await Education.create({
      degree:'Bachelor of Computer Applications',
      institution:'Post Graduate Government College Sector 11, Chandigarh',
      startYear:2022,
      endYear:2025,
      grade:'CGPA: 6.6'
    });
  }
  if(!await Achievement.countDocuments()){
    await Achievement.create({
      title:'Firmware Development Lead – Internal Project',
      description:'Owned end-to-end firmware for a wireless TX-RX system through its Arduino-to-STM32 upgrade, including RF (NRF24L01/LoRa), RTC, EEPROM, OLED, GPS and MicroSD integration.'
    });
  }
  if(!await SiteSettings.findOne())await SiteSettings.create({});
  console.log('Seed complete');
  await mongoose.disconnect();
};

seed().catch(async e=>{
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});