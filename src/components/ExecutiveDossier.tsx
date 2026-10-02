import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Layers, 
  Database, 
  Cpu, 
  Workflow, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  Terminal, 
  ExternalLink,
  Users,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen
} from 'lucide-react';

export const ExecutiveDossier: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'all' | 'arsitektur' | 'dataflow' | 'fitur' | 'pitch'>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-gradient-to-r from-[#001c3c] via-[#003366] to-[#004c80] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer & Site Engineer Dossier</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Ringkasan Teknis & Panduan Presentasi Pimpinan GEKRAFS
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Dokumen resmi arsitektur sistem, alur pemrosesan data, katalog fitur komprehensif, dan poin-poin presentasi strategis untuk jajaran pengurus DPC GEKRAFS Kota Batu.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-[#001c3c] font-black text-xs shadow-lg transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF Dokumen</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Tab Ringkas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'Seluruh Ringkasan' },
          { id: 'pitch', label: '1. Poin Presentasi Pimpinan' },
          { id: 'arsitektur', label: '2. Arsitektur & Stack' },
          { id: 'dataflow', label: '3. Alur Input & Aliran Data' },
          { id: 'fitur', label: '4. Matriks 11 Fitur Terpadu' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === tab.id
                ? 'bg-[#001c3c] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. SECTION 1: POIN PRESENTASI STRATEGIS KE PIMPINAN (PITCH DECK) */}
      {(activeSection === 'all' || activeSection === 'pitch') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              👑
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-700">
                Strategic Executive Pitch
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#001c3c]">
                Nilai Strategis Platform PartnerUp untuk Pimpinan GEKRAFS
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
              <div className="text-base font-black text-[#004c80] flex items-center gap-1.5">
                <span>💰</span>
                <span>Efisiensi Anggaran (Rp 0 Cloud Bill)</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Dibangun di atas arsitektur <em>serverless</em> Google Apps Script dan Google Sheets. 
                DPC GEKRAFS Kota Batu <strong>tidak dibebani biaya sewa server bulanan atau langganan database cloud berbayar</strong>. Semua aset data tersimpan aman di akun Google Workspace resmi organisasi.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
              <div className="text-base font-black text-emerald-900 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Transparansi & Akuntabilitas Kurasi</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Penilaian peserta tidak lagi subjektif atau tercecer di grup obrolan. Setiap kurator memiliki akses whitelist dengan bobot kriteria terstandarisasi, dilengkapi lembar kurasi PDF dan radar 8 pilar bisnis yang dapat dipertanggungjawabkan.
              </p>
            </div>

            <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-2">
              <div className="text-base font-black text-purple-900 flex items-center gap-1.5">
                <span>🚀</span>
                <span>Dampak Riil Pasca-Program</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Bukan sekadar form pendaftaran, web app ini menyediakan <strong>Katalog Publik Brand Terkurasi</strong> untuk membuka akses pasar, <strong>Klinik Fasilitasi NIB/Halal</strong>, serta <strong>E-Sertifikat Kelulusan Resmi</strong> dengan kode QR anti-pemalsuan.
              </p>
            </div>
          </div>

          {/* Script Pemandu Presentasi */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-black text-[#001c3c] uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#004c80]" />
              Panduan Urutan Berbicara Saat Presentasi:
            </span>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
              <li>
                <strong>Buka dengan Latar Belakang:</strong> "Tahun ini GEKRAFS Kota Batu mentransformasi program PartnerUp dari pencatatan manual menjadi ekosistem digital terpadu <em>all-in-one</em>."
              </li>
              <li>
                <strong>Tunjukkan Kemudahan Akses Peserta:</strong> Tampilkan halaman Pendaftaran, verifikasi WhatsApp OTP, dan Asesmen Mandiri 35 kriteria yang langsung memetakan radar kelemahan UMKM.
              </li>
              <li>
                <strong>Tunjukkan Dashboard Kurator:</strong> Buka tab Kurasi Peserta dan Dashboard Analitik Radar untuk memperlihatkan bagaimana data peserta terkompilasi otomatis tanpa perlu rekap Excel manual.
              </li>
              <li>
                <strong>Tunjukkan Nilai Tambah Publik:</strong> Tampilkan Katalog Direktori Ekraf Kota Batu dan fitur cetak E-Sertifikat Kelulusan resmi DPC GEKRAFS.
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* 4. SECTION 2: ARSITEKTUR & TEKNOLOGI STACK */}
      {(activeSection === 'all' || activeSection === 'arsitektur') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#004c80] flex items-center justify-center font-bold">
              🏗️
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#004c80]">
                Technical Blueprint
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#001c3c]">
                Struktur Arsitektur Sistem Web Apps
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Frontend */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-extrabold text-[#001c3c] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Frontend Layer</span>
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• <strong>React 19 + TypeScript</strong> (Type-safe & Responsive)</li>
                <li>• <strong>Tailwind CSS</strong> (Desain modern standar korporat)</li>
                <li>• <strong>Lucide React</strong> (Ikonografi UI intuitif)</li>
                <li>• <strong>Client-side Router & State</strong></li>
              </ul>
            </div>

            {/* Backend API */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-extrabold text-[#001c3c] flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-emerald-600" />
                <span>Serverless Backend</span>
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• <strong>Google Apps Script (GAS)</strong></li>
                <li>• Endpoint Webhook REST API (`doGet` / `doPost`)</li>
                <li>• CORS & JSON-P compatible</li>
                <li>• Otomatisasi formula kalkulasi skor</li>
              </ul>
            </div>

            {/* Database & Storage */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-extrabold text-[#001c3c] flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-600" />
                <span>Database & File Cloud</span>
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• <strong>Google Sheets Database</strong> (Data Peserta & Asesmen)</li>
                <li>• <strong>Google Drive Storage</strong> (KTP & NIB dokumen)</li>
                <li>• LocalStorage Hybrid Cache (Kinerja instan)</li>
                <li>• Ekspor JSON & Backup mandiri</li>
              </ul>
            </div>

            {/* Messaging */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-extrabold text-[#001c3c] flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-green-600" />
                <span>Komunikasi & Otomasi</span>
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• <strong>WhatsApp Gateway (Fonnte API)</strong></li>
                <li>• Pengiriman kode OTP nomor HP</li>
                <li>• Broadcast pengingat jadwal kelas H-1</li>
                <li>• Validasi QR Code Kehadiran</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECTION 3: ALUR INPUT & ALIRAN DATA END-TO-END */}
      {(activeSection === 'all' || activeSection === 'dataflow') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              🔄
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800">
                End-to-End Data Pipeline
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#001c3c]">
                Alur Input Data & Pemrosesan Sistem
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                step: '1',
                title: 'Input Pendaftaran & Verifikasi WhatsApp OTP',
                desc: 'Peserta mengisi profil usaha di Form Pendaftaran. Sistem mengirim OTP ke nomor WA untuk memvalidasi nomor aktif, lalu mengunggah berkas KTP & NIB langsung ke folder Google Drive panitia.'
              },
              {
                step: '2',
                title: 'Asesmen Mandiri Kinerja (Diagnostik 8 Pilar)',
                desc: 'Peserta mengisi kuesioner 35 pertanyaan skala 1-5 yang mencakup Leadership, Finance, Operation, Product, Service, Sales, Marketing, dan Growth. Skor dihitung dan tersinkronisasi ke Google Sheets.'
              },
              {
                step: '3',
                title: 'Sidang Kurasi & Seleksi Multi-Kurator',
                desc: 'Kurator mereview berkas melalui Portal Kurator, memberikan catatan perbaikan, dan menetapkan status kurasi (Diterima / Ditolak / Wawancara). Lembar kurasi dapat langsung diekspor sebagai PDF.'
              },
              {
                step: '4',
                title: 'Pelaksanaan Kelas Pembinaan & Absensi QR',
                desc: 'Peserta menghadiri kelas tatap muka sesuai jadwal timeline. Presensi divalidasi melalui pemindaian QR Code (Self Check-in atau input panitia), langsung merekap tingkat kehadiran tiap sesi.'
              },
              {
                step: '5',
                title: 'Mentoring 1-on-1 & Fasilitasi Legalitas',
                desc: 'Kurator mencatat action plan pada Logbook Mentoring dan memfasilitasi pembuatan NIB di OSS RBA serta Sertifikasi Halal bagi UMKM yang belum berizin.'
              },
              {
                step: '6',
                title: 'Katalog Publik & E-Sertifikat Kelulusan',
                desc: 'UMKM yang lulus kurasi otomatis tampil di Katalog Direktori Ekraf Kota Batu dan berhak mengunduh E-Sertifikat Resmi ber-QR Code untuk portofolio bisnis mereka.'
              }
            ].map((flow) => (
              <div
                key={flow.step}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-[#001c3c] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  {flow.step}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm text-[#001c3c]">{flow.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{flow.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SECTION 4: MATRIKS SELURUH 11 FITUR TERPADU */}
      {(activeSection === 'all' || activeSection === 'fitur') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              ✨
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-purple-800">
                Feature Matrix
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#001c3c]">
                Daftar Lengkap 11 Fitur Web Apps PartnerUp
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              {
                no: '01',
                nama: 'Form Pendaftaran & Upload Drive',
                fungsi: 'Formulir multi-tahap dengan seleksi 17 subsektor ekraf, integrasi OTP WhatsApp, dan upload dokumen legalitas.'
              },
              {
                no: '02',
                nama: 'Timeline & Jadwal Kelas Pembinaan',
                fungsi: 'Agenda interaktif rangkaian kelas tatap muka, countdown waktu pembinaan, dan tautan unduh materi presentasi.'
              },
              {
                no: '03',
                nama: 'Asesmen Mandiri Diagnostik 8 Pilar',
                fungsi: '35 pertanyaan terbobot untuk mengukur kesehatan tata kelola usaha dan mendeteksi kelemahan operasional.'
              },
              {
                no: '04',
                nama: 'Presensi & Absensi QR Code',
                fungsi: 'Pencatatan kehadiran digital per sesi via barcode QR dengan validasi status peserta dan pencegahan titip absen.'
              },
              {
                no: '05',
                nama: 'Dashboard Kurator & Seleksi Peserta',
                fungsi: 'Ruang kerja panitia/kurator untuk menyaring berkas, filtering status, cetak lembar kurasi PDF, dan broadcast WA.'
              },
              {
                no: '06',
                nama: 'Dashboard Grafik & Radar 8 Pilar',
                fungsi: 'Visualisasi analitik jaring laba-laba, sebaran omzet bulanan, filter subsektor, dan rekomendasi modul kurikulum prioritas.'
              },
              {
                no: '07',
                nama: 'Katalog & Direktori Ekraf Terkurasi',
                fungsi: 'Showcase publik produk dan brand UMKM Kota Batu terkurasi lengkap dengan kontak WhatsApp langsung dan medsos.'
              },
              {
                no: '08',
                nama: 'Logbook Pendampingan 1-on-1',
                fungsi: 'Pencatatan sesi konsultasi tatap muka mentor-UMKM, tracking bottleneck usaha, dan pemantauan deadline action item.'
              },
              {
                no: '09',
                nama: 'Klinik & Fasilitasi Legalitas',
                fungsi: 'Monitoring progres perizinan resmi NIB di OSS RBA, Sertifikasi Halal, P-IRT, dan HKI Merek bersama dinas terkait.'
              },
              {
                no: '10',
                nama: 'Generator E-Sertifikat & Rapor Digital',
                fungsi: 'Penerbitan otomatis piagam kelulusan DPC GEKRAFS Kota Batu ber-QR Code validasi keaslian dan lembar rapor evaluasi.'
              },
              {
                no: '11',
                nama: 'Developer Hub & Live Sheet Sync',
                fungsi: 'Konsol kendali engineer untuk sinkronisasi Google Apps Script, backup data JSON mandiri, dan monitoring API gateway.'
              }
            ].map((f) => (
              <div
                key={f.no}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-[#004c80] bg-blue-100 px-2 py-0.5 rounded-md">
                    {f.no}
                  </span>
                  <h4 className="font-extrabold text-sm text-[#001c3c]">{f.nama}</h4>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{f.fungsi}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
