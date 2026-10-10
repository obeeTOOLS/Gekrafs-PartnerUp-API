import React, { useState, useEffect } from 'react';
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
  toWaLink,
  downloadBrandedQrPngFile
} from '../utils/qrUtils';
import { ProfileModal } from './ProfileModal';
import { PdfExportModal } from './PdfExportModal';
import { WhatsAppBroadcastModal } from './WhatsAppBroadcastModal';
import { WhatsAppSettingsModal } from './WhatsAppSettingsModal';
import { VisualAnalyticsDashboard } from './VisualAnalyticsDashboard';
import { MentoringTracker } from './MentoringTracker';
import { LegalitasTracker } from './LegalitasTracker';
import { SertifikatKelulusanModal } from './SertifikatKelulusanModal';
import { KatalogDirektori } from './KatalogDirektori';
import { EditUmkmModal } from './EditUmkmModal';
import { IndonesianDatePicker } from './IndonesianDatePicker';
import { PanduanHakAksesPdfModal } from './PanduanHakAksesPdfModal';
import { whatsappService } from '../services/whatsappService';
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
  Key,
  MessageSquare,
  BookOpen,
  Award,
  ShieldCheck,
  Bell,
  Store,
  Compass,
  AlertTriangle,
  Download,
  FileText,
  FileEdit,
  AlertCircle,
  Target,
  TrendingUp,
  Wallet
} from 'lucide-react';

import { StrategicRoadmapReview } from './StrategicRoadmapReview';
import { TaskQuestionEditor } from './TaskQuestionEditor';
import { UntunginKasModal } from './UntunginKasModal';
import { taskService } from '../services/taskService';
import { kasService } from '../services/kasService';
import { HEADLESS_GAS_CODE } from '../services/headlessGasCode';
import { diagnoseAssessment } from '../services/assessmentDiagnosisService';

import { 
  EngineerSession, 
  authService, 
  AUTHORIZED_ENGINEERS, 
  AdminAccount, 
  AdminRoleType,
  DEFAULT_DEVELOPER_PASSWORD,
  DEFAULT_ENGINEER_PIN
} from '../services/authService';

