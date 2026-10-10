import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Activity, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  ShieldCheck, 
  Store, 
  Terminal, 
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { PresenceSummary, ActiveUserItem } from '../services/presenceService';

interface ActiveUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  presenceData: PresenceSummary;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const TAB_NAMES: Record<string, string> = {
  pendaftaran: 'Form Pendaftaran',
  timeline: 'Timeline & Jadwal',
  asesmen: 'Asesmen Mandiri',
  tugas: 'Lembar Aksi / Roadmap',
  kehadiran: 'Presensi QR',
  katalog: 'Direktori Ekraf',
  admin: 'Dashboard Kurator',
  pengaturan: 'Pengaturan Akses',
  grafik: 'Analitik & Radar Bisnis',
  developer: 'Dev Console Hub'
};

export const ActiveUsersModal: React.FC<ActiveUsersModalProps> = ({
  isOpen,
  onClose,
  presenceData,
  onRefresh,
  isRefreshing = false
}) => {
  const [filterRole, setFilterRole] = useState<'all' | 'peserta' | 'admin'>('all');

  if (!isOpen) return null;

  const users = presenceData?.users || [];
  const counts = presenceData?.counts || { total: 0, peserta: 0, admin: 0, developer: 0 };

  const filteredUsers = users.filter((u) => {
    if (filterRole === 'peserta') return u.role === 'peserta';
    if (filterRole === 'admin') return u.role === 'admin' || u.role === 'developer';
    return true;
  });

  const formatDuration = (loginTime: number) => {
    const minutes = Math.floor((Date.now() - loginTime) / 60000);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    return `${hours} jam ${minutes % 60} mnt`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#001c3c] via-[#002f5e] to-[#004c80] p-4 sm:p-5 text-white flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-xs flex-shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight truncate">
                  Pengguna Sedang Login
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate">
                Monitoring aktivitas sesi real-time web apps Gekrafs PartnerUp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Perbarui data sekarang"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ringkasan Statistik Cepat */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => setFilterRole('all')}
            className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              filterRole === 'all'
                ? 'bg-white border-[#004c80] shadow-sm ring-2 ring-[#004c80]/20'
                : 'bg-white/60 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Online</div>
            <div className="text-xl sm:text-2xl font-black text-[#001c3c] mt-0.5 flex items-baseline gap-1.5">
              <span>{counts.total}</span>
              <span className="text-[10px] text-emerald-600 font-bold">Aktif</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFilterRole('peserta')}
            className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              filterRole === 'peserta'
                ? 'bg-white border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                : 'bg-white/60 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Peserta UMKM</div>
            <div className="text-xl sm:text-2xl font-black text-blue-700 mt-0.5 flex items-baseline gap-1.5">
              <span>{counts.peserta}</span>
              <span className="text-[10px] text-slate-400 font-normal">Usaha</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFilterRole('admin')}
            className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              filterRole === 'admin'
                ? 'bg-white border-purple-500 shadow-sm ring-2 ring-purple-500/20'
                : 'bg-white/60 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kurator & Dev</div>
            <div className="text-xl sm:text-2xl font-black text-purple-700 mt-0.5 flex items-baseline gap-1.5">
              <span>{counts.admin + counts.developer}</span>
              <span className="text-[10px] text-slate-400 font-normal">Internal</span>
            </div>
          </button>
        </div>

        {/* Daftar User yang Sedang Login */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
              <h4 className="text-sm font-bold text-slate-700">Tidak ada sesi aktif pada kategori ini</h4>
              <p className="text-xs text-slate-500 mt-1">
                Data akan otomatis terisi saat ada pengguna yang membuka web apps.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isDev = user.role === 'developer';
              const isAdmin = user.role === 'admin';
              const isPeserta = user.role === 'peserta';

              return (
                <div
                  key={user.id}
                  className="p-3 sm:p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                      isDev
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : isAdmin
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {isDev ? (
                        <Terminal className="w-5 h-5" />
                      ) : isAdmin ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <Store className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#001c3c] truncate">
                          {user.namaUsaha}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isDev
                            ? 'bg-purple-100 text-purple-800'
                            : isAdmin
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isDev ? 'Lead Developer' : isAdmin ? 'Tim Kurator' : 'Peserta UMKM'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                        {user.namaPemilik && (
                          <span className="font-medium text-slate-700 truncate">
                            {user.namaPemilik}
                          </span>
                        )}
                        <span className="text-slate-300">&middot;</span>
                        <span className="text-slate-600 truncate flex items-center gap-1">
                          <Compass className="w-3 h-3 text-slate-400" />
                          <span>Buka: <strong>{TAB_NAMES[user.activeTab] || user.activeTab}</strong></span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Online</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      {user.deviceType === 'mobile' ? (
                        <span title="Membuka lewat HP / Mobile PWA" className="flex items-center gap-0.5">
                          <Smartphone className="w-3 h-3" />
                          <span>HP</span>
                        </span>
                      ) : (
                        <span title="Membuka lewat Laptop / Desktop" className="flex items-center gap-0.5">
                          <Monitor className="w-3 h-3" />
                          <span>Desktop</span>
                        </span>
                      )}
                      <span>&middot;</span>
                      <span title="Durasi sesi aktif">{formatDuration(user.loginTime)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Modal */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Sesi diperbarui otomatis setiap 25 detik via heartbeat real-time.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#001c3c] hover:bg-[#002f5e] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer self-end sm:self-auto"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
