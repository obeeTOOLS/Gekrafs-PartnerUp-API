import React from 'react';
import { 
  FileText, 
  Calendar, 
  ClipboardCheck, 
  QrCode, 
  ShieldCheck,
  Terminal,
  Store,
  Compass
} from 'lucide-react';
import { EngineerSession } from '../services/authService';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  engineerSession?: EngineerSession | null;
  onOpenEngineerModal?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  engineerSession,
  onOpenEngineerModal
}) => {
  const isEngineer = !!engineerSession;
  const isPesertaPerspective = isEngineer && engineerSession.activePerspective === 'peserta';
  const showAdminTab = (isAdminLoggedIn || isEngineer) && !isPesertaPerspective;
  const showDevTab = isEngineer && engineerSession.activePerspective === 'developer';

  // Total columns calculation for mobile bottom bar
  const colCount = showDevTab ? 'grid-cols-8' : showAdminTab ? 'grid-cols-7' : 'grid-cols-6';

  return (
    <nav 
      aria-label="Navigasi Bawah Layar HP"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      <div className={`grid ${colCount} h-16 max-w-md mx-auto px-1 items-center`}>
        {/* Tab 1: Pendaftaran */}
        <button
          type="button"
          onClick={() => setActiveTab('pendaftaran')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all rounded-lg active:scale-95 ${
            activeTab === 'pendaftaran'
              ? 'text-[#004c80] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <FileText className={`w-5 h-5 ${activeTab === 'pendaftaran' ? 'stroke-[2.5] text-[#004c80]' : ''}`} />
            {activeTab === 'pendaftaran' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#004c80]" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 leading-none">Daftar</span>
        </button>

        {/* Tab 2: Timeline & Jadwal */}
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all rounded-lg active:scale-95 ${
            activeTab === 'timeline'
              ? 'text-[#004c80] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 ${activeTab === 'timeline' ? 'stroke-[2.5] text-[#004c80]' : ''}`} />
            {activeTab === 'timeline' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#004c80]" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 leading-none">Jadwal</span>
        </button>

        {/* Tab 3: Asesmen (Elevated Focus Center Tab) */}
        <button
          type="button"
          onClick={() => setActiveTab('asesmen')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 relative ${
            activeTab === 'asesmen'
              ? 'text-[#001c3c] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center -mt-5 shadow-lg border-2 border-white transition-all ${
            activeTab === 'asesmen'
              ? 'bg-[#001c3c] text-[#ffc72c] ring-2 ring-[#ffc72c] shadow-amber-500/20'
              : 'bg-[#004c80] text-white hover:bg-[#001c3c]'
          }`}>
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-bold tracking-tight mt-0.5 leading-none ${
            activeTab === 'asesmen' ? 'text-[#001c3c]' : 'text-slate-600'
          }`}>
            Asesmen
          </span>
        </button>

        {/* Tab: Lembar Aksi / Peta Jalan */}
        <button
          type="button"
          onClick={() => setActiveTab('tugas')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all rounded-lg active:scale-95 ${
            activeTab === 'tugas'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Compass className={`w-5 h-5 ${activeTab === 'tugas' ? 'stroke-[2.5] text-amber-600' : ''}`} />
            {activeTab === 'tugas' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-600" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 leading-none">Aksi</span>
        </button>

        {/* Tab 4: Absensi */}
        <button
          type="button"
          onClick={() => setActiveTab('kehadiran')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all rounded-lg active:scale-95 ${
            activeTab === 'kehadiran'
              ? 'text-[#004c80] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <QrCode className={`w-5 h-5 ${activeTab === 'kehadiran' ? 'stroke-[2.5] text-[#004c80]' : ''}`} />
            {activeTab === 'kehadiran' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#004c80]" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 leading-none">Absen</span>
        </button>

        {/* Tab: Direktori Ekraf (Katalog) */}
        <button
          type="button"
          onClick={() => setActiveTab('katalog')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all rounded-lg active:scale-95 ${
            activeTab === 'katalog'
              ? 'text-[#004c80] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Store className={`w-5 h-5 ${activeTab === 'katalog' ? 'stroke-[2.5] text-[#004c80]' : ''}`} />
            {activeTab === 'katalog' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#004c80]" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 leading-none">Direktori</span>
        </button>

        {/* Tab 5: Admin (Visible if Admin or Engineer) */}
        {showAdminTab && (
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all rounded-lg active:scale-95 ${
              activeTab === 'admin'
                ? 'text-amber-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'stroke-[2.5] text-amber-600' : ''}`} />
              {activeTab === 'admin' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-600" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-1 leading-none">Admin</span>
          </button>
        )}

        {/* Tab 6: Dev (Visible if Engineer is in Developer perspective) */}
        {showDevTab && (
          <button
            type="button"
            onClick={() => setActiveTab('developer')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all rounded-lg active:scale-95 ${
              activeTab === 'developer'
                ? 'text-purple-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Terminal className={`w-5 h-5 ${activeTab === 'developer' ? 'stroke-[2.5] text-purple-600' : ''}`} />
              {activeTab === 'developer' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-600" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-1 leading-none">Dev</span>
          </button>
        )}
      </div>
    </nav>
  );
};
