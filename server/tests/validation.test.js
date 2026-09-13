import test from 'node:test';
import assert from 'node:assert/strict';
import { safeUrl } from '../utils/validation.js';
import { validateUpload } from '../services/media.js';

test('safeUrl allows web URLs and rejects executable schemes', () => {
  assert.equal(safeUrl('https://example.com/image.png'), 'https://example.com/image.png');
  assert.equal(safeUrl('javascript:alert(1)'), '');
  assert.equal(safeUrl('data:image/png;base64,abc'), '');
  assert.equal(safeUrl('/resume.pdf', { allowRelative: true }), '/resume.pdf');
});

test('validateUpload rejects unsupported MIME and oversized files', () => {
  assert.equal(validateUpload({ mimetype: 'application/pdf', size: 100 }).ok, false);
  assert.equal(validateUpload({ mimetype: 'image/png', size: 6 * 1024 * 1024 }).ok, false);
  assert.equal(validateUpload({ mimetype: 'image/png', originalname: 'photo.png', size: 100 }).ok, true);
  assert.equal(validateUpload({ mimetype: 'image/png', originalname: 'photo.jpg', size: 100 }).ok, false);
});