import { jsPDF } from 'jspdf';
import { DEFAULT_KAS_PIN, DEFAULT_ENGINEER_PIN } from '../services/kasService';
import { DEFAULT_ADMIN_PASSWORD } from '../services/authService';

export function generateKasPinPdf(): void {
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
    // Header line on subsequent pages
    doc.setDrawColor(0, 28, 60);
    doc.setLineWidth(0.5);
    doc.line(margin, 10, pageWidth - margin, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('GEKRAFS KOTA BATU  •  PANDUAN OPERASIONAL AKSES KAS & SISTEM PIN', margin, 8);

    // Footer line
    const pageNum = doc.getNumberOfPages();
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    doc.text(`Halaman ${pageNum}`, pageWidth - margin - 15, pageHeight - 6);
    doc.text('Rahasia & Terbatas  •  Ekosistem PartnerUp Gekrafs Batu 2026', margin, pageHeight - 6);
  };

  // --- KOP SURAT RESMI (Halaman 1) ---
  doc.setFillColor(0, 28, 60);
  doc.rect(margin, currentY, contentWidth, 24, 'F');

  doc.setTextColor(255, 199, 44);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('GEKRAFS KOTA BATU — DPC KOTA BATU', margin + 6, currentY + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Sistem Pendampingan Usaha Kreatif & Modul Keuangan Untungin v1.3', margin + 6, currentY + 14);
  doc.text('Dokumen Resmi: SOP-UNTUNGIN/KAS-PIN/2026/01  •  Klasifikasi: Peserta & Developer', margin + 6, currentY + 19);

  currentY += 30;

  // --- JUDUL DOKUMEN ---
  doc.setFillColor(243, 232, 255);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(192, 132, 252);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'S');

  doc.setTextColor(88, 28, 135);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PANDUAN AKSES BUKU KAS, PENGELOLAAN PIN & PROSEDUR RESET', margin + 5, currentY + 8);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Petunjuk teknis resmi bagi Peserta UMKM serta Panduan Otoritas Developer & Engineer', margin + 5, currentY + 15);

  currentY += 28;

  // --- KREDENSIAL CEPAT (HIGHLIGHT BOX) ---
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'S');

  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('RINGKASAN PIN & KREDENSIAL BAWAAN STANDAR (DEFAULT KEY):', margin + 5, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  doc.text(`1. Peserta UMKM (Buku Kas):`, margin + 5, currentY + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(`PIN Default: ${DEFAULT_KAS_PIN}`, margin + 50, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('(Dapat diubah mandiri via tombol "Ganti PIN")', margin + 85, currentY + 12);

  doc.text(`2. Developer & Engineer:`, margin + 5, currentY + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text(`PIN Default Terkunci: ${DEFAULT_ENGINEER_PIN}`, margin + 50, currentY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text('(Tetap punya opsi ubah PIN)', margin + 115, currentY + 18);

  doc.text(`3. Kurator & Panitia:`, margin + 5, currentY + 23);
  doc.setFont('helvetica', 'bold');
  doc.text(`Password Default: ${DEFAULT_ADMIN_PASSWORD}`, margin + 50, currentY + 23);

  currentY += 32;

  // --- BAB I: CARA AKSES BUKU KAS ---
  checkPageOverflow(40);
  doc.setFillColor(0, 28, 60);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BAB I: CARA PESERTA MENGAKSES BUKU KAS (UNTUNGIN)', margin + 4, currentY + 4.5);
  currentY += 9;

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const bab1Intro = 'Modul Untungin adalah sistem pencatatan keuangan mandiri bagi UMKM binaan Gekrafs Kota Batu dengan penyimpanan terisolasi (multi-tenant isolated storage). Peserta dapat membuka Buku Kas melalui 3 akses:';
  const splitBab1Intro = doc.splitTextToSize(bab1Intro, contentWidth);
  doc.text(splitBab1Intro, margin, currentY);
  currentY += splitBab1Intro.length * 4.2 + 2;

  const aksesList = [
    { title: 'A. Bilah Navigasi Bawah Layar Ponsel (Bottom Bar):', desc: 'Pada layar HP, sentuh menu "Kas" (ikon dompet ungu) di bilah bawah. Buku Kas langsung terbuka.' },
    { title: 'B. Tombol Header Atas Layar:', desc: 'Pada bagian atas layar (laptop & ponsel), terdapat tombol "Buku Kas" berlatar ungu di samping Direktori.' },
    { title: 'C. Sidebar Navigasi & Direktori Ekraf:', desc: 'Tersedia tombol "Buku Kas Untungin" pada menu samping serta pada setiap kartu profil usaha di Direktori Ekraf.' }
  ];

  aksesList.forEach((item) => {
    checkPageOverflow(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 76, 128);
    doc.text(item.title, margin + 2, currentY);
    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(item.desc, contentWidth - 4);
    doc.text(splitDesc, margin + 4, currentY);
    currentY += splitDesc.length * 4 + 2;
  });

  currentY += 3;

  // --- BAB II: KEAMANAN & SISTEM PIN PESERTA ---
  checkPageOverflow(36);
  doc.setFillColor(0, 28, 60);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BAB II: SISTEM KEAMANAN & PIN PENGAMAN BUKU KAS', margin + 4, currentY + 4.5);
  currentY += 9;

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const bab2Intro = 'Catatan keuangan, saldo kas, serta omzet UMKM merupakan data privat. Oleh karena itu, modul Untungin dilindungi oleh Layar Kunci PIN (PIN Lock Gate) otomatis:';
  const splitBab2Intro = doc.splitTextToSize(bab2Intro, contentWidth);
  doc.text(splitBab2Intro, margin, currentY);
  currentY += splitBab2Intro.length * 4.2 + 2;

  const poinBab2 = [
    `• PIN Bawaan Standar Peserta: ${DEFAULT_KAS_PIN} (6 angka). Peserta pertama kali membuka kas cukup memasukkan 123456.`,
    '• Sesi Aman: Setelah terbuka, kas dapat digunakan selama modal aktif. Menutup modal mengaktifkan kembali proteksi PIN.',
    '• Hak Otonom: Setiap peserta bebas mengganti PIN mereka kapan saja untuk mencegah pihak lain mengintip catatan uang.'
  ];
  poinBab2.forEach((pt) => {
    checkPageOverflow(8);
    const splitPt = doc.splitTextToSize(pt, contentWidth - 4);
    doc.text(splitPt, margin + 2, currentY);
    currentY += splitPt.length * 4.2;
  });

  currentY += 3;

  // --- BAB III: PANDUAN CARA GANTI PIN PESERTA ---
  checkPageOverflow(44);
  doc.setFillColor(0, 28, 60);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BAB III: PANDUAN CARA PESERTA MENGGANTI PIN KAS SECARA MANDIRI', margin + 4, currentY + 4.5);
  currentY += 9;

  const gantiPinSteps = [
    { no: '1', title: 'Buka Buku Kas Usaha:', desc: 'Buka modal kas dengan memasukkan PIN aktif saat ini (standar awal: 123456).' },
    { no: '2', title: 'Tekan Tombol "Ganti PIN":', desc: 'Pada header atas modal Buku Kas sebelah tombol privasi mata, tekan tombol bertanda ikon kunci "Ganti PIN".' },
    { no: '3', title: 'Isi Formulir Perubahan PIN:', desc: 'Masukkan PIN Lama, lalu masukkan PIN Baru (4 sampai 8 karakter/angka), dan ulangi pada Konfirmasi PIN Baru.' },
    { no: '4', title: 'Simpan PIN Baru:', desc: 'Klik tombol "Simpan PIN Baru". PIN baru langsung aktif untuk membuka buku kas pada sesi berikutnya.' }
  ];

  gantiPinSteps.forEach((st) => {
    checkPageOverflow(12);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, currentY, contentWidth, 10, 1, 1, 'F');
    doc.setTextColor(0, 28, 60);
    doc.setFont('helvetica', 'bold');
    doc.text(`[Langkah ${st.no}]  ${st.title}`, margin + 3, currentY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(st.desc, margin + 3, currentY + 8);
    currentY += 12;
  });

  currentY += 3;

  // --- BAB IV: PIN DEFAULT DEVELOPER & ENGINEER ---
  checkPageOverflow(44);
  doc.setFillColor(0, 28, 60);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BAB IV: PIN TERKUNCI DEFAULT DEVELOPER & ENGINEER (FULL AKSES)', margin + 4, currentY + 4.5);
  currentY += 9;

  doc.setFillColor(254, 242, 242);
  doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'F');
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'S');

  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`PIN DEFAULT TERKUNCI DEVELOPER & ENGINEER:  ${DEFAULT_ENGINEER_PIN}`, margin + 4, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 20, 20);
  doc.text('Khusus akun Lead Developer (obeetools@gmail.com) dan Core Engineer (loehendra@gmail.com).', margin + 4, currentY + 10.5);

  currentY += 17;

  const devPoin = [
    '• Terkunci Sebagai Default: Saat akun engineer di-reset atau pertama kali aktif, PIN wajib menggunakan obeecreatives2026#*.',
    '• Opsi Ubah PIN: Developer tetap memiliki opsi penuh mengganti PIN melalui menu "Akun Developer & PIN" di Developer Tools.',
    '• Master Passcode Kas: PIN ini juga berfungsi sebagai kunci induk pembuka kas unit usaha uji coba dan bypass darurat.'
  ];
  devPoin.forEach((dp) => {
    checkPageOverflow(8);
    const splitDp = doc.splitTextToSize(dp, contentWidth - 4);
    doc.text(splitDp, margin + 2, currentY);
    currentY += splitDp.length * 4.2;
  });

  currentY += 3;

  // --- BAB V: SOP RESET PIN PESERTA OLEH DEVELOPER ---
  checkPageOverflow(48);
  doc.setFillColor(0, 28, 60);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BAB V: SOP DEVELOPER/ENGINEER MERESET PIN PESERTA YANG LUPA', margin + 4, currentY + 4.5);
  currentY += 9;

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const bab5Intro = 'Apabila ada peserta yang mengubah PIN lalu lupa kata kuncinya, Lead Developer dan Core Engineer dapat memulihkan akses seketika tanpa merusak data keuangan transaksi:';
  const splitBab5 = doc.splitTextToSize(bab5Intro, contentWidth);
  doc.text(splitBab5, margin, currentY);
  currentY += splitBab5.length * 4.2 + 2;

  const resetMethods = [
    { title: 'Metode 1: Menu DevTools ➔ Tab "Reset PIN Kas Peserta"', desc: 'Buka Developer Tools, pilih tab "Reset PIN Kas Peserta". Cari nama usaha/pemilik/WA. Tersedia tombol "Reset 123456" (1-klik instan) serta tombol "Set Kustom" untuk menetapkan angka khusus.' },
    { title: 'Metode 2: Tombol Cepat dari Modal Kas ("Reset PIN")', desc: 'Saat Developer membuka modal buku kas peserta manapun, di header atas selalu muncul tombol kuning "Reset PIN". Klik tombol ini untuk langsung mengembalikan PIN peserta ke 123456.' }
  ];

  resetMethods.forEach((rm) => {
    checkPageOverflow(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(109, 40, 217);
    doc.text(rm.title, margin + 2, currentY);
    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitRm = doc.splitTextToSize(rm.desc, contentWidth - 4);
    doc.text(splitRm, margin + 4, currentY);
    currentY += splitRm.length * 4 + 2;
  });

  currentY += 4;

  // --- LEMBAR PENGESAHAN DOKUMEN ---
  checkPageOverflow(30);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Diterbitkan resmi oleh Tim Arsitektur Sistem Gekrafs Kota Batu — 2026', margin, currentY);
  doc.text('Penanggung Jawab: Lalu Mahendra Ali Akbar (Lead Developer & System Architect)', margin, currentY + 4);
  doc.text('Kontak Teknis & Bantuan Kredensial: obeetools@gmail.com / 081335125277', margin, currentY + 8);

  // Draw header-footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Draw footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - margin - 22, pageHeight - 6);
    doc.text('SOP Operasional Keamanan Data Kas & PIN — Gekrafs PartnerUp 2026', margin, pageHeight - 6);
  }

  // Trigger browser download
  doc.save('Panduan_Akses_Buku_Kas_dan_PIN_PartnerUp_Gekrafs_Batu.pdf');
}
