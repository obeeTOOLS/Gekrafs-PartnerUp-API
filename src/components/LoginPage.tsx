import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  Users, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Phone,
  FileText,
  UserCheck
} from 'lucide-react';
import { authService } from '../services/authService';
import { gasService } from '../services/gasService';

interface LoginPageProps {
  onLoginSuccess: (type: 'engineer' | 'admin' | 'peserta', details?: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [activePortalTab, setActivePortalTab] = useState<'admin' | 'peserta'>('peserta');

  // Admin / Staff Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Peserta Login State
  const [pesertaMode, setPesertaMode] = useState<'registered' | 'new'>('registered');
  const [pesertaNamaUsaha, setPesertaNamaUsaha] = useState('');
  const [pesertaWhatsapp, setPesertaWhatsapp] = useState('');
  const [pesertaNamaPemilik, setPesertaNamaPemilik] = useState('');
  const [pesertaLoading, setPesertaLoading] = useState(false);
  const [pesertaError, setPesertaError] = useState<string | null>(null);
  const [pesertaSuccess, setPesertaSuccess] = useState<string | null>(null);

  // Handle Staff/Admin Login
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);

    setTimeout(() => {
      const result = authService.verifyAdminLogin(adminEmail, adminPassword);
      setAdminLoading(false);

      if (result.success) {
        if (result.authType === 'engineer') {
          onLoginSuccess('engineer', result.account);
        } else {
          onLoginSuccess('admin', result.account);
        }
      } else {
        setAdminError(result.message);
      }
    }, 400);
  };

  // Handle Peserta Verification / Login
  const handlePesertaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPesertaError(null);
    setPesertaSuccess(null);
    setPesertaLoading(true);

    setTimeout(() => {
      setPesertaLoading(false);

      if (pesertaMode === 'registered') {
        if (!pesertaNamaUsaha.trim() || !pesertaWhatsapp.trim()) {
          setPesertaError('Nama Usaha dan Nomor WhatsApp wajib diisi.');
          return;
        }

        const verification = gasService.verifyPesertaIdentity(pesertaNamaUsaha, pesertaWhatsapp);
        if (!verification.found) {
          setPesertaError(
            'Data peserta tidak ditemukan dengan kombinasi Nama Usaha & WhatsApp tersebut. Pastikan nama usaha dan nomor WhatsApp sama dengan formulir pendaftaran, atau hubungi panitia.'
          );
          return;
        }

        const finalNamaUsaha = verification.namaUsaha || pesertaNamaUsaha.trim();
        const finalWhatsapp = verification.whatsapp || pesertaWhatsapp.trim();
        const finalNamaPemilik = verification.namaPemilik || verification.matchedPeserta?.namaPemilik;

        authService.setPesertaSession({
          namaUsaha: finalNamaUsaha,
          whatsapp: finalWhatsapp,
          namaPemilik: finalNamaPemilik,
          isRegistered: true,
          loggedInAt: Date.now()
        });

        setPesertaSuccess(`Selamat datang kembali, ${finalNamaUsaha}! Mengalihkan...`);
        setTimeout(() => {
          onLoginSuccess('peserta', {
            namaUsaha: finalNamaUsaha,
            whatsapp: finalWhatsapp,
            targetTab: 'asesmen'
          });
        }, 800);
      } else {
        // Mode Daftar Baru (Calon Peserta Baru)
        if (!pesertaNamaUsaha.trim() || !pesertaNamaPemilik.trim()) {
          setPesertaError('Nama Usaha dan Nama Pemilik wajib diisi.');
          return;
        }

        authService.setPesertaSession({
          namaUsaha: pesertaNamaUsaha.trim(),
          whatsapp: pesertaWhatsapp.trim(),
          namaPemilik: pesertaNamaPemilik.trim(),
          isRegistered: false,
          loggedInAt: Date.now()
        });

        setPesertaSuccess('Identitas tercatat. Membuka formulir pendaftaran resmi...');
        setTimeout(() => {
          onLoginSuccess('peserta', {
            namaUsaha: pesertaNamaUsaha.trim(),
            namaPemilik: pesertaNamaPemilik.trim(),
            whatsapp: pesertaWhatsapp.trim(),
            targetTab: 'pendaftaran'
          });
        }, 800);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001730] via-[#001c3c] to-[#002850] text-[#10233d] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="max-w-md w-full mx-auto text-center z-10 pt-2 sm:pt-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl mb-3">
          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md">
            <img 
              src="/logo.svg" 
              alt="Logo Resmi Gekrafs Kota Batu" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          GEKRAFS PARTNERUP
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
          Program Inkubasi & Akselerasi Ekosistem Ekonomi Kreatif Kota Batu
        </p>
        <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-amber-300">
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Portal Masuk Terpadu &middot; Akses Terproteksi</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-6 z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Portal Switcher Tabs */}
          <div className="grid grid-cols-2 bg-slate-100/90 p-1.5 border-b border-slate-200">
            {/* Tombol Kiri: Peserta UMKM (Default) */}
            <button
              type="button"
              onClick={() => {
                setActivePortalTab('peserta');
                setPesertaError(null);
                setPesertaSuccess(null);
              }}
              className={`py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activePortalTab === 'peserta'
                  ? 'bg-white text-[#001c3c] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className={`w-4 h-4 ${activePortalTab === 'peserta' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Peserta UMKM</span>
            </button>

            {/* Tombol Kanan: Staff & Kurator */}
            <button
              type="button"
              onClick={() => {
                setActivePortalTab('admin');
                setAdminError(null);
              }}
              className={`py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activePortalTab === 'admin'
                  ? 'bg-white text-[#001c3c] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activePortalTab === 'admin' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Staff & Kurator</span>
            </button>
          </div>

          <div className="p-6 sm:p-7">
            {/* TAB 1: STAFF & KURATOR LOGIN */}
            {activePortalTab === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#001c3c]">
                    Masuk Portal Staff & Manajemen
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Khusus Lead Developer, Kurator, Panitia, dan Pimpinan terdaftar di whitelist.
                  </p>
                </div>

                {adminError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{adminError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Alamat Email Terdaftar
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="contoh: kurator.gekrafs@gmail.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-[#004c80] outline-none text-slate-900 bg-white font-medium"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Password / PIN Akun
                    </label>
                    <span className="text-[10px] text-slate-500">
                      Default: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">Gekrafs2026!</code> (Kurator)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      placeholder="Masukkan password Anda..."
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-[#004c80] outline-none text-slate-900 bg-white font-mono"
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      title={showAdminPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full py-3 rounded-xl bg-[#001c3c] hover:bg-[#003866] active:bg-[#001730] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {adminLoading ? (
                    <span>Memverifikasi Akun...</span>
                  ) : (
                    <>
                      <span>Masuk Portal Manajemen</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center border-t border-slate-100">
                  <p className="text-[11px] text-slate-400">
                    Akses dikontrol penuh melalui Whitelist Admin. Hubungi Lead Developer jika Anda belum didaftarkan.
                  </p>
                </div>
              </form>
            )}

            {/* TAB 2: PESERTA UMKM PORTAL */}
            {activePortalTab === 'peserta' && (
              <form onSubmit={handlePesertaSubmit} className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#001c3c]">
                    Portal Peserta UMKM Kota Batu
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Akses pendaftaran, pengisian asesmen 5 pilar, jadwal kelas, dan absensi QR.
                  </p>
                </div>

                {/* Sub-toggle: Terdaftar vs Baru */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setPesertaMode('registered');
                      setPesertaError(null);
                    }}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      pesertaMode === 'registered' ? 'bg-white text-[#001c3c] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Sudah Mendaftar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPesertaMode('new');
                      setPesertaError(null);
                    }}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      pesertaMode === 'new' ? 'bg-white text-[#001c3c] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Daftar Baru
                  </button>
                </div>

                {pesertaError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{pesertaError}</span>
                  </div>
                )}

                {pesertaSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{pesertaSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Nama Usaha / Brand
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="contoh: Apel Batu Sejahtera"
                      value={pesertaNamaUsaha}
                      onChange={(e) => setPesertaNamaUsaha(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none text-slate-900 bg-white font-medium"
                    />
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {pesertaMode === 'registered' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Nomor WhatsApp Terdaftar
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="contoh: 08123456789"
                        value={pesertaWhatsapp}
                        onChange={(e) => setPesertaWhatsapp(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none text-slate-900 bg-white font-medium"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Masukkan nomor WhatsApp yang Anda gunakan saat mengisi pendaftaran awal
                    </span>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                        Nama Pemilik Usaha
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="contoh: Budi Santoso"
                          value={pesertaNamaPemilik}
                          onChange={(e) => setPesertaNamaPemilik(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none text-slate-900 bg-white font-medium"
                        />
                        <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                        Nomor WhatsApp Aktif
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="contoh: 08123456789"
                          value={pesertaWhatsapp}
                          onChange={(e) => setPesertaWhatsapp(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none text-slate-900 bg-white font-medium"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={pesertaLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {pesertaLoading ? (
                    <span>Memverifikasi...</span>
                  ) : pesertaMode === 'registered' ? (
                    <>
                      <span>Masuk Portal Peserta</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Mulai Isi Formulir Pendaftaran</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center border-t border-slate-100">
                  <p className="text-[11px] text-slate-400">
                    {pesertaMode === 'registered' 
                      ? 'Belum mendaftar? Klik tab "Daftar Baru" di atas untuk memulai.'
                      : 'Pendaftaran terbuka untuk seluruh pelaku ekonomi kreatif berdomisili di Kota Batu.'}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* PWA Install Notice for Mobile Users */}
      <div className="max-w-md w-full mx-auto z-10 px-2">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#004c80] flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-100">
            <Sparkles className="w-4 h-4 text-[#004c80]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#001c3c] block">Pasang di Layar Utama HP:</span>
            <span className="text-slate-500 leading-relaxed block mt-0.5">
              Di Android (Chrome): Ketuk menu titik tiga <strong className="text-slate-700">⋮</strong> lalu pilih <strong className="text-[#004c80]">"Instal Aplikasi"</strong>.<br />
              Di iPhone (Safari): Ketuk tombol <strong className="text-slate-700">Bagikan</strong> lalu pilih <strong className="text-[#004c80]">"Tambah ke Layar Utama"</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* Footer Branding & Security Badge */}
      <div className="max-w-md w-full mx-auto text-center z-10 pb-2">
        <p className="text-[11px] text-slate-400 font-medium">
          &copy; 2026 DPC GEKRAFS Kota Batu &middot; PartnerUp System v2.5
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Seluruh data pendaftaran dan kurasi dilindungi enkripsi Google Workspace & Apps Script.
        </p>
      </div>
    </div>
  );
};
