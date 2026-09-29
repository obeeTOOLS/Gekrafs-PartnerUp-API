import React from 'react';
import { UserRole } from '../types';
import { 
  FileText, 
  Calendar, 
  ClipboardCheck, 
  QrCode, 
  ShieldCheck,
  Terminal
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  userRole
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('pendaftaran')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'pendaftaran'
              ? 'text-[#004c80] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === 'pendaftaran' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Daftar</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'timeline'
              ? 'text-[#004c80] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className={`w-5 h-5 ${activeTab === 'timeline' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Jadwal</span>
        </button>

        <button
          onClick={() => setActiveTab('asesmen')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors relative ${
            activeTab === 'asesmen'
              ? 'text-[#004c80] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#001c3c] text-[#ffc72c] flex items-center justify-center -mt-4 shadow-md">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Asesmen</span>
        </button>

        <button
          onClick={() => setActiveTab('kehadiran')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'kehadiran'
              ? 'text-[#004c80] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <QrCode className={`w-5 h-5 ${activeTab === 'kehadiran' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Absen</span>
        </button>

        {userRole === 'developer' ? (
          <button
            onClick={() => setActiveTab('developer')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'developer'
                ? 'text-purple-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className={`w-5 h-5 ${activeTab === 'developer' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-medium tracking-tight mt-1">Dev API</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'admin'
                ? 'text-[#004c80] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-medium tracking-tight mt-1">Admin</span>
          </button>
        )}
      </div>
    </nav>
  );
};
