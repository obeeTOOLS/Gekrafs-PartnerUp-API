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
import { KatalogDirektori } from './components/KatalogDirektori';
import { HelpModal } from './components/HelpModal';
import { ShareModal } from './components/ShareModal';
import { EngineerModal } from './components/EngineerModal';
import { LoginPage } from './components/LoginPage';
import { StrategicRoadmapForm } from './components/StrategicRoadmapForm';
import { UntunginKasModal } from './components/UntunginKasModal';
import { Check, Lock, Terminal } from 'lucide-react';

export default function App() {
  // Cek apakah ada sesi login aktif (Engineer, Admin Whitelist, atau Peserta)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('logout') === '1' || params.get('reset_session') === '1') {
        authService.logout();
        window.history.replaceState({}, '', window.location.pathname);
        return false;
      }
    }
    return authService.isAnyUserLoggedIn();
  });
  // Query param auto-routing (?page=admin, ?page=info, ?page=asesmen, ?page=kehadiran, ?sesi_id=...)
  const [activeTab, setActiveTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page === 'admin') return 'admin';
    if (page === 'grafik' || page === 'statistik' || page === 'analytics') return 'grafik';
    if (page === 'pengaturan' || page === 'settings' || page === 'akses') return 'pengaturan';
    if (page === 'tugas' || page === 'roadmap' || page === 'aksi') return 'tugas';
    if (page === 'katalog' || page === 'direktori' || page === 'showcase') return 'katalog';
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
    return authService.getAdminAuthSession() !== null;
  });

  const [syncState, setSyncState] = useState(gasService.getSyncState());
  const [, setDataVersion] = useState(0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  // Untungin Global Modal State
  const [untunginGlobalModalData, setUntunginGlobalModalData] = useState<{
    isOpen: boolean;
    namaUsaha: string;
    namaPemilik?: string;
    whatsapp?: string;
    readOnly?: boolean;
    viewerRole?: string;
  } | null>(null);

  const handleOpenGlobalUntungin = () => {
    const pesertaSess = authService.getPesertaSession();
    if (pesertaSess && pesertaSess.namaUsaha) {
      setUntunginGlobalModalData({
        isOpen: true,
        namaUsaha: pesertaSess.namaUsaha,
        namaPemilik: pesertaSess.namaPemilik,
        whatsapp: pesertaSess.whatsapp,
        readOnly: false,
        viewerRole: 'peserta'
      });
    } else {
      // Default ke akun unit usaha uji coba pengembang obeecreatives
      setUntunginGlobalModalData({
        isOpen: true,
        namaUsaha: 'obeecreatives',
        namaPemilik: 'Lalu Mahendra Ali Akbar',
        whatsapp: '081335125277',
        readOnly: false,
        viewerRole: 'developer'
      });
    }
  };

  // Auto-sync interval and initial pull if local storage is fresh
  useEffect(() => {
    // Sinkronisasi Sesi Global: Tangani Force Logout dari perangkat lain
    const handleForceLogoutEvent = () => {
      setIsAuthenticated(false);
      setIsAdminLoggedIn(false);
      setEngineerSession(null);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'gkf_global_auth_epoch_v2' || 
        e.key === 'gkf_force_logout_event' || 
        e.key === 'gkf_admin_auth_v2' ||
        e.key === 'gkf_engineer_session_v2' ||
        e.key === 'gkf_peserta_session_v2'
      ) {
        const anyUser = authService.isAnyUserLoggedIn();
        setIsAuthenticated(anyUser);
        setIsAdminLoggedIn(!!authService.getCurrentSession() || !!authService.getAdminAuthSession());
        setEngineerSession(authService.getCurrentSession());
      }
    };

    const handleDataUpdated = () => {
      setDataVersion(prev => prev + 1);
      setSyncState(gasService.getSyncState());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gkf-force-logout', handleForceLogoutEvent);
    window.addEventListener('gkf-data-updated', handleDataUpdated);

    // Auto Background-Refresh saat inisialisasi:
    const lastSync = localStorage.getItem('gkf_last_sync_v2');
    if (!lastSync) {
      setIsPulling(true);
      gasService.syncFromLiveSpreadsheet().then(res => {
        setIsPulling(false);
        if (res.success) {
          setGlobalToast(res.message);
          setTimeout(() => setGlobalToast(null), 5000);
        }
        setSyncState(gasService.getSyncState());
      });
    } else {
      // Jika sudah pernah sync sebelumnya, langsung jalankan silent background refresh untuk menarik data terbaru
      gasService.triggerBackgroundRefresh(true, 0);
    }

    // Auto Background-Refresh berkala setiap 60 detik (hanya jika tab aktif/visible)
    const bgRefreshInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        gasService.triggerBackgroundRefresh(false, 45000);
      }
    }, 60000);

    // Auto Background-Refresh saat user kembali membuka tab / jendela aplikasi
    const handleVisibilityOrFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        gasService.triggerBackgroundRefresh(false, 15000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    // Rahasia bagi Lead Developer untuk membuka konsol: Ctrl+Shift+D atau URL query ?dev=true (hanya jika sudah login sebagai engineer)
    if ((window.location.search.includes('dev=true') || window.location.search.includes('developer=1')) && authService.getCurrentSession()) {
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
      clearInterval(bgRefreshInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gkf-force-logout', handleForceLogoutEvent);
      window.removeEventListener('gkf-data-updated', handleDataUpdated);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, []);

  // Segarkan data di latar belakang saat berpindah tab
  useEffect(() => {
    gasService.triggerBackgroundRefresh(false, 15000);
  }, [activeTab]);

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
    authService.logout();
    setIsAdminLoggedIn(false);
    setEngineerSession(null);
    setIsAuthenticated(false);
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

  // Gerbang Keamanan Utama: Tanpa login, pengguna tidak bisa masuk ke dalam aplikasi
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={(type, details) => {
          setIsAuthenticated(true);
          if (type === 'engineer') {
            const sess = authService.getCurrentSession();
            setEngineerSession(sess);
            setIsAdminLoggedIn(true);
            setActiveTab('developer');
          } else if (type === 'admin') {
            setEngineerSession(null);
            setIsAdminLoggedIn(true);
            setActiveTab('admin');
          } else if (type === 'peserta') {
            setEngineerSession(null);
            setIsAdminLoggedIn(false);
            if (details?.targetTab) {
              setActiveTab(details.targetTab);
            } else {
              setActiveTab('pendaftaran');
            }
          }
        }} 
      />
    );
  }

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
        onLogout={handleAdminLogout}
        onOpenUntungin={handleOpenGlobalUntungin}
      />

      {/* Main Content Workspace with Sleek Top Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Global Sync Notification Banner */}
        {globalToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow animate-in fade-in print:hidden">
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
          onOpenUntungin={handleOpenGlobalUntungin}
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

          {activeTab === 'tugas' && (
            <StrategicRoadmapForm onBack={() => setActiveTab('pendaftaran')} />
          )}

          {activeTab === 'kehadiran' && (
            <AbsensiKehadiran initialSesiId={initialSesiId} />
          )}

          {activeTab === 'katalog' && (
            <KatalogDirektori
              pesertaList={gasService.getPeserta()}
              isAdminLoggedIn={isAdminLoggedIn}
              onNavigateToRegister={() => setActiveTab('pendaftaran')}
            />
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

          {activeTab === 'grafik' && (
            <AdminDashboard 
              initialTab="statistik"
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

          {activeTab === 'pengaturan' && (
            <AdminDashboard 
              initialTab="pengaturan"
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
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 print:hidden">
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
        onOpenUntungin={handleOpenGlobalUntungin}
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
      {/* Untungin Global Modal */}
      {untunginGlobalModalData?.isOpen && (
        <UntunginKasModal
          isOpen={untunginGlobalModalData.isOpen}
          onClose={() => setUntunginGlobalModalData(null)}
          namaUsaha={untunginGlobalModalData.namaUsaha}
          namaPemilik={untunginGlobalModalData.namaPemilik}
          whatsapp={untunginGlobalModalData.whatsapp}
          readOnly={untunginGlobalModalData.readOnly ?? false}
          viewerRole={untunginGlobalModalData.viewerRole ?? 'developer'}
        />
      )}
    </div>
  );
}
