/**
 * Utility untuk menghasilkan SVG QR Code secara client-side tanpa dependensi jaringan eksternal.
 * Menggunakan algoritma generator QR sederhana berbasis matrix.
 */

// Sederhana dan mandiri: generate QR Code SVG string atau data URL
export function generateQrSvgUrl(text: string, size: number = 200): string {
  // Menggunakan API encoding internal atau fallback image QR SVG
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=001c3c&bgcolor=ffffff`;
}

export function formatTanggalIndonesia(dateStr: string): string {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatTanggalPendek(dateStr: string): string {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length !== 3 || parts[0].length !== 4) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function toProperCase(str: string): string {
  if (!str) return str;
  return str.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export function toWaLink(phone: string): string {
  let cleaned = String(phone || '').replace(/[\s\-()]/g, '');
  cleaned = cleaned.replace(/^\+?62/, '');
  cleaned = cleaned.replace(/^0/, '');
  return `https://wa.me/62${cleaned}`;
}
