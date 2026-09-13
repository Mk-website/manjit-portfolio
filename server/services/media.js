import crypto from 'node:crypto';
import path from 'node:path';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const maxBytes = Number(process.env.MEDIA_MAX_BYTES || 5 * 1024 * 1024);
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const extensionByMime = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

const storageConfigured = Boolean(process.env.MEDIA_BUCKET && process.env.MEDIA_ACCESS_KEY_ID && process.env.MEDIA_SECRET_ACCESS_KEY);
const client = storageConfigured ? new S3Client({
  region: process.env.MEDIA_REGION || 'auto',
  endpoint: process.env.MEDIA_ENDPOINT || undefined,
  forcePathStyle: process.env.MEDIA_FORCE_PATH_STYLE === 'true',
  credentials: {
    accessKeyId: process.env.MEDIA_ACCESS_KEY_ID,
    secretAccessKey: process.env.MEDIA_SECRET_ACCESS_KEY,
  },
}) : null;

export function mediaProviderStatus() {
  return storageConfigured ? 's3-compatible' : 'unconfigured';
}

export function validateUpload(file) {
  if (!file) return { ok: false, message: 'Image file is required.' };
  if (!allowedMimeTypes.has(file.mimetype)) return { ok: false, message: 'Only JPEG, PNG, WebP, GIF, and AVIF images are supported.' };
  const extension = path.extname(file.originalname || '').toLowerCase();
  if (!extension) return { ok: false, message: 'An image file extension is required.' };
  if (extension && extension !== extensionByMime[file.mimetype]) return { ok: false, message: 'File extension does not match its image type.' };
  if (file.size > maxBytes) return { ok: false, message: `Image exceeds the ${Math.round(maxBytes / 1024 / 1024)}MB limit.` };
  return { ok: true };
}

function publicUrl(key) {
  const base = (process.env.MEDIA_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (!base) throw new Error('MEDIA_PUBLIC_BASE_URL is required for media uploads');
  return `${base}/${key.split('/').map(encodeURIComponent).join('/')}`;
}

export async function uploadMedia(file, folder = 'portfolio') {
  const validation = validateUpload(file);
  if (!validation.ok) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }
  if (!client) {
    const error = new Error('Media storage is not configured. Set the MEDIA_* server variables.');
    error.statusCode = 503;
    throw error;
  }

  const safeFolder = String(folder).replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'portfolio';
  const key = `${safeFolder}/${crypto.randomUUID()}${extensionByMime[file.mimetype]}`;
  await client.send(new PutObjectCommand({
    Bucket: process.env.MEDIA_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return { url: publicUrl(key), key, publicId: key, provider: 's3-compatible', size: file.size, type: file.mimetype };
}

export async function deleteMedia(key) {
  if (!client || !key || key.includes('..') || key.startsWith('/')) return false;
  await client.send(new DeleteObjectCommand({ Bucket: process.env.MEDIA_BUCKET, Key: key }));
  return true;
}