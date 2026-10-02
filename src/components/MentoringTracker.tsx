import React, { useState, useEffect, useMemo } from 'react';
import { PesertaItem, MentoringLogItem } from '../types';
import { 
  Users, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  FileText, 
  MessageCircle,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';

interface MentoringTrackerProps {
  pesertaList: PesertaItem[];
}

const STORAGE_KEY = 'gkf_mentoring_logs';

const INITIAL_LOGS: MentoringLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-03-12T10:00:00Z',
    namaUsaha: 'Kripik Apel Manalagi Batu',
    namaKurator: 'Kurator Finansial Gekrafs',
    tanggal: '12 Maret 2026',
    topik: 'Finance - Pemisahan Rekening & Penentuan HPP',
    tantangan: 'Uang operasional warung masih bercampur dengan tabungan keluarga harian.',
    rekomendasiAksi: 'Buka rekening bank digital terpisah khusus usaha dan catat pengeluaran bahan baku di Buku Kas.',
    tenggatWaktu: '19 Maret 2026',
    status: 'Selesai'
  },
  {
    id: 'log-2',
    timestamp: '2026-03-14T14:30:00Z',
    namaUsaha: 'Batu Ceramic Creative Art',
    namaKurator: 'Mentor Branding & Desain',
    tanggal: '14 Maret 2026',
    topik: 'Marketing - Redesain Kemasan & Instagram Feed',
    tantangan: 'Foto produk di medsos belum konsisten pencahayaannya dan belum ada katalog harga.',
    rekomendasiAksi: 'Lakukan sesi foto mini studio menggunakan pencahayaan natural dan buat feed karosel.',
    tenggatWaktu: '22 Maret 2026',
    status: 'Dalam Progres'
  },
  {
    id: 'log-3',
    timestamp: '2026-03-16T11:00:00Z',
    namaUsaha: 'Kopi Lereng Panderman',
    namaKurator: 'Kurator Operasional',
    tanggal: '16 Maret 2026',
    topik: 'Operation - Standarisasi SOP Roasting & Legalitas NIB',
    tantangan: 'Kualitas rasa sangrai belum tercatat parameternya, NIB belum terbit.',
    rekomendasiAksi: 'Dampingi pengisian form OSS RBA untuk penerbitan NIB mandiri.',
    tenggatWaktu: '25 Maret 2026',
    status: 'Dalam Progres'
  }
];

