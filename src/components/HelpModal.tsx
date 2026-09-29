import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 border border-slate-200 z-10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-[#001c3c] text-lg">Panduan Gekrafs PartnerUp</h3>
            <p className="text-xs text-slate-500">Versi 2.0 (Modern Headless Architecture)</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-700 leading-relaxed">
          <div>
            <h4 className="font-bold text-sm text-[#004c80] flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Pendaftaran UMKM
            </h4>
            <p>
              Isi data usaha secara lengkap dan jujur. Nomor WhatsApp digunakan sebagai kode unik saat
              melakukan asesmen mandiri dan presensi pelatihan.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#004c80] flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. Timeline & Jadwal Pelatihan
            </h4>
            <p>
              Pelatihan diadakan setiap Sabtu. Peserta dapat melihat materi slide dan link Drive
              pada kartu sesi pelatihan masing-masing.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#004c80] flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. Asesmen Mandiri & Radar Bisnis
            </h4>
            <p>
              Asesmen mandiri terdiri dari 3 bagian: 35 pertanyaan diagnosa mendalam, 7 kriteria kurasi,
              dan 8 slider radar kinerja. Hasil ini memetakan kekuatan dan kebutuhan belajar untuk peer mentoring.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#004c80] flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              4. Absensi Kehadiran Berbasis QR
            </h4>
            <p>
              Peserta cukup scan QR code yang ditampilkan panitia di lokasi pada hari pelaksanaan atau
              memilih sesi dan memasukkan nama usaha & WhatsApp terdaftar.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#004c80] flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              5. Arsitektur Headless GAS & Offline-First
            </h4>
            <p>
              Aplikasi ini beroperasi dengan teknologi Optimistic UI update (&lt; 0.01 detik). Data disimpan di local storage
              dan otomatis disinkronkan ke Google Sheets via Headless Apps Script tanpa menampilkan banner Google.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center text-center gap-2">
          <div className="text-[11px] text-slate-500">
            Gekrafs PartnerUp — All Rights Reserved &middot; Gekrafs Batu
          </div>
          <div className="text-[11px] font-semibold text-[#004c80]">
            Developed by Lalu Mahendra
          </div>
          <button
            onClick={onClose}
            className="mt-2 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
