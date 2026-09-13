import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deleteMedia,
  mediaProviderStatus,
  normalizeUploadResponse,
  uploadMedia,
  validateImageKitConfig,
  validateUpload,
} from '../services/media.js';

const validFile = (overrides = {}) => ({
  originalname: 'board.png',
  mimetype: 'image/png',
  size: 12,
  buffer: Buffer.from('image bytes'),
  ...overrides,
});

test('ImageKit configuration requires all server variables', () => {
  assert.deepEqual(validateImageKitConfig({}), {
    configured: false,
    missing: ['IMAGEKIT_PUBLIC_KEY', 'IMAGEKIT_PRIVATE_KEY', 'IMAGEKIT_URL_ENDPOINT'],
  });
  assert.equal(mediaProviderStatus({
    IMAGEKIT_PUBLIC_KEY: 'public_test',
    IMAGEKIT_PRIVATE_KEY: 'private_test',
    IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/test',
  }), 'imagekit');
});

test('upload validation rejects invalid MIME types, extensions, and sizes', () => {
  assert.equal(validateUpload(validFile({ mimetype: 'application/pdf', originalname: 'board.pdf' })).ok, false);
  assert.equal(validateUpload(validFile({ originalname: 'board.jpg' })).ok, false);
  assert.equal(validateUpload(validFile({ size: 101 }), 100).ok, false);
});

test('ImageKit response maps to the existing MediaManager shape', () => {
  const result = normalizeUploadResponse({
    url: 'https://ik.imagekit.io/test/projects/covers/file.png',
    fileId: 'imagekit-file-id',
    filePath: '/projects/covers/file.png',
    size: 42,
    name: 'file.png',
  }, validFile(), 'projects/covers');

  assert.deepEqual(result, {
    url: 'https://ik.imagekit.io/test/projects/covers/file.png',
    key: '/projects/covers/file.png',
    publicId: 'imagekit-file-id',
    provider: 'imagekit',
    size: 42,
    type: 'image/png',
  });
});

test('successful upload uses a safe folder and returns provider metadata', async () => {
  let request;
  const fakeClient = { files: { upload: async (payload) => {
    request = payload;
    return {
      url: 'https://ik.imagekit.io/test/portfolio/file.png',
      fileId: 'uploaded-file-id',
      filePath: '/portfolio/file.png',
      size: 12,
      name: 'file.png',
    };
  } } };

  const result = await uploadMedia(validFile(), '../projects/gallery', { imageKitClient: fakeClient });
  assert.equal(request.folder, '/portfolio');
  assert.equal(request.fileName.endsWith('.png'), true);
  assert.equal(result.publicId, 'uploaded-file-id');
  assert.equal(result.provider, 'imagekit');
});

test('delete refuses unsafe identifiers without calling ImageKit', async () => {
  let called = false;
  const fakeClient = { files: { delete: async () => { called = true; } } };
  assert.equal(await deleteMedia('../old-file', { imageKitClient: fakeClient }), false);
  assert.equal(called, false);
});

test('delete passes the ImageKit file ID to the provider', async () => {
  let deleted;
  const fakeClient = { files: { delete: async (fileId) => { deleted = fileId; } } };
  assert.equal(await deleteMedia('imagekit-file-id', { imageKitClient: fakeClient }), true);
  assert.equal(deleted, 'imagekit-file-id');
});
