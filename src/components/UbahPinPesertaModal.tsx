import React, { useState } from 'react';
import { Key, Eye, EyeOff, ShieldCheck, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService, DEFAULT_PESERTA_PIN } from '../services/authService';

interface UbahPinPesertaModalProps {
  isOpen: boolean;
  onClose: () => void;
  namaUsaha: string;
  namaPemilik?: string;
  onSuccess?: (message: string) => void;
}

export const UbahPinPesertaModal: React.FC<UbahPinPesertaModalProps> = ({
  isOpen,
  onClose,
  namaUsaha,
  namaPemilik,
  onSuccess
}) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanOld = oldPin.trim();
    const cleanNew = newPin.trim();
    const cleanConfirm = confirmNewPin.trim();

    if (!cleanOld || !cleanNew || !cleanConfirm) {
      setError('Seluruh kolom PIN wajib diisi.');
      return;
    }

    if (cleanNew.length < 4 || cleanNew.length > 8) {
      setError('PIN baru harus terdiri dari 4 sampai 8 digit angka.');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setError('Konfirmasi PIN baru tidak cocok.');
      return;
    }

    if (cleanOld === cleanNew) {
      setError('PIN baru tidak boleh sama dengan PIN saat ini.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = authService.updatePesertaPin(namaUsaha, cleanOld, cleanNew);

      if (res.success) {
        setSuccess('PIN akun Anda berhasil diubah! Gunakan PIN baru ini untuk login berikutnya.');
        if (onSuccess) onSuccess(res.message);
        setTimeout(() => {
          onClose();
          setOldPin('');
          setNewPin('');
          setConfirmNewPin('');
          setSuccess(null);
        }, 1800);
      } else {
        setError(res.message);
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 relative overflow-hidden animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 font-extrabold text-[10px] border border-blue-200 inline-block mb-1">
              Keamanan Akun Peserta
            </span>
            <h3 className="text-base font-black text-[#001c3c]">
              Ubah PIN Akun Usaha
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {namaUsaha} {namaPemilik && `· ${namaPemilik}`}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                PIN Saat Ini
              </label>
              <span className="text-[10px] text-slate-400">
                Bawaan: {DEFAULT_PESERTA_PIN}
              </span>
            </div>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                required
                placeholder="Masukkan PIN saat ini..."
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                maxLength={8}
                className="w-full px-3 py-2 pr-9 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              PIN Baru (4-8 Digit)
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                placeholder="Buat PIN baru..."
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                maxLength={8}
                className="w-full px-3 py-2 pr-9 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Konfirmasi PIN Baru
            </label>
            <input
              type={showNew ? 'text' : 'password'}
              required
              placeholder="Ulangi PIN baru..."
              value={confirmNewPin}
              onChange={(e) => setConfirmNewPin(e.target.value)}
              maxLength={8}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none font-mono font-bold"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#001c3c] hover:bg-[#002f5e] text-white text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan PIN Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
