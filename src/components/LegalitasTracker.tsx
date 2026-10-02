import React, { useState, useEffect, useMemo } from 'react';
import { PesertaItem, LegalitasItem } from '../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  Plus,
  Printer,
  Sparkles,
  Building2,
  X,
  FileCheck
} from 'lucide-react';

interface LegalitasTrackerProps {
  pesertaList: PesertaItem[];
}

const STORAGE_KEY = 'gkf_legalitas_items';

export const LegalitasTracker: React.FC<LegalitasTrackerProps> = ({ pesertaList }) => {
  const [legalitasList, setLegalitasList] = useState<LegalitasItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    // Initialize from pesertaList
    return pesertaList.map((p, idx) => {
      const hasNib = p.nib && p.nib.trim() !== '' && p.nib.length > 5;
      return {
        id: `leg-${idx + 1}`,
        namaUsaha: p.namaUsaha,
        namaPemilik: p.namaPemilik,
        subsektor: p.subsektor,
        whatsapp: p.whatsapp,
        jenisLegalitas: 'NIB (OSS)',
        statusPengajuan: hasNib ? 'Terbit' : 'Belum Diajukan',
        nomorIzin: hasNib ? p.nib : '',
        tanggalTerbit: hasNib ? '2025/2026' : undefined,
        catatan: hasNib ? 'NIB terverifikasi aktif di OSS' : 'Perlu pendampingan input data OSS RBA'
      };
    });
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [jenisFilter, setJenisFilter] = useState('Semua Jenis');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [editingItem, setEditingItem] = useState<LegalitasItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legalitasList));
    } catch {}
  }, [legalitasList]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLegalitasList((prev) =>
      prev.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
  };

  const filteredList = useMemo(() => {
    return legalitasList.filter((item) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        item.namaUsaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namaPemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nomorIzin && item.nomorIzin.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchJenis = jenisFilter === 'Semua Jenis' || item.jenisLegalitas === jenisFilter;
      const matchStatus = statusFilter === 'Semua Status' || item.statusPengajuan === statusFilter;

      return matchSearch && matchJenis && matchStatus;
    });
  }, [legalitasList, searchQuery, jenisFilter, statusFilter]);

  const stats = useMemo(() => {
    const terbit = legalitasList.filter((l) => l.statusPengajuan === 'Terbit').length;
    const proses = legalitasList.filter(
      (l) => l.statusPengajuan === 'Proses Verifikasi' || l.statusPengajuan === 'Pemberkasan'
    ).length;
    const belum = legalitasList.filter((l) => l.statusPengajuan === 'Belum Diajukan').length;
    return { terbit, proses, belum, total: legalitasList.length || 1 };
  }, [legalitasList]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#004c80] uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#004c80]" />
            <span>Klinik & Fasilitasi Legalitas Usaha</span>
          </div>
          <h2 className="text-lg font-black text-[#001c3c] mt-0.5">
            Pelacak Kepatuhan NIB, Sertifikasi Halal & HKI Merek
          </h2>
          <p className="text-xs text-slate-500">
            Monitoring proses legalitas izin usaha resmi bekerja sama dengan DPMPTSP dan Dinas Koperasi UKM Kota Batu.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#001c3c] hover:bg-[#004c80] text-white text-xs font-bold shadow transition-all cursor-pointer flex-shrink-0"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Rekap Fasilitasi</span>
        </button>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center text-xl font-black">
            {stats.terbit}
          </div>
          <div>
            <div className="text-xs text-emerald-700 font-bold uppercase">Legalitas Terbit</div>
            <div className="text-sm font-extrabold text-emerald-950">
              {((stats.terbit / stats.total) * 100).toFixed(1)}% Kepatuhan Aktif
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-blue-50 rounded-2xl border border-blue-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-200 text-[#004c80] flex items-center justify-center text-xl font-black">
            {stats.proses}
          </div>
          <div>
            <div className="text-xs text-blue-700 font-bold uppercase">Dalam Pendampingan</div>
            <div className="text-sm font-extrabold text-blue-950">Pemberkasan / Verifikasi OSS</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-rose-50 rounded-2xl border border-rose-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center text-xl font-black">
            {stats.belum}
          </div>
          <div>
            <div className="text-xs text-rose-700 font-bold uppercase">Belum Memiliki Izin</div>
            <div className="text-sm font-extrabold text-rose-950">Prioritas Klinik Legalitas</div>
          </div>
        </div>
      </div>

      {/* 3. Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama usaha, pemilik, atau nomor izin..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004c80]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="font-bold text-[#001c3c] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="Semua Jenis">Semua Jenis Legalitas</option>
            <option value="NIB (OSS)">NIB (OSS)</option>
            <option value="Sertifikasi Halal">Sertifikasi Halal</option>
            <option value="P-IRT">P-IRT</option>
            <option value="HKI Merek">HKI Merek</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="font-bold text-[#001c3c] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Terbit">Terbit</option>
            <option value="Proses Verifikasi">Proses Verifikasi</option>
            <option value="Pemberkasan">Pemberkasan</option>
            <option value="Belum Diajukan">Belum Diajukan</option>
          </select>
        </div>
      </div>

      {/* 4. Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Usaha & Pemilik</th>
                <th className="py-3 px-4">Subsektor</th>
                <th className="py-3 px-4">Jenis Legalitas</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Nomor Izin / Catatan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item) => {
                const isTerbit = item.statusPengajuan === 'Terbit';
                const isProses =
                  item.statusPengajuan === 'Proses Verifikasi' ||
                  item.statusPengajuan === 'Pemberkasan';
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-[#001c3c]">{item.namaUsaha}</div>
                      <div className="text-[11px] text-slate-500">{item.namaPemilik}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{item.subsektor}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#004c80]">{item.jenisLegalitas}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          isTerbit
                            ? 'bg-emerald-100 text-emerald-800'
                            : isProses
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isTerbit ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.statusPengajuan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.nomorIzin ? (
                        <div className="font-mono font-bold text-slate-800">{item.nomorIzin}</div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum terbit</span>
                      )}
                      <div className="text-[11px] text-slate-500 line-clamp-1">{item.catatan}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#001c3c] hover:text-white text-slate-700 font-bold transition-colors cursor-pointer"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Edit Legalitas */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-sm text-[#001c3c]">
                Update Status Legalitas Usaha
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Usaha:</label>
                <input
                  type="text"
                  value={editingItem.namaUsaha}
                  disabled
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Jenis Legalitas:</label>
                <select
                  value={editingItem.jenisLegalitas}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      jenisLegalitas: e.target.value as any
                    })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="NIB (OSS)">NIB (OSS)</option>
                  <option value="Sertifikasi Halal">Sertifikasi Halal</option>
                  <option value="P-IRT">P-IRT</option>
                  <option value="HKI Merek">HKI Merek</option>
                  <option value="BPOM">BPOM</option>
                  <option value="Badan Usaha (PT/CV)">Badan Usaha (PT/CV)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status Pengajuan:</label>
                <select
                  value={editingItem.statusPengajuan}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      statusPengajuan: e.target.value as any
                    })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Belum Diajukan">Belum Diajukan</option>
                  <option value="Pemberkasan">Pemberkasan</option>
                  <option value="Proses Verifikasi">Proses Verifikasi</option>
                  <option value="Terbit">Terbit</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Izin / Sertifikat:</label>
                <input
                  type="text"
                  value={editingItem.nomorIzin || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, nomorIzin: e.target.value })}
                  placeholder="Contoh: 1234567890123 / ID3511..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tindak Lanjut:</label>
                <textarea
                  value={editingItem.catatan || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, catatan: e.target.value })}
                  rows={2}
                  placeholder="Catatan fasilitasi berkas..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#001c3c] hover:bg-[#004c80] text-white font-bold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
