import React, { useState, useEffect } from 'react';
import { gasService } from './services/gasService';
import { authService, EngineerSession } from './services/authService';
import { UserRole } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { FormPendaftaran } from './components/FormPendaftaran';
import { TimelineJadwal } from './components/TimelineJadwal';
import { AbsensiKehadiran } from './components/AbsensiKehadiran';
import { AsesmenMandiri } from './components/AsesmenMandiri';
import { AdminDashboard } from './components/AdminDashboard';
import { DeveloperTools } from './components/DeveloperTools';
import { HelpModal } from './components/HelpModal';
import { ShareModal } from './components/ShareModal';
import { EngineerModal } from './components/EngineerModal';
import { Check, Lock, Terminal } from 'lucide-react';

export default function App() {
  // Query param auto-routing (?page=admin, ?page=info, ?page=asesmen, ?page=kehadiran, ?sesi_id=...)
  const [activeTab, setActiveTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page === 'admin') return 'admin';
    if (page === 'info') return 'timeline';
    if (page === 'asesmen') return 'asesmen';
    if (page === 'kehadiran') return 'kehadiran';
    if (page === 'developer') return 'developer';
    return 'pendaftaran';
  });

  const [initialSesiId] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('sesi_id') || '';
  });

  // Engineer Session (obeetools@gmail.com / loehendra@gmail.com)
  const [engineerSession, setEngineerSession] = useState<EngineerSession | null>(() => {
    return authService.getCurrentSession();
  });
  const [isEngineerModalOpen, setIsEngineerModalOpen] = useState(false);
  const currentPerspective = engineerSession?.activePerspective || 'peserta';

  // Strict Admin Authentication Session tracking
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    // If engineer session exists, automatically considered admin authenticated
    if (authService.getCurrentSession()) {
      return true;
    }
    try {
      const session = localStorage.getItem('gkf_admin_auth');
      if (session) {
        const data = JSON.parse(session);
        return data.expiresAt > Date.now();
      }
    } catch {}
    return false;
  });

  const [syncState, setSyncState] = useState(gasService.getSyncState());
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  // Auto-sync interval and initial pull if local storage is fresh
  useEffect(() => {
    const checkSync = async () => {
      const lastSync = localStorage.getItem('gkf_last_sync_v2');
      if (!lastSync) {
        setIsPulling(true);
        const res = await gasService.syncFromLiveSpreadsheet();
        setIsPulling(false);
        if (res.success) {
          setGlobalToast(res.message);
          setTimeout(() => setGlobalToast(null), 5000);
        }
      }
      setSyncState(gasService.getSyncState());
    };

    checkSync();

    // Rahasia bagi Lead Developer untuk membuka konsol: Ctrl+Shift+D atau URL query ?dev=true
    if (window.location.search.includes('dev=true') || window.location.search.includes('developer=1')) {
      setIsEngineerModalOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsEngineerModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      setSyncState(gasService.getSyncState());
    }, 4000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleRefreshData = async () => {
    setSyncState({
      status: 'syncing',
      message: 'Memeriksa sinkronisasi...',
      endpoint: '',
      lastSyncTime: syncState.lastSyncTime || ''
    });
    await new Promise((r) => setTimeout(r, 600));
    setSyncState(gasService.getSyncState());
  };

  const handlePullFromLiveSheet = async () => {
    setIsPulling(true);
    const res = await gasService.syncFromLiveSpreadsheet();
    setIsPulling(false);
    setSyncState(gasService.getSyncState());
    setGlobalToast(res.message);
    setTimeout(() => setGlobalToast(null), 5000);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('gkf_admin_auth');
    authService.logout();
    setIsAdminLoggedIn(false);
    setEngineerSession(null);
    setActiveTab('pendaftaran');
    // Remove query param from browser bar gracefully
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setEngineerSession(authService.getCurrentSession());
  };

  const handleSwitchPerspective = (role: UserRole) => {
    const updated = authService.setPerspective(role);
    if (updated) {
      setEngineerSession({ ...updated });
      if (role === 'developer') {
        setActiveTab('developer');
      } else if (role === 'admin') {
        setActiveTab('admin');
      } else if (role === 'peserta') {
        setActiveTab('pendaftaran');
      }
    }
  };

  const handleSessionChange = (newSession: EngineerSession | null) => {
    setEngineerSession(newSession);
    if (newSession) {
      setIsAdminLoggedIn(true);
    } else {
      setIsAdminLoggedIn(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f0f4f9] text-[#10233d]">
      {/* Desktop Left Sidebar (Icon-Only Mode / Collapsed & Expandable) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminLoggedIn={isAdminLoggedIn || !!engineerSession}
        engineerSession={engineerSession}
        onOpenEngineerModal={() => setIsEngineerModalOpen(true)}
        onSwitchPerspective={handleSwitchPerspective}
        onPullFromSheet={handlePullFromLiveSheet}
        isPulling={isPulling}
        syncState={syncState}
        onRefreshData={handleRefreshData}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Workspace with Sleek Top Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Global Sync Notification Banner */}
        {globalToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{globalToast}</span>
          </div>
        )}

        {/* Top Header / Breadcrumb Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdminLoggedIn={isAdminLoggedIn || !!engineerSession}
          onAdminLogout={handleAdminLogout}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          syncState={syncState}
          onRefreshData={handleRefreshData}
          onPullFromSheet={handlePullFromLiveSheet}
          isPulling={isPulling}
          engineerSession={engineerSession}
          onOpenEngineerModal={() => setIsEngineerModalOpen(true)}
          onSwitchPerspective={handleSwitchPerspective}
        />

        {/* Main View Area */}
        <main className="flex-1 pb-24 sm:pb-28 md:pb-12" style={{ paddingBottom: 'calc(4.75rem + env(safe-area-inset-bottom, 0px))' }}>
          {activeTab === 'pendaftaran' && (
            <FormPendaftaran onSuccessNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'timeline' && (
            <TimelineJadwal onNavigateToAsesmen={() => setActiveTab('asesmen')} />
          )}

          {activeTab === 'asesmen' && (
            <AsesmenMandiri onNavigateToRegister={() => setActiveTab('pendaftaran')} />
          )}

          {activeTab === 'kehadiran' && (
            <AbsensiKehadiran initialSesiId={initialSesiId} />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard 
              userRole={currentPerspective === 'developer' ? 'developer' : 'admin'}
              engineerSession={engineerSession}
              onLoginSuccess={handleAdminLoginSuccess}
              onLogout={handleAdminLogout}
              onNavigateToPublic={() => setActiveTab('pendaftaran')}
              onEngineerLogin={(email) => {
                const sess = authService.getCurrentSession();
                setEngineerSession(sess);
                setIsAdminLoggedIn(true);
              }}
            />
          )}

          {activeTab === 'developer' && (
            (engineerSession && currentPerspective === 'developer') ? (
              <DeveloperTools />
            ) : (
              <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-[#001c3c]">Akses Terbatas</h2>
                <p className="text-xs text-slate-500 mt-2">
                  Halaman Dev Hub dan Laporan Verifikasi Sistem hanya dapat diakses oleh peran Developer terotorisasi (obeetools@gmail.com).
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('pendaftaran')}
                  className="mt-5 px-5 py-2.5 bg-[#001c3c] text-white text-xs font-bold rounded-xl hover:bg-[#002c5c] transition-colors cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
              </div>
            )
          )}
        </main>

        {/* Modern Clean Footer with discreet Panitia & Engineer Links */}
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white p-0.5 shadow-xs border border-slate-200 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/logo.svg" 
                  alt="Gekrafs Kota Batu" 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-bold text-[#001c3c]">Gekrafs PartnerUp</span> &middot; Gerakan Ekonomi Kreatif Nasional Kota Batu
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#004c80]">
                Developed by Lalu Mahendra &middot; All Rights Reserved
              </span>

              {/* Engineer access console shortcut - HANYA tampil jika sedang login sebagai peran Developer */}
              {engineerSession && currentPerspective === 'developer' && (
                <button
                  type="button"
                  onClick={() => setIsEngineerModalOpen(true)}
                  title="Konsol Hak Akses Engineer & Pemilih Peran"
                  className="text-slate-400 hover:text-purple-600 transition-colors p-1 rounded cursor-pointer"
                  aria-label="Konsol Engineer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Discreet lock icon for authorized staff to access pass-gate */}
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                title="Akses Khusus Tim Kurator (Passcode Terlindungi)"
                className="text-slate-300 hover:text-slate-600 transition-colors p-1 rounded cursor-pointer"
                aria-label="Akses Kurator"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminLoggedIn={isAdminLoggedIn || !!engineerSession}
        engineerSession={engineerSession}
        onOpenEngineerModal={() => setIsEngineerModalOpen(true)}
      />

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <EngineerModal 
        isOpen={isEngineerModalOpen} 
        onClose={() => setIsEngineerModalOpen(false)}
        session={engineerSession}
        onSessionChange={handleSessionChange}
        onSelectTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
