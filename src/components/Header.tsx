import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  Terminal, 
  UserCheck, 
  Share2, 
  HelpCircle, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  ChevronDown,
  CloudDownload
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenHelp: () => void;
  onOpenShare: () => void;
  syncState: { status: string; message: string; lastSyncTime?: string };
  onRefreshData: () => void;
  onPullFromSheet: () => void;
  isPulling?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onOpenHelp,
  onOpenShare,
  syncState,
  onRefreshData,
  onPullFromSheet,
  isPulling = false
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navItems = [
    { id: 'pendaftaran', label: 'Pendaftaran' },
    { id: 'timeline', label: 'Timeline & Jadwal' },
    { id: 'asesmen', label: 'Asesmen Mandiri' },
    { id: 'kehadiran', label: 'Absensi' },
    { id: 'admin', label: 'Admin Portal' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#001c3c] border-b border-[#004c80] text-white shadow-md">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-[#004c80] via-[#ffc72c] to-[#0070b3]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('pendaftaran')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm group-hover:ring-2 ring-[#ffc72c] transition-all">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#001c3c]" fill="currentColor">
                  <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#001c3c" />
                  <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="#ffc72c" />
                  <text x="50" y="60" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#001c3c">GK</text>
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#ffc72c] transition-colors">
                  Gekrafs PartnerUp
                </span>
                <span className="hidden sm:block text-[11px] text-[#ffc72c] font-medium tracking-wide uppercase">
                  Kota Batu
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
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
            {userRole === 'developer' && (
              <button
                onClick={() => setActiveTab('developer')}
                className={`px-3 py-1.5 rounded-lg text-[15px] font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'developer'
                    ? 'bg-[#ffc72c] text-[#001c3c] font-bold'
                    : 'text-[#ffc72c] hover:bg-white/10'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Dev / Headless API</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions, Live Pull Button & Role Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tombol Utama: Tarik Data Langsung dari Google Sheets Asli */}
            <button
              onClick={onPullFromSheet}
              disabled={isPulling}
              title="Tarik & Sinkronkan data langsung dari Google Sheets asli"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              <CloudDownload className={`w-4 h-4 ${isPulling ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isPulling ? 'Menarik...' : 'Tarik Data Asli'}</span>
            </button>

            {/* Sync Status Badge */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              {syncState.status === 'online' ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : syncState.status === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className="truncate max-w-[140px]">{syncState.message}</span>
            </div>

            {/* Quick Refresh */}
            <button
              onClick={onRefreshData}
              title="Refresh / Muat Ulang Cache"
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Share Button */}
            <button
              onClick={onOpenShare}
              title="Bagikan Tautan Pendaftaran"
              className="p-2 rounded-lg text-slate-200 hover:text-[#25D366] hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Help Button */}
            <button
              onClick={onOpenHelp}
              title="Bantuan & Petunjuk"
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* RBAC Role Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 bg-[#004c80] hover:bg-[#0070b3] text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 transition-colors"
              >
                {userRole === 'developer' && <Terminal className="w-3.5 h-3.5 text-[#ffc72c]" />}
                {userRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />}
                {userRole === 'peserta' && <UserCheck className="w-3.5 h-3.5 text-emerald-300" />}
                <span className="capitalize">{userRole}</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {showRoleMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRoleMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 text-sm">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Pilih Peran Pengguna
                    </div>

                    <button
                      onClick={() => {
                        setUserRole('peserta');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 ${
                        userRole === 'peserta' ? 'bg-[#eaf2fb] font-semibold text-[#001c3c]' : ''
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-medium">Peserta / Lapangan</div>
                        <div className="text-xs text-slate-500">Pendaftaran, jadwal & asesmen</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setUserRole('admin');
                        setShowRoleMenu(false);
                        setActiveTab('admin');
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 ${
                        userRole === 'admin' ? 'bg-[#eaf2fb] font-semibold text-[#001c3c]' : ''
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-[#004c80]" />
                      <div>
                        <div className="font-medium">Admin / Kurator</div>
                        <div className="text-xs text-slate-500">Monitoring & seleksi UMKM</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setUserRole('developer');
                        setShowRoleMenu(false);
                        setActiveTab('developer');
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 ${
                        userRole === 'developer' ? 'bg-[#eaf2fb] font-semibold text-[#001c3c]' : ''
                      }`}
                    >
                      <Terminal className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-medium">Developer / API</div>
                        <div className="text-xs text-slate-500">Code.gs & arsitektur headless</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
