import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeList, normalizeMedia, normalizeProjectRecord, normalizeSkillRecord } from '../utils/content.js';

test('normalizeList trims and removes blanks', () => {
  assert.deepEqual(normalizeList('STM32,  LoRa , , WiFi'), ['STM32', 'LoRa', 'WiFi']);
});

test('normalizeMedia accepts strings and objects', () => {
  const result = normalizeMedia([
    'https://cdn.example.com/one.jpg',
    { url: 'https://cdn.example.com/two.jpg', alt: 'Board', caption: 'Top view' },
  ]);

  assert.equal(result.length, 2);
  assert.equal(result[0].url, 'https://cdn.example.com/one.jpg');
  assert.equal(result[1].alt, 'Board');
});

test('normalizeProjectRecord keeps legacy data compatible', () => {
  const record = normalizeProjectRecord({
    name: 'Sensor',
    category: 'Embedded Systems',
    galleryImages: ['https://cdn.example.com/one.jpg'],
    imageUrl: 'https://cdn.example.com/cover.jpg',
  });

  assert.equal(record.coverImage.url, 'https://cdn.example.com/cover.jpg');
  assert.equal(record.gallery.length, 1);
  assert.equal(record.gallery[0].url, 'https://cdn.example.com/one.jpg');
});

test('normalizeSkillRecord resolves category names safely', () => {
  const record = normalizeSkillRecord({ name: 'C/C++', category: 'Languages' });
  assert.equal(record.categoryName, 'Languages');
  assert.equal(record.category, 'Languages');
});
