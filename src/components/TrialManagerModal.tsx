import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Plus, 
  RotateCcw, 
  Check, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Crown, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { kasService, KasPremiumAccess } from '../services/kasService';

interface TrialManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  namaUsaha: string;
  namaPemilik?: string;
  onUpdated: (newAccess: KasPremiumAccess) => void;
  onGrantPro?: () => void;
  isDeveloper?: boolean;
}

export const TrialManagerModal: React.FC<TrialManagerModalProps> = ({
  isOpen,
  onClose,
  namaUsaha,
  namaPemilik,
  onUpdated,
  onGrantPro,
  isDeveloper = false
}) => {
  const [currentStatus, setCurrentStatus] = useState<KasPremiumAccess>(() => 
    kasService.getPremiumStatus(namaUsaha)
  );

  // States form perpanjangan
  const [additionalTx, setAdditionalTx] = useState<number>(15);
  const [customTx, setCustomTx] = useState<string>('');
  const [resetUsage, setResetUsage] = useState<boolean>(false);

  const [additionalDays, setAdditionalDays] = useState<number>(14);
  const [customDays, setCustomDays] = useState<string>('');

  const [kuratorName, setKuratorName] = useState<string>('Kurator PartnerUp');
  const [notes, setNotes] = useState<string>('Perpanjangan masa pembinaan kurasi UMKM');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && namaUsaha) {
      const status = kasService.getPremiumStatus(namaUsaha);
      setCurrentStatus(status);
      setIsSuccess(false);
    }
  }, [isOpen, namaUsaha]);

  if (!isOpen) return null;

  const currentLimit = currentStatus.transactionLimit ?? 10;
  const currentUsed = currentStatus.usedTransactions ?? 0;
  const effectiveRemainingTx = currentStatus.remainingTransactions ?? 0;
  const remainingDays = currentStatus.remainingDays ?? 0;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    const txBonus = customTx ? parseInt(customTx, 10) || 0 : additionalTx;
    const daysBonus = customDays ? parseInt(customDays, 10) || 0 : additionalDays;

    const updated = kasService.updateTrialConfig(namaUsaha, {
      additionalTransactions: txBonus > 0 ? txBonus : undefined,
      additionalDays: daysBonus > 0 ? daysBonus : undefined,
      resetUsed: resetUsage,
      grantedBy: kuratorName.trim() || 'Kurator PartnerUp',
      notes: notes.trim()
    });

    setCurrentStatus(updated);
    setIsSuccess(true);
    onUpdated(updated);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#001c3c] via-[#002f5e] to-[#004c80] p-4 sm:p-5 text-white flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-xs flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-base sm:text-lg tracking-tight truncate">
                Pengaturan Kredit & Masa Trial
              </h3>
              <p className="text-xs text-slate-300 truncate mt-0.5">
                {namaUsaha} {namaPemilik ? `· ${namaPemilik}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          
          {/* Status Live Saat Ini */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status Akun Kas Saat Ini
              </span>
              {currentStatus.isPremium ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>Pro Aktif (Unlimited)</span>
                </span>
              ) : currentStatus.isTrialActive ? (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Trial Berjalan</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[11px] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Trial Kedaluwarsa</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <div className="text-slate-500 font-medium">Batas Kredit Transaksi:</div>
                <div className="font-black text-sm text-[#001c3c] mt-0.5">
                  {currentUsed} / {currentLimit} tx
                  <span className={`ml-1 text-[11px] font-bold ${effectiveRemainingTx > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    (Sisa {effectiveRemainingTx})
                  </span>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <div className="text-slate-500 font-medium">Masa Aktif Trial:</div>
                <div className="font-black text-sm text-[#001c3c] mt-0.5">
                  {remainingDays > 0 ? `${remainingDays} Hari Tersisa` : '0 Hari (Habis)'}
                </div>
              </div>
            </div>

            {currentStatus.lastExtendedAt && (
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Terakhir diperpanjang oleh: <strong>{currentStatus.extendedBy || 'Kurator'}</strong></span>
              </div>
            )}
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            
            {/* Bagian 1: Tambah Kredit Kuota Transaksi */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tambah Kredit Kuota Transaksi</span>
                </label>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Total nanti: <strong>{currentLimit + (customTx ? parseInt(customTx, 10) || 0 : additionalTx)} tx</strong>
                </span>
              </div>

              {/* Tombol Cepat Tx */}
              <div className="grid grid-cols-4 gap-1.5">
                {[10, 15, 25, 50].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAdditionalTx(val);
                      setCustomTx('');
                    }}
                    className={`py-2 px-1 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                      !customTx && additionalTx === val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    +{val} tx
                  </button>
                ))}
              </div>

              {/* Input Angka Kustom */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Atau jumlah kustom:</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="Contoh: 35"
                  value={customTx}
                  onChange={(e) => setCustomTx(e.target.value)}
                  className="w-28 text-xs font-bold p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-500 font-medium">transaksi</span>
              </div>

              {/* Checkbox Reset Usage */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={resetUsage}
                  onChange={(e) => setResetUsage(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold">
                  Reset pemakaian transaksi saat ini kembali ke 0 (peserta dapat kuota baru utuh)
                </span>
              </label>
            </div>

            {/* Bagian 2: Perpanjangan Hari Aktif */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>Perpanjang Masa Aktif (Hari)</span>
                </label>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Tambah: <strong>{customDays ? parseInt(customDays, 10) || 0 : additionalDays} hari</strong>
                </span>
              </div>

              {/* Tombol Cepat Hari */}
              <div className="grid grid-cols-4 gap-1.5">
                {[7, 14, 30, 60].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAdditionalDays(val);
                      setCustomDays('');
                    }}
                    className={`py-2 px-1 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                      !customDays && additionalDays === val
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs ring-2 ring-purple-500/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    +{val} hari
                  </button>
                ))}
              </div>

              {/* Input Hari Kustom */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Atau durasi kustom:</span>
                <input
                  type="number"
                  min="0"
                  max="365"
                  placeholder="Contoh: 21"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className="w-28 text-xs font-bold p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-500 font-medium">hari tambahan</span>
              </div>
            </div>

            {/* Bagian 3: Kurator & Catatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Otorisasi / Nama Kurator:
                </label>
                <input
                  type="text"
                  value={kuratorName}
                  onChange={(e) => setKuratorName(e.target.value)}
                  placeholder="Kurator PartnerUp"
                  className="w-full text-xs font-medium p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Catatan / Alasan:
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alasan perpanjangan trial"
                  className="w-full text-xs font-medium p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSuccess}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#001c3c] to-[#004c80] hover:from-[#002855] hover:to-[#005c99] text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Trial Berhasil Diperpanjang!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Terapkan Perpanjangan Trial</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Opsi Pintas: Beri Akses Pro Penuh (Eksklusif Developer / Site Engineer) */}
          {isDeveloper && onGrantPro && !currentStatus.isPremium && (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Crown className="w-4 h-4 fill-amber-500 text-amber-600 flex-shrink-0" />
                <div className="text-xs truncate">
                  <span className="font-bold text-[#001c3c] block">👑 Otoritas Developer</span>
                  <span className="text-slate-600 text-[11px]">Buka akses Pro Lifetime tanpa batas untuk usaha ini</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onGrantPro();
                  onClose();
                }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#001c3c] font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex-shrink-0"
              >
                Beri Pro Lifetime
              </button>
            </div>
          )}

          {/* Edukasi Hak Akses untuk Kurator */}
          {!isDeveloper && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">Otoritas Kurator:</span> Anda memiliki wewenang penuh menambah kuota transaksi dan memperpanjang masa trial selama proses pembinaan. Penerbitan lisensi Pro tanpa batas maupun kode voucher resmi dikelola secara eksklusif oleh Lead Developer.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
