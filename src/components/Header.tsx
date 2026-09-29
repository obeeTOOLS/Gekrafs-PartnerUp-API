import React from 'react';
import { 
  ShieldCheck, 
  Share2, 
  HelpCircle, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CloudDownload,
  LogOut,
  Terminal,
  Layers,
  ChevronDown
} from 'lucide-react';
import { EngineerSession } from '../services/authService';
import { UserRole } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
  onOpenHelp: () => void;
  onOpenShare: () => void;
  syncState: { status: string; message: string; lastSyncTime?: string };
  onRefreshData: () => void;
  onPullFromSheet: () => void;
  isPulling?: boolean;
  engineerSession: EngineerSession | null;
  onOpenEngineerModal: () => void;
  onSwitchPerspective: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  onAdminLogout,
  onOpenHelp,
  onOpenShare,
  syncState,
  onRefreshData,
  onPullFromSheet,
  isPulling = false,
  engineerSession,
  onOpenEngineerModal,
  onSwitchPerspective
}) => {
  // Navigation items: Default for public
  const publicNavItems = [
    { id: 'pendaftaran', label: 'Pendaftaran' },
    { id: 'timeline', label: 'Timeline & Jadwal' },
    { id: 'asesmen', label: 'Asesmen Mandiri' },
    { id: 'kehadiran', label: 'Absensi' }
  ];

  const isObeeTools = engineerSession?.email === 'obeetools@gmail.com';
  const hasEngineerAccess = !!engineerSession;
  const currentPerspective = engineerSession?.activePerspective || 'peserta';

  return (
    <header className="sticky top-0 z-30 bg-[#001c3c] border-b border-[#004c80] text-white shadow-md">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-[#004c80] via-[#ffc72c] to-[#0070b3]" />

      {/* Special Engineer Perspective Banner if obeetools@gmail.com is in Peserta simulation mode */}
      {isObeeTools && currentPerspective === 'peserta' && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#001c3c] text-white text-xs px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-purple-500/30">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-purple-200">
              Simulasi Lapangan Peserta UMKM (Aktif: <strong className="text-white">obeetools@gmail.com</strong>)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-300 hidden sm:inline">Ganti Peran Cepat:</span>
            <button
              type="button"
              onClick={() => onSwitchPerspective('developer')}
              className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow transition-colors"
            >
              Mode Dev
            </button>
            <button
              type="button"
              onClick={() => onSwitchPerspective('admin')}
              className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-[#001c3c] font-bold text-[11px] shadow transition-colors"
            >
              Mode Kurator
            </button>
            <button
              type="button"
              onClick={onOpenEngineerModal}
              title="Buka Pengaturan Engineer"
              className="p-1 rounded text-purple-300 hover:text-white hover:bg-white/10"
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTab('pendaftaran')}
              className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none group min-w-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center p-1 sm:p-1.5 shadow-sm group-hover:ring-2 ring-[#ffc72c] transition-all flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#001c3c]" fill="currentColor">
                  <polygon points="50,5 95,25 95,75 50,95 5,25" fill="#001c3c" />
                  <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="#ffc72c" />
                  <text x="50" y="60" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#001c3c">GK</text>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-lg font-bold tracking-tight text-white group-hover:text-[#ffc72c] transition-colors truncate block">
                    Gekrafs PartnerUp
                  </span>
                  {hasEngineerAccess && (
                    <span className="hidden lg:inline-block text-[10px] bg-purple-500/30 text-purple-300 border border-purple-400/40 px-1.5 py-0.2 rounded font-mono">
                      ENG
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-[11px] text-[#ffc72c] font-medium tracking-wide uppercase">
                  Kota Batu
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {publicNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#004c80] text-white shadow-inner font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* If Admin is Authenticated or Engineer is active: show Admin Portal Tab */}
            {(isAdminLoggedIn || hasEngineerAccess) && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-[15px] font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-amber-400 text-[#001c3c] font-bold shadow'
                    : 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Portal Kurator</span>
              </button>
            )}

            {/* If Engineer is active: show Developer Console Tab */}
            {hasEngineerAccess && (
              <button
                onClick={() => setActiveTab('developer')}
                className={`px-3 py-1.5 rounded-lg text-[15px] font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'developer'
                    ? 'bg-purple-600 text-white font-bold shadow'
                    : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Dev Hub</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions, Engineer Pill & Live Pull Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Engineer Pill & Quick Role Switcher (Especially for obeetools@gmail.com) */}
            {hasEngineerAccess ? (
              <div className="flex items-center gap-1 bg-white/5 border border-purple-400/30 rounded-xl p-1">
                {/* obeetools role switcher buttons */}
                {isObeeTools ? (
                  <div className="hidden lg:flex items-center bg-black/30 rounded-lg p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => onSwitchPerspective('developer')}
                      className={`px-2 py-1 rounded transition-colors ${
                        currentPerspective === 'developer'
                          ? 'bg-purple-600 text-white shadow'
                          : 'text-slate-300 hover:text-white'
                      }`}
                      title="Peran Developer (Akses Penuh Arsitektur & Console)"
                    >
                      Dev
                    </button>
                    <button
                      type="button"
                      onClick={() => onSwitchPerspective('admin')}
                      className={`px-2 py-1 rounded transition-colors ${
                        currentPerspective === 'admin'
                          ? 'bg-amber-400 text-[#001c3c] shadow'
                          : 'text-slate-300 hover:text-white'
                      }`}
                      title="Peran Admin/Kurator (Manajemen Peserta & Kurasi)"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => onSwitchPerspective('peserta')}
                      className={`px-2 py-1 rounded transition-colors ${
                        currentPerspective === 'peserta'
                          ? 'bg-emerald-500 text-white shadow'
                          : 'text-slate-300 hover:text-white'
                      }`}
                      title="Peran Peserta (Simulasi Tampilan Lapangan)"
                    >
                      Peserta
                    </button>
                  </div>
                ) : null}

                {/* Engineer badge / click to open modal */}
                <button
                  type="button"
                  onClick={onOpenEngineerModal}
                  title="Panel Otorisasi Engineer & Manajemen Akun"
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold transition-all"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline font-mono truncate max-w-[110px]">
                    {engineerSession.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>
              </div>
            ) : null}

            {/* Tombol Tarik Data Langsung dari Google Sheets */}
            <button
              type="button"
              onClick={onPullFromSheet}
              disabled={isPulling}
              title="Tarik & Sinkronkan data langsung dari Google Sheets asli"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              <CloudDownload className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPulling ? 'animate-bounce' : ''}`} />
              <span className="hidden xs:inline sm:inline">{isPulling ? 'Menarik...' : 'Tarik Data'}</span>
            </button>

            {/* Sync Status Badge (Desktop Only) */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              {syncState.status === 'online' ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : syncState.status === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className="truncate max-w-[130px]">{syncState.message}</span>
            </div>

            {/* Quick Refresh */}
            <button
              type="button"
              onClick={onRefreshData}
              title="Refresh / Muat Ulang Cache"
              className="p-1.5 sm:p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={onOpenShare}
              title="Bagikan Tautan Pendaftaran"
              className="p-1.5 sm:p-2 rounded-lg text-slate-200 hover:text-[#25D366] hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Help Button */}
            <button
              type="button"
              onClick={onOpenHelp}
              title="Bantuan & Petunjuk"
              className="p-1.5 sm:p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* If Admin or Engineer is Logged In: Show Admin Indicator & Logout Button */}
            {isAdminLoggedIn || hasEngineerAccess ? (
              <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-white/20">
                <button
                  type="button"
                  onClick={onAdminLogout}
                  title="Keluar dari Akun Kurator / Engineer"
                  className="flex items-center gap-1 bg-rose-600/80 hover:bg-rose-600 active:bg-rose-700 text-white px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold shadow transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Keluar</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
