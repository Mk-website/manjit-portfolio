import express from 'express';
import multer from 'multer';
import { requireAuth, requireAdminRole } from '../middleware/auth.js';
import { deleteMedia, mediaProviderStatus, uploadMedia } from '../services/media.js';
import { safeUrl } from '../utils/validation.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.MEDIA_MAX_BYTES || 5 * 1024 * 1024), files: 1 },
});

router.post('/upload', requireAuth, requireAdminRole, upload.single('file'), async (req, res, next) => {
  try {
    const media = await uploadMedia(req.file, req.body.folder || 'portfolio');
    res.status(201).json({ success: true, data: media });
  } catch (error) { next(error); }
});

router.post('/validate', requireAuth, requireAdminRole, (req, res) => {
  const { url, type = 'image', size = 0 } = req.body || {};
  const normalized = safeUrl(url);

  if (!normalized) return res.status(400).json({ success: false, message: 'A valid HTTP or HTTPS image URL is required.' });

  if (type.startsWith('image/') === false && type !== 'image') {
    return res.status(400).json({ success: false, message: 'Only image uploads are supported in this CMS.' });
  }

  if (size > 5 * 1024 * 1024) {
    return res.status(400).json({ success: false, message: 'Image exceeds 5MB limit.' });
  }

  res.json({ success: true, data: { valid: true, url: normalized } });
});

router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', provider: mediaProviderStatus() } });
});

router.delete('/:key(*)', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    await deleteMedia(req.params.key);
    res.json({ success: true, message: 'Media deleted.' });
  } catch (error) { next(error); }
});

export default router;
