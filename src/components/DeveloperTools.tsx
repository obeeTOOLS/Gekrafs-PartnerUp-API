import React, { useState } from 'react';
import { gasService } from '../services/gasService';
import { HEADLESS_GAS_CODE, DOKTER_ASESMEN_GS_CODE } from '../services/headlessGasCode';
import { whatsappService } from '../services/whatsappService';
import { taskService } from '../services/taskService';
import { 
  authService, 
  AUTHORIZED_ENGINEERS, 
  DEFAULT_DEVELOPER_PASSWORD, 
  DEFAULT_ENGINEER_PIN,
  AdminAccount 
} from '../services/authService';
import { WhatsAppSettingsModal } from './WhatsAppSettingsModal';
import { WhatsAppBroadcastModal } from './WhatsAppBroadcastModal';
import { ExecutiveDossier } from './ExecutiveDossier';
import { PanduanHakAksesPdfModal } from './PanduanHakAksesPdfModal';
import { PanduanAksesKasPinPdfModal } from './PanduanAksesKasPinPdfModal';
import { BlueprintMigrasiPdfModal } from './BlueprintMigrasiPdfModal';
import { TaskQuestionEditor } from './TaskQuestionEditor';
import { generateKasPinPdf } from '../utils/generateKasPinPdf';
import { generateUntunginMigrationPdf } from '../utils/generateUntunginMigrationPdf';
import { UNTUNGIN_STANDALONE_GAS_CODE } from '../services/untunginStandaloneGasCode';
import { 
  Terminal, 
  Copy, 
  Check, 
  Send, 
  Download, 
  RotateCcw, 
  FileCode, 
  CheckCircle2, 
  AlertCircle,
  Database,
  CloudDownload,
  FileSpreadsheet,
  FileCheck,
  FileText,
  FileEdit,
  MessageSquare,
  Settings,
  Smartphone,
  ExternalLink,
  Key,
  KeyRound,
  Lock,
  Users,
  Shield,
  ShieldCheck,
  Mail,
  Clipboard,
  ClipboardCheck,
  Eye,
  EyeOff,
  RefreshCw,
  BookOpen,
  Wrench,
  Trash2,
  Compass,
  Wallet,
  Printer,
  Cloud,
  Workflow,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { UntunginKasModal } from './UntunginKasModal';
import { kasService, DEFAULT_KAS_PIN } from '../services/kasService';

export const DeveloperTools: React.FC = () => {
  const [devView, setDevView] = useState<'accounts' | 'questions' | 'dossier' | 'kas_pin' | 'panduan_kas' | 'tools' | 'migrasi_untungin'>('accounts');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isUntunginDevModalOpen, setIsUntunginDevModalOpen] = useState(false);
  const [isBlueprintMigrasiOpen, setIsBlueprintMigrasiOpen] = useState(false);
  const [testUrl, setTestUrl] = useState(gasService.getSettings().gasEndpointUrl);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(gasService.getSettings().autoSync);

  // Modal Konfirmasi Terpusat "PartnerUp Says" di Tengah Layar
  const [partnerUpConfirm, setPartnerUpConfirm] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    details?: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null>(null);

  // State Manajemen Reset PIN Kas Peserta
  const [pesertaPinSearch, setPesertaPinSearch] = useState('');
  const [selectedPesertaForCustomPin, setSelectedPesertaForCustomPin] = useState<string | null>(null);
  const [customPesertaPinInput, setCustomPesertaPinInput] = useState('');
  const [activeUntunginPeserta, setActiveUntunginPeserta] = useState<{ namaUsaha: string; namaPemilik?: string; whatsapp?: string } | null>(null);

  // Developer Accounts & PIN states
  const [devAccounts, setDevAccounts] = useState<AdminAccount[]>(() => authService.getDeveloperAccounts());
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [selectedDevEmail, setSelectedDevEmail] = useState<string>('obeetools@gmail.com');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinFeedback, setPinFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // WhatsApp states
  const [isWaSettingsOpen, setIsWaSettingsOpen] = useState(false);
  const [isWaBroadcastOpen, setIsWaBroadcastOpen] = useState(false);
  const [isPanduanPdfOpen, setIsPanduanPdfOpen] = useState(false);
  const [isPanduanKasPdfOpen, setIsPanduanKasPdfOpen] = useState(false);
  const [waSettings, setWaSettings] = useState(whatsappService.getSettings());
  const [quickTokenInput, setQuickTokenInput] = useState(waSettings.fonnteToken || '');
  const [showQuickToken, setShowQuickToken] = useState(false);
  const [isSavingQuickToken, setIsSavingQuickToken] = useState(false);
  const [quickTokenFeedback, setQuickTokenFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Live Sheet Pull State
  const [customSheetId, setCustomSheetId] = useState('183uoyYw6opnr3w7T6oljvwuy5Rzs7GZE7fM3vi_pwm4');
  const [isPulling, setIsPulling] = useState(false);
  const [pullResult, setPullResult] = useState<{
    success: boolean;
    message: string;
    counts?: { peserta: number; asesmen: number; timeline: number; jadwal: number };
  } | null>(null);

  // Sync all tasks to Google Sheet state
  const [isSyncingTasks, setIsSyncingTasks] = useState(false);
  const [syncTasksResult, setSyncTasksResult] = useState<{ success: boolean; message: string } | null>(null);

  // Inisialisasi Tab Kas ke Google Spreadsheet state
  const [isInitializingKas, setIsInitializingKas] = useState(false);
  const [initKasResult, setInitKasResult] = useState<{ success: boolean; message: string } | null>(null);

  // Dual-Stream Shadow Vault state (Untungin Standalone Engine)
  const [vaultConfig, setVaultConfigState] = useState(() => kasService.getVaultConfig());
  const [vaultEndpointInput, setVaultEndpointInput] = useState(vaultConfig.endpoint);
  const [vaultTestResult, setVaultTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [isTestingVault, setIsTestingVault] = useState(false);
  const [isSeedingVault, setIsSeedingVault] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; count?: number; message: string } | null>(null);
  const [isSeedingTransactions, setIsSeedingTransactions] = useState(false);
  const [seedTxResult, setSeedTxResult] = useState<{ success: boolean; count?: number; message: string } | null>(null);
  const [outboxCount, setOutboxCount] = useState(() => kasService.getOutboxCount());

  const handleSaveVaultEndpoint = () => {
    kasService.setVaultConfig(vaultEndpointInput, vaultConfig.enabled);
    setVaultConfigState(kasService.getVaultConfig());
    setVaultTestResult({ success: true, message: '✅ URL Endpoint Vault berhasil disimpan.' });
    setTimeout(() => setVaultTestResult(null), 3000);
  };

  const handleToggleVaultSync = () => {
    const nextState = !vaultConfig.enabled;
    kasService.setVaultConfig(vaultEndpointInput, nextState);
    setVaultConfigState(kasService.getVaultConfig());
  };

  const handleTestVaultPing = async () => {
    setIsTestingVault(true);
    setVaultTestResult(null);
    try {
      const res = await kasService.testVaultConnection(vaultEndpointInput);
      setVaultTestResult(res);
      setOutboxCount(kasService.getOutboxCount());
    } catch (e: any) {
      setVaultTestResult({ success: false, message: e?.message || 'Gagal menghubungi vault' });
    } finally {
      setIsTestingVault(false);
    }
  };

  const handleSeedParticipantsToVault = async () => {
    setIsSeedingVault(true);
    setSeedResult(null);
    try {
      const res = await kasService.seedAllParticipantsToVault(vaultEndpointInput);
      setSeedResult(res);
      setOutboxCount(kasService.getOutboxCount());
    } catch (e: any) {
      setSeedResult({ success: false, message: e?.message || 'Gagal menyalin data ke vault' });
    } finally {
      setIsSeedingVault(false);
    }
  };

  const handleSeedTransactionsToVault = async () => {
    setIsSeedingTransactions(true);
    setSeedTxResult(null);
    try {
      const res = await kasService.seedAllTransactionsToVault(vaultEndpointInput);
      setSeedTxResult(res);
      setOutboxCount(kasService.getOutboxCount());
    } catch (e: any) {
      setSeedTxResult({ success: false, message: e?.message || 'Gagal menyalin riwayat transaksi' });
    } finally {
      setIsSeedingTransactions(false);
    }
  };

  const handleFlushOutbox = async () => {
    try {
      const res = await kasService.flushVaultOutbox();
      setOutboxCount(kasService.getOutboxCount());
      setVaultTestResult({ success: true, message: `✅ Berhasil sinkron antrean: ${res.processed} diproses, ${res.remaining} pending.` });
      setTimeout(() => setVaultTestResult(null), 3500);
    } catch (err: any) {
      setVaultTestResult({ success: false, message: 'Gagal mengosongkan outbox: ' + (err?.message || err) });
    }
  };

  const handleInitSheetKas = async () => {
    setIsInitializingKas(true);
    setInitKasResult(null);
    try {
      const res = await gasService.dispatchRemoteAction('initSheetKas');
      if (res && res.status === 'success') {
        setInitKasResult({
          success: true,
          message: res.message || '✅ Tab Kas_Transaksi & Kas_Profil berhasil dibuat dan disiapkan di Google Spreadsheet!'
        });
      } else {
        setInitKasResult({
          success: false,
          message: 'Apps Script belum merespon pembuatan tab kas: ' + (res?.message || 'Pastikan file Code.gs sudah disimpan & dideploy versi baru (New Version) di script.google.com.')
        });
      }
    } catch (err: any) {
      setInitKasResult({
        success: false,
        message: 'Gagal menghubungi Apps Script: ' + (err?.message || 'Koneksi error')
      });
    } finally {
      setIsInitializingKas(false);
    }
  };

  const handlePushAllTasksToLiveSheet = async () => {
    setIsSyncingTasks(true);
    setSyncTasksResult(null);
    try {
      const res = await taskService.pushAllTasksToGoogleSheet();
      setSyncTasksResult({ success: res.success, message: res.message });
    } catch (err: any) {
      setSyncTasksResult({ success: false, message: 'Gagal mengirim tugas: ' + (err?.message || 'Koneksi error') });
    } finally {
      setIsSyncingTasks(false);
    }
  };

  // Dokter Database Spreadsheet (Repair Tab Peserta & Kehadiran)
  const [isRepairingSheet, setIsRepairingSheet] = useState<string | null>(null);
  const [repairResult, setRepairResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedAsesmenScript, setCopiedAsesmenScript] = useState(false);

  const handleRepairPendaftaran = async () => {
    setIsRepairingSheet('pendaftaran');
    setRepairResult(null);
    try {
      const res = await gasService.repairPendaftaranSheet();
      setRepairResult(res);
    } finally {
      setIsRepairingSheet(null);
    }
  };

  const handleRepairPeserta = async () => {
    setIsRepairingSheet('peserta');
    setRepairResult(null);
    try {
      const res = await gasService.repairPesertaSheet();
      setRepairResult(res);
    } finally {
      setIsRepairingSheet(null);
    }
  };

  const handleRepairKehadiran = async () => {
    setIsRepairingSheet('kehadiran');
    setRepairResult(null);
    try {
      const res = await gasService.repairKehadiranSheet();
      setRepairResult(res);
    } finally {
      setIsRepairingSheet(null);
    }
  };

  const handleRepairAsesmenHeader = async () => {
    setIsRepairingSheet('asesmen');
    setRepairResult(null);
    try {
      const res = await gasService.repairAsesmenHeaderSheet();
      setRepairResult(res);
    } finally {
      setIsRepairingSheet(null);
    }
  };

  const handleRepairAllSheets = async () => {
    setIsRepairingSheet('all');
    setRepairResult(null);
    try {
      const res = await gasService.repairAllSheets();
      setRepairResult(res);
    } finally {
      setIsRepairingSheet(null);
    }
  };

  const handleCopyAsesmenScript = () => {
    navigator.clipboard.writeText(DOKTER_ASESMEN_GS_CODE);
    setCopiedAsesmenScript(true);
    setTimeout(() => setCopiedAsesmenScript(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(HEADLESS_GAS_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestEndpoint = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await gasService.testConnection(testUrl);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSaveEndpoint = () => {
    gasService.saveSettings({ gasEndpointUrl: testUrl, autoSync });
    setResetMessage('Pengaturan endpoint GAS berhasil disimpan!');
    setTimeout(() => setResetMessage(null), 3000);
  };

  const handlePullFromLiveSheet = async () => {
    setIsPulling(true);
    setPullResult(null);
    const res = await gasService.syncFromLiveSpreadsheet(customSheetId.trim());
    setPullResult(res);
    setIsPulling(false);
  };

  const handleExportJson = () => {
    const jsonStr = gasService.exportAllDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GekrafsPartnerUp_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    setPartnerUpConfirm({
      isOpen: true,
      title: 'PartnerUp Says',
      message: 'Reset data lokal ke data awal?',
      details: 'Data perubahan lokal akan dikembalikan ke data bawaan.',
      confirmLabel: 'Ya, Reset Data',
      onConfirm: () => {
        const res = gasService.resetToDefaultData();
        setResetMessage(res.message);
        setTimeout(() => setResetMessage(null), 3000);
        setPartnerUpConfirm(null);
      }
    });
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinInput || newPinInput.trim().length < 4) {
      setPinFeedback({ success: false, message: 'PIN / Password developer minimal harus 4 karakter atau angka.' });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinFeedback({ success: false, message: 'Konfirmasi PIN / password tidak cocok.' });
      return;
    }
    const res = authService.updateDeveloperPin(selectedDevEmail, newPinInput);
    if (res.success) {
      setDevAccounts(authService.getDeveloperAccounts());
      setPinFeedback({ success: true, message: res.message });
      setTimeout(() => {
        setIsPinModalOpen(false);
        setPinFeedback(null);
        setNewPinInput('');
        setConfirmPinInput('');
      }, 1500);
    } else {
      setPinFeedback({ success: false, message: res.message });
    }
  };

  const handleResetPin = (email: string) => {
    setPartnerUpConfirm({
      isOpen: true,
      title: 'PartnerUp Says',
      message: `Kembalikan PIN akun "${email}" ke bawaan default?`,
      details: `PIN akun developer ini akan dikembalikan ke PIN default terkunci (${DEFAULT_ENGINEER_PIN}).`,
      confirmLabel: 'Ya, Reset PIN',
      onConfirm: () => {
        const res = authService.resetDeveloperPin(email);
        setDevAccounts(authService.getDeveloperAccounts());
        setResetMessage(res.message);
        setTimeout(() => setResetMessage(null), 3000);
        setPartnerUpConfirm(null);
      }
    });
  };

  const handleSaveQuickToken = async () => {
    const clean = quickTokenInput.trim();
    if (!clean) {
      setQuickTokenFeedback({ success: false, message: 'Masukkan atau tempelkan token Fonnte terlebih dahulu.' });
      setTimeout(() => setQuickTokenFeedback(null), 4000);
      return;
    }
    setIsSavingQuickToken(true);
    setQuickTokenFeedback(null);

    // Simpan ke whatsappService multi-storage (localStorage + master backup + cookie + gasService)
    const updated = whatsappService.saveSettings({ fonnteToken: clean });
    setWaSettings({ ...updated });

    // Uji status device langsung ke server Fonnte
    const deviceRes = await whatsappService.checkDeviceStatus(clean);
    setIsSavingQuickToken(false);

    if (deviceRes.success) {
      setQuickTokenFeedback({
        success: true,
        message: `Token Fonnte tersimpan & TERHUBUNG! Device: ${deviceRes.device || 'Online'} (Sisa kuota: ${deviceRes.quota ?? '-'})`
      });
    } else {
      setQuickTokenFeedback({
        success: true,
        message: `Token berhasil disimpan di sistem! Peringatan Fonnte: "${deviceRes.message}". Pastikan device WA sudah di-scan di fonnte.com.`
      });
    }

    setTimeout(() => {
      setQuickTokenFeedback(null);
    }, 7000);
  };

  const handlePasteQuickToken = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const clean = text.trim();
          setQuickTokenInput(clean);
          setQuickTokenFeedback({
            success: true,
            message: 'Token berhasil disalin dari clipboard! Klik "Simpan & Aktifkan" untuk mengaktifkan.'
          });
          setTimeout(() => setQuickTokenFeedback(null), 4000);
          return;
        }
      }
    } catch (e) {
      console.warn('Clipboard read failed:', e);
    }
    setQuickTokenFeedback({
      success: false,
      message: 'Gunakan tombol keyboard Ctrl+V (atau Cmd+V) di kolom input untuk menempelkan token.'
    });
    setTimeout(() => setQuickTokenFeedback(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Dev Header */}
      <div className="bg-[#001c3c] rounded-2xl p-6 text-white border-l-4 border-purple-500 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
            <Terminal className="w-4 h-4" />
            <span>Developer Console & Architecture</span>
          </div>
          <h1 className="text-2xl font-extrabold mt-1">Headless Google Apps Script Hub</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed max-w-xl">
            Kelola arsitektur headless hybrid antara Google Apps Script, Google Sheets, dan frontend React ini &middot; <strong className="text-emerald-300">Data langsung tersambung ke Google Spreadsheet</strong>
          </p>
          {(() => {
            const sess = authService.getCurrentSession();
            return sess ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs mt-2.5 font-medium">
                <Terminal className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span>Akses Penuh: <strong className="text-white">{sess.name}</strong> ({sess.email}) &middot; {sess.title}</span>
              </div>
            ) : null;
          })()}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsUntunginDevModalOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#001c3c] font-black text-xs shadow-md transition-all group cursor-pointer"
            title="Buka & Uji Modul Laporan Keuangan Untungin (Buku Kas & Pajak PP 23)"
          >
            <Wallet className="w-4 h-4 text-[#001c3c] group-hover:scale-110 transition-transform" />
            <span>💼 Buku Kas Untungin</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/40 font-bold text-xs shadow-md transition-all group cursor-pointer"
            title="Salin seluruh isi file Code.gs versi utuh dan lengkap ke clipboard (Khusus Developer/Engineer)"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-300" />}
            <span>{copiedCode ? '✅ Code.gs Tersalin!' : '📋 Salin Utuh Code.gs'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPanduanPdfOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition-all group cursor-pointer"
            title="Buka & Cetak Buku Panduan Hak Akses & SOP Login (Format PDF)"
          >
            <FileText className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Panduan Hak Akses (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPanduanKasPdfOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-xs shadow-md transition-all group cursor-pointer"
            title="Buka & Cetak Buku Panduan Akses Kas & Reset PIN Peserta (Format PDF)"
          >
            <KeyRound className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Panduan Kas & PIN (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => generateKasPinPdf({ isDeveloper: true })}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs shadow-md transition-all group cursor-pointer"
            title="Langsung Unduh Berkas PDF Panduan Akses Kas & Reset PIN"
          >
            <Download className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Unduh File PDF Panduan</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBlueprintMigrasiOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-md transition-all group cursor-pointer"
            title="Buka & Pelajari Master Blueprint Migrasi Untungin Standalone (PDF)"
          >
            <Workflow className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Blueprint Migrasi Untungin</span>
          </button>

          <button
            type="button"
            onClick={() => generateUntunginMigrationPdf()}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-indigo-800 hover:from-teal-600 hover:to-indigo-700 text-white font-black text-xs shadow-md transition-all group cursor-pointer"
            title="Langsung Unduh Berkas PDF Master Blueprint Migrasi Untungin Standalone"
          >
            <Download className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Unduh PDF Migrasi</span>
          </button>

          <a
            href="/laporan-verifikasi.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#001c3c] font-black text-xs shadow-md transition-all group"
            title="Buka & Unduh Laporan Resmi Audit Verifikasi Sistem (Format Cetak PDF)"
          >
            <FileCheck className="w-4 h-4 text-[#001c3c] group-hover:scale-110 transition-transform" />
            <span>Unduh Laporan Verifikasi (PDF)</span>
          </a>
        </div>
      </div>

      {/* Subtab Selector */}
      <div className="flex flex-wrap p-1.5 bg-slate-200/80 rounded-2xl gap-2 shadow-inner">
        <button
          type="button"
          onClick={() => setDevView('accounts')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            devView === 'accounts'
              ? 'bg-[#001c3c] text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Akun Developer & PIN</span>
        </button>

        <button
          type="button"
          onClick={() => setDevView('kas_pin')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            devView === 'kas_pin'
              ? 'bg-[#001c3c] text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>Reset PIN Kas Peserta</span>
        </button>

        <button
          type="button"
          onClick={() => setDevView('panduan_kas')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            devView === 'panduan_kas'
              ? 'bg-[#001c3c] text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span>Buku Panduan PIN (PDF)</span>
        </button>

        <button
          type="button"
          onClick={() => setDevView('questions')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            devView === 'questions'
              ? 'bg-[#001c3c] text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <FileEdit className="w-4 h-4 text-blue-400" />
          <span>Kelola Soal Tugas</span>
        </button>

        <button
          type="button"
          onClick={() => setDevView('dossier')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            devView === 'dossier'
              ? 'bg-[#001c3c] text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Panduan Eksekutif</span>
        </button>

        <button
          type="button"
          onClick={() => setDevView('tools')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            devView === 'tools'
              ? 'bg-[#001c3c] text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-400" />
          <span>Endpoint GAS & Sync</span>
        </button>

        <button
          type="button"
          onClick={() => setDevView('migrasi_untungin')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            devView === 'migrasi_untungin'
              ? 'bg-[#001c3c] text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Workflow className="w-4 h-4 text-emerald-400" />
          <span>Blueprint Migrasi Untungin</span>
        </button>
      </div>

      {devView === 'accounts' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
                  <Shield className="w-4 h-4" />
                  <span>Manajemen Akses Khusus Pengembang</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#001c3c] mt-0.5">
                  Daftar Akun Developer & Pengaturan PIN Khusus
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Kedua akun pengembang inti di bawah ini telah dipisahkan dari daftar kurator umum. Anda dapat melakukan penggantian PIN atau password khusus untuk masing-masing akun developer di sini.
                </p>
              </div>
              <span className="text-[11px] bg-purple-100 text-purple-900 border border-purple-200 font-bold px-3 py-1 rounded-full whitespace-nowrap self-start">
                2 Akun Core Systems
              </span>
            </div>

            {/* Tabel Akun Developer */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#001c3c] text-white font-bold">
                  <tr>
                    <th className="p-3.5">Akun & Profil Pengembang</th>
                    <th className="p-3.5">Hak Akses</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Status PIN / Sandi</th>
                    <th className="p-3.5 text-center">Aksi Penggantian PIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {devAccounts.map((acc) => {
                    const profile = AUTHORIZED_ENGINEERS[acc.email];
                    return (
                      <tr key={acc.email} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${profile?.avatarColor || 'from-purple-600 to-indigo-700'} text-white font-black flex items-center justify-center text-sm shadow flex-shrink-0`}>
                              {acc.nama.charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-[#001c3c] flex items-center gap-1.5">
                                <span>{acc.nama}</span>
                                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded border border-purple-200">
                                  {profile?.badge || 'Developer'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{acc.email}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {profile?.title || 'Lead Architect & Systems Engineer'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="text-[11px] font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full inline-block">
                            Super Admin Level 10
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Aktif</span>
                          </span>
                        </td>

                        <td className="p-3.5">
                          {acc.isDefaultPassword !== false ? (
                            <span className="text-[11px] bg-purple-50 text-purple-900 border border-purple-200 px-2 py-1 rounded-lg font-mono font-bold inline-block">
                              PIN Terkunci ({DEFAULT_ENGINEER_PIN})
                            </span>
                          ) : (
                            <span className="text-[11px] bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-1 rounded-lg font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>PIN Khusus Aktif</span>
                            </span>
                          )}
                          {acc.lastPasswordChange && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              Diubah: {acc.lastPasswordChange}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDevEmail(acc.email);
                                setNewPinInput('');
                                setConfirmPinInput('');
                                setPinFeedback(null);
                                setIsPinModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 active:scale-95 text-white text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
                              title={`Ganti PIN khusus untuk akun ${acc.nama}`}
                            >
                              <Key className="w-3.5 h-3.5 text-amber-300" />
                              <span>Ganti PIN</span>
                            </button>

                            {acc.isDefaultPassword === false && (
                              <button
                                type="button"
                                onClick={() => handleResetPin(acc.email)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                title={`Reset kembali ke PIN default terkunci (${DEFAULT_ENGINEER_PIN})`}
                              >
                                <RotateCcw className="w-3 h-3 text-slate-500" />
                                <span>Reset Default</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Petunjuk Keamanan Box */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 text-xs text-purple-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-purple-900">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <span>Petunjuk Keamanan PIN Khusus Developer:</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                PIN atau sandi yang Anda atur di sini akan langsung berlaku untuk login kedua akun developer tersebut. Anda dapat menggunakan angka (seperti PIN 6-digit) atau kata sandi alfanumerik. Akun developer ini tidak dapat dihapus atau dicabut dari Portal Kurator.
              </p>
            </div>
          </div>
        </div>
      )}

      {devView === 'questions' && (
        <div className="space-y-4 animate-in fade-in">
          <TaskQuestionEditor userRole="developer" />
        </div>
      )}

      {devView === 'dossier' && (
        <ExecutiveDossier />
      )}

      {devView === 'kas_pin' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                  <KeyRound className="w-4 h-4" />
                  <span>Manajemen Keamanan PIN Kas Peserta (Untungin)</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#001c3c] mt-0.5">
                  Reset & Pemulihan PIN Buku Kas UMKM
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sebagai Lead Developer / Core Engineer, Anda dapat memantau status PIN peserta dan melakukan reset instan jika ada peserta yang lupa PIN mereka.
                </p>
              </div>

              {/* Pencarian & Tombol Cetak PDF */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsPanduanKasPdfOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-xs shadow-sm cursor-pointer whitespace-nowrap transition-all"
                  title="Buka Dokumen Cetak/PDF Panduan Akses Kas & Reset PIN"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Cetak Panduan (PDF)</span>
                </button>
                <input
                  type="text"
                  placeholder="Cari nama usaha / pemilik / WA..."
                  value={pesertaPinSearch}
                  onChange={(e) => setPesertaPinSearch(e.target.value)}
                  className="w-full sm:w-60 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#004c80] outline-none"
                />
              </div>
            </div>

            {/* List Peserta */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Nama Usaha / Brand</th>
                    <th className="py-3 px-3">Pemilik & WhatsApp</th>
                    <th className="py-3 px-3 text-center">Status PIN Kas</th>
                    <th className="py-3 px-3 text-center">Tindakan Developer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    const allPeserta = gasService.getPeserta();
                    const filtered = allPeserta.filter(p => {
                      const q = pesertaPinSearch.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        (p.namaUsaha || '').toLowerCase().includes(q) ||
                        (p.namaPemilik || '').toLowerCase().includes(q) ||
                        (p.whatsapp || '').includes(q)
                      );
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                            Tidak ditemukan peserta yang sesuai pencarian "{pesertaPinSearch}".
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((p, idx) => {
                      const pinData = kasService.getKasPin(p.namaUsaha);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-extrabold text-[#001c3c] text-sm block">
                              {p.namaUsaha}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {p.subsektor || 'Ekraf Batu'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-800 block">
                              {p.namaPemilik || '—'}
                            </span>
                            <a
                              href={`https://wa.me/${(p.whatsapp || '').replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#004c80] hover:underline font-mono"
                            >
                              {p.whatsapp || '—'}
                            </a>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {pinData.isDefaultPin ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <span>Standar: <code>123456</code></span>
                              </span>
                            ) : (
                              <div className="inline-flex flex-col items-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <span>Diubah Peserta</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  PIN: <strong>{pinData.pin}</strong>
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Reset ke 123456 */}
                              <button
                                type="button"
                                onClick={() => {
                                  setPartnerUpConfirm({
                                    isOpen: true,
                                    title: 'PartnerUp Says',
                                    message: `Reset PIN Buku Kas "${p.namaUsaha}" ke default (123456)?`,
                                    details: `Peserta atas nama ${p.namaPemilik || p.namaUsaha} akan dapat langsung membuka buku kas kembali menggunakan PIN 123456.`,
                                    confirmLabel: 'Ya, Reset ke 123456',
                                    onConfirm: () => {
                                      const res = kasService.resetKasPin(p.namaUsaha, DEFAULT_KAS_PIN, 'Lead Developer');
                                      setResetMessage(res.message);
                                      setTimeout(() => setResetMessage(null), 4000);
                                      setPartnerUpConfirm(null);
                                    }
                                  });
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                title="Reset PIN ke standar 123456"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset 123456</span>
                              </button>

                              {/* Set PIN Kustom */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPesertaForCustomPin(p.namaUsaha);
                                  setCustomPesertaPinInput('');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                title="Atur PIN baru secara khusus untuk peserta ini"
                              >
                                <Key className="w-3.5 h-3.5 text-purple-600" />
                                <span>Set Kustom</span>
                              </button>

                              {/* Buka Buku Kas */}
                              <button
                                type="button"
                                onClick={() => setActiveUntunginPeserta({
                                  namaUsaha: p.namaUsaha,
                                  namaPemilik: p.namaPemilik,
                                  whatsapp: p.whatsapp
                                })}
                                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                title="Buka buku kas usaha peserta ini"
                              >
                                <Wallet className="w-3.5 h-3.5 text-purple-600" />
                                <span>Buka Kas</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Kotak Petunjuk Developer */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Petunjuk Penanganan Peserta Lupa PIN:</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                Setiap peserta memiliki PIN kas bawaan <strong>123456</strong>. Jika ada peserta yang menghubungi panitia karena lupa PIN yang telah digantinya, klik tombol <strong>"Reset 123456"</strong> untuk mengembalikannya ke bawaan atau gunakan <strong>"Set Kustom"</strong> untuk menentukan PIN sesuai keinginan peserta.
              </p>
            </div>
          </div>
        </div>
      )}

      {devView === 'panduan_kas' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-700">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>Dokumen Resmi & Standar Operasional Prosedur (SOP)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#001c3c] mt-1">
                  Buku Panduan Akses Kas, Kelola PIN & SOP Reset Developer
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Dokumen petunjuk teknis resmi bagi Peserta UMKM untuk mengamankan data keuangan usaha, serta tata kelola PIN terkunci Developer & Engineer.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => generateKasPinPdf({ isDeveloper: true })}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  title="Unduh langsung dokumen ini dalam format PDF resmi"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Unduh File .PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPanduanKasPdfOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  title="Buka tampilan cetak penuh & simpan PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Cetak PDF</span>
                </button>
              </div>
            </div>

            {/* Box Ringkasan PIN Default */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-amber-300/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <span>RINGKASAN PIN & KREDENSIAL BAWAAN STANDAR (DEFAULT KEY)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                  <div className="text-[11px] font-bold text-slate-500">1. Peserta UMKM (Buku Kas):</div>
                  <div className="font-black text-slate-900 text-sm mt-0.5 font-mono">PIN Default: {DEFAULT_KAS_PIN}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Dapat diubah mandiri via tombol "Ganti PIN"</div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border-2 border-purple-300">
                  <div className="text-[11px] font-bold text-purple-900 flex items-center justify-between">
                    <span>2. Developer & Engineer:</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[9px] font-black">TERKUNCI</span>
                  </div>
                  <div className="font-black text-purple-950 text-sm mt-0.5 font-mono break-all">{DEFAULT_ENGINEER_PIN}</div>
                  <div className="text-[10px] text-purple-700 mt-1">Full akses default (opsi ganti PIN tetap ada)</div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                  <div className="text-[11px] font-bold text-slate-500">3. Tim Kurator / Panitia:</div>
                  <div className="font-black text-slate-900 text-sm mt-0.5 font-mono">Password: {DEFAULT_DEVELOPER_PASSWORD}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Dapat diubah via Profil Admin</div>
                </div>
              </div>
            </div>

            {/* Konten Panduan Lengkap */}
            <div className="space-y-6 text-slate-800 leading-relaxed text-xs sm:text-sm">
              {/* BAB I */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-sm text-[#001c3c]">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  <span>BAB I: PANDUAN CARA PESERTA MENGAKSES BUKU KAS (UNTUNGIN)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Modul <strong>Untungin</strong> adalah sistem pencatatan keuangan dan laporan laba/rugi mandiri per unit usaha. Peserta dapat mengakses Buku Kas melalui 4 jalur cepat:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-purple-200 space-y-1">
                    <strong className="text-purple-950 block">📱 Layar Ponsel (Bottom Bar)</strong>
                    <p className="text-slate-600 text-[11px]">Tekan ikon dompet ungu bertuliskan <strong>"Kas"</strong> di bilah navigasi bawah layar HP.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-blue-200 space-y-1">
                    <strong className="text-blue-950 block">💻 Header Atas Layar</strong>
                    <p className="text-slate-600 text-[11px]">Klik tombol <strong>"Buku Kas"</strong> berlatar ungu di samping Direktori Ekraf.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                    <strong className="text-amber-950 block">🏪 Direktori Ekraf</strong>
                    <p className="text-slate-600 text-[11px]">Buka kartu profil usaha di Direktori Ekraf ➔ klik <strong>"Buka Buku Kas Untungin"</strong>.</p>
                  </div>
                </div>
              </div>

              {/* BAB II */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-sm text-[#001c3c]">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>BAB II: SISTEM KEAMANAN & PIN PENGAMAN BUKU KAS</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seluruh data keuangan UMKM dilindungi oleh <strong>PIN Lock Gate</strong>. PIN default awal bagi seluruh peserta UMKM adalah <code className="bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded font-mono font-bold">{DEFAULT_KAS_PIN}</code>.
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside pl-2">
                  <li>Peserta yang pertama kali membuka buku kas cukup mengetikkan <strong>123456</strong>.</li>
                  <li>Setelah terbuka, peserta dapat mencatat pemasukan, pengeluaran, memindahkan saldo akun, dan melihat estimasi pajak PPh 0,5%.</li>
                  <li>Saat modal kas ditutup, pengamanan PIN akan otomatis kembali aktif.</li>
                </ul>
              </div>

              {/* BAB III */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-sm text-[#001c3c]">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <span>BAB III: PANDUAN CARA PESERTA MENGGANTI PIN KAS SECARA MANDIRI</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-[#001c3c] text-white flex items-center justify-center font-bold text-[10px]">1</span>
                    <strong className="text-slate-900 block">Buka Buku Kas</strong>
                    <p className="text-slate-500 text-[11px]">Masukkan PIN aktif saat ini (bawaan: 123456).</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-[#001c3c] text-white flex items-center justify-center font-bold text-[10px]">2</span>
                    <strong className="text-slate-900 block">Klik "Ganti PIN"</strong>
                    <p className="text-slate-500 text-[11px]">Terletak di pojok kanan atas header modal Kas.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-[#001c3c] text-white flex items-center justify-center font-bold text-[10px]">3</span>
                    <strong className="text-slate-900 block">Isi Form PIN</strong>
                    <p className="text-slate-500 text-[11px]">Ketik PIN Lama, PIN Baru (4-8 digit), dan konfirmasi.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-[#001c3c] text-white flex items-center justify-center font-bold text-[10px]">4</span>
                    <strong className="text-slate-900 block">Simpan & Selesai</strong>
                    <p className="text-slate-500 text-[11px]">PIN baru langsung aktif untuk pembukaan berikutnya.</p>
                  </div>
                </div>
              </div>

              {/* BAB IV */}
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-sm text-purple-950">
                  <Key className="w-4 h-4 text-purple-700" />
                  <span>BAB IV: PENGUNCIAN PIN DEFAULT DEVELOPER & ENGINEER ({DEFAULT_ENGINEER_PIN})</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Bagi akun <strong>Lead Developer</strong> (<code>obeetools@gmail.com</code>) dan <strong>Core Engineer</strong> (<code>loehendra@gmail.com</code>), sistem mengunci PIN default bawaan dengan kombinasi: <code className="bg-purple-200 text-purple-950 px-2 py-0.5 rounded font-mono font-black">{DEFAULT_ENGINEER_PIN}</code>.
                </p>
                <div className="p-3 rounded-xl bg-white border border-purple-200 text-xs text-slate-700 space-y-1">
                  <strong>Hak & Karakteristik PIN Developer:</strong>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                    <li>Kredensial bawaan locked default pada <code>{DEFAULT_ENGINEER_PIN}</code>.</li>
                    <li>Developer tetap punya opsi penuh mengubah PIN sewaktu-waktu di tab <strong>"Akun Developer & PIN"</strong>.</li>
                    <li>PIN ini juga berfungsi sebagai Master Passcode pembuka kas unit usaha uji coba pengembang (<code>obeecreatives</code>).</li>
                  </ul>
                </div>
              </div>

              {/* BAB V */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-sm text-[#001c3c]">
                  <Terminal className="w-4 h-4 text-amber-600" />
                  <span>BAB V: SOP DEVELOPER/ENGINEER MERESET PIN PESERTA (LUPA PIN)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika ada peserta yang lupa PIN kas mereka, Developer / Engineer dapat memulihkan akses seketika:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block">⚡ Metode 1: Menu DevTools ➔ Tab "Reset PIN Kas Peserta"</strong>
                    <p className="text-slate-500 text-[11px]">
                      Cari peserta, lalu klik <strong>"Reset 123456"</strong> untuk pengembalian 1-klik instan, atau klik <strong>"Set Kustom"</strong> untuk memasukkan PIN khusus permintaan peserta.
                    </p>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block">🔑 Metode 2: Tombol Cepat di Header Modal Kas</strong>
                    <p className="text-slate-500 text-[11px]">
                      Saat membuka kas peserta mana pun, Developer memiliki tombol emas <strong>"Reset PIN"</strong> di kanan atas header modal untuk reset seketika.
                    </p>
                  </div>
                </div>
              </div>

              {/* BAB VI */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-sm text-[#001c3c]">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>BAB VI: MATRIKS HAK AKSES & OTORISASI SISTEM</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#001c3c] text-white text-[11px] uppercase tracking-wider font-extrabold">
                      <tr>
                        <th className="py-2.5 px-3">Peran Pengguna</th>
                        <th className="py-2.5 px-3">PIN Default</th>
                        <th className="py-2.5 px-3">Ganti PIN Sendiri</th>
                        <th className="py-2.5 px-3">Reset PIN Orang Lain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] bg-white">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-[#001c3c]">Peserta UMKM</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-800">123456</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold">Ya (Mandiri)</td>
                        <td className="py-2.5 px-3 text-rose-600">Tidak Diizinkan</td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-[#001c3c]">Kurator / Panitia</td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">{DEFAULT_DEVELOPER_PASSWORD}</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold">Ya (Password)</td>
                        <td className="py-2.5 px-3 text-slate-500">Minta ke Developer</td>
                      </tr>
                      <tr className="bg-purple-50/60 font-semibold text-purple-950">
                        <td className="py-2.5 px-3 font-black text-purple-900">Lead Developer & Engineer</td>
                        <td className="py-2.5 px-3 font-mono font-black text-purple-950">{DEFAULT_ENGINEER_PIN}</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-black">Ya (Mandiri)</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-black">Ya (Full Akses)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {devView === 'migrasi_untungin' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* HEADER STRATEGIS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-600/30 shadow-lg space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-100 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300">
                    SOP Teknis Developer & Blueprint Arsitektur
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Roadmap 2026
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#001c3c]">
                  Blueprint Migrasi Kas Untungin ke Versi Standalone
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
                  Panduan arsitektur komprehensif untuk memisahkan ekosistem Untungin dari program pendampingan PartnerUp melalui metode <strong>Dual-Stream Shadow Sync</strong> agar tidak mengganggu operasional live dan menjamin zero-loss data UMKM.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBlueprintMigrasiOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>Buka Mode Pembaca Penuh</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateUntunginMigrationPdf()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Unduh File PDF Resmi</span>
                </button>
              </div>
            </div>

            {/* HIGHLIGHT METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Metode Replikasi</div>
                <div className="text-base font-black text-[#001c3c] flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-indigo-600" />
                  <span>Dual-Stream Sync</span>
                </div>
                <div className="text-[11px] text-slate-500">Live Sheet + Backup Vault paralel</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Integritas Data</div>
                <div className="text-base font-black text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Zero Data Loss</span>
                </div>
                <div className="text-[11px] text-emerald-700">Tidak ada saldo & transaksi hilang</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Dampak Live Apps</div>
                <div className="text-base font-black text-amber-950 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  <span>0% Disrupsi</span>
                </div>
                <div className="text-[11px] text-amber-700">Non-blocking background push</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-1">
                <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Status Roadmap</div>
                <div className="text-base font-black text-purple-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Fase 1: Preparasi</span>
                </div>
                <div className="text-[11px] text-purple-700">Skema Vault & Blueprint Final</div>
              </div>
            </div>

            {/* RANGKUMAN 6 BAB UTAMA */}
            <div className="space-y-4 pt-2">
              <h3 className="font-black text-base text-[#001c3c] flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Struktur Rencana & Ringkasan Dokumen PDF</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Bab 1 & 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-extrabold text-indigo-900 block text-sm">
                    BAB I & II: Latar Belakang & Urgensi Pemisahan Data
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Program pendampingan PartnerUp memiliki siklus yang terbatas. Jika program berakhir, keterikatan Untungin pada spreadsheet program akan memutus akses database ratusan UMKM. Pemisahan data ke <strong>Vault Mandiri</strong> adalah langkah wajib untuk melindungi aset UMKM dan hak kekayaan intelektual developer.
                  </p>
                </div>

                {/* Bab 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-extrabold text-indigo-900 block text-sm">
                    BAB III: Arsitektur Dual-Stream Live Data Synchronization
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Setiap penambahan atau mutasi kas dikirim ke dua tujuan: Spreadsheet Live PartnerUp (utama) dan Spreadsheet Vault Baru (shadow). Proses berjalan asinkron di belakang layar sehingga kecepatan input kas peserta tetap instan tanpa beban latensi.
                  </p>
                </div>

                {/* Bab 4 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-extrabold text-indigo-900 block text-sm">
                    BAB IV: Fitur-Fitur Kunci Penunjang Migrasi
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Tiga pilar teknis disiapkan: (1) <strong>Data Source Switcher</strong> untuk pengalihan tujuan data 1-klik, (2) <strong>Decoupled PIN Auth</strong> yang tidak bergantung pada email Google login admin, dan (3) <strong>Snapshot Backup</strong> lokal JSON/Excel terenkripsi untuk pengguna.
                  </p>
                </div>

                {/* Bab 5 & 6 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-extrabold text-indigo-900 block text-sm">
                    BAB V & VI: 4 Fase Eksekusi & Potensi Komersialisasi
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Empat tahapan: Fase 1 (Preparasi Sheet Vault), Fase 2 (Decoupling Codebase), Fase 3 (Rekonsiliasi Saldo Dry-Run), dan Fase 4 (Cutover & Go-Live Standalone). Pasca-program, sistem voucher durasi (3, 6, 9 bulan, 1 tahun) dapat dimonetisasi langsung menjadi pendapatan berulang (MRR) pengembang.
                  </p>
                </div>
              </div>
            </div>

            {/* PANEL KENDALI DUAL-STREAM SHADOW SYNC (AUTO BACKUP VAULT) */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-[#001c3c] border-2 border-emerald-500/40 text-white space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-lg flex-shrink-0">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                        Live Shadow Replication
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        vaultConfig.enabled 
                          ? 'bg-emerald-500 text-slate-950 font-black animate-pulse' 
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {vaultConfig.enabled ? '● AKTIF (DUAL-SYNC ON)' : '○ NONAKTIF (NORMAL)'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white mt-1">
                      Panel Kontrol Dual-Stream Shadow Vault
                    </h3>
                  </div>
                </div>

                {/* Saklar ON/OFF Utama */}
                <button
                  type="button"
                  onClick={handleToggleVaultSync}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2.5 shadow-lg transition-all cursor-pointer ${
                    vaultConfig.enabled
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:brightness-110 shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Klik untuk mengaktifkan atau menonaktifkan duplikasi otomatis ke vault"
                >
                  <RefreshCw className={`w-4 h-4 ${vaultConfig.enabled ? 'animate-spin' : ''}`} />
                  <span>
                    {vaultConfig.enabled ? 'Duplikasi Aktif (Matikan)' : 'Aktifkan Shadow Sync (Nyalakan)'}
                  </span>
                </button>
              </div>

              {/* Endpoint Input & Test */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Target Web App Endpoint URL (Standalone GAS):
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={vaultEndpointInput}
                    onChange={(e) => setVaultEndpointInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-4 py-2.5 text-xs font-mono bg-slate-950/80 border border-slate-700 rounded-xl text-emerald-300 focus:outline-none focus:border-emerald-400"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveVaultEndpoint}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Simpan URL
                    </button>
                    <button
                      type="button"
                      onClick={handleTestVaultPing}
                      disabled={isTestingVault}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      {isTestingVault ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                      <span>Uji Ping Vault</span>
                    </button>
                  </div>
                </div>

                {vaultTestResult && (
                  <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    vaultTestResult.success 
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                    {vaultTestResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                    <span>{vaultTestResult.message}</span>
                    {vaultTestResult.latency && (
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-black/40 font-mono text-slate-300">
                        {vaultTestResult.latency}ms
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Seed / Duplikasi Awal Data 34 Peserta */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Salin Data Awal: Profil 34 UMKM PartnerUp ke Vault</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Menduplikasi nama usaha, nama pemilik, nomor WhatsApp, status lisensi, dan PIN kas dari 34 peserta PartnerUp ke tab <code className="text-emerald-400 font-mono">Untungin_Profil</code> di sheet mandiri Anda dengan 1 kali klik.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSeedParticipantsToVault}
                  disabled={isSeedingVault}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                  {isSeedingVault ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CloudDownload className="w-4 h-4 text-slate-950" />
                  )}
                  <span>{isSeedingVault ? 'Sedang Menyalin Data...' : '🚀 Salin Profil 34 Peserta ke Vault'}</span>
                </button>
              </div>

              {seedResult && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  seedResult.success 
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{seedResult.message}</span>
                </div>
              )}

              {/* Backfill: Salin Seluruh Riwayat Transaksi Kas Lama ke Vault */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>Backfill: Salin Riwayat Transaksi Kas Lama ke Vault</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Menduplikasi seluruh transaksi kas yang sudah ada sebelumnya di PartnerUp ke tab <code className="text-cyan-400 font-mono">Untungin_Transaksi</code> di sheet mandiri Anda dengan mode batch cerdas (*Smart Upsert* tanpa data dobel).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSeedTransactionsToVault}
                  disabled={isSeedingTransactions}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                  {isSeedingTransactions ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CloudDownload className="w-4 h-4 text-slate-950" />
                  )}
                  <span>{isSeedingTransactions ? 'Sedang Backfill...' : '📦 Salin Riwayat Transaksi ke Vault'}</span>
                </button>
              </div>

              {seedTxResult && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  seedTxResult.success 
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30' 
                    : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>{seedTxResult.message}</span>
                </div>
              )}

              {/* Resilient Outbox & Script Update Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Outbox Resilience Status */}
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Resilient Offline Outbox Queue</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Mencegah data hilang saat koneksi internet lambat/terputus. Seluruh payload disimpan di antrean lokal dan dicoba ulang otomatis.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-xs font-mono text-slate-300">
                      Status Antrean: <strong className={outboxCount > 0 ? 'text-amber-400' : 'text-emerald-400'}>{outboxCount} pending</strong>
                    </span>
                    {outboxCount > 0 && (
                      <button
                        type="button"
                        onClick={handleFlushOutbox}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors"
                      >
                        Kirim Sekarang
                      </button>
                    )}
                  </div>
                </div>

                {/* Kode GAS v1.1 Standalone Engine */}
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300">
                      <FileCode className="w-4 h-4 text-indigo-400" />
                      <span>Kode Standalone GAS v1.2 (Universal Bridge)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Mendukung *Smart Edit*, *Delete Propagation*, serta kompatibel penuh dengan PartnerUp dan Standalone Vercel App.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[10px] text-slate-400">Tempel di <code className="text-amber-300">Code[untungin].gs</code></span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(UNTUNGIN_STANDALONE_GAS_CODE);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Tersalin!' : 'Salin Kode v1.2'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {devView === 'tools' && (
        <div className="space-y-8">
          {resetMessage && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{resetMessage}</span>
            </div>
          )}

      {/* Section 1: Tarik Data Langsung dari Google Spreadsheet Asli */}
      <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Tarik Data Langsung dari Google Spreadsheet Asli</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mengambil data asli secara instan dari seluruh tab Google Sheets (Pendaftaran, Peserta, Timeline, Jadwal, Asesmen, Kehadiran).
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Google Spreadsheet ID
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customSheetId}
              onChange={(e) => setCustomSheetId(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <button
              onClick={handlePullFromLiveSheet}
              disabled={isPulling}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-50"
            >
              <CloudDownload className={`w-4 h-4 ${isPulling ? 'animate-bounce' : ''}`} />
              <span>{isPulling ? 'Menarik Data...' : 'Tarik Data Sekarang'}</span>
            </button>
          </div>
        </div>

        {pullResult && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-start gap-3 ${
              pullResult.success
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {pullResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold">{pullResult.message}</div>
              {pullResult.counts && (
                <div className="text-[11px] opacity-90 flex flex-wrap gap-3 pt-1">
                  <span>Peserta: <strong>{pullResult.counts.peserta}</strong></span>
                  <span>Asesmen: <strong>{pullResult.counts.asesmen}</strong></span>
                  <span>Timeline: <strong>{pullResult.counts.timeline}</strong></span>
                  <span>Jadwal: <strong>{pullResult.counts.jadwal}</strong></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Endpoint Tester */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
            <Send className="w-4 h-4 text-[#004c80]" />
            <span>Koneksi Endpoint GAS (doGet & doPost) - PartnerUp Inkubasi</span>
          </h2>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Google Apps Script Web App URL (/exec)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#004c80] outline-none"
            />
            <button
              onClick={handleTestEndpoint}
              disabled={isTesting}
              className="px-4 py-2 bg-[#004c80] hover:bg-[#0070b3] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTesting ? 'Menguji...' : 'Uji Koneksi (Ping)'}</span>
            </button>
            <button
              onClick={handleSaveEndpoint}
              className="px-4 py-2 bg-[#001c3c] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
            >
              Simpan URL
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 text-[#004c80] rounded"
              />
              <span className="font-semibold">Aktifkan sinkronisasi otomatis ke Google Apps Script di latar belakang</span>
            </label>
          </div>
        </div>

        {testResult && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div>{testResult.message}</div>
              {testResult.latency !== undefined && (
                <div className="text-[11px] opacity-75 mt-0.5">Latency: {testResult.latency} ms</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 2.2: UNTUNGIN STANDALONE SHADOW VAULT & KODE ENGINE v1.1 */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Untungin Standalone Vault
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                vaultConfig.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
              }`}>
                {vaultConfig.enabled ? '• AKTIF (DUAL-SYNC ON)' : '• NON-AKTIF'}
              </span>
            </div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Live Shadow Replication & Salin Kode v1.2 (Hutang-Piutang Engine)</span>
            </h2>
            <p className="text-xs text-slate-300">
              Duplikasi data transaksi dan profil secara asinkron ke spreadsheet mandiri <code className="text-amber-300">[standalone]</code> tanpa mengganggu sistem PartnerUp.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleVaultSync}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 ${
              vaultConfig.enabled
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${vaultConfig.enabled ? 'animate-spin' : ''}`} />
            <span>{vaultConfig.enabled ? 'Duplikasi Aktif (Matikan)' : 'Aktifkan Shadow Sync (Nyalakan)'}</span>
          </button>
        </div>

        {/* Kode Standalone GAS v1.2 - Tombol Salin Cepat */}
        <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>Kode Google Apps Script v1.2 (Universal Bridge Engine)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kompatibel penuh dengan <strong>PartnerUp Inkubasi</strong> dan <strong>Untungin Standalone Vercel App</strong> (mendukung <em>tambahTransaksi</em>, <em>smartUpdate</em>, <em>smartDelete</em>, <em>aktivasiVoucher</em>, dan <em>gantiPin</em>).
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(UNTUNGIN_STANDALONE_GAS_CODE);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 3000);
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer flex-shrink-0 transition-all"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? '✅ Kode v1.2 Tersalin!' : '📋 Salin Kode v1.2 Universal Bridge'}</span>
          </button>
        </div>

        {/* Input Endpoint & Ping */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Target Web App Endpoint URL (Standalone GAS):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={vaultEndpointInput}
              onChange={(e) => setVaultEndpointInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 px-4 py-2.5 text-xs font-mono bg-slate-950/80 border border-slate-700 rounded-xl text-emerald-300 focus:outline-none focus:border-emerald-400"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveVaultEndpoint}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Simpan URL
              </button>
              <button
                type="button"
                onClick={handleTestVaultPing}
                disabled={isTestingVault}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                {isTestingVault ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                )}
                <span>Uji Ping Vault</span>
              </button>
            </div>
          </div>

          {vaultTestResult && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              vaultTestResult.success 
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}>
              {vaultTestResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span>{vaultTestResult.message}</span>
              {vaultTestResult.latency && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-black/40 font-mono text-slate-300">
                  {vaultTestResult.latency}ms
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Seed Profil & Backfill Transaksi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <div className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Salin Data Profil UMKM</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Salin seluruh profil 34 peserta ke tab <code className="text-emerald-400 font-mono">Untungin_Profil</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSeedParticipantsToVault}
              disabled={isSeedingVault}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Users className="w-4 h-4" />
              <span>{isSeedingVault ? 'Menyalin...' : '🚀 Salin Profil UMKM'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <div className="font-extrabold text-xs text-cyan-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Salin Riwayat Transaksi Lama</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Backfill seluruh riwayat transaksi kas lama ke <code className="text-cyan-400 font-mono">Untungin_Transaksi</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSeedTransactionsToVault}
              disabled={isSeedingTransactions}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CloudDownload className="w-4 h-4" />
              <span>{isSeedingTransactions ? 'Backfill...' : '📦 Salin Riwayat Transaksi'}</span>
            </button>
          </div>
        </div>

        {seedResult && (
          <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            seedResult.success 
              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' 
              : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{seedResult.message}</span>
          </div>
        )}

        {seedTxResult && (
          <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            seedTxResult.success 
              ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30' 
              : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{seedTxResult.message}</span>
          </div>
        )}

        {/* Outbox Resilience Status */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Status Antrean Resilient Outbox:</span>
            <strong className={outboxCount > 0 ? 'text-amber-400' : 'text-emerald-400 font-mono'}>
              {outboxCount} pending
            </strong>
          </div>
          {outboxCount > 0 && (
            <button
              type="button"
              onClick={handleFlushOutbox}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
            >
              Kirim Sekarang
            </button>
          )}
        </div>
      </div>

      {/* Section 2.5: Sinkronisasi Jawaban Tugas ke Google Spreadsheet */}
      <div className="bg-white rounded-2xl p-6 border-2 border-indigo-500/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Sinkronkan Jawaban Tugas ke Sheet Asli (Tab "Tugas")</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dorong seluruh jawaban lembar kerja / roadmap tugas peserta yang sudah masuk di aplikasi ke tab <strong>Tugas</strong> di Google Spreadsheet secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              {taskService.getAllTasks().length} Tugas Tersimpan
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
          <div className="text-xs text-indigo-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-indigo-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Pencegahan Duplikasi & Keamanan Data</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Sistem akan memetakan setiap jawaban ke baris spreadsheet berdasarkan <em>Nama Usaha</em>. Jika nama usaha sudah pernah masuk sebelumnya, baris tersebut akan diperbarui secara otomatis tanpa membuat baris ganda.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePushAllTasksToLiveSheet}
            disabled={isSyncingTasks || taskService.getAllTasks().length === 0}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingTasks ? 'animate-spin' : ''}`} />
            <span>{isSyncingTasks ? 'Menyinkronkan...' : '🚀 Kirim Semua Jawaban ke Sheet'}</span>
          </button>
        </div>

        {syncTasksResult && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
              syncTasksResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {syncTasksResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div>{syncTasksResult.message}</div>
          </div>
        )}
      </div>

      {/* Section 2.6: Inisialisasi & Sinkronisasi Buku Kas ke Google Spreadsheet */}
      <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Inisialisasi & Sinkronisasi Buku Kas UMKM (Tab "Kas_Transaksi" & "Kas_Profil")</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Siapkan tab <strong>Kas_Transaksi</strong> dan <strong>Kas_Profil</strong> di Google Spreadsheet secara instan tanpa perlu menjalankan kode manual di Apps Script.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Buku Kas Online Cloud</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="text-xs text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Pembuatan Otomatis Tab Baru & Format Header</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Klik tombol di samping untuk menginstruksikan backend Apps Script membuat tab <code>Kas_Transaksi</code> dan <code>Kas_Profil</code> lengkap dengan styling warna header navy dan pembekuan baris pertama.
            </p>
          </div>

          <button
            type="button"
            onClick={handleInitSheetKas}
            disabled={isInitializingKas}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isInitializingKas ? 'animate-spin' : ''}`} />
            <span>{isInitializingKas ? 'Membuat Tab di Sheet...' : '⚡ Inisialisasi Tab Kas Sekarang'}</span>
          </button>
        </div>

        {initKasResult && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
              initKasResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {initKasResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div>{initKasResult.message}</div>
          </div>
        )}
      </div>

      {/* Section 3: WhatsApp Gateway Fonnte & Notifikasi */}
      <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Gateway (Fonnte API) & Notifikasi Otomatis</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Integrasi pengiriman pesan otomatis ke nomor pribadi peserta dan broadcast ke grup WhatsApp resmi PartnerUp.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWaBroadcastOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Grup</span>
            </button>
            <button
              type="button"
              onClick={() => setIsWaSettingsOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Pengaturan WA</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Token Fonnte</span>
            <span className={`text-xs font-black mt-0.5 flex items-center gap-1 ${waSettings.fonnteToken ? 'text-emerald-700' : 'text-amber-700'}`}>
              {waSettings.fonnteToken ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
              <span>{waSettings.fonnteToken ? 'Token Terpasang' : 'Belum Dikonfigurasi'}</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Grup Peserta</span>
            <span className="text-xs font-bold text-[#001c3c] mt-0.5 truncate block">
              {waSettings.pesertaGroupName || waSettings.pesertaGroupId || 'Belum dihubungkan'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Grup Panitia</span>
            <span className="text-xs font-bold text-[#001c3c] mt-0.5 truncate block">
              {waSettings.panitiaGroupName || waSettings.panitiaGroupId || 'Belum dihubungkan'}
            </span>
          </div>
        </div>

        {/* Fitur Tempel & Perbarui Token Fonnte Langsung */}
        <div className="p-4 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-purple-50/40 rounded-xl border border-emerald-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                <Key className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-black text-[#001c3c] uppercase tracking-wide">
                  Fitur Tempel & Perbarui Token Fonnte
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tempelkan token baru dari dashboard Fonnte kapan saja token berubah.
                </p>
              </div>
            </div>
            {waSettings.fonnteToken && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 self-start sm:self-auto">
                Tersimpan & Terhubung Cloud
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showQuickToken ? 'text' : 'password'}
                value={quickTokenInput}
                onChange={(e) => setQuickTokenInput(e.target.value)}
                placeholder="Tempel / ketik token Fonnte di sini..."
                className="w-full px-3 py-2 pr-10 text-xs font-mono rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowQuickToken(!showQuickToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showQuickToken ? 'Sembunyikan Token' : 'Tampilkan Token'}
              >
                {showQuickToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={handlePasteQuickToken}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Tempel token yang sudah disalin di clipboard"
            >
              <Clipboard className="w-3.5 h-3.5 text-slate-600" />
              <span>Tempel Clipboard</span>
            </button>

            <button
              type="button"
              disabled={isSavingQuickToken || !quickTokenInput.trim()}
              onClick={handleSaveQuickToken}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm whitespace-nowrap"
            >
              {isSavingQuickToken ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menguji Token...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan & Aktifkan</span>
                </>
              )}
            </button>
          </div>

          {quickTokenFeedback && (
            <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              quickTokenFeedback.success 
                ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-300' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {quickTokenFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{quickTokenFeedback.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Headless Code.gs Viewer & Copier */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#004c80]" />
              <span>Kode Backend Headless GAS (Code.gs)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Salin kode ini ke Google Apps Script Anda untuk mengubah web app lama menjadi REST/JSON API murni.
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001c3c] text-white hover:bg-[#004c80] text-xs font-bold transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? '✅ Code.gs Tersalin!' : '📋 Salin Utuh Code.gs'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
            {HEADLESS_GAS_CODE}
          </pre>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
          <div>
            <strong className="text-slate-900">Petunjuk Deployment Headless:</strong>
            <ol className="list-decimal list-inside mt-1.5 space-y-1 text-slate-600">
              <li>Buka project Google Apps Script Anda di <code>script.google.com</code></li>
              <li>Ganti isi file <code>Code.gs</code> dengan kode di atas</li>
              <li>Klik <strong>Deploy &rarr; Manage deployments &rarr; Edit &rarr; New version &rarr; Deploy</strong></li>
              <li>Pastikan akses diatur <strong>"Who has access: Anyone"</strong></li>
              <li>Salin URL <code>/exec</code> ke input di atas. Data akan langsung tersinkron secara headless tanpa banner Google!</li>
            </ol>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <strong className="text-emerald-800">💡 Cara Membentuk Tab 'Kehadiran' & 'Tugas' Seketika:</strong>
            <p className="mt-1 text-slate-600">
              Setelah menempelkan kode ke <code>Code.gs</code>, Anda tidak perlu menunggu ada absensi masuk. Cukup pilih fungsi <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono font-bold">inisialisasiSheetKehadiran</code> atau <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono font-bold">inisialisasiSemuaTab</code> pada dropdown di toolbar atas editor Apps Script, lalu klik tombol <strong>Run (Jalankan ▶️)</strong>. Tab baru beserta header lengkap akan langsung tercipta di Google Spreadsheet Anda!
            </p>
          </div>
        </div>
      </div>

      {/* Section: Dokter Database Spreadsheet (Repair Tab Pendaftaran, Peserta, Kehadiran & Asesmen) */}
      <div className="bg-white rounded-2xl p-6 border-2 border-[#004c80]/40 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#004c80]" />
              <span>Dokter Spreadsheet: Perbaikan Pendaftaran, Peserta, Kehadiran & Asesmen</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Menyelaraskan isian kolom tab Pendaftaran (mulai baris 62), menambal baris kosong Kehadiran, membersihkan #REF! tab Peserta, dan menata 47 kolom Asesmen.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-blue-50 text-[#004c80] text-[11px] font-bold rounded-lg border border-blue-200 self-start sm:self-auto">
            Self-Healing Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Card 1: Tab Pendaftaran */}
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                <span>Tab Pendaftaran</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Menyelaraskan kolom baris 62 dst yang isiannya tertukar (WA, Email, Subsektor, Alamat, NIB).
              </p>
            </div>
            <button
              type="button"
              onClick={handleRepairPendaftaran}
              disabled={!!isRepairingSheet}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRepairingSheet === 'pendaftaran' ? 'animate-spin' : ''}`} />
              <span>{isRepairingSheet === 'pendaftaran' ? 'Memperbaiki...' : 'Perbaiki Pendaftaran'}</span>
            </button>
          </div>

          {/* Card 2: Tab Peserta */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-[#001c3c] flex items-center gap-1.5 mb-1">
                <Users className="w-4 h-4 text-[#004c80]" />
                <span>Tab Peserta</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Membersihkan formula #REF! dan menyinkronkan seluruh peserta resmi dari tab Pendaftaran.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRepairPeserta}
              disabled={!!isRepairingSheet}
              className="w-full py-2 bg-[#001c3c] hover:bg-[#004c80] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRepairingSheet === 'peserta' ? 'animate-spin' : ''}`} />
              <span>{isRepairingSheet === 'peserta' ? 'Memperbaiki...' : 'Perbaiki Peserta'}</span>
            </button>
          </div>

          {/* Card 3: Tab Kehadiran */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-[#001c3c] flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tab Kehadiran</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Menambal baris 38 & 39 yang kehilangan Tanggal Sesi & Topik Sesi di datasheet Google Sheets.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRepairKehadiran}
              disabled={!!isRepairingSheet}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRepairingSheet === 'kehadiran' ? 'animate-spin' : ''}`} />
              <span>{isRepairingSheet === 'kehadiran' ? 'Memperbaiki...' : 'Perbaiki Kehadiran'}</span>
            </button>
          </div>

          {/* Card 4: Tab Asesmen */}
          <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5 mb-1">
                <ClipboardCheck className="w-4 h-4 text-purple-700" />
                <span>Tab Asesmen (47 Kolom)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Merapikan 47 header agar skor 15 kriteria, Total Skor (kolom AH), dan 8 rata-rata Bagian 3 presisi.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRepairAsesmenHeader}
              disabled={!!isRepairingSheet}
              className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRepairingSheet === 'asesmen' ? 'animate-spin' : ''}`} />
              <span>{isRepairingSheet === 'asesmen' ? 'Memperbaiki...' : 'Perbaiki Asesmen'}</span>
            </button>
          </div>

          {/* Card 5: Semua Tab Sekaligus */}
          <div className="p-3.5 bg-[#eaf2fb] rounded-xl border border-blue-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-[#004c80] flex items-center gap-1.5 mb-1">
                <Database className="w-4 h-4 text-[#004c80]" />
                <span>Semua Tab Sekaligus</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Eksekusi perbaikan menyeluruh pada Pendaftaran, Peserta, Kehadiran, Asesmen, Tugas & Buku Kas.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRepairAllSheets}
              disabled={!!isRepairingSheet}
              className="w-full py-2 bg-[#004c80] hover:bg-[#0070b3] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRepairingSheet === 'all' ? 'animate-spin' : ''}`} />
              <span>{isRepairingSheet === 'all' ? 'Memproses...' : 'Perbaiki Semua Tab'}</span>
            </button>
          </div>
        </div>

        {repairResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              repairResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {repairResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div>{repairResult.message}</div>
          </div>
        )}

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <Terminal className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Opsi Eksekusi Langsung di Apps Script Editor:</strong> Buka <code>script.google.com</code> &rarr; pilih fungsi <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono font-bold">perbaikiSheetPendaftaran</code>, <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono font-bold">perbaikiHeaderTabAsesmen</code>, atau <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono font-bold">inisialisasiSemuaTab</code> pada menu toolbar atas editor Apps Script &rarr; klik <strong>Run (▶️)</strong>.
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyAsesmenScript}
            className="flex-shrink-0 px-3 py-1.5 bg-white border border-purple-300 text-purple-900 hover:bg-purple-50 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {copiedAsesmenScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-600" />}
            <span>{copiedAsesmenScript ? 'Script Dokter Tersalin!' : 'Salin Script DokterPerbaikan.gs'}</span>
          </button>
        </div>
      </div>

      {/* Section 4: Data Management & Reset */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
          <Database className="w-4 h-4 text-[#004c80]" />
          <span>Cadangan Data & Reset</span>
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Semua Data (JSON Backup)</span>
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Data Asli Bawaan</span>
          </button>

          <button
            onClick={() => {
              setPartnerUpConfirm({
                isOpen: true,
                title: 'PartnerUp Says',
                message: 'Bersihkan seluruh data tugas dummy atau uji coba lama?',
                details: 'Data tugas resmi 34 peserta tetap aman dan tersimpan.',
                confirmLabel: 'Ya, Bersihkan Data Dummy',
                onConfirm: () => {
                  const res = taskService.purgeDummyTasks();
                  setResetMessage(res.message);
                  setTimeout(() => setResetMessage(null), 3000);
                  setPartnerUpConfirm(null);
                }
              });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 text-xs font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-amber-700" />
            <span>Bersihkan Tugas Dummy / Uji Coba</span>
          </button>
        </div>
      </div>
    </div>
  )}

      {/* WhatsApp Modals */}
      <WhatsAppSettingsModal
        isOpen={isWaSettingsOpen}
        onClose={() => {
          setIsWaSettingsOpen(false);
          const current = whatsappService.getSettings();
          setWaSettings(current);
          setQuickTokenInput(current.fonnteToken || '');
        }}
        onSaved={() => {
          const current = whatsappService.getSettings();
          setWaSettings(current);
          setQuickTokenInput(current.fonnteToken || '');
        }}
      />

      <WhatsAppBroadcastModal
        isOpen={isWaBroadcastOpen}
        onClose={() => setIsWaBroadcastOpen(false)}
        onOpenSettings={() => {
          setIsWaBroadcastOpen(false);
          setIsWaSettingsOpen(true);
        }}
      />

      {/* Modal Cetak Dokumen Panduan Hak Akses & SOP Login (PDF) */}
      <PanduanHakAksesPdfModal
        isOpen={isPanduanPdfOpen}
        onClose={() => setIsPanduanPdfOpen(false)}
      />

      {/* Modal Cetak Dokumen Panduan Akses Kas & Reset PIN (PDF) */}
      <PanduanAksesKasPinPdfModal
        isOpen={isPanduanKasPdfOpen}
        onClose={() => setIsPanduanKasPdfOpen(false)}
        isDeveloper={true}
      />

      {/* Modal Cetak & Baca Dokumen Master Blueprint Migrasi Untungin Standalone (PDF) */}
      <BlueprintMigrasiPdfModal
        isOpen={isBlueprintMigrasiOpen}
        onClose={() => setIsBlueprintMigrasiOpen(false)}
      />

      {/* Modal Penggantian PIN / Password Khusus Developer */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-700 text-[#ffc72c] flex items-center justify-center font-bold shadow">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#001c3c]">
                    Ganti PIN / Password Khusus Developer
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedDevEmail}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {pinFeedback && (
              <div className={`p-3 mb-4 rounded-xl text-xs font-semibold border ${
                pinFeedback.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                {pinFeedback.message}
              </div>
            )}

            <form onSubmit={handleSavePin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  PIN / Password Baru (Minimal 4 Karakter / Angka) *
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="Contoh PIN: 123456 atau Sandi Baru"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none pr-9 font-mono bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Ulangi Konfirmasi PIN / Password *
                </label>
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="Ketik ulang PIN / password baru"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none font-mono bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-black rounded-lg shadow cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simpan PIN Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Untungin Kas Khusus Developer (Bisa edit & uji coba langsung) */}
      {isUntunginDevModalOpen && (
        <UntunginKasModal
          isOpen={isUntunginDevModalOpen}
          onClose={() => setIsUntunginDevModalOpen(false)}
          namaUsaha="obeecreatives"
          namaPemilik="Lalu Mahendra (Lead Developer)"
          whatsapp="081335125277"
          readOnly={false}
          viewerRole="developer"
        />
      )}

      {/* Modal Untungin Kas untuk Peserta Terpilih */}
      {activeUntunginPeserta && (
        <UntunginKasModal
          isOpen={true}
          onClose={() => setActiveUntunginPeserta(null)}
          namaUsaha={activeUntunginPeserta.namaUsaha}
          namaPemilik={activeUntunginPeserta.namaPemilik}
          whatsapp={activeUntunginPeserta.whatsapp}
          readOnly={false}
          viewerRole="developer"
        />
      )}

      {/* Modal Atur PIN Kustom Peserta oleh Developer */}
      {selectedPesertaForCustomPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#001c3c]">
                    Atur PIN Baru Peserta
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {selectedPesertaForCustomPin}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPesertaForCustomPin(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customPesertaPinInput.trim() || customPesertaPinInput.trim().length < 4) {
                  return;
                }
                const res = kasService.resetKasPin(
                  selectedPesertaForCustomPin,
                  customPesertaPinInput.trim(),
                  'Lead Developer'
                );
                setResetMessage(res.message);
                setTimeout(() => setResetMessage(null), 4000);
                setSelectedPesertaForCustomPin(null);
                setCustomPesertaPinInput('');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  PIN Baru untuk Peserta (4-8 Digit Angka)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  required
                  placeholder="contoh: 262626"
                  value={customPesertaPinInput}
                  onChange={(e) => setCustomPesertaPinInput(e.target.value)}
                  className="w-full px-3 py-2 text-center text-lg font-mono font-black border border-slate-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPesertaForCustomPin(null)}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#001c3c] hover:bg-[#002c5c] text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Simpan PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal "PartnerUp Says" di Tengah Layar */}
      {partnerUpConfirm?.isOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-1.5">
                <span className="px-3 py-1 rounded-full bg-[#eaf2fb] text-[#004c80] font-black text-xs inline-flex items-center gap-1.5 shadow-2xs border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#004c80]" />
                  <span>{partnerUpConfirm.title || 'PartnerUp Says'}</span>
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#001c3c] mt-2 leading-snug">
                {partnerUpConfirm.message}
              </h4>
              {partnerUpConfirm.details && (
                <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
                  {partnerUpConfirm.details}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setPartnerUpConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={partnerUpConfirm.onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#001c3c] hover:bg-[#002855] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                {partnerUpConfirm.confirmLabel || 'Ya, Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