export const MentoringTracker: React.FC<MentoringTrackerProps> = ({ pesertaList }) => {
  const [logs, setLogs] = useState<MentoringLogItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_LOGS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedUsaha, setSelectedUsaha] = useState(pesertaList[0]?.namaUsaha || '');
  const [kuratorName, setKuratorName] = useState('Kurator GEKRAFS');
  const [topik, setTopik] = useState('Finance & Pembukuan Kas');
  const [tantangan, setTantangan] = useState('');
  const [rekomendasiAksi, setRekomendasiAksi] = useState('');
  const [tenggatWaktu, setTenggatWaktu] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch {}
  }, [logs]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUsaha || !tantangan || !rekomendasiAksi) return;

    const newLog: MentoringLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      namaUsaha: selectedUsaha,
      namaKurator: kuratorName.trim() || 'Kurator GEKRAFS',
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      topik,
      tantangan,
      rekomendasiAksi,
      tenggatWaktu: tenggatWaktu || '1 Pekan Kedepan',
      status: 'Dalam Progres'
    };

    setLogs([newLog, ...logs]);
    setIsModalOpen(false);
    setTantangan('');
    setRekomendasiAksi('');
  };

  const toggleStatus = (id: string) => {
    setLogs(
      logs.map((l) => {
        if (l.id === id) {
          const nextStatus = l.status === 'Selesai' ? 'Dalam Progres' : 'Selesai';
          return { ...l, status: nextStatus };
        }
        return l;
      })
    );
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        l.namaUsaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.namaKurator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.topik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.rekomendasiAksi.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'Semua Status' || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [logs, searchQuery, statusFilter]);

  const totalSessions = logs.length;
  const completedActions = logs.filter((l) => l.status === 'Selesai').length;
  const pendingActions = logs.filter((l) => l.status === 'Dalam Progres').length;

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#004c80] uppercase tracking-wide">
            <Users className="w-4 h-4 text-[#004c80]" />
            <span>Coaching & Mentoring Tracker</span>
          </div>
          <h2 className="text-lg font-black text-[#001c3c] mt-0.5">
            Logbook Pendampingan 1-on-1 UMKM
          </h2>
          <p className="text-xs text-slate-500">
            Catatan berkala sesi mentoring mentor ahli dengan pelaku usaha, kendala riil, dan tindak lanjut *action plan*.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#001c3c] hover:bg-[#004c80] text-white text-xs font-bold shadow transition-all cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Catatan Mentoring</span>
        </button>
      </div>

      {/* 2. Ringkasan Metrik Sesi Mentoring */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#004c80] flex items-center justify-center text-xl font-black">
            {totalSessions}
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Total Sesi Mentoring</div>
            <div className="text-sm font-extrabold text-[#001c3c]">Terdokumentasi</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center text-xl font-black">
            {completedActions}
          </div>
          <div>
            <div className="text-xs text-emerald-700 font-bold uppercase">PR / Target Selesai</div>
            <div className="text-sm font-extrabold text-emerald-950">Action Item Tervalidasi</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-xl font-black">
            {pendingActions}
          </div>
          <div>
            <div className="text-xs text-amber-700 font-bold uppercase">Target Dalam Progres</div>
            <div className="text-sm font-extrabold text-amber-950">Menunggu Checkpoint</div>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama usaha, mentor, topik, atau action item..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004c80]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold text-[#001c3c] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Dalam Progres">Dalam Progres</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* 4. Daftar Log Mentoring Cards */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            Belum ada catatan mentoring yang sesuai dengan pencarian.
          </div>
        ) : (
          filteredLogs.map((item) => {
            const isDone = item.status === 'Selesai';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-50 text-[#004c80] flex items-center justify-center font-bold text-xs">
                      ☕
                    </span>
                    <div>
                      <h4 className="font-black text-sm text-[#001c3c]">{item.namaUsaha}</h4>
                      <p className="text-[11px] text-slate-500">
                        Mentor: <strong>{item.namaKurator}</strong> • {item.tanggal}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {item.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleStatus(item.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-600 cursor-pointer"
                    >
                      {isDone ? 'Buka Kembali' : 'Tandai Selesai'}
                    </button>
                  </div>
                </div>

                {/* Topik & Tantangan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Topik Diskusi / Masalah Utama
                    </span>
                    <strong className="text-slate-800 text-xs block mt-0.5">{item.topik}</strong>
                    <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{item.tantangan}</p>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block flex items-center justify-between">
                      <span>Rencana Aksi / PR Peserta</span>
                      <span className="font-mono text-emerald-900">Deadline: {item.tenggatWaktu}</span>
                    </span>
                    <p className="text-emerald-950 font-medium mt-1 leading-relaxed text-[11px]">
                      {item.rekomendasiAksi}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Modal Tambah Log Mentoring */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-[#004c80]" />
                <h3 className="font-black text-sm sm:text-base text-[#001c3c]">
                  Catat Sesi Mentoring 1-on-1 Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Usaha Peserta:</label>
                <select
                  value={selectedUsaha}
                  onChange={(e) => setSelectedUsaha(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  {pesertaList.map((p) => (
                    <option key={p.namaUsaha} value={p.namaUsaha}>
                      {p.namaUsaha} ({p.namaPemilik})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Kurator / Mentor:</label>
                <input
                  type="text"
                  value={kuratorName}
                  onChange={(e) => setKuratorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Contoh: Kurator Finansial Gekrafs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilar / Topik Pembinaan:</label>
                <input
                  type="text"
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Contoh: Finance - Pemisahan Rekening Kas"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tantangan / Kendala UMKM:</label>
                <textarea
                  value={tantangan}
                  onChange={(e) => setTantangan(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Ceritakan kendala spesifik yang ditemukan saat sesi konsultasi..."
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Rekomendasi Tindakan / PR Peserta (Action Plan):
                </label>
                <textarea
                  value={rekomendasiAksi}
                  onChange={(e) => setRekomendasiAksi(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Tugas konkret yang harus dikerjakan sebelum pertemuan berikutnya..."
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tenggat Waktu Checkpoint:</label>
                <input
                  type="text"
                  value={tenggatWaktu}
                  onChange={(e) => setTenggatWaktu(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Contoh: 25 Maret 2026 / 1 Pekan"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#001c3c] hover:bg-[#004c80] text-white font-bold cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
