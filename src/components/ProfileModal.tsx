import React, { useState, useEffect } from 'react';
import { PesertaItem } from '../types';
import { X, MessageCircle, Mail, Instagram, MapPin, Building, FileCheck, Wallet, KeyRound, Crown, CheckCircle2 } from 'lucide-react';
import { toWaLink } from '../utils/qrUtils';
import { kasService } from '../services/kasService';

interface ProfileModalProps {
  peserta: PesertaItem | null;
  onClose: () => void;
  onOpenUntungin?: (peserta: PesertaItem) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ peserta, onClose, onOpenUntungin }) => {
  if (!peserta) return null;

  const [premiumAccess, setPremiumAccess] = useState(() =>
    peserta ? kasService.getPremiumStatus(peserta.namaUsaha) : null
  );

  useEffect(() => {
    if (peserta) {
      setPremiumAccess(kasService.getPremiumStatus(peserta.namaUsaha));
    }
  }, [peserta]);

  const handleTogglePro = () => {
    if (!peserta) return;
    if (premiumAccess?.isPremium) {
      const revoked = kasService.revokePremiumAccess(peserta.namaUsaha);
      setPremiumAccess(revoked);
    } else {
      const granted = kasService.grantPremiumAccess(peserta.namaUsaha, 'Kurator PartnerUp', 'kurator');
      setPremiumAccess(granted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 z-10">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#001c3c] text-white p-5 rounded-t-2xl flex items-center justify-between z-10 border-b border-[#004c80]">
          <div>
            <div className="text-xs text-[#ffc72c] font-bold uppercase tracking-wider">Profil Usaha Peserta</div>
            <h2 className="text-xl font-bold mt-0.5">{peserta.namaUsaha}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-sm text-slate-700">
          {/* Status badge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status Kurasi</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                peserta.statusKurasi === 'Diterima'
                  ? 'bg-emerald-100 text-emerald-800'
                  : peserta.statusKurasi === 'Ditolak'
                  ? 'bg-rose-100 text-rose-800'
                  : peserta.statusKurasi === 'Lolos Wawancara'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {peserta.statusKurasi}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Nama Pemilik</div>
              <div className="font-semibold text-slate-900 mt-0.5">{peserta.namaPemilik}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Subsektor</div>
              <div className="font-semibold text-[#004c80] mt-0.5">{peserta.subsektor}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Nomor NIB</div>
              <div className="font-mono text-slate-800 mt-0.5">{peserta.nib || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Estimasi Omzet</div>
              <div className="font-medium text-slate-800 mt-0.5">{peserta.omzet || '-'}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Domisili & Alamat</span>
            </div>
            <div className="mt-0.5 text-slate-900">
              <span className="font-semibold">{peserta.kotaKabupaten || 'Kota Batu'}</span> — {peserta.alamatUsaha || '-'}
            </div>
          </div>

          {peserta.deskripsi && (
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                <span>Deskripsi Usaha & Produk</span>
              </div>
              <p className="mt-1 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed text-xs">
                {peserta.deskripsi}
              </p>
            </div>
          )}

          {peserta.catatanKurator && (
            <div>
              <div className="text-xs text-amber-700 font-semibold uppercase flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Catatan Kurator</span>
              </div>
              <p className="mt-1 text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs">
                {peserta.catatanKurator}
              </p>
            </div>
          )}

          {/* Action Links */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            {onOpenUntungin && (
              <div className="space-y-2 bg-gradient-to-br from-slate-50 to-purple-50/30 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Crown className={`w-3.5 h-3.5 ${premiumAccess?.isPremium ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
                    <span>Fitur Buku Kas Untungin</span>
                  </div>
                  {premiumAccess?.isPremium ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      <span>PRO (Aktif)</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                      Standar (Terkunci)
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span className="truncate max-w-[200px]">
                    {premiumAccess?.isPremium 
                      ? `Diaktifkan oleh: ${premiumAccess.grantedBy || 'Kurator'}`
                      : 'Belum diaktifkan oleh Kurator'}
                  </span>
                  <button
                    type="button"
                    onClick={handleTogglePro}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer shadow-2xs ${
                      premiumAccess?.isPremium
                        ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-200'
                        : 'bg-amber-400 hover:bg-amber-300 text-[#001c3c]'
                    }`}
                  >
                    {premiumAccess?.isPremium ? 'Cabut Akses Pro' : '✨ Beri Akses Pro (Lolos)'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenUntungin(peserta);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#001c3c] to-[#003366] text-white font-bold hover:from-[#002b55] transition-all shadow-sm cursor-pointer mt-1"
                >
                  <Wallet className="w-4 h-4 text-amber-300" />
                  <span>Buka Buku Kas Untungin ({peserta.namaUsaha})</span>
                </button>
                {(() => {
                  const pinData = kasService.getKasPin(peserta.namaUsaha);
                  return (
                    <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-amber-600" />
                        <span>Status PIN: {pinData.isDefaultPin ? 'Standar (123456)' : 'Kustom Terproteksi'}</span>
                      </span>
                      <span className="text-slate-400">Dapat di-reset via Dev Hub</span>
                    </div>
                  );
                })()}
              </div>
            )}

            <a
              href={toWaLink(peserta.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp ({peserta.whatsapp})</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              {peserta.email && (
                <a
                  href={`mailto:${peserta.email}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{peserta.email}</span>
                </a>
              )}
              {peserta.instagram && (
                <a
                  href={peserta.instagram.startsWith('http') ? peserta.instagram : `https://instagram.com/${peserta.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span className="truncate">Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
