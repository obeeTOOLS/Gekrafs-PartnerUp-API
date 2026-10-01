import React, { useState, useMemo } from 'react';
import { PesertaItem, AsesmenItem, DashboardStats } from '../types';
import { BAGIAN_3_KATEGORI } from '../data/initialData';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Printer, 
  HelpCircle,
  FileSpreadsheet,
  Building2,
  Wallet,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface VisualAnalyticsDashboardProps {
  pesertaList: PesertaItem[];
  asesmenList: AsesmenItem[];
  stats: DashboardStats;
  currentSesi: string;
  availableSesiList: string[];
  onSesiChange: (sesi: string) => void;
}

// 8 Sumbu Radar beserta icon & singkatan
const RADAR_AXES: {
  fullName: string;
  shortName: string;
  icon: string;
  deskripsi: string;
  rekomendasiPelatihan: string;
}[] = [
  {
    fullName: 'Leadership (Kepemimpinan)',
    shortName: 'Leadership',
    icon: '👑',
    deskripsi: 'Visi usaha, pendelegasian tim, dan pengambilan keputusan berbasis data.',
    rekomendasiPelatihan: 'Modul Kepemimpinan UMKM & Manajemen Tim Kerja'
  },
  {
    fullName: 'Finance (Keuangan)',
    shortName: 'Finance',
    icon: '💰',
    deskripsi: 'Pemisahan uang pribadi vs usaha, pencatatan arus kas, dan penentuan margin harga.',
    rekomendasiPelatihan: 'Modul Manajemen Arus Kas, Buku Kas Digital & Pricing Strategy'
  },
  {
    fullName: 'Operation (Operasional)',
    shortName: 'Operation',
    icon: '⚙️',
    deskripsi: 'Standarisasi SOP kerja, legalitas NIB, dan ketahanan rantai pasok.',
    rekomendasiPelatihan: 'Modul Penyusunan SOP Praktis & Tata Kelola Operasional'
  },
  {
    fullName: 'Product (Produk/Jasa)',
    shortName: 'Product',
    icon: '📦',
    deskripsi: 'Keunikan nilai produk, kualitas bahan, daya saing pasar, dan retensi pelanggan.',
    rekomendasiPelatihan: 'Modul Product-Market Fit & Diferensiasi Nilai Produk Kreatif'
  },
  {
    fullName: 'Service (Layanan)',
    shortName: 'Service',
    icon: '🤝',
    deskripsi: 'Kepuasan konsumen, respons komplain pelanggan, dan layanan purna jual.',
    rekomendasiPelatihan: 'Modul Service Excellence & Retensi Loyalitas Konsumen'
  },
  {
    fullName: 'Sales (Penjualan)',
    shortName: 'Sales',
    icon: '🎯',
    deskripsi: 'Keterampilan closing transaksi, tindak lanjut calon pembeli, dan negosiasi.',
    rekomendasiPelatihan: 'Modul Teknik Closing Transaksi & Manajemen Prospek Konsumen'
  },
  {
    fullName: 'Marketing (Pemasaran)',
    shortName: 'Marketing',
    icon: '📣',
    deskripsi: 'Kehadiran digital di medsos/marketplace, daya ingat merek, dan variasi konten promosi.',
    rekomendasiPelatihan: 'Modul Konten Kreatif, Copywriting & Digital Advertising'
  },
  {
    fullName: 'Growth (Pertumbuhan)',
    shortName: 'Growth',
    icon: '🚀',
    deskripsi: 'Eksperimen inovasi baru, kesiapan ekspansi cabang/titik, dan strategi referral.',
    rekomendasiPelatihan: 'Modul Scale-Up Bisnis & Strategi Kolaborasi Kemitraan'
  }
];

