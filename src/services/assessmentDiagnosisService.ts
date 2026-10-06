import { AsesmenItem } from '../types';

export type MaturityStage = 
  | 'Perintisan & Fondasi' 
  | 'Bertumbuh & Stabilisasi' 
  | 'Siap Skala (Scale-Up)' 
  | 'Tangguh & Potensi Mentor';

export interface AssessmentDiagnosisResult {
  stage: MaturityStage;
  stageColor: 'amber' | 'blue' | 'purple' | 'emerald';
  stageBadgeBg: string;
  stageBadgeText: string;
  ringkasanDiagnosis: string;
  pilarTerkuat: {
    nama: string;
    skor: number;
    keterangan: string;
  };
  pilarKritis: {
    nama: string;
    skor: number;
    keterangan: string;
  };
  rekomendasiAksi: string[];
  potensiPeerMentor: string | null;
  waFeedbackDraft: string;
}

/**
 * Menganalisis hasil asesmen mandiri secara otomatis berbasis skor 8 pilar,
 * kelemahan kritis, dan kekuatan usaha khas Kota Batu.
 */
export function diagnoseAssessment(a: AsesmenItem): AssessmentDiagnosisResult {
  const total = a.totalSkor || 0;
  const namaUsaha = a.namaUsaha || 'Usaha Peserta';
  const whatsapp = a.whatsapp || '';
  const bisaAjar = a.poinBisaAjarkan || a.kekuatan || 'Pemasaran';
  const perluBelajar = a.poinPerluDipelajari || a.kelemahan || 'Keuangan';
  const materiAjar = a.materiBisaAjarkan && a.materiBisaAjarkan !== '-' ? a.materiBisaAjarkan : null;

  // Analisis Skor Bagian 1 / 8 Pilar Bisnis
  const pilarScores = (a.bagian3 || []).map(p => ({
    nama: p.kategori.replace(/\s*\(.*?\)\s*/g, '').trim(),
    kategoriLengkap: p.kategori,
    skor: Number(p.skorRataRata) || 0
  }));

  // Cari pilar dengan skor terendah dan tertinggi
  let pilarMin = pilarScores.length > 0 ? pilarScores[0] : { nama: perluBelajar, kategoriLengkap: perluBelajar, skor: 2.5 };
  let pilarMax = pilarScores.length > 0 ? pilarScores[0] : { nama: bisaAjar, kategoriLengkap: bisaAjar, skor: 4.5 };

  for (const p of pilarScores) {
    if (p.skor < pilarMin.skor) pilarMin = p;
    if (p.skor > pilarMax.skor) pilarMax = p;
  }

  // Tentukan Level Kematangan Usaha
  let stage: MaturityStage = 'Bertumbuh & Stabilisasi';
  let stageColor: 'amber' | 'blue' | 'purple' | 'emerald' = 'blue';
  let stageBadgeBg = 'bg-blue-50 border-blue-200 text-blue-800';
  let stageBadgeText = 'Bertumbuh (Growth)';

  if (total >= 66 || (pilarMax.skor >= 4.5 && pilarScores.every(p => p.skor >= 3.5))) {
    stage = 'Tangguh & Potensi Mentor';
    stageColor = 'purple';
    stageBadgeBg = 'bg-purple-100 border-purple-300 text-purple-900';
    stageBadgeText = 'Level 4: Tangguh / Siap Mentor';
  } else if (total >= 56 || pilarScores.some(p => p.skor >= 4.2)) {
    stage = 'Siap Skala (Scale-Up)';
    stageColor = 'emerald';
    stageBadgeBg = 'bg-emerald-100 border-emerald-300 text-emerald-900';
    stageBadgeText = 'Level 3: Siap Skala (Scale-Up)';
  } else if (total >= 44) {
    stage = 'Bertumbuh & Stabilisasi';
    stageColor = 'blue';
    stageBadgeBg = 'bg-blue-100 border-blue-300 text-blue-900';
    stageBadgeText = 'Level 2: Bertumbuh & Validasi';
  } else {
    stage = 'Perintisan & Fondasi';
    stageColor = 'amber';
    stageBadgeBg = 'bg-amber-100 border-amber-300 text-amber-900';
    stageBadgeText = 'Level 1: Perintisan Fondasi';
  }

  // Ringkasan Diagnosa Tajam (1-2 kalimat)
  let ringkasanDiagnosis = '';
  if (pilarMin.nama.toLowerCase().includes('finance') || pilarMin.nama.toLowerCase().includes('keuangan')) {
    ringkasanDiagnosis = `Traksi produk & pasar usaha sudah terbentuk, namun memiliki kerentanan tinggi pada pencatatan arus kas dan pemisahan keuangan pribadi vs usaha (${pilarMin.skor}/5).`;
  } else if (pilarMin.nama.toLowerCase().includes('operasional') || pilarMin.nama.toLowerCase().includes('operation')) {
    ringkasanDiagnosis = `Permintaan pasar sudah mulai tumbuh, namun kapasitas produksi dan standardisasi operasional harian masih menjadi bottleneck penahan laju usaha (${pilarMin.skor}/5).`;
  } else if (pilarMin.nama.toLowerCase().includes('sales') || pilarMin.nama.toLowerCase().includes('marketing') || pilarMin.nama.toLowerCase().includes('pemasaran')) {
    ringkasanDiagnosis = `Kualitas produk dan komitmen usaha sangat baik, namun strategi konversi penjualan dan jangkauan kanal pemasaran digital masih perlu dioptimalkan (${pilarMin.skor}/5).`;
  } else if (pilarMin.nama.toLowerCase().includes('growth') || pilarMin.nama.toLowerCase().includes('leadership')) {
    ringkasanDiagnosis = `Operasional harian berjalan stabil, namun perencanaan roadmap ekspansi dan pembagian peran tim masih bergantung penuh pada pendiri usaha (${pilarMin.skor}/5).`;
  } else {
    ringkasanDiagnosis = `Usaha berada dalam fase ${stage.toLowerCase()}, dengan keunggulan utama di pilar ${pilarMax.nama} (${pilarMax.skor}/5) dan memerlukan pendampingan fokus pada pilar ${pilarMin.nama} (${pilarMin.skor}/5).`;
  }

  // Rekomendasi Aksi Nyata (3 Poin Tindakan Konkret)
  const rekomendasiAksi: string[] = [];

  if (pilarMin.nama.toLowerCase().includes('finance') || perluBelajar.toLowerCase().includes('keuangan')) {
    rekomendasiAksi.push('Prioritaskan pencatatan buku kas harian menggunakan aplikasi digital dan buat rekening terpisah khusus operasional usaha.');
  } else if (pilarMin.nama.toLowerCase().includes('operation') || perluBelajar.toLowerCase().includes('operasional')) {
    rekomendasiAksi.push('Susun Standard Operating Procedure (SOP) produksi tertulis agar konsistensi mutu dan estimasi waktu pengerjaan terjaga.');
  } else if (pilarMin.nama.toLowerCase().includes('marketing') || pilarMin.nama.toLowerCase().includes('sales')) {
    rekomendasiAksi.push('Lakukan peremajaan visual katalog produk (foto resolusi tinggi) dan buat jadwal posting teratur di media sosial.');
  } else {
    rekomendasiAksi.push('Tetapkan 3 Key Performance Indicators (KPI) utama yang dievaluasi bersama tim setiap pekan.');
  }

  // Rekomendasi kedua: Berdasarkan kesiapan skala
  if (stage === 'Siap Skala (Scale-Up)' || stage === 'Tangguh & Potensi Mentor') {
    rekomendasiAksi.push('Jajaki kemitraan B2B dengan ekosistem wisata Kota Batu (hotel, resto, kafe, atau pusat oleh-oleh resmi).');
  } else {
    rekomendasiAksi.push('Lengkapi legalitas dasar usaha (NIB, P-IRT, atau Sertifikasi Halal gratis) untuk meningkatkan rasa percaya pelanggan.');
  }

  // Rekomendasi ketiga: Berdasarkan potensi peer-mentoring atau modul PartnerUp
  if (materiAjar) {
    rekomendasiAksi.push(`Libatkan pendiri usaha sebagai pemateri/mentor sebaya dalam sesi kolaborasi terkait "${materiAjar}".`);
  } else {
    rekomendasiAksi.push(`Ikuti secara penuh modul pendampingan 1-on-1 kurator khusus penguatan pilar ${pilarMin.nama}.`);
  }

  // Potensi Peer Mentoring
  const potensiPeerMentor = materiAjar 
    ? `Bisa berbagi praktik baik: "${materiAjar}" kepada peserta lain yang butuh penguatan di bidang ${bisaAjar}.`
    : null;

  // Draf Pesan WhatsApp Resmi Hasil Asesmen
  const waFeedbackDraft = `Halo Kak *${namaUsaha}*! 👋✨

Terima kasih telah menyelesaikan pengisian *Asesmen Mandiri Kesiapan Bisnis* di program *GEKRAFS PartnerUp 2026 Kota Batu*.

Berikut hasil diagnosis & pemetaan kesiapan usaha Kakak:
📊 *Total Skor Asesmen:* *${total}/75*
🏷️ *Fase Kematangan:* *${stage}*

💪 *Pilar Kekuatan Utama:*
• *${pilarMax.nama}* (Skor: ${pilarMax.skor}/5) — Memiliki pondasi yang sangat solid dan menjadi modal daya saing usaha.

🎯 *Pilar Fokus Peningkatan:*
• *${pilarMin.nama}* (Skor: ${pilarMin.skor}/5) — Perlu mendapatkan pendampingan terarah selama siklus PartnerUp.

📌 *Rekomendasi Tindakan Cepat (90 Hari):*
${rekomendasiAksi.map((r, i) => `${i + 1}. ${r}`).join('\n')}

${potensiPeerMentor ? `🤝 *Catatan Kolaborasi:* Tim kurator mencatat Kakak memiliki keahlian berbagi terkait _"${materiAjar}"_. Kami akan menghubungkan Kakak dalam sesi temu kolaborasi!\n\n` : ''}Mari bersama mengakselerasi potensi ekonomi kreatif Kota Batu! 🚀

Salam hormat,
*Tim Kurator & Asesor GEKRAFS Kota Batu*`;

  return {
    stage,
    stageColor,
    stageBadgeBg,
    stageBadgeText,
    ringkasanDiagnosis,
    pilarTerkuat: {
      nama: pilarMax.nama,
      skor: pilarMax.skor,
      keterangan: `Pilar paling matang dan stabil (${pilarMax.skor}/5).`
    },
    pilarKritis: {
      nama: pilarMin.nama,
      skor: pilarMin.skor,
      keterangan: `Pilar yang paling membutuhkan intervensi dan pendampingan (${pilarMin.skor}/5).`
    },
    rekomendasiAksi,
    potensiPeerMentor,
    waFeedbackDraft
  };
}
