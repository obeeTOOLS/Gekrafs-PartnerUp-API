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
app.use(express.text({ type: ['text/plain'] }));

// ==========================================
// REAL-TIME USER PRESENCE & ACTIVE SESSIONS
// ==========================================
interface ActivePresenceUser {
  id: string;
  userId: string;
  namaUsaha: string;
  namaPemilik: string;
  role: 'peserta' | 'admin' | 'developer';
  activeTab: string;
  deviceType: 'mobile' | 'desktop';
  lastSeen: number;
  loginTime: number;
}

const activePresenceMap = new Map<string, ActivePresenceUser>();

function pruneInactivePresence() {
  const now = Date.now();
  // Sesi tidak aktif jika tidak ada heartbeat selama lebih dari 65 detik
  for (const [key, user] of activePresenceMap.entries()) {
    if (now - user.lastSeen > 65000) {
      activePresenceMap.delete(key);
    }
  }
}

// Heartbeat ping dari browser pengguna
app.post('/api/presence/ping', (req, res) => {
  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = {};
      }
    }
    const { id, userId, namaUsaha, namaPemilik, role, activeTab, deviceType } = payload || {};
    if (!id) {
      return res.status(400).json({ error: 'Session ID diperlukan' });
    }

    const now = Date.now();
    const existing = activePresenceMap.get(id);

    activePresenceMap.set(id, {
      id,
      userId: userId || 'anon',
      namaUsaha: namaUsaha || (role === 'developer' ? 'Lead Developer' : role === 'admin' ? 'Tim Kurator' : 'Peserta UMKM'),
      namaPemilik: namaPemilik || '',
      role: role || 'peserta',
      activeTab: activeTab || 'pendaftaran',
      deviceType: deviceType || 'mobile',
      lastSeen: now,
      loginTime: existing ? existing.loginTime : now
    });

    pruneInactivePresence();

    const users = Array.from(activePresenceMap.values());
    res.json({
      success: true,
      totalOnline: users.length,
      counts: {
        total: users.length,
        peserta: users.filter(u => u.role === 'peserta').length,
        admin: users.filter(u => u.role === 'admin').length,
        developer: users.filter(u => u.role === 'developer').length,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Gagal merekam presence' });
  }
});

// Sinyal leave saat logout atau browser ditutup
app.post('/api/presence/leave', (req, res) => {
  try {
    let id: string | undefined;
    if (typeof req.body === 'object' && req.body !== null) {
      id = req.body.id;
    } else if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        id = parsed.id;
      } catch {
        id = req.body;
      }
    }
    if (id && activePresenceMap.has(id)) {
      activePresenceMap.delete(id);
    }
    res.json({ success: true, totalOnline: activePresenceMap.size });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Gagal menghapus presence' });
  }
});

