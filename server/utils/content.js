export function normalizeList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
      .filter(Boolean);
  }

  if (value == null || value === '') return [];

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeMedia(value) {
  const items = Array.isArray(value) ? value : value ? [value] : [];

  return items
    .map((item, index) => {
      if (typeof item === 'string') {
        const url = item.trim();
        return url ? { id: `media-${index}`, url, alt: '', caption: '', isPrimary: false } : null;
      }

      if (!item || typeof item !== 'object') return null;

      const url = typeof item.url === 'string' ? item.url.trim() : typeof item.src === 'string' ? item.src.trim() : '';
      if (!url) return null;

      return {
        id: item.id || item._id || `media-${index}`,
        url,
        alt: item.alt || item.title || '',
        caption: item.caption || item.description || '',
        type: item.type || 'image',
        order: Number(item.order) || index,
        isPrimary: Boolean(item.isPrimary),
        provider: item.provider || '',
        publicId: item.publicId || item.key || '',
        size: item.size || 0,
      };
    })
    .filter(Boolean);
}

export function normalizeLinks(value) {
  const items = Array.isArray(value) ? value : value ? [value] : [];

  return items
    .map((item, index) => {
      if (typeof item === 'string') {
        const url = item.trim();
        return safeLink(url) ? { id: `link-${index}`, label: '', url } : null;
      }

      if (!item || typeof item !== 'object') return null;

      const url = typeof item.url === 'string' ? item.url.trim() : '';
      if (!safeLink(url)) return null;

      return {
        id: item.id || item._id || `link-${index}`,
        label: item.label || item.title || '',
        url,
      };
    })
    .filter(Boolean);
}

function safeLink(url) {
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

export function getPrimaryMedia(media, fallbackUrl = '') {
  const items = normalizeMedia(media);
  if (!items.length) return fallbackUrl ? { url: fallbackUrl, alt: '', caption: '', isPrimary: true } : null;
  return items.find((item) => item.isPrimary) || items[0];
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function normalizeProjectRecord(record = {}) {
  const categoryName = record.categoryName || record.category || 'Embedded Systems';
  const legacyCover = record.imageUrl || record.coverImage || record.cover || '';
  const coverImage = getPrimaryMedia(record.coverImage || record.cover || record.imageUrl || record.gallery || [], legacyCover) || { url: '', alt: '', caption: '', isPrimary: true };
  const gallery = normalizeMedia(record.gallery || record.galleryImages || record.images || []);
  const primaryGallery = gallery.length ? gallery
    .sort((left, right) => left.order - right.order)
    .map((item, index) => ({ ...item, order: index, isPrimary: false })) : [];

  return {
    ...record,
    category: categoryName,
    categoryName,
    categorySlug: record.categorySlug || slugify(categoryName),
    categoryId: record.categoryId || null,
    technologies: normalizeList(record.technologies),
    protocols: normalizeList(record.protocols),
    links: normalizeLinks([
      ...(Array.isArray(record.links) ? record.links : record.links ? [record.links] : []),
      record.githubUrl ? { label: 'GitHub', url: record.githubUrl } : null,
      record.liveUrl ? { label: 'Live demo', url: record.liveUrl } : null,
      record.documentationUrl ? { label: 'Documentation', url: record.documentationUrl } : null,
      record.videoUrl ? { label: 'Video', url: record.videoUrl } : null,
    ].filter(Boolean)),
    coverImage: {
      ...coverImage,
      id: coverImage.id || 'cover-image',
      url: coverImage.url || '',
      alt: coverImage.alt || record.name || '',
      caption: coverImage.caption || '',
      isPrimary: true,
    },
    gallery: primaryGallery,
    galleryImages: primaryGallery.map((item) => item.url),
    imageUrl: coverImage.url || '',
    githubUrl: record.githubUrl || '',
    liveUrl: record.liveUrl || '',
    documentationUrl: record.documentationUrl || '',
    videoUrl: record.videoUrl || '',
    testing: record.testing || record.validation || '',
    challenges: record.challenges || '',
    results: record.results || record.outcomes || '',
    role: record.role || record.contribution || '',
  };
}

export function normalizeSkillRecord(record = {}) {
  const categoryName = record.categoryName || record.category || 'General';

  return {
    ...record,
    category: categoryName,
    categoryName,
    categorySlug: record.categorySlug || slugify(categoryName),
    categoryId: record.categoryId || null,
    description: record.description || '',
    icon: record.icon || '',
    proficiency: Number(record.proficiency) || 70,
    isActive: record.isActive !== false,
    media: normalizeMedia(record.media || record.imageUrl || []),
  };
}
