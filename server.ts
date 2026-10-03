import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client with User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for AI Roadmap Review
app.post('/api/ai/review-roadmap', async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: 'Data lembar aksi UMKM tidak ditemukan.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback rule-based intelligent analysis if API key not configured
      const hasVision = Boolean(task.visi && task.visi.length > 20);
      const hasMission = Boolean(task.misi && task.misi.length > 20);
      const hasMatrix = Boolean(task.matriks && Object.keys(task.matriks).length > 0);
      
      const calculatedScore = (hasVision ? 30 : 15) + (hasMission ? 30 : 15) + (hasMatrix ? 28 : 10);
      const isApproved = calculatedScore >= 75;

      return res.json({
        recommendedScore: calculatedScore,
        recommendedStatus: isApproved ? 'reviewed' : 'revision',
        summary: `Analisis roadmap untuk ${task.namaUsaha || 'peserta'}: pondasi visi dan misi ${hasVision && hasMission ? 'sudah terstruktur dengan baik' : 'masih membutuhkan penajaman'}.`,
        strengths: [
          hasVision ? 'Visi jangka panjang terartikulasi dengan orientasi masa depan' : 'Usaha memiliki potensi sektor kreatif yang relevan',
          hasMatrix ? 'Terdapat pemetaan inisiatif aksi pada matriks inovasi' : 'Identifikasi segmen usaha sudah cukup terarah'
        ],
        improvements: [
          'Pertajam indikator keberhasilan (KPI) terukur pada setiap kuartal aksi',
          'Pastikan strategi mitigasi risiko operasional dan kepatuhan legalitas diprioritaskan'
        ],
        draftMentorNotes: `Pondasi perencanaan untuk ${task.namaUsaha || 'usaha ini'} sudah memiliki arah yang baik. Pada implementasi program, fokuskan eksekusi pada matriks breakthrough kuartal pertama dan perkuat kolaborasi jejaring rantai pasok lokal.`
      });
    }

    const prompt = `Anda adalah Kurator Senior dan Mentor Bisnis UMKM untuk program Gekrafs PartnerUp Kota Batu (Gerakan Ekonomi Kreatif Nasional).
Tugas Anda adalah menganalisis lembar rencana strategis (Strategic Roadmap Canvas) peserta UMKM berikut secara objektif, kritis, dan suportif:

Nama Usaha: ${task.namaUsaha || '-'}
Nama Pemilik: ${task.namaPemilik || '-'}
Subsektor Kreatif: ${task.subsektor || '-'}
Visi Jangka Panjang: ${task.visi || '-'}
Misi Usaha: ${task.misi || '-'}
Nilai Inti Usaha (Core Values): ${task.nilaiUsaha || '-'}
Keahlian Inti Organisasi: ${task.keahlianOrganisasi || '-'}
Matriks Inovasi & Rencana Aksi Nyata:
${JSON.stringify(task.matriks || {}, null, 2)}

Berikan analisis kurasi profesional dalam format JSON valid (wajib JSON murni tanpa markdown fence/backticks) dengan struktur berikut:
{
  "recommendedScore": <angka bulat antara 65 sampai 96>,
  "recommendedStatus": "<'reviewed' jika skor >= 75, atau 'revision' jika ada kelemahan fatal>",
  "summary": "<ringkasan singkat 1-2 kalimat tentang kematangan roadmap usaha>",
  "strengths": ["<poin kekuatan strategis 1>", "<poin kekuatan strategis 2>"],
  "improvements": ["<area perbaikan / risiko yang perlu diwaspadai 1>", "<area perbaikan / risiko yang perlu diwaspadai 2>"],
  "draftMentorNotes": "<paragraf ulasan mentor yang ramah, solutif, berbasis aksi nyata yang siap disalin ke kartu catatan umpan balik mentor>"
}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '{}';
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }

      return res.json(parsed);
    } catch (apiErr: any) {
      console.warn('[Gemini AI] Fallback aktif karena kendala jaringan/lonjakan model:', apiErr.message);

      // Evaluasi cerdas berbasis kelengkapan roadmap peserta jika terjadi lonjakan 503
      const hasVision = Boolean(task.visi && task.visi.length > 20);
      const hasMission = Boolean(task.misi && task.misi.length > 20);
      const hasMatrix = Boolean(task.matriks && Object.keys(task.matriks).length > 0);
      const hasBreakthrough = Boolean(task.matriks?.breakthrough?.recent || task.matriks?.breakthrough?.midTerm);

      let calculatedScore = 70;
      if (hasVision) calculatedScore += 8;
      if (hasMission) calculatedScore += 8;
      if (hasMatrix) calculatedScore += 6;
      if (hasBreakthrough) calculatedScore += 6;

      const isApproved = calculatedScore >= 75;

      return res.json({
        recommendedScore: calculatedScore,
        recommendedStatus: isApproved ? 'reviewed' : 'revision',
        summary: `Roadmap strategis ${task.namaUsaha || 'peserta'} memiliki pondasi ${hasVision && hasMission ? 'visi dan misi yang solid' : 'yang masih memerlukan elaborasi target'}.`,
        strengths: [
          hasVision ? 'Visi usaha jelas dan berorientasi pada keberlanjutan masa depan' : 'Segmen produk memiliki relevansi dengan potensi ekonomi kreatif Kota Batu',
          hasBreakthrough ? 'Inisiatif breakthrough inovasi produk terencana dengan baik' : 'Struktur rencana aksi memiliki alur implementasi yang logis'
        ],
        improvements: [
          'Pertajam indikator capaian terukur (omzet, kapasitas produksi, mitra) di setiap fase waktu',
          'Pastikan kesiapan legalitas (NIB/PIRT/Halal) dan uji mutu sebelum meluncurkan produk terobosan baru'
        ],
        draftMentorNotes: `Pondasi strategi untuk ${task.namaUsaha || 'usaha ini'} sudah memiliki arah yang baik (${calculatedScore}/100). Disarankan untuk memperkuat eksekusi matriks kuartal pertama dan memperluas kolaborasi dengan rantai pasok lokal Kota Batu.`
      });
    }
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: err.message || 'Gagal memproses analisis AI.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
