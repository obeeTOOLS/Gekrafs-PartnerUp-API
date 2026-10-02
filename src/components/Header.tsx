import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  HelpCircle, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Terminal,
  ChevronRight,
  Maximize2,
  Minimize2,
  Smartphone,
  LogOut
} from 'lucide-react';
import { EngineerSession } from '../services/authService';
import { UserRole } from '../types';
import { PwaInstallModal } from './PwaInstallModal';

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

const TAB_TITLES: Record<string, { title: string; subtitle: string; badge?: string }> = {
  pendaftaran: {
    title: 'Pendaftaran Peserta UMKM',
    subtitle: 'Formulir Kurasi & Verifikasi Bisnis Ekraf Batu',
    badge: 'Batch Aktif'
  },
  timeline: {
    title: 'Timeline & Jadwal Pembinaan',
    subtitle: 'Rangkaian Agenda Kelas & Pendampingan 2026'
  },
  asesmen: {
    title: 'Asesmen Mandiri 5 Pilar',
    subtitle: 'Evaluasi Skala Kesiapan & Potensi UMKM'
  },
  kehadiran: {
    title: 'Presensi & Absensi QR',
    subtitle: 'Verifikasi Kehadiran Sesi Pembinaan'
  },
  admin: {
    title: 'Dashboard Kurator & Panitia',
    subtitle: 'Portal Kurasi, Manajemen Peserta & Laporan',
    badge: 'Internal'
  },
  developer: {
    title: 'Developer Hub Console',
    subtitle: 'Arsitektur Sistem, Google Apps Script & Database',
    badge: 'Engineer'
  }
};

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
  const isObeeTools = engineerSession?.email === 'obeetools@gmail.com';
  const hasEngineerAccess = !!engineerSession;
  const currentPerspective = engineerSession?.activePerspective || 'peserta';
  const canShowAdminTools = (isAdminLoggedIn || hasEngineerAccess) && currentPerspective !== 'peserta';

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check fullscreen state
    const handleFullscreenChange = () => {
      const activeFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(activeFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    // Check standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Listen to beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      const docEl = document.documentElement as any;
      const doc = document as any;

      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else {
          // iOS Safari fallback: prompt to install PWA for full screen
          setIsInstallModalOpen(true);
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed or restricted:', err);
      // Fallback to install modal
      setIsInstallModalOpen(true);
    }
  };

  const currentTabInfo = TAB_TITLES[activeTab] || {
    title: 'Gekrafs PartnerUp Kota Batu',
    subtitle: 'Ekosistem Akselerasi UMKM Kreatif'
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 text-[#001c3c] shadow-xs">
      {/* Top Banner Accent */}
      <div className="h-0.5 bg-gradient-to-r from-[#004c80] via-[#ffc72c] to-[#0070b3]" />

      {/* Special Engineer Perspective Banner (when simulating Peserta) */}
      {isObeeTools && currentPerspective === 'peserta' && (
        <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-[#001c3c] text-white text-xs px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-purple-500/30">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-purple-200 text-[11px] sm:text-xs">
              Simulasi Lapangan Peserta UMKM (Aktif: <strong className="text-white">obeetools@gmail.com</strong>)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-300 hidden sm:inline">Ganti Cepat:</span>
            <button
              type="button"
              onClick={() => onSwitchPerspective('developer')}
              className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow transition-colors cursor-pointer"
            >
              Dev
            </button>
            <button
              type="button"
              onClick={() => onSwitchPerspective('admin')}
              className="px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-[#001c3c] font-bold text-[11px] shadow transition-colors cursor-pointer"
            >
              Kurator
            </button>
          </div>
        </div>
      )}

      <div className="px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between h-9 sm:h-10">
          {/* Left Side: Mobile Brand & Desktop Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile-only Brand Logo */}
            <div className="flex md:hidden items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center p-0.5 shadow-sm border border-slate-200 flex-shrink-0">
                <img 
                  src="/logo.svg" 
                  alt="Logo Resmi Gekrafs Kota Batu" 
                  className="w-full h-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <span className="text-xs font-black tracking-tight text-[#001c3c] block truncate">
                  Gekrafs PartnerUp
                </span>
                <span className="text-[10px] text-[#004c80] font-bold uppercase block truncate">
                  Kota Batu
                </span>
              </div>
            </div>

            {/* Desktop Breadcrumb Navigation */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 truncate">
              <span className="font-semibold text-slate-500">Gekrafs Batu</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="font-extrabold text-[#001c3c] text-sm sm:text-base tracking-tight truncate">
                  {currentTabInfo.title}
                </h1>
                {currentTabInfo.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentTabInfo.badge === 'Internal'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : currentTabInfo.badge === 'Engineer'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {currentTabInfo.badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Status Badges, Share & Quick Utilities */}
          <div className="flex items-center gap-2">
            {/* Sync Status Badge (Hanya tampil untuk Admin/Engineer) */}
            {canShowAdminTools && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-full border border-slate-200 transition-colors">
                {syncState.status === 'online' ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                ) : syncState.status === 'syncing' ? (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className="truncate max-w-[140px] text-[11px] font-semibold">{syncState.message}</span>
              </div>
            )}

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar dari Layar Penuh' : 'Mode Layar Penuh (Full Screen)'}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border ${
                isFullscreen 
                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                  : 'text-slate-600 hover:text-[#001c3c] hover:bg-slate-100 border-transparent hover:border-slate-200'
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
              )}
              <span className="hidden sm:inline">{isFullscreen ? 'Normal' : 'Layar Penuh'}</span>
            </button>

            {/* Install App / PWA Button (tampil jika belum standalone) */}
            {!isStandalone && (
              <button
                type="button"
                onClick={() => setIsInstallModalOpen(true)}
                title="Pasang di Layar Utama HP (Full Screen Standalone)"
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="hidden sm:inline">Pasang App</span>
              </button>
            )}

            {/* Quick Share Link */}
            <button
              type="button"
              onClick={onOpenShare}
              title="Bagikan Tautan Pendaftaran Peserta"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-slate-600 hover:text-[#001c3c] hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-transparent hover:border-slate-200"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Bagikan</span>
            </button>

            {/* Help Button */}
            <button
              type="button"
              onClick={onOpenHelp}
              title="Panduan & FAQ"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-slate-600 hover:text-[#001c3c] hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-transparent hover:border-slate-200"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Bantuan</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onAdminLogout}
              title="Keluar dari Sistem (Logout)"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              <span className="hidden sm:inline">Keluar</span>
            </button>

            {/* Mobile Engineer Access Shortcut */}
            {hasEngineerAccess && (
              <button
                type="button"
                onClick={onOpenEngineerModal}
                title="Panel Engineer"
                className="md:hidden p-1.5 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PWA Install Modal */}
      <PwaInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalled={() => {
          setIsStandalone(true);
          setDeferredPrompt(null);
        }}
      />
    </header>
  );
};
