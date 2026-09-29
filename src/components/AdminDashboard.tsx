import React, { useState } from 'react';
import { 
  PesertaItem, 
  TimelineItem, 
  JadwalItem, 
  AsesmenItem,
  UserRole
} from '../types';
import { gasService } from '../services/gasService';
import { 
  formatTanggalIndonesia, 
  formatTanggalPendek, 
  generateQrSvgUrl, 
  toWaLink 
} from '../utils/qrUtils';
import { ProfileModal } from './ProfileModal';
import { PdfExportModal } from './PdfExportModal';
import { 
  Milestone, 
  Calendar, 
  QrCode, 
  Users, 
  BarChart3, 
  Settings, 
  ClipboardList, 
  Network, 
  Lock, 
  LogOut, 
  Search, 
  Edit, 
  Trash2, 
  FileDown, 
  Check, 
  Copy, 
  CloudDownload,
  RefreshCw,
  Terminal, 
  Sparkles, 
  KeyRound,
  UserPlus,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Mail,
  UserCheck,
  Eye,
  EyeOff,
  RotateCcw,
  Key
} from 'lucide-react';

import { 
  EngineerSession, 
  authService, 
  AUTHORIZED_ENGINEERS, 
  AdminAccount, 
  AdminRoleType,
  DEFAULT_DEVELOPER_PASSWORD 
} from '../services/authService';

