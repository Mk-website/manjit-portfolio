import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

async function resetAdminPassword() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');

  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await Admin.findOneAndUpdate(
    { email },
    { $set: { passwordHash, role: 'superadmin' }, $setOnInsert: { email } },
    { new: true, upsert: true, runValidators: true }
  );
  console.log(`Admin password reset for ${admin.email}`);
}

resetAdminPassword()
  .catch(error => { console.error(error); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
