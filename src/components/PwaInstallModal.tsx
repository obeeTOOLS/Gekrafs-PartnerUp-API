import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, Sparkles, Check } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled
}) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already installed / standalone
    const isStandAloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isStandAloneMode);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        onInstalled();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 z-10 animate-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#001c3c] via-[#003966] to-[#00558f] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center flex-shrink-0">
              <img 
                src="/logo.svg" 
                alt="Logo GEKRAFS Kota Batu" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-[#ffc72c] text-[10px] font-extrabold uppercase tracking-wider mb-1 border border-amber-400/30">
                <Sparkles className="w-3 h-3" />
                <span>Mode Aplikasi Penuh</span>
              </div>
              <h3 className="text-lg font-black text-white leading-tight">
                Pasang di Layar Utama HP
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                GEKRAFS PartnerUp Kota Batu
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Keunggulan Full Screen */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-bold text-[#001c3c] uppercase tracking-wide flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#004c80]" />
              <span>Manfaat Memasang Aplikasi:</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span><strong>Layar Penuh (Full Screen)</strong> tanpa bilah alamat URL browser.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Ikon resmi muncul di menu HP seperti aplikasi Play Store / App Store.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Buka seketika tanpa perlu mengetik ulang link website.</span>
              </li>
            </ul>
          </div>

          {/* iOS Safari Instructions */}
          {isIOS ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-3">
              <div className="font-extrabold flex items-center gap-2 text-amber-800">
                <Share className="w-4 h-4 text-amber-600" />
                <span>Cara Pasang di iPhone / iPad (Safari):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-amber-800 font-medium pl-1">
                <li>Ketuk tombol <strong>Bagikan (Share)</strong> <span className="inline-block px-1.5 py-0.5 bg-white rounded border border-amber-300 text-[11px] font-bold">⎋</span> di bilah bawah browser Safari.</li>
                <li>Gulir ke bawah dan ketuk opsi <strong>"Tambahkan ke Layar Utama"</strong> (<em>Add to Home Screen</em>).</li>
                <li>Ketuk <strong>"Tambah"</strong> di pojok kanan atas. Selesai!</li>
              </ol>
            </div>
          ) : deferredPrompt ? (
            /* Android / Chrome One-Click Install Button */
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-[#001c3c] hover:bg-[#003966] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#001c3c]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#ffc72c]" />
              <span>Pasang Sekarang (Instal Otomatis)</span>
            </button>
          ) : isStandalone ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 text-center">
              ✓ Aplikasi sudah terpasang dalam mode Standalone di perangkat Anda!
            </div>
          ) : (
            /* General Browser instructions (Android Chrome, Edge, etc.) */
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
              <div className="font-extrabold flex items-center gap-1.5">
                <PlusSquare className="w-4 h-4 text-[#004c80]" />
                <span>Petunjuk Pemasangan Cepat:</span>
              </div>
              <p className="leading-relaxed">
                Ketuk tombol menu browser Anda (tanda <strong>tiga titik ⋮</strong> di pojok kanan atas), lalu pilih <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Instal Aplikasi"</strong>.
              </p>
            </div>
          )}

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Tutup & Lanjutkan di Browser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
