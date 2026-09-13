import mongoose from 'mongoose';

export const allowedUrlSchemes = new Set(['http:', 'https:']);

export function safeUrl(value, { allowRelative = false } = {}) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const input = value.trim();
  if (allowRelative && input.startsWith('/') && !input.startsWith('//')) return input;
  try {
    const parsed = new URL(input);
    return allowedUrlSchemes.has(parsed.protocol) ? parsed.toString() : '';
  } catch {
    return '';
  }
}

export function isObjectId(value) {
  return mongoose.isValidObjectId(value);
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}