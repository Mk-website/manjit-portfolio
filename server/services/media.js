import crypto from 'node:crypto';
import path from 'node:path';
import ImageKit from '@imagekit/nodejs';
import { toFile } from '@imagekit/nodejs';

const maxBytes = Number(process.env.MEDIA_MAX_BYTES || 5 * 1024 * 1024);
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const extensionByMime = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

export function validateImageKitConfig(env = process.env) {
  const missing = ['IMAGEKIT_PUBLIC_KEY', 'IMAGEKIT_PRIVATE_KEY', 'IMAGEKIT_URL_ENDPOINT']
    .filter((key) => !String(env[key] || '').trim());
  return { configured: missing.length === 0, missing };
}

export function mediaProviderStatus(env = process.env) {
  return validateImageKitConfig(env).configured ? 'imagekit' : 'unconfigured';
}

export function validateUpload(file, limit = maxBytes) {
  if (!file) return { ok: false, message: 'Image file is required.' };
  if (!allowedMimeTypes.has(file.mimetype)) return { ok: false, message: 'Only JPEG, PNG, WebP, GIF, and AVIF images are supported.' };
  const extension = path.extname(file.originalname || '').toLowerCase();
  if (!extension) return { ok: false, message: 'An image file extension is required.' };
  if (extension !== extensionByMime[file.mimetype]) return { ok: false, message: 'File extension does not match its image type.' };
  if (file.size > limit) return { ok: false, message: `Image exceeds the ${Math.round(limit / 1024 / 1024)}MB limit.` };
  return { ok: true };
}

function normalizeFolder(folder) {
  const value = String(folder || 'portfolio').replaceAll('\\', '/').trim();
  const segments = value.split('/').filter(Boolean);
  if (!segments.length || segments.some((segment) => segment === '.' || segment === '..' || !/^[a-zA-Z0-9_-]+$/.test(segment))) {
    return 'portfolio';
  }
  return segments.join('/');
}

function getImageKitClient(env = process.env) {
  const config = validateImageKitConfig(env);
  if (!config.configured) {
    const error = new Error(`ImageKit storage is not configured. Set ${config.missing.join(', ')}.`);
    error.statusCode = 503;
    throw error;
  }
  return new ImageKit({ privateKey: env.IMAGEKIT_PRIVATE_KEY });
}

export function normalizeUploadResponse(response, file, folder) {
  const url = typeof response?.url === 'string' ? response.url : '';
  const publicId = typeof response?.fileId === 'string' ? response.fileId : '';
  if (!url || !publicId) {
    const error = new Error('ImageKit returned an incomplete upload response.');
    error.statusCode = 502;
    throw error;
  }
  return {
    url,
    key: response.filePath || `${folder}/${response.name || file.originalname}`,
    publicId,
    provider: 'imagekit',
    size: Number(response.size) || file.size,
    type: file.mimetype,
  };
}

export async function uploadMedia(file, folder = 'portfolio', { imageKitClient, env = process.env } = {}) {
  const validation = validateUpload(file);
  if (!validation.ok) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  const safeFolder = normalizeFolder(folder);
  const fileName = `${crypto.randomUUID()}${extensionByMime[file.mimetype]}`;
  const client = imageKitClient || getImageKitClient(env);
  const response = await client.files.upload({
    file: await toFile(file.buffer, fileName),
    fileName,
    folder: `/${safeFolder}`,
    useUniqueFileName: false,
    overwriteFile: false,
  });

  return normalizeUploadResponse(response, file, safeFolder);
}

export async function deleteMedia(publicId, { imageKitClient, env = process.env } = {}) {
  if (typeof publicId !== 'string' || !/^[A-Za-z0-9_-]+$/.test(publicId)) return false;
  const client = imageKitClient || getImageKitClient(env);
  await client.files.delete(publicId);
  return true;
}