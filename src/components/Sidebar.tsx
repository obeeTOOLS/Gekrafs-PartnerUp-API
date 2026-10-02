import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  ClipboardCheck, 
  QrCode, 
  ShieldCheck, 
  Terminal, 
  CloudDownload, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  HelpCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  LogOut,
  BarChart3,
  Store
} from 'lucide-react';
import { EngineerSession } from '../services/authService';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  engineerSession?: EngineerSession | null;
  onOpenEngineerModal: () => void;
  onSwitchPerspective: (role: UserRole) => void;
  onPullFromSheet: () => void;
  isPulling: boolean;
  syncState: { status: string; message: string; lastSyncTime?: string };
  onRefreshData: () => void;
  onOpenShare: () => void;
  onOpenHelp: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  engineerSession,
  onOpenEngineerModal,
  onSwitchPerspective,
  onPullFromSheet,
  isPulling,
  syncState,
  onRefreshData,
  onOpenShare,
  onOpenHelp,
  onLogout
}) => {
  // Selalu default expanded (false) dan bersihkan cache collapsed lama agar menu Direktori Ekraf langsung terlihat jelas
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      localStorage.removeItem('gkf_sidebar_collapsed');
    } catch {}
    return false;
  });

  const toggleCollapsed = () => {
    setIsCollapsed(prev => !prev);
  };

  const hasEngineerAccess = !!engineerSession;
  const isObeeTools = engineerSession?.email === 'obeetools@gmail.com';
  const currentPerspective = engineerSession?.activePerspective || 'peserta';
  const canShowAdminTools = (isAdminLoggedIn || hasEngineerAccess) && currentPerspective !== 'peserta';

  const navItems = [
    {
      id: 'pendaftaran',
      label: 'Pendaftaran',
      shortLabel: 'Daftar',
      icon: FileText,
      description: 'Formulir Registrasi Peserta UMKM'
    },
    {
      id: 'timeline',
      label: 'Timeline & Jadwal',
      shortLabel: 'Jadwal',
      icon: Calendar,
      description: 'Jadwal Kelas & Sesi Kurasi'
    },
    {
      id: 'asesmen',
      label: 'Asesmen Mandiri',
      shortLabel: 'Asesmen',
      icon: ClipboardCheck,
      description: 'Penilaian 5 Pilar Usaha'
    },
    {
      id: 'kehadiran',
      label: 'Absensi QR',
      shortLabel: 'Absensi',
      icon: QrCode,
      description: 'Presensi Kehadiran Peserta'
    },
    {
      id: 'katalog',
      label: 'Direktori Ekraf',
      shortLabel: 'Showcase',
      icon: Store,
      description: 'Katalog Brand UMKM Kota Batu'
    }
  ];

  return (
    <aside
      aria-label="Navigasi Samping"
      className={`hidden md:flex flex-col flex-shrink-0 bg-[#001c3c] text-white border-r border-[#003866] transition-all duration-300 ease-in-out relative z-30 select-none shadow-xl ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Top Header & Brand Wordmark */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#003866]/80 bg-[#001730]">
        <button
          type="button"
          onClick={() => setActiveTab('pendaftaran')}
          className="flex items-center gap-3 overflow-hidden text-left focus:outline-none group cursor-pointer"
          title="Gekrafs PartnerUp Kota Batu"
        >
          {/* Logo Badge */}
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1 shadow-md flex-shrink-0 group-hover:scale-105 group-hover:ring-2 ring-[#ffc72c] transition-all">
            <img 
              src="/logo.svg" 
              alt="Logo Resmi Gekrafs Kota Batu" 
              className="w-full h-full object-contain select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <span className="text-sm font-extrabold tracking-tight text-white group-hover:text-[#ffc72c] transition-colors truncate block">
                PartnerUp
              </span>
              <span className="text-[10px] text-[#ffc72c] font-bold tracking-wider uppercase block">
                Gekrafs Batu
              </span>
            </div>
          )}
        </button>

        {/* Toggle Collapse/Expand Button */}
        <button
          type="button"
          onClick={toggleCollapsed}
          title={isCollapsed ? 'Perlebar Sidebar' : 'Ciutkan Sidebar (Mode Ikon)'}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-slate-300 hover:text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
        <div className="px-2 mb-1.5">
          {!isCollapsed ? (
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
              Menu Utama
            </span>
          ) : (
            <div className="w-4 h-0.5 bg-slate-600/50 mx-auto rounded" />
          )}
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
              className={`w-full flex items-center rounded-xl transition-all group relative cursor-pointer ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-[#ffc72c] to-[#f4b400] text-[#001c3c] font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="relative flex-shrink-0">
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#001c3c]' : 'text-slate-300'
                }`} />
                {item.id === 'katalog' && isCollapsed && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#001c3c]" />
                )}
              </div>

              {!isCollapsed && (
                <div className="text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs leading-tight truncate ${isActive ? 'font-black' : 'font-semibold'}`}>
                      {item.label}
                    </span>
                    {item.id === 'katalog' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400 text-[#001c3c] uppercase tracking-wider">
                        BARU
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-[#001c3c]/80' : 'text-slate-400'}`}>
                    {item.shortLabel}
                  </div>
                </div>
              )}

              {/* Tooltip on Hover in Collapsed Mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#001428] text-white text-xs font-bold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  <div className="flex items-center gap-1.5">
                    <span>{item.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">{item.description}</div>
                </div>
              )}
            </button>
          );
        })}

        {/* Highlight Card: Direktori Ekraf Batu */}
        {!isCollapsed && (
          <div className="pt-2 px-1">
            <button
              type="button"
              onClick={() => setActiveTab('katalog')}
              className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer shadow-sm group ${
                activeTab === 'katalog'
                  ? 'bg-amber-400 text-[#001c3c] border-amber-300 shadow-md font-black'
                  : 'bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent border-amber-400/50 hover:bg-amber-400/20 text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#001c3c] flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Store className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-tight text-white group-hover:text-amber-300">
                      Direktori Ekraf
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-[#001c3c] uppercase">
                      BARU
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 truncate mt-0.5">
                    Katalog Brand UMKM Kota Batu
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Kurator & Developer Special Section */}
        {canShowAdminTools && (
          <div className="pt-3 mt-3 border-t border-[#003866]/80 space-y-1.5">
            <div className="px-2 mb-1.5">
              {!isCollapsed ? (
                <span className="text-[10px] font-black tracking-wider text-amber-300 uppercase flex items-center justify-between">
                  <span>Akses Khusus</span>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">STAFF</span>
                </span>
              ) : (
                <div className="w-4 h-0.5 bg-amber-400/40 mx-auto rounded" />
              )}
            </div>

            {/* Portal Kurator */}
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              title={isCollapsed ? 'Portal Kurator & Manajemen' : undefined}
              className={`w-full flex items-center rounded-xl transition-all group relative cursor-pointer ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
              } ${
                activeTab === 'admin'
                  ? 'bg-amber-400 text-[#001c3c] font-black shadow-md'
                  : 'text-amber-200 hover:text-white hover:bg-amber-500/20'
              }`}
            >
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-300 group-hover:scale-110 transition-transform" />
              {!isCollapsed && (
                <div className="text-left min-w-0">
                  <div className="text-xs font-bold truncate">Portal Kurator</div>
                  <div className="text-[10px] text-amber-300/80 truncate">Penilaian & Peserta</div>
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#001428] text-white text-xs font-bold rounded-lg shadow-xl border border-amber-500/40 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  <div className="text-amber-300 font-extrabold">Portal Kurator & Panitia</div>
                  <div className="text-[10px] text-slate-300">Penilaian, seleksi, & presensi</div>
                </div>
              )}
            </button>

            {/* Dashboard Grafik (Radar & Analitik Visual Bisnis) */}
            <button
              type="button"
              onClick={() => setActiveTab('grafik')}
              title={isCollapsed ? 'Dashboard Grafik & Radar 8 Pilar Bisnis' : undefined}
              className={`w-full flex items-center rounded-xl transition-all group relative cursor-pointer ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
              } ${
                activeTab === 'grafik'
                  ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-[#001c3c] font-black shadow-md'
                  : 'text-sky-200 hover:text-white hover:bg-sky-500/20'
              }`}
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0 text-sky-300 group-hover:scale-110 transition-transform" />
              {!isCollapsed && (
                <div className="text-left min-w-0">
                  <div className="text-xs font-bold truncate">Dashboard Grafik</div>
                  <div className="text-[10px] text-sky-300/80 truncate">Radar 8 Pilar & Bisnis</div>
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#001428] text-white text-xs font-bold rounded-lg shadow-xl border border-sky-500/40 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  <div className="text-sky-300 font-extrabold">Dashboard Grafik & Radar</div>
                  <div className="text-[10px] text-slate-300">Visualisasi 8 pilar & sebaran omzet</div>
                </div>
              )}
            </button>

            {/* Dev Hub Tab */}
            {hasEngineerAccess && currentPerspective === 'developer' && (
              <button
                type="button"
                onClick={() => setActiveTab('developer')}
                title={isCollapsed ? 'Dev Hub - Konsol Engineer' : undefined}
                className={`w-full flex items-center rounded-xl transition-all group relative cursor-pointer ${
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                } ${
                  activeTab === 'developer'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'text-purple-200 hover:text-white hover:bg-purple-600/25'
                }`}
              >
                <Terminal className="w-5 h-5 flex-shrink-0 text-purple-300 group-hover:scale-110 transition-transform" />
                {!isCollapsed && (
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold truncate">Dev Hub</div>
                    <div className="text-[10px] text-purple-300/80 truncate">Arsitektur & API</div>
                  </div>
                )}

                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#001428] text-white text-xs font-bold rounded-lg shadow-xl border border-purple-500/40 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    <div className="text-purple-300 font-extrabold">Dev Hub Console</div>
                    <div className="text-[10px] text-slate-300">Pengaturan GAS & Database</div>
                  </div>
                )}
              </button>
            )}

            {/* Live Pull Data Button */}
            <button
              type="button"
              onClick={onPullFromSheet}
              disabled={isPulling}
              title={isCollapsed ? 'Tarik Data Langsung dari Google Sheets' : undefined}
              className={`w-full flex items-center rounded-xl transition-all group relative cursor-pointer ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
              } bg-emerald-700/80 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold shadow-sm disabled:opacity-50`}
            >
              <CloudDownload className={`w-5 h-5 flex-shrink-0 ${isPulling ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
              {!isCollapsed && (
                <div className="text-left min-w-0">
                  <div className="text-xs font-bold truncate">{isPulling ? 'Menarik...' : 'Tarik Sheet Asli'}</div>
                  <div className="text-[10px] text-emerald-200 truncate">Sinkronisasi Cloud</div>
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#001428] text-white text-xs font-bold rounded-lg shadow-xl border border-emerald-500/40 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  <div className="text-emerald-400 font-extrabold">Tarik Sheet Asli</div>
                  <div className="text-[10px] text-slate-300">Sync data terbaru dari Google Spreadsheet</div>
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Footer Section: Role Switcher & Profile */}
      <div className="p-2 border-t border-[#003866]/80 bg-[#001730] space-y-2">
        {/* Quick Role Switcher for obeetools (Only visible in developer perspective) */}
        {isObeeTools && (currentPerspective as string) === 'developer' && (
          <div className="p-1 rounded-xl bg-black/40 border border-purple-500/20">
            {!isCollapsed ? (
              <div>
                <div className="text-[10px] font-bold text-purple-300 px-1.5 py-0.5 uppercase tracking-wider">
                  Mode Perspektif
                </div>
                <div className="grid grid-cols-3 gap-1 mt-1 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => onSwitchPerspective('developer')}
                    className={`py-1 rounded text-center transition-colors cursor-pointer ${
                      currentPerspective === 'developer'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dev
                  </button>
                  <button
                    type="button"
                    onClick={() => onSwitchPerspective('admin')}
                    className={`py-1 rounded text-center transition-colors cursor-pointer ${
                      currentPerspective === 'admin'
                        ? 'bg-amber-400 text-[#001c3c] shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => onSwitchPerspective('peserta')}
                    className={`py-1 rounded text-center transition-colors cursor-pointer ${
                      currentPerspective === 'peserta'
                        ? 'bg-emerald-500 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Peserta
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSwitchPerspective('developer')}
                  title="Perspektif: Developer"
                  className={`w-8 h-6 rounded text-[10px] font-bold cursor-pointer ${
                    currentPerspective === 'developer' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  D
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchPerspective('admin')}
                  title="Perspektif: Admin / Kurator"
                  className={`w-8 h-6 rounded text-[10px] font-bold cursor-pointer ${
                    currentPerspective === 'admin' ? 'bg-amber-400 text-[#001c3c]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchPerspective('peserta')}
                  title="Perspektif: Peserta (Simulasi)"
                  className={`w-8 h-6 rounded text-[10px] font-bold cursor-pointer ${
                    currentPerspective === 'peserta' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  P
                </button>
              </div>
            )}
          </div>
        )}

        {/* Engineer Profile Button (Only visible in developer perspective) */}
        {hasEngineerAccess && currentPerspective === 'developer' && (
          <button
            type="button"
            onClick={onOpenEngineerModal}
            title={isCollapsed ? `${engineerSession.name} (${engineerSession.title})` : undefined}
            className={`w-full flex items-center rounded-xl p-2 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-all group cursor-pointer ${
              isCollapsed ? 'justify-center' : 'gap-2.5'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-[#001c3c] flex items-center justify-center font-black text-xs shadow flex-shrink-0">
              {engineerSession.name.charAt(0)}
            </div>

            {!isCollapsed && (
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-white truncate">{engineerSession.name}</div>
                <div className="text-[10px] text-purple-300 font-mono truncate">{engineerSession.email}</div>
              </div>
            )}
          </button>
        )}

        {/* Utilities: Refresh, Share, Help */}
        <div className={`flex items-center gap-1 pt-1 ${isCollapsed ? 'flex-col' : 'justify-between px-1'}`}>
          {canShowAdminTools && (
            <button
              type="button"
              onClick={onRefreshData}
              title="Muat Ulang Cache Data"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenShare}
            title="Bagikan Tautan Pendaftaran"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#25D366] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenHelp}
            title="Bantuan & Petunjuk Alur"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Keluar dari Akun (Logout)"
              className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
