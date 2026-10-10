import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Calendar,
  Layers,
  FileText,
  AlertTriangle,
  Download,
  Plus,
  Trash2,
  Edit2,
  Check,
  Eye,
  EyeOff,
  Percent,
  Sparkles,
  PieChart,
  DollarSign,
  HelpCircle,
  Building2,
  Info,
  Lock,
  Unlock,
  Key,
  KeyRound,
  ShieldCheck,
  Cloud,
  RefreshCw,
  Crown,
  CheckCircle2,
  ExternalLink,
  Award
} from 'lucide-react';
import {
  kasService,
  KasAccount,
  KasTransaction,
  KasCategories,
  REF_INCOME_CATEGORIES,
  REF_EXPENSE_CATEGORIES,
  TARIF_PPH_FINAL_UMKM,
  BATAS_OMZET_PP23,
  DEFAULT_KAS_PIN,
  KasPremiumAccess
} from '../services/kasService';
import { gasService } from '../services/gasService';

interface UntunginKasModalProps {
  isOpen: boolean;
  onClose: () => void;
  namaUsaha: string;
  namaPemilik?: string;
  whatsapp?: string;
  readOnly?: boolean; // True jika dilihat oleh Kurator / Penilai
  viewerRole?: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const UntunginKasModal: React.FC<UntunginKasModalProps> = ({
  isOpen,
  onClose,
  namaUsaha,
  namaPemilik,
  whatsapp,
  readOnly = false,
  viewerRole = 'peserta'
}) => {
  const [activeTab, setActiveTab] = useState<'beranda' | 'transaksi' | 'akun' | 'labarugi' | 'pajak'>('beranda');
  const [hideAmount, setHideAmount] = useState(false);

  // obeecreatives adalah unit bisnis pengembang yang selalu memiliki hak akses penuh input data
  const isObeeCreatives = (namaUsaha || '').toLowerCase().trim() === 'obeecreatives';
  const isDeveloperUser = viewerRole === 'developer' || isObeeCreatives;
  const isCuratorUser = viewerRole === 'kurator' || viewerRole === 'curator' || viewerRole === 'admin';
  const isPrivileged = isDeveloperUser;
  const [isSimulasiMode, setIsSimulasiMode] = useState(false);
  const [isTrialReadOnlyView, setIsTrialReadOnlyView] = useState(false);

  // Data Kas
  const [categories, setCategories] = useState<KasCategories>({ income: [], expense: [] });
  const [accounts, setAccounts] = useState<KasAccount[]>([]);
  const [transactions, setTransactions] = useState<KasTransaction[]>([]);

  // Filter Periode
  const currentYear = String(new Date().getFullYear());
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Pengaturan Ukuran Huruf (Aksesibilitas Lansia & Keterbacaan Laporan Keuangan)
  type FontSizeLevel = 'normal' | 'large' | 'xlarge';
  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    try {
      const saved = localStorage.getItem('untungin_font_size');
      if (saved === 'normal' || saved === 'large' || saved === 'xlarge') return saved;
    } catch {
      // ignore
    }
    return 'large'; // Default: Ukuran Besar (Ramah untuk Bapak-bapak & Ibu-ibu)
  });

  const handleSetFontSize = (size: FontSizeLevel) => {
    setFontSize(size);
    try {
      localStorage.setItem('untungin_font_size', size);
    } catch {
      // ignore
    }
  };

  // Form Transaksi State
  const [txDate, setTxDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [txType, setTxType] = useState<'income' | 'expense' | 'transfer'>('income');
  const [txAccountId, setTxAccountId] = useState<string>('');
  const [txToAccountId, setTxToAccountId] = useState<string>('');
  const [txCategory, setTxCategory] = useState<string>('');
  const [txDesc, setTxDesc] = useState<string>('');
  const [txAmount, setTxAmount] = useState<string>('');
  const [editingTxId, setEditingTxId] = useState<string | null>(null);

  // Form Tambah Akun State
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<KasAccount['type']>('Kas');
  const [newAccBalance, setNewAccBalance] = useState('');

  // Toast Notifikasi
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Custom Modal Konfirmasi di Tengah Layar (Pengganti dialog confirm bawaan browser)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    details?: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null>(null);

  // Keamanan PIN Kas
  const [isKasUnlocked, setIsKasUnlocked] = useState<boolean>(() => {
    return isDeveloperUser;
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [showEnteredPin, setShowEnteredPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Modal Ganti PIN Peserta
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');
  const [showPinInputFields, setShowPinInputFields] = useState(false);
  const [changePinError, setChangePinError] = useState<string | null>(null);

  // Handle Buka Buku Kas dengan PIN
  const handleUnlockKas = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    if (!enteredPin.trim()) {
      setPinError('Silakan masukkan PIN Buku Kas Anda.');
      return;
    }
    const isValid = kasService.verifyKasPin(namaUsaha, enteredPin.trim());
    if (isValid) {
      setIsKasUnlocked(true);
      setEnteredPin('');
      showToast('Buku Kas Terbuka!', 'success');
    } else {
      setPinError(
        namaUsaha.toLowerCase() === 'obeecreatives'
          ? 'PIN salah. PIN default developer adalah obeecreatives2026#*.'
          : 'PIN salah. PIN bawaan awal adalah 123456. Hubungi Developer / Kurator jika Anda lupa PIN.'
      );
    }
  };

  // Handle Ganti PIN Peserta
  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError(null);
    if (!oldPinInput.trim()) {
      setChangePinError('PIN Lama wajib dimasukkan.');
      return;
    }
    if (!newPinInput.trim() || newPinInput.trim().length < 4 || newPinInput.trim().length > 24) {
      setChangePinError('PIN Baru harus terdiri dari 4 sampai 24 karakter/angka.');
      return;
    }
    if (newPinInput.trim() !== confirmNewPinInput.trim()) {
      setChangePinError('Konfirmasi PIN Baru tidak sesuai.');
      return;
    }

    const res = kasService.changeKasPin(namaUsaha, oldPinInput.trim(), newPinInput.trim());
    if (res.success) {
      showToast(res.message, 'success');
      setIsChangePinModalOpen(false);
      setOldPinInput('');
      setNewPinInput('');
      setConfirmNewPinInput('');
    } else {
      setChangePinError(res.message);
    }
  };

  // Manajemen Akses Premium / Untungin Pro & Model Hybrid Trial
  const [premiumStatus, setPremiumStatus] = useState<KasPremiumAccess>(() => kasService.getPremiumStatus(namaUsaha));
  const hasProAccess = premiumStatus.isPremium || isPrivileged || isDeveloperUser;
  const isTrialActive = !hasProAccess && (premiumStatus.isTrialActive ?? false);
  const isTrialExpired = !hasProAccess && (premiumStatus.isTrialExpired ?? false);
  const hasPremiumAccess = hasProAccess; // alias kompatibilitas
  const effectiveReadOnly = isDeveloperUser ? false : ((readOnly && !isSimulasiMode) || (isTrialExpired && isTrialReadOnlyView));
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [licenseCodeInput, setLicenseCodeInput] = useState('');
  const [licenseFeedback, setLicenseFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isActivatingLicense, setIsActivatingLicense] = useState(false);

  useEffect(() => {
    setPremiumStatus(kasService.getPremiumStatus(namaUsaha));
  }, [namaUsaha]);

  useEffect(() => {
    const handlePremiumUpdate = (e: any) => {
      if (!e.detail?.namaUsaha || e.detail.namaUsaha.toLowerCase() === namaUsaha.toLowerCase()) {
        setPremiumStatus(kasService.getPremiumStatus(namaUsaha));
      }
    };
    window.addEventListener('gkf-kas-premium-updated', handlePremiumUpdate);
    return () => window.removeEventListener('gkf-kas-premium-updated', handlePremiumUpdate);
  }, [namaUsaha]);

  const handleGrantProByKurator = () => {
    const access = kasService.grantPremiumAccess(namaUsaha, 'Kurator PartnerUp', 'kurator');
    setPremiumStatus(access);
    showToast(`Hak akses Untungin Pro untuk "${namaUsaha}" berhasil diaktifkan oleh Kurator!`, 'success');
  };

  const handleRevokePro = () => {
    const access = kasService.revokePremiumAccess(namaUsaha);
    setPremiumStatus(access);
    showToast(`Akses Untungin Pro untuk "${namaUsaha}" dikembalikan ke akun Standar.`, 'warning');
  };

  const handleCheckKurasiStatus = () => {
    const current = kasService.getPremiumStatus(namaUsaha);
    setPremiumStatus(current);
    if (current.isPremium) {
      showToast(`Akses Untungin Pro aktif! Diberikan oleh: ${current.grantedBy || 'Kurator'}.`, 'success');
    } else {
      showToast('Status saat ini: Belum diaktifkan oleh Tim Kurator. Silakan tunggu rekomendasi kurasi atau aktivasi dengan kode lisensi.', 'warning');
    }
  };

  const handleActivateLicense = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActivatingLicense(true);
    setLicenseFeedback(null);
    const res = kasService.activateLicenseCode(namaUsaha, licenseCodeInput);
    setLicenseFeedback(res);
    setIsActivatingLicense(false);
    if (res.success && res.access) {
      setPremiumStatus(res.access);
      showToast(res.message, 'success');
      setLicenseCodeInput('');
      setTimeout(() => {
        setIsPremiumModalOpen(false);
        setLicenseFeedback(null);
      }, 1800);
    }
  };

  const showToast = (text: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // State Sinkronisasi Cloud (Google Spreadsheet)
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  const handleSyncCloud = async (showManualToast = true) => {
    if (!namaUsaha || isSyncingCloud) return;
    setIsSyncingCloud(true);
    try {
      // 1. Panggil inisialisasi tab Kas di spreadsheet (memastikan tab Kas_Transaksi & Kas_Profil sudah ada)
      try {
        await gasService.dispatchRemoteAction('initSheetKas');
      } catch (initErr) {
        console.warn('[Untungin] initSheetKas call notice:', initErr);
      }

      // 2. Lakukan sinkronisasi data transaksi & akun dua arah
      const res = await kasService.syncKasFromCloud(namaUsaha);
      if (res.success) {
        setLastSyncedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        if (showManualToast) {
          showToast(res.message, 'success');
        }
      } else if (showManualToast) {
        showToast(res.message, 'warning');
      }
    } catch {
      if (showManualToast) {
        showToast('Sinkronisasi cloud tertunda. Menggunakan data lokal.', 'warning');
      }
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Muat data saat modal terbuka atau namaUsaha berubah
  const loadData = () => {
    if (!namaUsaha) return;
    const data = kasService.getKasData(namaUsaha);
    setCategories(data.categories);
    setAccounts(data.accounts);
    setTransactions(data.transactions);

    if (data.accounts.length > 0 && !txAccountId) {
      setTxAccountId(data.accounts[0].id);
      if (data.accounts.length > 1) {
        setTxToAccountId(data.accounts[1].id);
      }
    }
    if (data.categories.income.length > 0 && !txCategory) {
      setTxCategory(data.categories.income[0]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      handleSyncCloud(false);
    }
  }, [isOpen, namaUsaha]);

  // Listener event update data
  useEffect(() => {
    const handleUpdated = (e: any) => {
      if (e.detail?.namaUsaha === namaUsaha) {
        loadData();
      }
    };
    window.addEventListener('gkf-kas-updated', handleUpdated);
    return () => window.removeEventListener('gkf-kas-updated', handleUpdated);
  }, [namaUsaha]);

  // Format Angka Rupiah
  const rupiah = (val: number) => {
    if (hideAmount) return 'Rp ••••••••';
    const n = Number(val) || 0;
    return `Rp ${n.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
  };

  // Filter Transaksi Berdasarkan Tahun & Bulan
  const filteredTransactions = useMemo(() => {
    let list = transactions.filter(t => t.date.startsWith(selectedYear));
    if (selectedMonth !== 'all') {
      const ym = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;
      list = list.filter(t => t.date.startsWith(ym));
    }
    return list.slice().sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, selectedYear, selectedMonth]);

  // Kalkulasi Ringkasan Finansial
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const net = income - expense;
    const pph = income * TARIF_PPH_FINAL_UMKM;

    const totalSaldoSemua = accounts.reduce(
      (sum, acc) => sum + kasService.calculateAccountBalance(acc, transactions),
      0
    );

    const minusAccounts = accounts.filter(
      acc => kasService.calculateAccountBalance(acc, transactions) < 0
    );

    return {
      income,
      expense,
      net,
      pph,
      totalSaldoSemua,
      minusAccounts
    };
  }, [filteredTransactions, accounts, transactions]);

  if (!isOpen) return null;

  // Handler Submit Transaksi
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveReadOnly) return;

    // Batas Kuota Trial untuk Peserta Non-Pro
    if (!editingTxId && !hasProAccess && !isCuratorUser && !isDeveloperUser) {
      const currentTxCount = transactions.length;
      const limit = premiumStatus.transactionLimit || 10;
      if (currentTxCount >= limit || (premiumStatus.isTrialExpired && !isTrialActive)) {
        showToast(`Batas Trial (${limit} Transaksi) telah tercapai. Upgrade ke Untungin Pro untuk mencatat transaksi tanpa batas!`, 'warning');
        setIsPremiumModalOpen(true);
        return;
      }
    }

    const amt = Number(txAmount);
    const finalAccountId = txAccountId || (accounts.length > 0 ? accounts[0].id : '');
    const finalCategory = txCategory || (txType === 'income' ? (categories.income[0] || 'Penjualan Produk') : (categories.expense[0] || 'Pengeluaran Lain-lain'));

    if (!txDate || !finalAccountId || !amt || amt <= 0) {
      showToast('Lengkapi tanggal, akun kas, dan nominal transaksi terlebih dahulu.', 'error');
      return;
    }

    if (txType === 'transfer') {
      const finalToAccountId = txToAccountId || (accounts.length > 1 ? accounts.find(a => a.id !== finalAccountId)?.id : '');
      if (!finalToAccountId) {
        showToast('Pilih akun tujuan transfer yang berbeda.', 'error');
        return;
      }
      if (finalAccountId === finalToAccountId) {
        showToast('Akun asal dan akun tujuan tidak boleh sama.', 'error');
        return;
      }

      if (editingTxId) {
        kasService.updateTransaction(namaUsaha, {
          id: editingTxId,
          namaUsaha,
          date: txDate,
          type: txType,
          accountId: finalAccountId,
          toAccountId: finalToAccountId,
          category: '',
          desc: txDesc.trim(),
          amount: amt,
          createdBy: viewerRole,
          createdAt: new Date().toISOString()
        });
        showToast('Transfer antar akun berhasil diperbarui.', 'success');
        setEditingTxId(null);
      } else {
        kasService.addTransaction(namaUsaha, {
          date: txDate,
          type: txType,
          accountId: finalAccountId,
          toAccountId: finalToAccountId,
          category: '',
          desc: txDesc.trim(),
          amount: amt,
          createdBy: viewerRole
        });
        showToast('Transfer antar akun berhasil dicatat!', 'success');
      }
    } else {
      if (editingTxId) {
        kasService.updateTransaction(namaUsaha, {
          id: editingTxId,
          namaUsaha,
          date: txDate,
          type: txType,
          accountId: finalAccountId,
          category: finalCategory,
          desc: txDesc.trim(),
          amount: amt,
          createdBy: viewerRole,
          createdAt: new Date().toISOString()
        });
        showToast('Transaksi berhasil diperbarui.', 'success');
        setEditingTxId(null);
      } else {
        kasService.addTransaction(namaUsaha, {
          date: txDate,
          type: txType,
          accountId: finalAccountId,
          category: finalCategory,
          desc: txDesc.trim(),
          amount: amt,
          createdBy: viewerRole
        });
        showToast('Transaksi kas berhasil dicatat!', 'success');
      }
    }

    // Reset Input
    setTxAmount('');
    setTxDesc('');
    setTxDate(new Date().toISOString().slice(0, 10));
    loadData();

    const updatedStatus = kasService.getPremiumStatus(namaUsaha);
    setPremiumStatus(updatedStatus);
    if (!hasProAccess && !isCuratorUser && !isDeveloperUser && updatedStatus.remainingTransactions !== undefined) {
      if (updatedStatus.remainingTransactions === 0) {
        showToast('Transaksi ke-10 berhasil dicatat! Kuota trial telah tercapai. Aktifkan Pro untuk terus mencatat.', 'warning');
      } else {
        showToast(`Transaksi berhasil dicatat! (Sisa kuota trial: ${updatedStatus.remainingTransactions} transaksi)`, 'success');
      }
    }
  };

  const handleStartEdit = (t: KasTransaction) => {
    setEditingTxId(t.id);
    setTxDate(t.date);
    setTxType(t.type);
    setTxAccountId(t.accountId);
    if (t.toAccountId) setTxToAccountId(t.toAccountId);
    if (t.category) setTxCategory(t.category);
    setTxDesc(t.desc || '');
    setTxAmount(String(t.amount));
    setActiveTab('transaksi');
  };

  const handleDeleteTx = (t: KasTransaction) => {
    const jenisLabel = t.type === 'income' ? 'Pendapatan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer Antar Akun';
    setConfirmDialog({
      isOpen: true,
      title: 'Untungin Says',
      message: `Hapus transaksi ${jenisLabel} sebesar ${rupiah(t.amount)}?`,
      details: t.desc ? `Keterangan: "${t.desc}" (${t.category || 'Kas'})` : `Kategori: ${t.category || 'Kas'}`,
      confirmLabel: 'Ya, Hapus Transaksi',
      onConfirm: () => {
        kasService.deleteTransaction(namaUsaha, t.id);
        showToast('Transaksi berhasil dihapus.', 'warning');
        loadData();
        setConfirmDialog(null);
      }
    });
  };

  const handleDeleteAccount = (acc: KasAccount) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Untungin Says',
      message: `Hapus akun kas "${acc.name}"?`,
      details: `Saldo awal akun ini adalah ${rupiah(acc.initialBalance)}. Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: 'Ya, Hapus Akun',
      onConfirm: () => {
        kasService.deleteAccount(namaUsaha, acc.id);
        loadData();
        showToast(`Akun "${acc.name}" berhasil dihapus.`, 'warning');
        setConfirmDialog(null);
      }
    });
  };

  // Handler Tambah Akun
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveReadOnly || !newAccName.trim()) return;

    kasService.addAccount(namaUsaha, newAccName.trim(), newAccType, Number(newAccBalance) || 0);
    showToast(`Akun "${newAccName.trim()}" berhasil ditambahkan.`, 'success');
    setNewAccName('');
    setNewAccBalance('');
    loadData();
  };

  // Export CSV sesuai format Untungin v1.3 (Separator titik koma ;)
  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) {
      showToast('Tidak ada transaksi pada periode ini untuk diekspor.', 'error');
      return;
    }

    const accountMap = new Map(accounts.map(a => [a.id, a.name]));
    const headers = ['Tanggal', 'Jenis', 'Akun', 'Kategori', 'Deskripsi', 'Jumlah (Rp)', 'Dicatat Oleh'];
    const rows = filteredTransactions.map(t => {
      const typeLabel = t.type === 'income' ? 'Pendapatan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer';
      const accText = t.type === 'transfer'
        ? `${accountMap.get(t.accountId) || '—'} -> ${accountMap.get(t.toAccountId || '') || '—'}`
        : accountMap.get(t.accountId) || '—';
      return [
        t.date,
        typeLabel,
        accText,
        t.type === 'transfer' ? '—' : t.category,
        `"${(t.desc || '').replace(/"/g, '""')}"`,
        t.amount,
        t.createdBy || 'Peserta'
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Untungin - Buku Kas ${namaUsaha} ${selectedMonth !== 'all' ? MONTH_NAMES[Number(selectedMonth) - 1] : 'Semua'} ${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File CSV berhasil diunduh.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#f8fafc] w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative">
        
        {/* Toast Notifikasi */}
        {toastMsg && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all animate-in slide-in-from-top-2 ${
            toastMsg.type === 'success' ? 'bg-emerald-600' : toastMsg.type === 'error' ? 'bg-rose-600' : 'bg-amber-600'
          }`}>
            {toastMsg.text}
          </div>
        )}

        {/* 1. HEADER MODAL */}
        <div className="bg-gradient-to-r from-[#001c3c] via-[#002f5e] to-[#004c80] p-3 sm:p-5 text-white flex items-center justify-between gap-2.5 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-[#001c3c] shadow-md flex-shrink-0">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 font-black" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-lg tracking-tight truncate">
                  Untungin &middot; Buku Kas & Keuangan UMKM
                </h3>
                {effectiveReadOnly ? (
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-amber-300 text-[10px] font-bold">
                      Mode Pantau (Read-Only)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSimulasiMode(true)}
                      className="px-2 py-0.5 rounded-full bg-amber-400 text-[#001c3c] hover:bg-amber-300 text-[10px] font-extrabold transition-all cursor-pointer shadow-xs"
                      title="Klik untuk membuka formulir input data transaksi"
                    >
                      ✏️ Simulasi
                    </button>
                  </div>
                ) : isSimulasiMode ? (
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-400/40 text-[10px] font-bold">
                      Mode Simulasi
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSimulasiMode(false)}
                      className="text-[10px] text-slate-300 hover:text-white underline cursor-pointer"
                    >
                      Kunci
                    </button>
                  </div>
                ) : null}
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5 truncate">
                <span className="font-semibold text-white">{namaUsaha}</span>
                {namaPemilik && <span>&middot; {namaPemilik}</span>}
                {whatsapp && <span className="hidden sm:inline">&middot; {whatsapp}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {isKasUnlocked && (
              <>
                {/* Tombol Ganti PIN Peserta */}
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePinModalOpen(true);
                    setOldPinInput('');
                    setNewPinInput('');
                    setConfirmNewPinInput('');
                    setChangePinError(null);
                  }}
                  title="Ganti PIN Pengaman Buku Kas Saya"
                  className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/15"
                >
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span className="hidden md:inline">Ganti PIN</span>
                </button>

                {/* Tombol Reset PIN Khusus Developer / Engineer */}
                {isDeveloperUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Untungin Says',
                        message: `Reset PIN Buku Kas "${namaUsaha}" ke standar (123456)?`,
                        details: 'Peserta akan dapat kembali membuka buku kas menggunakan PIN 123456.',
                        confirmLabel: 'Ya, Reset ke 123456',
                        onConfirm: () => {
                          setConfirmDialog(null);
                          const res = kasService.resetKasPin(namaUsaha, DEFAULT_KAS_PIN, 'Lead Developer');
                          showToast(res.message, 'success');
                        }
                      });
                    }}
                    title="Reset PIN Peserta ke 123456 (Khusus Developer)"
                    className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#001c3c] transition-all text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Key className="w-4 h-4" />
                    <span className="hidden md:inline">Reset PIN</span>
                  </button>
                )}

                {/* Tombol Sinkronisasi Cloud Google Spreadsheet */}
                <button
                  type="button"
                  onClick={() => handleSyncCloud(true)}
                  disabled={isSyncingCloud}
                  title={
                    lastSyncedTime
                      ? `Tersinkron dengan Google Spreadsheet (pukul ${lastSyncedTime}). Klik untuk sinkron ulang.`
                      : 'Sinkronkan data kas langsung dengan Google Spreadsheet'
                  }
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isSyncingCloud
                      ? 'bg-blue-500/25 text-blue-200 border-blue-400/50 animate-pulse'
                      : 'bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-200 border-emerald-400/40'
                  }`}
                >
                  <Cloud className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-bounce text-blue-300' : 'text-emerald-300'}`} />
                  <span className="font-bold">
                    {isSyncingCloud ? 'Sinkron...' : 'Sinkron Cloud'}
                  </span>
                  <RefreshCw className={`w-3 h-3 ${isSyncingCloud ? 'animate-spin text-blue-300' : 'text-emerald-300/80'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setHideAmount(!hideAmount)}
                  title={hideAmount ? 'Tampilkan Nominal' : 'Sembunyikan Nominal (Mode Privasi)'}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer flex-shrink-0"
                >
                  {hideAmount ? <EyeOff className="w-4 h-4 text-amber-300" /> : <Eye className="w-4 h-4" />}
                </button>
              </>
            )}

            {/* Badge Status Lisensi Untungin Pro / Hybrid Trial */}
            <button
              type="button"
              onClick={() => setIsPremiumModalOpen(true)}
              title={
                hasProAccess
                  ? 'Lisensi Untungin Pro Aktif (Akses Penuh)'
                  : isTrialActive
                  ? `Masa Trial Aktif: Sisa ${premiumStatus.remainingTransactions ?? 0} transaksi (${premiumStatus.remainingDays ?? 0} hari)`
                  : 'Batas Trial Selesai. Upgrade ke Untungin Pro'
              }
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                hasProAccess
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#001c3c] border-amber-300 hover:from-amber-300 hover:to-amber-400'
                  : isTrialActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-300/40 hover:from-indigo-400 hover:to-purple-500'
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
              }`}
            >
              {hasProAccess ? (
                <>
                  <Crown className="w-3.5 h-3.5 fill-[#001c3c] text-[#001c3c]" />
                  <span className="hidden sm:inline">PRO</span>
                </>
              ) : isTrialActive ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">TRIAL ({premiumStatus.remainingTransactions ?? 0} tx)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">UPGRADE</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Banner Kurator jika viewer adalah Kurator atau Admin */}
        {isCuratorUser && (
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-[#001c3c] text-white px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs border-b border-purple-500/30 flex-shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Award className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span className="font-semibold text-purple-200">Panel Kurasi &middot; Hak Akses Kas:</span>
              {premiumStatus.isPremium ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>💎 Premium Aktif ({premiumStatus.grantedBy || 'Kurator'})</span>
                </span>
              ) : isTrialActive ? (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 font-bold border border-indigo-400/40 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-300" />
                  <span>✨ Trial Aktif (Sisa {premiumStatus.remainingTransactions ?? 0} tx / {premiumStatus.remainingDays ?? 0} hari)</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30 text-[11px] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>🔒 Trial Selesai ({premiumStatus.usedTransactions ?? 0}/10 tx)</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {premiumStatus.isPremium ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Cabut Akses Pro',
                      message: `Cabut akses Untungin Pro untuk "${namaUsaha}"?`,
                      details: 'Peserta akan kembali ke akun Standar dan fitur buku kas akan memerlukan lisensi atau kurasi ulang.',
                      confirmLabel: 'Ya, Cabut Akses',
                      onConfirm: () => {
                        setConfirmDialog(null);
                        handleRevokePro();
                      }
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white border border-rose-400/30 font-bold transition-all cursor-pointer text-[11px]"
                >
                  Cabut Akses Pro
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGrantProByKurator}
                  className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#001c3c] font-black transition-all cursor-pointer text-[11px] flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Beri Hak Akses Premium (Lolos Seleksi)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {!hasProAccess && !isTrialActive && !isTrialReadOnlyView && !isSimulasiMode && !isCuratorUser ? (
          /* TAMPILAN GERBANG AKSES UNTUNGIN PRO & STATUS TRIAL */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center animate-in fade-in">
            <div className="max-w-2xl w-full mx-auto my-auto space-y-6 text-center">
              
              {/* Badge & Crown Header */}
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold tracking-wide uppercase shadow-2xs">
                  <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span>{isTrialExpired ? 'Masa Percobaan Trial Selesai · Untungin Pro' : 'Fitur Premium Eksklusif · Untungin Pro'}</span>
                </span>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 text-[#001c3c] flex items-center justify-center shadow-xl shadow-amber-500/25 mx-auto">
                  <Wallet className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#001c3c] tracking-tight">
                  Buku Kas & Manajemen Keuangan UMKM
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  {isTrialExpired ? (
                    <>
                      Masa trial untuk <strong className="text-[#004c80]">{namaUsaha}</strong> telah berakhir ({premiumStatus.usedTransactions || 0}/10 transaksi atau 7 hari aktif tercapai). <strong className="text-emerald-700">Seluruh data transaksi yang telah Anda catat aman tersimpan di sistem.</strong> Aktifkan lisensi Untungin Pro untuk membuka akses pencatatan penuh tanpa batas.
                    </>
                  ) : (
                    <>
                      Fitur ini dirancang khusus untuk membantu <strong className="text-[#004c80]">{namaUsaha}</strong> memisahkan uang pribadi & bisnis, mencatat transaksi harian, mengukur laba bersih, serta simulasi pajak PPh 0,5%.
                    </>
                  )}
                </p>
              </div>

              {/* 4 Keunggulan Utama */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="font-bold text-xs text-[#001c3c] flex items-center gap-1.5">
                    <span className="text-base">💳</span>
                    <span>Multi-Akun Kas & Bank</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Pisahkan Kas Tunai Toko, Rekening Bank Bisnis, dan QRIS/E-Wallet dalam satu pintu.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="font-bold text-xs text-[#001c3c] flex items-center gap-1.5">
                    <span className="text-base">📊</span>
                    <span>Laba Rugi & Arus Kas Otomatis</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Ketahui keuntungan bersih harian dan pos pengeluaran terbesar tanpa hitung manual.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="font-bold text-xs text-[#001c3c] flex items-center gap-1.5">
                    <span className="text-base">🏛️</span>
                    <span>Simulasi Pajak UMKM 0,5%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Kalkulasi estimasi PPh Final PP 23/2018 otomatis dari omzet usaha per bulan.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="font-bold text-xs text-[#001c3c] flex items-center gap-1.5">
                    <span className="text-base">☁️</span>
                    <span>Sinkron Cloud & Ekspor Excel</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Data aman tersimpan di Google Spreadsheet Anda dan siap diunduh dalam format CSV.
                  </p>
                </div>
              </div>

              {/* Dua Opsi Cara Akses (Sesuai Arahan Pengguna) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* Opsi 1: Diberi hak oleh kurator/admin */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border-2 border-purple-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-200/80 text-purple-900 font-black text-[10px] uppercase tracking-wide">
                        Opsi 1: Jalur Kurasi
                      </span>
                      <Award className="w-4 h-4 text-purple-700" />
                    </div>
                    <h4 className="font-extrabold text-sm text-[#001c3c]">
                      Diberikan oleh Tim Kurator / Panitia
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Peserta yang dinyatakan lolos kurasi tahap tertentu atau direkomendasikan oleh kurator akan diaktifkan hak aksesnya secara gratis.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-purple-200/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Status Anda:</span>
                      <span className="font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md text-[11px]">
                        Menunggu Penilaian
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCheckKurasiStatus}
                      className="w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-98 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Periksa Pembaruan Status Kurasi</span>
                    </button>
                  </div>
                </div>

                {/* Opsi 2: Peserta membayar nilai tertentu / aktivasi kode lisensi */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-amber-300 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px] uppercase tracking-wide">
                        Opsi 2: Beli / Aktivasi
                      </span>
                      <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
                    </div>
                    <h4 className="font-extrabold text-sm text-[#001c3c]">
                      Aktivasi Kode Lisensi / Pembayaran
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Jika Anda telah memiliki kode voucher lisensi resmi atau telah melakukan pembayaran, masukkan kode lisensi untuk aktivasi instan.
                    </p>
                  </div>

                  <form onSubmit={handleActivateLicense} className="space-y-2 pt-2 border-t border-amber-200/60">
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Contoh: UNTUNGINPRO2026"
                        value={licenseCodeInput}
                        onChange={(e) => setLicenseCodeInput(e.target.value.toUpperCase())}
                        className="w-full py-2 px-3 text-xs font-mono font-bold bg-white border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl outline-none"
                      />
                      {licenseFeedback && (
                        <p className={`text-[11px] font-bold ${licenseFeedback.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {licenseFeedback.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="submit"
                        disabled={isActivatingLicense}
                        className="py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-[#001c3c] font-black text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isActivatingLicense ? 'Memeriksa...' : 'Aktivasi'}</span>
                      </button>
                      <a
                        href={`https://wa.me/6285156557675?text=${encodeURIComponent(
                          `Halo Admin PartnerUp,\n\nSaya ingin membeli / aktivasi akses Premium Buku Kas Untungin untuk unit usaha kami:\n- Nama Usaha: ${namaUsaha}\n- Pemilik: ${namaPemilik || '-'}\n- WhatsApp: ${whatsapp || '-'}\n\nMohon informasi nilai pembayaran & nomor rekening resmi. Terima kasih!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer text-center"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Beli via WA</span>
                      </a>
                    </div>
                  </form>
                </div>
              </div>

              {/* Tombol Preview Simulasi & Mode Baca & Tutup */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                {(premiumStatus.usedTransactions || 0) > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsTrialReadOnlyView(true);
                      showToast('Mode Baca Aktif: Menampilkan ringkasan dan riwayat transaksi kas Anda.', 'success');
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-purple-300 shadow-2xs"
                  >
                    <Wallet className="w-3.5 h-3.5 text-purple-700" />
                    <span>👁️ Buka Catatan Kas Saya (Mode Baca)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsSimulasiMode(true);
                    showToast('Mode Simulasi Aktif. Anda dapat melihat dan mencoba simulasi pembukuan.', 'warning');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-slate-300"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>🧪 Coba Mode Simulasi (Demo)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        ) : !isKasUnlocked ? (
          /* TAMPILAN KUNCI PIN BUKU KAS */
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center max-w-md mx-auto my-auto space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-xl shadow-purple-500/25">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-[#001c3c]">
                Buku Kas Terproteksi PIN
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Data keuangan dan transaksi <strong className="text-[#004c80]">{namaUsaha}</strong> bersifat privat. Masukkan PIN keamanan untuk membuka.
              </p>
            </div>

            {/* Banner Informasi PIN Awal */}
            <div className="w-full bg-purple-50 border border-purple-200/80 rounded-2xl p-3.5 text-xs text-purple-900 flex items-start gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  PIN Bawaan Awal: <code className="bg-purple-200/80 px-2 py-0.5 rounded font-mono font-black text-purple-950 tracking-wider">
                    {namaUsaha.toLowerCase() === 'obeecreatives' ? 'obeecreatives2026#*' : '123456'}
                  </code>
                </p>
                <p className="text-[11px] text-purple-700 mt-1">
                  Setelah terbuka, Anda dapat mengganti PIN ini secara mandiri kapan saja.
                </p>
              </div>
            </div>

            {pinError && (
              <div className="w-full p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-left animate-in fade-in">
                {pinError}
              </div>
            )}

            {/* Form Input PIN */}
            <form onSubmit={handleUnlockKas} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showEnteredPin ? 'text' : 'password'}
                  maxLength={32}
                  placeholder={namaUsaha.toLowerCase() === 'obeecreatives' ? 'Masukkan PIN (default: obeecreatives2026#*)' : 'Masukkan PIN (default: 123456)'}
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(null);
                  }}
                  className="w-full py-3.5 px-4 text-center text-xl font-mono tracking-widest font-black bg-white border-2 border-slate-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 rounded-2xl outline-none transition-all text-slate-800"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowEnteredPin(!showEnteredPin)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showEnteredPin ? 'Sembunyikan PIN' : 'Lihat PIN'}
                >
                  {showEnteredPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-98 text-white font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Buka Buku Kas</span>
                </button>
              </div>
            </form>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-200 w-full">
              Lupa PIN? Hubungi Lead Developer / Tim Kurator untuk reset PIN instan.
            </div>
          </div>
        ) : (
          <>
            {/* Banner Mode Simulasi */}
            {isSimulasiMode && (
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>Mode Simulasi Aktif:</strong> Anda sedang menjelajahi simulasi pembukuan Buku Kas Untungin.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!hasPremiumAccess && (
                    <button
                      type="button"
                      onClick={() => setIsSimulasiMode(false)}
                      className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-[#001c3c] font-black text-[11px] transition-all cursor-pointer shadow-xs"
                    >
                      Aktivasi Premium
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSimulasiMode(false)}
                    className="text-[11px] text-amber-800 hover:text-amber-950 underline font-semibold cursor-pointer"
                  >
                    Keluar Demo
                  </button>
                </div>
              </div>
            )}

            {/* Banner Akses Hybrid Trial Aktif */}
            {isTrialActive && !isSimulasiMode && (
              <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-[#001c3c] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs border-b border-indigo-400/30 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>
                    <strong className="text-amber-300">Akses Trial Hybrid Aktif:</strong> Sisa{' '}
                    <span className="font-extrabold text-amber-300">{premiumStatus.remainingTransactions ?? 0}</span> dari 10 transaksi trial riil ({premiumStatus.remainingDays ?? 0} hari tersisa).
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="px-2.5 py-1 rounded bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#001c3c] font-black text-[11px] transition-all cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <Crown className="w-3 h-3 fill-[#001c3c]" />
                    <span>Upgrade ke Untungin Pro</span>
                  </button>
                </div>
              </div>
            )}

            {/* Banner Mode Baca (Trial Telah Selesai) */}
            {isTrialExpired && isTrialReadOnlyView && !isSimulasiMode && (
              <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-[#001c3c] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs border-b border-amber-500/30 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>
                    <strong className="text-amber-300">Mode Baca (Trial Selesai):</strong> Seluruh data 10 transaksi riil Anda aman. Aktifkan Pro untuk menambah transaksi baru tanpa batas.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-[#001c3c] font-black text-[11px] transition-all cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Aktifkan Pro Sekarang</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. SUB-NAVBAR TAB */}
            <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 shadow-2xs">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {[
                  { id: 'beranda', label: '🏠 Beranda' },
                  { id: 'transaksi', label: '📝 Transaksi' },
                  { id: 'akun', label: '💳 Akun Kas' },
                  { id: 'labarugi', label: '📊 Laba Rugi & Rekap' },
                  { id: 'pajak', label: '🏛️ Pajak 0,5% (PP 23)' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                    } ${
                      activeTab === tab.id
                        ? 'bg-[#001c3c] text-white shadow-xs'
                        : 'text-slate-700 hover:text-[#001c3c] hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Kontrol Kanan: Filter Periode Bulan & Tahun */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                  >
                    <option value="all">Semua Bulan</option>
                    {MONTH_NAMES.map((m, i) => (
                      <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                  >
                    {[2025, 2026, 2027].map(y => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

        {/* 3. KONTEN MODAL BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* TAB 1: BERANDA */}
          {activeTab === 'beranda' && (
            <div className="space-y-4">
              {/* Alert Saldo Minus */}
              {summary.minusAccounts.length > 0 && (
                <div className={`p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 ${
                  fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                }`}>
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <div>
                    <strong>Peringatan Saldo Minus:</strong> Saldo pada akun{' '}
                    {summary.minusAccounts.map(a => a.name).join(', ')} bernilai negatif. Periksa kembali pengeluaran kasir Anda.
                  </div>
                </div>
              )}

              {/* 4 Kartu Statistik Finansial (Skalabilitas Font Ramah Senior) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1 transition-all ${
                  fontSize === 'xlarge' ? 'p-5' : fontSize === 'large' ? 'p-4 sm:p-5' : 'p-3.5'
                }`}>
                  <span className={`uppercase font-bold tracking-wider text-slate-600 block ${
                    fontSize === 'xlarge' ? 'text-xs sm:text-sm' : fontSize === 'large' ? 'text-[11px] sm:text-xs' : 'text-[10px]'
                  }`}>
                    Total Saldo Kas
                  </span>
                  <div className={`font-black text-[#001c3c] font-mono tracking-tight leading-tight ${
                    fontSize === 'xlarge' ? 'text-2xl sm:text-3xl' : fontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                  }`}>
                    {rupiah(summary.totalSaldoSemua)}
                  </div>
                  <span className={`text-slate-600 block font-medium ${
                    fontSize === 'xlarge' ? 'text-xs sm:text-sm' : fontSize === 'large' ? 'text-[11px] sm:text-xs' : 'text-[10px]'
                  }`}>
                    Dari {accounts.length} akun kas aktif
                  </span>
                </div>

                <div className={`bg-emerald-50/80 rounded-2xl border border-emerald-300 shadow-xs space-y-1 transition-all ${
                  fontSize === 'xlarge' ? 'p-5' : fontSize === 'large' ? 'p-4 sm:p-5' : 'p-3.5'
                }`}>
                  <span className={`uppercase font-bold tracking-wider text-emerald-800 block ${
                    fontSize === 'xlarge' ? 'text-xs sm:text-sm' : fontSize === 'large' ? 'text-[11px] sm:text-xs' : 'text-[10px]'
                  }`}>
                    Total Pendapatan
                  </span>
                  <div className={`font-black text-emerald-950 font-mono tracking-tight leading-tight ${
                    fontSize === 'xlarge' ? 'text-2xl sm:text-3xl' : fontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                  }`}>
                    {rupiah(summary.income)}
                  </div>
                  <span className={`text-emerald-800 block font-medium ${
                    fontSize === 'xlarge' ? 'text-xs sm:text-sm' : fontSize === 'large' ? 'text-[11px] sm:text-xs' : 'text-[10px]'
                  }`}>
                    Omzet & penjualan usaha
                  </span>
                </div>

                <div className={`bg-rose-50/80 rounded-2xl border border-rose-300 shadow-xs space-y-1 transition-all ${
                  fontSize === 'xlarge' ? 'p-5' : fontSize === 'large' ? 'p-4 sm:p-5' : 'p-3.5'
                }`}>
                  <span className={`uppercase font-bold tracking-wider text-rose-800 block ${
                    fontSize === 'xlarge' ? 'text-xs sm:text-sm' : fontSize === 'large' ? 'text-[11px] sm:text-xs' : 'text-[10px]'
                  }`}>
                    Total Pengeluaran
                  </span>
                  <div className={`font-black text-rose-950 font-mono tracking-tight leading-tight ${
                    fontSize === 'xlarge' ? 'text-2xl sm:text-3xl' : fontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                  }`}>
                    {rupiah(summary.expense)}
                  </div>
                  <span className={`text-rose-800 block font-medium ${
                    fontSize === 'xlarge' ? 'text-xs sm:text-sm' : fontSize === 'large' ? 'text-[11px] sm:text-xs' : 'text-[10px]'
                  }`}>
                    Beban bahan & operasional
                  </span>
                </div>

                <div className={`rounded-2xl border shadow-xs space-y-1 transition-all ${
                  fontSize === 'xlarge' ? 'p-5' : fontSize === 'large' ? 'p-4 sm:p-5' : 'p-3.5'
                } ${
                  summary.net >= 0 ? 'bg-blue-50/80 border-blue-300 text-blue-950' : 'bg-amber-50/80 border-amber-300 text-amber-950'
                }`}>
                  <span className={`uppercase font-bold tracking-wider block ${
                    fontSize === 'xlarge' ? 'text-xs sm:text-sm' : fontSize === 'large' ? 'text-[11px] sm:text-xs' : 'text-[10px]'
                  }`}>
                    {summary.net >= 0 ? 'Laba Bersih' : 'Rugi Bersih'}
                  </span>
                  <div className={`font-black font-mono tracking-tight leading-tight ${
                    fontSize === 'xlarge' ? 'text-2xl sm:text-3xl' : fontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                  }`}>
                    {rupiah(Math.abs(summary.net))}
                  </div>
                  <span className={`block font-semibold opacity-90 ${
                    fontSize === 'xlarge' ? 'text-xs sm:text-sm' : fontSize === 'large' ? 'text-[11px] sm:text-xs' : 'text-[10px]'
                  }`}>
                    Margin: {summary.income > 0 ? ((summary.net / summary.income) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
              </div>

              {/* Rincian Akun Kas Terdaftar */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`font-black text-[#001c3c] flex items-center gap-2 ${
                    fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs'
                  }`}>
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <span>Posisi Saldo Akun Usaha</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('akun')}
                    className={`text-blue-700 font-bold hover:underline cursor-pointer ${
                      fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-[11px]'
                    }`}
                  >
                    Kelola Akun &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {accounts.map((acc) => {
                    const bal = kasService.calculateAccountBalance(acc, transactions);
                    const isMinus = bal < 0;
                    return (
                      <div key={acc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className={`font-extrabold text-slate-800 ${
                            fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                          }`}>{acc.name}</div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase">{acc.type}</span>
                        </div>
                        <div className={`font-mono font-black ${
                          fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs'
                        } ${isMinus ? 'text-rose-600' : 'text-slate-900'}`}>
                          {rupiah(bal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5 Transaksi Terakhir */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`font-black text-[#001c3c] flex items-center gap-2 ${
                    fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs'
                  }`}>
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Transaksi Terkini</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('transaksi')}
                    className={`text-blue-700 font-bold hover:underline cursor-pointer ${
                      fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-[11px]'
                    }`}
                  >
                    Buka Riwayat Lengkap &rarr;
                  </button>
                </div>
                {transactions.slice(0, 5).length === 0 ? (
                  <div className={`text-center py-6 text-slate-400 italic ${
                    fontSize === 'xlarge' ? 'text-sm' : 'text-xs'
                  }`}>
                    Belum ada transaksi tercatat. Mulai catat pemasukan dan pengeluaran Anda.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {transactions.slice(0, 5).map((t) => (
                      <div key={t.id} className={`py-3 flex items-center justify-between ${
                        fontSize === 'xlarge' ? 'text-sm sm:text-base' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                      }`}>
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-slate-800 flex items-center gap-2">
                            <span>{t.desc || t.category || 'Transfer Saldo'}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.type === 'income' ? 'bg-emerald-100 text-emerald-800' : t.type === 'expense' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {t.type === 'income' ? 'Masuk' : t.type === 'expense' ? 'Keluar' : 'Transfer'}
                            </span>
                          </div>
                          <div className={`text-slate-500 font-mono ${
                            fontSize === 'xlarge' ? 'text-xs' : 'text-[11px]'
                          }`}>
                            {t.date} &middot; {t.category || 'Transfer'}
                          </div>
                        </div>
                        <div className={`font-mono font-black ${
                          fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs'
                        } ${
                          t.type === 'income' ? 'text-emerald-700' : t.type === 'expense' ? 'text-rose-700' : 'text-slate-800'
                        }`}>
                          {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''} {rupiah(t.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TRANSAKSI (INPUT & TABEL) */}
          {activeTab === 'transaksi' && (
            <div className="space-y-5">
              {/* Form Input Transaksi Cepat (Hanya jika bukan read-only) */}
              {effectiveReadOnly && (
                <div className={`bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span>Mode Pantau Kurator (Read-Only) aktif. Anda dapat meninjau buku kas dan mengekspor CSV.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSimulasiMode(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#001c3c] font-black text-xs transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    ✏️ Buka Formulir Input
                  </button>
                </div>
              )}

              {!effectiveReadOnly && (
                <form onSubmit={handleSaveTransaction} className={`bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 ${
                  fontSize === 'xlarge' ? 'p-5 sm:p-6' : 'p-4 sm:p-5'
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className={`font-black text-[#001c3c] ${
                      fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                    }`}>
                      {editingTxId ? '✏️ Edit Transaksi Kas' : '➕ Tambah Transaksi Kas'}
                    </h4>
                    {editingTxId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTxId(null);
                          setTxAmount('');
                          setTxDesc('');
                        }}
                        className={`text-rose-600 font-bold hover:underline cursor-pointer ${
                          fontSize === 'xlarge' ? 'text-sm' : 'text-xs'
                        }`}
                      >
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className={`font-bold text-slate-700 block mb-1 ${
                        fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                      }`}>Tanggal Transaksi</label>
                      <input
                        type="date"
                        value={txDate}
                        onChange={(e) => setTxDate(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:ring-2 focus:ring-amber-400 ${
                          fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className={`font-bold text-slate-700 block mb-1 ${
                        fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                      }`}>Jenis Transaksi</label>
                      <select
                        value={txType}
                        onChange={(e) => {
                          const t = e.target.value as any;
                          setTxType(t);
                          if (t === 'income' && categories.income.length) setTxCategory(categories.income[0]);
                          if (t === 'expense' && categories.expense.length) setTxCategory(categories.expense[0]);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-amber-400 ${
                          fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                        }`}
                      >
                        <option value="income">🟢 Pendapatan (Kas Masuk)</option>
                        <option value="expense">🔴 Pengeluaran (Kas Keluar)</option>
                        <option value="transfer">🔄 Transfer Antar Akun</option>
                      </select>
                    </div>

                    <div>
                      <label className={`font-bold text-slate-700 block mb-1 ${
                        fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                      }`}>
                        {txType === 'transfer' ? 'Dari Akun' : 'Akun Kas / Bank'}
                      </label>
                      <select
                        value={txAccountId}
                        onChange={(e) => setTxAccountId(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-amber-400 ${
                          fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                        }`}
                        required
                      >
                        {accounts.map(a => (
                          <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                        ))}
                      </select>
                    </div>

                    {txType === 'transfer' ? (
                      <div>
                        <label className={`font-bold text-slate-700 block mb-1 ${
                          fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                        }`}>Ke Akun Tujuan</label>
                        <select
                          value={txToAccountId}
                          onChange={(e) => setTxToAccountId(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-amber-400 ${
                            fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                          }`}
                          required
                        >
                          {accounts.map(a => (
                            <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className={`font-bold text-slate-700 block mb-1 ${
                          fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                        }`}>Kategori</label>
                        <select
                          value={txCategory}
                          onChange={(e) => setTxCategory(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-amber-400 ${
                            fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                          }`}
                          required
                        >
                          {(txType === 'income' ? categories.income : categories.expense).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className={`font-bold text-slate-700 block mb-1 ${
                        fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                      }`}>Keterangan / Catatan Singkat</label>
                      <input
                        type="text"
                        value={txDesc}
                        onChange={(e) => setTxDesc(e.target.value)}
                        placeholder="Contoh: Pembayaran pesanan katering via transfer QRIS"
                        className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-amber-400 ${
                          fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pt-1">
                      <div className="flex-1 max-w-sm">
                        <label className={`font-extrabold text-slate-800 block mb-1 ${
                          fontSize === 'xlarge' ? 'text-sm' : 'text-xs'
                        }`}>Nominal (Rp)</label>
                        <input
                          type="number"
                          min="0"
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                          placeholder="0"
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black font-mono focus:ring-2 focus:ring-amber-400 text-slate-900 ${
                            fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base'
                          }`}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className={`self-end px-6 py-3 rounded-xl bg-gradient-to-r from-[#001c3c] to-[#003366] hover:from-[#002855] text-white font-extrabold shadow-md transition-all cursor-pointer ${
                          fontSize === 'xlarge' ? 'text-sm sm:text-base' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                        }`}
                      >
                        {editingTxId ? 'Simpan Perubahan' : 'Simpan Transaksi'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tabel Riwayat Transaksi */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className={`font-black text-[#001c3c] flex items-center gap-2 ${
                    fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                  }`}>
                    <span>Riwayat Transaksi ({filteredTransactions.length} Data)</span>
                    {lastSyncedTime && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-flex items-center gap-1">
                        <Cloud className="w-2.5 h-2.5" />
                        <span>Cloud: {lastSyncedTime}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSyncCloud(true)}
                      disabled={isSyncingCloud}
                      title="Sinkronkan seluruh data buku kas ke Google Spreadsheet"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border ${
                        isSyncingCloud
                          ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      <Cloud className="w-4 h-4 text-blue-600" />
                      <span>{isSyncingCloud ? 'Menyinkronkan...' : 'Sinkron Cloud'}</span>
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin text-blue-600' : 'text-blue-500'}`} />
                    </button>

                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer shadow-xs ${
                        fontSize === 'xlarge' ? 'text-sm' : 'text-xs'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>Ekspor CSV / Excel</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-800 font-extrabold border-b border-slate-200">
                        <th className={`p-3.5 ${fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'}`}>Tanggal</th>
                        <th className={`p-3.5 ${fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'}`}>Jenis</th>
                        <th className={`p-3.5 ${fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'}`}>Akun</th>
                        <th className={`p-3.5 ${fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'}`}>Kategori & Keterangan</th>
                        <th className={`p-3.5 text-right ${fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'}`}>Nominal</th>
                        {!effectiveReadOnly && <th className={`p-3.5 text-center ${fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'}`}>Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={effectiveReadOnly ? 5 : 6} className={`p-8 text-center text-slate-400 italic ${
                            fontSize === 'xlarge' ? 'text-base' : 'text-sm'
                          }`}>
                            Tidak ada transaksi yang cocok pada filter periode ini.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((t) => {
                          const acc = accounts.find(a => a.id === t.accountId);
                          const toAcc = t.toAccountId ? accounts.find(a => a.id === t.toAccountId) : null;
                          return (
                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                              <td className={`p-3.5 font-mono text-slate-700 whitespace-nowrap font-medium ${
                                fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                              }`}>
                                {t.date}
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-lg font-bold ${
                                  fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                                } ${
                                  t.type === 'income' ? 'bg-emerald-100 text-emerald-900' : t.type === 'expense' ? 'bg-rose-100 text-rose-900' : 'bg-slate-200 text-slate-800'
                                }`}>
                                  {t.type === 'income' ? 'Pendapatan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer'}
                                </span>
                              </td>
                              <td className={`p-3.5 text-slate-800 font-semibold whitespace-nowrap ${
                                fontSize === 'xlarge' ? 'text-sm sm:text-base' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                              }`}>
                                {t.type === 'transfer' ? (
                                  <span>{acc?.name || '—'} &rarr; {toAcc?.name || '—'}</span>
                                ) : (
                                  <span>{acc?.name || '—'}</span>
                                )}
                              </td>
                              <td className="p-3.5 max-w-xs">
                                <div className={`font-black text-slate-900 ${
                                  fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                                }`}>{t.category || 'Transfer Saldo'}</div>
                                {t.desc && (
                                  <div className={`text-slate-600 mt-0.5 font-medium ${
                                    fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                                  }`}>{t.desc}</div>
                                )}
                              </td>
                              <td className={`p-3.5 text-right font-mono font-black whitespace-nowrap ${
                                fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                              } ${
                                t.type === 'income' ? 'text-emerald-700' : t.type === 'expense' ? 'text-rose-700' : 'text-slate-800'
                              }`}>
                                {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''} {rupiah(t.amount)}
                              </td>
                              {!effectiveReadOnly && (
                                <td className="p-3.5 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(t)}
                                      className="p-2 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                      title="Edit Transaksi"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTx(t)}
                                      className="p-2 rounded-xl text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                      title="Hapus Transaksi"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AKUN KAS */}
          {activeTab === 'akun' && (
            <div className="space-y-4">
              {!effectiveReadOnly && (
                <form onSubmit={handleAddAccount} className={`bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 ${
                  fontSize === 'xlarge' ? 'p-5 sm:p-6' : 'p-4 sm:p-5'
                }`}>
                  <h4 className={`font-black text-[#001c3c] ${
                    fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs'
                  }`}>Tambah Akun Kas / Bank Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Nama akun (contoh: BCA Bisnis, Kas Toko)"
                      value={newAccName}
                      onChange={(e) => setNewAccName(e.target.value)}
                      className={`px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:ring-2 focus:ring-amber-400 ${
                        fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                      }`}
                      required
                    />
                    <select
                      value={newAccType}
                      onChange={(e) => setNewAccType(e.target.value as any)}
                      className={`px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-amber-400 ${
                        fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                      }`}
                    >
                      <option value="Kas">Kas Tunai</option>
                      <option value="Bank">Rekening Bank</option>
                      <option value="E-Wallet">E-Wallet / QRIS</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Saldo Awal (Rp)"
                      value={newAccBalance}
                      onChange={(e) => setNewAccBalance(e.target.value)}
                      className={`px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-400 ${
                        fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
                      }`}
                    />
                    <button
                      type="submit"
                      className={`px-5 py-2.5 rounded-xl bg-[#001c3c] hover:bg-[#002f5e] text-white font-extrabold transition-colors cursor-pointer shadow-xs ${
                        fontSize === 'xlarge' ? 'text-sm sm:text-base' : 'text-xs'
                      }`}
                    >
                      Tambah Akun
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {accounts.map((acc) => {
                  const bal = kasService.calculateAccountBalance(acc, transactions);
                  const isMinus = bal < 0;
                  const hasTx = transactions.some(t => t.accountId === acc.id || t.toAccountId === acc.id);
                  return (
                    <div key={acc.id} className={`bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5 relative transition-all ${
                      fontSize === 'xlarge' ? 'p-5' : fontSize === 'large' ? 'p-4 sm:p-5' : 'p-4'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-[#001c3c] ${
                          fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-sm'
                        }`}>{acc.name}</span>
                        <span className={`rounded-lg font-bold bg-slate-100 text-slate-800 ${
                          fontSize === 'xlarge' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[10px]'
                        }`}>
                          {acc.type}
                        </span>
                      </div>
                      <div className={`text-slate-600 font-medium ${
                        fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-[11px]'
                      }`}>
                        Saldo Awal: {rupiah(acc.initialBalance)}
                      </div>
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className={`font-bold text-slate-700 ${
                          fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-[11px]'
                        }`}>Saldo Saat Ini:</span>
                        <span className={`font-mono font-black ${
                          fontSize === 'xlarge' ? 'text-xl sm:text-2xl' : fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                        } ${isMinus ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {rupiah(bal)}
                        </span>
                      </div>
                      {!effectiveReadOnly && !hasTx && accounts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(acc)}
                          className={`text-rose-600 font-bold hover:underline pt-1 block cursor-pointer ${
                            fontSize === 'xlarge' ? 'text-xs' : 'text-[10px]'
                          }`}
                        >
                          Hapus Akun
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: LABA RUGI & REKAP */}
          {activeTab === 'labarugi' && (
            <div className="space-y-4">
              <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm space-y-5 max-w-2xl mx-auto ${
                fontSize === 'xlarge' ? 'p-6 sm:p-8' : fontSize === 'large' ? 'p-5 sm:p-7' : 'p-5'
              }`}>
                <div className="border-b border-slate-200 pb-3.5 text-center">
                  <h4 className={`font-black text-[#001c3c] tracking-tight ${
                    fontSize === 'xlarge' ? 'text-xl sm:text-2xl' : fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base'
                  }`}>
                    LAPORAN LABA RUGI SEDERHANA
                  </h4>
                  <p className={`text-slate-600 font-medium mt-1 ${
                    fontSize === 'xlarge' ? 'text-sm sm:text-base' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                  }`}>
                    {namaUsaha} &middot; Periode:{' '}
                    {selectedMonth !== 'all' ? MONTH_NAMES[Number(selectedMonth) - 1] : 'Seluruh Bulan'} {selectedYear}
                  </p>
                </div>

                {/* Seksi Pendapatan */}
                <div className="space-y-2.5">
                  <div className={`font-black uppercase tracking-wider text-emerald-900 border-b-2 border-emerald-200 pb-1.5 ${
                    fontSize === 'xlarge' ? 'text-sm sm:text-base' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                  }`}>
                    Pendapatan (Revenue)
                  </div>
                  {categories.income.map((cat) => {
                    const totalCat = filteredTransactions
                      .filter(t => t.type === 'income' && t.category === cat)
                      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
                    if (totalCat === 0) return null;
                    return (
                      <div key={cat} className={`flex items-center justify-between py-1.5 ${
                        fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs'
                      }`}>
                        <span className="text-slate-800 font-semibold">{cat}</span>
                        <span className="font-mono font-bold text-slate-950">{rupiah(totalCat)}</span>
                      </div>
                    );
                  })}
                  <div className={`flex items-center justify-between font-black pt-2 border-t-2 border-slate-200 text-emerald-950 ${
                    fontSize === 'xlarge' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                  }`}>
                    <span>Total Pendapatan</span>
                    <span className="font-mono">{rupiah(summary.income)}</span>
                  </div>
                </div>

                {/* Seksi Pengeluaran */}
                <div className="space-y-2.5 pt-2">
                  <div className={`font-black uppercase tracking-wider text-rose-900 border-b-2 border-rose-200 pb-1.5 ${
                    fontSize === 'xlarge' ? 'text-sm sm:text-base' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                  }`}>
                    Pengeluaran & Beban Usaha
                  </div>
                  {categories.expense.map((cat) => {
                    const totalCat = filteredTransactions
                      .filter(t => t.type === 'expense' && t.category === cat)
                      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
                    if (totalCat === 0) return null;
                    const pct = summary.expense > 0 ? ((totalCat / summary.expense) * 100).toFixed(1) : '0';
                    return (
                      <div key={cat} className={`flex items-center justify-between py-1.5 ${
                        fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs'
                      }`}>
                        <span className="text-slate-800 font-semibold">{cat} <span className={`text-slate-500 font-normal ${
                          fontSize === 'xlarge' ? 'text-xs' : 'text-[10px]'
                        }`}>({pct}%)</span></span>
                        <span className="font-mono font-bold text-slate-950">{rupiah(totalCat)}</span>
                      </div>
                    );
                  })}
                  <div className={`flex items-center justify-between font-black pt-2 border-t-2 border-slate-200 text-rose-950 ${
                    fontSize === 'xlarge' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                  }`}>
                    <span>Total Pengeluaran</span>
                    <span className="font-mono">{rupiah(summary.expense)}</span>
                  </div>
                </div>

                {/* Hasil Bersih */}
                <div className={`p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-black border-2 shadow-xs transition-all ${
                  fontSize === 'xlarge' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm'
                } ${
                  summary.net >= 0 ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}>
                  <span>{summary.net >= 0 ? '💎 LABA BERSIH (PROFIT)' : '⚠️ RUGI BERSIH (DEFISIT)'}</span>
                  <span className={`font-mono font-black ${
                    fontSize === 'xlarge' ? 'text-2xl sm:text-3xl' : fontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                  }`}>{rupiah(Math.abs(summary.net))}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAJAK PP 23 (0,5%) */}
          {activeTab === 'pajak' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className={`bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 ${
                fontSize === 'xlarge' ? 'p-6 sm:p-8' : fontSize === 'large' ? 'p-5 sm:p-7' : 'p-5'
              }`}>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-black text-[#001c3c] ${
                      fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-sm'
                    }`}>
                      Estimasi PPh Final UMKM 0,5% (PP 23/2018)
                    </h4>
                    <p className={`text-slate-600 font-medium ${
                      fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-[11px]'
                    }`}>
                      Dihitung otomatis dari total omzet pendapatan yang tercatat di aplikasi.
                    </p>
                  </div>
                </div>

                <div className={`p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 ${
                  fontSize === 'xlarge' ? 'text-sm sm:text-base' : fontSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-bold">Omzet Usaha Periode Terpilih:</span>
                    <span className={`font-mono font-black text-slate-950 ${
                      fontSize === 'xlarge' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm'
                    }`}>{rupiah(summary.income)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-bold">Tarif Pajak Final UMKM:</span>
                    <span className={`font-black text-amber-800 ${
                      fontSize === 'xlarge' ? 'text-base' : 'text-sm'
                    }`}>0,50%</span>
                  </div>
                  <div className={`pt-3 border-t border-slate-200 flex items-center justify-between font-black text-[#001c3c] ${
                    fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-sm'
                  }`}>
                    <span>Estimasi Pajak Terutang:</span>
                    <span className={`font-mono font-black text-amber-700 ${
                      fontSize === 'xlarge' ? 'text-2xl sm:text-3xl' : fontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                    }`}>{rupiah(summary.pph)}</span>
                  </div>
                </div>

                <div className={`p-4 bg-blue-50/90 border border-blue-200 rounded-2xl flex items-start gap-3 text-blue-950 ${
                  fontSize === 'xlarge' ? 'text-xs sm:text-sm' : 'text-xs'
                }`}>
                  <Info className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">
                    Estimasi ini berlaku untuk pelaku UMKM dengan omzet di bawah Rp 4,8 Miliar per tahun sesuai PP 23 Tahun 2018. Ini adalah sarana edukasi kesadaran pajak, bukan pengganti konsultasi resmi dengan Kantor Pelayanan Pajak (KPP).
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 4. FOOTER RESMI UNTUNGIN */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 flex-shrink-0">
          <div>
            Data tersimpan otomatis &middot; Terisolasi khusus untuk <strong>{namaUsaha}</strong>
          </div>
          <div className="font-semibold text-slate-600">
            Untungin &middot; All Rights Reserved &middot; obeecreatives &middot; Developed by Lalu Mahendra
          </div>
        </div>
        </>
        )}

      </div>

      {/* 6. MODAL GANTI PIN BUKU KAS PESERTA */}
      {isChangePinModalOpen && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#001c3c]">
                    Ganti PIN Buku Kas
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {namaUsaha}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePinModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {changePinError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in">
                {changePinError}
              </div>
            )}

            <form onSubmit={handleChangePinSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  PIN Lama
                </label>
                <input
                  type={showPinInputFields ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={8}
                  required
                  placeholder="PIN saat ini (default: 123456)"
                  value={oldPinInput}
                  onChange={(e) => setOldPinInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  PIN Baru (4-8 Digit)
                </label>
                <input
                  type={showPinInputFields ? 'text' : 'password'}
                  maxLength={24}
                  required
                  placeholder="Masukkan PIN baru Anda..."
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Konfirmasi PIN Baru
                </label>
                <input
                  type={showPinInputFields ? 'text' : 'password'}
                  maxLength={24}
                  required
                  placeholder="Ulangi PIN baru Anda..."
                  value={confirmNewPinInput}
                  onChange={(e) => setConfirmNewPinInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPinInputFields}
                    onChange={(e) => setShowPinInputFields(e.target.checked)}
                    className="rounded text-purple-600"
                  />
                  <span>Tampilkan Karakter PIN</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePinModalOpen(false)}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Simpan PIN Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. CUSTOM MODAL KONFIRMASI DI TENGAH LAYAR (Pengganti dialog browser 'says') */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-1.5">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-black text-xs inline-flex items-center gap-1.5 shadow-2xs border border-purple-200">
                  <Wallet className="w-3.5 h-3.5 text-purple-700" />
                  <span>{confirmDialog.title}</span>
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#001c3c] mt-2 leading-snug">
                {confirmDialog.message}
              </h4>
              {confirmDialog.details && (
                <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
                  {confirmDialog.details}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                {confirmDialog.confirmLabel || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL INFORMASI LISENSI UNTUNGIN PRO */}
      {isPremiumModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
                  <Crown className="w-5 h-5 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-[#001c3c]">
                    Informasi Lisensi Untungin Pro
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Fitur Premium Buku Kas & Keuangan UMKM
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPremiumModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                hasProAccess
                  ? 'bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border-amber-200'
                  : isTrialActive
                  ? 'bg-gradient-to-r from-indigo-50 via-purple-50/50 to-indigo-50 border-indigo-200'
                  : 'bg-gradient-to-r from-slate-50 to-amber-50/50 border-slate-200'
              }`}>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Status Akses Kas
                  </span>
                  <span className="font-black text-[#001c3c] text-sm flex items-center gap-1.5 mt-0.5">
                    {hasProAccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>💎 Untungin Pro (Akses Penuh Aktif)</span>
                      </>
                    ) : isTrialActive ? (
                      <>
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>✨ Akses Trial Hybrid (Sedang Aktif)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-600" />
                        <span>🔒 Batas Trial Telah Berakhir</span>
                      </>
                    )}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-black text-[10px] shadow-2xs ${
                  hasProAccess
                    ? 'bg-amber-400 text-[#001c3c]'
                    : isTrialActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-300 text-slate-800'
                }`}>
                  {hasProAccess ? 'VIP PRO' : isTrialActive ? 'TRIAL 10 TX' : 'EXPIRED'}
                </span>
              </div>

              <div className="space-y-2 pt-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Unit Usaha:</span>
                  <span className="font-bold text-slate-800">{namaUsaha}</span>
                </div>

                {hasProAccess ? (
                  <>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Diberikan Oleh:</span>
                      <span className="font-bold text-slate-800">
                        {premiumStatus.grantedBy || (isDeveloperUser ? 'Lead Developer (Lifetime)' : 'Kurator PartnerUp')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Jalur Akses:</span>
                      <span className="font-bold text-[#004c80]">
                        {premiumStatus.method === 'kurator'
                          ? 'Rekomendasi Kurator (Lolos Seleksi)'
                          : premiumStatus.method === 'payment'
                          ? 'Aktivasi Lisensi / Pembayaran'
                          : 'Sistem VIP'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Waktu Aktivasi:</span>
                      <span className="font-mono text-slate-700">
                        {premiumStatus.unlockedAt ? new Date(premiumStatus.unlockedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Permanen'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Kuota Transaksi:</span>
                      <span className="font-bold text-[#001c3c]">
                        {premiumStatus.usedTransactions || 0} / 10 transaksi terpakai{' '}
                        <span className="text-indigo-600 font-extrabold">
                          ({premiumStatus.remainingTransactions || 0} sisa)
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Masa Berlaku Trial:</span>
                      <span className="font-bold text-[#001c3c]">
                        {premiumStatus.remainingDays || 0} hari tersisa (dari 7 hari total)
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Integritas Data:</span>
                      <span className="font-bold text-emerald-700">
                        ✅ {premiumStatus.usedTransactions || 0} transaksi tersimpan aman
                      </span>
                    </div>
                  </>
                )}
              </div>

              {!hasProAccess && (
                <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-[#001c3c] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upgrade ke Untungin Pro (Unlimited)</span>
                    </span>
                    <a
                      href={`https://wa.me/6285156557675?text=${encodeURIComponent(
                        `Halo Admin PartnerUp,\n\nSaya ingin membeli / aktivasi akses Premium Buku Kas Untungin untuk unit usaha kami:\n- Nama Usaha: ${namaUsaha}\n- Pemilik: ${namaPemilik || '-'}\n- WhatsApp: ${whatsapp || '-'}\n\nMohon informasi nilai pembayaran & nomor rekening resmi. Terima kasih!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Beli via WA</span>
                    </a>
                  </div>
                  <form onSubmit={handleActivateLicense} className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Masukkan kode lisensi resmi"
                      value={licenseCodeInput}
                      onChange={(e) => setLicenseCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 py-1.5 px-3 text-xs font-mono font-bold bg-white border border-amber-300 focus:border-amber-500 rounded-xl outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isActivatingLicense}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 font-black text-xs text-[#001c3c] rounded-xl cursor-pointer shadow-xs"
                    >
                      {isActivatingLicense ? '...' : 'Aktivasi'}
                    </button>
                  </form>
                  {licenseFeedback && (
                    <p className={`text-[10px] font-bold ${licenseFeedback.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {licenseFeedback.message}
                    </p>
                  )}
                </div>
              )}

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-900 leading-relaxed">
                <strong>Hak Istimewa Untungin Pro:</strong> Pencatatan transaksi tanpa batas, multi-akun kas (Tunai, Bank, QRIS), laba rugi otomatis, simulasi pajak UMKM 0,5%, serta sinkronisasi cloud Google Spreadsheet.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {(isCuratorUser || isDeveloperUser) && hasPremiumAccess && !isObeeCreatives && (
                <button
                  type="button"
                  onClick={() => {
                    handleRevokePro();
                    setIsPremiumModalOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer mr-auto border border-rose-200"
                >
                  Cabut Akses Pro
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsPremiumModalOpen(false)}
                className="px-5 py-2.5 bg-[#001c3c] hover:bg-[#002f5e] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
