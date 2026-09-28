export const MAX_FILE_BYTES = 8 * 1024 * 1024;
export function validateArtwork(file) {
  if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return 'Choose a PNG, JPG or WebP image.';
  if (file.size > MAX_FILE_BYTES) return 'This image is too large. Choose a file under 8 MB.';
  if (!file.size) return 'This file is empty. Choose another image.';
  return null;
}
export function normalizeAngle(angle) { return ((angle % 360) + 360) % 360; }
export function viewSide(angle) { const a = normalizeAngle(angle); return a > 90 && a < 270 ? 'back' : 'front'; }
export function fitContain(width, height, maxWidth, maxHeight) {
  if (width <= 0 || height <= 0) throw new Error('Image dimensions must be positive.');
  const scale = Math.min(maxWidth / width, maxHeight / height);
  return { width: width * scale, height: height * scale };
}
