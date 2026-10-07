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
  Info
} from 'lucide-react';
import {
  kasService,
  KasAccount,
  KasTransaction,
  KasCategories,
  REF_INCOME_CATEGORIES,
  REF_EXPENSE_CATEGORIES,
  TARIF_PPH_FINAL_UMKM,
  BATAS_OMZET_PP23
} from '../services/kasService';

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
  const isPrivileged = isObeeCreatives || viewerRole === 'developer' || viewerRole === 'peserta';
  const [isSimulasiMode, setIsSimulasiMode] = useState(false);
  const effectiveReadOnly = isPrivileged ? false : (readOnly && !isSimulasiMode);

  // Data Kas
  const [categories, setCategories] = useState<KasCategories>({ income: [], expense: [] });
  const [accounts, setAccounts] = useState<KasAccount[]>([]);
  const [transactions, setTransactions] = useState<KasTransaction[]>([]);

  // Filter Periode
  const currentYear = String(new Date().getFullYear());
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

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

  const showToast = (text: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
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
    if (confirm(`Hapus transaksi ${t.type.toUpperCase()} sebesar ${rupiah(t.amount)}?`)) {
      kasService.deleteTransaction(namaUsaha, t.id);
      showToast('Transaksi dihapus.', 'warning');
      loadData();
    }
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
        <div className="bg-gradient-to-r from-[#001c3c] via-[#002f5e] to-[#004c80] p-4 sm:p-5 text-white flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-[#001c3c] shadow-md flex-shrink-0">
              <Wallet className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight">
                  Untungin &middot; Buku Kas & Keuangan UMKM
                </h3>
                {effectiveReadOnly ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-amber-300 text-[10px] font-bold">
                      Mode Pantau Kurator (Read-Only)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSimulasiMode(true)}
                      className="px-2 py-0.5 rounded-full bg-amber-400 text-[#001c3c] hover:bg-amber-300 text-[10px] font-extrabold transition-all cursor-pointer shadow-xs"
                      title="Klik untuk membuka formulir input data transaksi"
                    >
                      ✏️ Aktifkan Input / Simulasi
                    </button>
                  </div>
                ) : isObeeCreatives ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">
                    🚀 Akun Resmi obeecreatives (Akses Penuh Input & Edit)
                  </span>
                ) : isSimulasiMode ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-400/40 text-[10px] font-bold">
                      Mode Simulasi Aktif
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSimulasiMode(false)}
                      className="text-[10px] text-slate-300 hover:text-white underline cursor-pointer"
                    >
                      Kunci Read-Only
                    </button>
                  </div>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[10px] font-bold">
                    Akses Input Penuh
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span>{namaUsaha}</span>
                {namaPemilik && <span>&middot; {namaPemilik}</span>}
                {whatsapp && <span>&middot; {whatsapp}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHideAmount(!hideAmount)}
              title={hideAmount ? 'Tampilkan Nominal' : 'Sembunyikan Nominal (Mode Privasi)'}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              {hideAmount ? <EyeOff className="w-4 h-4 text-amber-300" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. SUB-NAVBAR TAB */}
        <div className="bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
          <div className="flex items-center gap-1 py-2">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#001c3c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#001c3c] hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter Bulan & Tahun */}
          <div className="flex items-center gap-1.5 py-1.5 text-xs">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">Semua Bulan</option>
              {MONTH_NAMES.map((m, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 text-xs focus:outline-none"
            >
              {[2025, 2026, 2027].map(y => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. KONTEN MODAL BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* TAB 1: BERANDA */}
          {activeTab === 'beranda' && (
            <div className="space-y-4">
              {/* Alert Saldo Minus */}
              {summary.minusAccounts.length > 0 && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <div>
                    <strong>Peringatan Saldo Minus:</strong> Saldo pada akun{' '}
                    {summary.minusAccounts.map(a => a.name).join(', ')} bernilai negatif. Periksa kembali pengeluaran kasir Anda.
                  </div>
                </div>
              )}

              {/* 4 Kartu Statistik Finansial */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Saldo Kas</span>
                  <div className="text-base sm:text-lg font-black text-[#001c3c] font-mono">
                    {rupiah(summary.totalSaldoSemua)}
                  </div>
                  <span className="text-[10px] text-slate-500 block">Dari {accounts.length} akun terdaftar</span>
                </div>

                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Pendapatan</span>
                  <div className="text-base sm:text-lg font-black text-emerald-900 font-mono">
                    {rupiah(summary.income)}
                  </div>
                  <span className="text-[10px] text-emerald-700 block">Omzet penjualan</span>
                </div>

                <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-800 block">Total Pengeluaran</span>
                  <div className="text-base sm:text-lg font-black text-rose-900 font-mono">
                    {rupiah(summary.expense)}
                  </div>
                  <span className="text-[10px] text-rose-700 block">Bahan & operasional</span>
                </div>

                <div className={`p-3.5 rounded-2xl border shadow-xs space-y-1 ${
                  summary.net >= 0 ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}>
                  <span className="text-[10px] uppercase font-bold block">
                    {summary.net >= 0 ? 'Laba Bersih' : 'Rugi Bersih'}
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono">
                    {rupiah(Math.abs(summary.net))}
                  </div>
                  <span className="text-[10px] block opacity-80">
                    Margin: {summary.income > 0 ? ((summary.net / summary.income) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
              </div>

              {/* Rincian Akun Kas Terdaftar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#001c3c] flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-blue-600" />
                    <span>Posisi Saldo Akun Usaha</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('akun')}
                    className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    Kelola Akun &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {accounts.map((acc) => {
                    const bal = kasService.calculateAccountBalance(acc, transactions);
                    const isMinus = bal < 0;
                    return (
                      <div key={acc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-800">{acc.name}</div>
                          <span className="text-[10px] text-slate-500 uppercase">{acc.type}</span>
                        </div>
                        <div className={`font-mono text-xs font-bold ${isMinus ? 'text-rose-600' : 'text-slate-900'}`}>
                          {rupiah(bal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5 Transaksi Terakhir */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#001c3c] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Transaksi Terkini</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('transaksi')}
                    className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    Buka Riwayat Lengkap &rarr;
                  </button>
                </div>
                {transactions.slice(0, 5).length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs italic">
                    Belum ada transaksi tercatat. Mulai catat pemasukan dan pengeluaran Anda.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {transactions.slice(0, 5).map((t) => (
                      <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            <span>{t.desc || t.category || 'Transfer Saldo'}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              t.type === 'income' ? 'bg-emerald-100 text-emerald-800' : t.type === 'expense' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {t.type === 'income' ? 'Masuk' : t.type === 'expense' ? 'Keluar' : 'Transfer'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {t.date} &middot; {t.category || 'Transfer'}
                          </div>
                        </div>
                        <div className={`font-mono font-black ${
                          t.type === 'income' ? 'text-emerald-700' : t.type === 'expense' ? 'text-rose-700' : 'text-slate-700'
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
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Mode Pantau Kurator (Read-Only) aktif. Anda dapat meninjau buku kas dan mengekspor CSV.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSimulasiMode(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#001c3c] font-black text-xs transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    ✏️ Buka Formulir Input
                  </button>
                </div>
              )}

              {!effectiveReadOnly && (
                <form onSubmit={handleSaveTransaction} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#001c3c]">
                      {editingTxId ? '✏️ Edit Transaksi' : '➕ Tambah Transaksi Kas'}
                    </h4>
                    {editingTxId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTxId(null);
                          setTxAmount('');
                          setTxDesc('');
                        }}
                        className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Tanggal Transaksi</label>
                      <input
                        type="date"
                        value={txDate}
                        onChange={(e) => setTxDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Jenis Transaksi</label>
                      <select
                        value={txType}
                        onChange={(e) => {
                          const t = e.target.value as any;
                          setTxType(t);
                          if (t === 'income' && categories.income.length) setTxCategory(categories.income[0]);
                          if (t === 'expense' && categories.expense.length) setTxCategory(categories.expense[0]);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-amber-400"
                      >
                        <option value="income">🟢 Pendapatan (Kas Masuk)</option>
                        <option value="expense">🔴 Pengeluaran (Kas Keluar)</option>
                        <option value="transfer">🔄 Transfer Antar Akun</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {txType === 'transfer' ? 'Dari Akun' : 'Akun Kas / Bank'}
                      </label>
                      <select
                        value={txAccountId}
                        onChange={(e) => setTxAccountId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400"
                        required
                      >
                        {accounts.map(a => (
                          <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                        ))}
                      </select>
                    </div>

                    {txType === 'transfer' ? (
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Ke Akun Tujuan</label>
                        <select
                          value={txToAccountId}
                          onChange={(e) => setTxToAccountId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400"
                          required
                        >
                          {accounts.map(a => (
                            <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Kategori</label>
                        <select
                          value={txCategory}
                          onChange={(e) => setTxCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400"
                          required
                        >
                          {(txType === 'income' ? categories.income : categories.expense).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Keterangan / Catatan Singkat</label>
                      <input
                        type="text"
                        value={txDesc}
                        onChange={(e) => setTxDesc(e.target.value)}
                        placeholder="Contoh: Pembayaran pesanan kopi drip bag via QRIS"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="flex-1 max-w-sm">
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Nominal (Rp)</label>
                        <input
                          type="number"
                          min="0"
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold font-mono focus:ring-2 focus:ring-amber-400"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="self-end px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#001c3c] to-[#003366] hover:from-[#002855] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                      >
                        {editingTxId ? 'Simpan Perubahan' : 'Simpan Transaksi'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tabel Riwayat Transaksi */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
                  <div className="font-bold text-xs text-[#001c3c]">
                    Riwayat Transaksi ({filteredTransactions.length} Data)
                  </div>
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor CSV / Excel</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3">Tanggal</th>
                        <th className="p-3">Jenis</th>
                        <th className="p-3">Akun</th>
                        <th className="p-3">Kategori & Keterangan</th>
                        <th className="p-3 text-right">Nominal</th>
                        {!effectiveReadOnly && <th className="p-3 text-center">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={effectiveReadOnly ? 5 : 6} className="p-8 text-center text-slate-400 italic">
                            Tidak ada transaksi yang cocok pada filter periode ini.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((t) => {
                          const acc = accounts.find(a => a.id === t.accountId);
                          const toAcc = t.toAccountId ? accounts.find(a => a.id === t.toAccountId) : null;
                          return (
                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                {t.date}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  t.type === 'income' ? 'bg-emerald-100 text-emerald-800' : t.type === 'expense' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {t.type === 'income' ? 'Pendapatan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-700 whitespace-nowrap">
                                {t.type === 'transfer' ? (
                                  <span>{acc?.name || '—'} &rarr; {toAcc?.name || '—'}</span>
                                ) : (
                                  <span>{acc?.name || '—'}</span>
                                )}
                              </td>
                              <td className="p-3 max-w-xs">
                                <div className="font-bold text-slate-800">{t.category || 'Transfer Saldo'}</div>
                                {t.desc && <div className="text-[11px] text-slate-500 mt-0.5">{t.desc}</div>}
                              </td>
                              <td className={`p-3 text-right font-mono font-bold whitespace-nowrap ${
                                t.type === 'income' ? 'text-emerald-700' : t.type === 'expense' ? 'text-rose-700' : 'text-slate-700'
                              }`}>
                                {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''} {rupiah(t.amount)}
                              </td>
                              {!effectiveReadOnly && (
                                <td className="p-3 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(t)}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                      title="Edit Transaksi"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTx(t)}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                      title="Hapus Transaksi"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
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
                <form onSubmit={handleAddAccount} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <h4 className="font-bold text-xs text-[#001c3c]">Tambah Akun Kas / Bank Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <input
                      type="text"
                      placeholder="Nama akun (contoh: BCA Bisnis, Toko)"
                      value={newAccName}
                      onChange={(e) => setNewAccName(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400"
                      required
                    />
                    <select
                      value={newAccType}
                      onChange={(e) => setNewAccType(e.target.value as any)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400"
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
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#001c3c] hover:bg-[#002f5e] text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Tambah Akun
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {accounts.map((acc) => {
                  const bal = kasService.calculateAccountBalance(acc, transactions);
                  const isMinus = bal < 0;
                  const hasTx = transactions.some(t => t.accountId === acc.id || t.toAccountId === acc.id);
                  return (
                    <div key={acc.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-[#001c3c]">{acc.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {acc.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Saldo Awal: {rupiah(acc.initialBalance)}
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600">Saldo Saat Ini:</span>
                        <span className={`font-mono font-black text-sm ${isMinus ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {rupiah(bal)}
                        </span>
                      </div>
                      {!effectiveReadOnly && !hasTx && accounts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus akun ${acc.name}?`)) {
                              kasService.deleteAccount(namaUsaha, acc.id);
                              loadData();
                              showToast('Akun dihapus.', 'warning');
                            }
                          }}
                          className="text-[10px] text-rose-600 hover:underline pt-1 block"
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
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-2xl mx-auto">
                <div className="border-b border-slate-200 pb-3 text-center">
                  <h4 className="font-black text-base text-[#001c3c]">
                    LAPORAN LABA RUGI SEDERHANA
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {namaUsaha} &middot; Periode:{' '}
                    {selectedMonth !== 'all' ? MONTH_NAMES[Number(selectedMonth) - 1] : 'Seluruh Bulan'} {selectedYear}
                  </p>
                </div>

                {/* Seksi Pendapatan */}
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-emerald-100 pb-1">
                    Pendapatan (Revenue)
                  </div>
                  {categories.income.map((cat) => {
                    const totalCat = filteredTransactions
                      .filter(t => t.type === 'income' && t.category === cat)
                      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
                    if (totalCat === 0) return null;
                    return (
                      <div key={cat} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-700">{cat}</span>
                        <span className="font-mono text-slate-900">{rupiah(totalCat)}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between text-xs font-black pt-1 border-t border-slate-200 text-emerald-900">
                    <span>Total Pendapatan</span>
                    <span className="font-mono">{rupiah(summary.income)}</span>
                  </div>
                </div>

                {/* Seksi Pengeluaran */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-black uppercase tracking-wider text-rose-800 border-b border-rose-100 pb-1">
                    Pengeluaran & Beban Usaha
                  </div>
                  {categories.expense.map((cat) => {
                    const totalCat = filteredTransactions
                      .filter(t => t.type === 'expense' && t.category === cat)
                      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
                    if (totalCat === 0) return null;
                    const pct = summary.expense > 0 ? ((totalCat / summary.expense) * 100).toFixed(1) : '0';
                    return (
                      <div key={cat} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-700">{cat} <span className="text-[10px] text-slate-400">({pct}%)</span></span>
                        <span className="font-mono text-slate-900">{rupiah(totalCat)}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between text-xs font-black pt-1 border-t border-slate-200 text-rose-900">
                    <span>Total Pengeluaran</span>
                    <span className="font-mono">{rupiah(summary.expense)}</span>
                  </div>
                </div>

                {/* Hasil Bersih */}
                <div className={`p-4 rounded-xl flex items-center justify-between font-black text-sm border ${
                  summary.net >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <span>{summary.net >= 0 ? '💎 LABA BERSIH (PROFIT)' : '⚠️ RUGI BERSIH (DEFISIT)'}</span>
                  <span className="font-mono text-base">{rupiah(Math.abs(summary.net))}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAJAK PP 23 (0,5%) */}
          {activeTab === 'pajak' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#001c3c]">
                      Estimasi PPh Final UMKM 0,5% (PP 23/2018)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Dihitung otomatis dari total omzet pendapatan yang tercatat di aplikasi.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Omzet Usaha Periode Terpilih:</span>
                    <span className="font-mono font-bold text-slate-900">{rupiah(summary.income)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Tarif Pajak Final UMKM:</span>
                    <span className="font-bold text-amber-800">0,50%</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-black text-sm text-[#001c3c]">
                    <span>Estimasi Pajak Terutang:</span>
                    <span className="font-mono text-base text-amber-700">{rupiah(summary.pph)}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-[11px] text-blue-900">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
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

      </div>
    </div>
  );
};
