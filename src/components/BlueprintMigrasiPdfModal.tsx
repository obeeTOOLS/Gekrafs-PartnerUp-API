import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Database, 
  CloudDownload, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  FileText, 
  Sparkles,
  Workflow,
  Cpu,
  Lock,
  Share2
} from 'lucide-react';
import { generateUntunginMigrationPdf } from '../utils/generateUntunginMigrationPdf';

interface BlueprintMigrasiPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintMigrasiPdfModal: React.FC<BlueprintMigrasiPdfModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeChapter, setActiveChapter] = useState<'all' | '1' | '2' | '3' | '4' | '5' | '6'>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      generateUntunginMigrationPdf({
        author: 'Obee Creatives (Lead Developer Untungin)',
        targetVaultSheetId: 'GSHEET_UNTUNGIN_STANDALONE_VAULT_2026'
      });
    } catch (e) {
      console.error('Gagal generate PDF:', e);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* HEADER MODAL */}
        <div className="flex-shrink-0 px-6 py-4.5 bg-gradient-to-r from-[#001c3c] via-indigo-950 to-slate-900 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Workflow className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Blueprint Arsitektur & Roadmap
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Dokumen Teknis Developer
                </span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Migrasi Total Kas Untungin ke Versi Standalone
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-slate-950" />
              )}
              <span>{isDownloading ? 'Menyiapkan Dokumen...' : 'Unduh Berkas PDF Resmi'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title="Tutup Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* SUBNAV NAVIGASI BAB */}
        <div className="flex-shrink-0 px-6 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Bab:
          </span>
          {[
            { id: 'all', label: 'Semua Bab' },
            { id: '1', label: 'I. Ringkasan Eksekutif' },
            { id: '2', label: 'II. Latar Belakang & Urgensi' },
            { id: '3', label: 'III. Arsitektur Dual-Sync' },
            { id: '4', label: 'IV. Fitur Penunjang' },
            { id: '5', label: 'V. 4 Fase Migrasi' },
            { id: '6', label: 'VI. Analisis Risiko & Monetisasi' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveChapter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeChapter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MODAL BODY (SCROLLABLE CONTENT) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-gradient-to-b from-slate-900 to-slate-950">
          
          {/* BANNER UTAMA */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-amber-950/20 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Prinsip Kehati-hatian & Kedaulatan Data Terjamin</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Rencana Strategis & Roadmap Migrasi Untungin
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Dokumen resmi untuk mengamankan seluruh database UMKM, pembukuan kas, dan sistem lisensi voucher agar tetap beroperasi mandiri saat program pendampingan PartnerUp purna tugas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/10 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Unduh Dokumen PDF</span>
              </button>
            </div>
          </div>

          {/* BAB 1 & 2 */}
          {(activeChapter === 'all' || activeChapter === '1' || activeChapter === '2') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BAB I */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-black text-sm">
                    I
                  </span>
                  <div>
                    <h4 className="font-black text-white text-base">Ringkasan Eksekutif</h4>
                    <p className="text-xs text-slate-400">Visi Kemerdekaan Data & Produk Mandiri</p>
                  </div>
                </div>
                <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-amber-300">1. Mandiri & Berkelanjutan:</strong> Untungin bukan sekadar modul sampingan, melainkan aplikasi inti pencatatan keuangan UMKM dengan <em>market value</em> mandiri.
                  </p>
                  <p>
                    <strong className="text-amber-300">2. Zero-Disruption:</strong> Proses pemisahan arsitektur dilakukan di belakang layar tanpa mengganggu aktivitas peserta PartnerUp saat ini.
                  </p>
                  <p>
                    <strong className="text-amber-300">3. Shadow Ledger:</strong> Seluruh transaksi disalin secara instan ke spreadsheet vault cadangan milik developer.
                  </p>
                </div>
              </div>

              {/* BAB II */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-black text-sm">
                    II
                  </span>
                  <div>
                    <h4 className="font-black text-white text-base">Latar Belakang & Analisis Urgensi</h4>
                    <p className="text-xs text-slate-400">Pencegahan Risiko Vendor/Program Lock-In</p>
                  </div>
                </div>
                <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-rose-400">Batasan Periode Program:</strong> Program pendampingan memiliki masa berlaku. Jika program selesai, akses spreadsheet program berisiko ditutup atau diarsipkan.
                  </p>
                  <p>
                    <strong className="text-rose-400">Proteksi Aset UMKM:</strong> Pelaku usaha telah mencatat ratusan transaksi harian, mengelola rekening, dan memantau laba. Kehilangan data kas adalah kerugian fatal bagi bisnis mereka.
                  </p>
                  <p>
                    <strong className="text-rose-400">Proteksi Developer:</strong> Sebagai pemilik ide dan pengembang, Anda berhak memiliki kepemilikan data penuh (data ownership) untuk meneruskan produk menjadi bisnis mandiri.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BAB 3: ARSITEKTUR DUAL-STREAM REAL-TIME SYNC */}
          {(activeChapter === 'all' || activeChapter === '3') && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-sm">
                    III
                  </span>
                  <div>
                    <h4 className="font-black text-white text-base">Arsitektur Dual-Stream Live Data Synchronization</h4>
                    <p className="text-xs text-slate-400">Topologi Shadow Ledger Tanpa Latensi Tambahan</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                  Zero Data Loss
                </span>
              </div>

              {/* DIAGRAM TOPOLOGI */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  
                  {/* CLIENT / FRONTEND */}
                  <div className="p-4 rounded-xl bg-[#001c3c] border border-blue-500/30 text-center space-y-2">
                    <div className="w-8 h-8 mx-auto rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="font-black text-sm text-white">Client App Untungin</div>
                    <div className="text-[11px] text-slate-400">Input Transaksi Kas, Mutasi Rekening, Aktivasi Voucher</div>
                    <div className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                      kasService.ts
                    </div>
                  </div>

                  {/* DISPATCHER */}
                  <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-2">
                    <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <div className="font-black text-sm text-indigo-200">Dual-Write Dispatcher</div>
                    <div className="text-[11px] text-slate-400">Menduplikasi Payload ke 2 Tujuan Secara Asinkron</div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-amber-300 font-semibold">
                      <span>Live Primary</span> <ArrowRight className="w-3 h-3" /> <span>Shadow Vault</span>
                    </div>
                  </div>

                  {/* DESTINATIONS */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">Sheet PartnerUp (Live)</div>
                          <div className="text-[10px] text-slate-400">Dipakai operasional program saat ini</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                        Primary
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="text-xs font-bold text-amber-200">Sheet Vault Untungin</div>
                          <div className="text-[10px] text-slate-400">Database cadangan independen developer</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        Vault
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-amber-300 mb-1">Non-Blocking Dispatch</div>
                  <div className="text-slate-400">Sinkronisasi ke sheet vault berjalan di background, user tidak merasakan lag sama sekali.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-emerald-300 mb-1">Struktur Kolom Standar</div>
                  <div className="text-slate-400">Format tanggal, kategori kas, jenis akun, dan nominal memakai schema universal siap ekspor.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-indigo-300 mb-1">Tabel Khusus Lisensi Voucher</div>
                  <div className="text-slate-400">Masa aktif voucher 3/6/9/12 bulan tersimpan aman dan tetap valid di versi mandiri.</div>
                </div>
              </div>
            </div>
          )}

          {/* BAB 4 & 5 */}
          {(activeChapter === 'all' || activeChapter === '4' || activeChapter === '5') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BAB IV: FITUR PENUNJANG */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-sm">
                    IV
                  </span>
                  <div>
                    <h4 className="font-black text-white text-base">Fitur Kunci Penunjang Migrasi</h4>
                    <p className="text-xs text-slate-400">Komponen Teknis yang Disiapkan</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-white mb-1">1. Data Source Switcher</div>
                    <div className="text-slate-400">
                      Satu saklar konfigurasi environment untuk memindahkan sumber data dari spreadsheet program ke spreadsheet vault hanya dalam 1 detik.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-white mb-1">2. Decoupled Auth & PIN System</div>
                    <div className="text-slate-400">
                      Otentikasi mandiri berbasis <code className="text-amber-300 font-mono">namaUsaha + PIN</code> lokal, bebas dari login admin PartnerUp.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-white mb-1">3. One-Click Snapshot Backup (JSON & CSV)</div>
                    <div className="text-slate-400">
                      User UMKM dapat mengunduh cadangan lokal buku kas mereka ke perangkat pribadi kapanpun mereka mau.
                    </div>
                  </div>
                </div>
              </div>

              {/* BAB V: 4 FASE EKSEKUSI */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-sm">
                    V
                  </span>
                  <div>
                    <h4 className="font-black text-white text-base">4 Fase Roadmap Eksekusi</h4>
                    <p className="text-xs text-slate-400">Tahapan Migrasi Tanpa Hambatan</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="font-bold text-emerald-300">Fase 1: Preparasi & Shadow Vault (Sekarang)</div>
                    <div className="text-slate-400 text-[11px]">Membuat sheet vault cadangan & pasang dispatcher dual-write di background.</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <div className="font-bold text-indigo-300">Fase 2: Decoupling Codebase</div>
                    <div className="text-slate-400 text-[11px]">Membuat repository atau build mandiri Untungin web/PWA terpisah dari PartnerUp.</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="font-bold text-amber-300">Fase 3: Rekonsiliasi & Uji Coba Dry-Run</div>
                    <div className="text-slate-400 text-[11px]">Simulasi cutover dan verifikasi saldo akun uji coba (obeecreatives).</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="font-bold text-purple-300">Fase 4: Cutover & Go-Live Standalone</div>
                    <div className="text-slate-400 text-[11px]">Alihkan domain & kirim instruksi via WhatsApp ke UMKM. Untungin resmi mandiri!</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BAB 6: ANALISIS RISIKO & BISNIS */}
          {(activeChapter === 'all' || activeChapter === '6') && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-black text-sm">
                  VI
                </span>
                <div>
                  <h4 className="font-black text-white text-base">Analisis Risiko & Potensi Komersialisasi Mandiri</h4>
                  <p className="text-xs text-slate-400">Strategi Pasca-Program untuk Keberlanjutan Bisnis</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Mitigasi Kuota Request Google Apps Script
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Google membatasi kuota request harian GAS. Kita memitigasinya dengan penyimpanan lokal (IndexedDB/LocalStorage) sebagai <em>offline buffer</em>, lalu sync berkala saat jaringan stabil.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Peluang Monetisasi SaaS UMKM Mandiri
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Setelah mandiri, voucher durasi (3, 6, 9 bulan, 1 tahun) dapat dijual langsung ke ribuan UMKM seharga Rp 25.000 - Rp 50.000 / kuartal. Aplikasi Untungin menjadi sumber pendapatan berulang (MRR) untuk developer.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex-shrink-0 px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Dokumen Rahasia Internal Pengembang &middot; Disimpan di Developer Tools PartnerUp</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              Tutup Panduan
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Unduh Berkas PDF Sekarang</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
