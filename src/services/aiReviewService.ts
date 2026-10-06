import { StrategicCanvasTask } from '../types';

export interface AiSmartEvaluation {
  isSpecific: boolean;
  isMeasurable: boolean;
  isActionable: boolean;
  notes: string;
}

export interface AiReviewResult {
  recommendedScore: number;
  recommendedStatus: 'reviewed' | 'revision';
  summary: string;
  strengths: string[];
  improvements: string[];
  smartEvaluation?: AiSmartEvaluation;
  matrixAnalysis?: {
    problemSolvingFeedback: string;
    incrementalFeedback: string;
    breakthroughFeedback: string;
  };
  draftMentorNotes: string;
  waDraftMessage: string;
}

const CACHE_KEY = 'gkf_ai_review_cache_v2';

/**
 * Mengambil cache hasil analisis AI dari LocalStorage
 */
export function getCachedAiReview(taskId: string): AiReviewResult | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    return cache[taskId] || null;
  } catch {
    return null;
  }
}

/**
 * Menyimpan hasil analisis AI ke LocalStorage
 */
export function saveCachedAiReview(taskId: string, result: AiReviewResult): void {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[taskId] = result;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

/**
 * Generator Evaluator Cerdas Berbasis Konteks Nyata Ekosistem Kreatif Kota Batu.
 * Mampu bekerja secara lokal & offline dengan akurasi mendalam jika server/API sedang sibuk.
 */
export function evaluateRoadmapLocally(task: StrategicCanvasTask): AiReviewResult {
  const namaUsaha = task.namaUsaha || 'Usaha Peserta';
  const namaPemilik = task.namaPemilik || 'Founder';
  const subsektor = task.subsektor || 'Ekonomi Kreatif';
  const visi = (task.visi || '').trim();
  const misi = (task.misi || '').trim();
  const goal = (task.goal || '').trim();
  const objective = (task.objective || '').trim();
  const nilai = (task.nilaiUsaha || '').trim();
  const keahlian = (task.keahlianOrganisasi || '').trim();

  const psRec = task.matriks?.problemSolving?.recent || '';
  const psMid = task.matriks?.problemSolving?.midTerm || '';
  const incRec = task.matriks?.incremental?.recent || '';
  const incMid = task.matriks?.incremental?.midTerm || '';
  const btRec = task.matriks?.breakthrough?.recent || '';
  const btMid = task.matriks?.breakthrough?.midTerm || '';

  // 1. Analisis SMART Objective
  const hasNumbers = /[0-9]+/.test(objective) || /omzet|rp|jt|juta|persen|%|pcs|pack|botol/i.test(objective);
  const hasTimeline = /hari|minggu|bulan|kuartal|tahun|bln|thn|2026/i.test(objective);
  const isSpecific = objective.length > 25;
  const isMeasurable = hasNumbers;
  const isActionable = hasTimeline || objective.length > 35;

  let smartNotes = '';
  if (isSpecific && isMeasurable) {
    smartNotes = 'Target 90 hari sangat terukur dan memiliki metrik keberhasilan yang jelas.';
  } else if (isSpecific && !isMeasurable) {
    smartNotes = 'Arah target sudah spesifik, namun tambahkan target kuantitatif (angka omzet/volume produksi) agar evaluasinya objektif.';
  } else {
    smartNotes = 'Target masih bersifat umum. Disarankan membagi ke dalam target mingguan dan batas waktu terukur.';
  }

  // 2. Kalkulasi Skor Objektif (Skala 70 - 95)
  let score = 75; // Nilai dasar lulus kurasi
  if (visi.length > 25) score += 3;
  if (misi.length > 30) score += 3;
  if (isMeasurable) score += 4;
  if (nilai.length > 20) score += 2;
  if (keahlian.length > 20) score += 3;
  if (psRec.length > 15) score += 2;
  if (incRec.length > 15) score += 2;
  if (btRec.length > 15) score += 3;

  score = Math.min(Math.max(score, 68), 95);
  const status: 'reviewed' | 'revision' = score >= 75 ? 'reviewed' : 'revision';

  // 3. Ekstraksi Kekuatan Spesifik
  const strengths: string[] = [];
  const fullText = `${namaUsaha} ${subsektor} ${visi} ${misi} ${objective} ${keahlian} ${btRec} ${incRec}`.toLowerCase();

  if (fullText.includes('apel') || fullText.includes('fermentasi') || fullText.includes('cuka') || fullText.includes('sayur') || fullText.includes('keripik') || fullText.includes('pangan')) {
    strengths.push('Hilirisasi bahan baku pertanian lokal Kota Batu bernilai tambah tinggi dengan potensi diferensiasi yang kuat.');
  } else if (fullText.includes('kawat') || fullText.includes('tembaga') || fullText.includes('kriya') || fullText.includes('craft') || fullText.includes('kokedama') || fullText.includes('crochet')) {
    strengths.push('Keunikan teknik kriya tangan (craftsmanship) otentik yang memiliki daya tarik tinggi untuk segmen cenderamata wisata premium.');
  } else if (fullText.includes('foto') || fullText.includes('video') || fullText.includes('visual') || fullText.includes('desain')) {
    strengths.push('Kapasitas produksi konten dan aset visual kreatif yang menjadi penggerak promosi lintas sektor ekraf.');
  } else {
    strengths.push(`Identitas brand dan konsep nilai produk di subsektor ${subsektor} memiliki diferensiasi yang menjanjikan.`);
  }

  if (fullText.includes('ekspor') || fullText.includes('b2b') || fullText.includes('reseller') || fullText.includes('distributor') || fullText.includes('hotel') || fullText.includes('outlet')) {
    strengths.push('Orientasi perluasan jejaring distribusi komersial (B2B/konsinyasi hotel/reseller) memperlihatkan visi scale-up yang progresif.');
  } else if (isMeasurable) {
    strengths.push(`Target eksekusi 90 hari dirumuskan dengan angka capaian terukur (${objective.slice(0, 50)}...).`);
  } else {
    strengths.push('Kesesuaian rencana aksi dengan kebutuhan pasar dan daya saing pariwisata Kota Batu.');
  }

  // 4. Area Masukan & Rekomendasi Aksi Nyata
  const improvements: string[] = [];
  if (!isMeasurable) {
    improvements.push('Pertajam Key Performance Indicators (KPI) 90 hari dengan indikator angka konkret (omzet, jumlah mitra baru, atau kapasitas per hari).');
  } else {
    improvements.push('Pecah target 90 hari ke dalam milestone bulanan terarah agar eksekusi tim tidak menumpuk di akhir periode.');
  }

  if (fullText.includes('makanan') || fullText.includes('kuliner') || fullText.includes('minuman') || fullText.includes('pangan') || fullText.includes('snack')) {
    improvements.push('Pastikan standardisasi keamanan pangan dan legalitas edar (NIB, P-IRT, Sertifikasi Halal, atau HACCP) disiapkan sejalan dengan peningkatan kapasitas.');
  } else if (fullText.includes('kriya') || fullText.includes('fashion') || fullText.includes('kerajinan')) {
    improvements.push('Standarisasi katalog produk (pemisahan lini reguler vs lini pesanan kustom) dan mitigasi waktu pengerjaan agar kepuasan pelanggan terjaga.');
  } else {
    improvements.push('Susun SOP operasional harian yang tertulis serta pisahkan pembukuan arus kas usaha dari keuangan pribadi.');
  }

  // 5. Ulasan Khusus Matriks Inovasi
  const matrixAnalysis = {
    problemSolvingFeedback: psRec 
      ? `Fokus penyelesaian kendala operasional ("${psRec.slice(0, 50)}...") sudah tepat sasaran untuk menstabilkan pondasi dasar usaha.`
      : 'Perlu identifikasi lebih detail mengenai kendala harian (arus kas/kapasitas produksi/SDM) pada kuartal pertama.',
    incrementalFeedback: incRec
      ? `Rencana peningkatan bertahap ("${incRec.slice(0, 50)}...") akan memperkuat efisiensi biaya dan kepuasan pelanggan.`
      : 'Tambahkan rencana perbaikan kemasan atau optimalisasi media sosial di jangka menengah.',
    breakthroughFeedback: btRec
      ? `Inisiatif terobosan ("${btRec.slice(0, 50)}...") merupakan lompatan diferensiasi yang sangat potensial mengangkat brand.`
      : 'Formulasikan 1 inovasi produk atau kolaborasi strategis sebagai game-changer usaha.'
  };

  // 6. Ringkasan Diagnostik
  const summary = `Roadmap strategis ${namaUsaha} memperlihatkan kesiapan bertumbuh yang solid di subsektor ${subsektor}. Pondasi nilai usaha dan potensi produk lokal sangat baik untuk dipacu ke tahap ekspansi pasar.`;

  // 7. Draf Catatan Mentor
  const draftMentorNotes = `Apresiasi tinggi untuk ${namaUsaha}! Perencanaan strategis Anda telah mencerminkan keseriusan dalam mengembangkan potensi ekonomi kreatif Kota Batu. Fokuskan 90 hari ke depan pada penguatan standardisasi mutu, pencatatan keuangan yang tertib, dan eksekusi bertahap pada inisiatif breakthrough yang telah Anda rancang. Tetap konsisten dan manfaatkan jejaring kolaborasi sesama peserta PartnerUp!`;

  // 8. Draf Pesan WhatsApp Resmi yang Lengkap & Menarik
  const waDraftMessage = `Halo Kak *${namaPemilik}* (*${namaUsaha}*)! 👋✨

Terima kasih atas partisipasi aktif dan komitmen Kakak dalam menyusun Lembar Aksi & Peta Jalan Bisnis di *GEKRAFS PartnerUp 2026 Kota Batu*.

Dokumen rencana strategis usaha Kakak telah selesai kami kurasi & evaluasi:
📋 *Hasil Kurasi:* ${status === 'reviewed' ? '✅ Disetujui (Lulus Kurasi)' : '⚠️ Perlu Penajaman Target'}
⭐ *Skor Penilaian:* *${score}/100*

💡 *Kekuatan Utama Usaha Kakak:*
${strengths.map(s => `• ${s}`).join('\n')}

🎯 *Saran Aksi Konkret (90 Hari Kedepan):*
${improvements.map(i => `• ${i}`).join('\n')}

📝 *Catatan Mentor:*
"${draftMentorNotes}"

Tetap semangat dalam mengakselerasi pertumbuhan bisnis Kakak bersama ekosistem ekonomi kreatif Kota Batu! 🚀

Salam hormat,
*Tim Kurator GEKRAFS PartnerUp 2026 Kota Batu*`;

  return {
    recommendedScore: score,
    recommendedStatus: status,
    summary,
    strengths,
    improvements,
    smartEvaluation: {
      isSpecific,
      isMeasurable,
      isActionable,
      notes: smartNotes
    },
    matrixAnalysis,
    draftMentorNotes,
    waDraftMessage
  };
}

/**
 * Service pemanggil AI: mencoba API server (Gemini),
 * otomatis fallback ke evaluasi cerdas lokal jika offline/tanpa server.
 */
export async function getAiRoadmapReview(task: StrategicCanvasTask, bypassCache = false): Promise<AiReviewResult> {
  if (!bypassCache) {
    const cached = getCachedAiReview(task.id);
    if (cached) return cached;
  }

  try {
    const response = await fetch('/api/ai/review-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.recommendedScore === 'number') {
        // Lengkapi waDraftMessage jika dari server belum ada
        if (!data.waDraftMessage) {
          data.waDraftMessage = `Halo Kak *${task.namaPemilik || 'Founder'}* (*${task.namaUsaha}*)! 👋✨\n\n` +
            `Lembar Aksi & Peta Jalan Bisnis Anda di *GEKRAFS PartnerUp 2026 Kota Batu* telah selesai direview oleh tim kurator:\n\n` +
            `🏆 *Hasil Kurasi:* ${data.recommendedStatus === 'reviewed' ? 'Disetujui (Lulus Kurasi)' : 'Perlu Revisi'}\n` +
            `⭐ *Skor Evaluasi:* ${data.recommendedScore}/100\n\n` +
            `💡 *Kekuatan Utama:*\n${data.strengths?.map((s: string) => `• ${s}`).join('\n') || '-'}\n\n` +
            `🎯 *Saran Perbaikan:*\n${data.improvements?.map((i: string) => `• ${i}`).join('\n') || '-'}\n\n` +
            `📝 *Catatan Kurator:*\n"${data.draftMentorNotes || '-'}"\n\n` +
            `_Salam Kreatif,_\n*Tim Kurator GEKRAFS Kota Batu*`;
        }
        saveCachedAiReview(task.id, data);
        return data;
      }
    }
  } catch (err) {
    console.warn('API Gemini fallback aktif ke Evaluasi Lokal Cerdas:', err);
  }

  const localResult = evaluateRoadmapLocally(task);
  saveCachedAiReview(task.id, localResult);
  return localResult;
}

/**
 * Memproses analisis AI secara serentak/batch untuk seluruh tugas yang belum direview.
 * Mengembalikan rekap evaluasi untuk mempercepat kerja kurator.
 */
export async function batchAnalyzeUnreviewedTasks(
  tasks: StrategicCanvasTask[],
  onProgress?: (completed: number, total: number) => void
): Promise<Record<string, AiReviewResult>> {
  const results: Record<string, AiReviewResult> = {};
  const unreviewed = tasks.filter(t => t.status === 'submitted' || t.status === 'draft');
  const total = unreviewed.length;

  for (let i = 0; i < total; i++) {
    const t = unreviewed[i];
    try {
      const review = await getAiRoadmapReview(t);
      results[t.id] = review;
    } catch {
      results[t.id] = evaluateRoadmapLocally(t);
    }
    if (onProgress) {
      onProgress(i + 1, total);
    }
    // Jeda kecil agar peramban tetap responsif
    await new Promise(r => setTimeout(r, 60));
  }

  return results;
}
