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
  ShieldAlert,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  X,
  Wallet,
  Key,
  Crown
} from 'lucide-react';
import { kasService } from '../services/kasService';
import { taskService } from '../services/taskService';
import { taskConfigService } from '../services/taskConfigService';
import { gasService } from '../services/gasService';
import { authService } from '../services/authService';
import { StrategicCanvasTask, StrategicInnovationMatrix, PesertaItem, TaskModuleDef, TaskQuestionDef } from '../types';
import { UntunginKasModal } from './UntunginKasModal';
import { UbahPinPesertaModal } from './UbahPinPesertaModal';

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
  const [registeredPeserta, setRegisteredPeserta] = useState<PesertaItem[]>(() => gasService.getPeserta());

  // Modul & Pertanyaan Tugas Dinamis dari taskConfigService
  const [modules, setModules] = useState<TaskModuleDef[]>(() => taskConfigService.getModules());
  const [activeModule, setActiveModule] = useState<TaskModuleDef>(() => taskConfigService.getActiveModule());
  const [jawabanDinamis, setJawabanDinamis] = useState<Record<string, string>>({});
  const [isUntunginKasOpen, setIsUntunginKasOpen] = useState(false);
  const [isUbahPinOpen, setIsUbahPinOpen] = useState(false);

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
  const [currentStatus, setCurrentStatus] = useState<'draft' | 'submitted' | 'reviewed' | 'revision'>(() => {
    const initUsaha = isPesertaLoggedIn && pesertaSession?.namaUsaha ? pesertaSession.namaUsaha : (userNamaUsaha || '');
    const initWa = isPesertaLoggedIn && pesertaSession?.whatsapp ? pesertaSession.whatsapp : (userWhatsapp || '');
    const initEmail = isPesertaLoggedIn && pesertaSession?.email ? pesertaSession.email : '';
    const found = taskService.getTaskByParticipant({ namaUsaha: initUsaha, whatsapp: initWa, email: initEmail });
    return found ? found.status : 'draft';
  });
  const [nilai, setNilai] = useState<number | undefined>(undefined);
  const [catatanKurator, setCatatanKurator] = useState<string>('');
  const [reviewedBy, setReviewedBy] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Tanda Terima & Notifikasi WhatsApp Otomatis
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    isOpen: boolean;
    queueNumber: number;
    namaUsaha: string;
    namaPemilik: string;
    whatsapp: string;
    subsektor: string;
    timestamp: string;
    waLink: string;
    waMessage: string;
  } | null>(null);
  const [isCopiedReceipt, setIsCopiedReceipt] = useState(false);

  // Sync dengan perubahan konfigurasi soal dari Portal Kurator
  useEffect(() => {
    const handleConfigUpdate = () => {
      setModules(taskConfigService.getModules());
      setActiveModule(taskConfigService.getActiveModule());
    };
    window.addEventListener('gkf-task-config-updated', handleConfigUpdate);
    return () => window.removeEventListener('gkf-task-config-updated', handleConfigUpdate);
  }, []);

  // Update daftar peserta jika sinkronisasi GAS berjalan di latar
  useEffect(() => {
    const updatePeserta = () => {
      const list = gasService.getPeserta();
      setRegisteredPeserta(list);
    };
    window.addEventListener('storage', updatePeserta);
    return () => window.removeEventListener('storage', updatePeserta);
  }, []);

  // Track previous loaded task to avoid resetting when typing
  const lastLoadedTaskUsahaRef = React.useRef<string>('');

  // Load existing task data when selectedNamaUsaha or identity changes
  useEffect(() => {
    const cleanUsaha = (selectedNamaUsaha || pesertaSession?.namaUsaha || userNamaUsaha || '').trim();
    const cleanWa = (whatsapp || pesertaSession?.whatsapp || userWhatsapp || '').trim();
    const cleanEmail = (pesertaSession?.email || '').trim();
    if (!cleanUsaha && !cleanWa) return;

    // Autofill peserta info from registered list
    const foundPeserta = registeredPeserta.find(
      p => (cleanUsaha && p.namaUsaha.toLowerCase().trim() === cleanUsaha.toLowerCase()) ||
           (cleanWa && p.whatsapp && p.whatsapp.replace(/[^0-9]/g, '').endsWith(cleanWa.replace(/[^0-9]/g, '').slice(-8)))
    );
    if (foundPeserta) {
      if (!namaPemilik && foundPeserta.namaPemilik) setNamaPemilik(foundPeserta.namaPemilik);
      if (!whatsapp && foundPeserta.whatsapp) setWhatsapp(foundPeserta.whatsapp);
      if (foundPeserta.subsektor) setSubsektor(foundPeserta.subsektor || 'Kuliner');
      if (foundPeserta.sesi) setSesiPartnerUp(foundPeserta.sesi || 'Sesi 2');
    }

    // Pencocokan Cerdas Multi-Kunci ke taskService (WhatsApp, Email, dan Nama Usaha)
    const existing = taskService.getTaskByParticipant({
      namaUsaha: cleanUsaha || (foundPeserta?.namaUsaha || ''),
      whatsapp: cleanWa || (foundPeserta?.whatsapp || ''),
      email: cleanEmail
    });

    if (existing) {
      const matchKey = existing.id + '_' + (existing.namaUsaha || '');
      if (lastLoadedTaskUsahaRef.current !== matchKey) {
        lastLoadedTaskUsahaRef.current = matchKey;
        setCurrentTaskId(existing.id);
        if (existing.namaPemilik) setNamaPemilik(existing.namaPemilik);
        if (existing.whatsapp) setWhatsapp(existing.whatsapp);
        if (existing.subsektor) setSubsektor(existing.subsektor || 'Kuliner');
        if (existing.sesiPartnerUp) setSesiPartnerUp(existing.sesiPartnerUp || 'Sesi 2');
        if (existing.visi) setVisi(existing.visi);
        if (existing.misi) setMisi(existing.misi);
        if (existing.goal) setGoal(existing.goal);
        if (existing.objective) setObjective(existing.objective);
        if (existing.nilaiUsaha) setNilaiUsaha(existing.nilaiUsaha);
        if (existing.keahlianOrganisasi) setKeahlianOrganisasi(existing.keahlianOrganisasi);
        if (existing.matriks) {
          setMatriks(existing.matriks);
        }
        if (existing.jawabanDinamis && Object.keys(existing.jawabanDinamis).length > 0) {
          setJawabanDinamis(existing.jawabanDinamis);
        } else {
          setJawabanDinamis({
            visi: existing.visi || '',
            misi: existing.misi || '',
            goal: existing.goal || '',
            objective: existing.objective || '',
            nilaiUsaha: existing.nilaiUsaha || '',
            keahlianOrganisasi: existing.keahlianOrganisasi || ''
          });
        }
        setCurrentStatus(existing.status);
        setNilai(existing.nilai);
        setCatatanKurator(existing.catatanKurator || '');
        setReviewedBy(existing.reviewedBy || '');
        setLastSaved(existing.updatedAt);
      } else {
        // Sinkronisasi status tugas secara real-time
        setCurrentStatus(existing.status);
        if (existing.nilai !== undefined) setNilai(existing.nilai);
        if (existing.catatanKurator) setCatatanKurator(existing.catatanKurator);
      }
    } else {
      // PENTING: Jika tugas baru belum ada di taskService, JANGAN HAPUS input yang sedang diketik peserta!
      setCurrentTaskId('');
      setCurrentStatus('draft');
    }
  }, [selectedNamaUsaha, whatsapp, registeredPeserta]);

  const handleAnswerChange = (questionId: string, val: string) => {
    setJawabanDinamis(prev => ({ ...prev, [questionId]: val }));
    if (questionId === 'visi') setVisi(val);
    if (questionId === 'misi') setMisi(val);
    if (questionId === 'goal') setGoal(val);
    if (questionId === 'objective') setObjective(val);
    if (questionId === 'nilaiUsaha') setNilaiUsaha(val);
    if (questionId === 'keahlianOrganisasi') setKeahlianOrganisasi(val);
  };

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
    const usaha = (selectedNamaUsaha || pesertaSession?.namaUsaha || '').trim();
    if (!usaha) {
      setNotification({ 
        type: 'error', 
        message: 'Silakan pilih atau ketikkan Nama Usaha Anda terlebih dahulu pada Bagian 1.' 
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const saved = taskService.saveDraft({
        id: currentTaskId || undefined,
        namaUsaha: usaha,
        namaPemilik: namaPemilik || pesertaSession?.namaPemilik || 'Founder',
        whatsapp: whatsapp || pesertaSession?.whatsapp || '',
        subsektor,
        sesiPartnerUp,
        moduleId: activeModule.id,
        jawabanDinamis,
        visi: jawabanDinamis['visi'] || visi,
        misi: jawabanDinamis['misi'] || misi,
        goal: jawabanDinamis['goal'] || goal,
        objective: jawabanDinamis['objective'] || objective,
        nilaiUsaha: jawabanDinamis['nilaiUsaha'] || nilaiUsaha,
        keahlianOrganisasi: jawabanDinamis['keahlianOrganisasi'] || keahlianOrganisasi,
        matriks
      });

      lastLoadedTaskUsahaRef.current = usaha;
      setCurrentTaskId(saved.id);
      setCurrentStatus(saved.status);
      setLastSaved(saved.updatedAt);
      setNotification({ 
        type: 'success', 
        message: '✅ Draf lembar kerja berhasil disimpan! Tulisan Anda aman dan dapat dilanjutkan kapan saja.' 
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      console.error('Error saving draft:', err);
      setNotification({ 
        type: 'error', 
        message: 'Gagal menyimpan draf: ' + (err.message || 'Terjadi kendala penyimpanan.') 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usaha = (selectedNamaUsaha || pesertaSession?.namaUsaha || '').trim();
    if (!usaha) {
      setNotification({ 
        type: 'error', 
        message: 'Silakan pilih atau ketikkan Nama Usaha Anda pada Bagian 1 terlebih dahulu!' 
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validasi pertanyaan wajib dari activeModule
    const missing = activeModule.pertanyaan.filter(q => {
      if (!q.wajib) return false;
      const val = (jawabanDinamis[q.id] || (q.id === 'visi' ? visi : q.id === 'misi' ? misi : q.id === 'goal' ? goal : q.id === 'objective' ? objective : ''))?.trim();
      return !val;
    });

    if (missing.length > 0) {
      setNotification({ 
        type: 'error', 
        message: `⚠️ Mohon lengkapi pertanyaan wajib: "${missing[0].label}" sebelum mengirimkan ke kurator.` 
      });
      return;
    }

    // PENGAMANAN ANTI-DUPLIKASI & INTEGRITAS:
    // Jika tugas sudah disetujui & dinilai kurator, tolak pengiriman baru oleh peserta
    if (currentStatus === 'reviewed' && !isPrivilegedAdmin) {
      setNotification({
        type: 'error',
        message: `🔒 Lembar kerja usaha ini sudah dinilai oleh Kurator (Skor: ${nilai}/100). Pengiriman baru ditolak untuk menjaga integritas penilaian.`
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitted = await taskService.submitTaskAsync({
        id: currentTaskId || undefined,
        namaUsaha: usaha,
        namaPemilik: namaPemilik || pesertaSession?.namaPemilik || 'Founder',
        whatsapp: whatsapp || pesertaSession?.whatsapp || '',
        subsektor,
        sesiPartnerUp,
        moduleId: activeModule.id,
        jawabanDinamis,
        visi: jawabanDinamis['visi'] || visi,
        misi: jawabanDinamis['misi'] || misi,
        goal: jawabanDinamis['goal'] || goal,
        objective: jawabanDinamis['objective'] || objective,
        nilaiUsaha: jawabanDinamis['nilaiUsaha'] || nilaiUsaha,
        keahlianOrganisasi: jawabanDinamis['keahlianOrganisasi'] || keahlianOrganisasi,
        matriks
      });

      lastLoadedTaskUsahaRef.current = usaha;
      setCurrentTaskId(submitted.id);
      setCurrentStatus(submitted.status);
      setLastSaved(submitted.updatedAt);

      // Hitung Nomor Urut Antrean Resmi & Siapkan Pesan WhatsApp
      const queueNo = taskService.getSubmissionQueueNumber(submitted.id);
      const targetWa = (submitted.whatsapp || whatsapp || '').trim();
      const cleanPhone = targetWa.replace(/[^0-9]/g, '');
      const intlPhone = cleanPhone.startsWith('0') 
        ? '62' + cleanPhone.slice(1) 
        : (cleanPhone.startsWith('62') ? cleanPhone : (cleanPhone ? '62' + cleanPhone : ''));

      const formattedQueue = `#${String(queueNo).padStart(3, '0')}`;
      const waMessage = `Halo Kak *${submitted.namaPemilik || 'Founder'}* (*${submitted.namaUsaha}*), 👋✨

Terima kasih! Lembar Aksi Strategi Bisnis Anda untuk *PartnerUp 2026 Kota Batu* telah *BERHASIL TERCATAT* di sistem kami.

📋 *Nomor Urut Antrean:* ${formattedQueue}
🏢 *Subsektor:* ${submitted.subsektor}
📅 *Waktu Masuk:* ${submitted.updatedAt} WIB
📊 *Status:* Dalam Antrean Review Tim Kurator

Saat ini lembar kerja Anda sedang berada di antrean kurasi & penilaian oleh Tim Kurator resmi GEKRAFS Kota Batu. Anda dapat memantau status persetujuan serta catatan masukan mentor secara berkala melalui web apps PartnerUp.

Tetap semangat dalam mengakselerasi pertumbuhan bisnis Anda! 🚀

Salam hangat,
*Tim Kurator PartnerUp 2026*`;

      const waLink = intlPhone ? `https://api.whatsapp.com/send?phone=${intlPhone}&text=${encodeURIComponent(waMessage)}` : '';

      setSubmissionReceipt({
        isOpen: true,
        queueNumber: queueNo,
        namaUsaha: submitted.namaUsaha,
        namaPemilik: submitted.namaPemilik,
        whatsapp: targetWa,
        subsektor: submitted.subsektor || subsektor || 'Kuliner',
        timestamp: submitted.updatedAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
        waLink,
        waMessage
      });

      setNotification({ 
        type: 'success', 
        message: `🎉 Berhasil dikirim! Dokumen Anda tercatat dengan Nomor Antrean #${String(queueNo).padStart(3, '0')}.` 
      });
      setTimeout(() => setNotification(null), 6000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error submitting task:', err);
      setNotification({ 
        type: 'error', 
        message: 'Gagal mengirimkan tugas: ' + (err.message || 'Terjadi kendala.') 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 print:p-0 print:m-0 print:space-y-4 print:max-w-none">
      {/* Official Print Header (Only visible on paper / PDF print) */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-[#001c3c] pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
            <img src="/logo.svg" alt="Gekrafs Kota Batu" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">
              GEKRAFS KOTA BATU &middot; PROGRAM PARTNERUP 2026
            </div>
            <h1 className="text-base font-black text-[#001c3c]">
              LEMBAR KERJA STRATEGIS & PETA JALAN BISNIS
            </h1>
            <p className="text-[10px] text-slate-600">
              {activeModule.judulModul} &middot; {activeModule.subJudul}
            </p>
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-700 space-y-0.5">
          <div>Usaha: <strong className="text-slate-900">{selectedNamaUsaha || pesertaSession?.namaUsaha || '-'}</strong></div>
          <div>Pemilik: <strong className="text-slate-900">{namaPemilik || pesertaSession?.namaPemilik || '-'}</strong></div>
          <div>WhatsApp: <strong className="text-slate-900">{whatsapp || pesertaSession?.whatsapp || '-'}</strong></div>
          <div>Status: <strong className="text-slate-900">{currentStatus === 'reviewed' ? `Disetujui (${nilai}/100)` : currentStatus === 'submitted' ? 'Terkirim (Menunggu Review)' : 'Draf Lembar Kerja'}</strong></div>
          <div className="pt-1.5 flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUbahPinOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
              title="Ubah PIN Keamanan Akun Anda"
            >
              <Key className="w-3 h-3 text-amber-600" />
              <span>Ubah PIN</span>
            </button>
            <button
              type="button"
              onClick={() => setIsUntunginKasOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-900 border border-purple-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
              title="Buka Buku Kas & Laporan Keuangan Untungin (Fitur Premium)"
            >
              <Wallet className="w-3 h-3 text-purple-600" />
              <span>Buku Kas Untungin</span>
              <span className="text-[9px] bg-gradient-to-r from-amber-400 to-amber-500 text-[#001c3c] font-black px-1.5 py-0.2 rounded-full shadow-2xs flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5 fill-current" />
                <span>PRO</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-lg animate-in fade-in transition-all print:hidden ${
          notification.type === 'success' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-rose-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001c3c] via-[#002855] to-[#001730] text-white rounded-3xl p-5 sm:p-8 shadow-xl border border-[#003866] relative overflow-hidden print:p-5 print:rounded-2xl print:shadow-none print:border-slate-300">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none print:hidden" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 print:hidden" />
              <span>{activeModule.judulModul}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight print:text-xl">
              {activeModule.subJudul || 'Lembar Kerja & Peta Jalan Bisnis'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed print:text-xs">
              {activeModule.keterangan}
            </p>
          </div>

          {/* Tombol Aksi di Layar - Otomatis Hilang Saat Print / Download PDF */}
          <div className="flex items-center gap-2 flex-wrap print:hidden">
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
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs print:mt-3 print:pt-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Status Tugas:</span>
            {currentStatus === 'reviewed' && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 print:hidden" />
                Disetujui & Dinilai ({nilai}/100)
              </span>
            )}
            {currentStatus === 'submitted' && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 print:hidden" />
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
                <AlertCircle className="w-3.5 h-3.5 print:hidden" />
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
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        
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
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold flex items-center gap-1.5 shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Pilih atau Ketik Usaha
              </span>
            )}
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

              <div className="text-[11px] text-slate-600 bg-white/90 p-3 rounded-xl border border-slate-200 shadow-2xs max-w-sm leading-relaxed print:hidden">
                🔒 <strong>Perlindungan Data:</strong> Formulir ini terkunci otomatis untuk akun usaha Anda. Tugas yang Anda simpan atau kirim tidak akan tertukar dengan peserta lain.
              </div>
            </div>
          ) : (
            <>
              {/* Tampilan Ringkas Saat Print (Mode Non-login) */}
              <div className="hidden print:block p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 text-sm">{selectedNamaUsaha || '(Nama Usaha Belum Diisi)'}</div>
                <div className="text-slate-600 mt-0.5">
                  Pemilik: <strong>{namaPemilik || '-'}</strong> &middot; WhatsApp: <strong>{whatsapp || '-'}</strong> &middot; Subsektor: <strong>{subsektor}</strong>
                </div>
              </div>

              {/* Mode Pilih / Ketik UMKM Peserta (Hanya di Layar) */}
              <div className="space-y-3 print:hidden">
                <div className="text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  Pilih nama usaha Anda dari daftar terdaftar, atau ketik langsung nama usaha Anda:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Nama Usaha UMKM *</span>
                      <span className="text-[10px] text-slate-400 font-normal">Pilih atau Ketik Baru</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        list="registered-umkm-list"
                        value={selectedNamaUsaha}
                        onChange={(e) => setSelectedNamaUsaha(e.target.value)}
                        placeholder="Ketik atau pilih: Contoh: Kripik Apel Batu Mandiri"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-[#001c3c] focus:outline-none focus:ring-2 focus:ring-amber-400"
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
            </>
          )}
        </div>

        {/* PERTANYAAN TUGAS MODUL DINAMIS */}
        {(() => {
          // Kelompokkan pertanyaan berdasarkan kategori
          const groups: Record<string, TaskQuestionDef[]> = {};
          activeModule.pertanyaan.forEach((q) => {
            const kat = q.kategori || 'Pertanyaan & Lembar Kerja';
            if (!groups[kat]) groups[kat] = [];
            groups[kat].push(q);
          });

          return Object.entries(groups).map(([kategoriName, qList], groupIdx) => (
            <div key={kategoriName} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5 break-inside-avoid print:p-4 print:border-slate-300 print:shadow-none">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-5 h-5 text-[#001c3c] print:hidden" />
                  <div>
                    <h2 className="text-sm font-extrabold text-[#001c3c] uppercase tracking-wider">
                      {groupIdx + 2}. {kategoriName}
                    </h2>
                    <p className="text-[11px] text-slate-500 print:hidden">
                      Jawab pertanyaan tugas berikut sesuai kondisi dan target usaha Anda.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg print:border print:border-amber-300">
                  Bagian {groupIdx + 1}
                </span>
              </div>

              <div className="space-y-4">
                {qList.map((q) => {
                  const val = jawabanDinamis[q.id] !== undefined
                    ? jawabanDinamis[q.id]
                    : (q.id === 'visi' ? visi : q.id === 'misi' ? misi : q.id === 'goal' ? goal : q.id === 'objective' ? objective : q.id === 'nilaiUsaha' ? nilaiUsaha : q.id === 'keahlianOrganisasi' ? keahlianOrganisasi : '');

                  return (
                    <div key={q.id} className="space-y-1.5 break-inside-avoid">
                      <label className="text-xs font-black text-[#001c3c] flex items-center justify-between">
                        <span>
                          {q.label} {q.wajib && <span className="text-rose-600 font-bold print:hidden">*</span>}
                        </span>
                        {q.petunjuk && (
                          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline print:hidden">
                            {q.petunjuk}
                          </span>
                        )}
                      </label>

                      {q.tipe === 'textarea' ? (
                        <>
                          <textarea
                            value={val}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            rows={3}
                            placeholder={q.placeholder || 'Tuliskan jawaban Anda di sini...'}
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed bg-white font-medium print:hidden"
                          />
                          <div className="hidden print:block p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 leading-relaxed font-medium whitespace-pre-wrap min-h-[48px]">
                            {val.trim() || <span className="text-slate-400 italic">(Belum diisi)</span>}
                          </div>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder={q.placeholder || 'Tuliskan jawaban Anda di sini...'}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white font-medium print:hidden"
                          />
                          <div className="hidden print:block p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium">
                            {val.trim() || <span className="text-slate-400 italic">(Belum diisi)</span>}
                          </div>
                        </>
                      )}

                      {q.petunjuk && (
                        <p className="text-[10px] text-slate-400 italic print:hidden">
                          💡 Tips: {q.petunjuk}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ));
        })()}

        {/* BAGIAN MATRIKS PENGEMBANGAN KEAHLIAN & INOVASI 3x3 (JIKA AKTIF DI MODUL INI) */}
        {activeModule.includeMatrix3x3 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5 break-inside-avoid print:p-4 print:border-slate-300 print:shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-amber-500 print:hidden" />
              <div>
                <h2 className="text-sm font-extrabold text-[#001c3c] uppercase tracking-wider">
                  4. Matriks Pengembangan Keahlian (Innovation Matrix 3x3)
                </h2>
                <p className="text-[11px] text-slate-500 print:hidden">
                  Petakan langkah perbaikan dari masalah harian, peningkatan bertahap, hingga lompatan terobosan.
                </p>
              </div>
            </div>

            {/* Mobile Tab Selector */}
            <div className="flex md:hidden p-1 bg-slate-100 rounded-xl border border-slate-200 self-start print:hidden">
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

          {/* DESKTOP & PRINT VIEW: FULL 3x3 GRID TABLE (Tampil penuh saat cetak PDF) */}
          <div className="hidden md:block print:block overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 rounded-xl overflow-hidden text-xs print:border-slate-400">
              <thead>
                <tr className="bg-[#001c3c] text-white text-left print:bg-slate-800">
                  <th className="p-3 font-bold border border-slate-600 print:border-slate-400 w-1/4">
                    Tingkat Pengembangan
                  </th>
                  <th className="p-3 font-bold border border-slate-600 print:border-slate-400 w-1/4">
                    Recent (Saat Ini / 1-3 Bln)
                  </th>
                  <th className="p-3 font-bold border border-slate-600 print:border-slate-400 w-1/4">
                    Mid-Term (Menengah / 6-12 Bln)
                  </th>
                  <th className="p-3 font-bold border border-slate-600 print:border-slate-400 w-1/4">
                    Long-Term (Panjang / 2-3 Thn)
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1: Problem Solving */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 border border-slate-300 bg-slate-50 font-bold text-[#001c3c] align-top">
                    <div className="font-extrabold">Problem Solving</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5 print:hidden">
                      Penyelesaian kendala harian & hambatan teknis
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300 align-top">
                    <textarea
                      value={matriks.problemSolving.recent}
                      onChange={(e) => handleMatrixChange('problemSolving', 'recent', e.target.value)}
                      rows={3}
                      placeholder="Solusi kendala saat ini..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block text-xs text-slate-800 whitespace-pre-wrap p-1 font-medium">
                      {matriks.problemSolving.recent || '-'}
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300 align-top">
                    <textarea
                      value={matriks.problemSolving.midTerm}
                      onChange={(e) => handleMatrixChange('problemSolving', 'midTerm', e.target.value)}
                      rows={3}
                      placeholder="Solusi kendala jangka menengah..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block text-xs text-slate-800 whitespace-pre-wrap p-1 font-medium">
                      {matriks.problemSolving.midTerm || '-'}
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300 align-top">
                    <textarea
                      value={matriks.problemSolving.longTerm}
                      onChange={(e) => handleMatrixChange('problemSolving', 'longTerm', e.target.value)}
                      rows={3}
                      placeholder="Sistem pencegahan jangka panjang..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block text-xs text-slate-800 whitespace-pre-wrap p-1 font-medium">
                      {matriks.problemSolving.longTerm || '-'}
                    </div>
                  </td>
                </tr>

                {/* Row 2: Incremental */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 border border-slate-300 bg-slate-50 font-bold text-[#001c3c] align-top">
                    <div className="font-extrabold text-blue-950">Incremental</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5 print:hidden">
                      Peningkatan mutu, efisiensi & perbaikan bertahap
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300 align-top">
                    <textarea
                      value={matriks.incremental.recent}
                      onChange={(e) => handleMatrixChange('incremental', 'recent', e.target.value)}
                      rows={3}
                      placeholder="Perbaikan bertahap saat ini..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block text-xs text-slate-800 whitespace-pre-wrap p-1 font-medium">
                      {matriks.incremental.recent || '-'}
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300 align-top">
                    <textarea
                      value={matriks.incremental.midTerm}
                      onChange={(e) => handleMatrixChange('incremental', 'midTerm', e.target.value)}
                      rows={3}
                      placeholder="Peningkatan kapasitas & mutu menengah..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block text-xs text-slate-800 whitespace-pre-wrap p-1 font-medium">
                      {matriks.incremental.midTerm || '-'}
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300 align-top">
                    <textarea
                      value={matriks.incremental.longTerm}
                      onChange={(e) => handleMatrixChange('incremental', 'longTerm', e.target.value)}
                      rows={3}
                      placeholder="Standar mutu & ekspansi panjang..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block text-xs text-slate-800 whitespace-pre-wrap p-1 font-medium">
                      {matriks.incremental.longTerm || '-'}
                    </div>
                  </td>
                </tr>

                {/* Row 3: Breakthrough */}
                <tr className="hover:bg-amber-50/30">
                  <td className="p-3 border border-slate-300 bg-amber-50/50 font-bold text-amber-950 align-top">
                    <div className="font-extrabold text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 print:hidden" />
                      <span>Breakthrough</span>
                    </div>
                    <div className="text-[10px] text-amber-800/80 font-normal mt-0.5 print:hidden">
                      Lompatan inovasi baru, diferensiasi & terobosan
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300 align-top">
                    <textarea
                      value={matriks.breakthrough.recent}
                      onChange={(e) => handleMatrixChange('breakthrough', 'recent', e.target.value)}
                      rows={3}
                      placeholder="Eksperimen inovasi baru saat ini..."
                      className="w-full p-2 rounded-lg border border-amber-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block text-xs text-slate-800 whitespace-pre-wrap p-1 font-medium">
                      {matriks.breakthrough.recent || '-'}
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300 align-top">
                    <textarea
                      value={matriks.breakthrough.midTerm}
                      onChange={(e) => handleMatrixChange('breakthrough', 'midTerm', e.target.value)}
                      rows={3}
                      placeholder="Lompatan produk/pasar menengah..."
                      className="w-full p-2 rounded-lg border border-amber-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block text-xs text-slate-800 whitespace-pre-wrap p-1 font-medium">
                      {matriks.breakthrough.midTerm || '-'}
                    </div>
                  </td>
                  <td className="p-2 border border-slate-300 align-top">
                    <textarea
                      value={matriks.breakthrough.longTerm}
                      onChange={(e) => handleMatrixChange('breakthrough', 'longTerm', e.target.value)}
                      rows={3}
                      placeholder="Peluang terobosan besar masa depan..."
                      className="w-full p-2 rounded-lg border border-amber-200 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block text-xs text-slate-800 whitespace-pre-wrap p-1 font-medium">
                      {matriks.breakthrough.longTerm || '-'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW: TABBED CARDS FOR COMFORTABLE SMARTPHONE TYPING (Hilang saat cetak PDF) */}
          <div className="block md:hidden print:hidden space-y-4">
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
        )}

        {/* BOTTOM ACTION BAR - Hilang Saat Print / Download PDF */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 z-20 print:hidden">
          <div className="text-xs text-slate-500">
            Pastikan data sudah diperiksa sebelum mengirimkan ke kurator.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentStatus === 'reviewed' && !isPrivilegedAdmin ? (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tugas Selesai Dinilai ({nilai}/100) • Data Terkunci</span>
              </div>
            ) : (
              <>
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
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#001c3c] text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className={`w-4 h-4 text-[#001c3c] ${isSubmitting ? 'animate-bounce' : ''}`} />
                  <span>
                    {isSubmitting
                      ? 'Menyimpan & Mengirimkan...'
                      : currentStatus === 'submitted'
                      ? 'Perbarui Tugas Terkirim'
                      : currentStatus === 'revision'
                      ? 'Kirim Ulang Revisi'
                      : 'Kirim ke Kurator'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      {/* MODAL TANDA TERIMA & NOTIFIKASI WHATSAPP OTOMATIS */}
      {submissionReceipt && submissionReceipt.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scaleUp">
            {/* Header Dialog */}
            <div className="bg-gradient-to-r from-[#001c3c] to-[#0a3560] p-6 text-white text-center relative">
              <button
                type="button"
                onClick={() => setSubmissionReceipt(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 mb-3 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-white">
                Jawaban Berhasil Tercatat!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Dokumen Anda telah resmi masuk ke antrean kurasi
              </p>
            </div>

            {/* Nomor Urut Card */}
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-5 text-center shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 block">
                  NOMOR URUT ANTREAN RESMI
                </span>
                <div className="text-4xl sm:text-5xl font-black mt-1 font-mono tracking-tight drop-shadow-sm">
                  #{String(submissionReceipt.queueNumber).padStart(3, '0')}
                </div>
                <div className="text-[11px] text-emerald-100/90 mt-1 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{submissionReceipt.timestamp} WIB</span>
                </div>
              </div>

              {/* Data Usaha Card */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Usaha:</span>
                  <strong className="text-slate-900">{submissionReceipt.namaUsaha}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pemilik:</span>
                  <strong className="text-slate-900">{submissionReceipt.namaPemilik}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subsektor:</span>
                  <strong className="text-slate-900">{submissionReceipt.subsektor}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. WhatsApp:</span>
                  <strong className="text-emerald-700 font-mono">{submissionReceipt.whatsapp}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {submissionReceipt.waLink ? (
                  <a
                    href={submissionReceipt.waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all text-center"
                  >
                    <MessageCircle className="w-4 h-4 text-white shrink-0" />
                    <span>Kirim Tanda Terima ke WhatsApp ({submissionReceipt.whatsapp})</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs text-center">
                    Nomor WhatsApp belum terdaftar untuk tanda terima langsung.
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (submissionReceipt.waMessage) {
                        navigator.clipboard.writeText(submissionReceipt.waMessage);
                        setIsCopiedReceipt(true);
                        setTimeout(() => setIsCopiedReceipt(false), 2500);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    {isCopiedReceipt ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin Pesan Bukti</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmissionReceipt(null)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Untungin Kas Modal */}
      {isUntunginKasOpen && (
        <UntunginKasModal
          isOpen={isUntunginKasOpen}
          onClose={() => setIsUntunginKasOpen(false)}
          namaUsaha={selectedNamaUsaha || pesertaSession?.namaUsaha || 'obeecreatives'}
          namaPemilik={namaPemilik || pesertaSession?.namaPemilik}
          whatsapp={whatsapp || pesertaSession?.whatsapp}
          readOnly={false}
          viewerRole="peserta"
        />
      )}

      {/* Modal Ubah PIN Peserta */}
      {isUbahPinOpen && (
        <UbahPinPesertaModal
          isOpen={isUbahPinOpen}
          onClose={() => setIsUbahPinOpen(false)}
          namaUsaha={selectedNamaUsaha || pesertaSession?.namaUsaha || ''}
          namaPemilik={namaPemilik || pesertaSession?.namaPemilik}
        />
      )}
    </div>
  );
};
