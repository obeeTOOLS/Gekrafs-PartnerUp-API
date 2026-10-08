import React, { useState } from 'react';
import { KeyRound, X, Eye, EyeOff, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { kasService } from '../services/kasService';

interface UbahPinPesertaModalProps {
  isOpen: boolean;
  onClose: () => void;
  namaUsaha: string;
  namaPemilik?: string;
}

export const UbahPinPesertaModal: React.FC<UbahPinPesertaModalProps> = ({
  isOpen,
  onClose,
  namaUsaha,
  namaPemilik
}) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!oldPin.trim()) {
      setError('Silakan masukkan PIN saat ini (default: 123456).');
      return;
    }

    if (!newPin.trim() || newPin.trim().length < 4) {
      setError('PIN baru minimal harus 4 karakter / angka.');
      return;
    }

    if (newPin.trim() !== confirmPin.trim()) {
      setError('Konfirmasi PIN baru tidak cocok.');
      return;
    }

    const res = kasService.changeKasPin(namaUsaha, oldPin.trim(), newPin.trim());
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
        setOldPin('');
        setNewPin('');
        setConfirmPin('');
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#001c3c]">
                Ubah PIN Buku Kas
              </h4>
              <p className="text-[11px] text-slate-500">
                {namaUsaha} {namaPemilik ? `· ${namaPemilik}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              PIN Saat Ini
            </label>
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={24}
              required
              placeholder="PIN saat ini (default: 123456)"
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              PIN Baru (Min. 4 Digit)
            </label>
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={24}
              required
              placeholder="Masukkan PIN baru..."
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Konfirmasi PIN Baru
            </label>
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={24}
              required
              placeholder="Ulangi PIN baru..."
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showPin}
                onChange={(e) => setShowPin(e.target.checked)}
                className="rounded text-purple-600"
              />
              <span>Tampilkan Karakter PIN</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simpan PIN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
