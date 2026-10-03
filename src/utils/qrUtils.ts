import QRCode from 'qrcode';

/**
 * Utility untuk menghasilkan SVG & Canvas QR Code bergaya poster resmi PartnerUp.
 */

export interface BrandedQrOptions {
  url: string;
  topik: string;
  nomorSesi?: string | number;
  tanggal?: string;
  waktu?: string;
  pemateri?: string;
  lokasi?: string;
}

/**
 * Helper pembagi teks menjadi beberapa baris sesuai lebar maksimum canvas
 */
function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Helper menggambar persegi dengan sudut membulat (kompatibel semua browser)
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Ambil singkatan kata tema untuk lencana di tengah QR
 */
function extractCenterBadgeTitle(topik: string, nomorSesi?: string | number): { line1: string; line2: string } {
  const cleanTopik = (topik || '').trim();
  const sesiText = nomorSesi ? `SESI ${nomorSesi}` : 'PELATIHAN';

  if (!cleanTopik) {
    return { line1: sesiText, line2: 'EKRAF' };
  }

  // Cari kata kunci utama
  const words = cleanTopik.split(/[\s&,-]+/).filter((w) => w.length > 2);
  if (words.length >= 2) {
    return {
      line1: words[0].toUpperCase().slice(0, 10),
      line2: words[1].toUpperCase().slice(0, 10)
    };
  }

  return {
    line1: sesiText,
    line2: (words[0] || 'EKRAF').toUpperCase().slice(0, 10)
  };
}

/**
 * Menghasilkan Data URL PNG bergaya poster resmi dengan:
 * 1. Di tengah QR terdapat lencana / tema pelatihan
 * 2. Di bawah QR terdapat tulisan "PartnerUp" yang jelas dan menonjol
 * 3. Informasi sesi pelatihan, tanggal, dan panduan scan
 */
