import React from 'react';
import { X, Printer, Download } from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in print:p-0 print:bg-white">
      <div className="fixed inset-0 print:hidden" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 z-10 flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Controls (Hidden in print) */}
        <div className="sticky top-0 bg-[#001c3c] text-white p-4 px-6 rounded-t-2xl flex items-center justify-between z-20 print:hidden">
          <div>
            <div className="text-xs text-[#ffc72c] font-bold uppercase tracking-wider">
              Pratinjau Cetak / Ekspor Dokumen
            </div>
            <h3 className="font-bold text-base mt-0.5">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004c80] hover:bg-[#0070b3] text-xs font-bold text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 sm:p-10 bg-white space-y-6 text-slate-800">
          {/* Kop Surat Resmi GEKRAFS Kota Batu */}
          <div className="border-b-2 border-[#001c3c] pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-[#001c3c] text-white flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                  <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#ffffff" />
                  <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="#ffc72c" />
                  <text x="50" y="60" fontSize="22" fontWeight="bold" textAnchor="middle" fill="#001c3c">GK</text>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-[#001c3c] tracking-tight">GEKRAFS KOTA BATU</h1>
                <p className="text-xs font-bold text-[#b8860b] uppercase tracking-wide">
                  Gerakan Ekonomi Kreatif Nasional
                </p>
                <p className="text-[11px] text-slate-500">
                  Program Pendampingan Usaha UMKM &middot; Gekrafs PartnerUp
                </p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400 font-mono">
              <div>Dokumen Resmi</div>
              <div>{new Date().toLocaleDateString('id-ID')}</div>
            </div>
          </div>

          {/* Subtitle / Document Info */}
          <div>
            <h2 className="text-lg font-bold text-[#001c3c]">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          {/* Main Body Table or List */}
          <div className="overflow-x-auto">{children}</div>

          {/* Official Footer */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Gekrafs Batu &middot; All Rights Reserved</span>
            <span>Developed by Lalu Mahendra</span>
          </div>
        </div>
      </div>
    </div>
  );
};
