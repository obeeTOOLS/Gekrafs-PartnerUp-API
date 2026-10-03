import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Compass, 
  Sparkles, 
  Save, 
  Send, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  HelpCircle, 
  Building2, 
  User, 
  Phone, 
  Layers, 
  RefreshCw,
  FileText,
  ChevronDown,
  Lock,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { gasService } from '../services/gasService';
import { authService } from '../services/authService';
import { StrategicCanvasTask, StrategicInnovationMatrix, PesertaItem } from '../types';

interface StrategicRoadmapFormProps {
  onBack?: () => void;
  userNamaUsaha?: string;
  userWhatsapp?: string;
}

export const StrategicRoadmapForm: React.FC<StrategicRoadmapFormProps> = ({
  onBack,
  userNamaUsaha = '',
  userWhatsapp = ''
}) => {
  const registeredPeserta: PesertaItem[] = gasService.getPeserta();

  // Deteksi sesi login aktif untuk pengamanan identitas peserta
  const pesertaSession = authService.getPesertaSession();
  const adminSession = authService.getAdminAuthSession();
  const engineerSession = authService.getCurrentSession();
  const isPrivilegedAdmin = !!(adminSession || (engineerSession && engineerSession.activePerspective !== 'peserta'));
  const isPesertaLoggedIn = !!pesertaSession && !isPrivilegedAdmin;

  const [selectedNamaUsaha, setSelectedNamaUsaha] = useState<string>(() => {
    if (isPesertaLoggedIn && pesertaSession?.namaUsaha) {
      return pesertaSession.namaUsaha;
    }
    return userNamaUsaha || (registeredPeserta.length > 0 ? registeredPeserta[0].namaUsaha : '');
  });

  const [namaPemilik, setNamaPemilik] = useState<string>(() => {
    if (isPesertaLoggedIn && pesertaSession?.namaPemilik) {
      return pesertaSession.namaPemilik;
    }
    return '';
  });

  const [whatsapp, setWhatsapp] = useState<string>(() => {
    if (isPesertaLoggedIn && pesertaSession?.whatsapp) {
      return pesertaSession.whatsapp;
    }
    return userWhatsapp || '';
  });

  const [subsektor, setSubsektor] = useState('Kuliner');
  const [sesiPartnerUp, setSesiPartnerUp] = useState('Sesi 2');

  // Form Fields (Image 1 & 2)
  const [visi, setVisi] = useState('');
  const [misi, setMisi] = useState('');
  const [goal, setGoal] = useState('');
  const [objective, setObjective] = useState('');
  const [nilaiUsaha, setNilaiUsaha] = useState('');
  const [keahlianOrganisasi, setKeahlianOrganisasi] = useState('');

  // 3x3 Horizon Matrix
  const [matriks, setMatriks] = useState<StrategicInnovationMatrix>({
    problemSolving: { recent: '', midTerm: '', longTerm: '' },
    incremental: { recent: '', midTerm: '', longTerm: '' },
    breakthrough: { recent: '', midTerm: '', longTerm: '' }
  });

  // Mobile view tab for 3x3 matrix: 'recent' | 'midTerm' | 'longTerm'
  const [activeMatrixTab, setActiveMatrixTab] = useState<'recent' | 'midTerm' | 'longTerm'>('recent');

  // Task Status & Meta
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  const [currentStatus, setCurrentStatus] = useState<'draft' | 'submitted' | 'reviewed' | 'revision'>('draft');
  const [nilai, setNilai] = useState<number | undefined>(undefined);
  const [catatanKurator, setCatatanKurator] = useState<string>('');
  const [reviewedBy, setReviewedBy] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load existing task data when selectedNamaUsaha changes
  useEffect(() => {
    if (!selectedNamaUsaha) return;

    // Autofill peserta info from registered list
    const foundPeserta = registeredPeserta.find(p => p.namaUsaha.toLowerCase() === selectedNamaUsaha.toLowerCase());
    if (foundPeserta) {
      setNamaPemilik(foundPeserta.namaPemilik || '');
      setWhatsapp(foundPeserta.whatsapp || '');
      setSubsektor(foundPeserta.subsektor || 'Kuliner');
      setSesiPartnerUp(foundPeserta.sesi || 'Sesi 2');
    }

    // Check if task exists in taskService
    const existing = taskService.getTaskByNamaUsaha(selectedNamaUsaha);
    if (existing) {
      setCurrentTaskId(existing.id);
      setNamaPemilik(existing.namaPemilik);
      setWhatsapp(existing.whatsapp);
      setSubsektor(existing.subsektor || 'Kuliner');
      setSesiPartnerUp(existing.sesiPartnerUp || 'Sesi 2');
      setVisi(existing.visi || '');
      setMisi(existing.misi || '');
      setGoal(existing.goal || '');
      setObjective(existing.objective || '');
      setNilaiUsaha(existing.nilaiUsaha || '');
      setKeahlianOrganisasi(existing.keahlianOrganisasi || '');
      if (existing.matriks) {
        setMatriks(existing.matriks);
      }
      setCurrentStatus(existing.status);
      setNilai(existing.nilai);
      setCatatanKurator(existing.catatanKurator || '');
      setReviewedBy(existing.reviewedBy || '');
      setLastSaved(existing.updatedAt);
    } else {
      // Clear fields for new input
      setCurrentTaskId('');
      setVisi('');
      setMisi('');
      setGoal('');
      setObjective('');
      setNilaiUsaha('');
      setKeahlianOrganisasi('');
      setMatriks({
        problemSolving: { recent: '', midTerm: '', longTerm: '' },
        incremental: { recent: '', midTerm: '', longTerm: '' },
        breakthrough: { recent: '', midTerm: '', longTerm: '' }
      });
      setCurrentStatus('draft');
      setNilai(undefined);
      setCatatanKurator('');
      setReviewedBy('');
    }
  }, [selectedNamaUsaha]);

  const handleMatrixChange = (
    row: 'problemSolving' | 'incremental' | 'breakthrough',
    col: 'recent' | 'midTerm' | 'longTerm',
    value: string
  ) => {
    setMatriks(prev => ({
      ...prev,
      [row]: {
        ...prev[row],
        [col]: value
      }
    }));
  };

  const handleSaveDraft = () => {
    if (!selectedNamaUsaha.trim()) {
      setNotification({ type: 'error', message: 'Silakan pilih atau masukkan Nama Usaha terlebih dahulu!' });
      return;
    }

    const saved = taskService.saveDraft({
      id: currentTaskId || undefined,
      namaUsaha: selectedNamaUsaha,
      namaPemilik,
      whatsapp,
      subsektor,
      sesiPartnerUp,
      visi,
      misi,
      goal,
      objective,
      nilaiUsaha,
      keahlianOrganisasi,
      matriks
    });

    setCurrentTaskId(saved.id);
    setCurrentStatus(saved.status);
    setLastSaved(saved.updatedAt);
    setNotification({ type: 'success', message: 'Draf lembar kerja berhasil disimpan! Anda dapat melanjutkannya kapan saja.' });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNamaUsaha.trim()) {
      setNotification({ type: 'error', message: 'Silakan pilih atau masukkan Nama Usaha!' });
      return;
    }

    if (!visi.trim() || !misi.trim() || !goal.trim() || !objective.trim()) {
      setNotification({ 
        type: 'error', 
        message: 'Mohon lengkapi minimal Visi, Misi, Goal, dan Objective SMART sebelum mengirimkan ke kurator.' 
      });
      return;
    }

    const submitted = taskService.submitTask({
      id: currentTaskId || undefined,
      namaUsaha: selectedNamaUsaha,
      namaPemilik,
      whatsapp,
      subsektor,
      sesiPartnerUp,
      visi,
      misi,
      goal,
      objective,
      nilaiUsaha,
      keahlianOrganisasi,
      matriks
    });

    setCurrentTaskId(submitted.id);
    setCurrentStatus(submitted.status);
    setLastSaved(submitted.updatedAt);
    setNotification({ 
      type: 'success', 
      message: '🎉 Berhasil dikirim ke Tim Kurator! Tugas Anda sedang dalam antrean review & penilaian.' 
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-lg animate-in fade-in transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-rose-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001c3c] via-[#002855] to-[#001730] text-white rounded-3xl p-5 sm:p-8 shadow-xl border border-[#003866] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modul Aksi: Fondasi Strategi Bisnis</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Lembar Kerja & Peta Jalan Bisnis
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Formulasikan arah masa depan usaha Anda melalui pendekatan <strong>Strategic Intent</strong> dan <strong>Innovation Horizon Matrix 3x3</strong> sesuai bimbingan kurator resmi GEKRAFS Kota Batu.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              title="Cetak Peta Jalan Bisnis (1 Halaman PDF)"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              title="Simpan sementara tulisan Anda"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-600 active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4 text-sky-400" />
              <span>Simpan Draf</span>
            </button>
          </div>
        </div>

        {/* Status Tracker Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Status Tugas:</span>
            {currentStatus === 'reviewed' && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Disetujui & Dinilai ({nilai}/100)
              </span>
            )}
            {currentStatus === 'submitted' && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Terkirim • Menunggu Review Kurator
              </span>
            )}
            {currentStatus === 'draft' && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-500/20 border border-slate-400/30 text-slate-300 font-bold">
                Draf Belum Dikirim
              </span>
            )}
            {currentStatus === 'revision' && (
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-300 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Perlu Revisi Peserta
              </span>
            )}
          </div>

          {lastSaved && (
            <div className="text-[11px] text-slate-400">
              Terakhir disimpan: <span className="font-mono text-slate-300">{lastSaved}</span>
            </div>
          )}
        </div>
      </div>

      {/* Review Feedback Card from Mentor (if reviewed) */}
      {currentStatus === 'reviewed' && catatanKurator && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-extrabold text-emerald-900">Catatan & Masukan Kurator</h3>
            </div>
            {nilai !== undefined && (
              <div className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full">
                Skor: {nilai} / 100
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            "{catatanKurator}"
          </p>
          {reviewedBy && (
            <div className="text-[11px] text-emerald-700 font-bold pt-1">
              — {reviewedBy}
            </div>
          )}
        </div>
      )}

      {/* Form Workspace */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Identitas Usaha Peserta */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-extrabold text-[#001c3c] uppercase tracking-wider">
                1. Identitas Usaha & Peserta
              </h2>
            </div>
            {isPesertaLoggedIn ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Akun Terverifikasi & Terkunci
              </span>
            ) : isPrivilegedAdmin ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black flex items-center gap-1.5 shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                Mode Kurator / Admin
              </span>
            ) : null}
          </div>

          {isPesertaLoggedIn ? (
            /* Tampilan Terkunci Khusus Peserta Login (Mencegah Salah Input / Overwrite Orang Lain) */
            <div className="p-4 bg-gradient-to-r from-blue-50/90 via-slate-50 to-amber-50/40 rounded-2xl border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-blue-700" />
                  <span>Identitas Usaha Resmi Anda:</span>
                </div>
                <div className="text-xl font-black text-[#001c3c] flex items-center gap-2">
                  <span>{selectedNamaUsaha}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#001c3c] text-amber-400 text-[10px] font-bold">
                    {sesiPartnerUp}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                  <span>Pemilik: <strong className="text-slate-900">{namaPemilik || pesertaSession?.namaPemilik || 'Founder'}</strong></span>
                  <span>•</span>
                  <span>WhatsApp: <strong className="text-slate-900">{whatsapp || pesertaSession?.whatsapp}</strong></span>
                  <span>•</span>
                  <span>Subsektor: <strong className="text-amber-800">{subsektor}</strong></span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-white/90 p-3 rounded-xl border border-slate-200 shadow-2xs max-w-sm leading-relaxed">
                🔒 <strong>Perlindungan Data:</strong> Formulir ini terkunci otomatis untuk akun usaha Anda. Tugas yang Anda simpan atau kirim tidak akan tertukar dengan peserta lain.
              </div>
            </div>
          ) : (
            /* Mode Kurator / Admin: Dapat Memilih UMKM Peserta */
            <div className="space-y-3">
              <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                Pilih atau cari UMKM peserta yang ingin dilihat, dibantu pengisiannya, atau direview lembar aksinya:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Nama Usaha UMKM *</span>
                    <span className="text-[10px] text-slate-400 font-normal">Pilih UMKM</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="registered-umkm-list"
                      value={selectedNamaUsaha}
                      onChange={(e) => setSelectedNamaUsaha(e.target.value)}
                      placeholder="Contoh: Kripik Apel Batu Mandiri"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-[#001c3c] focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                    <datalist id="registered-umkm-list">
                      {registeredPeserta.map((p, idx) => (
                        <option key={idx} value={p.namaUsaha}>
                          {p.namaPemilik} ({p.subsektor})
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nama Pemilik / Founder</label>
                  <input
                    type="text"
                    value={namaPemilik}
                    onChange={(e) => setNamaPemilik(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">WhatsApp Aktif</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="0812xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BAGIAN 1: PONDASI STRATEGIS (STRATEGIC INTENT - SESUAI GAMBAR 1) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-[#001c3c]" />
              <div>
                <h2 className="text-sm font-extrabold text-[#001c3c] uppercase tracking-wider">
                  2. Fondasi Arah Usaha (Strategic Intent)
                </h2>
                <p className="text-[11px] text-slate-500">Definisikan masa depan, alasan berdiri, dan target 90 hari usaha Anda.</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg">
              Lembar 1
            </span>
          </div>

          <div className="space-y-4">
            {/* Visi */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#001c3c] flex items-center justify-between">
                <span>Visi : Gambaran Masa Depan *</span>
                <span className="text-[10px] text-slate-400 font-normal">Arah jangka panjang 3-5 tahun</span>
              </label>
              <textarea
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                rows={3}
                placeholder="Contoh: Menjadi produsen camilan olahan apel sehat dan higienis nomor satu di Jawa Timur pada tahun 2028."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
                required
              />
              <p className="text-[10px] text-slate-400 italic">
                💡 Tips: Bayangkan posisi terbaik bisnis Anda 3-5 tahun dari sekarang.
              </p>
            </div>

            {/* Misi */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#001c3c] flex items-center justify-between">
                <span>Misi : Apa yang Dilakukan & Kepada Siapa *</span>
                <span className="text-[10px] text-slate-400 font-normal">Pemberian nilai tambah</span>
              </label>
              <textarea
                value={misi}
                onChange={(e) => setMisi(e.target.value)}
                rows={3}
                placeholder="Contoh: Mengolah buah apel petani lokal Kota Batu menjadi produk bernilai tambah tinggi yang lezat, higienis, dan aman dikonsumsi seluruh keluarga."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
                required
              />
              <p className="text-[10px] text-slate-400 italic">
                💡 Tips: Jelaskan produk/layanan yang Anda kerjakan dan segmen siapa yang Anda bantu.
              </p>
            </div>

            {/* Goal / Sasaran */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#001c3c] flex items-center justify-between">
                <span>Goal / Sasaran : Target yang Menentukan Arah *</span>
                <span className="text-[10px] text-slate-400 font-normal">Arah capaian besar</span>
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={2}
                placeholder="Contoh: Membangun ekosistem pasokan apel stabil 2 ton/bulan dan jaringan distribusi ke 20 toko oleh-oleh se-Malang Raya."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
                required
              />
            </div>

            {/* Objective SMART */}
            <div className="space-y-1.5 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
              <label className="text-xs font-black text-[#001c3c] flex items-center justify-between">
                <span className="text-amber-900">Objective : Target Eksekusi (SMART, 3 Bulan) *</span>
                <span className="text-[10px] text-amber-700 font-bold">Target Konkret 90 Hari</span>
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                placeholder="Contoh: Meningkatkan omzet sebesar 25% dalam 90 hari dengan membuka 5 mitra reseller baru dan meluncurkan kemasan baru bersertifikasi Halal."
                className="w-full p-3 rounded-xl border border-amber-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-medium"
                required
              />
              <p className="text-[10px] text-amber-800 leading-relaxed">
                🎯 <strong>Format SMART:</strong> Spesifik (apa produknya), Terukur (angka % atau rupiah), Dapat Dicapai, Relevan dengan pasar, dan Berbatas Waktu (3 bulan).
              </p>
            </div>

            {/* Nilai-nilai dalam Usaha */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#001c3c] flex items-center justify-between">
                <span>Nilai-nilai dalam Usaha (Core Values)</span>
                <span className="text-[10px] text-slate-400 font-normal">Prinsip & etika kerja</span>
              </label>
              <textarea
                value={nilaiUsaha}
                onChange={(e) => setNilaiUsaha(e.target.value)}
                rows={2}
                placeholder="Contoh: Kemitraan Petani Lokal, Kualitas Tanpa Pengawet, Kejujuran Timbangan, Pelayanan Ramah & Amanah."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 2: KAPASITAS ORGANISASI & KEAHLIAN (SESUAI GAMBAR 2) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-extrabold text-[#001c3c] uppercase tracking-wider">
                3. Keahlian Organisasi (Organizational Capability)
              </h2>
              <p className="text-[11px] text-slate-500">Kekuatan dan kompetensi kunci yang sudah dimiliki tim Anda saat ini.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#001c3c]">
              Keahlian Organisasi Saat Ini:
            </label>
            <textarea
              value={keahlianOrganisasi}
              onChange={(e) => setKeahlianOrganisasi(e.target.value)}
              rows={3}
              placeholder="Contoh: Penguasaan teknik vacuum frying suhu rendah, jaringan paguyuban petani apel di Desa Tulungrejo, dan kemampuan produksi konten video TikTok harian."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
            />
          </div>
        </div>

        {/* BAGIAN 3: MATRIKS PENGEMBANGAN KEAHLIAN & INOVASI 3x3 (SESUAI GAMBAR 2) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-amber-500" />
              <div>
                <h2 className="text-sm font-extrabold text-[#001c3c] uppercase tracking-wider">
                  4. Matriks Pengembangan Keahlian (Innovation Matrix 3x3)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Petakan langkah perbaikan dari masalah harian, peningkatan bertahap, hingga lompatan terobosan.
                </p>
              </div>
            </div>

            {/* Mobile Tab Selector */}
            <div className="flex md:hidden p-1 bg-slate-100 rounded-xl border border-slate-200 self-start">
              {(['recent', 'midTerm', 'longTerm'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveMatrixTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMatrixTab === tab
                      ? 'bg-[#001c3c] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'recent' ? 'Recent (Kini)' : tab === 'midTerm' ? 'Mid-Term' : 'Long-Term'}
                </button>
              ))}
            </div>
          </div>

          {/* DESKTOP VIEW: FULL 3x3 GRID TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 rounded-xl overflow-hidden text-xs">
              <thead>
                <tr className="bg-[#001c3c] text-white text-left">
                  <th className="p-3 font-bold border border-slate-600 w-1/4">
                    Tingkat Pengembangan
                  </th>
                  <th className="p-3 font-bold border border-slate-600 w-1/4">
                    Recent (Saat Ini / 1-3 Bln)
                  </th>
                  <th className="p-3 font-bold border border-slate-600 w-1/4">
                    Mid-Term (Menengah / 6-12 Bln)
                  </th>
                  <th className="p-3 font-bold border border-slate-600 w-1/4">
                    Long-Term (Panjang / 2-3 Thn)
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1: Problem Solving */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 border border-slate-300 bg-slate-50 font-bold text-[#001c3c] align-top">
                    <div className="font-extrabold">Problem Solving</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      Penyelesaian kendala harian & hambatan teknis
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300">
                    <textarea
                      value={matriks.problemSolving.recent}
                      onChange={(e) => handleMatrixChange('problemSolving', 'recent', e.target.value)}
                      rows={3}
                      placeholder="Solusi kendala saat ini..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </td>
                  <td className="p-2 border border-slate-300">
                    <textarea
                      value={matriks.problemSolving.midTerm}
                      onChange={(e) => handleMatrixChange('problemSolving', 'midTerm', e.target.value)}
                      rows={3}
                      placeholder="Solusi kendala jangka menengah..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </td>
                  <td className="p-2 border border-slate-300">
                    <textarea
                      value={matriks.problemSolving.longTerm}
                      onChange={(e) => handleMatrixChange('problemSolving', 'longTerm', e.target.value)}
                      rows={3}
                      placeholder="Sistem pencegahan jangka panjang..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </td>
                </tr>

                {/* Row 2: Incremental */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 border border-slate-300 bg-slate-50 font-bold text-[#001c3c] align-top">
                    <div className="font-extrabold text-blue-950">Incremental</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      Peningkatan mutu, efisiensi & perbaikan bertahap
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300">
                    <textarea
                      value={matriks.incremental.recent}
                      onChange={(e) => handleMatrixChange('incremental', 'recent', e.target.value)}
                      rows={3}
                      placeholder="Perbaikan bertahap saat ini..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </td>
                  <td className="p-2 border border-slate-300">
                    <textarea
                      value={matriks.incremental.midTerm}
                      onChange={(e) => handleMatrixChange('incremental', 'midTerm', e.target.value)}
                      rows={3}
                      placeholder="Peningkatan kapasitas & mutu menengah..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </td>
                  <td className="p-2 border border-slate-300">
                    <textarea
                      value={matriks.incremental.longTerm}
                      onChange={(e) => handleMatrixChange('incremental', 'longTerm', e.target.value)}
                      rows={3}
                      placeholder="Standar mutu & ekspansi panjang..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </td>
                </tr>

                {/* Row 3: Breakthrough */}
                <tr className="hover:bg-amber-50/30">
                  <td className="p-3 border border-slate-300 bg-amber-50/50 font-bold text-amber-950 align-top">
                    <div className="font-extrabold text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Breakthrough</span>
                    </div>
                    <div className="text-[10px] text-amber-800/80 font-normal mt-0.5">
                      Lompatan inovasi baru, diferensiasi & terobosan
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300">
                    <textarea
                      value={matriks.breakthrough.recent}
                      onChange={(e) => handleMatrixChange('breakthrough', 'recent', e.target.value)}
                      rows={3}
                      placeholder="Eksperimen inovasi baru saat ini..."
                      className="w-full p-2 rounded-lg border border-amber-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </td>
                  <td className="p-2 border border-slate-300">
                    <textarea
                      value={matriks.breakthrough.midTerm}
                      onChange={(e) => handleMatrixChange('breakthrough', 'midTerm', e.target.value)}
                      rows={3}
                      placeholder="Lompatan produk/pasar menengah..."
                      className="w-full p-2 rounded-lg border border-amber-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </td>
                  <td className="p-2 border border-slate-300">
                    <textarea
                      value={matriks.breakthrough.longTerm}
                      onChange={(e) => handleMatrixChange('breakthrough', 'longTerm', e.target.value)}
                      rows={3}
                      placeholder="Peluang terobosan besar masa depan..."
                      className="w-full p-2 rounded-lg border border-amber-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW: TABBED CARDS FOR COMFORTABLE SMARTPHONE TYPING */}
          <div className="block md:hidden space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Sedang mengisi horizon: <strong>{activeMatrixTab === 'recent' ? 'Recent (Saat ini 1-3 Bln)' : activeMatrixTab === 'midTerm' ? 'Mid-Term (6-12 Bln)' : 'Long-Term (2-3 Thn)'}</strong>
              </span>
            </div>

            {/* Problem Solving Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <label className="text-xs font-bold text-[#001c3c]">
                1. Problem Solving (Solusi Kendala):
              </label>
              <textarea
                value={matriks.problemSolving[activeMatrixTab]}
                onChange={(e) => handleMatrixChange('problemSolving', activeMatrixTab, e.target.value)}
                rows={3}
                placeholder={`Tuliskan rencana problem solving untuk periode ${activeMatrixTab}...`}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Incremental Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <label className="text-xs font-bold text-[#001c3c]">
                2. Incremental (Peningkatan Bertahap):
              </label>
              <textarea
                value={matriks.incremental[activeMatrixTab]}
                onChange={(e) => handleMatrixChange('incremental', activeMatrixTab, e.target.value)}
                rows={3}
                placeholder={`Tuliskan rencana peningkatan bertahap untuk periode ${activeMatrixTab}...`}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Breakthrough Card */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>3. Breakthrough (Lompatan Terobosan):</span>
              </label>
              <textarea
                value={matriks.breakthrough[activeMatrixTab]}
                onChange={(e) => handleMatrixChange('breakthrough', activeMatrixTab, e.target.value)}
                rows={3}
                placeholder={`Tuliskan rencana terobosan/lompatan inovasi untuk periode ${activeMatrixTab}...`}
                className="w-full p-2.5 rounded-lg border border-amber-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 z-20">
          <div className="text-xs text-slate-500">
            Pastikan data sudah diperiksa sebelum mengirimkan ke kurator.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Simpan Draf</span>
            </button>

            <button
              type="submit"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#001c3c] text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#001c3c]" />
              <span>Kirim ke Kurator</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
