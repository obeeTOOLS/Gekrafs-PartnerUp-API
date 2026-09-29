import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { gasService } from './services/gasService';
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
import { Check } from 'lucide-react';

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

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'developer' || params.get('page') === 'developer') return 'developer';
    if (params.get('page') === 'admin') return 'admin';
    return 'peserta';
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

    const interval = setInterval(() => {
      setSyncState(gasService.getSyncState());
    }, 4000);
    return () => clearInterval(interval);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f9] text-[#10233d]">
      {/* Global Sync Notification Banner */}
      {globalToast && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{globalToast}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        syncState={syncState}
        onRefreshData={handleRefreshData}
        onPullFromSheet={handlePullFromLiveSheet}
        isPulling={isPulling}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-24 md:pb-12">
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
          <AbsensiKehadiran initialSesiId={initialSesiId} userRole={userRole} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard userRole={userRole} />
        )}

        {activeTab === 'developer' && (
          <DeveloperTools />
        )}
      </main>

      {/* Modern Clean Footer */}
      <footer className="hidden md:block bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-[#001c3c]">Gekrafs PartnerUp</span> &middot; Gerakan Ekonomi Kreatif Nasional Kota Batu
          </div>
          <div className="font-semibold text-[#004c80]">
            Developed by Lalu Mahendra &middot; All Rights Reserved
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
      />

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
}
