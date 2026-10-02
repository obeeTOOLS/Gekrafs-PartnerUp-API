import React, { useRef } from 'react';
import { PesertaItem, AsesmenItem } from '../types';
import { 
  Award, 
  Printer, 
  X, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Share2, 
  Sparkles,
  BarChart3
} from 'lucide-react';
import { generateQrSvgUrl } from '../utils/qrUtils';

interface SertifikatKelulusanModalProps {
  peserta: PesertaItem;
  asesmen?: AsesmenItem | null;
  onClose: () => void;
}

export const SertifikatKelulusanModal: React.FC<SertifikatKelulusanModalProps> = ({
  peserta,
  asesmen,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Generate certificate number based on row / hash
  const certNumber = `GK-BATU/P-UP/2026/${String(peserta.row || 1).padStart(3, '0')}`;
  const verificationUrl = `${window.location.origin}/?verify_cert=${encodeURIComponent(certNumber)}&usaha=${encodeURIComponent(peserta.namaUsaha)}`;
  const qrSvgUrl = generateQrSvgUrl(verificationUrl);

  const handlePrint = () => {
    window.print();
  };

  const skorTotal = asesmen?.totalSkor || 85;
  const grade = skorTotal >= 80 ? 'Sangat Baik (A)' : skorTotal >= 70 ? 'Baik (B)' : 'Cukup (C)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Toolbar (Hidden when printing) */}
        <div className="print:hidden p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-black text-white">
                E-Sertifikat Kelulusan & Rapor Digital
              </h3>
              <p className="text-[11px] text-slate-300">
                {peserta.namaUsaha} ({peserta.namaPemilik})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#001c3c] font-black text-xs shadow transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Container (Printable Area) */}
        <div ref={printRef} className="p-6 sm:p-10 bg-slate-50 space-y-8">
          {/* HALAMAN 1: SERTIFIKAT KELULUSAN RESMI */}
          <div className="bg-white rounded-2xl p-8 sm:p-12 border-8 border-double border-[#001c3c] shadow-lg relative overflow-hidden text-center space-y-6">
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <Award className="w-[500px] h-[500px] text-[#001c3c]" />
            </div>

            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500" />

            {/* Kop Resmi */}
            <div className="space-y-1">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#004c80]">
                DEWAN PENGURUS CABANG GERAKAN EKONOMI KREATIF NASIONAL
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#001c3c] tracking-wide uppercase">
                DPC GEKRAFS KOTA BATU
              </h2>
              <div className="h-0.5 w-32 bg-amber-400 mx-auto rounded my-1" />
              <div className="text-[10px] font-mono text-slate-500">
                Nomor: {certNumber}
              </div>
            </div>

            {/* Judul Piagam */}
            <div className="space-y-1 pt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                SERTIFIKAT KELULUSAN PEMBINAAN
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#001c3c] italic">
                Certificate of Completion
              </h1>
            </div>

            {/* Penerima */}
            <div className="space-y-2 py-2">
              <p className="text-xs text-slate-600">Diberikan dengan bangga kepada:</p>
              <h3 className="text-xl sm:text-3xl font-black text-[#001c3c] underline decoration-amber-400 decoration-4 underline-offset-8">
                {peserta.namaPemilik}
              </h3>
              <p className="text-base sm:text-lg font-extrabold text-[#004c80] pt-1">
                {peserta.namaUsaha}
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                Subsektor: {peserta.subsektor}
              </span>
            </div>

            {/* Narasi Kelulusan */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
              Atas komitmen dan keberhasilannya menyelesaikan seluruh rangkaian program akselerasi dan inkubasi kapasitas bisnis{' '}
              <strong className="text-[#001c3c]">GEKRAFS PartnerUp Kota Batu 2026</strong> yang mencakup 8 pilar tata kelola usaha, standarisasi operasional, dan kepatuhan legalitas.
            </p>

            {/* Tanda Tangan & QR Validasi */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 items-center text-xs">
              <div className="space-y-8 text-center">
                <span className="text-[11px] text-slate-500 font-semibold block">
                  Ketua DPC GEKRAFS Kota Batu
                </span>
                <div className="font-extrabold text-[#001c3c] border-t border-slate-400 pt-1 max-w-[160px] mx-auto">
                  Ketua DPC GEKRAFS
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <img
                  src={qrSvgUrl}
                  alt="QR Verifikasi Sertifikat"
                  className="w-16 h-16 sm:w-20 sm:h-20 border border-slate-200 rounded-lg p-1 bg-white shadow-xs"
                />
                <span className="text-[9px] font-mono text-slate-400">Scan Validasi Dokumen</span>
              </div>

              <div className="space-y-8 text-center">
                <span className="text-[11px] text-slate-500 font-semibold block">
                  Lead Curator PartnerUp
                </span>
                <div className="font-extrabold text-[#001c3c] border-t border-slate-400 pt-1 max-w-[160px] mx-auto">
                  Tim Kurasi & Asesor
                </div>
              </div>
            </div>
          </div>

          {/* HALAMAN 2: LEMBAR RAPOR DIGITAL EVALUASI 8 PILAR */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#004c80]" />
                <h4 className="text-sm sm:text-base font-black text-[#001c3c]">
                  Lembar Rapor Hasil Evaluasi Bisnis & Kapasitas UMKM
                </h4>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Predikat: {grade}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">TOTAL SKOR DIAGNOSIS</span>
                <span className="text-lg font-black text-[#001c3c]">{skorTotal} / 100</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">KEKUATAN UTAMA USAHA</span>
                <span className="font-bold text-emerald-700 truncate block">
                  {asesmen?.kekuatan || 'Kualitas Produk & Keunikan'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">FOKUS PENGEMBANGAN</span>
                <span className="font-bold text-rose-700 truncate block">
                  {asesmen?.kelemahan || 'Manajemen Kas & Pricing'}
                </span>
              </div>
            </div>

            {/* Catatan Pembina */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#004c80]" />
                <span>Rekomendasi Tindak Lanjut Pasca Program:</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {peserta.catatanKurator ||
                  'Pelaku usaha direkomendasikan untuk melanjutkan pendaftaran NIB, standarisasi pencatatan pembukuan kas digital bulanan, serta berjejaring dalam ekosistem kemitraan DPC GEKRAFS Kota Batu.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
