import mongoose from 'mongoose';
export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
}