interface AdminDashboardProps {
  userRole?: UserRole;
  engineerSession?: EngineerSession | null;
  initialTab?: 'timeline' | 'jadwal' | 'kehadiran' | 'peserta' | 'statistik' | 'pengaturan' | 'asesmen' | 'kolaborasi' | 'mentoring' | 'legalitas' | 'katalog' | 'tugas' | 'kelola_soal';
  onLogout?: () => void;
  onLoginSuccess?: () => void;
  onNavigateToPublic?: () => void;
  onEngineerLogin?: (email: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  userRole,
  engineerSession,
  initialTab,
  onLogout,
  onLoginSuccess,
  onNavigateToPublic,
  onEngineerLogin
}) => {
  const [activeTab, setActiveTab] = useState<
    'timeline' | 'jadwal' | 'kehadiran' | 'peserta' | 'statistik' | 'pengaturan' | 'asesmen' | 'kolaborasi' | 'mentoring' | 'legalitas' | 'katalog' | 'tugas' | 'kelola_soal'
  >(() => initialTab || 'peserta');

  const [sertifikatModalPeserta, setSertifikatModalPeserta] = useState<PesertaItem | null>(null);
  const [editingUmkmPeserta, setEditingUmkmPeserta] = useState<PesertaItem | null>(null);
  const [untunginModalPeserta, setUntunginModalPeserta] = useState<PesertaItem | null>(null);
  const [taskCount, setTaskCount] = useState<number>(() => taskService.getAllTasks().length);
  const [, setAdminDataVersion] = useState(0);

  useEffect(() => {
    const handleTasksUpdate = () => {
      setTaskCount(taskService.getAllTasks().length);
    };
    const handleDataUpdate = () => {
      setAdminDataVersion(v => v + 1);
    };
    window.addEventListener('gkf-tasks-updated', handleTasksUpdate);
    window.addEventListener('gkf-data-updated', handleDataUpdate);
    return () => {
      window.removeEventListener('gkf-tasks-updated', handleTasksUpdate);
      window.removeEventListener('gkf-data-updated', handleDataUpdate);
    };
  }, []);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Whitelist Admin state (Model 2)
  const [adminWhitelist, setAdminWhitelist] = useState<AdminAccount[]>(() => 
    authService.getAdminWhitelist()
  );
  // Modal Konfirmasi Terpusat "PartnerUp Says" di Tengah Layar
  const [partnerUpConfirmDialog, setPartnerUpConfirmDialog] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    details?: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminNama, setNewAdminNama] = useState('');
  const [newAdminPeran, setNewAdminPeran] = useState<AdminRoleType>('Kurator');
  const [activeAdminProfile, setActiveAdminProfile] = useState<{ email?: string; nama?: string; peran?: string } | null>(() => {
    if (engineerSession) {
      return {
        email: engineerSession.email,
        nama: engineerSession.name,
        peran: 'Lead Developer'
      };
    }
    return authService.getAdminAuthSession();
  });

  // Strict Auth gate state - requires valid admin whitelist session OR active authorized engineer
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // If already authenticated as authorized engineer, bypass immediately!
    if (engineerSession && authService.isAuthorizedEngineer(engineerSession.email)) {
      return true;
    }
    return authService.getAdminAuthSession() !== null;
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

  // Global Force Logout Modal State
  const [isForceLogoutModalOpen, setIsForceLogoutModalOpen] = useState(false);
  const [forceLogoutToast, setForceLogoutToast] = useState<string | null>(null);

  const handleTriggerGlobalForceLogout = () => {
    const actor = engineerSession?.email || activeAdminProfile?.email || 'Lead Developer';
    const res = authService.triggerGlobalForceLogout(`Force logout global oleh ${actor}`);
    setForceLogoutToast(res.message);
    setIsForceLogoutModalOpen(false);
    setTimeout(() => {
      onLogout?.();
      window.location.reload();
    }, 1500);
  };

  // WhatsApp Broadcast & Settings modals
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isWhatsAppSettingsModalOpen, setIsWhatsAppSettingsModalOpen] = useState(false);
  const [isDownloadingQr, setIsDownloadingQr] = useState(false);
  const [isPanduanPdfOpen, setIsPanduanPdfOpen] = useState(false);

  // Forms states
  const [timelineForm, setTimelineForm] = useState<Partial<TimelineItem>>({
    urutan: 1,
    tahapan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: ''
  });
  const [editingTimelineRow, setEditingTimelineRow] = useState<number | null>(null);
  const [isSavingTimeline, setIsSavingTimeline] = useState(false);
  const [timelineFeedback, setTimelineFeedback] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

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

  // Asesmen expand & diagnosis state
  const [expandedAsesmenIdx, setExpandedAsesmenIdx] = useState<number | null>(null);
  const [expandedB3Idx, setExpandedB3Idx] = useState<number | null>(null);
  const [asesmenSearchQuery, setAsesmenSearchQuery] = useState('');
  const [asesmenStageFilter, setAsesmenStageFilter] = useState<'all' | 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4'>('all');
  const [copiedAsesmenWaIdx, setCopiedAsesmenWaIdx] = useState<number | null>(null);
  const [asesmenToast, setAsesmenToast] = useState<string | null>(null);

  const handleCopyAsesmenWa = (idx: number, draftMsg: string) => {
    navigator.clipboard.writeText(draftMsg);
    setCopiedAsesmenWaIdx(idx);
    setAsesmenToast('✅ Format pesan WhatsApp hasil asesmen berhasil disalin ke clipboard!');
    setTimeout(() => {
      setCopiedAsesmenWaIdx(null);
      setAsesmenToast(null);
    }, 3000);
  };

  const handleSendAsesmenWa = (a: AsesmenItem, draftMsg: string) => {
    if (!a.whatsapp) return;
    const cleanPhone = a.whatsapp.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('0') 
      ? '62' + cleanPhone.slice(1) 
      : (cleanPhone.startsWith('62') ? cleanPhone : '62' + cleanPhone);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(draftMsg)}`, '_blank');
  };

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
  const [copiedCodeGs, setCopiedCodeGs] = useState(false);

  const handleCopyCodeGs = () => {
    navigator.clipboard.writeText(HEADLESS_GAS_CODE);
    setCopiedCodeGs(true);
    showToast('✅ Seluruh kode "Code.gs" versi utuh berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedCodeGs(false), 3000);
  };

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
      } else {
        onEngineerLogin?.('');
      }
      setIsAuthenticated(true);
      setAuthError(false);
      setAuthErrorMessage(null);
      if (result.account) {
        const accName = 'name' in result.account ? result.account.name : result.account.nama;
        const accPeran = 'peran' in result.account ? result.account.peran : 'Kurator';
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
    const isEng = authService.isAuthorizedEngineer(email);
    const defPwd = isEng ? DEFAULT_ENGINEER_PIN : DEFAULT_DEVELOPER_PASSWORD;
    setPartnerUpConfirmDialog({
      isOpen: true,
      title: 'PartnerUp Says',
      message: `Reset password/PIN untuk "${email}"?`,
      details: `Password/PIN akun ini akan dikembalikan ke bawaan default ("${defPwd}").`,
      confirmLabel: 'Ya, Reset Password',
      onConfirm: () => {
        const res = authService.resetPasswordToDefault(email);
        showToast(res.message);
        setAdminWhitelist(authService.getAdminWhitelist());
        setPartnerUpConfirmDialog(null);
      }
    });
  };

  // Whitelist Admin Handlers (Model 2)
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) {
      showToast('Alamat email admin wajib diisi.');
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
      showToast(res.message);
    }
  };

  const handleRemoveAdmin = (email: string) => {
    setPartnerUpConfirmDialog({
      isOpen: true,
      title: 'PartnerUp Says',
      message: `Cabut hak akses admin untuk "${email}"?`,
      details: 'Akun ini tidak akan dapat login lagi ke portal kurator/panitia.',
      confirmLabel: 'Ya, Cabut Akses',
      onConfirm: () => {
        const res = authService.removeAdminFromWhitelist(email);
        showToast(res.message);
        setAdminWhitelist(authService.getAdminWhitelist());
        setPartnerUpConfirmDialog(null);
      }
    });
  };

  const handleToggleAdminStatus = (email: string) => {
    const res = authService.toggleAdminStatus(email);
    if (res.success) {
      showToast(res.message);
      setAdminWhitelist(authService.getAdminWhitelist());
    } else {
      showToast(res.message);
    }
  };

  // Timeline Handlers
  const handleSaveTimeline = async () => {
    if (!timelineForm.tahapan) {
      showToast('Nama tahapan wajib diisi.');
      return;
    }
    setIsSavingTimeline(true);
    setTimelineFeedback(null);
    try {
      const res = await gasService.saveTimelineItem({
        ...timelineForm,
        row: editingTimelineRow || undefined
      });
      showToast(res.message);
      setTimelineFeedback({
        type: res.status as any,
        message: res.message
      });
      setTimelineForm({ urutan: 1, tahapan: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '' });
      setEditingTimelineRow(null);
    } catch (err: any) {
      setTimelineFeedback({
        type: 'error',
        message: `Gagal mengirim ke Google Apps Script: ${err.message || 'Error jaringan'}`
      });
    } finally {
      setIsSavingTimeline(false);
    }
  };

  const handleDeleteTimeline = async (row?: number) => {
    if (!row) return;
    setPartnerUpConfirmDialog({
      isOpen: true,
      title: 'PartnerUp Says',
      message: 'Hapus tahapan timeline ini?',
      details: 'Tahapan ini akan dihapus dari agenda pembinaan.',
      confirmLabel: 'Ya, Hapus',
      onConfirm: async () => {
        const res = await gasService.deleteTimelineItem(row);
        showToast(res.message);
        setPartnerUpConfirmDialog(null);
      }
    });
  };

  // Jadwal Handlers
  const handleSaveJadwal = () => {
    if (!jadwalForm.topik || !jadwalForm.tanggal) {
      showToast('Topik dan tanggal pelatihan wajib diisi.');
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
    setPartnerUpConfirmDialog({
      isOpen: true,
      title: 'PartnerUp Says',
      message: 'Hapus jadwal pelatihan ini?',
      details: 'Sesi jadwal pelatihan ini akan dihapus dari sistem.',
      confirmLabel: 'Ya, Hapus',
      onConfirm: () => {
        const res = gasService.deleteJadwalItem(row);
        showToast(res.message);
        setPartnerUpConfirmDialog(null);
      }
    });
  };

  const handleSendReminderJadwal = (item: JadwalItem) => {
    const text = `*PENGINGAT KELAS PEMBINAAN H-1 GEKRAFS PARTNERUP 2026* 📢\n\nHalo rekan-rekan pelaku UMKM binaan DPC GEKRAFS Kota Batu!\n\nMengingatkan esok hari kita akan melaksanakan sesi pembinaan:\n📌 *Topik:* ${item.topik}\n📅 *Tanggal:* ${item.tanggal}\n⏰ *Waktu:* ${item.waktu}\n📍 *Lokasi:* ${item.lokasi}\n🎙️ *Pemateri:* ${item.pemateri}\n\nMohon hadir tepat waktu dan siapkan kartu barcode QR presensi Anda. Sampai jumpa di kelas! ✨`;

    navigator.clipboard.writeText(text);
    setIsBroadcastModalOpen(true);
    showToast('Teks pengingat H-1 berhasil disiapkan & disalin ke clipboard!');
  };

  // Peserta Kurasi Handler
  const handleUpdateKurasi = (row?: number, status?: string, catatan?: string) => {
    if (!row || !status) return;
    const res = gasService.updateStatusKurasi(row, status, catatan || '');
    showToast(res.message);
  };

  const handleSendPesertaWa = async (p: PesertaItem) => {
    const settings = whatsappService.getSettings();
    if (!settings.fonnteToken) {
      const url = whatsappService.createManualWaUrl(
        p.whatsapp,
        whatsappService.buildCurationStatusMessage({
          nama: p.namaPemilik,
          namaUsaha: p.namaUsaha,
          status: p.statusKurasi,
          catatan: p.catatanKurator
        })
      );
      window.open(url, '_blank');
      showToast(`Membuka WhatsApp Web untuk ${p.namaPemilik}`);
      return;
    }

    setPartnerUpConfirmDialog({
      isOpen: true,
      title: 'PartnerUp Says',
      message: `Kirim notifikasi status kurasi (${p.statusKurasi}) ke WhatsApp ${p.namaPemilik}?`,
      details: `Nomor: ${p.whatsapp}. Notifikasi akan dikirim otomatis via Fonnte Gateway.`,
      confirmLabel: 'Ya, Kirim Otomatis',
      onConfirm: async () => {
        setPartnerUpConfirmDialog(null);
        showToast(`Mengirim pesan ke WhatsApp ${p.namaPemilik}...`);
        const res = await whatsappService.sendCurationStatusNotification({
          nama: p.namaPemilik,
          namaUsaha: p.namaUsaha,
          telepon: p.whatsapp,
          status: p.statusKurasi,
          catatan: p.catatanKurator
        }, 'auto');
        showToast(res.message);
      }
    });
  };

  // Kehadiran Handlers
  const currentKehadiran = gasService.getKehadiranBySesi(selectedKehadiranSesiId);

  const handleManualAddHadir = () => {
    if (!selectedKehadiranSesiId || !manualNamaUsaha) {
      showToast('Pilih sesi dan nama usaha terlebih dahulu.');
      return;
    }
    const res = gasService.saveKehadiranManual(selectedKehadiranSesiId, manualNamaUsaha);
    if (res.status === 'success') {
      showToast(res.message);
      setManualNamaUsaha('');
    } else {
      showToast(res.message);
    }
  };

  const handleDeleteHadir = (namaUsaha: string) => {
    setPartnerUpConfirmDialog({
      isOpen: true,
      title: 'PartnerUp Says',
      message: `Hapus presensi untuk "${namaUsaha}"?`,
      details: 'Data kehadiran peserta pada sesi ini akan dihapus.',
      confirmLabel: 'Ya, Hapus Presensi',
      onConfirm: () => {
        const res = gasService.deleteKehadiranItem(selectedKehadiranSesiId, namaUsaha);
        showToast(res.message);
        setPartnerUpConfirmDialog(null);
      }
    });
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

          {/* Tombol Broadcast Pengumuman WhatsApp */}
          <button
            type="button"
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white text-xs font-bold shadow transition-all cursor-pointer"
            title="Kirim Pengumuman Bebas ke Grup WhatsApp Peserta/Panitia"
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
            <span>Broadcast WA</span>
          </button>

          {/* Tombol Pengaturan WhatsApp */}
          <button
            type="button"
            onClick={() => setIsWhatsAppSettingsModalOpen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 text-white transition-colors cursor-pointer"
            title="Pengaturan WhatsApp Gateway & ID Grup Fonnte"
          >
            <Settings className="w-4 h-4 text-slate-300 hover:text-white" />
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

          {/* Tombol Cepat Pengaturan Akses & Whitelist */}
          <button
            type="button"
            onClick={() => setActiveTab('pengaturan')}
            title="Kelola Akses Admin & Whitelist Akun"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pengaturan'
                ? 'bg-amber-400 text-[#001c3c] shadow-md font-black ring-2 ring-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pengaturan Akses</span>
          </button>

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
          { id: 'tugas', label: `Lembar Aksi (${taskCount})`, icon: Compass },
          { id: 'kelola_soal', label: '📝 Kelola Soal Tugas', icon: FileEdit },
          { id: 'asesmen', label: `Asesmen (${asesmenList.length})`, icon: ClipboardList },
          { id: 'statistik', label: 'Analitik Visual & Radar', icon: BarChart3 },
          { id: 'kolaborasi', label: 'Peta Kolaborasi', icon: Network },
          { id: 'mentoring', label: 'Log Mentoring 1-on-1', icon: BookOpen },
          { id: 'legalitas', label: 'Fasilitasi Legalitas', icon: ShieldCheck },
          { id: 'katalog', label: 'Direktori Ekraf (Katalog)', icon: Store },
          { id: 'kehadiran', label: 'Presensi QR', icon: QrCode },
          { id: 'jadwal', label: `Jadwal (${jadwal.length})`, icon: Calendar },
          { id: 'timeline', label: `Timeline (${timeline.length})`, icon: Milestone },
          { id: 'pengaturan', label: '⚙️ Pengaturan Akses', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isPengaturan = tab.id === 'pengaturan';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-[#001c3c] text-white shadow'
                  : isPengaturan
                  ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300/80'
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
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedPesertaForModal(p)}
                            className="px-2.5 py-1 rounded bg-[#eaf2fb] text-[#004c80] hover:bg-[#dbe7f7] font-bold text-[11px] cursor-pointer"
                          >
                            Profil
                          </button>
                          {(() => {
                            const pStatus = kasService.getPremiumStatus(p.namaUsaha);
                            const isPro = pStatus.isPremium || p.namaUsaha.toLowerCase().trim() === 'obeecreatives';
                            const isTrial = !isPro && (pStatus.isTrialActive ?? false);
                            return (
                              <button
                                type="button"
                                onClick={() => setUntunginModalPeserta(p)}
                                title={`Buka Buku Kas Untungin untuk ${p.namaUsaha}${
                                  isPro
                                    ? ' (Untungin Pro Aktif)'
                                    : isTrial
                                    ? ` (Trial Aktif: sisa ${pStatus.remainingTransactions ?? 0} tx / ${pStatus.remainingDays ?? 0} hr)`
                                    : ' (Akun Standar - Trial Selesai)'
                                }`}
                                className={`px-2.5 py-1 rounded font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer border ${
                                  isPro
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300 shadow-2xs'
                                    : isTrial
                                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border-indigo-200'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                <Wallet className={`w-3 h-3 ${
                                  isPro
                                    ? 'text-amber-600'
                                    : isTrial
                                    ? 'text-indigo-600'
                                    : 'text-slate-500'
                                }`} />
                                <span className="hidden xl:inline">Kas</span>
                                {isPro ? (
                                  <span className="text-[9px] bg-amber-400 text-[#001c3c] font-black px-1 rounded-xs leading-tight">
                                    PRO
                                  </span>
                                ) : isTrial ? (
                                  <span className="text-[9px] bg-indigo-600 text-white font-black px-1 rounded-xs leading-tight">
                                    {pStatus.remainingTransactions ?? 0}TX
                                  </span>
                                ) : null}
                              </button>
                            );
                          })()}
                          <button
                            type="button"
                            onClick={() => setEditingUmkmPeserta(p)}
                            title="Edit Informasi Usaha & Unggah Foto Produk"
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3 h-3 text-blue-600" />
                            <span className="hidden xl:inline">Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSertifikatModalPeserta(p)}
                            title="Cetak E-Sertifikat Kelulusan Resmi & Rapor Digital"
                            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Award className="w-3 h-3 text-amber-600" />
                            <span className="hidden xl:inline">Sertifikat</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendPesertaWa(p)}
                            title={`Kirim Notifikasi Status Kurasi (${p.statusKurasi}) ke WA ${p.namaPemilik}`}
                            className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span className="hidden xl:inline">WA</span>
                          </button>
                        </div>
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
      {activeTab === 'asesmen' && (() => {
        // Pre-kalkulasi diagnosis untuk seluruh asesmen
        const diagnosedList = asesmenList.map((a) => ({
          item: a,
          diag: diagnoseAssessment(a)
        }));

        const countL4 = diagnosedList.filter(d => d.diag.stage === 'Tangguh & Potensi Mentor').length;
        const countL3 = diagnosedList.filter(d => d.diag.stage === 'Siap Skala (Scale-Up)').length;
        const countL2 = diagnosedList.filter(d => d.diag.stage === 'Bertumbuh & Stabilisasi').length;
        const countL1 = diagnosedList.filter(d => d.diag.stage === 'Perintisan & Fondasi').length;

        const filtered = diagnosedList.filter(({ item: a, diag }) => {
          const q = asesmenSearchQuery.toLowerCase().trim();
          const matchQ = !q || 
            a.namaUsaha.toLowerCase().includes(q) || 
            a.whatsapp.includes(q) ||
            (a.poinBisaAjarkan && a.poinBisaAjarkan.toLowerCase().includes(q)) ||
            (a.poinPerluDipelajari && a.poinPerluDipelajari.toLowerCase().includes(q)) ||
            diag.pilarTerkuat.nama.toLowerCase().includes(q) ||
            diag.pilarKritis.nama.toLowerCase().includes(q);

          if (!matchQ) return false;
          if (asesmenStageFilter === 'Level 1') return diag.stage === 'Perintisan & Fondasi';
          if (asesmenStageFilter === 'Level 2') return diag.stage === 'Bertumbuh & Stabilisasi';
          if (asesmenStageFilter === 'Level 3') return diag.stage === 'Siap Skala (Scale-Up)';
          if (asesmenStageFilter === 'Level 4') return diag.stage === 'Tangguh & Potensi Mentor';
          return true;
        });

        return (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            {/* Toast Asesmen */}
            {asesmenToast && (
              <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center shadow animate-in fade-in">
                {asesmenToast}
              </div>
            )}

            {/* Header Tab Asesmen */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-[#001c3c]">
                    Hasil Asesmen Mandiri ({asesmenList.length} Usaha)
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold border border-indigo-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>Diagnosis Cepat Otomatis</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sistem otomatis mendiagnosis level kematangan bisnis, pilar kritis, serta menyiapkan draf tindak lanjut WhatsApp kurator.
                </p>
              </div>
            </div>

            {/* KPI Cards: Distribusi Kematangan Bisnis */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setAsesmenStageFilter(asesmenStageFilter === 'Level 4' ? 'all' : 'Level 4')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  asesmenStageFilter === 'Level 4'
                    ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-500/20 shadow-xs'
                    : 'bg-purple-50/60 border-purple-200 hover:bg-purple-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">Level 4: Tangguh / Mentor</span>
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-black text-purple-950 mt-1">{countL4} Usaha</div>
                <div className="text-[10px] text-purple-700 mt-0.5">Skor tinggi & siap berbagi materi</div>
              </button>

              <button
                type="button"
                onClick={() => setAsesmenStageFilter(asesmenStageFilter === 'Level 3' ? 'all' : 'Level 3')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  asesmenStageFilter === 'Level 3'
                    ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">Level 3: Siap Skala</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-950 mt-1">{countL3} Usaha</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Fokus kemitraan komersial & B2B</div>
              </button>

              <button
                type="button"
                onClick={() => setAsesmenStageFilter(asesmenStageFilter === 'Level 2' ? 'all' : 'Level 2')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  asesmenStageFilter === 'Level 2'
                    ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-blue-50/60 border-blue-200 hover:bg-blue-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">Level 2: Bertumbuh</span>
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-black text-blue-950 mt-1">{countL2} Usaha</div>
                <div className="text-[10px] text-blue-700 mt-0.5">Validasi SOP & pembagian tim</div>
              </button>

              <button
                type="button"
                onClick={() => setAsesmenStageFilter(asesmenStageFilter === 'Level 1' ? 'all' : 'Level 1')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  asesmenStageFilter === 'Level 1'
                    ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Level 1: Perintisan</span>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xl font-black text-amber-950 mt-1">{countL1} Usaha</div>
                <div className="text-[10px] text-amber-700 mt-0.5">Butuh penguatan kas & legalitas</div>
              </button>
            </div>

            {/* Filter & Pencarian */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={asesmenSearchQuery}
                  onChange={(e) => setAsesmenSearchQuery(e.target.value)}
                  placeholder="Cari nama usaha, WA, atau pilar..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Filter Kategori:</span>
                {[
                  { id: 'all', label: `Semua (${asesmenList.length})` },
                  { id: 'Level 4', label: `Level 4 (${countL4})` },
                  { id: 'Level 3', label: `Level 3 (${countL3})` },
                  { id: 'Level 2', label: `Level 2 (${countL2})` },
                  { id: 'Level 1', label: `Level 1 (${countL1})` }
                ].map((flt) => (
                  <button
                    key={flt.id}
                    type="button"
                    onClick={() => setAsesmenStageFilter(flt.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      asesmenStageFilter === flt.id
                        ? 'bg-[#001c3c] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabel Asesmen Mandiri dengan Diagnosis Cepat */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#eaf2fb] text-[#001c3c] font-bold border-b border-slate-200">
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Nama Usaha & Kontak</th>
                    <th className="p-3 text-center">Skor Total</th>
                    <th className="p-3">Diagnosis Cepat & Fase</th>
                    <th className="p-3">Pilar Kuat vs Kritis</th>
                    <th className="p-3 text-center">Aksi / Rincian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500 italic">
                        Tidak ada data asesmen yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(({ item: a, diag }, idx) => {
                      const isExpanded = expandedAsesmenIdx === idx;
                      const isB3Expanded = expandedB3Idx === idx;

                      return (
                        <React.Fragment key={idx}>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap align-top">
                              {a.timestamp}
                            </td>
                            <td className="p-3 align-top">
                              <div className="font-extrabold text-[#001c3c] text-sm">{a.namaUsaha}</div>
                              <div className="text-slate-500 font-mono text-[11px] mt-0.5">{a.whatsapp}</div>
                              {a.sesi && (
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {a.sesi}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center align-top whitespace-nowrap">
                              <span className="font-black text-base text-[#004c80]">{a.totalSkor}</span>
                              <span className="text-[10px] text-slate-400">/75</span>
                            </td>
                            <td className="p-3 align-top max-w-xs">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${diag.stageBadgeBg}`}>
                                {diag.stageBadgeText}
                              </span>
                              <p className="text-[11px] text-slate-700 mt-1 leading-snug line-clamp-2" title={diag.ringkasanDiagnosis}>
                                {diag.ringkasanDiagnosis}
                              </p>
                            </td>
                            <td className="p-3 align-top whitespace-nowrap">
                              <div className="space-y-1">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[10px] flex items-center gap-1">
                                  <span>💪</span>
                                  <span>{diag.pilarTerkuat.nama} ({diag.pilarTerkuat.skor}/5)</span>
                                </span>
                                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[10px] flex items-center gap-1">
                                  <span>⚠️</span>
                                  <span>{diag.pilarKritis.nama} ({diag.pilarKritis.skor}/5)</span>
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-center align-top whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setExpandedAsesmenIdx(isExpanded ? null : idx)}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                    isExpanded 
                                      ? 'bg-slate-700 text-white' 
                                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                                  }`}
                                >
                                  {isExpanded ? 'Tutup Detail' : '🔍 Lihat Diagnosis'}
                                </button>
                                {a.whatsapp && (
                                  <button
                                    type="button"
                                    onClick={() => handleSendAsesmenWa(a, diag.waFeedbackDraft)}
                                    title="Kirim Hasil Diagnosis Asesmen ke WhatsApp Peserta"
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Detail Ekspansi: Diagnosis Lengkap & Rincian */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={6} className="p-4 sm:p-5 bg-slate-50/80 border-y border-slate-200">
                                <div className="space-y-4 max-w-4xl">
                                  {/* KARTU DIAGNOSIS OTOMATIS AI & REKOMENDASI KURATOR */}
                                  <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white p-4 sm:p-5 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-3.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-indigo-100">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
                                          <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <h4 className="font-black text-xs sm:text-sm text-indigo-950 flex items-center gap-1.5">
                                            <span>Hasil Diagnosis Cepat Otomatis Kesiapan Usaha</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diag.stageBadgeBg}`}>
                                              {diag.stage}
                                            </span>
                                          </h4>
                                          <p className="text-[11px] text-slate-600">
                                            Analisis berbasis skor 8 pilar bisnis, kesiapan kolaborasi, dan mitigasi bottleneck operasional.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleCopyAsesmenWa(idx, diag.waFeedbackDraft)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                                        >
                                          {copiedAsesmenWaIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />}
                                          <span>{copiedAsesmenWaIdx === idx ? 'Tersalin!' : 'Salin Draf WA'}</span>
                                        </button>

                                        {a.whatsapp && (
                                          <button
                                            type="button"
                                            onClick={() => handleSendAsesmenWa(a, diag.waFeedbackDraft)}
                                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                                          >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>Kirim ke WA</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Ringkasan Analisis Diagnostik */}
                                    <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 text-xs text-slate-800 font-medium italic">
                                      "{diag.ringkasanDiagnosis}"
                                    </div>

                                    {/* Perbandingan Pilar Unggulan vs Pilar Kritis */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                                            <span>🏆 Pilar Paling Matang:</span>
                                            <strong className="text-emerald-700">{diag.pilarTerkuat.nama}</strong>
                                          </span>
                                          <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                                            {diag.pilarTerkuat.skor} / 5
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                                          {diag.pilarTerkuat.keterangan}
                                        </p>
                                      </div>

                                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                                            <span>⚠️ Pilar Kritis (Prioritas Intervensi):</span>
                                            <strong className="text-amber-700">{diag.pilarKritis.nama}</strong>
                                          </span>
                                          <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                                            {diag.pilarKritis.skor} / 5
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-amber-800/80 leading-relaxed">
                                          {diag.pilarKritis.keterangan}
                                        </p>
                                      </div>
                                    </div>

                                    {/* 3 Rekomendasi Tindakan Aksi Nyata */}
                                    <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1.5">
                                      <span className="font-extrabold text-[#001c3c] text-xs block">
                                        🎯 3 Rekomendasi Tindakan Terarah (Action Plan Kurator):
                                      </span>
                                      <ul className="space-y-1">
                                        {diag.rekomendasiAksi.map((rek, rIdx) => (
                                          <li key={rIdx} className="text-[11px] text-slate-700 flex items-start gap-2">
                                            <span className="text-indigo-600 font-bold">•</span>
                                            <span>{rek}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Potensi Peer-Mentoring */}
                                    {diag.potensiPeerMentor && (
                                      <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-200 text-[11px] text-purple-900 flex items-start gap-2">
                                        <Award className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                        <span>
                                          <strong>Potensi Peer-Mentoring:</strong> {diag.potensiPeerMentor}
                                        </span>
                                      </div>
                                    )}

                                    {/* Draf Pesan WhatsApp Resmi Hasil Asesmen */}
                                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-emerald-950 text-[11px] flex items-center gap-1.5">
                                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                          <span>Draf Pesan WhatsApp Resmi Hasil Asesmen Mandiri:</span>
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopyAsesmenWa(idx, diag.waFeedbackDraft)}
                                          className="text-[10px] text-emerald-700 font-bold hover:underline"
                                        >
                                          {copiedAsesmenWaIdx === idx ? '✓ Berhasil Disalin' : 'Salin Teks'}
                                        </button>
                                      </div>
                                      <pre className="p-2.5 bg-white/90 rounded-lg border border-emerald-100 text-[10px] text-slate-700 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                                        {diag.waFeedbackDraft}
                                      </pre>
                                    </div>
                                  </div>

                                  {/* Baris Tombol Aksi & Dokumen */}
                                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                                    <div className="flex flex-wrap gap-2 text-xs">
                                      <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                                        💪 Bisa Diajarkan: {a.poinBisaAjarkan}
                                      </span>
                                      <span className="p-2 rounded-lg bg-amber-100 text-amber-900 font-bold">
                                        📚 Perlu Belajar: {a.poinPerluDipelajari}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => openSingleAsesmenPdfPreview(a)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001c3c] text-white text-xs font-bold hover:bg-[#004c80] transition-colors cursor-pointer"
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

                                  {/* Bagian 1 Scores: 8 Pilar Bisnis */}
                                  {a.bagian3 && a.bagian3.length > 0 && (
                                    <div className="pt-2">
                                      <div className="font-bold text-xs text-[#001c3c] mb-2 uppercase">
                                        Bagian 1: Skor Rata-rata 8 Pilar Bisnis (/5)
                                      </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {a.bagian3.map((b) => (
                                          <div key={b.kategori} className="p-2 bg-white rounded-xl border border-slate-200 text-xs">
                                            <div className="text-[10px] text-slate-500 font-medium truncate">{b.kategori}</div>
                                            <div className="font-bold text-sm text-[#004c80]">{b.skorRataRata} / 5</div>
                                          </div>
                                        ))}
                                      </div>

                                      {a.bagian3Detail && a.bagian3Detail.length > 0 && (
                                        <div className="mt-3">
                                          <button
                                            type="button"
                                            onClick={() => setExpandedB3Idx(isB3Expanded ? null : idx)}
                                            className="text-xs text-[#004c80] font-bold underline cursor-pointer"
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
                                      {/* 15 Kriteria Details */}
                                      {a.rincian && a.rincian.length > 0 && (
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
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* TAB 3: STATISTIK & RADAR (DASHBOARD ANALITIK VISUAL) */}
      {activeTab === 'statistik' && (
        <VisualAnalyticsDashboard
          pesertaList={pesertaList}
          asesmenList={asesmenList}
          stats={stats}
          currentSesi={filterSesi || 'Semua Sesi'}
          availableSesiList={['Sesi 2', 'Sesi 1', 'Semua Sesi']}
          onSesiChange={(sesi) => setFilterSesi(sesi === 'Semua Sesi' ? '' : sesi)}
        />
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

      {/* TAB: LOG MENTORING 1-ON-1 */}
      {activeTab === 'mentoring' && (
        <MentoringTracker pesertaList={pesertaList} />
      )}

      {/* TAB: FASILITASI LEGALITAS (NIB, HALAL, HKI) */}
      {activeTab === 'legalitas' && (
        <LegalitasTracker pesertaList={pesertaList} />
      )}

      {/* TAB: DIREKTORI & KATALOG EKRAF */}
      {activeTab === 'katalog' && (
        <KatalogDirektori pesertaList={pesertaList} />
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

              {selectedKehadiranSesiId && (() => {
                const currentSesiObj = jadwal.find((s) => s.idSesi === selectedKehadiranSesiId);
                const currentSesiIdx = jadwal.findIndex((s) => s.idSesi === selectedKehadiranSesiId) + 1;
                const checkinUrl = `${window.location.origin}?page=kehadiran&sesi_id=${selectedKehadiranSesiId}`;

                return (
                  <div className="text-center space-y-3 animate-in fade-in">
                    {/* Branded QR Code Container */}
                    <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-md relative group">
                      {/* Badge Sesi di atas QR */}
                      <div className="mb-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#001c3c] text-[#ffc72c] px-3 py-0.5 rounded-full inline-block shadow-xs">
                          {currentSesiIdx ? `SESI ${currentSesiIdx}` : 'PELATIHAN RESMI'}
                        </span>
                        <h4 className="text-xs font-extrabold text-[#001c3c] mt-1 line-clamp-1">
                          {currentSesiObj?.topik || 'Presensi Pelatihan'}
                        </h4>
                      </div>

                      {/* Gambar QR Code dengan Lencana Tema di Tengah */}
                      <div className="relative inline-block mx-auto">
                        <img
                          src={generateQrSvgUrl(checkinUrl, 260)}
                          alt="QR Code Presensi"
                          className="w-48 h-48 sm:w-52 sm:h-52 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-inner"
                        />
                        {/* Lencana Tema Pelatihan di Tengah QR */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-14 h-14 rounded-2xl bg-[#001c3c] border-2 border-[#ffc72c] ring-4 ring-white flex flex-col items-center justify-center shadow-lg text-center px-1">
                            <span className="text-[7px] font-bold text-[#ffc72c] uppercase tracking-tighter">PELATIHAN</span>
                            <span className="text-[9px] font-black text-white leading-tight line-clamp-1">
                              {currentSesiIdx ? `SESI ${currentSesiIdx}` : 'EKRAF'}
                            </span>
                            <span className="text-[6px] font-semibold text-slate-300">BATU</span>
                          </div>
                        </div>
                      </div>

                      {/* Di Bawah QR: Tulisan PartnerUp */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100">
                        <div className="text-lg font-black text-[#001c3c] tracking-tight flex items-center justify-center gap-1">
                          <span>PartnerUp</span>
                          <span className="w-2 h-2 rounded-full bg-[#ffc72c]" />
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Arahkan kamera HP ke QR Code untuk mencatat kehadiran
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500 truncate max-w-full px-1">
                      {checkinUrl}
                    </div>

                    {/* Tombol Aksi: Download PNG & Salin Tautan */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        disabled={isDownloadingQr}
                        onClick={async () => {
                          if (!currentSesiObj) return;
                          setIsDownloadingQr(true);
                          try {
                            await downloadBrandedQrPngFile({
                              url: checkinUrl,
                              topik: currentSesiObj.topik,
                              nomorSesi: currentSesiIdx || undefined,
                              tanggal: currentSesiObj.tanggal ? formatTanggalIndonesia(currentSesiObj.tanggal) : undefined,
                              waktu: currentSesiObj.waktu,
                              pemateri: currentSesiObj.pemateri,
                              lokasi: currentSesiObj.lokasi
                            });
                            showToast('QR Code format PNG berhasil di-download!');
                          } catch (e) {
                            console.error('Error downloading QR PNG', e);
                            showToast('Gagal men-download QR Code.');
                          } finally {
                            setIsDownloadingQr(false);
                          }
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-98 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        <span>{isDownloadingQr ? 'Menyiapkan File PNG...' : 'Download QR Code (PNG)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(checkinUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Tautan Tersalin' : 'Salin Tautan Check-in'}</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
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
              <IndonesianDatePicker
                value={jadwalForm.tanggal}
                onChange={(val) => setJadwalForm({ ...jadwalForm, tanggal: val })}
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
                        type="button"
                        onClick={() => handleSendReminderJadwal(j)}
                        title="Kirim Pengingat Sesi H-1 via WhatsApp"
                        className="px-2 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Bell className="w-3 h-3 text-emerald-600" />
                        <span>Kirim WA H-1</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingJadwalRow(j.row || null);
                          setJadwalForm({ ...j });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit Sesi"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteJadwal(j.row)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus Sesi"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-[#001c3c]">
                {editingTimelineRow ? 'Edit Tahapan Timeline' : 'Tambah Tahapan Timeline'}
              </h2>
              <p className="text-xs text-slate-500">
                Setiap perubahan tahapan disinkronkan langsung ke sheet <strong>Timeline</strong> di Google Spreadsheet.
              </p>
            </div>

            {/* Target GAS URL Indicator */}
            <div className="flex items-center gap-2 text-[11px] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600 font-mono truncate max-w-[220px]" title={gasService.getSettings().gasEndpointUrl || 'Belum diatur'}>
                {gasService.getSettings().gasEndpointUrl ? 'Tersambung ke GAS' : 'URL GAS Belum Diatur'}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('dev' as any)}
                className="text-[#004c80] hover:underline font-bold ml-1 cursor-pointer"
              >
                Cek Endpoint
              </button>
            </div>
          </div>

          {/* Sync Feedback Alert */}
          {timelineFeedback && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in font-medium ${
                timelineFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : timelineFeedback.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {timelineFeedback.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <div className="flex-1">{timelineFeedback.message}</div>
              <button
                onClick={() => setTimelineFeedback(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold px-1"
              >
                &times;
              </button>
            </div>
          )}

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
              <IndonesianDatePicker
                value={timelineForm.tanggalMulai}
                onChange={(val) => setTimelineForm({ ...timelineForm, tanggalMulai: val })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tanggal Selesai</label>
              <IndonesianDatePicker
                value={timelineForm.tanggalSelesai}
                onChange={(val) => setTimelineForm({ ...timelineForm, tanggalSelesai: val })}
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
              disabled={isSavingTimeline}
              className="px-4 py-2 bg-[#001c3c] hover:bg-[#004c80] disabled:bg-slate-400 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              {isSavingTimeline && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {isSavingTimeline
                  ? 'Menyinkronkan ke Google Sheet...'
                  : editingTimelineRow
                  ? 'Perbarui Tahapan'
                  : 'Simpan Tahapan'}
              </span>
            </button>
            {editingTimelineRow && (
              <button
                onClick={() => {
                  setEditingTimelineRow(null);
                  setTimelineForm({ urutan: 1, tahapan: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '' });
                }}
                disabled={isSavingTimeline}
                className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300 disabled:opacity-50"
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

      {/* TAB: LEMBAR AKSI & TUGAS KURATOR */}
      {activeTab === 'tugas' && (
        <div className="space-y-4">
          <StrategicRoadmapReview 
            reviewerName={activeAdminProfile?.nama || 'Tim Kurator Gekrafs'} 
            onOpenQuestionEditor={() => setActiveTab('kelola_soal')}
            userRole={userRole}
            isDeveloper={userRole === 'developer' || !!engineerSession}
          />
        </div>
      )}

      {/* TAB: KELOLA SOAL & MODUL TUGAS PELATIHAN */}
      {activeTab === 'kelola_soal' && (
        <TaskQuestionEditor 
          userRole={userRole} 
          onPreviewTask={onNavigateToPublic}
        />
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
              <IndonesianDatePicker
                value={settingsForm.registrationDeadline}
                onChange={(val) => setSettingsForm({ ...settingsForm, registrationDeadline: val })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tanggal Buka Asesmen Mandiri
              </label>
              <IndonesianDatePicker
                value={settingsForm.assessmentOpenDate}
                onChange={(val) => setSettingsForm({ ...settingsForm, assessmentOpenDate: val })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tanggal Tutup Asesmen Mandiri
              </label>
              <IndonesianDatePicker
                value={settingsForm.assessmentCloseDate}
                onChange={(val) => setSettingsForm({ ...settingsForm, assessmentCloseDate: val })}
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
            {/* Global Force Logout & Session Invalidation Card (Eksklusif Khusus Developer / Engineer) */}
            {(userRole === 'developer' || !!engineerSession) && (
              <>
                <div className="bg-gradient-to-r from-rose-50 via-amber-50/40 to-rose-50/70 border border-rose-200/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-xs font-black text-rose-900 uppercase tracking-wider">
                        Sistem Keamanan Sesi Global
                      </span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-mono font-bold px-2 py-0.5 rounded-full border border-rose-200">
                        Whitelist Enforced
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-[#001c3c]">
                      Reset Sesi & Keluarkan Semua Pengguna (Force Logout Global)
                    </h4>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                      Jika terdapat pengguna atau perangkat lama yang masih membuka aplikasi, Anda dapat memutus dan mengeluarkan (force logout) seluruh sesi login di semua HP & laptop secara seketika. Seluruh pengguna wajib masuk ulang menggunakan <strong>Email & Password/PIN</strong> akun terdaftar.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsPanduanPdfOpen(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      title="Buka & Cetak Buku Panduan Hak Akses & SOP Login (Format PDF)"
                    >
                      <FileText className="w-4 h-4 text-amber-300" />
                      <span>Cetak Panduan Hak Akses (PDF)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsForceLogoutModalOpen(true)}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Force Logout Semua Perangkat</span>
                    </button>
                  </div>
                </div>

                {forceLogoutToast && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{forceLogoutToast}</span>
                  </div>
                )}
              </>
            )}

            {/* CARD BACKEND GOOGLE APPS SCRIPT (CODE.GS) VERSI UTUH */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50/40 to-slate-50 border border-purple-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                    Backend Google Apps Script (REST / JSON API)
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-mono font-bold px-2 py-0.5 rounded-full border border-purple-200">
                    Versi Utuh (All-In-One)
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-[#001c3c]">
                  Kode Sumber Lengkap Backend (Code.gs)
                </h4>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Salin seluruh isi file <code>Code.gs</code> versi utuh ke editor Google Apps Script. Kode ini mencakup penerima data tugas peserta (tab <strong>Tugas</strong>), presensi QR (tab <strong>Kehadiran</strong>), pendaftaran, timeline, asesmen, dan seluruh fitur sinkronisasi tanpa potongan.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCopyCodeGs}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  title="Salin seluruh isi Code.gs versi utuh ke clipboard Anda"
                >
                  {copiedCodeGs ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-amber-300" />}
                  <span>{copiedCodeGs ? '✅ Code.gs Tersalin!' : '📋 Salin Utuh Code.gs'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#eaf2fb] p-4 rounded-xl border border-blue-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#004c80]">
                  <ShieldAlert className="w-4 h-4 text-[#004c80]" />
                  <span>Kontrol Hak Akses: Whitelist Email Admin (Model 2)</span>
                </div>
                <h3 className="text-base font-extrabold text-[#001c3c] mt-0.5">
                  Daftar Akun Tim Kurator & Panitia Pelaksana
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Hanya email tim kurator dan panitia di bawah ini yang dapat login ke Portal Kurator. Akun teknis Developer dikelola secara eksklusif di tab <strong>Developer Tools</strong>.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] bg-[#001c3c] text-[#ffc72c] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  {adminWhitelist.filter(a => a.status === 'Aktif' && !a.isProtected && a.email !== 'obeetools@gmail.com' && a.email !== 'loehendra@gmail.com').length} Kurator Aktif
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
                  {(() => {
                    const kuratorWhitelist = adminWhitelist.filter(
                      (adm) =>
                        !adm.isProtected &&
                        adm.email !== 'obeetools@gmail.com' &&
                        adm.email !== 'loehendra@gmail.com' &&
                        adm.peran !== 'Lead Developer'
                    );

                    if (kuratorWhitelist.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            Belum ada akun tim kurator / panitia yang didaftarkan. Gunakan formulir di atas untuk menambahkan akun kurator baru.
                          </td>
                        </tr>
                      );
                    }

                    return kuratorWhitelist.map((adm) => (
                      <tr key={adm.email} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 text-xs">
                            {adm.nama}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{adm.email}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            adm.peran === 'Kurator'
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
                            onClick={() => handleToggleAdminStatus(adm.email)}
                            title="Klik untuk mengubah status aktif/nonaktif"
                            className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              adm.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${adm.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <span>{adm.status}</span>
                          </button>
                        </td>
                        <td className="p-3">
                          {adm.isDefaultPassword !== false ? (
                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-mono inline-block">
                              {adm.email === 'obeetools@gmail.com' || adm.email === 'loehendra@gmail.com' 
                                ? `PIN Dev (${DEFAULT_ENGINEER_PIN})` 
                                : `Bawaan (${DEFAULT_DEVELOPER_PASSWORD})`}
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
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleResetPassword(adm.email)}
                              title="Reset password/PIN ke bawaan"
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
                        </td>
                      </tr>
                    ));
                  })()}
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
          onOpenUntungin={(p) => setUntunginModalPeserta(p)}
        />
      )}

      {/* Untungin — Buku Kas & Laporan Keuangan Modal */}
      {untunginModalPeserta && (
        <UntunginKasModal
          isOpen={!!untunginModalPeserta}
          onClose={() => setUntunginModalPeserta(null)}
          namaUsaha={untunginModalPeserta.namaUsaha}
          namaPemilik={untunginModalPeserta.namaPemilik}
          whatsapp={untunginModalPeserta.whatsapp}
          readOnly={
            // Developer, akun engineer, dan obeecreatives selalu memiliki hak akses input/edit penuh
            !(
              userRole === 'developer' ||
              Boolean(engineerSession) ||
              untunginModalPeserta.namaUsaha.toLowerCase().trim() === 'obeecreatives'
            )
          }
          viewerRole={userRole === 'developer' || !!engineerSession ? 'developer' : userRole || 'kurator'}
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

      {/* Dokumen PDF Khusus Peran Developer / Engineer */}
      <PanduanHakAksesPdfModal
        isOpen={isPanduanPdfOpen}
        onClose={() => setIsPanduanPdfOpen(false)}
      />

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

      {/* WhatsApp Broadcast Modal */}
      <WhatsAppBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onOpenSettings={() => {
          setIsBroadcastModalOpen(false);
          setIsWhatsAppSettingsModalOpen(true);
        }}
      />

      {/* WhatsApp Settings Modal */}
      <WhatsAppSettingsModal
        isOpen={isWhatsAppSettingsModalOpen}
        onClose={() => setIsWhatsAppSettingsModalOpen(false)}
        onSaved={() => showToast('Pengaturan WhatsApp Fonnte berhasil disimpan.')}
      />

      {/* E-Sertifikat Kelulusan & Rapor Digital Modal */}
      {sertifikatModalPeserta && (
        <SertifikatKelulusanModal
          peserta={sertifikatModalPeserta}
          asesmen={asesmenList.find(
            (a) => a.namaUsaha.toLowerCase() === sertifikatModalPeserta.namaUsaha.toLowerCase()
          )}
          onClose={() => setSertifikatModalPeserta(null)}
        />
      )}

      {/* Edit UMKM & Foto Produk Modal */}
      {editingUmkmPeserta && (
        <EditUmkmModal
          peserta={editingUmkmPeserta}
          isOpen={!!editingUmkmPeserta}
          isAdmin={true}
          onClose={() => setEditingUmkmPeserta(null)}
          onSaved={(updated) => {
            showToast(`Profil & foto produk "${updated.namaUsaha}" berhasil diperbarui!`);
            setEditingUmkmPeserta(null);
          }}
        />
      )}

      {/* Modal Konfirmasi Force Logout Global */}
      {isForceLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-extrabold text-[#001c3c]">
                Reset Sesi & Putus Semua Akses?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tindakan ini akan <strong>mencabut seluruh sesi login</strong> di semua HP dan laptop pengguna. Siapa pun yang sedang membuka aplikasi akan langsung diarahkan keluar ke halaman Login dan harus memasukkan <strong>Email & Password/PIN</strong> akun terdaftar.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-[11px] text-amber-900 font-medium">
                💡 <strong>Catatan:</strong> Hanya <strong>{adminWhitelist.filter(a => a.status === 'Aktif').length} akun admin aktif</strong> yang ada di whitelist saat ini yang akan bisa login kembali.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsForceLogoutModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleTriggerGlobalForceLogout}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Ya, Force Logout Semua Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Confirmation Modal "PartnerUp Says" di Tengah Layar */}
      {partnerUpConfirmDialog?.isOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-1.5">
                <span className="px-3 py-1 rounded-full bg-[#eaf2fb] text-[#004c80] font-black text-xs inline-flex items-center gap-1.5 shadow-2xs border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#004c80]" />
                  <span>{partnerUpConfirmDialog.title || 'PartnerUp Says'}</span>
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#001c3c] mt-2 leading-snug">
                {partnerUpConfirmDialog.message}
              </h4>
              {partnerUpConfirmDialog.details && (
                <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
                  {partnerUpConfirmDialog.details}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setPartnerUpConfirmDialog(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={partnerUpConfirmDialog.onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#001c3c] hover:bg-[#002855] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                {partnerUpConfirmDialog.confirmLabel || 'Ya, Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