export const VisualAnalyticsDashboard: React.FC<VisualAnalyticsDashboardProps> = ({
  pesertaList,
  asesmenList,
  stats,
  currentSesi,
  availableSesiList,
  onSesiChange
}) => {
  // Pilihan komparasi peserta perorangan pada Radar Chart
  const [selectedPesertaCompare, setSelectedPesertaCompare] = useState<string>('');
  const [activeRadarHover, setActiveRadarHover] = useState<number | null>(null);

  // 1. Hitung Rata-Rata Agregat 8 Pilar Bisnis Kota Batu dari Data Asesmen
  const aggregatedRadarScores = useMemo(() => {
    const totals: Record<string, { sum: number; count: number }> = {};
    RADAR_AXES.forEach((axis) => {
      totals[axis.fullName] = { sum: 0, count: 0 };
    });

    asesmenList.forEach((a) => {
      if (a.bagian3 && Array.isArray(a.bagian3)) {
        a.bagian3.forEach((b) => {
          if (totals[b.kategori] !== undefined && typeof b.skorRataRata === 'number') {
            totals[b.kategori].sum += b.skorRataRata;
            totals[b.kategori].count += 1;
          }
        });
      }
    });

    return RADAR_AXES.map((axis) => {
      const data = totals[axis.fullName];
      const avg = data && data.count > 0 ? Number((data.sum / data.count).toFixed(2)) : 3.0;
      return {
        ...axis,
        avgScore: avg,
        totalSample: data?.count || 0
      };
    });
  }, [asesmenList]);

  // 2. Data Peserta Komparasi Terpilih (jika ada)
  const comparePesertaData = useMemo(() => {
    if (!selectedPesertaCompare) return null;
    const found = asesmenList.find(
      (a) => a.namaUsaha.toLowerCase() === selectedPesertaCompare.toLowerCase()
    );
    if (!found || !found.bagian3) return null;

    const scoresMap: Record<string, number> = {};
    found.bagian3.forEach((b) => {
      scoresMap[b.kategori] = b.skorRataRata;
    });

    return {
      namaUsaha: found.namaUsaha,
      scores: RADAR_AXES.map((axis) => scoresMap[axis.fullName] ?? 3.0)
    };
  }, [selectedPesertaCompare, asesmenList]);

  // 3. Analisis Pilar Terkuat & Titik Kritis Perlu Intervensi
  const sortedPillars = useMemo(() => {
    return [...aggregatedRadarScores].sort((a, b) => b.avgScore - a.avgScore);
  }, [aggregatedRadarScores]);

  const strongestPillar = sortedPillars[0] || aggregatedRadarScores[0];
  const weakestPillar = sortedPillars[sortedPillars.length - 1] || aggregatedRadarScores[aggregatedRadarScores.length - 1];

  // Rata-rata keseluruhan skor ekosistem
  const overallAverageScore = useMemo(() => {
    if (aggregatedRadarScores.length === 0) return 0;
    const sum = aggregatedRadarScores.reduce((acc, curr) => acc + curr.avgScore, 0);
    return Number((sum / aggregatedRadarScores.length).toFixed(2));
  }, [aggregatedRadarScores]);

  // 4. Analisis Skala Omzet Bulanan
  const omzetDistribution = useMemo(() => {
    const buckets: Record<string, number> = {
      '< 5 Juta': 0,
      '5 - 15 Juta': 0,
      '15 - 50 Juta': 0,
      '> 50 Juta': 0,
      'Belum Dicatat': 0
    };

    pesertaList.forEach((p) => {
      const omzet = (p.omzet || '').toLowerCase();
      if (omzet.includes('< 5') || omzet.includes('kurang dari 5') || omzet.includes('dibawah 5') || omzet.includes('1 - 5') || omzet.includes('0 - 5')) {
        buckets['< 5 Juta'] += 1;
      } else if (omzet.includes('5 - 15') || omzet.includes('5-15') || omzet.includes('5 hingga 15') || omzet.includes('5jt - 15jt')) {
        buckets['5 - 15 Juta'] += 1;
      } else if (omzet.includes('15 - 50') || omzet.includes('15-50') || omzet.includes('15 hingga 50')) {
        buckets['15 - 50 Juta'] += 1;
      } else if (omzet.includes('> 50') || omzet.includes('lebih dari 50') || omzet.includes('diatas 50') || omzet.includes('>50') || omzet.includes('100')) {
        buckets['> 50 Juta'] += 1;
      } else if (omzet.trim()) {
        buckets['5 - 15 Juta'] += 1; // Fallback umum UMKM kreatif
      } else {
        buckets['Belum Dicatat'] += 1;
      }
    });

    const total = pesertaList.length || 1;
    return Object.entries(buckets).map(([label, count]) => ({
      label,
      count,
      percent: ((count / total) * 100).toFixed(1)
    }));
  }, [pesertaList]);

  // 5. Analisis Legalitas NIB
  const legalitasStats = useMemo(() => {
    let adaNib = 0;
    let belumNib = 0;
    pesertaList.forEach((p) => {
      const nib = (p.nib || '').trim();
      if (nib && nib !== '-' && nib.length > 5) {
        adaNib += 1;
      } else {
        belumNib += 1;
      }
    });
    const total = pesertaList.length || 1;
    return {
      adaNib,
      belumNib,
      persenAdaNib: ((adaNib / total) * 100).toFixed(1),
      persenBelumNib: ((belumNib / total) * 100).toFixed(1)
    };
  }, [pesertaList]);

  // 6. Perhitungan Koordinat SVG Radar Chart (Center: 200, 200, Radius Max: 130)
  const radarSvgData = useMemo(() => {
    const cx = 200;
    const cy = 200;
    const maxRadius = 125;
    const levels = [1, 2, 3, 4, 5];
    const totalAxes = RADAR_AXES.length;

    const getCoord = (axisIndex: number, score: number) => {
      const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / totalAxes;
      const radius = (Math.max(0.5, Math.min(5, score)) / 5) * maxRadius;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      };
    };

    // Label coordinates
    const labelCoords = RADAR_AXES.map((_, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / totalAxes;
      const radius = maxRadius + 32;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        angle
      };
    });

    // Level polygons
    const levelPolygons = levels.map((lvl) => {
      const points = RADAR_AXES.map((_, i) => {
        const c = getCoord(i, lvl);
        return `${c.x},${c.y}`;
      }).join(' ');
      return { lvl, points };
    });

    // Axis lines
    const axisLines = RADAR_AXES.map((_, i) => {
      const outer = getCoord(i, 5);
      return { x1: cx, y1: cy, x2: outer.x, y2: outer.y };
    });

    // Aggregate Polygon (Seluruh UMKM)
    const aggregatePoints = aggregatedRadarScores.map((item, i) => {
      const c = getCoord(i, item.avgScore);
      return { ...c, score: item.avgScore, axis: item.shortName };
    });
    const aggregatePointsStr = aggregatePoints.map((p) => `${p.x},${p.y}`).join(' ');

    // Compare Polygon (jika ada)
    let comparePoints: { x: number; y: number; score: number }[] = [];
    let comparePointsStr = '';
    if (comparePesertaData) {
      comparePoints = comparePesertaData.scores.map((s, i) => ({
        ...getCoord(i, s),
        score: s
      }));
      comparePointsStr = comparePoints.map((p) => `${p.x},${p.y}`).join(' ');
    }

    return {
      cx,
      cy,
      maxRadius,
      levelPolygons,
      axisLines,
      labelCoords,
      aggregatePoints,
      aggregatePointsStr,
      comparePoints,
      comparePointsStr
    };
  }, [aggregatedRadarScores, comparePesertaData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar Filter & Cetak Laporan */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#004c80] uppercase tracking-wide">
            <BarChart3 className="w-4 h-4 text-[#004c80]" />
            <span>Executive Business Analytics & Ecosystem Radar</span>
          </div>
          <h2 className="text-lg font-black text-[#001c3c] mt-0.5">
            Dashboard Analitik Visual UMKM Kota Batu
          </h2>
          <p className="text-xs text-slate-500">
            Diagnosis mendalam 8 pilar bisnis, sebaran subsektor, omzet, dan rekomendasi intervensi program.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sesi Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">Sesi:</span>
            <select
              value={currentSesi}
              onChange={(e) => onSesiChange(e.target.value)}
              className="bg-transparent font-bold text-[#001c3c] outline-none cursor-pointer"
            >
              {availableSesiList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Cetak / PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#001c3c] hover:bg-[#004c80] active:scale-95 text-white text-xs font-bold shadow transition-all cursor-pointer"
            title="Cetak atau Simpan sebagai PDF Laporan Analitik"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* 2. Kartu Metrik Utama (Executive KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-[#001c3c]">{stats.totalPendaftar}</div>
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">
            Total Pendaftar
          </div>
          <div className="text-[10px] text-slate-400 mt-1">100% Terdata di Sheets</div>
        </div>

        <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-800">{stats.totalDiterima}</div>
          <div className="text-[11px] sm:text-xs font-bold text-emerald-700 mt-1 uppercase tracking-wide">
            Lolos Kurasi
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">
            {stats.totalPendaftar > 0 ? `${((stats.totalDiterima / stats.totalPendaftar) * 100).toFixed(1)}% Rasio Lolos` : '0%'}
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-amber-800">{stats.belumDireview}</div>
          <div className="text-[11px] sm:text-xs font-bold text-amber-700 mt-1 uppercase tracking-wide">
            Menunggu Review
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">Antrean Penilaian</div>
        </div>

        <div className="p-4 sm:p-5 bg-blue-50 rounded-2xl border border-blue-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-[#004c80]">{overallAverageScore}</div>
          <div className="text-[11px] sm:text-xs font-bold text-[#004c80] mt-1 uppercase tracking-wide">
            Skor Radar Kota Batu
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1">Skala 1.0 - 5.0 (/5)</div>
        </div>
      </div>

      {/* Progress Bar Asesmen Mandiri */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Tingkat Pengisian Asesmen Mandiri (35 Diagnosa)
          </span>
          <span className="text-[#004c80] font-black">
            {stats.persenAsesmenSelesai} ({stats.totalAsesmenSelesai} dari {stats.totalPendaftar} UMKM)
          </span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#004c80] via-teal-600 to-emerald-600 transition-all duration-700"
            style={{ width: stats.persenAsesmenSelesai }}
          />
        </div>
      </div>

      {/* 3. RADAR CHART INTERAKTIF (8 PILAR BISNIS) & REKOMENDASI KURIKULUM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Radar Spider Chart SVG (7 Kolom di Desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#004c80] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Radar Diagnosa 8 Pilar Bisnis</span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#001c3c]">
                Ecosystem Health Radar UMKM
              </h3>
            </div>

            {/* Dropdown Komparasi Perorangan */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">Bandingkan:</span>
              <select
                value={selectedPesertaCompare}
                onChange={(e) => setSelectedPesertaCompare(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#004c80] max-w-[170px] truncate"
              >
                <option value="">Rata-rata Kota Batu Saja</option>
                {asesmenList.map((a) => (
                  <option key={a.namaUsaha} value={a.namaUsaha}>
                    vs {a.namaUsaha}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Spider Radar */}
          <div className="relative w-full aspect-square max-w-[420px] mx-auto select-none">
            <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
              <defs>
                {/* Gradient Fill untuk Area Agregat */}
                <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#004c80" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#001c3c" stopOpacity="0.15" />
                </radialGradient>
                <radialGradient id="compareFillGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.15" />
                </radialGradient>
              </defs>

              {/* Grid Lingkaran / Poligon Konsentris Level 1-5 */}
              {radarSvgData.levelPolygons.map(({ lvl, points }) => (
                <g key={lvl}>
                  <polygon
                    points={points}
                    fill={lvl % 2 === 0 ? '#f8fafc' : '#ffffff'}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  {/* Angka Skala Level di sumbu atas */}
                  <text
                    x={200}
                    y={200 - (lvl / 5) * radarSvgData.maxRadius + 9}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#94a3b8"
                    fontWeight="600"
                  >
                    {lvl}
                  </text>
                </g>
              ))}

              {/* Garis Sumbu (8 Axes) */}
              {radarSvgData.axisLines.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#cbd5e1"
                  strokeWidth={activeRadarHover === i ? '2' : '1'}
                  strokeDasharray={activeRadarHover === i ? undefined : '3 3'}
                />
              ))}

              {/* Poligon Data Agregat Kota Batu */}
              <polygon
                points={radarSvgData.aggregatePointsStr}
                fill="url(#radarFillGrad)"
                stroke="#004c80"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />

              {/* Titik Vertex Agregat */}
              {radarSvgData.aggregatePoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={activeRadarHover === i ? '6' : '4'}
                  fill="#001c3c"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setActiveRadarHover(i)}
                  onMouseLeave={() => setActiveRadarHover(null)}
                />
              ))}

              {/* Poligon Komparasi Peserta Spesifik (jika ada) */}
              {radarSvgData.comparePointsStr && (
                <>
                  <polygon
                    points={radarSvgData.comparePointsStr}
                    fill="url(#compareFillGrad)"
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="transition-all duration-300 animate-in fade-in"
                  />
                  {radarSvgData.comparePoints.map((pt, i) => (
                    <circle
                      key={`cmp-${i}`}
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#d97706"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  ))}
                </>
              )}

              {/* Label Sumbu Luar */}
              {radarSvgData.labelCoords.map((coord, i) => {
                const axis = RADAR_AXES[i];
                const score = aggregatedRadarScores[i]?.avgScore ?? 0;
                const isHovered = activeRadarHover === i;
                return (
                  <g
                    key={axis.shortName}
                    transform={`translate(${coord.x}, ${coord.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveRadarHover(i)}
                    onMouseLeave={() => setActiveRadarHover(null)}
                  >
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[11px] font-bold select-none transition-colors ${
                        isHovered ? 'fill-[#004c80] font-black' : 'fill-slate-700'
                      }`}
                    >
                      {axis.icon} {axis.shortName}
                    </text>
                    <text
                      y="13"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-black fill-[#004c80] select-none"
                    >
                      {score} / 5
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legenda Radar */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#001c3c]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#004c80] border border-white shadow-sm inline-block" />
              <span>Rata-rata Agregat UMKM Kota Batu</span>
            </div>
            {comparePesertaData && (
              <div className="flex items-center gap-1.5 font-bold text-amber-700 animate-in fade-in">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shadow-sm inline-block" />
                <span>{comparePesertaData.namaUsaha}</span>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Diagnosis Eksekutif & Rekomendasi Modul (5 Kolom di Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pilar Terkuat */}
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                <Award className="w-3 h-3" />
                Pilar Terkuat Ekosistem
              </span>
              <span className="text-base font-black text-emerald-900">
                {strongestPillar.avgScore} <span className="text-xs text-emerald-700 font-normal">/ 5.0</span>
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
              <span>{strongestPillar.icon}</span>
              <span>{strongestPillar.fullName}</span>
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {strongestPillar.deskripsi} Keunggulan ini menjadi aset potensial bagi Kota Batu untuk program kolaborasi antar-pelaku usaha (*Peer Mentoring*).
            </p>
          </div>

          {/* Titik Kritis Perlu Intervensi */}
          <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Titik Kritis / Perlu Pendampingan
              </span>
              <span className="text-base font-black text-rose-900">
                {weakestPillar.avgScore} <span className="text-xs text-rose-700 font-normal">/ 5.0</span>
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-rose-950 flex items-center gap-1.5">
              <span>{weakestPillar.icon}</span>
              <span>{weakestPillar.fullName}</span>
            </h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              {weakestPillar.deskripsi} Skor terendah pada pilar ini menandakan mayoritas pelaku UMKM masih membutuhkan pendampingan teknis intensif.
            </p>
          </div>

          {/* Actionable Curriculum Recommendation */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#001c3c] uppercase">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Rekomendasi Modul Pelatihan Prioritas</span>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                <span>{weakestPillar.rekomendasiPelatihan}</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Disarankan diangkat sebagai materi utama pada sesi workshop berikutnya guna mendongkrak kelemahan kolektif peserta.
              </p>
            </div>

            {/* Rincian Seluruh Skor 8 Pilar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Ranking 8 Pilar Usaha:
              </div>
              {sortedPillars.map((p, idx) => (
                <div key={p.shortName} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                  <span className="text-slate-700 font-medium flex items-center gap-1.5">
                    <span className="text-slate-400 font-mono text-[10px]">#{idx + 1}</span>
                    <span>{p.icon}</span>
                    <span>{p.shortName}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#004c80] rounded-full"
                        style={{ width: `${(p.avgScore / 5) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-[#001c3c] text-right w-8">{p.avgScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. DISTRIBUSI 17 SUBSEKTOR KREATIF & SEBARAN OMZET */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Subsektor Kreatif (7 Kolom di Desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#004c80] uppercase">
                <Building2 className="w-3.5 h-3.5 text-[#004c80]" />
                <span>Peta Sektor Unggulan</span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#001c3c]">
                Distribusi 17 Subsektor Ekonomi Kreatif
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {stats.subsektor.length} Subsektor Terdata
            </span>
          </div>

          <div className="space-y-3">
            {stats.subsektor.map((item, idx) => {
              const maxCount = stats.subsektor[0]?.count || 1;
              const barPercent = Math.round((item.count / maxCount) * 100);
              const shareOfTotal = ((item.count / (stats.totalPendaftar || 1)) * 100).toFixed(1);

              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono w-4">#{idx + 1}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="font-bold text-[#001c3c]">
                      {item.count} UMKM <span className="text-slate-400 font-normal text-[11px]">({shareOfTotal}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#001c3c] to-[#0070b3] rounded-full transition-all duration-500"
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skala Omzet & Kesiapan Legalitas (5 Kolom di Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Omzet Bulanan */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#004c80] uppercase pb-2 border-b border-slate-100">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Skala Omzet Bulanan Pendaftar</span>
            </div>

            <div className="space-y-2.5">
              {omzetDistribution.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="font-bold text-[#001c3c]">
                      {item.count} UMKM <span className="text-slate-400 font-normal">({item.percent}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legalitas NIB & Tata Kelola */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#004c80] uppercase pb-2 border-b border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Kesiapan Legalitas Usaha (NIB)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="text-xl font-black text-emerald-800">{legalitasStats.adaNib}</div>
                <div className="text-[10px] font-bold text-emerald-700 uppercase mt-0.5">Sudah Memiliki NIB</div>
                <div className="text-[10px] text-emerald-600 font-semibold">{legalitasStats.persenAdaNib}%</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xl font-black text-slate-700">{legalitasStats.belumNib}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Belum Berizin NIB</div>
                <div className="text-[10px] text-slate-400 font-semibold">{legalitasStats.persenBelumNib}%</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic text-center">
              *Peserta yang belum memiliki NIB dapat difasilitasi dalam klinik legalitas terpadu GEKRAFS.
            </p>
          </div>

          {/* Sebaran Domisili */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase text-[#001c3c] pb-2 border-b border-slate-100">
              Distribusi Domisili Usaha
            </h3>
            <div className="space-y-1.5">
              {stats.domisili.map((d) => (
                <div key={d.label} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                  <span className="text-slate-700 font-medium">{d.label}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold">
                    {d.count} UMKM
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
