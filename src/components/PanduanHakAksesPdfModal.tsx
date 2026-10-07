import React from 'react';
import { X, Printer, Shield, Key, Users, Terminal, CheckCircle2, Lock, FileText, AlertTriangle } from 'lucide-react';
import { AUTHORIZED_ENGINEERS, DEFAULT_DEVELOPER_PASSWORD, DEFAULT_ENGINEER_PIN } from '../services/authService';

interface PanduanHakAksesPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanduanHakAksesPdfModal: React.FC<PanduanHakAksesPdfModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in print:p-0 print:bg-white">
      {/* Backdrop */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 z-10 flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Sticky Top Header Controls (Hidden during print) */}
        <div className="sticky top-0 bg-[#001c3c] text-white p-4 px-6 rounded-t-2xl flex items-center justify-between z-20 print:hidden shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-amber-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#ffc72c] font-black uppercase tracking-wider">
                Dokumen Resmi Khusus Developer & Core Engineer
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Buku Panduan Hak Akses & SOP Login Sistem
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-xs font-black text-white shadow transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (A4 Styled Layout) */}
        <div className="p-6 sm:p-10 bg-white space-y-7 text-slate-800 leading-relaxed print:p-4">
          
          {/* 1. KOP SURAT RESMI */}
          <div className="border-b-2 border-[#001c3c] pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-full bg-[#001c3c] text-white flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                  <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#ffffff" />
                  <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="#ffc72c" />
                  <text x="50" y="60" fontSize="22" fontWeight="bold" textAnchor="middle" fill="#001c3c">GK</text>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-[#001c3c] tracking-tight">
                  GEKRAFS KOTA BATU
                </h1>
                <p className="text-xs font-bold text-[#b8860b] uppercase tracking-wide">
                  Gerakan Ekonomi Kreatif Nasional &middot; DPC Kota Batu
                </p>
                <p className="text-[11px] text-slate-500">
                  Sistem Informasi Program Inkubasi & Pendampingan Usaha: <strong>Gekrafs PartnerUp</strong>
                </p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-500 font-mono">
              <div className="font-bold text-[#001c3c]">DOKUMEN TEKNIS & KEAMANAN</div>
              <div>No: SOP-GKF/AUTH/2026/02</div>
              <div>Tanggal Rilis: {todayStr}</div>
              <div className="text-rose-600 font-semibold uppercase">Klasifikasi: Internal / Developer</div>
            </div>
          </div>

          {/* 2. JUDUL DOKUMEN & METADATA */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#004c80] mb-1">
              Standard Operating Procedure (SOP) & Security Manual
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#001c3c]">
              PANDUAN HAK AKSES, AUTENTIKASI, DAN TATA CARA LOGIN PENGGUNA
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Petunjuk operasional autentikasi berjenjang untuk <strong>Peserta (UMKM)</strong>, <strong>Tim Kurator & Panitia</strong>, serta <strong>Developer / Core Systems Engineer</strong> pada aplikasi Gekrafs PartnerUp.
            </p>
          </div>

          {/* 3. ARSITEKTUR KEAMANAN SISTEM */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-[#001c3c]">
              <Shield className="w-4 h-4 text-[#004c80]" />
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                1. Prinsip Dasar Arsitektur Keamanan Akses
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Sistem PartnerUp menerapkan paradigma <strong>Role-Based Access Control (RBAC)</strong> yang dikombinasikan dengan prinsip <em>Zero Unknown Access</em> untuk pengelola, serta <em>Frictionless Identity Verification</em> untuk pelaku usaha:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/60">
                <div className="text-[11px] font-black text-[#004c80] uppercase">Peserta (UMKM)</div>
                <div className="text-xs font-bold text-[#001c3c] mt-0.5">Verifikasi Berbasis Data</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Tanpa kata sandi rumit. Validasi instan dengan mencocokkan Nama Usaha dan Nomor WhatsApp terdaftar pada Google Spreadsheet.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/60">
                <div className="text-[11px] font-black text-amber-800 uppercase">Tim Kurator & Panitia</div>
                <div className="text-xs font-bold text-[#001c3c] mt-0.5">Whitelist Model 2</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Hanya email resmi yang didaftarkan oleh pimpinan/developer di daftar whitelist yang memiliki otorisasi masuk.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/60">
                <div className="text-[11px] font-black text-purple-800 uppercase">Developer / Engineer</div>
                <div className="text-xs font-bold text-[#001c3c] mt-0.5">Super Admin Level 10</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Kontrol mutlak sistem, konsol teknis Google Apps Script, pemilih peran (Role Switcher), dan penanganan darurat global force logout.
                </p>
              </div>
            </div>
          </section>

          {/* 4. DETAIL AKSES PERAN: DEVELOPER / CORE ENGINEER */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-[#001c3c]">
              <Terminal className="w-4 h-4 text-purple-700" />
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                2. Otoritas Khusus Peran Developer & Core Systems Engineer
              </h3>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-xs space-y-2">
              <div className="font-bold text-purple-900 flex items-center justify-between">
                <span>Daftar Akun Engineer Resmi Terotorisasi:</span>
                <span className="font-mono text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <ul className="space-y-1.5 text-slate-700">
                {Object.values(AUTHORIZED_ENGINEERS).map((eng) => (
                  <li key={eng.email} className="flex items-center justify-between bg-white p-2 rounded-lg border border-purple-100">
                    <div>
                      <strong className="text-purple-950">{eng.name}</strong> &middot;{' '}
                      <span className="font-mono text-slate-500">{eng.email}</span>
                      <div className="text-[10px] text-slate-500">{eng.title}</div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md">
                      {eng.badge}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-1 text-[11px] text-purple-900">
                <strong>PIN Default Terkunci:</strong> <code className="bg-white px-2 py-0.5 rounded border border-purple-200 font-mono font-bold">{DEFAULT_ENGINEER_PIN}</code> &middot; <strong>Opsi:</strong> Dapat diganti mandiri melalui tab Akun Developer & PIN
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <h4 className="font-bold text-[#001c3c]">Fitur Eksklusif Developer / Engineer:</h4>
              <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
                <li>
                  <strong>Bilah Pemilih Peran (Role Switcher):</strong> Developer dapat berpindah sudut pandang seketika antara <em>Peserta</em>, <em>Kurator</em>, dan <em>Developer</em> untuk memeriksa konsistensi tampilan tanpa perlu logout dan login ulang.
                </li>
                <li>
                  <strong>Manajemen Whitelist Akun Kurator:</strong> Developer dapat menambah akun kurator baru, mengedit hak akses, menonaktifkan akun, atau me-reset password kurator yang lupa kata sandi.
                </li>
                <li>
                  <strong>Headless GAS Hub:</strong> Akses kode serverless Google Apps Script, pengujian endpoint web app, dan penarikan paksa sinkronisasi Google Spreadsheet secara langsung (*live pull*).
                </li>
                <li>
                  <strong>Global Force Logout:</strong> Memutus paksa seluruh sesi login di seluruh browser dan perangkat secara simultan ketika terjadi insiden keamanan atau pembaruan arsitektur besar.
                </li>
              </ol>
            </div>
          </section>

          {/* 5. DETAIL AKSES PERAN: TIM KURATOR & PANITIA */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-[#001c3c]">
              <Users className="w-4 h-4 text-[#004c80]" />
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                3. Panduan Akses Tim Kurator & Panitia Pelaksana
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                <div className="font-bold text-amber-900">Kredensial Bawaan Tim Kurasi:</div>
                <div className="flex flex-wrap gap-3 font-mono text-[11px] text-slate-800">
                  <div>Email: <strong className="text-amber-950">kurator.gekrafs@gmail.com</strong></div>
                  <div>Password Default: <strong className="text-amber-950">{DEFAULT_DEVELOPER_PASSWORD}</strong></div>
                </div>
              </div>

              <h4 className="font-bold text-[#001c3c]">Tata Cara Login Kurator:</h4>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Buka web app PartnerUp, lalu klik tombol <strong>"Portal Kurator"</strong> di pojok kanan atas.</li>
                <li>Ketikkan email kurator yang telah terdaftar di sistem dan masukkan password.</li>
                <li>Klik tombol <strong>"Masuk Dashboard"</strong>.</li>
              </ol>

              <h4 className="font-bold text-[#001c3c] mt-2">SOP Penambahan & Pengelolaan Akun Kurator Baru:</h4>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Login dengan akun Developer atau Admin Pimpinan.</li>
                <li>Buka menu <strong>Portal Kurator ➔ Tab Pengaturan</strong>.</li>
                <li>Scroll ke tabel <strong>"Daftar Whitelist Akun Admin & Kurator"</strong>, lalu klik tombol <strong>"+ Tambah Akun Baru"</strong>.</li>
                <li>Isi Nama Lengkap, Email Resmi, dan pilih Peran (*Kurator*, *Panitia*, *Pimpinan*, atau *Admin Operasional*).</li>
                <li>Klik <strong>Simpan</strong>. Akun baru langsung aktif dengan password awal <code>{DEFAULT_DEVELOPER_PASSWORD}</code>.</li>
                <li>Minta kurator baru untuk segera mengganti password pribadinya secara mandiri melalui menu <strong>Ganti Password</strong> di dashboard profil.</li>
              </ol>

              <h4 className="font-bold text-[#001c3c] mt-2">Tugas & Hak Akses Kurator:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Review data pendaftar UMKM, verifikasi dokumen legalitas NIB, dan update status kurasi (Lolos / Cadangan / Perlu Revisi).</li>
                <li>Melihat hasil evaluasi radar chart Asesmen Mandiri 15 kriteria peserta.</li>
                <li>Mengunduh poster QR Code presensi berformat PNG untuk dicetak / dipajang di proyektor kelas pelatihan.</li>
                <li>Mencatat rekapitulasi kehadiran dan menerbitkan Berita Acara Pelatihan.</li>
                <li>Menerbitkan e-Sertifikat Kelulusan resmi ber-QR verifikasi.</li>
              </ul>
            </div>
          </section>

          {/* 6. DETAIL AKSES PERAN: PESERTA (UMKM) */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-[#001c3c]">
              <Key className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                4. Panduan Akses Peserta (Pelaku UMKM / Ekraf)
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p>
                Untuk meminimalkan kendala teknis bagi pelaku UMKM di lapangan (*frictionless UX*), peserta <strong>tidak dibebani pembuatan password baru</strong>. Otorisasi dilakukan melalui pencocokan dua variabel data kepemilikan usaha:
              </p>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="font-bold text-emerald-950">Kredensial Verifikasi Peserta:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                  <div>1. <strong>Nama Usaha:</strong> Sesuai nama brand yang didaftarkan pada formulir.</div>
                  <div>2. <strong>Nomor WhatsApp:</strong> Nomor WhatsApp aktif yang didaftarkan (contoh: 081234567890).</div>
                </div>
              </div>

              <h4 className="font-bold text-[#001c3c]">Tata Cara Login Peserta:</h4>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Klik menu <strong>"Profil Usaha"</strong> atau <strong>"Asesmen Mandiri"</strong> di navbar utama.</li>
                <li>Jika belum login, klik <strong>"Masuk Akun Peserta"</strong>.</li>
                <li>Ketikkan Nama Usaha dan Nomor WhatsApp terdaftar.</li>
                <li>Sistem otomatis memverifikasi ke database Google Sheets. Jika valid, sesi login peserta langsung aktif dan tersimpan di browser.</li>
              </ol>

              <h4 className="font-bold text-[#001c3c] mt-2">Fitur Otomatisasi Absensi QR di Kelas:</h4>
              <p className="leading-relaxed">
                Saat peserta berada di lokasi pelatihan dan men-scan QR Code Sesi:
                Jika peserta telah login, nama usaha dan nomor telepon mereka <strong>otomatis terkunci dan terisi</strong> pada form presensi. Peserta cukup menekan satu tombol <em>"Catat Kehadiran Saya"</em> tanpa perlu mengetik ulang data diri, mencegah kesalahan input atau manipulasi presensi.
              </p>
            </div>
          </section>

          {/* 7. MATRIKS HAK AKSES SISTEM (MATRIX OF PRIVILEGES) */}
          <section className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-[#001c3c]">
              <Lock className="w-4 h-4 text-slate-700" />
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                5. Matriks Perbandingan Hak Akses (Matrix of Privileges)
              </h3>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#001c3c] text-white">
                    <th className="p-2.5 border-b border-slate-200 font-bold">Modul / Fitur Aplikasi</th>
                    <th className="p-2.5 border-b border-slate-200 font-bold text-center">Peserta (UMKM)</th>
                    <th className="p-2.5 border-b border-slate-200 font-bold text-center">Tim Kurator</th>
                    <th className="p-2.5 border-b border-slate-200 font-bold text-center">Developer/Engineer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Pendaftaran Program Baru & Edit Profil Usaha Sendiri</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Pengisian & Evaluasi Asesmen Mandiri 15 Kriteria</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Usaha Sendiri</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Semua Peserta</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Semua Peserta</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Presensi Kehadiran Kelas (Scan QR Sesi)</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya (1-Klik)</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Input Manual</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Input Manual</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Download Poster QR Presensi Pelatihan (Format PNG)</td>
                    <td className="p-2 text-center text-slate-400">❌ Tidak</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Penilaian Kurasi (Lolos / Cadangan / Revisi)</td>
                    <td className="p-2 text-center text-slate-400">❌ Tidak</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Broadcast Pesan WhatsApp Resmi ke Peserta</td>
                    <td className="p-2 text-center text-slate-400">❌ Tidak</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Ya</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Penerbitan e-Sertifikat Kelulusan Resmi</td>
                    <td className="p-2 text-center text-slate-400">❌ Hanya Unduh</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Terbitkan</td>
                    <td className="p-2 text-center text-emerald-600 font-bold">✅ Terbitkan</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Manajemen Whitelist Akun Admin & Reset Password</td>
                    <td className="p-2 text-center text-slate-400">❌ Tidak</td>
                    <td className="p-2 text-center text-slate-400">❌ Terbatas</td>
                    <td className="p-2 text-center text-purple-700 font-bold">✅ Akses Penuh</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Headless GAS Hub & Konfigurasi Teknis Endpoint</td>
                    <td className="p-2 text-center text-slate-400">❌ Tidak</td>
                    <td className="p-2 text-center text-slate-400">❌ Tidak</td>
                    <td className="p-2 text-center text-purple-700 font-bold">✅ Akses Penuh</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-medium">Global Force Logout Seluruh Sesi Sistem</td>
                    <td className="p-2 text-center text-slate-400">❌ Tidak</td>
                    <td className="p-2 text-center text-slate-400">❌ Tidak</td>
                    <td className="p-2 text-center text-purple-700 font-bold">✅ Akses Penuh</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 8. PENGESAHAN DOKUMEN */}
          <div className="pt-6 border-t-2 border-[#001c3c] grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="text-slate-500 text-[11px]">Disusun & Diaudit Oleh:</div>
              <div className="font-bold text-[#001c3c] mt-1">Lead Developer & Systems Architect</div>
              <div className="h-14 flex items-center justify-center font-serif text-slate-400 italic">
                [Tanda Tangan Digital Terverifikasi]
              </div>
              <div className="font-bold text-slate-800 underline">Obee Tools & Lalu Mahendra</div>
              <div className="text-[10px] text-slate-500 font-mono">obeetools@gmail.com</div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px]">Mengetahui & Mengesahkan:</div>
              <div className="font-bold text-[#001c3c] mt-1">DPC GEKRAFS KOTA BATU</div>
              <div className="h-14 flex items-center justify-center font-serif text-slate-400 italic">
                [Cap & Pengesahan Organisasi]
              </div>
              <div className="font-bold text-slate-800 underline">Ketua DPC Gekrafs Kota Batu</div>
              <div className="text-[10px] text-slate-500">Periode Kepengurusan 2024 - 2027</div>
            </div>
          </div>

          {/* 9. FOOTER RESMI CETAK */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Gekrafs PartnerUp &middot; Hak Cipta Dilindungi Undang-Undang</span>
            <span>Dokumen Dicetak pada: {todayStr}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
