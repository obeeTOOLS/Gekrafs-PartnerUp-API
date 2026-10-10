import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Copy, 
  Check, 
  Share, 
  QrCode, 
  Download, 
  Smartphone, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { 
  generateQrSvgUrl, 
  getAppLoginInstallUrl, 
  downloadAppInstallBrandedQrPngFile 
} from '../utils/qrUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'wa'>('qr');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const loginAppUrl = getAppLoginInstallUrl();
  const baseAppUrl = window.location.origin;
  const shareMessage = `Halo rekan UMKM Batu! Akses & Pendaftaran Program Inkubasi UMKM "Gekrafs PartnerUp" Kota Batu sudah dibuka. Yuk scan atau buka link ini untuk masuk ke menu login dan memasang aplikasi di HP: ${loginAppUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(loginAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleShareWa = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleDownloadQrPng = async () => {
    setIsDownloading(true);
    try {
      await downloadAppInstallBrandedQrPngFile({
        url: loginAppUrl,
        title: 'Scan QR Code untuk Membuka & Pasang Aplikasi di HP',
        subtitle: 'Peserta otomatis diarahkan ke Menu Login untuk verifikasi & pendaftaran',
        badgeText: 'MENU LOGIN & PASANG APLIKASI'
      });
    } catch (e) {
      console.error('Gagal mengunduh poster QR aplikasi', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gekrafs PartnerUp Kota Batu',
          text: shareMessage,
          url: loginAppUrl
        });
      } catch {
        // Dismissed
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full my-auto border border-slate-200 z-10 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="bg-[#001c3c] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#ffc72c] text-[#001c3c]">
              GEKRAFS KOTA BATU
            </span>
          </div>
          <h3 className="font-extrabold text-white text-lg sm:text-xl">
            Akses & Install Web App
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            QR resmi untuk peserta agar langsung diarahkan ke Menu Login dan memasang aplikasi
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'border-[#004c80] text-[#004c80] bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code & Poster</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('wa')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'wa'
                ? 'border-[#004c80] text-[#004c80] bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Bagikan WhatsApp</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {activeTab === 'qr' && (
            <div className="space-y-4">
              {/* Branded Card Preview (Mirip QR Absensi) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm relative text-center max-w-[280px] w-full">
                  
                  {/* Badge Status */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004c80] text-[10px] font-black uppercase tracking-wider mb-2 border border-blue-200">
                    <Smartphone className="w-3 h-3 text-[#004c80]" />
                    <span>Menu Login & Install App</span>
                  </div>

                  <div className="text-[11px] font-extrabold text-[#001c3c] mb-1">
                    Aplikasi Web PartnerUp
                  </div>

                  {/* QR Image with Center Badge */}
                  <div className="relative inline-block mx-auto my-1">
                    <img
                      src={generateQrSvgUrl(loginAppUrl, 200)}
                      alt="QR Web App Install & Login"
                      className="w-40 h-40 sm:w-44 sm:h-44 bg-white p-1.5 rounded-xl border border-slate-200"
                    />
                    {/* Badge Tengah: INSTALL APP */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-11 h-11 rounded-lg bg-[#001c3c] border-2 border-[#ffc72c] ring-2 ring-white flex flex-col items-center justify-center shadow-md text-center">
                        <span className="text-[6px] font-black text-[#ffc72c] leading-tight">INSTALL</span>
                        <span className="text-[8px] font-black text-white leading-tight">APP</span>
                        <span className="text-[5px] font-bold text-slate-300">BATU</span>
                      </div>
                    </div>
                  </div>

                  {/* Di Bawah QR: Tulisan PartnerUp */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-col items-center">
                    <span className="text-sm font-black text-[#001c3c] tracking-tight">PartnerUp</span>
                    <div className="w-8 h-0.5 bg-[#ffc72c] mt-0.5 mb-1 rounded-full" />
                    <span className="text-[9px] font-bold text-slate-400">GEKRAFS KOTA BATU</span>
                  </div>
                </div>

                {/* Info Text */}
                <p className="mt-2 text-[11px] text-slate-500 max-w-xs leading-relaxed">
                  Saat di-scan, link membuka <strong>Menu Login</strong> secara langsung, bukan bypass ke dalam aplikasi.
                </p>

                {/* Action Buttons */}
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 w-full max-w-xs">
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={handleDownloadQrPng}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'Menyiapkan...' : 'Download Poster PNG'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-xs cursor-pointer transition-all"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Tersalin!' : 'Salin URL Login'}</span>
                  </button>
                </div>

                <a
                  href={loginAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#004c80] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Uji Buka URL di Tab Baru ({loginAppUrl})</span>
                </a>
              </div>

              {/* Petunjuk Pasang di Layar Utama */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-2">
                <div className="font-bold text-[#001c3c] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#004c80]" />
                  <span>Petunjuk Pasang Aplikasi (PWA) di HP Peserta:</span>
                </div>
                <div className="space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                  <p>
                    <strong className="text-slate-800">Di Android (Google Chrome):</strong> Ketuk menu titik tiga <span className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">⋮</span> di pojok kanan atas, lalu pilih <strong>"Instal Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                  </p>
                  <p>
                    <strong className="text-slate-800">Di iPhone (Safari):</strong> Ketuk tombol <strong>Bagikan (Share)</strong> di bagian bawah, scroll ke bawah lalu pilih <strong>"Tambah ke Layar Utama"</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wa' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                <span className="font-bold text-slate-700 block mb-1">Pratinjau Pesan:</span>
                <p className="text-slate-600 text-xs leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200">
                  "{shareMessage}"
                </p>
              </div>

              <button
                type="button"
                onClick={handleShareWa}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-all shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Bagikan ke WhatsApp Sekarang</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#eaf2fb] text-[#004c80] font-bold hover:bg-[#dbe7f7] transition-colors cursor-pointer"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'Pesan Lengkap Tersalin!' : 'Salin Teks Undangan'}</span>
              </button>

              {typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-xs cursor-pointer"
                >
                  <Share className="w-4 h-4" />
                  <span>Bagikan Lewat Aplikasi Lain</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-mono">
            ?page=login
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
