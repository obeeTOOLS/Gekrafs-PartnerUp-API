import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, Share } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin;
  const shareMessage = `Halo rekan UMKM Batu! Pendaftaran Program Pendampingan Usaha UMKM "Gekrafs PartnerUp" Kota Batu sudah dibuka. Yuk daftarkan usaha kreatifmu sekarang dan ikuti rangkaian pendampingan gratis: ${appUrl}`;

  const handleShareWa = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gekrafs PartnerUp - Kota Batu',
          text: shareMessage,
          url: appUrl
        });
      } catch {
        // Ignored if user dismissed
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 z-10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-[#001c3c] text-lg">Bagikan Program</h3>
            <p className="text-xs text-slate-500">Ajak rekan UMKM kreatif Kota Batu mendaftar</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <button
            onClick={handleShareWa}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-all shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Bagikan ke WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#eaf2fb] text-[#004c80] font-bold hover:bg-[#dbe7f7] transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Teks Tersalin!' : 'Salin Pesan & Tautan'}</span>
          </button>

          {typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-xs"
            >
              <Share className="w-4 h-4" />
              <span>Bagikan Lewat Aplikasi Lain</span>
            </button>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
