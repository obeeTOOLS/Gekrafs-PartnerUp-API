import React, { useState } from 'react';
import { 
  AUTHORIZED_ENGINEERS, 
  EngineerSession, 
  authService 
} from '../services/authService';
import { UserRole } from '../types';
import { 
  X, 
  ShieldCheck, 
  Terminal, 
  UserCheck, 
  Users, 
  KeyRound, 
  LogOut, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight,
  FileText
} from 'lucide-react';
import { PanduanHakAksesPdfModal } from './PanduanHakAksesPdfModal';
import { PanduanAksesKasPinPdfModal } from './PanduanAksesKasPinPdfModal';

interface EngineerModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: EngineerSession | null;
  onSessionChange: (session: EngineerSession | null) => void;
  onSelectTab: (tab: string) => void;
}

export const EngineerModal: React.FC<EngineerModalProps> = ({
  isOpen,
  onClose,
  session,
  onSessionChange,
  onSelectTab
}) => {
  const [selectedEmail, setSelectedEmail] = useState<string>(
    session?.email || 'obeetools@gmail.com'
  );
  const [customEmail, setCustomEmail] = useState('');
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [isPanduanPdfOpen, setIsPanduanPdfOpen] = useState(false);
  const [isPanduanKasPdfOpen, setIsPanduanKasPdfOpen] = useState(false);

  if (!isOpen) return null;

  const currentProfile = session ? AUTHORIZED_ENGINEERS[session.email] : null;

  const handleSwitchAccount = (email: string) => {
    const res = authService.loginWithEmail(email);
    if (res.success && res.session) {
      onSessionChange(res.session);
      setSelectedEmail(email);
      setMsg({ text: res.message });
      setTimeout(() => setMsg(null), 3000);
    } else {
      setMsg({ text: res.message, error: true });
    }
  };

  const handleCustomEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const res = authService.loginWithEmail(customEmail);
    if (res.success && res.session) {
      onSessionChange(res.session);
      setSelectedEmail(res.session.email);
      setCustomEmail('');
      setMsg({ text: res.message });
      setTimeout(() => setMsg(null), 3000);
    } else {
      setMsg({ text: res.message, error: true });
    }
  };

  const handleRoleChange = (role: UserRole) => {
    const updated = authService.setPerspective(role);
    if (updated) {
      onSessionChange(updated);
      setMsg({ text: `Perspektif tampilan dialihkan ke: Mode ${role.toUpperCase()}` });
      setTimeout(() => setMsg(null), 2500);

      // Otomatis arahkan tab yang sesuai bila beralih mode
      if (role === 'developer') {
        onSelectTab('developer');
      } else if (role === 'admin') {
        onSelectTab('admin');
      } else if (role === 'peserta') {
        onSelectTab('pendaftaran');
      }
    }
  };

  const handleLogoutToGuest = () => {
    authService.logout();
    onSessionChange(null);
    onSelectTab('pendaftaran');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 z-10 text-slate-800">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#001c3c] text-white p-5 rounded-t-2xl flex items-center justify-between z-10 border-b border-[#004c80]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Engineer Access & Role Control</span>
              </div>
              <h2 className="text-lg font-extrabold text-white">Konsol Otorisasi & Peran</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Notification */}
          {msg && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
              msg.error 
                ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{msg.text}</span>
            </div>
          )}

          {/* Current Active Engineer Card */}
          {session ? (
            <div className="bg-gradient-to-br from-[#001c3c] via-[#003459] to-[#004c80] rounded-xl p-4 text-white shadow-md border-l-4 border-[#ffc72c]">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold uppercase tracking-wider">
                <span>Akun Engineer Aktif</span>
                <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 text-[10px]">
                  {session.canSwitchRoles ? 'Akses Penuh + Role Switcher' : 'Akses Penuh Engineer'}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 font-black text-lg">
                  {session.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-white text-base truncate">{session.name}</div>
                  <div className="text-xs text-slate-300 font-mono truncate">{session.email}</div>
                  <div className="text-[11px] text-amber-200 mt-0.5">{session.title}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-bold">Mode Tamu Publik Aktif.</span> Silakan pilih akun engineer terdaftar di bawah ini untuk membuka akses penuh.
            </div>
          )}

          {/* Special Feature for obeetools@gmail.com: Role Switcher */}
          {session && session.canSwitchRoles && (
            <div className="border border-purple-200 bg-purple-50/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-950 uppercase tracking-wide">
                  <Layers className="w-4 h-4 text-purple-700" />
                  <span>Simulasi Tampilan / Pemilih Peran (Bebas)</span>
                </div>
                <span className="text-[10px] bg-purple-200 text-purple-900 font-semibold px-2 py-0.5 rounded-full">
                  obeetools Mode
                </span>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed">
                Sebagai <strong>obeetools@gmail.com</strong>, Anda memiliki hak istimewa untuk berpindah peran secara instan guna memantau seluruh tampilan antarmuka selama proses pengembangan:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Developer Mode */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('developer')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    session.activePerspective === 'developer'
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Terminal className="w-4 h-4" />
                    {session.activePerspective === 'developer' && <span className="text-[10px] font-bold">AKTIF</span>}
                  </div>
                  <div className="text-xs font-extrabold">Developer</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Headless GAS, endpoint, reset & console</div>
                </button>

                {/* Admin Mode */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    session.activePerspective === 'admin'
                      ? 'bg-[#001c3c] text-[#ffc72c] border-[#001c3c] shadow-md font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#004c80] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    {session.activePerspective === 'admin' && <span className="text-[10px] font-bold">AKTIF</span>}
                  </div>
                  <div className="text-xs font-extrabold">Admin/Kurator</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Bypass passcode, kurasi & rekap data</div>
                </button>

                {/* Peserta/Publik Mode */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('peserta')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    session.activePerspective === 'peserta'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Users className="w-4 h-4" />
                    {session.activePerspective === 'peserta' && <span className="text-[10px] font-bold">AKTIF</span>}
                  </div>
                  <div className="text-xs font-extrabold">Peserta (Publik)</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Simulasi murni tampilan peserta lapangan</div>
                </button>
              </div>
            </div>
          )}

          {/* Whitelisted Engineer Accounts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wide">
              <span>Pilih Akun Engineer Resmi Terdaftar:</span>
            </div>

            <div className="space-y-2">
              {Object.values(AUTHORIZED_ENGINEERS).map((eng) => {
                const isCurrent = session?.email === eng.email;
                return (
                  <div
                    key={eng.email}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-[#004c80] bg-[#eaf2fb]/60 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${eng.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow flex-shrink-0`}>
                        {eng.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">{eng.name}</span>
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {eng.badge}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono truncate">{eng.email}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{eng.description}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSwitchAccount(eng.email)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-[#001c3c] hover:bg-[#004c80] text-white'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aktif</span>
                        </>
                      ) : (
                        <>
                          <span>Pilih</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Navigation to Screens */}
          {session && (
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                Lompat Langsung ke Antarmuka:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { onSelectTab('developer'); onClose(); }}
                  className="p-2 text-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  🛠️ Developer Tools
                </button>
                <button
                  type="button"
                  onClick={() => { onSelectTab('admin'); onClose(); }}
                  className="p-2 text-center rounded-lg bg-[#001c3c] hover:bg-[#004c80] text-white text-xs font-bold transition-colors"
                >
                  🛡️ Dashboard Admin
                </button>
                <button
                  type="button"
                  onClick={() => { onSelectTab('pendaftaran'); onClose(); }}
                  className="p-2 text-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  📝 Form Pendaftaran
                </button>
                <button
                  type="button"
                  onClick={() => { onSelectTab('timeline'); onClose(); }}
                  className="p-2 text-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  📅 Timeline & Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => { onSelectTab('asesmen'); onClose(); }}
                  className="p-2 text-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  📊 Asesmen Mandiri
                </button>
                <button
                  type="button"
                  onClick={() => { onSelectTab('kehadiran'); onClose(); }}
                  className="p-2 text-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  📲 Presensi / Absensi
                </button>
              </div>
            </div>
          )}

          {/* Tombol Cetak / Simpan Panduan Hak Akses & Kas PIN (PDF) */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => setIsPanduanKasPdfOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>💼 Buku Panduan Akses Kas & Reset PIN (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPanduanPdfOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>📘 Cetak / Simpan Buku Panduan Hak Akses & SOP (PDF)</span>
            </button>
          </div>

          {/* Action buttons at bottom */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {session ? (
              <button
                type="button"
                onClick={handleLogoutToGuest}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Mode Engineer (Lihat Tamu Publik Asli)</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Tutup Konsol
            </button>
          </div>
        </div>
      </div>

      {/* Dokumen PDF Panduan Hak Akses */}
      <PanduanHakAksesPdfModal
        isOpen={isPanduanPdfOpen}
        onClose={() => setIsPanduanPdfOpen(false)}
      />

      {/* Dokumen PDF Panduan Akses Kas & Reset PIN */}
      <PanduanAksesKasPinPdfModal
        isOpen={isPanduanKasPdfOpen}
        onClose={() => setIsPanduanKasPdfOpen(false)}
      />
    </div>
  );
};
