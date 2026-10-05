import React from 'react';
import { X, Printer, FileText, CheckCircle2, Copy, Download, Building2, Phone, User, Calendar } from 'lucide-react';
import { StrategicCanvasTask } from '../types';

interface RekapPesertaTugasPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: StrategicCanvasTask[];
}

export const RekapPesertaTugasPdfModal: React.FC<RekapPesertaTugasPdfModalProps> = ({
  isOpen,
  onClose,
  tasks
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // Filter hanya peserta yang sudah mengirimkan tugas (submitted atau reviewed)
  const submittedTasks = tasks
    .filter(t => t.status === 'submitted' || t.status === 'reviewed')
    .sort((a, b) => (a.createdAt || a.updatedAt || '').localeCompare(b.createdAt || b.updatedAt || ''));

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTextList = () => {
    const lines = [
      `*REKAP PESERTA SUDAH MENGIRIM TUGAS (LEMBAR AKSI)*`,
      `*GEKRAFS PARTNERUP 2026 KOTA BATU - SESI 2*`,
      `Total Peserta Masuk: ${submittedTasks.length} Usaha`,
      `Tanggal Rekap: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `-----------------------------------------`,
      ...submittedTasks.map((t, i) => 
        `${i + 1}. *${t.namaUsaha}* | ${t.namaPemilik || '-'} | WA: ${t.whatsapp || '-'} (${t.subsektor || 'UMKM'})`
      ),
      `-----------------------------------------`,
      `Sumber Data: Google Spreadsheet Gekraf_PartnerUp#2`
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 z-10 flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Sticky Top Header Controls (Hidden during print) */}
        <div className="sticky top-0 bg-[#001c3c] text-white p-4 px-6 rounded-t-2xl flex flex-wrap items-center justify-between gap-3 z-20 print:hidden shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#ffc72c] font-black uppercase tracking-wider">
                Dokumen Rekapitulasi Resmi
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Daftar Peserta Pengirim Tugas ({submittedTasks.length} UMKM)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyTextList}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-all cursor-pointer"
              title="Salin daftar ke format teks WhatsApp"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? '✅ Tersalin!' : 'Salin Format WA'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-xs font-black text-white shadow transition-all cursor-pointer"
              title="Cetak langsung atau simpan sebagai dokumen PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 bg-white space-y-6 text-slate-800 leading-relaxed print:p-4 print:text-black">
          
          {/* Document Header (Kop Surat Resmi) */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-black tracking-widest text-[#001c3c] uppercase">
                GEKRAFS KOTA BATU • DPC GERAKAN EKONOMI KREATIF NASIONAL
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                REKAPITULASI PENGIRIMAN TUGAS PARTNERUP
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Program Akselerasi & Inkubasi Bisnis UMKM Kreatif Kota Batu • Sesi 2
              </p>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-semibold">Tanggal Rekap</div>
              <div className="text-xs font-mono font-bold text-slate-900">{todayStr}</div>
              <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                {submittedTasks.length} Peserta Terdata
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 print:bg-white print:border-slate-300">
            <span className="font-bold text-slate-900">Catatan Panitia:</span> Dokumen ini hanya memuat rekapitulasi identitas peserta (nama usaha, nama pemilik, dan nomor WhatsApp) yang berkas tugasnya telah resmi tersimpan di Google Spreadsheet. Soal dan lembar jawaban strategi disimpan aman pada arsip kurasi internal.
          </div>

          {/* Clean Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 divide-y divide-slate-200 print:border-slate-400">
              <thead className="bg-[#001c3c] text-white print:bg-slate-100 print:text-black">
                <tr>
                  <th className="py-2.5 px-3 font-bold w-10 text-center">No</th>
                  <th className="py-2.5 px-3 font-bold">Nama Usaha / Brand</th>
                  <th className="py-2.5 px-3 font-bold">Nama Pemilik</th>
                  <th className="py-2.5 px-3 font-bold">Nomor WhatsApp</th>
                  <th className="py-2.5 px-3 font-bold">Subsektor</th>
                  <th className="py-2.5 px-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {submittedTasks.map((t, idx) => {
                  const cleanWa = (t.whatsapp || '').replace(/[^0-9]/g, '');
                  const formattedWa = cleanWa.startsWith('62') 
                    ? '0' + cleanWa.slice(2) 
                    : (cleanWa.startsWith('0') ? cleanWa : (cleanWa ? '0' + cleanWa : '-'));

                  return (
                    <tr 
                      key={t.id || idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70 print:bg-slate-50'}
                    >
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-600 print:text-black">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-slate-900 print:text-black">
                        {t.namaUsaha}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-700 print:text-black">
                        {t.namaPemilik || '-'}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-800 font-semibold print:text-black">
                        {formattedWa}
                      </td>
                      <td className="py-2 px-3 text-slate-600 print:text-black">
                        {t.subsektor || 'UMKM'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 print:border-none print:p-0">
                          {t.status === 'reviewed' ? 'Sudah Dinilai' : 'Terkirim'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Document Footer Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-slate-700 print:pt-6">
            <div>
              <div className="font-bold text-slate-900">Mengetahui,</div>
              <div className="text-[11px] text-slate-500">Ketua DPC Gekrafs Kota Batu</div>
              <div className="h-16"></div>
              <div className="font-extrabold text-slate-900 border-t border-slate-400 pt-1 inline-block min-w-44">
                Panitia PartnerUp 2026
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">Diverifikasi Oleh,</div>
              <div className="text-[11px] text-slate-500">Tim Kurator & Rekapitulasi Data</div>
              <div className="h-16"></div>
              <div className="font-extrabold text-slate-900 border-t border-slate-400 pt-1 inline-block min-w-44 text-right">
                Admin PartnerUp Sesi 2
              </div>
            </div>
          </div>

          {/* System Footer Watermark */}
          <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between items-center print:text-slate-500">
            <span>Gekrafs PartnerUp 2026 • Single Source of Truth: Google Spreadsheet (Gekraf_PartnerUp#2)</span>
            <span className="font-mono">Dicetak otomatis dari Sistem Aplikasi</span>
          </div>

        </div>
      </div>
    </div>
  );
};