interface AdminDashboardProps {
  userRole?: UserRole;
  engineerSession?: EngineerSession | null;
  onLogout?: () => void;
  onLoginSuccess?: () => void;
  onNavigateToPublic?: () => void;
  onEngineerLogin?: (email: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  userRole,
  engineerSession,
  onLogout,
  onLoginSuccess,
  onNavigateToPublic,
  onEngineerLogin
}) => {
  const [activeTab, setActiveTab] = useState<
    'timeline' | 'jadwal' | 'kehadiran' | 'peserta' | 'statistik' | 'pengaturan' | 'asesmen' | 'kolaborasi'
  >('peserta');

  // Whitelist Admin state (Model 2)
  const [adminWhitelist, setAdminWhitelist] = useState<AdminAccount[]>(() => 
    authService.getAdminWhitelist()
  );
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminNama, setNewAdminNama] = useState('');
  const [newAdminPeran, setNewAdminPeran] = useState<AdminRoleType>('Kurator');
  const [activeAdminProfile, setActiveAdminProfile] = useState<{ email?: string; nama?: string; peran?: string } | null>(() => {
    try {
      const raw = localStorage.getItem('gkf_admin_auth');
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  });

  // Strict Auth gate state - requires valid admin passcode OR active authorized engineer
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // If already authenticated as authorized engineer, bypass immediately!
    if (engineerSession && authService.isAuthorizedEngineer(engineerSession.email)) {
      return true;
    }
    const session = localStorage.getItem('gkf_admin_auth');
    if (session) {
      try {
        const data = JSON.parse(session);
        return data.expiresAt > Date.now();
      } catch {
        return false;
      }
    }
    return false;
  });

  // Login form state (Email + Password)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  // New admin initial password
  const [newAdminPassword, setNewAdminPassword] = useState(DEFAULT_DEVELOPER_PASSWORD);

  // Change Password Modal state
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);

  // Selected session filter
  const [filterSesi, setFilterSesi] = useState<string>('Sesi 2');

  // Search in peserta
  const [pesertaSearch, setPesertaSearch] = useState('');
  const [selectedPesertaForModal, setSelectedPesertaForModal] = useState<PesertaItem | null>(null);

  // Forms states
  const [timelineForm, setTimelineForm] = useState<Partial<TimelineItem>>({
    urutan: 1,
    tahapan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: ''
  });
  const [editingTimelineRow, setEditingTimelineRow] = useState<number | null>(null);

  const [jadwalForm, setJadwalForm] = useState<Partial<JadwalItem>>({
    tanggal: '',
    waktu: '09.00 - 12.00 WIB',
    topik: '',
    pemateri: '',
    lokasi: '',
    catatan: '',
    linkMateri: ''
  });
  const [editingJadwalRow, setEditingJadwalRow] = useState<number | null>(null);

  // Kehadiran state
  const [selectedKehadiranSesiId, setSelectedKehadiranSesiId] = useState<string>('');
  const [manualNamaUsaha, setManualNamaUsaha] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Asesmen expand
  const [expandedAsesmenIdx, setExpandedAsesmenIdx] = useState<number | null>(null);
  const [expandedB3Idx, setExpandedB3Idx] = useState<number | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState(gasService.getSettings());

  // PDF Export Modal
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfModalTitle, setPdfModalTitle] = useState('');
  const [pdfModalSubtitle, setPdfModalSubtitle] = useState('');
  const [pdfModalContent, setPdfModalContent] = useState<React.ReactNode>(null);

  // Small group generator
  const [groupSize, setGroupSize] = useState(5);
  const [generatedGroups, setGeneratedGroups] = useState<any[]>([]);

  // Pulling state
  const [isPulling, setIsPulling] = useState(false);

  // Notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handlePullFromLiveSheet = async () => {
    setIsPulling(true);
    const res = await gasService.syncFromLiveSpreadsheet();
    setIsPulling(false);
    showToast(res.message);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = authService.verifyAdminLogin(loginEmail, loginPassword);

    if (result.success) {
      if (result.authType === 'engineer' && result.account) {
        onEngineerLogin?.(result.account.email);
      }
      setIsAuthenticated(true);
      setAuthError(false);
      setAuthErrorMessage(null);
      if (result.account) {
        const accName = 'name' in result.account ? result.account.name : result.account.nama;
        const accPeran = 'peran' in result.account ? result.account.peran : 'Lead Developer';
        setActiveAdminProfile({
          email: result.account.email,
          nama: accName,
          peran: accPeran
        });
      }
      onLoginSuccess?.();
    } else {
      setAuthError(true);
      setAuthErrorMessage(result.message);
    }
  };

  const handleQuickEngineerLogin = (email: string) => {
    const res = authService.loginWithEmail(email);
    if (res.success && res.session) {
      onEngineerLogin?.(email);
      setIsAuthenticated(true);
      setAuthError(false);
      setAuthErrorMessage(null);
      setActiveAdminProfile({
        email: res.session.email,
        nama: res.session.name,
        peran: 'Lead Developer'
      });
      onLoginSuccess?.();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gkf_admin_auth');
    authService.logout();
    setIsAuthenticated(false);
    setActiveAdminProfile(null);
    setLoginEmail('');
    setLoginPassword('');
    onLogout?.();
  };

  // Change Password Submit (Mandiri oleh Admin)
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = activeAdminProfile?.email || engineerSession?.email;
    if (!targetEmail) {
      setChangePasswordError('Sesi email tidak ditemukan.');
      return;
    }

    if (!newPasswordInput || newPasswordInput.trim().length < 6) {
      setChangePasswordError('Password baru minimal 6 karakter.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setChangePasswordError('Konfirmasi password baru tidak cocok.');
      return;
    }

    const res = authService.changePassword(targetEmail, oldPasswordInput, newPasswordInput);
    if (res.success) {
      showToast(res.message);
      setIsChangePasswordModalOpen(false);
      setOldPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setChangePasswordError(null);
      setAdminWhitelist(authService.getAdminWhitelist());
    } else {
      setChangePasswordError(res.message);
    }
  };

  // Reset Password ke Default oleh Developer
  const handleResetPassword = (email: string) => {
    if (confirm(`Reset password untuk "${email}" kembali ke password default ("${DEFAULT_DEVELOPER_PASSWORD}")?`)) {
      const res = authService.resetPasswordToDefault(email);
      if (res.success) {
        showToast(res.message);
        setAdminWhitelist(authService.getAdminWhitelist());
      } else {
        alert(res.message);
      }
    }
  };

  // Whitelist Admin Handlers (Model 2)
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) {
      alert('Alamat email admin wajib diisi.');
      return;
    }

    const currentActor = engineerSession?.email || activeAdminProfile?.email || 'obeetools@gmail.com';
    const res = authService.addAdminToWhitelist(
      newAdminEmail, 
      newAdminNama, 
      newAdminPeran, 
      newAdminPassword,
      currentActor
    );

    if (res.success) {
      showToast(res.message);
      setAdminWhitelist(authService.getAdminWhitelist());
      setNewAdminEmail('');
      setNewAdminNama('');
      setNewAdminPeran('Kurator');
      setNewAdminPassword(DEFAULT_DEVELOPER_PASSWORD);
    } else {
      alert(res.message);
    }
  };

  const handleRemoveAdmin = (email: string) => {
    if (confirm(`Yakin ingin mencabut hak akses admin untuk "${email}"? Akun ini tidak akan dapat login lagi.`)) {
      const res = authService.removeAdminFromWhitelist(email);
      if (res.success) {
        showToast(res.message);
        setAdminWhitelist(authService.getAdminWhitelist());
      } else {
        alert(res.message);
      }
    }
  };

  const handleToggleAdminStatus = (email: string) => {
    const res = authService.toggleAdminStatus(email);
    if (res.success) {
      showToast(res.message);
      setAdminWhitelist(authService.getAdminWhitelist());
    } else {
      alert(res.message);
    }
  };

  // Timeline Handlers
  const handleSaveTimeline = () => {
    if (!timelineForm.tahapan) {
      alert('Nama tahapan wajib diisi.');
      return;
    }
    const res = gasService.saveTimelineItem({
      ...timelineForm,
      row: editingTimelineRow || undefined
    });
    showToast(res.message);
    setTimelineForm({ urutan: 1, tahapan: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '' });
    setEditingTimelineRow(null);
  };

  const handleDeleteTimeline = (row?: number) => {
    if (!row) return;
    if (confirm('Hapus tahapan timeline ini?')) {
      const res = gasService.deleteTimelineItem(row);
      showToast(res.message);
    }
  };

  // Jadwal Handlers
  const handleSaveJadwal = () => {
    if (!jadwalForm.topik || !jadwalForm.tanggal) {
      alert('Topik dan tanggal pelatihan wajib diisi.');
      return;
    }
    const res = gasService.saveJadwalItem({
      ...jadwalForm,
      row: editingJadwalRow || undefined
    });
    showToast(res.message);
    setJadwalForm({ tanggal: '', waktu: '09.00 - 12.00 WIB', topik: '', pemateri: '', lokasi: '', catatan: '', linkMateri: '' });
    setEditingJadwalRow(null);
  };

  const handleDeleteJadwal = (row?: number) => {
    if (!row) return;
    if (confirm('Hapus jadwal pelatihan ini?')) {
      const res = gasService.deleteJadwalItem(row);
      showToast(res.message);
    }
  };

  // Peserta Kurasi Handler
  const handleUpdateKurasi = (row?: number, status?: string, catatan?: string) => {
    if (!row || !status) return;
    const res = gasService.updateStatusKurasi(row, status, catatan || '');
    showToast(res.message);
  };

  // Kehadiran Handlers
  const currentKehadiran = gasService.getKehadiranBySesi(selectedKehadiranSesiId);

  const handleManualAddHadir = () => {
    if (!selectedKehadiranSesiId || !manualNamaUsaha) {
      alert('Pilih sesi dan nama usaha terlebih dahulu.');
      return;
    }
    const res = gasService.saveKehadiranManual(selectedKehadiranSesiId, manualNamaUsaha);
    if (res.status === 'success') {
      showToast(res.message);
      setManualNamaUsaha('');
    } else {
      alert(res.message);
    }
  };

  const handleDeleteHadir = (namaUsaha: string) => {
    if (confirm(`Hapus presensi untuk "${namaUsaha}"?`)) {
      const res = gasService.deleteKehadiranItem(selectedKehadiranSesiId, namaUsaha);
      showToast(res.message);
    }
  };

  // Settings Handlers
  const handleSaveSettings = () => {
    gasService.saveSettings(settingsForm);
    showToast('Pengaturan program berhasil diperbarui!');
  };

  // PDF Previews
  const openPesertaPdfPreview = () => {
    const list = gasService.getPeserta(filterSesi);
    setPdfModalTitle(`Daftar Peserta Terdaftar - Gekrafs PartnerUp (${filterSesi || 'Semua Sesi'})`);
    setPdfModalSubtitle(`Total ${list.length} Peserta Terdaftar & Terkurasi`);
    setPdfModalContent(
      <table className="w-full text-left text-xs border border-slate-300">
        <thead>
          <tr className="bg-[#eaf2fb] text-[#001c3c] font-bold border-b border-slate-300">
            <th className="p-2 border-r border-slate-300">No</th>
            <th className="p-2 border-r border-slate-300">Nama Usaha</th>
            <th className="p-2 border-r border-slate-300">Pemilik</th>
            <th className="p-2 border-r border-slate-300">Subsektor</th>
            <th className="p-2 border-r border-slate-300">WhatsApp</th>
            <th className="p-2 border-r border-slate-300">Domisili</th>
            <th className="p-2">Status Kurasi</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p, i) => (
            <tr key={p.row || i} className="border-b border-slate-200">
              <td className="p-2 border-r border-slate-200">{i + 1}</td>
              <td className="p-2 border-r border-slate-200 font-bold">{p.namaUsaha}</td>
              <td className="p-2 border-r border-slate-200">{p.namaPemilik}</td>
              <td className="p-2 border-r border-slate-200">{p.subsektor}</td>
              <td className="p-2 border-r border-slate-200 font-mono">{p.whatsapp}</td>
              <td className="p-2 border-r border-slate-200">{p.kotaKabupaten}</td>
              <td className="p-2 font-bold">{p.statusKurasi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    setPdfModalOpen(true);
  };

  const openSingleAsesmenPdfPreview = (a: AsesmenItem) => {
    setPdfModalTitle(`Hasil Asesmen Mandiri - ${a.namaUsaha}`);
    setPdfModalSubtitle(`WhatsApp: ${a.whatsapp} · Total Skor: ${a.totalSkor}/75 · Sesi: ${a.sesi}`);
    setPdfModalContent(
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <strong>Kekuatan:</strong> {a.kekuatan} ({a.kekuatanSkor}/5)
          </div>
          <div>
            <strong>Perlu Perhatian:</strong> {a.kelemahan} ({a.kelemahanSkor}/5)
          </div>
          <div>
            <strong>Bisa Mengajarkan:</strong> {a.poinBisaAjarkan}
          </div>
          <div>
            <strong>Perlu Belajar:</strong> {a.poinPerluDipelajari}
          </div>
        </div>

        {a.materiBisaAjarkan && (
          <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded">
            <strong>Materi Spesifik yang Bisa Diajarkan:</strong> {a.materiBisaAjarkan}
          </div>
        )}

        <h4 className="font-bold text-sm text-[#001c3c] mt-2">Bagian 2 & 3: Rincian 15 Kriteria</h4>
        <table className="w-full text-left text-xs border border-slate-300">
          <thead>
            <tr className="bg-[#eaf2fb] text-[#001c3c] font-bold border-b border-slate-300">
              <th className="p-2 border-r border-slate-300 w-8">No</th>
              <th className="p-2 border-r border-slate-300 w-1/3">Kategori</th>
              <th className="p-2 border-r border-slate-300 w-16">Skor</th>
              <th className="p-2">Catatan Penjelasan</th>
            </tr>
          </thead>
          <tbody>
            {a.rincian.map((r, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="p-2 border-r border-slate-200">{i + 1}</td>
                <td className="p-2 border-r border-slate-200 font-semibold">{r.kriteria}</td>
                <td className="p-2 border-r border-slate-200 font-bold">{r.skor}/5</td>
                <td className="p-2 text-slate-600">{r.catatan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    setPdfModalOpen(true);
  };

  // Group generation
  const handleGenerateGroups = () => {
    const res = gasService.generateKelompok(filterSesi, groupSize);
    setGeneratedGroups(res);
  };

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-14 h-14 rounded-full bg-[#001c3c] text-[#ffc72c] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#001c3c]">Portal Khusus Kurator & Panitia</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Akses dikontrol melalui <strong>Whitelist Email Admin (Model 2)</strong>. Masukkan alamat email admin terdaftar atau passcode master.
          </p>

          {authError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in text-left">
              {authErrorMessage || 'Passcode atau Email tidak valid. Pastikan email Anda sudah didaftarkan di Whitelist Admin.'}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-5 space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Alamat Email Admin Terdaftar
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="contoh: kurator.batu@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] outline-none font-medium text-slate-900 bg-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Hanya email yang sudah didaftarkan di whitelist yang dapat masuk
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Password Akun Admin
                </label>
                <span className="text-[10px] text-slate-400">
                  Awal: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">{DEFAULT_DEVELOPER_PASSWORD}</code>
                </span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] outline-none font-mono text-slate-900 bg-white"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  title={showLoginPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#001c3c] hover:bg-[#004c80] active:bg-[#001c3c] text-white font-extrabold text-sm transition-all shadow-md cursor-pointer text-center"
            >
              Masuk Dashboard Kurator
            </button>

            {/* Akses Cepat Tim Engineer Terdaftar */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center justify-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-purple-600" />
                <span>Akses Cepat Engineer Terdaftar:</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickEngineerLogin('obeetools@gmail.com')}
                  className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition-all flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span>obeetools@gmail.com</span>
                  </div>
                  <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-semibold">
                    Lead Developer
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickEngineerLogin('loehendra@gmail.com')}
                  className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition-all flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>loehendra@gmail.com</span>
                  </div>
                  <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-semibold">
                    Engineer
                  </span>
                </button>
              </div>
            </div>

            {onNavigateToPublic && (
              <button
                type="button"
                onClick={onNavigateToPublic}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors mt-2"
              >
                &larr; Kembali ke Portal Publik (Pendaftaran)
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  const timeline = gasService.getTimeline();
  const jadwal = gasService.getJadwal();
  const pesertaList = gasService.getPeserta(filterSesi);
  const asesmenList = gasService.getAsesmenList(filterSesi);
  const stats = gasService.getDashboardStats(filterSesi);
  const petaKolaborasi = gasService.getPetaKolaborasi(filterSesi);
  const registeredNames = gasService.getRegisteredBusinessNames();

  const filteredPeserta = pesertaList.filter((p) => {
    if (!pesertaSearch) return true;
    const q = pesertaSearch.toLowerCase();
    return (
      p.namaUsaha.toLowerCase().includes(q) ||
      p.namaPemilik.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 sm:top-20 right-3 sm:right-4 z-50 bg-[#001c3c] text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-[#ffc72c] animate-in fade-in">
          <Check className="w-4 h-4 text-[#ffc72c]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Header Bar */}
      <div className="bg-[#001c3c] rounded-2xl p-4 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#ffc72c]">
            <Users className="w-4 h-4" />
            <span>Portal Manajemen Kurasi & Pendampingan</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black mt-1">Dashboard Kurator & Pimpinan</h1>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
            Sesi Aktif: <strong className="text-white">{settingsForm.sesiAktif}</strong> &middot; Data langsung tersambung ke Google Spreadsheet
          </p>
          {engineerSession ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-[11px] mt-1.5 font-medium">
              <Terminal className="w-3 h-3 text-amber-300 flex-shrink-0" />
              <span>Akses Penuh: <strong className="text-white">{engineerSession.name}</strong> ({engineerSession.email}) &middot; {engineerSession.title}</span>
            </div>
          ) : activeAdminProfile ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[11px] mt-1.5 font-medium">
              <UserCheck className="w-3 h-3 text-cyan-300 flex-shrink-0" />
              <span>Login: <strong className="text-white">{activeAdminProfile.nama || activeAdminProfile.email}</strong> &middot; {activeAdminProfile.peran || 'Kurator'}</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Utama Tarik Data Langsung */}
          <button
            onClick={handlePullFromLiveSheet}
            disabled={isPulling}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
          >
            <CloudDownload className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPulling ? 'animate-bounce' : ''}`} />
            <span>{isPulling ? 'Menarik...' : 'Tarik Sheet Asli'}</span>
          </button>

          {/* Tombol Ganti Password */}
          <button
            type="button"
            onClick={() => {
              setChangePasswordError(null);
              setOldPasswordInput('');
              setNewPasswordInput('');
              setConfirmPasswordInput('');
              setIsChangePasswordModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            title="Ganti Password Akun Saya"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#ffc72c]" />
            <span>Ganti Password</span>
          </button>

          {/* Sesi Filter */}
          <select
            value={filterSesi}
            onChange={(e) => setFilterSesi(e.target.value)}
            className="px-2.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none"
          >
            <option value="Sesi 2" className="text-slate-800">Sesi 2 (Aktif)</option>
            <option value="Sesi 1" className="text-slate-800">Sesi 1 (Arsip)</option>
            <option value="" className="text-slate-800">Semua Sesi</option>
          </select>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/10 hover:bg-rose-900/60 active:bg-rose-900/80 border border-white/20 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto scrollbar-none gap-1">
        {[
          { id: 'peserta', label: `Peserta (${pesertaList.length})`, icon: Users },
          { id: 'asesmen', label: `Asesmen (${asesmenList.length})`, icon: ClipboardList },
          { id: 'statistik', label: 'Statistik & Radar', icon: BarChart3 },
          { id: 'kolaborasi', label: 'Peta Kolaborasi', icon: Network },
          { id: 'kehadiran', label: 'Presensi QR', icon: QrCode },
          { id: 'jadwal', label: `Jadwal (${jadwal.length})`, icon: Calendar },
          { id: 'timeline', label: `Timeline (${timeline.length})`, icon: Milestone },
          { id: 'pengaturan', label: 'Pengaturan', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-[#001c3c] text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PESERTA TERDAFTAR */}
      {activeTab === 'peserta' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-[#001c3c]">
                Daftar Peserta Terdaftar ({pesertaList.length} UMKM)
              </h2>
              <p className="text-xs text-slate-500">Klik nama usaha untuk melihat profil lengkap dan kontak WhatsApp langsung</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari usaha, pemilik..."
                  value={pesertaSearch}
                  onChange={(e) => setPesertaSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-full sm:w-60 focus:ring-2 focus:ring-[#004c80] outline-none"
                />
              </div>
              <button
                onClick={openPesertaPdfPreview}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001c3c] text-white text-xs font-bold hover:bg-[#004c80] active:bg-[#001c3c] flex-shrink-0"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#eaf2fb] text-[#001c3c] font-bold border-b border-slate-200">
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Nama Usaha</th>
                  <th className="p-3">Pemilik</th>
                  <th className="p-3">Subsektor</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Status Kurasi</th>
                  <th className="p-3">Catatan Kurator</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPeserta.map((p) => {
                  return (
                    <tr key={p.row} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {p.timestamp}
                      </td>
                      <td className="p-3 font-bold text-[#001c3c]">
                        <button
                          type="button"
                          onClick={() => setSelectedPesertaForModal(p)}
                          className="hover:text-[#004c80] hover:underline text-left"
                        >
                          {p.namaUsaha}
                        </button>
                      </td>
                      <td className="p-3 text-slate-700">{p.namaPemilik}</td>
                      <td className="p-3 text-slate-600 font-semibold">{p.subsektor}</td>
                      <td className="p-3 font-mono text-slate-800">
                        <a
                          href={toWaLink(p.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline font-semibold"
                        >
                          {p.whatsapp}
                        </a>
                      </td>
                      <td className="p-3">
                        <select
                          value={p.statusKurasi}
                          onChange={(e) => handleUpdateKurasi(p.row, e.target.value, p.catatanKurator)}
                          className={`px-2 py-1 rounded text-xs font-bold border ${
                            p.statusKurasi === 'Diterima'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : p.statusKurasi === 'Ditolak'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : p.statusKurasi === 'Lolos Wawancara'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="Belum Direview">Belum Direview</option>
                          <option value="Lolos Administrasi">Lolos Administrasi</option>
                          <option value="Lolos Wawancara">Lolos Wawancara</option>
                          <option value="Diterima">Diterima</option>
                          <option value="Ditolak">Ditolak</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          defaultValue={p.catatanKurator}
                          placeholder="Catatan..."
                          onBlur={(e) => handleUpdateKurasi(p.row, p.statusKurasi, e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-200 rounded w-44 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#004c80]"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedPesertaForModal(p)}
                          className="px-2.5 py-1 rounded bg-[#eaf2fb] text-[#004c80] hover:bg-[#dbe7f7] font-bold text-[11px]"
                        >
                          Profil
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ASESMEN MANDIRI */}
      {activeTab === 'asesmen' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-[#001c3c]">Hasil Asesmen Mandiri ({asesmenList.length} Usaha)</h2>
              <p className="text-xs text-slate-500">Klik "Lihat Detail" untuk memeriksa rincian 35 jawaban diagnosa mendalam</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#eaf2fb] text-[#001c3c] font-bold border-b border-slate-200">
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Nama Usaha</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Total Skor</th>
                  <th className="p-3">Kekuatan Utama</th>
                  <th className="p-3">Perlu Perhatian</th>
                  <th className="p-3 text-center">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {asesmenList.map((a, idx) => {
                  const isExpanded = expandedAsesmenIdx === idx;
                  const isB3Expanded = expandedB3Idx === idx;

                  return (
                    <React.Fragment key={idx}>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">{a.timestamp}</td>
                        <td className="p-3 font-bold text-[#001c3c]">{a.namaUsaha}</td>
                        <td className="p-3 font-mono">{a.whatsapp}</td>
                        <td className="p-3">
                          <span className="font-extrabold text-sm text-[#004c80]">{a.totalSkor}</span>
                          <span className="text-[10px] text-slate-400">/75</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                            {a.kekuatan || a.poinBisaAjarkan}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[11px]">
                            {a.kelemahan || a.poinPerluDipelajari}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setExpandedAsesmenIdx(isExpanded ? null : idx)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-bold text-[11px] text-slate-700"
                          >
                            {isExpanded ? 'Tutup' : 'Lihat Detail'}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-5 bg-slate-50 border-y border-slate-200">
                            <div className="space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                                    💪 Bisa Diajarkan: {a.poinBisaAjarkan}
                                  </span>
                                  <span className="p-2 rounded-lg bg-amber-100 text-amber-900 font-bold">
                                    📚 Perlu Belajar: {a.poinPerluDipelajari}
                                  </span>
                                </div>
                                <button
                                  onClick={() => openSingleAsesmenPdfPreview(a)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001c3c] text-white text-xs font-bold hover:bg-[#004c80]"
                                >
                                  <FileDown className="w-3.5 h-3.5" />
                                  <span>Export PDF Dokumen Ini</span>
                                </button>
                              </div>

                              {a.materiBisaAjarkan && a.materiBisaAjarkan !== '-' && (
                                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
                                  <strong>Materi Spesifik yang Bisa Diajarkan:</strong> {a.materiBisaAjarkan}
                                </div>
                              )}

                              {/* Bagian 1 Scores */}
                              {a.bagian3 && a.bagian3.length > 0 && (
                                <div className="pt-2">
                                  <div className="font-bold text-xs text-[#001c3c] mb-2 uppercase">
                                    Bagian 1: Skor Rata-rata 8 Pilar Bisnis (/5)
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {a.bagian3.map((b) => (
                                      <div key={b.kategori} className="p-2 bg-white rounded border border-slate-200 text-xs">
                                        <div className="text-[10px] text-slate-500 font-medium truncate">{b.kategori}</div>
                                        <div className="font-bold text-sm text-[#004c80]">{b.skorRataRata} / 5</div>
                                      </div>
                                    ))}
                                  </div>

                                  {a.bagian3Detail && a.bagian3Detail.length > 0 && (
                                    <div className="mt-3">
                                      <button
                                        onClick={() => setExpandedB3Idx(isB3Expanded ? null : idx)}
                                        className="text-xs text-[#004c80] font-bold underline"
                                      >
                                        {isB3Expanded ? 'Sembunyikan 35 Jawaban Detail' : 'Tampilkan 35 Jawaban Detail Lengkap'}
                                      </button>

                                      {isB3Expanded && (
                                        <div className="mt-3 space-y-3 bg-white p-4 rounded-xl border border-slate-200 max-h-96 overflow-y-auto">
                                          {a.bagian3Detail.map((kat) => (
                                            <div key={kat.kategori} className="border-b border-slate-100 pb-2">
                                              <div className="font-bold text-xs text-[#001c3c] mb-1.5">{kat.kategori}</div>
                                              <div className="space-y-1.5">
                                                {kat.rincian.map((qa, qI) => (
                                                  <div key={qI} className="text-[11px] p-2 bg-slate-50 rounded">
                                                    <div className="font-medium text-slate-900">{qa.pertanyaan}</div>
                                                    <div className="text-slate-600 mt-0.5">
                                                      👉 {qa.jawaban} <strong className="text-[#004c80]">({qa.skor}/5)</strong>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* 15 Kriteria Details */}
                              <div className="pt-2">
                                <div className="font-bold text-xs text-[#001c3c] mb-2 uppercase">
                                  Bagian 2 & 3: Rincian 15 Kriteria & Penjelasan
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {a.rincian.map((r, rIdx) => (
                                    <div key={rIdx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                                      <div className="flex items-center justify-between">
                                        <strong className="text-[#001c3c]">{r.kriteria}</strong>
                                        <span className="font-bold text-[#004c80]">{r.skor}/5</span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 mt-1 italic">
                                        "{r.catatan || 'Tidak ada catatan'}"
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STATISTIK & RADAR */}
      {activeTab === 'statistik' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl font-black text-[#001c3c]">{stats.totalPendaftar}</div>
              <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Total Pendaftar</div>
            </div>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm text-center">
              <div className="text-3xl font-black text-emerald-800">{stats.totalDiterima}</div>
              <div className="text-xs font-bold text-emerald-700 mt-1 uppercase tracking-wide">Diterima</div>
            </div>
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm text-center">
              <div className="text-3xl font-black text-amber-800">{stats.belumDireview}</div>
              <div className="text-xs font-bold text-amber-700 mt-1 uppercase tracking-wide">Belum Direview</div>
            </div>
            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 shadow-sm text-center">
              <div className="text-3xl font-black text-rose-800">{stats.totalDitolak}</div>
              <div className="text-xs font-bold text-rose-700 mt-1 uppercase tracking-wide">Ditolak</div>
            </div>
          </div>

          {/* Progress Bar Asesmen */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Progres Pengisian Asesmen Mandiri</span>
              <span className="text-[#004c80]">{stats.persenAsesmenSelesai} ({stats.totalAsesmenSelesai} dari {stats.totalPendaftar})</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#004c80] to-[#0070b3] transition-all duration-500"
                style={{ width: stats.persenAsesmenSelesai }}
              />
            </div>
          </div>

          {/* Subsektor & Domisili Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-[#001c3c] uppercase pb-2 border-b border-slate-100 mb-3">
                Distribusi Subsektor Kreatif
              </h3>
              <div className="space-y-2">
                {stats.subsektor.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                    <span className="text-slate-700 font-medium">{item.label}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eaf2fb] text-[#004c80] font-bold">
                      {item.count} UMKM
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-[#001c3c] uppercase pb-2 border-b border-slate-100 mb-3">
                Distribusi Domisili Usaha
              </h3>
              <div className="space-y-2">
                {stats.domisili.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                    <span className="text-slate-700 font-medium">{item.label}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold">
                      {item.count} UMKM
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PETA KOLABORASI & GROUP GENERATOR */}
      {activeTab === 'kolaborasi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-[#001c3c]">Peta Kolaborasi Peer-to-Peer</h2>
              <p className="text-xs text-slate-500">
                Pencocokan silang antara UMKM yang memiliki keunggulan (Kuat) untuk saling mengajarkan kepada rekan yang membutuhkan (Lemah).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#eaf2fb] text-[#001c3c] font-bold border-b border-slate-200">
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-emerald-800">💪 Bisa Mengajarkan ({petaKolaborasi.reduce((acc, k) => acc + k.bisaMengajar.length, 0)})</th>
                    <th className="p-3 text-amber-800">📚 Perlu Belajar ({petaKolaborasi.reduce((acc, k) => acc + k.perluBelajar.length, 0)})</th>
                    <th className="p-3 text-center">Status Sinergi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {petaKolaborasi.map((kat) => {
                    const hasMatch = kat.bisaMengajar.length > 0 && kat.perluBelajar.length > 0;
                    return (
                      <tr key={kat.kategori} className={hasMatch ? 'bg-emerald-50/30' : ''}>
                        <td className="p-3 font-bold text-[#001c3c]">{kat.kategori}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1.5">
                            {kat.bisaMengajar.map((p, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]" title={p.materi}>
                                {p.namaUsaha}
                              </span>
                            ))}
                            {kat.bisaMengajar.length === 0 && <span className="text-slate-400 italic">Belum ada</span>}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1.5">
                            {kat.perluBelajar.map((p, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold text-[11px]">
                                {p.namaUsaha}
                              </span>
                            ))}
                            {kat.perluBelajar.length === 0 && <span className="text-slate-400 italic">Belum ada</span>}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {hasMatch ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                              ✅ Match ({kat.bisaMengajar.length} : {kat.perluBelajar.length})
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Small Group / Circle Mentoring Generator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm uppercase text-[#001c3c]">
                  Generator Circle Mentoring & Kelompok Kecil
                </h3>
                <p className="text-xs text-slate-500">
                  Membagi peserta secara seimbang ke kelompok multidisiplin berdasarkan variasi keunggulan pilar bisnis.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Ukuran Kelompok:</span>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs border border-slate-300 rounded text-center font-bold"
                />
                <button
                  onClick={handleGenerateGroups}
                  className="px-3.5 py-1.5 rounded-lg bg-[#001c3c] text-white text-xs font-bold hover:bg-[#004c80]"
                >
                  Buat Kelompok
                </button>
              </div>
            </div>

            {generatedGroups.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {generatedGroups.map((g) => (
                  <div key={g.nomor} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between font-bold text-xs text-[#001c3c] border-b border-slate-200 pb-2 mb-2">
                      <span>Kelompok {g.nomor}</span>
                      <span className="text-[11px] text-slate-500 font-normal">{g.anggota.length} Anggota</span>
                    </div>
                    <div className="space-y-2">
                      {g.anggota.map((m: any, idx: number) => (
                        <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-xs">
                          <div className="font-bold text-slate-900">{m.namaUsaha}</div>
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                            💪 Keunggulan: {m.kategoriUnggulan}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: PRESENSI KEHADIRAN (QR & MANUAL) */}
      {activeTab === 'kehadiran' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#001c3c]">Manajemen Presensi & QR Pelatihan</h2>
            <p className="text-xs text-slate-500">Tampilkan QR di proyektor kelas atau masukkan presensi manual peserta</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pilih Sesi Pelatihan
                </label>
                <select
                  value={selectedKehadiranSesiId}
                  onChange={(e) => setSelectedKehadiranSesiId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Pilih Sesi --</option>
                  {jadwal.map((sesi, idx) => (
                    <option key={sesi.idSesi} value={sesi.idSesi}>
                      Sesi {idx + 1}: {sesi.topik}
                    </option>
                  ))}
                </select>
              </div>

              {selectedKehadiranSesiId && (
                <div className="text-center space-y-3">
                  <img
                    src={generateQrSvgUrl(
                      `${window.location.origin}?page=kehadiran&sesi_id=${selectedKehadiranSesiId}`,
                      220
                    )}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
                  />
                  <div className="text-xs font-mono text-slate-500 truncate max-w-full">
                    {window.location.origin}?page=kehadiran&sesi_id={selectedKehadiranSesiId}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}?page=kehadiran&sesi_id=${selectedKehadiranSesiId}`
                      );
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="w-full py-2 bg-[#001c3c] hover:bg-[#004c80] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Tautan Tersalin' : 'Salin Tautan Check-in'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="p-4 bg-[#eaf2fb] rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#004c80] uppercase">Rekapitulasi Kehadiran</div>
                  <div className="text-xl font-black text-[#001c3c] mt-0.5">
                    {currentKehadiran.totalHadir} dari {currentKehadiran.totalTerdaftar} Peserta Hadir
                  </div>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="flex gap-2">
                <select
                  value={manualNamaUsaha}
                  onChange={(e) => setManualNamaUsaha(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Tandai Hadir Manual (Pilih Nama Usaha) --</option>
                  {registeredNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleManualAddHadir}
                  className="px-4 py-2 bg-[#004c80] hover:bg-[#0070b3] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                >
                  + Tambah Hadir
                </button>
              </div>

              {/* List */}
              <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-100 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Waktu</th>
                      <th className="p-2.5">Nama Usaha</th>
                      <th className="p-2.5">Metode</th>
                      <th className="p-2.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentKehadiran.hadir.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono text-[11px] text-slate-500">{h.timestamp}</td>
                        <td className="p-2.5 font-bold text-[#001c3c]">{h.namaUsaha}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              h.metode === 'Manual Admin'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {h.metode}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => handleDeleteHadir(h.namaUsaha)}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentKehadiran.hadir.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">
                          Belum ada peserta yang tercatat hadir untuk sesi ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: JADWAL PELATIHAN (CRUD) */}
      {activeTab === 'jadwal' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-[#001c3c]">
              {editingJadwalRow ? 'Edit Sesi Pelatihan' : 'Tambah Sesi Pelatihan Baru'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tanggal</label>
              <input
                type="date"
                value={jadwalForm.tanggal}
                onChange={(e) => setJadwalForm({ ...jadwalForm, tanggal: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Waktu</label>
              <input
                type="text"
                placeholder="09.00 - 12.00 WIB"
                value={jadwalForm.waktu}
                onChange={(e) => setJadwalForm({ ...jadwalForm, waktu: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Topik / Materi</label>
              <input
                type="text"
                placeholder="Judul materi sesi"
                value={jadwalForm.topik}
                onChange={(e) => setJadwalForm({ ...jadwalForm, topik: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pemateri</label>
              <input
                type="text"
                placeholder="Nama narasumber/mentor"
                value={jadwalForm.pemateri}
                onChange={(e) => setJadwalForm({ ...jadwalForm, pemateri: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lokasi / Link</label>
              <input
                type="text"
                placeholder="Lokasi atau link virtual"
                value={jadwalForm.lokasi}
                onChange={(e) => setJadwalForm({ ...jadwalForm, lokasi: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Link Materi Drive</label>
              <input
                type="text"
                placeholder="https://drive.google.com/..."
                value={jadwalForm.linkMateri}
                onChange={(e) => setJadwalForm({ ...jadwalForm, linkMateri: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveJadwal}
              className="px-4 py-2 bg-[#001c3c] hover:bg-[#004c80] text-white text-xs font-bold rounded-lg transition-colors"
            >
              {editingJadwalRow ? 'Perbarui Sesi' : 'Simpan Sesi'}
            </button>
            {editingJadwalRow && (
              <button
                onClick={() => {
                  setEditingJadwalRow(null);
                  setJadwalForm({ tanggal: '', waktu: '09.00 - 12.00 WIB', topik: '', pemateri: '', lokasi: '', catatan: '', linkMateri: '' });
                }}
                className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Batal Edit
              </button>
            )}
          </div>

          <div className="overflow-x-auto pt-4 border-t border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#eaf2fb] text-[#001c3c] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Tanggal</th>
                  <th className="p-2.5">Waktu</th>
                  <th className="p-2.5">Topik</th>
                  <th className="p-2.5">Pemateri</th>
                  <th className="p-2.5">Lokasi</th>
                  <th className="p-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jadwal.map((j) => (
                  <tr key={j.idSesi} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono">{formatTanggalPendek(j.tanggal)}</td>
                    <td className="p-2.5">{j.waktu}</td>
                    <td className="p-2.5 font-bold text-[#001c3c]">{j.topik}</td>
                    <td className="p-2.5">{j.pemateri}</td>
                    <td className="p-2.5">{j.lokasi}</td>
                    <td className="p-2.5 text-center flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingJadwalRow(j.row || null);
                          setJadwalForm({ ...j });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteJadwal(j.row)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: TIMELINE (CRUD) */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-[#001c3c]">
              {editingTimelineRow ? 'Edit Tahapan Timeline' : 'Tambah Tahapan Timeline'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Urutan</label>
              <input
                type="number"
                value={timelineForm.urutan}
                onChange={(e) => setTimelineForm({ ...timelineForm, urutan: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Tahapan</label>
              <input
                type="text"
                placeholder="Contoh: Seleksi Wawancara"
                value={timelineForm.tahapan}
                onChange={(e) => setTimelineForm({ ...timelineForm, tahapan: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={timelineForm.tanggalMulai}
                onChange={(e) => setTimelineForm({ ...timelineForm, tanggalMulai: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tanggal Selesai</label>
              <input
                type="date"
                value={timelineForm.tanggalSelesai}
                onChange={(e) => setTimelineForm({ ...timelineForm, tanggalSelesai: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Keterangan / Detail</label>
            <textarea
              rows={2}
              value={timelineForm.keterangan}
              onChange={(e) => setTimelineForm({ ...timelineForm, keterangan: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveTimeline}
              className="px-4 py-2 bg-[#001c3c] hover:bg-[#004c80] text-white text-xs font-bold rounded-lg transition-colors"
            >
              {editingTimelineRow ? 'Perbarui Tahapan' : 'Simpan Tahapan'}
            </button>
            {editingTimelineRow && (
              <button
                onClick={() => {
                  setEditingTimelineRow(null);
                  setTimelineForm({ urutan: 1, tahapan: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '' });
                }}
                className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Batal Edit
              </button>
            )}
          </div>

          <div className="overflow-x-auto pt-4 border-t border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#eaf2fb] text-[#001c3c] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-12">No</th>
                  <th className="p-2.5">Tahapan</th>
                  <th className="p-2.5">Mulai</th>
                  <th className="p-2.5">Selesai</th>
                  <th className="p-2.5">Keterangan</th>
                  <th className="p-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeline.map((t) => (
                  <tr key={t.row} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold">{t.urutan}</td>
                    <td className="p-2.5 font-bold text-[#001c3c]">{t.tahapan}</td>
                    <td className="p-2.5 font-mono">{formatTanggalPendek(t.tanggalMulai)}</td>
                    <td className="p-2.5 font-mono">{formatTanggalPendek(t.tanggalSelesai)}</td>
                    <td className="p-2.5 text-slate-600">{t.keterangan}</td>
                    <td className="p-2.5 text-center flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingTimelineRow(t.row || null);
                          setTimelineForm({ ...t });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTimeline(t.row)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: PENGATURAN */}
      {activeTab === 'pengaturan' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-[#001c3c]">Pengaturan Siklus Program & Asesmen</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sesi / Chapter PartnerUp Aktif
              </label>
              <input
                type="text"
                value={settingsForm.sesiAktif}
                onChange={(e) => setSettingsForm({ ...settingsForm, sesiAktif: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none font-bold"
              />
              <span className="text-[11px] text-slate-500">
                Nama sesi ini otomatis dicap ke seluruh pendaftar & asesmen baru
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Batas Akhir Pendaftaran
              </label>
              <input
                type="date"
                value={settingsForm.registrationDeadline}
                onChange={(e) => setSettingsForm({ ...settingsForm, registrationDeadline: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tanggal Buka Asesmen Mandiri
              </label>
              <input
                type="date"
                value={settingsForm.assessmentOpenDate}
                onChange={(e) => setSettingsForm({ ...settingsForm, assessmentOpenDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tanggal Tutup Asesmen Mandiri
              </label>
              <input
                type="date"
                value={settingsForm.assessmentCloseDate}
                onChange={(e) => setSettingsForm({ ...settingsForm, assessmentCloseDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Passcode Master Cadangan (PIN Darurat)
            </label>
            <input
              type="text"
              value={settingsForm.passcode || '123456'}
              onChange={(e) => setSettingsForm({ ...settingsForm, passcode: e.target.value })}
              className="w-full sm:w-64 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none font-mono"
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              Passcode darurat jika panitia tidak login dengan email (saat ini: 123456)
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 bg-[#001c3c] hover:bg-[#004c80] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Simpan Siklus Program
            </button>
          </div>

          {/* SECTION MODEL 2: KONTROL WHITELIST EMAIL ADMIN */}
          <div className="pt-6 border-t border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#eaf2fb] p-4 rounded-xl border border-blue-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#004c80]">
                  <ShieldAlert className="w-4 h-4 text-[#004c80]" />
                  <span>Kontrol Hak Akses: Whitelist Email Admin (Model 2)</span>
                </div>
                <h3 className="text-base font-extrabold text-[#001c3c] mt-0.5">
                  Daftar Akun Admin & Kurator yang Diizinkan Login
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Hanya email di bawah ini yang dapat login ke Dashboard Admin. Anda dapat menambah atau mencabut hak akses panitia sewaktu-waktu.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] bg-[#001c3c] text-[#ffc72c] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  {adminWhitelist.filter(a => a.status === 'Aktif').length} Admin Aktif
                </span>
              </div>
            </div>

            {/* Form Tambah Admin Baru */}
            <form onSubmit={handleAddAdmin} className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#001c3c] uppercase">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Tambah Email Admin / Kurator Baru</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Alamat Email Admin *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama.panitia@gmail.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nama Lengkap / Panggilan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi (Divisi Acara)"
                    value={newAdminNama}
                    onChange={(e) => setNewAdminNama(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Peran / Jabatan
                  </label>
                  <select
                    value={newAdminPeran}
                    onChange={(e) => setNewAdminPeran(e.target.value as AdminRoleType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white font-semibold text-slate-800"
                  >
                    <option value="Kurator">Kurator (Penilaian & Review)</option>
                    <option value="Panitia">Panitia (Presensi & Acara)</option>
                    <option value="Pimpinan">Pimpinan (Monitoring & Laporan)</option>
                    <option value="Admin Operasional">Admin Operasional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Password Awal Akun *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Default: Gekrafs2026!"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Admin dapat login menggunakan email & password awal ini, kemudian menggantinya sendiri di dalam sistem.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambahkan ke Whitelist</span>
                </button>
              </div>
            </form>

            {/* Tabel Whitelist Admin Aktif */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-[#001c3c] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Nama & Alamat Email</th>
                    <th className="p-3">Peran</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Password Akun</th>
                    <th className="p-3 hidden sm:table-cell">Ditambahkan</th>
                    <th className="p-3 text-center">Aksi / Kontrol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminWhitelist.map((adm) => {
                    const isProtected = adm.isProtected || adm.email === 'obeetools@gmail.com' || adm.email === 'loehendra@gmail.com';
                    return (
                      <tr key={adm.email} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{adm.nama}</span>
                            {isProtected && (
                              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded border border-purple-200">
                                Developer
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{adm.email}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            adm.peran === 'Lead Developer'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : adm.peran === 'Kurator'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : adm.peran === 'Pimpinan'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {adm.peran}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            disabled={isProtected}
                            onClick={() => handleToggleAdminStatus(adm.email)}
                            title={isProtected ? 'Akun pengembang inti selalu aktif' : 'Klik untuk mengubah status aktif/nonaktif'}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                              adm.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
                            } ${isProtected ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${adm.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <span>{adm.status}</span>
                          </button>
                        </td>
                        <td className="p-3">
                          {adm.isDefaultPassword !== false ? (
                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-mono inline-block">
                              Bawaan Dev ({DEFAULT_DEVELOPER_PASSWORD})
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Diubah Mandiri</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 text-[11px] hidden sm:table-cell">
                          <div>{adm.tanggalDitambahkan || '-'}</div>
                          <div className="text-[10px] text-slate-400">oleh {adm.ditambahkanOleh.split('@')[0]}</div>
                        </td>
                        <td className="p-3 text-center">
                          {isProtected ? (
                            <span className="text-[10px] text-slate-400 font-semibold italic">
                              Akun Terlindungi
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleResetPassword(adm.email)}
                                title={`Reset password ke bawaan developer (${DEFAULT_DEVELOPER_PASSWORD})`}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3 text-amber-600" />
                                <span>Reset PIN</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveAdmin(adm.email)}
                                title="Cabut Akses Admin"
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3 text-rose-600" />
                                <span>Cabut</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedPesertaForModal && (
        <ProfileModal
          peserta={selectedPesertaForModal}
          onClose={() => setSelectedPesertaForModal(null)}
        />
      )}

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title={pdfModalTitle}
        subtitle={pdfModalSubtitle}
      >
        {pdfModalContent}
      </PdfExportModal>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#001c3c] text-[#ffc72c] flex items-center justify-center font-bold shadow">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#001c3c]">Ganti Password Akun Saya</h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {activeAdminProfile?.email || engineerSession?.email || 'admin@gekrafs.id'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {changePasswordError && (
              <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {changePasswordError}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Password Saat Ini / Bawaan Awal
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password lama..."
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none font-mono pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Password Baru Pilihan Anda (Min. 6 Karakter)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password baru..."
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none font-mono pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Konfirmasi Ulang Password Baru
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang password baru..."
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#001c3c] hover:bg-[#004c80] text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
                >
                  Simpan Password Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
