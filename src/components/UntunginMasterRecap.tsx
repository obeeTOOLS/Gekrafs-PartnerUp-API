import React, { useState, useEffect, useMemo } from 'react';
import { 
  PesertaItem 
} from '../types';
import { 
  kasService, 
  KasMasterRecapSummary, 
  UmkmKasRecapItem,
  KasTransaction
} from '../services/kasService';
import { 
  Wallet, 
  TrendingUp, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Sparkles, 
  Building2, 
  User, 
  Phone, 
  Layers, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  FileSpreadsheet, 
  PieChart, 
  ShieldCheck, 
  Award,
  X
} from 'lucide-react';

interface UntunginMasterRecapProps {
  pesertaList: PesertaItem[];
  onOpenKas: (peserta: PesertaItem) => void;
}

export const UntunginMasterRecap: React.FC<UntunginMasterRecapProps> = ({
  pesertaList,
  onOpenKas
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [recapData, setRecapData] = useState<KasMasterRecapSummary | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubsektor, setSelectedSubsektor] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [financialFilter, setFinancialFilter] = useState<'all' | 'profitable' | 'deficit'>('all');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'pro' | 'trial'>('all');
  const [sortBy, setSortBy] = useState<'omzet' | 'profit' | 'txCount' | 'latest' | 'name'>('omzet');
  const [showAnalytics, setShowAnalytics] = useState<boolean>(true);
  const [selectedInspectItem, setSelectedInspectItem] = useState<UmkmKasRecapItem | null>(null);

  // Load data dari cloud spreadsheet (Kas_Transaksi)
  const loadRecapData = async (isSilent: boolean = false) => {
    if (!isSilent) setLoading(true);
    try {
      const summary = await kasService.generateMasterRecap(pesertaList);
      setRecapData(summary);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('[UntunginMasterRecap] Error loading recap data:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadRecapData();

    // Listen to local kas updates if user creates/edits transactions
    const handleKasUpdate = () => {
      loadRecapData(true);
    };
    window.addEventListener('gkf-kas-updated', handleKasUpdate);
    window.addEventListener('gkf-kas-premium-updated', handleKasUpdate);
    return () => {
      window.removeEventListener('gkf-kas-updated', handleKasUpdate);
      window.removeEventListener('gkf-kas-premium-updated', handleKasUpdate);
    };
  }, [pesertaList]);

  // Daftar subsektor unik
  const subsektorOptions = useMemo(() => {
    if (!recapData) return [];
    const set = new Set<string>();
    recapData.items.forEach(it => {
      if (it.subsektor) set.add(it.subsektor);
    });
    return Array.from(set).sort();
  }, [recapData]);

  // Filter & Urutkan Data
  const filteredItems = useMemo(() => {
    if (!recapData) return [];

    let list = recapData.items.filter(it => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = it.namaUsaha.toLowerCase().includes(q);
        const matchOwner = (it.namaPemilik || '').toLowerCase().includes(q);
        const matchSector = (it.subsektor || '').toLowerCase().includes(q);
        if (!matchName && !matchOwner && !matchSector) return false;
      }

      // 2. Subsektor
      if (selectedSubsektor !== 'all' && it.subsektor !== selectedSubsektor) {
        return false;
      }

      // 3. Activity (Aktif vs Belum Ada Catatan)
      if (activityFilter === 'active' && !it.hasTransactions) return false;
      if (activityFilter === 'inactive' && it.hasTransactions) return false;

      // 4. Financial (Laba vs Rugi)
      if (financialFilter === 'profitable' && (!it.hasTransactions || it.netProfit <= 0)) return false;
      if (financialFilter === 'deficit' && (!it.hasTransactions || it.netProfit >= 0)) return false;

      // 5. License
      if (licenseFilter === 'pro' && !it.proStatus.isPremium) return false;
      if (licenseFilter === 'trial' && it.proStatus.isPremium) return false;

      return true;
    });

    // Urutkan
    list.sort((a, b) => {
      if (sortBy === 'omzet') {
        if (b.totalIncome !== a.totalIncome) return b.totalIncome - a.totalIncome;
        return b.txCount - a.txCount;
      }
      if (sortBy === 'profit') {
        if (b.netProfit !== a.netProfit) return b.netProfit - a.netProfit;
        return b.totalIncome - a.totalIncome;
      }
      if (sortBy === 'txCount') {
        if (b.txCount !== a.txCount) return b.txCount - a.txCount;
        return b.totalIncome - a.totalIncome;
      }
      if (sortBy === 'latest') {
        const dateA = a.lastTxDate || '';
        const dateB = b.lastTxDate || '';
        if (dateB !== dateA) return dateB.localeCompare(dateA);
        return b.totalIncome - a.totalIncome;
      }
      if (sortBy === 'name') {
        return a.namaUsaha.localeCompare(b.namaUsaha);
      }
      return 0;
    });

    return list;
  }, [recapData, searchQuery, selectedSubsektor, activityFilter, financialFilter, licenseFilter, sortBy]);

  // Export CSV Handler
  const handleExportCsv = () => {
    if (!recapData || filteredItems.length === 0) return;

    const headers = [
      'No',
      'Nama Usaha',
      'Nama Pemilik',
      'Subsektor Ekraf',
      'Nomor WhatsApp',
      'Sesi Pelatihan',
      'Status Lisensi',
      'Total Pemasukan / Omzet (Rp)',
      'Total Pengeluaran / Beban (Rp)',
      'Laba / Rugi Bersih (Rp)',
      'Margin Keuntungan (%)',
      'Jumlah Transaksi Kas',
      'Tanggal Terakhir Mencatat',
      'Status Kesehatan Finansial'
    ];

    const rows = filteredItems.map((item, index) => [
      index + 1,
      `"${(item.namaUsaha || '').replace(/"/g, '""')}"`,
      `"${(item.namaPemilik || '-').replace(/"/g, '""')}"`,
      `"${(item.subsektor || '-').replace(/"/g, '""')}"`,
      `"${(item.whatsapp || '-').replace(/"/g, '""')}"`,
      `"${(item.sesi || '-').replace(/"/g, '""')}"`,
      item.proStatus.isPremium ? 'Untungin Pro' : 'Free / Trial',
      item.totalIncome,
      item.totalExpense,
      item.netProfit,
      item.profitMargin.toFixed(1) + '%',
      item.txCount,
      item.lastTxDate || '-',
      item.healthStatus
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const timestampStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Rekap_Keuangan_Untungin_PartnerUp_${timestampStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + (Math.round(val) || 0).toLocaleString('id-ID');
  };

  const getHealthBadge = (status: UmkmKasRecapItem['healthStatus']) => {
    switch (status) {
      case 'Sehat (Laba Tinggi)':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">🌟 Sehat (Laba &gt;25%)</span>;
      case 'Stabil (Laba Menengah)':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-300">✅ Stabil (10-25%)</span>;
      case 'Tipis (Laba Rendah)':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-300">⚠️ Margin Tipis (&lt;10%)</span>;
      case 'Impas':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">⚖️ Impas (0%)</span>;
      case 'Defisit (Rugi)':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">🚨 Defisit / Rugi</span>;
      case 'Belum Ada Transaksi':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">💤 Belum Ada Transaksi</span>;
    }
  };

  const getSubsektorColor = (sec: string) => {
    const s = (sec || '').toLowerCase();
    if (s.includes('kuliner')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (s.includes('fashion')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (s.includes('kriya')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s.includes('desain') || s.includes('grafis')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s.includes('foto') || s.includes('film')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER HEADER */}
      <div className="bg-gradient-to-br from-[#001c3c] via-[#002d5f] to-[#00428a] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 -mb-16 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modul Pengawas Keuangan Terpadu &middot; Untungin v1.3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Wallet className="w-7 h-7 text-amber-400 shrink-0" />
              <span>Rekapitulasi Keuangan Seluruh Pengguna Untungin</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Monitoring omzet kumulatif, perputaran kas, laba/rugi, dan tingkat kepatuhan pembukuan seluruh pelaku UMKM binaan Gekrafs Kota Batu. Data ditarik live dari tab <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-amber-300 text-xs">Kas_Transaksi</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => loadRecapData(false)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all border border-white/20 shadow-sm cursor-pointer disabled:opacity-50"
              title="Perbarui data dari live Google Spreadsheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-300' : ''}`} />
              <span>{loading ? 'Memuat Data...' : 'Sinkronkan Live'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              disabled={filteredItems.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer disabled:opacity-50"
              title="Unduh seluruh rekapitulasi ke format Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV Rekap</span>
            </button>
          </div>
        </div>

        {lastSyncTime && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tersinkronisasi otomatis dengan Google Spreadsheet tab <strong>Kas_Transaksi</strong></span>
            </div>
            <span>Pukul {lastSyncTime} WIB</span>
          </div>
        )}
      </div>

      {/* 2. EXECUTIVE MACRO STATS (CARDS) */}
      {recapData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Omzet Binaan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Omzet Gabungan</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {formatRupiah(recapData.totalOmzetGlobal)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Dari {recapData.activeUmkmCount} UMKM yang aktif mencatat pemasukan
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Total Transaksi Kas:</span>
              <span className="font-bold text-slate-800">{recapData.totalTransactionsGlobal} tx</span>
            </div>
          </div>

          {/* Card 2: Total Biaya & Beban Operasional */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Beban Operasional</span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {formatRupiah(recapData.totalExpenseGlobal)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Bahan baku, gaji, sewa, listrik & overhead
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Rasio Beban thd Omzet:</span>
              <span className="font-bold text-amber-700">
                {recapData.totalOmzetGlobal > 0 
                  ? ((recapData.totalExpenseGlobal / recapData.totalOmzetGlobal) * 100).toFixed(1) + '%'
                  : '0%'}
              </span>
            </div>
          </div>

          {/* Card 3: Laba Bersih Kumulatif */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Laba Bersih Kumulatif</span>
              <div className={`p-2.5 rounded-xl ${recapData.totalNetProfitGlobal >= 0 ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600'} group-hover:scale-110 transition-transform`}>
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className={`text-2xl font-black tracking-tight ${recapData.totalNetProfitGlobal >= 0 ? 'text-teal-700' : 'text-rose-600'}`}>
                {formatRupiah(recapData.totalNetProfitGlobal)}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${
                  recapData.averageMarginGlobal >= 20 ? 'bg-emerald-100 text-emerald-800' :
                  recapData.averageMarginGlobal > 0 ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  Margin {recapData.averageMarginGlobal.toFixed(1)}%
                </span>
                <span className="text-[11px] text-slate-500">rata-rata portfolio</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Unit Laba vs Rugi:</span>
              <span className="font-bold text-slate-800">
                <span className="text-emerald-700">{recapData.profitableCount} untung</span> &middot; <span className="text-rose-700">{recapData.deficitCount} rugi</span>
              </span>
            </div>
          </div>

          {/* Card 4: Kepatuhan Pembukuan & Lisensi Pro */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kepatuhan Pembukuan</span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {recapData.activeUmkmCount} <span className="text-sm font-semibold text-slate-400">/ {recapData.totalUmkmCount} Usaha</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${recapData.totalUmkmCount > 0 ? (recapData.activeUmkmCount / recapData.totalUmkmCount) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Untungin Pro Aktif:</span>
              <span className="font-extrabold text-purple-700 flex items-center gap-1">
                <span>💎 {recapData.proCount} Unit Usaha</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. VISUAL ANALYTICS TOGGLE & ACCORDION (SUBSECTOR & TOP LEADERBOARD) */}
      {recapData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors cursor-pointer border-b border-slate-200/80 text-left"
          >
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#001c3c]" />
              <span className="text-sm font-bold text-[#001c3c]">
                Analisis Distribusi Omzet Subsektor & 5 Besar Penghasil Omzet Tertinggi
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span>{showAnalytics ? 'Sembunyikan' : 'Buka Grafik Analisis'}</span>
              {showAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showAnalytics && (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white">
              {/* Kolom Kiri: Breakdown Subsektor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                    Perputaran Omzet per Subsektor Kreatif
                  </h3>
                  <span className="text-xs text-slate-400">Total {recapData.sectorBreakdown.length} Sektor</span>
                </div>
                <div className="space-y-3">
                  {recapData.sectorBreakdown.map((sec, idx) => {
                    const percent = recapData.totalOmzetGlobal > 0 
                      ? (sec.totalOmzet / recapData.totalOmzetGlobal) * 100 
                      : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            {sec.subsektor}
                            <span className="text-[11px] font-normal text-slate-400">({sec.activeCount}/{sec.count} aktif)</span>
                          </span>
                          <span className="font-extrabold text-slate-900">
                            {formatRupiah(sec.totalOmzet)} <span className="text-slate-400 font-normal">({percent.toFixed(1)}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(percent, 2))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kolom Kanan: Top 5 Omzet Binaan Leaderboard */}
              <div className="space-y-4 lg:border-l lg:border-slate-100 lg:pl-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                    Top 5 Kontributor Omzet Tertinggi
                  </h3>
                  <span className="text-xs text-amber-600 font-bold">🏆 Leaderboard Finansial</span>
                </div>
                {recapData.topIncomeUmkms.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    Belum ada transaksi omzet yang tercatat di sistem.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {recapData.topIncomeUmkms.map((umkm, idx) => {
                      const matchedPeserta = pesertaList.find(p => p.namaUsaha.toLowerCase().trim() === umkm.namaUsaha.toLowerCase().trim());
                      return (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/60"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                              idx === 0 ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300' :
                              idx === 1 ? 'bg-slate-300 text-slate-800' :
                              idx === 2 ? 'bg-amber-600/30 text-amber-900' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {idx + 1}
                            </div>
                            <div>
                              <div className="text-xs font-black text-slate-800">{umkm.namaUsaha}</div>
                              <div className="text-[11px] text-slate-500">{umkm.subsektor} &middot; {umkm.txCount} transaksi</div>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <div className="text-xs font-black text-emerald-700">{formatRupiah(umkm.totalIncome)}</div>
                              <div className="text-[10px] text-slate-500 font-semibold">Laba: {formatRupiah(umkm.netProfit)}</div>
                            </div>
                            {matchedPeserta && (
                              <button
                                onClick={() => onOpenKas(matchedPeserta)}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-[#001c3c] hover:text-white transition-colors cursor-pointer text-slate-600"
                                title="Buka Buku Kas Unit Ini"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. FILTER BAR & CONTROLS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama usaha, nama pemilik, atau subsektor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#001c3c] focus:outline-none bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Badges / Counts */}
          <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
            <span>Menampilkan <strong>{filteredItems.length}</strong> dari {recapData?.items.length || 0} unit usaha</span>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100">
          {/* Subsektor */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subsektor</label>
            <select
              value={selectedSubsektor}
              onChange={(e) => setSelectedSubsektor(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/60 focus:ring-2 focus:ring-[#001c3c] focus:outline-none"
            >
              <option value="all">Semua Subsektor</option>
              {subsektorOptions.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Aktivitas Pencatatan */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Aktivitas</label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as any)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/60 focus:ring-2 focus:ring-[#001c3c] focus:outline-none"
            >
              <option value="all">Semua Aktivitas</option>
              <option value="active">Aktif Mencatat ({recapData?.activeUmkmCount || 0})</option>
              <option value="inactive">Belum Ada Catatan ({((recapData?.totalUmkmCount || 0) - (recapData?.activeUmkmCount || 0))})</option>
            </select>
          </div>

          {/* Kondisi Keuangan */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kondisi Keuangan</label>
            <select
              value={financialFilter}
              onChange={(e) => setFinancialFilter(e.target.value as any)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/60 focus:ring-2 focus:ring-[#001c3c] focus:outline-none"
            >
              <option value="all">Semua Kondisi</option>
              <option value="profitable">Laba Positif / Untung</option>
              <option value="deficit">Defisit / Rugi</option>
            </select>
          </div>

          {/* Lisensi Untungin */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lisensi Untungin</label>
            <select
              value={licenseFilter}
              onChange={(e) => setLicenseFilter(e.target.value as any)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/60 focus:ring-2 focus:ring-[#001c3c] focus:outline-none"
            >
              <option value="all">Semua Lisensi</option>
              <option value="pro">Untungin Pro (💎)</option>
              <option value="trial">Free / Trial (⏱️)</option>
            </select>
          </div>

          {/* Urutkan */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Urutkan Berdasarkan</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#001c3c] bg-slate-50/60 focus:ring-2 focus:ring-[#001c3c] focus:outline-none"
            >
              <option value="omzet">Omzet Tertinggi</option>
              <option value="profit">Laba Bersih Tertinggi</option>
              <option value="txCount">Transaksi Terbanyak</option>
              <option value="latest">Tanggal Terakhir Catat</option>
              <option value="name">Nama Usaha (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. TABEL MASTER REKAPITULASI KEHALUSAN & DETAIL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#001c3c] text-white font-extrabold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Usaha & Pemilik</th>
                <th className="py-3.5 px-4">Subsektor</th>
                <th className="py-3.5 px-4 text-center">Lisensi</th>
                <th className="py-3.5 px-4 text-right">Pemasukan (Omzet)</th>
                <th className="py-3.5 px-4 text-right">Pengeluaran</th>
                <th className="py-3.5 px-4 text-right">Laba / Rugi</th>
                <th className="py-3.5 px-4 text-center">Margin</th>
                <th className="py-3.5 px-4 text-center">Aktivitas</th>
                <th className="py-3.5 px-4 text-center">Status Kesehatan</th>
                <th className="py-3.5 px-4 text-center">Aksi Kurator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="font-bold text-slate-700">Menghubungkan ke Google Spreadsheet Tab Kas_Transaksi...</p>
                    <p className="text-xs text-slate-400 mt-1">Mengagregasi data keuangan live seluruh pelaku usaha</p>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">Tidak ada data unit usaha yang sesuai filter</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const matchedPeserta = pesertaList.find(p => p.namaUsaha.toLowerCase().trim() === item.namaUsaha.toLowerCase().trim());
                  const hasTx = item.hasTransactions;

                  return (
                    <tr 
                      key={idx} 
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* No */}
                      <td className="py-3.5 px-4 text-center text-slate-400 font-bold text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Usaha & Pemilik */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 group-hover:text-blue-900 text-xs flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.namaUsaha}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {item.namaPemilik || '-'}
                          </span>
                          {item.whatsapp && item.whatsapp !== '-' && (
                            <a
                              href={`https://wa.me/${item.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline flex items-center gap-0.5 text-[10px]"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              WA
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Subsektor */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSubsektorColor(item.subsektor || '')}`}>
                          {item.subsektor}
                        </span>
                      </td>

                      {/* Lisensi Untungin */}
                      <td className="py-3.5 px-4 text-center">
                        {item.proStatus.isPremium ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200" title="Untungin Pro Aktif">
                            <span>💎 Pro</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200" title="Trial / Free">
                            <span>⏱️ Trial</span>
                          </span>
                        )}
                      </td>

                      {/* Pemasukan (Omzet) */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-black ${hasTx && item.totalIncome > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {formatRupiah(item.totalIncome)}
                        </span>
                        {item.incomeCount > 0 && (
                          <div className="text-[10px] text-slate-400">{item.incomeCount} kali masuk</div>
                        )}
                      </td>

                      {/* Pengeluaran */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-semibold ${hasTx && item.totalExpense > 0 ? 'text-amber-800' : 'text-slate-400'}`}>
                          {formatRupiah(item.totalExpense)}
                        </span>
                        {item.expenseCount > 0 && (
                          <div className="text-[10px] text-slate-400">{item.expenseCount} kali keluar</div>
                        )}
                      </td>

                      {/* Laba/Rugi */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-black ${
                          !hasTx ? 'text-slate-400' :
                          item.netProfit > 0 ? 'text-teal-700' :
                          item.netProfit < 0 ? 'text-rose-600' : 'text-slate-600'
                        }`}>
                          {formatRupiah(item.netProfit)}
                        </span>
                      </td>

                      {/* Margin */}
                      <td className="py-3.5 px-4 text-center font-bold">
                        {!hasTx || item.totalIncome === 0 ? (
                          <span className="text-slate-300">-</span>
                        ) : (
                          <span className={`text-[11px] ${
                            item.profitMargin >= 20 ? 'text-emerald-700 font-black' :
                            item.profitMargin > 0 ? 'text-teal-700 font-bold' : 'text-rose-600 font-black'
                          }`}>
                            {item.profitMargin.toFixed(1)}%
                          </span>
                        )}
                      </td>

                      {/* Aktivitas */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-extrabold text-slate-700">
                          {item.txCount} tx
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{item.lastTxDate || 'Belum ada'}</span>
                        </div>
                      </td>

                      {/* Status Kesehatan */}
                      <td className="py-3.5 px-4 text-center">
                        {getHealthBadge(item.healthStatus)}
                      </td>

                      {/* Aksi Kurator */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {matchedPeserta ? (
                            <button
                              type="button"
                              onClick={() => onOpenKas(matchedPeserta)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#001c3c] hover:bg-blue-900 active:scale-95 text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                              title={`Buka Buku Kas & Laporan Lengkap ${item.namaUsaha}`}
                            >
                              <Wallet className="w-3 h-3 text-amber-300" />
                              <span>Buka Kas</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Tenant Eksternal</span>
                          )}

                          {item.transactions.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedInspectItem(item)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                              title="Lihat Mini Rincian Arus Kas"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        {recapData && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
            <div>
              Total Terdata: <strong>{recapData.totalUmkmCount} UMKM</strong> &middot;{' '}
              Aktif Mencatat: <strong className="text-emerald-700">{recapData.activeUmkmCount} Usaha</strong> &middot;{' '}
              Belum Ada Catatan: <strong className="text-slate-500">{recapData.totalUmkmCount - recapData.activeUmkmCount} Usaha</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Hak Akses: Kurator & Admin Program</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. MODAL INSPECT TRANSAKSI MINI */}
      {selectedInspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#001c3c] to-[#003366] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">Mini Audit &middot; Untungin</span>
                <h3 className="text-lg font-black">{selectedInspectItem.namaUsaha}</h3>
                <p className="text-xs text-slate-300">
                  Pemilik: {selectedInspectItem.namaPemilik || '-'} &middot; {selectedInspectItem.subsektor}
                </p>
              </div>
              <button
                onClick={() => setSelectedInspectItem(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Stat Ringkas Usaha Ini */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Omzet</div>
                  <div className="text-sm font-black text-emerald-900 mt-0.5">{formatRupiah(selectedInspectItem.totalIncome)}</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
                  <div className="text-[10px] font-bold text-amber-600 uppercase">Beban</div>
                  <div className="text-sm font-black text-amber-900 mt-0.5">{formatRupiah(selectedInspectItem.totalExpense)}</div>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 text-center">
                  <div className="text-[10px] font-bold text-teal-600 uppercase">Laba Bersih</div>
                  <div className="text-sm font-black text-teal-900 mt-0.5">{formatRupiah(selectedInspectItem.netProfit)}</div>
                </div>
              </div>

              {/* Rincian Transaksi Terakhir */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                    Daftar Transaksi Kas Terakhir ({selectedInspectItem.transactions.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">Sumber: Kas_Transaksi Cloud</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl max-h-60 overflow-y-auto">
                  {selectedInspectItem.transactions.map((t, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : t.type === 'expense' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                          <span>{t.category}</span>
                          {t.desc && <span className="text-slate-400 font-normal">({t.desc})</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">{t.date} &middot; oleh {t.createdBy || 'Peserta'}</div>
                      </div>
                      <div className={`font-black ${t.type === 'income' ? 'text-emerald-700' : t.type === 'expense' ? 'text-rose-700' : 'text-blue-700'}`}>
                        {t.type === 'expense' ? '-' : '+'}{formatRupiah(t.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedInspectItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Tutup
              </button>
              {(() => {
                const matched = pesertaList.find(p => p.namaUsaha.toLowerCase().trim() === selectedInspectItem.namaUsaha.toLowerCase().trim());
                if (!matched) return null;
                return (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInspectItem(null);
                      onOpenKas(matched);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#001c3c] text-white text-xs font-bold hover:bg-blue-900 transition-all cursor-pointer shadow-md"
                  >
                    <Wallet className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buka Buku Kas Lengkap</span>
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