// Mengambil statistik dan daftar user yang sedang login
app.get('/api/presence/active', (req, res) => {
  try {
    pruneInactivePresence();
    const users = Array.from(activePresenceMap.values()).sort((a, b) => b.lastSeen - a.lastSeen);
    res.json({
      totalOnline: users.length,
      counts: {
        total: users.length,
        peserta: users.filter(u => u.role === 'peserta').length,
        admin: users.filter(u => u.role === 'admin').length,
        developer: users.filter(u => u.role === 'developer').length,
      },
      users
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Gagal mengambil data presence' });
  }
});

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
      const objText = (task.objective || '').trim();
      const hasNumbers = /[0-9]+/.test(objText) || /omzet|rp|jt|juta|persen|%|pcs|pack|botol/i.test(objText);
      const hasMatrix = Boolean(task.matriks && Object.keys(task.matriks).length > 0);
      const hasBreakthrough = Boolean(task.matriks?.breakthrough?.recent || task.matriks?.breakthrough?.midTerm);
      
      let calculatedScore = 70;
      if (hasVision) calculatedScore += 7;
      if (hasMission) calculatedScore += 7;
      if (hasNumbers) calculatedScore += 5;
      if (hasMatrix) calculatedScore += 4;
      if (hasBreakthrough) calculatedScore += 4;
      calculatedScore = Math.min(Math.max(calculatedScore, 68), 95);

      const isApproved = calculatedScore >= 75;
      const strengths = [
        hasVision ? 'Visi usaha terartikulasi dengan orientasi masa depan yang jelas' : 'Produk memiliki keterkaitan kuat dengan potensi lokal Kota Batu',
        hasBreakthrough ? 'Inisiatif breakthrough inovasi produk terencana dengan matang' : 'Terdapat pemetaan aksi bertahap pada matriks inovasi'
      ];
      const improvements = [
        hasNumbers ? 'Pecah target 90 hari ke dalam milestone mingguan agar beban kerja tim merata' : 'Pertajam indikator capaian terukur (omzet/kuantitas target) pada objective 90 hari',
        'Pastikan kepatuhan legalitas (NIB/Halal/PIRT) dan pencatatan keuangan terpisah dari kas pribadi'
      ];
      const draftNotes = `Pondasi perencanaan strategis untuk ${task.namaUsaha || 'usaha ini'} sudah memiliki arah yang baik (${calculatedScore}/100). Fokuskan eksekusi pada kuartal pertama dan perkuat jejaring kolaborasi ekosistem kreatif Kota Batu.`;

      const waDraftMessage = `Halo Kak *${task.namaPemilik || 'Founder'}* (*${task.namaUsaha}*)! 👋✨\n\n` +
        `Lembar Aksi & Peta Jalan Bisnis Anda di *GEKRAFS PartnerUp 2026 Kota Batu* telah selesai direview oleh tim kurator:\n\n` +
        `🏆 *Hasil Kurasi:* ${isApproved ? '✅ Disetujui (Lulus Kurasi)' : '⚠️ Perlu Revisi Ringan'}\n` +
        `⭐ *Skor Penilaian:* *${calculatedScore}/100*\n\n` +
        `💡 *Kekuatan Utama Usaha Kakak:*\n${strengths.map(s => `• ${s}`).join('\n')}\n\n` +
        `🎯 *Saran Aksi Konkret (90 Hari Kedepan):*\n${improvements.map(i => `• ${i}`).join('\n')}\n\n` +
        `📝 *Catatan Mentor:*\n"${draftNotes}"\n\n` +
        `Tetap semangat mengakselerasi pertumbuhan bisnis bersama ekosistem ekonomi kreatif Kota Batu! 🚀\n\n` +
        `Salam hormat,\n*Tim Kurator GEKRAFS PartnerUp 2026 Kota Batu*`;

      return res.json({
        recommendedScore: calculatedScore,
        recommendedStatus: isApproved ? 'reviewed' : 'revision',
        summary: `Analisis roadmap untuk ${task.namaUsaha || 'peserta'}: pondasi visi dan misi ${hasVision && hasMission ? 'sudah terstruktur dengan baik' : 'masih membutuhkan penajaman'}.`,
        strengths,
        improvements,
        smartEvaluation: {
          isSpecific: objText.length > 20,
          isMeasurable: hasNumbers,
          isActionable: objText.length > 30,
          notes: hasNumbers ? 'Target 90 hari sudah memiliki indikator angka terukur.' : 'Target masih perlu ditambahkan angka capaian kuantitatif.'
        },
        matrixAnalysis: {
          problemSolvingFeedback: 'Fokus penanganan kendala dasar operasional harian sudah teridentifikasi.',
          incrementalFeedback: 'Rencana peningkatan bertahap selaras dengan kapasitas usaha.',
          breakthroughFeedback: hasBreakthrough ? 'Inovasi terobosan potensial membuka ceruk pasar baru.' : 'Perlu dipikirkan terobosan produk unik sebagai pembeda.'
        },
        draftMentorNotes: draftNotes,
        waDraftMessage
      });
    }

    const prompt = `Anda adalah Kurator Senior dan Mentor Bisnis UMKM untuk program Gekrafs PartnerUp Kota Batu (Gerakan Ekonomi Kreatif Nasional).
Tugas Anda adalah menganalisis lembar rencana strategis (Strategic Roadmap Canvas) peserta UMKM berikut secara objektif, mendalam, kritis, dan berakar pada ekosistem lokal Kota Wisata Batu:

Nama Usaha: ${task.namaUsaha || '-'}
Nama Pemilik: ${task.namaPemilik || '-'}
Subsektor Kreatif: ${task.subsektor || '-'}
Visi Jangka Panjang: ${task.visi || '-'}
Misi Usaha: ${task.misi || '-'}
Target Sasaran (Goal): ${task.goal || '-'}
Objective 90 Hari: ${task.objective || '-'}
Nilai Inti Usaha (Core Values): ${task.nilaiUsaha || '-'}
Keahlian Inti Organisasi: ${task.keahlianOrganisasi || '-'}
Matriks Inovasi Horizon 3x3 (Problem Solving, Incremental, Breakthrough):
${JSON.stringify(task.matriks || {}, null, 2)}

Berikan analisis kurasi profesional dalam format JSON valid (wajib JSON murni tanpa markdown fence/backticks) dengan struktur berikut:
{
  "recommendedScore": <angka bulat antara 68 sampai 96>,
  "recommendedStatus": "<'reviewed' jika skor >= 75, atau 'revision' jika ada kelemahan fatal>",
  "summary": "<ringkasan tajam 1-2 kalimat tentang potensi dan kematangan strategi usaha>",
  "strengths": ["<poin kekuatan strategis 1 yang spesifik terhadap produk/layanan usaha ini>", "<poin kekuatan strategis 2>"],
  "improvements": ["<area perbaikan konkret 1 yang harus dieksekusi dalam 90 hari ke depan>", "<area perbaikan konkret 2>"],
  "smartEvaluation": {
    "isSpecific": <true/false>,
    "isMeasurable": <true/false>,
    "isActionable": <true/false>,
    "notes": "<analisis singkat apakah target objective 90 hari sudah SMART atau masih abstrak>"
  },
  "matrixAnalysis": {
    "problemSolvingFeedback": "<ulasan solusi kendala harian>",
    "incrementalFeedback": "<ulasan peningkatan bertahap>",
    "breakthroughFeedback": "<ulasan lompatan inovasi terobosan>"
  },
  "draftMentorNotes": "<paragraf ulasan mentor yang ramah, berbobot, dan solutif>",
  "waDraftMessage": "<teks lengkap pesan WhatsApp resmi yang ramah, sopan, memuat nama pemilik, nama brand, status, nilai, poin kekuatan, saran aksi, serta catatan kurator, diformat rapi dengan emoji>"
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