export async function generateBrandedQrPng(options: BrandedQrOptions): Promise<string> {
  const { url, topik, nomorSesi, tanggal, waktu, pemateri } = options;

  // 1. Buat offscreen canvas untuk menampung QR Code mentah dengan error correction 'H'
  const qrCanvas = document.createElement('canvas');
  const qrSize = 540;
  await QRCode.toCanvas(qrCanvas, url, {
    width: qrSize,
    margin: 1,
    errorCorrectionLevel: 'H', // Error correction 30% agar aman ditimpa di bagian tengah
    color: {
      dark: '#001c3c',
      light: '#ffffff'
    }
  });

  // 2. Buat canvas utama dengan resolusi tinggi (900 x 1280 px) untuk hasil cetak tajam
  const canvas = document.createElement('canvas');
  const width = 900;
  const height = 1280;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return qrCanvas.toDataURL('image/png');

  // Background utama putih bersih
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Border kartu luar elegan
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // Header Banner Deep Navy (#001c3c)
  ctx.fillStyle = '#001c3c';
  ctx.fillRect(8, 8, width - 16, 160);

  // Garis aksen emas di bawah header
  ctx.fillStyle = '#ffc72c';
  ctx.fillRect(8, 168, width - 16, 8);

  // Teks Brand Header
  ctx.fillStyle = '#ffc72c';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GEKRAFS KOTA BATU', width / 2, 58);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 34px system-ui, -apple-system, sans-serif';
  ctx.fillText('PRESENSI KEHADIRAN PELATIHAN', width / 2, 108);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 17px system-ui, -apple-system, sans-serif';
  ctx.fillText('Sistem Presensi Digital & Inkubasi Ekraf Resmi', width / 2, 144);

  // Area Info Sesi / Tema
  let currentY = 220;

  // Badge Sesi Pelatihan
  const sesiLabel = nomorSesi ? `SESI ${nomorSesi}` : 'PELATIHAN RESMI';
  ctx.fillStyle = '#eaf2fb';
  const badgeWidth = 240;
  const badgeHeight = 38;
  const badgeX = (width - badgeWidth) / 2;
  drawRoundedRect(ctx, badgeX, currentY, badgeWidth, badgeHeight, 19);
  ctx.fill();

  ctx.fillStyle = '#004c80';
  ctx.font = '800 16px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(sesiLabel, width / 2, currentY + 25);

  currentY += 75;

  // Judul Tema Pelatihan (Wrap teks jika panjang)
  ctx.fillStyle = '#001c3c';
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
  const maxTextWidth = width - 120;
  const lines = wrapCanvasText(ctx, topik || 'Materi Pelatihan Inkubasi Ekraf', maxTextWidth);
  lines.forEach((line) => {
    ctx.fillText(line, width / 2, currentY);
    currentY += 40;
  });

  // Waktu / Tanggal & Pemateri jika ada
  if (tanggal || pemateri) {
    ctx.fillStyle = '#64748b';
    ctx.font = '600 18px system-ui, -apple-system, sans-serif';
    const subParts: string[] = [];
    if (tanggal) subParts.push(tanggal);
    if (waktu) subParts.push(waktu);
    if (pemateri) subParts.push(`Pemateri: ${pemateri}`);
    ctx.fillText(subParts.join('  •  '), width / 2, currentY);
    currentY += 35;
  }

  // Posisi QR Code di tengah canvas
  const qrX = (width - qrSize) / 2;
  const qrY = currentY + 15;

  // Background frame putih untuk QR dengan shadow halus
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 28, 60, 0.12)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  drawRoundedRect(ctx, qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 24);
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Gambar QR Code
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // ==========================================
  // DITENGAH QR: Lencana Tema Pelatihan
  // ==========================================
  const centerSize = 148;
  const centerX = width / 2;
  const centerY = qrY + qrSize / 2;

  // Halo / Border putih tebal di sekeliling badge agar modul QR di sekitarnya tetap kontras & terbaca
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, centerX - centerSize / 2 - 10, centerY - centerSize / 2 - 10, centerSize + 20, centerSize + 20, 28);
  ctx.fill();

  // Badge background navy gelap (#001c3c)
  ctx.fillStyle = '#001c3c';
  drawRoundedRect(ctx, centerX - centerSize / 2, centerY - centerSize / 2, centerSize, centerSize, 22);
  ctx.fill();

  // Aksen garis tepi emas
  ctx.strokeStyle = '#ffc72c';
  ctx.lineWidth = 3.5;
  drawRoundedRect(ctx, centerX - centerSize / 2 + 4, centerY - centerSize / 2 + 4, centerSize - 8, centerSize - 8, 18);
  ctx.stroke();

  // Teks di tengah badge QR: Tema Pelatihan
  const badgeTitle = extractCenterBadgeTitle(topik, nomorSesi);

  ctx.fillStyle = '#ffc72c';
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PELATIHAN', centerX, centerY - 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 20px system-ui, -apple-system, sans-serif';
  ctx.fillText(badgeTitle.line1, centerX, centerY - 8);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 20px system-ui, -apple-system, sans-serif';
  ctx.fillText(badgeTitle.line2, centerX, centerY + 18);

  ctx.fillStyle = '#ffc72c';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('BATU 2026', centerX, centerY + 46);

  // ==========================================
  // DIBAWAH QR: Tulisan "PartnerUp"
  // ==========================================
  const afterQrY = qrY + qrSize + 55;

  // Tulisan utama PartnerUp yang menonjol dan elegan
  ctx.fillStyle = '#001c3c';
  ctx.font = '900 52px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PartnerUp', width / 2, afterQrY);

  // Garis aksen emas di bawah tulisan PartnerUp
  ctx.fillStyle = '#ffc72c';
  ctx.fillRect(width / 2 - 50, afterQrY + 12, 100, 5);

  // Teks instruksi scan untuk peserta
  ctx.fillStyle = '#475569';
  ctx.font = '600 20px system-ui, -apple-system, sans-serif';
  ctx.fillText('Arahkan kamera HP Anda ke QR Code untuk mencatat kehadiran', width / 2, afterQrY + 48);

  // Footer URL kecil di bagian paling bawah
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px monospace';
  ctx.fillText(url, width / 2, height - 30);

  return canvas.toDataURL('image/png');
}

/**
 * Download langsung file PNG poster QR Code
 */
export async function downloadBrandedQrPngFile(options: BrandedQrOptions, customFilename?: string): Promise<void> {
  const dataUrl = await generateBrandedQrPng(options);
  const cleanTopik = (options.topik || 'Sesi')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 30);
  const filename = customFilename || `QR_Presensi_${options.nomorSesi ? `Sesi_${options.nomorSesi}_` : ''}${cleanTopik}.png`;

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Sederhana dan mandiri: generate QR Code SVG string atau data URL
export function generateQrSvgUrl(text: string, size: number = 200): string {
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
