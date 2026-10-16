import { jsPDF } from 'jspdf';

export interface GenerateMigrationPdfOptions {
  author?: string;
  targetVaultSheetId?: string;
}

export function generateUntunginMigrationPdf(options?: GenerateMigrationPdfOptions): void {
  const authorName = options?.author || 'Obee Creatives (Lead Developer)';
  const vaultSheetId = options?.targetVaultSheetId || 'STANDALONE_VAULT_GSHEET_ID_PENDING';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 16;

  const checkPageOverflow = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 16) {
      doc.addPage();
      currentY = 16;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    doc.setDrawColor(0, 28, 60);
    doc.setLineWidth(0.4);
    doc.line(margin, 10, pageWidth - margin, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'UNTUNGIN ECOSYSTEM  •  BLUEPRINT ARSITEKTUR & STRATEGI MIGRASI KE STANDALONE VERSION',
      margin,
      8
    );

    const pageNum = doc.getNumberOfPages();
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    doc.text(`Halaman ${pageNum}`, pageWidth - margin - 15, pageHeight - 6);
    doc.text(
      'Dokumen Rahasia & Strategis (Internal Developer)  •  Untungin Independent Roadmap 2026',
      margin,
      pageHeight - 6
    );
  };

  // Helper untuk kotak seksi
  const drawSectionBox = (title: string, sub: string, bgColor: [number, number, number], strokeColor: [number, number, number], titleColor: [number, number, number]) => {
    checkPageOverflow(20);
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'F');
    doc.setDrawColor(strokeColor[0], strokeColor[1], strokeColor[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'S');

    doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(title, margin + 4, currentY + 5.5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(sub, margin + 4, currentY + 10.5);

    currentY += 17;
  };

  const drawBullet = (boldPrefix: string, text: string) => {
    checkPageOverflow(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${boldPrefix}`, margin + 3, currentY);

    const prefixWidth = doc.getTextWidth(`• ${boldPrefix} `);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    
    const lines = doc.splitTextToSize(text, contentWidth - prefixWidth - 4);
    doc.text(lines[0] || '', margin + 3 + prefixWidth, currentY);
    currentY += 4.5;

    for (let i = 1; i < lines.length; i++) {
      checkPageOverflow(6);
      doc.text(lines[i], margin + 7, currentY);
      currentY += 4.5;
    }
    currentY += 1.5;
  };

  // ==================== HALAMAN 1 ====================
  // KOP SURAT RESMI
  doc.setFillColor(0, 28, 60);
  doc.rect(margin, currentY, contentWidth, 24, 'F');

  doc.setTextColor(255, 199, 44);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('UNTUNGIN FINANCIAL SUITE — DEVELOPER LABS', margin + 6, currentY + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Infrastruktur Mandiri, Master Data Vault & Decoupled Migration Engine', margin + 6, currentY + 14);
  doc.text(
    'Dokumen: DOC-UNTUNGIN/MIGRATION-STANDALONE/2026/V1  •  Klasifikasi: STRATEGIS & HIGH-PRIORITY',
    margin + 6,
    currentY + 19
  );

  currentY += 29;

  // BANNER JUDUL
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'F');
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'S');

  doc.setTextColor(49, 46, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('MASTER BLUEPRINT: STRATEGI MIGRASI TOTAL UNTUNGIN KE VERSI STANDALONE', margin + 5, currentY + 7.5);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    'Rangkuman Latar Belakang, Visi Decoupled, Arsitektur Dual-Sync, Spesifikasi Fitur, dan 4 Tahapan Eksekusi Teknis',
    margin + 5,
    currentY + 14
  );

  currentY += 24;

  // INFO METADATA DOKUMEN
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, contentWidth, 15, 1.5, 1.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 15, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Penyusun / Inisiator:', margin + 4, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(authorName, margin + 35, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Target Rilis Standalone:', margin + 105, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Q1 - Q2 2026 (Seamless Transition)', margin + 142, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Status Implementasi:', margin + 4, currentY + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('Fase 1: Persiapan Skema Shadow Data Vault (Active Planning)', margin + 35, currentY + 10.5);

  currentY += 19;

  // BAB 1: RINGKASAN EKSEKUTIF
  drawSectionBox(
    'BAB I: RINGKASAN EKSEKUTIF & DEKLARASI INDEPENDENSI PRODUK',
    'Visi pemisahan daur hidup aplikasi agar bebas dari ketergantungan program inkubasi.',
    [241, 245, 249],
    [148, 163, 184],
    [15, 23, 42]
  );

  drawBullet(
    'Kemandirian Aplikasi:',
    'Untungin diproyeksikan bertransformasi dari modul pelengkap PartnerUp menjadi aplikasi SaaS pembukuan kas & perpajakan UMKM yang 100% independen.'
  );
  drawBullet(
    'Prinsip Kehati-hatian (Zero Downtime):',
    'Seluruh proses migrasi tidak boleh mengganggu operasional program PartnerUp yang sedang aktif berjalan. Peserta dan kurator tidak boleh merasakan disrupsi data.'
  );
  drawBullet(
    'Kedaulatan Database Pengguna:',
    'Seluruh data akun UMKM, PIN keamanan, profil usaha, hak lisensi/voucher, dan riwayat transaksi kas dicadangkan ke Database Vault baru secara otomatis (Dual-Push Shadow Ledger).'
  );

  // BAB 2: LATAR BELAKANG & ANALISIS STRATEGIS
  drawSectionBox(
    'BAB II: LATAR BELAKANG & ANALISIS RESIKO VENDOR LOCK-IN',
    'Mengapa pemisahan database dan migrasi standalone adalah keputusan mutlak.',
    [254, 242, 242],
    [248, 113, 113],
    [153, 27, 27]
  );

  drawBullet(
    'Keterbatasan Siklus Program:',
    'Program pendampingan PartnerUp memiliki batas periode waktu tertentu. Suatu saat program selesai secara resmi atau ditutup.'
  );
  drawBullet(
    'Resiko Kehilangan Aset Berharga:',
    'Jika Untungin tetap menempel pada spreadsheet dan skrip PartnerUp, penutupan program akan memutus akses ke database peserta. Ini menyebabkan kerugian besar bagi UMKM dan pencipta aplikasi.'
  );
  drawBullet(
    'Pertumbuhan Nilai Produk (High Value App):',
    'Untungin telah dilengkapi fitur mutakhir: Multi-rekening (Tunai, Bank, QRIS), auto-kalkulasi PPh Final PP 23 0.5%, voucher bertingkat (3, 6, 9 bln, 1 thn), dan enkripsi PIN lokal. Fitur ini bernilai tinggi untuk berdiri sendiri di pasar.'
  );

  // ==================== HALAMAN 2 ====================
  doc.addPage();
  currentY = 16;
  drawHeaderFooter();

  // BAB 3: ARSITEKTUR DUAL-STREAM REAL-TIME SYNC
  drawSectionBox(
    'BAB III: ARSITEKTUR TEKNIS DUAL-STREAM SHADOW SYNC',
    'Topologi sinkronisasi paralel antara Live Program Sheet dan Standalone Vault Sheet.',
    [236, 253, 245],
    [52, 211, 153],
    [6, 95, 70]
  );

  // Gambar ilustrasi diagram mini topologi
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, currentY, contentWidth, 38, 2, 2, 'F');
  doc.setDrawColor(167, 243, 208);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text('SKEMA ALIRAN DATA DUAL-DISPATCHER (REAL-TIME MIRRORING):', margin + 5, currentY + 6);

  doc.setFillColor(0, 28, 60);
  doc.roundedRect(margin + 5, currentY + 11, 46, 20, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('USER TRANSAKSI KAS', margin + 8, currentY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('(Input Kas / Profil)', margin + 11, currentY + 23);

  // Panah ke kanan
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('===>', margin + 54, currentY + 21);

  // Box Cabang Live
  doc.setFillColor(219, 234, 254);
  doc.roundedRect(margin + 66, currentY + 9, 50, 12, 1.5, 1.5, 'F');
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(margin + 66, currentY + 9, 50, 12, 1.5, 1.5, 'S');
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('A. LIVE PARTNERUP SHEET', margin + 68, currentY + 14);
  doc.setFont('helvetica', 'normal');
  doc.text('(Program Induk Berjalan Lancar)', margin + 68, currentY + 18);

  // Box Cabang Shadow Vault
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin + 66, currentY + 23, 50, 12, 1.5, 1.5, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.roundedRect(margin + 66, currentY + 23, 50, 12, 1.5, 1.5, 'S');
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('B. STANDALONE VAULT SHEET', margin + 68, currentY + 28);
  doc.setFont('helvetica', 'normal');
  doc.text('(Master Database Mandiri Untungin)', margin + 68, currentY + 32);

  // Box Hasil Akhir
  doc.setFillColor(243, 232, 255);
  doc.roundedRect(margin + 120, currentY + 15, 48, 15, 1.5, 1.5, 'F');
  doc.setDrawColor(168, 85, 247);
  doc.roundedRect(margin + 120, currentY + 15, 48, 15, 1.5, 1.5, 'S');
  doc.setTextColor(88, 28, 135);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('HASIL: ZERO DATA LOSS', margin + 122, currentY + 21);
  doc.setFont('helvetica', 'normal');
  doc.text('Siap migrasi kapanpun!', margin + 122, currentY + 26);

  currentY += 42;

  drawBullet(
    'Shadow Ledger Method:',
    'Setiap aksi penambahan atau pembaruan kas mengirim payload ke dua endpoint: Endpoint PartnerUp GAS (primary) dan Endpoint Backup Untungin GAS (vault).'
  );
  drawBullet(
    'Asynchronous Background Sync:',
    'Pengiriman ke vault berjalan secara asynchronous (non-blocking) agar tidak menambah latensi input kas harian pelaku UMKM.'
  );
  drawBullet(
    'Struktur Tabel Terstandarisasi:',
    'Vault mandiri memuat 5 tabel utama: (1) Users_Directory, (2) Kas_Ledger_Transactions, (3) Accounts_Balance, (4) Voucher_Licenses, dan (5) System_Audit_Trail.'
  );

  // BAB 4: FITUR-FITUR PENDUKUNG MIGRASI
  drawSectionBox(
    'BAB IV: FITUR-FITUR INTI YANG DISIAPKAN UNTUK MIGRASI',
    'Komponen fungsional dalam kode untuk mendukung peralihan data secara mulus.',
    [254, 249, 195],
    [234, 179, 8],
    [113, 63, 18]
  );

  drawBullet(
    '1. Data Source Switcher (Pengalih Sumber Data):',
    'Variabel konfigurasi environment tunggal (contoh: DATA_SOURCE_TARGET = "PARTNERUP_HYBRID" atau "UNTUNGIN_STANDALONE"). Cukup 1 klik switch saat hari H migrasi.'
  );
  drawBullet(
    '2. Decoupled Authentication & PIN Engine:',
    'Sistem login kas yang saat ini memakai namaUsaha + PIN akan langsung berfungsi mandiri tanpa bergantung pada ID Peserta atau email login admin PartnerUp.'
  );
  drawBullet(
    '3. One-Click Snapshot Backup (JSON & Excel Encrypted):',
    'Fitur darurat di sisi pengguna yang mengizinkan peserta mengunduh seluruh buku kas bisnis mereka ke komputer/ponsel pribadi kapan saja.'
  );
  drawBullet(
    '4. Multi-Tenant Voucher Engine:',
    'Katalog voucher lisensi pro (3, 6, 9 bln, 1 thn) disimpan pada vault mandiri sehingga masa aktif langganan peserta tetap diakui pada aplikasi standalone.'
  );

  // ==================== HALAMAN 3 ====================
  doc.addPage();
  currentY = 16;
  drawHeaderFooter();

  // BAB 5: ROADMAP & 4 TAHAPAN TEKNIS MIGRASI TOTAL
  drawSectionBox(
    'BAB V: 4 TAHAPAN TEKNIS EKSEKUSI MIGRASI TOTAL (ROADMAP)',
    'Rincian fase pelaksanaan dari penyiapan sheet hingga peluncuran mandiri.',
    [243, 232, 255],
    [168, 85, 247],
    [88, 28, 135]
  );

  // TABEL TAHAPAN
  const phases = [
    {
      fase: 'FASE 1: PREPARASI & SHADOW VAULT',
      waktu: 'Minggu ke-1 s.d ke-2',
      fokus: 'Pembuatan Google Spreadsheet Backup Vault mandiri milik developer, setup skrip GAS shadow, dan implementasi dual-write dispatcher di kasService.ts.',
      output: 'Data baru otomatis terduplikasi 100% ke sheet baru.'
    },
    {
      fase: 'FASE 2: DECOUPLING CORE MODULE',
      waktu: 'Minggu ke-3 s.d ke-4',
      fokus: 'Pemisahan modul Untungin (UI, kalkulator pajak, grafik kas, PIN guard) menjadi template mandiri (Next.js / Vite SPA terpisah atau PWA instalable).',
      output: 'Aplikasi Untungin dapat di-run terpisah tanpa PartnerUp.'
    },
    {
      fase: 'FASE 3: REKONSILIASI & DRY-RUN',
      waktu: 'Minggu ke-5',
      fokus: 'Audit pencocokan jumlah saldo dan transaksi antara Sheet PartnerUp dan Sheet Vault. Simulasi pengalihan data pada akun uji coba developer (obeecreatives).',
      output: 'Laporan integritas saldo 100% balance tanpa selisih.'
    },
    {
      fase: 'FASE 4: CUTOVER & GO-LIVE STANDALONE',
      waktu: 'Saat Program Berakhir (Hari H)',
      fokus: 'Pengalihan URL domain ke portal Untungin Mandiri. Kirim notifikasi WA broadcast ke seluruh peserta berisi panduan login di portal baru.',
      output: 'Untungin beroperasi mandiri sebagai SaaS UMKM berbayar.'
    }
  ];

  phases.forEach((p, idx) => {
    checkPageOverflow(26);
    doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
    doc.roundedRect(margin, currentY, contentWidth, 23, 1.5, 1.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, 23, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 28, 60);
    doc.text(p.fase, margin + 4, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Timeline: ${p.waktu}`, margin + 115, currentY + 5.5);

    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(`Aktivitas: ${p.fokus}`, contentWidth - 8);
    doc.text(descLines, margin + 4, currentY + 11);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(`Milestone Target: ${p.output}`, margin + 4, currentY + 19.5);

    currentY += 26;
  });

  // BAB 6: ANALISIS RISIKO & REKOMENDASI TEKNIS DEVELOPER
  drawSectionBox(
    'BAB VI: ANALISIS RESIKO, MITIGASI & REKOMENDASI TEKNIS',
    'Pedoman mitigasi teknis agar arsitektur kuat dan tidak membebani kuota.',
    [255, 241, 242],
    [251, 113, 133],
    [159, 18, 57]
  );

  drawBullet(
    'Resiko Rate-Limit Google Apps Script:',
    'Google membatasi kuota request harian GAS. Mitigasi: Gunakan Local Storage Cache sebagai buffer transaksi offline, lalu lakukan sinkronisasi batch (antrian) ke spreadsheet.'
  );
  drawBullet(
    'Keamanan Kredensial & Kunci Enkripsi:',
    'PIN kas peserta wajib di-hash menggunakan SHA-256 lokal sebelum dicocokkan, sehingga di database vault tidak pernah tersimpan PIN dalam bentuk plain text.'
  );
  drawBullet(
    'Peluang Komersialisasi Pasca Program:',
    'Dengan database mandiri, developer dapat menawarkan langganan perpanjangan voucher Rp 25.000 - Rp 50.000 / kuartal langsung ke UMKM tanpa bagi hasil pihak program.'
  );

  // KOTAK PENGESAHAN DOKUMEN
  checkPageOverflow(32);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('LEMBAR VALIDASI ARSITEKTUR & OTORISASI DEVELOPER', margin + 5, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Dokumen ini disetujui sebagai acuan baku strategi kelangsungan produk Untungin 2026.', margin + 5, currentY + 11);
  doc.text('Diterbitkan di: Kota Batu, Jawa Timur  •  Status Dokumen: FINAL & READY TO IMPLEMENT', margin + 5, currentY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 28, 60);
  doc.text(`Penanggung Jawab: ${authorName}`, margin + 5, currentY + 22);

  doc.setTextColor(100, 116, 139);
  doc.text('Disimpan di: PartnerUp DevHub & Local Cryptographic Vault', margin + 95, currentY + 22);

  // Save PDF
  doc.save('Master_Blueprint_Strategi_Migrasi_Untungin_Standalone_2026.pdf');
}
