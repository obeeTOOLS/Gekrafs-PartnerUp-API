import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Sparkles, 
  Save, 
  Eye, 
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FolderPlus
} from 'lucide-react';
import { taskConfigService } from '../services/taskConfigService';
import { TaskModuleDef, TaskQuestionDef } from '../types';

interface TaskQuestionEditorProps {
  userRole?: string;
  onPreviewTask?: () => void;
}

export const TaskQuestionEditor: React.FC<TaskQuestionEditorProps> = ({ userRole = 'kurator', onPreviewTask }) => {
  const [modules, setModules] = useState<TaskModuleDef[]>(() => {
    return taskConfigService.ensureDefaultModules();
  });
  const [selectedModuleId, setSelectedModuleId] = useState<string>(() => {
    const active = taskConfigService.getActiveModule();
    return active ? active.id : modules[0]?.id || 'modul-1';
  });

  // Pastikan kedua modul (Modul 1 & Modul 2 1PMP) selalu tersinkron saat komponen dimuat
  useEffect(() => {
    const all = taskConfigService.ensureDefaultModules();
    setModules(all);
  }, []);

  const currentModule = modules.find(m => m.id === selectedModuleId) || modules[0];

  // Form Edit Modul
  const [judulModul, setJudulModul] = useState(currentModule?.judulModul || '');
  const [subJudul, setSubJudul] = useState(currentModule?.subJudul || '');
  const [keterangan, setKeterangan] = useState(currentModule?.keterangan || '');
  const [includeMatrix3x3, setIncludeMatrix3x3] = useState(currentModule?.includeMatrix3x3 || false);

  // Modal Tambah/Edit Pertanyaan
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qKategori, setQKategori] = useState('');
  const [qLabel, setQLabel] = useState('');
  const [qPetunjuk, setQPetunjuk] = useState('');
  const [qPlaceholder, setQPlaceholder] = useState('');
  const [qTipe, setQTipe] = useState<'textarea' | 'text'>('textarea');
  const [qWajib, setQWajib] = useState(true);

  // Modal Tambah Modul Baru
  const [isNewModuleModalOpen, setIsNewModuleModalOpen] = useState(false);
  const [newModulJudul, setNewModulJudul] = useState('');
  const [newModulSubJudul, setNewModulSubJudul] = useState('');
  const [newModulKeterangan, setNewModulKeterangan] = useState('');
  const [newModulMatrix, setNewModulMatrix] = useState(false);

  // Notifikasi Feedback
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync state when selected module changes
  useEffect(() => {
    if (currentModule) {
      setJudulModul(currentModule.judulModul);
      setSubJudul(currentModule.subJudul || '');
      setKeterangan(currentModule.keterangan);
      setIncludeMatrix3x3(currentModule.includeMatrix3x3);
    }
  }, [selectedModuleId, currentModule]);

  const refreshModules = () => {
    setModules(taskConfigService.getModules());
  };

  const handleSaveModuleMeta = () => {
    if (!currentModule) return;
    if (!judulModul.trim()) {
      showToast('Judul modul pelatihan tidak boleh kosong.', 'error');
      return;
    }

    const updated: TaskModuleDef = {
      ...currentModule,
      judulModul: judulModul.trim(),
      subJudul: subJudul.trim(),
      keterangan: keterangan.trim(),
      includeMatrix3x3,
      diperbaruiOleh: userRole === 'developer' ? 'Lead Developer' : 'Kurator'
    };

    taskConfigService.saveModule(updated);
    refreshModules();
    showToast('Informasi modul pelatihan berhasil diperbarui!');
  };

  const handleSetActiveModule = (id: string) => {
    taskConfigService.setActiveModule(id);
    refreshModules();
    showToast('Modul ini sekarang menjadi tugas aktif bagi seluruh peserta!');
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setQKategori(currentModule?.pertanyaan[0]?.kategori || 'Tugas Utama');
    setQLabel('');
    setQPetunjuk('');
    setQPlaceholder('');
    setQTipe('textarea');
    setQWajib(true);
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: TaskQuestionDef) => {
    setEditingQuestionId(q.id);
    setQKategori(q.kategori || '');
    setQLabel(q.label);
    setQPetunjuk(q.petunjuk || '');
    setQPlaceholder(q.placeholder || '');
    setQTipe(q.tipe);
    setQWajib(q.wajib);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qLabel.trim()) {
      showToast('Teks pertanyaan wajib diisi.', 'error');
      return;
    }

    if (editingQuestionId) {
      taskConfigService.updateQuestion(currentModule.id, {
        id: editingQuestionId,
        kategori: qKategori.trim() || undefined,
        label: qLabel.trim(),
        petunjuk: qPetunjuk.trim() || undefined,
        placeholder: qPlaceholder.trim() || undefined,
        tipe: qTipe,
        wajib: qWajib
      });
      showToast('Pertanyaan berhasil diperbarui!');
    } else {
      taskConfigService.addQuestion(currentModule.id, {
        kategori: qKategori.trim() || undefined,
        label: qLabel.trim(),
        petunjuk: qPetunjuk.trim() || undefined,
        placeholder: qPlaceholder.trim() || undefined,
        tipe: qTipe,
        wajib: qWajib
      });
      showToast('Pertanyaan baru berhasil ditambahkan ke modul ini!');
    }

    refreshModules();
    setIsQuestionModalOpen(false);
  };

  const handleDeleteQuestion = (qId: string, qLabel: string) => {
    if (confirm(`Yakin ingin menghapus pertanyaan: "${qLabel}"?`)) {
      taskConfigService.deleteQuestion(currentModule.id, qId);
      refreshModules();
      showToast('Pertanyaan berhasil dihapus.');
    }
  };

  const handleCreateNewModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModulJudul.trim()) {
      showToast('Judul modul pelatihan tidak boleh kosong.', 'error');
      return;
    }

    const created = taskConfigService.createModule(
      newModulJudul,
      newModulSubJudul,
      newModulKeterangan,
      newModulMatrix,
      userRole === 'developer' ? 'Lead Developer' : 'Kurator'
    );

    refreshModules();
    setSelectedModuleId(created.id);
    setIsNewModuleModalOpen(false);
    setNewModulJudul('');
    setNewModulSubJudul('');
    setNewModulKeterangan('');
    setNewModulMatrix(false);
    showToast(`Modul baru "${created.judulModul}" berhasil dibuat! Silakan sesuaikan pertanyaannya.`);
  };

  const handleDeleteModule = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus modul pelatihan "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      const ok = taskConfigService.deleteModule(id);
      if (ok) {
        refreshModules();
        setSelectedModuleId(taskConfigService.getActiveModule().id);
        showToast('Modul pelatihan berhasil dihapus.');
      } else {
        showToast('Tidak dapat menghapus modul terakhir.', 'error');
      }
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Yakin ingin mereset seluruh pertanyaan modul ke standar bawaan (Pelatihan 1: Fondasi Strategi Bisnis)?')) {
      taskConfigService.resetToDefault();
      refreshModules();
      setSelectedModuleId('modul-1');
      showToast('Pertanyaan tugas telah dikembalikan ke bawaan awal.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-lg animate-in fade-in transition-all ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001c3c] via-[#003366] to-[#001f3f] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-400/30">
              <FileEdit className="w-3.5 h-3.5" />
              <span>Portal Kurator & Developer &middot; Manajemen Tugas</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Kelola Pertanyaan & Modul Tugas Peserta
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Buat, edit, dan atur pertanyaan tugas lembar aksi untuk setiap sesi pelatihan berikutnya secara langsung melalui web app ini tanpa perlu menyentuh kode program.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const all = taskConfigService.ensureDefaultModules();
                setModules(all);
                setSelectedModuleId('modul-2');
                showToast('📖 Modul 2 (The 1-Page Marketing Plan - Allan Dib) siap ditinjau!');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-[#001c3c] font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#001c3c]" />
              <span>📘 Modul 1PMP (Allan Dib)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewModuleModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs shadow-md transition-all border border-white/20 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-amber-300" />
              <span>+ Buat Modul Baru</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 text-xs font-bold transition-all border border-white/20 cursor-pointer"
              title="Reset kembali ke pertanyaan awal bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>Reset Standar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selector Modul Pelatihan */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#004c80]" />
            <span>Pilih Modul Pelatihan yang Ingin Diedit:</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            Total {modules.length} Modul Tersedia
          </span>
        </div>

        {/* Banner Pintasan Modul Allan Dib 1PMP */}
        <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Modul 2 Tersedia:</strong> The 1-Page Marketing Plan (Allan Dib) &middot; 9 Kotak Direct Response Marketing (Before, During, After).
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const all = taskConfigService.ensureDefaultModules();
              setModules(all);
              setSelectedModuleId('modul-2');
              showToast('📖 Modul 2 (The 1-Page Marketing Plan) siap diedit!');
            }}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#001c3c] font-black rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer shadow-xs self-start sm:self-auto"
          >
            {selectedModuleId === 'modul-2' ? '✓ Sedang Dipilih' : '👉 Buka Modul 1PMP'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {modules.map((m) => {
            const isSelected = m.id === selectedModuleId;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModuleId(m.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-300/60 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      m.aktif 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {m.aktif ? 'AKTIF DIKERJAKAN' : 'ARSIP / DRAF'}
                    </span>
                    {m.id === 'modul-2' && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[9px] border border-amber-300">
                        ⭐ Buku Allan Dib
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {m.pertanyaan.length} Soal
                  </span>
                </div>

                <div className="font-extrabold text-sm text-[#001c3c] mt-1 line-clamp-1">
                  {m.judulModul}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {m.subJudul || m.keterangan}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  {m.aktif ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Sedang Tampil</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetActiveModule(m.id);
                      }}
                      className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
                    >
                      Jadikan Aktif
                    </button>
                  )}

                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteModule(m.id, m.judulModul);
                      }}
                      className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                      title="Hapus Modul"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Detail Modul yang Dipilih */}
      {currentModule && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-200">
                  Modul #{currentModule.nomorPelatihan}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  currentModule.aktif
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}>
                  {currentModule.aktif ? '● Aktif untuk Peserta' : '○ Belum Aktif'}
                </span>
              </div>
              <h2 className="text-lg font-black text-[#001c3c] mt-1.5">
                Pengaturan Modul: {currentModule.judulModul}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {!currentModule.aktif && (
                <button
                  type="button"
                  onClick={() => handleSetActiveModule(currentModule.id)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Aktifkan Modul Ini ke Peserta</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveModuleMeta}
                className="px-4 py-2 rounded-xl bg-[#001c3c] hover:bg-[#002c5c] text-white text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Simpan Judul & Keterangan</span>
              </button>
            </div>
          </div>

          {/* Form Meta Modul */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Judul Modul Pelatihan *
              </label>
              <input
                type="text"
                value={judulModul}
                onChange={(e) => setJudulModul(e.target.value)}
                placeholder="Contoh: Pelatihan 2: Branding & Desain Kemasan"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sub-Judul / Topik Bahasan
              </label>
              <input
                type="text"
                value={subJudul}
                onChange={(e) => setSubJudul(e.target.value)}
                placeholder="Contoh: Desain Kemasan, Legalitas & Strategi Branding Produk"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Instruksi Pengisian Tugas untuk Peserta
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={2}
                placeholder="Instruksi panduan yang dibaca peserta saat membuka formulir tugas..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none bg-white text-slate-800 leading-relaxed"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between pt-1 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeMatrix"
                  checked={includeMatrix3x3}
                  onChange={(e) => setIncludeMatrix3x3(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="includeMatrix" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Sertakan Matriks Inovasi 3x3 (Horizon Matrix: Problem Solving, Incremental, Breakthrough)
                </label>
              </div>
              <span className="text-[11px] text-slate-500 italic">
                {includeMatrix3x3 ? 'Matriks 3x3 akan tampil di formulir' : 'Formulir murni pertanyaan esai'}
              </span>
            </div>
          </div>

          {/* Bagian Daftar Pertanyaan */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-[#001c3c] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span>Daftar Pertanyaan Tugas ({currentModule.pertanyaan.length} Soal)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pertanyaan di bawah ini langsung muncul pada halaman "Lembar Aksi" ketika modul ini aktif.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddQuestion}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer self-start"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Pertanyaan Baru</span>
              </button>
            </div>

            {currentModule.pertanyaan.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <div className="text-sm font-bold text-slate-800">Belum Ada Pertanyaan di Modul Ini</div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Klik tombol "+ Tambah Pertanyaan Baru" di atas untuk mulai membuat pertanyaan tugas bagi peserta.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentModule.pertanyaan.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {q.kategori && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                                {q.kategori}
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              q.wajib 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {q.wajib ? 'Wajib Diisi' : 'Opsional'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Tipe: {q.tipe === 'textarea' ? 'Paragraf Panjang' : 'Teks Singkat'}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-sm text-[#001c3c] mt-1.5">
                            {q.label}
                          </h4>

                          {q.petunjuk && (
                            <p className="text-xs text-slate-500 mt-0.5 italic">
                              💡 Tips: {q.petunjuk}
                            </p>
                          )}

                          {q.placeholder && (
                            <p className="text-[11px] text-slate-400 font-mono mt-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 inline-block max-w-full truncate">
                              Contoh: {q.placeholder}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditQuestion(q)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Edit Teks Pertanyaan"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id, q.label)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Hapus Pertanyaan"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Pertanyaan */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#001c3c]">
                    {editingQuestionId ? 'Edit Pertanyaan Tugas' : 'Tambah Pertanyaan Tugas Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modul: {currentModule?.judulModul}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori / Bagian Soal (Opsional)
                </label>
                <input
                  type="text"
                  value={qKategori}
                  onChange={(e) => setQKategori(e.target.value)}
                  placeholder="Contoh: Fondasi Strategi, Rencana Pemasaran, Finansial"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Teks Pertanyaan / Label Tugas *
                </label>
                <textarea
                  required
                  value={qLabel}
                  onChange={(e) => setQLabel(e.target.value)}
                  rows={2}
                  placeholder="Contoh: Apa target konkret peningkatan omzet usaha Anda dalam 90 hari ke depan?"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none font-semibold text-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Petunjuk / Tips Panduan (Sub-label)
                </label>
                <input
                  type="text"
                  value={qPetunjuk}
                  onChange={(e) => setQPetunjuk(e.target.value)}
                  placeholder="Contoh: Gunakan format angka terukur dan sebutkan strategi utamanya"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Placeholder / Contoh Jawaban
                </label>
                <textarea
                  value={qPlaceholder}
                  onChange={(e) => setQPlaceholder(e.target.value)}
                  rows={2}
                  placeholder="Contoh isian yang muncul sebelum peserta mengetik..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none text-slate-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Format Isian Peserta
                  </label>
                  <select
                    value={qTipe}
                    onChange={(e) => setQTipe(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="textarea">Paragraf Panjang (Textarea)</option>
                    <option value="text">Teks Singkat (1 Baris)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kewajiban Pengisian
                  </label>
                  <select
                    value={qWajib ? 'wajib' : 'opsional'}
                    onChange={(e) => setQWajib(e.target.value === 'wajib')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="wajib">Wajib Diisi (Mandatory)</option>
                    <option value="opsional">Opsional (Boleh Kosong)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#001c3c] hover:bg-[#002c5c] text-white text-xs font-bold rounded-lg shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simpan Pertanyaan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Modul Baru */}
      {isNewModuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <FolderPlus className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#001c3c]">
                    Buat Modul Pelatihan Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tambahkan sesi tugas untuk materi pelatihan berikutnya
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModuleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateNewModule} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Modul Pelatihan *
                </label>
                <input
                  type="text"
                  required
                  value={newModulJudul}
                  onChange={(e) => setNewModulJudul(e.target.value)}
                  placeholder="Contoh: Pelatihan 2: Branding & Desain Kemasan"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sub-Judul / Topik
                </label>
                <input
                  type="text"
                  value={newModulSubJudul}
                  onChange={(e) => setNewModulSubJudul(e.target.value)}
                  placeholder="Contoh: Standarisasi Legalitas NIB, P-IRT, & Sertifikasi Halal"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Instruksi Singkat untuk Peserta
                </label>
                <textarea
                  value={newModulKeterangan}
                  onChange={(e) => setNewModulKeterangan(e.target.value)}
                  rows={2}
                  placeholder="Jawab pertanyaan tugas berikut sesuai arahan narasumber..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none text-slate-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newModulMatrix"
                  checked={newModulMatrix}
                  onChange={(e) => setNewModulMatrix(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="newModulMatrix" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Sertakan Matriks Inovasi 3x3 di formulir modul ini
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModuleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Buat Modul Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
