import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Compass, 
  Layers, 
  Building2, 
  MessageSquare, 
  ExternalLink, 
  Save, 
  X, 
  Sparkles,
  Phone,
  Printer,
  ChevronRight
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { StrategicCanvasTask } from '../types';

interface StrategicRoadmapReviewProps {
  reviewerName?: string;
  onOpenPesertaForm?: (namaUsaha: string) => void;
  onOpenQuestionEditor?: () => void;
}

export const StrategicRoadmapReview: React.FC<StrategicRoadmapReviewProps> = ({
  reviewerName = 'Tim Kurator Gekrafs',
  onOpenPesertaForm,
  onOpenQuestionEditor
}) => {
  const [tasks, setTasks] = useState<StrategicCanvasTask[]>(() => taskService.getAllTasks());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<StrategicCanvasTask | null>(null);

  // Review Modal state
  const [reviewScore, setReviewScore] = useState<number>(85);
  const [reviewNotes, setCatatan] = useState<string>('');
  const [reviewStatus, setReviewStatus] = useState<'reviewed' | 'revision'>('reviewed');
  const [toast, setToast] = useState<string | null>(null);

  const refreshTasks = () => {
    setTasks(taskService.getAllTasks());
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.namaUsaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.namaPemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subsektor && t.subsektor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSubmitted = tasks.filter(t => t.status === 'submitted').length;
  const totalReviewed = tasks.filter(t => t.status === 'reviewed').length;
  const totalDraft = tasks.filter(t => t.status === 'draft').length;

  const handleOpenReviewModal = (task: StrategicCanvasTask) => {
    setSelectedTask(task);
    setReviewScore(task.nilai !== undefined ? task.nilai : 85);
    setCatatan(task.catatanKurator || '');
    setReviewStatus(task.status === 'revision' ? 'revision' : 'reviewed');
  };

  const handleSaveReview = () => {
    if (!selectedTask) return;

    taskService.reviewTask(selectedTask.id, {
      nilai: Number(reviewScore),
      catatanKurator: reviewNotes,
      reviewerName,
      status: reviewStatus
    });

    refreshTasks();
    setToast(`Penilaian untuk ${selectedTask.namaUsaha} berhasil disimpan!`);
    setSelectedTask(null);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSendWaFeedback = (task: StrategicCanvasTask) => {
    if (!task.whatsapp) return;
    const cleanPhone = task.whatsapp.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    const message = encodeURIComponent(
      `*Halo Kak ${task.namaPemilik} (${task.namaUsaha})!* 👋\n\n` +
      `Lembar Aksi & Peta Jalan Bisnis Anda di *GEKRAFS PartnerUp 2026 Kota Batu* telah selesai direview oleh tim kurator:\n\n` +
      `🏆 *Status:* ${task.status === 'reviewed' ? 'Disetujui (Lulus)' : 'Perlu Revisi'}\n` +
      (task.nilai !== undefined ? `⭐ *Skor:* ${task.nilai}/100\n` : '') +
      `📝 *Catatan Kurator:*\n"${task.catatanKurator || '-'}"\n\n` +
      `Silakan cek hasil lengkapnya dan cetak lembar peta jalan bisnis Anda di portal PartnerUp:\n` +
      `https://ais-dev-ijwjef33hzkvilef4tuyto-118536196094.asia-east1.run.app\n\n` +
      `_Salam Kreatif,_\n*Tim Kurator GEKRAFS Kota Batu*`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center shadow animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Header Info & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-extrabold text-[#001c3c]">
            Review & Penilaian Lembar Aksi Peserta
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Periksa hasil tugas peserta, berikan skor kelulusan, dan kirimkan umpan balik via WhatsApp.
          </p>
        </div>
        {onOpenQuestionEditor && (
          <button
            type="button"
            onClick={onOpenQuestionEditor}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start"
          >
            <span>📝 Kelola & Tambah Soal Tugas</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Lembar Aksi</div>
          <div className="text-2xl font-black text-[#001c3c] mt-1">{tasks.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Seluruh peserta</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Perlu Direview</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{totalSubmitted}</div>
          <div className="text-[10px] text-amber-700 mt-0.5">Menunggu penilaian kurator</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Sudah Dinilai</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalReviewed}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Selesai diberi feedback</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Draf Peserta</div>
          <div className="text-2xl font-black text-slate-600 mt-1">{totalDraft}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sedang dicicil peserta</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama usaha atau pemilik..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Status:</span>
          {(['all', 'submitted', 'reviewed', 'revision', 'draft'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#001c3c] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Semua' : st === 'submitted' ? 'Terkirim' : st === 'reviewed' ? 'Disetujui' : st === 'revision' ? 'Revisi' : 'Draf'}
            </button>
          ))}
        </div>
      </div>

      {/* Task Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#001c3c] text-white">
              <tr>
                <th className="p-3.5 font-bold">Nama Usaha / Peserta</th>
                <th className="p-3.5 font-bold">Subsektor</th>
                <th className="p-3.5 font-bold">Objective SMART 3 Bln</th>
                <th className="p-3.5 font-bold text-center">Status</th>
                <th className="p-3.5 font-bold text-center">Nilai</th>
                <th className="p-3.5 font-bold text-right">Aksi Kurator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                    Belum ada data lembar aksi yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-extrabold text-[#001c3c]">{task.namaUsaha}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{task.namaPemilik} • {task.whatsapp}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-md text-[10px]">
                        {task.subsektor || 'Ekraf'}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="line-clamp-2 text-slate-600 font-normal text-[11px]">
                        {task.objective || <span className="text-slate-300 italic">Belum diisi</span>}
                      </p>
                    </td>
                    <td className="p-3.5 text-center">
                      {task.status === 'reviewed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Disetujui
                        </span>
                      )}
                      {task.status === 'submitted' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          <Clock className="w-3 h-3" />
                          Perlu Review
                        </span>
                      )}
                      {task.status === 'revision' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                          <AlertCircle className="w-3 h-3" />
                          Perlu Revisi
                        </span>
                      )}
                      {task.status === 'draft' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
                          Draf
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      {task.nilai !== undefined ? (
                        <span className="px-2.5 py-1 bg-[#001c3c] text-amber-400 font-black rounded-lg text-xs">
                          {task.nilai}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-mono">-</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenReviewModal(task)}
                          className="px-3 py-1.5 rounded-lg bg-[#001c3c] hover:bg-[#002855] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          Review & Nilai
                        </button>

                        {task.whatsapp && task.status === 'reviewed' && (
                          <button
                            type="button"
                            onClick={() => handleSendWaFeedback(task)}
                            title="Kirim Hasil Nilai ke WhatsApp Peserta"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REVIEW DETAIL & PENILAIAN */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-[#001c3c] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#003866]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-[#001c3c] font-black text-[10px] uppercase">
                    Kurasi Lembar Aksi
                  </span>
                  <span className="text-xs text-slate-300 font-medium">{selectedTask.sesiPartnerUp}</span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  {selectedTask.namaUsaha}
                </h3>
                <p className="text-xs text-amber-300">
                  Founder: {selectedTask.namaPemilik} • WA: {selectedTask.whatsapp} • Subsektor: {selectedTask.subsektor}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
              
              {/* Bagian 1: Strategic Intent */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#001c3c] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span>1. Fondasi Strategis (Strategic Intent)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-extrabold text-[#001c3c] block mb-1">Visi (Gambaran Masa Depan):</span>
                    <p className="text-slate-600 leading-relaxed">{selectedTask.visi || '-'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-extrabold text-[#001c3c] block mb-1">Misi (Value & Target Audiens):</span>
                    <p className="text-slate-600 leading-relaxed">{selectedTask.misi || '-'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-extrabold text-[#001c3c] block mb-1">Goal (Sasaran Arah Besar):</span>
                    <p className="text-slate-600 leading-relaxed">{selectedTask.goal || '-'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                    <span className="font-extrabold text-amber-950 block mb-1">Objective SMART (90 Hari):</span>
                    <p className="text-amber-900 font-medium leading-relaxed">{selectedTask.objective || '-'}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-extrabold text-[#001c3c] block mb-1">Nilai-nilai dalam Usaha:</span>
                  <p className="text-slate-600">{selectedTask.nilaiUsaha || '-'}</p>
                </div>
              </div>

              {/* Bagian 2: Keahlian Organisasi */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-[#001c3c] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>2. Keahlian Organisasi Saat Ini</span>
                </h4>
                <div className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 text-slate-700 leading-relaxed">
                  {selectedTask.keahlianOrganisasi || '-'}
                </div>
              </div>

              {/* Bagian 3: Matriks 3x3 Horizon */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#001c3c] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>3. Matriks Horizon Pengembangan Keahlian (3x3)</span>
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-[11px] border-collapse">
                    <thead className="bg-slate-100 text-[#001c3c]">
                      <tr>
                        <th className="p-2.5 font-bold border border-slate-200 w-1/4">Tingkat</th>
                        <th className="p-2.5 font-bold border border-slate-200 w-1/4">Recent (1-3 Bln)</th>
                        <th className="p-2.5 font-bold border border-slate-200 w-1/4">Mid-Term (6-12 Bln)</th>
                        <th className="p-2.5 font-bold border border-slate-200 w-1/4">Long-Term (2-3 Thn)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2.5 font-bold bg-slate-50 border border-slate-200 text-[#001c3c]">Problem Solving</td>
                        <td className="p-2.5 border border-slate-200">{selectedTask.matriks?.problemSolving?.recent || '-'}</td>
                        <td className="p-2.5 border border-slate-200">{selectedTask.matriks?.problemSolving?.midTerm || '-'}</td>
                        <td className="p-2.5 border border-slate-200">{selectedTask.matriks?.problemSolving?.longTerm || '-'}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold bg-slate-50 border border-slate-200 text-[#001c3c]">Incremental</td>
                        <td className="p-2.5 border border-slate-200">{selectedTask.matriks?.incremental?.recent || '-'}</td>
                        <td className="p-2.5 border border-slate-200">{selectedTask.matriks?.incremental?.midTerm || '-'}</td>
                        <td className="p-2.5 border border-slate-200">{selectedTask.matriks?.incremental?.longTerm || '-'}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold bg-amber-50/50 border border-slate-200 text-amber-900">Breakthrough</td>
                        <td className="p-2.5 border border-slate-200 font-medium text-amber-950">{selectedTask.matriks?.breakthrough?.recent || '-'}</td>
                        <td className="p-2.5 border border-slate-200 font-medium text-amber-950">{selectedTask.matriks?.breakthrough?.midTerm || '-'}</td>
                        <td className="p-2.5 border border-slate-200 font-medium text-amber-950">{selectedTask.matriks?.breakthrough?.longTerm || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Panel Input Penilaian Kurator */}
              <div className="bg-amber-50/60 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 space-y-4">
                <div className="flex items-center gap-2 text-amber-950 font-black">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>Formulir Penilaian & Umpan Balik Mentor</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Nilai Skor */}
                  <div className="space-y-1">
                    <label className="font-extrabold text-amber-950">Skor Kelulusan (0 - 100):</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={reviewScore}
                      onChange={(e) => setReviewScore(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 font-black text-sm text-[#001c3c] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Status Kelulusan Tugas */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-extrabold text-amber-950">Keputusan Kurasi:</label>
                    <div className="flex items-center gap-3 pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-800">
                        <input
                          type="radio"
                          name="reviewStatus"
                          value="reviewed"
                          checked={reviewStatus === 'reviewed'}
                          onChange={() => setReviewStatus('reviewed')}
                          className="text-emerald-600"
                        />
                        <span>Disetujui (Lulus Syarat)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-800">
                        <input
                          type="radio"
                          name="reviewStatus"
                          value="revision"
                          checked={reviewStatus === 'revision'}
                          onChange={() => setReviewStatus('revision')}
                          className="text-rose-600"
                        />
                        <span>Perlu Revisi Peserta</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Catatan Feedback */}
                <div className="space-y-1">
                  <label className="font-extrabold text-amber-950">
                    Catatan Pembinaan / Masukan Aksi Nyata Mentor:
                  </label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Tuliskan masukan untuk mempertajam strategi atau eksekusi UMKM..."
                    className="w-full p-3 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <div className="flex items-center gap-2">
                {selectedTask.whatsapp && (
                  <button
                    type="button"
                    onClick={() => handleSendWaFeedback(selectedTask)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Kirim ke WA</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#001c3c] hover:bg-[#002855] text-amber-400 text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Penilaian</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
