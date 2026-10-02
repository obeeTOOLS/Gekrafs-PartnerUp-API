import React, { useState, useMemo } from 'react';
import { PesertaItem } from '../types';
import { 
  Building2, 
  Search, 
  MapPin, 
  ExternalLink, 
  MessageCircle, 
  Instagram, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Filter,
  X,
  Store,
  ChevronRight,
  ShieldCheck,
  Tag,
  Camera,
  Edit3,
  Plus,
  Lock,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { SUBSEKTOR_LIST } from '../data/initialData';
import { EditUmkmModal } from './EditUmkmModal';
import { gasService } from '../services/gasService';

interface KatalogDirektoriProps {
  pesertaList: PesertaItem[];
  isAdminLoggedIn?: boolean;
  onSelectPeserta?: (peserta: PesertaItem) => void;
  onNavigateToRegister?: () => void;
}

export const KatalogDirektori: React.FC<KatalogDirektoriProps> = ({
  pesertaList: initialPesertaList,
  isAdminLoggedIn = false,
  onSelectPeserta,
  onNavigateToRegister
}) => {
  const [localPesertaList, setLocalPesertaList] = useState<PesertaItem[]>(initialPesertaList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubsektor, setSelectedSubsektor] = useState('Semua Subsektor');
  const [activeModalPeserta, setActiveModalPeserta] = useState<PesertaItem | null>(null);
  const [editingPeserta, setEditingPeserta] = useState<PesertaItem | null>(null);
  const [verifyingPeserta, setVerifyingPeserta] = useState<PesertaItem | null>(null);
  const [credentialInput, setCredentialInput] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Sync state bila initialPesertaList berubah
  React.useEffect(() => {
    setLocalPesertaList(initialPesertaList);
  }, [initialPesertaList]);

  // Request edit dengan kontrol hak akses
  const handleRequestEdit = (peserta: PesertaItem) => {
    if (isAdminLoggedIn) {
      // Admin / Kurator / Developer bisa langsung mengedit tanpa perlu input verifikasi ulang
      setEditingPeserta(peserta);
    } else {
      // Pengunjung / Peserta umum harus memverifikasi bahwa mereka adalah pemilik brand sah
      setVerifyingPeserta(peserta);
      setCredentialInput('');
      setVerifyError(null);
    }
  };

  const handleConfirmVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingPeserta) return;

    const res = gasService.verifyPesertaOwnership(verifyingPeserta.namaUsaha, credentialInput);
    if (res.verified && res.peserta) {
      setEditingPeserta(res.peserta);
      setVerifyingPeserta(null);
      setVerifyError(null);
    } else {
      setVerifyError(res.message);
    }
  };

  // Ambil peserta yang Diterima (Lolos Kurasi).
  // Jika database masih baru dan peserta 'Diterima' sedikit, sertakan juga pendaftar aktif agar katalog tetap kaya dan bermanfaat
  const curatedList = useMemo(() => {
    const accepted = localPesertaList.filter((p) => p.statusKurasi === 'Diterima');
    if (accepted.length >= 6) return accepted;
    // Fallback: sertakan juga peserta aktif lain dengan status kurasi apapun untuk showcase contoh
    return localPesertaList;
  }, [localPesertaList]);

  // Filter berdasarkan search query dan subsektor
  const filteredList = useMemo(() => {
    return curatedList.filter((p) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        p.namaUsaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.namaPemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.deskripsi && p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.subsektor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSubsektor =
        selectedSubsektor === 'Semua Subsektor' || p.subsektor === selectedSubsektor;

      return matchSearch && matchSubsektor;
    });
  }, [curatedList, searchQuery, selectedSubsektor]);

  // Hitung jumlah per subsektor
  const subsektorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    curatedList.forEach((p) => {
      if (p.subsektor) {
        counts[p.subsektor] = (counts[p.subsektor] || 0) + 1;
      }
    });
    return counts;
  }, [curatedList]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Direktori UMKM Kreatif Kota Batu - GEKRAFS PartnerUp',
        text: 'Lihat katalog produk dan brand kreatif unggulan Kota Batu terkurasi GEKRAFS!',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const getWaLink = (waNumber: string, brandName: string) => {
    let clean = (waNumber || '').replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    const msg = encodeURIComponent(
      `Halo *${brandName}*, saya menemukan usaha Anda melalui Direktori Ekraf GEKRAFS PartnerUp Kota Batu. Mau tanya info produk/layanan Anda?`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner & Intro */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#001c3c] via-[#003366] to-[#004c80] p-6 sm:p-10 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Showcase & Direktori Ekraf Kota Batu</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Katalog Produk & Brand Unggulan Kota Batu
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Eksplorasi ragam produk inovatif dan talenta kreatif terkurasi dalam program{' '}
            <strong className="text-amber-300">GEKRAFS PartnerUp 2026</strong>. Dukung produk lokal dengan langsung terhubung ke pelaku usahanya.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? 'Tautan Disalin!' : 'Bagikan Katalog'}</span>
            </button>
            {onNavigateToRegister && (
              <button
                onClick={onNavigateToRegister}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#001c3c] font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Daftarkan Usaha Anda</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Search & Subsektor Pills Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama brand, produk, pemilik, atau kata kunci..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004c80] focus:bg-white transition-all font-medium text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600 font-medium">Subsektor:</span>
              <select
                value={selectedSubsektor}
                onChange={(e) => setSelectedSubsektor(e.target.value)}
                className="bg-transparent font-bold text-[#001c3c] outline-none cursor-pointer max-w-[180px] truncate"
              >
                <option value="Semua Subsektor">Semua Subsektor ({curatedList.length})</option>
                {SUBSEKTOR_LIST.map((sub) => {
                  const count = subsektorCounts[sub] || 0;
                  return (
                    <option key={sub} value={sub}>
                      {sub} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedSubsektor('Semua Subsektor')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedSubsektor === 'Semua Subsektor'
                ? 'bg-[#001c3c] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({curatedList.length})
          </button>
          {['Kuliner', 'Fashion', 'Kriya / Kerajinan', 'Desain Komunikasi Visual', 'Fotografi', 'Film & Animasi', 'Musik'].map((sub) => {
            const count = subsektorCounts[sub] || 0;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubsektor(sub)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubsektor === sub
                    ? 'bg-[#001c3c] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub} {count > 0 && <span className="opacity-75">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Grid Kartu Showcase */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-base font-extrabold text-slate-800">
            Tidak Ditemukan Brand yang Cocok
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau pilih subsektor lain untuk menemukan brand lokal Kota Batu.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubsektor('Semua Subsektor');
            }}
            className="px-4 py-2 rounded-xl bg-[#001c3c] text-white text-xs font-bold hover:bg-[#004c80] transition-colors cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item, idx) => {
            const isAccepted = item.statusKurasi === 'Diterima';
            return (
              <div
                key={item.namaUsaha + idx}
                className="bg-white rounded-3xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Hero Photo / Visual Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-slate-800 to-[#001c3c]">
                  {item.fotoProdukUrl ? (
                    <img 
                      src={item.fotoProdukUrl} 
                      alt={item.namaUsaha} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <Store className="w-10 h-10 text-amber-400/70 mb-1" />
                      <span className="text-white text-xs font-black tracking-tight">{item.namaUsaha}</span>
                      <span className="text-[10px] text-amber-300/80">{item.subsektor}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestEdit(item);
                        }}
                        className="mt-2 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer backdrop-blur-xs"
                      >
                        <Camera className="w-3 h-3 text-amber-300" />
                        <span>Tambah Foto Produk</span>
                      </button>
                    </div>
                  )}

                  {/* Floating Edit Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestEdit(item);
                    }}
                    title={isAdminLoggedIn ? "Edit Informasi & Foto (Mode Admin)" : "Edit Informasi & Foto (Verifikasi Pemilik Usaha)"}
                    className="absolute top-3 right-3 px-2 py-1 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 shadow-md hover:scale-105"
                  >
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px]">{isAdminLoggedIn ? 'Edit (Admin)' : 'Edit Profil'}</span>
                  </button>

                  {/* Produk Unggulan Badge */}
                  {item.produkUnggulan && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-[#001c3c]/85 text-amber-300 text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 shadow">
                      <Tag className="w-3 h-3 text-amber-400" />
                      <span className="truncate max-w-[190px]">{item.produkUnggulan}</span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 space-y-3.5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#004c80] text-[10px] font-extrabold tracking-wide uppercase truncate max-w-[170px]">
                      {item.subsektor}
                    </span>
                    {isAccepted ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1 flex-shrink-0">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Terkurasi
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex-shrink-0">
                        Peserta Aktif
                      </span>
                    )}
                  </div>

                  {/* Brand & Owner */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#001c3c] group-hover:text-[#004c80] transition-colors line-clamp-1">
                      {item.namaUsaha}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <span>Owner:</span>
                      <strong className="text-slate-700">{item.namaPemilik}</strong>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed min-h-[48px]">
                    {item.deskripsi ||
                      `Brand kreatif unggulan Kota Batu dari subsektor ${item.subsektor}. Berkomitmen menghadirkan kualitas terbaik dan berdaya saing.`}
                  </p>

                  {/* Location & Details */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{item.alamatUsaha || item.kotaKabupaten || 'Kota Batu'}</span>
                    </span>
                    {item.omzet && (
                      <span className="font-semibold text-slate-700">
                        Omzet: {item.omzet}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalPeserta(item)}
                    className="text-xs font-bold text-[#001c3c] hover:text-[#004c80] transition-colors cursor-pointer"
                  >
                    Lihat Profil
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRequestEdit(item)}
                      title={isAdminLoggedIn ? "Edit Foto & Informasi (Admin)" : "Edit Foto & Profil (Verifikasi Pemilik)"}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-slate-600" />
                      <span>{isAdminLoggedIn ? 'Edit' : 'Kelola'}</span>
                    </button>

                    {item.instagram && (
                      <a
                        href={
                          item.instagram.startsWith('http')
                            ? item.instagram
                            : `https://instagram.com/${item.instagram.replace('@', '')}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white hover:bg-pink-50 text-slate-600 hover:text-pink-600 border border-slate-200 flex items-center justify-center transition-colors"
                        title="Buka Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {item.whatsapp && (
                      <a
                        href={getWaLink(item.whatsapp, item.namaUsaha)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                        title="Hubungi Penjual via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Kontak</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Modal Detail Profil Lengkap Brand */}
      {activeModalPeserta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004c80] text-[10px] font-extrabold uppercase tracking-wide">
                  {activeModalPeserta.subsektor}
                </span>
                <h3 className="text-xl font-black text-[#001c3c]">
                  {activeModalPeserta.namaUsaha}
                </h3>
                <p className="text-xs text-slate-500">
                  Pemilik: <strong className="text-slate-800">{activeModalPeserta.namaPemilik}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalPeserta(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo in Detail Modal */}
            {activeModalPeserta.fotoProdukUrl && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
                <img 
                  src={activeModalPeserta.fotoProdukUrl} 
                  alt={activeModalPeserta.namaUsaha} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Verification Seal */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-emerald-950">
                  Peserta Terbina GEKRAFS Kota Batu
                </div>
                <div className="text-emerald-800 text-[11px]">
                  Terverifikasi dalam database pembinaan PartnerUp 2026.
                </div>
              </div>
            </div>

            {/* Tombol Edit Profil Langsung */}
            <button
              type="button"
              onClick={() => handleRequestEdit(activeModalPeserta)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#001c3c] font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-[#001c3c]" />
              <span>{isAdminLoggedIn ? 'Edit Informasi & Foto (Mode Admin)' : 'Kelola Profil (Verifikasi Pemilik Usaha)'}</span>
            </button>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Tentang Produk & Usaha:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                {activeModalPeserta.deskripsi ||
                  'Pelaku usaha ekonomi kreatif Kota Batu dengan dedikasi tinggi terhadap kualitas, inovasi produk lokal, dan standarisasi operasional modern.'}
              </p>
            </div>

            {/* Info Lokasi & Legalitas */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">LOKASI USAHA</span>
                <span className="font-bold text-slate-800 line-clamp-2">
                  {activeModalPeserta.alamatUsaha || activeModalPeserta.kotaKabupaten || 'Kota Batu'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">STATUS NIB</span>
                <span className="font-bold text-slate-800">
                  {activeModalPeserta.nib ? `Terdaftar (${activeModalPeserta.nib})` : 'Dalam Fasilitasi'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              {activeModalPeserta.whatsapp && (
                <a
                  href={getWaLink(activeModalPeserta.whatsapp, activeModalPeserta.namaUsaha)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi via WhatsApp</span>
                </a>
              )}
              {activeModalPeserta.instagram && (
                <a
                  href={
                    activeModalPeserta.instagram.startsWith('http')
                      ? activeModalPeserta.instagram
                      : `https://instagram.com/${activeModalPeserta.instagram.replace('@', '')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Kunjungi Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Verifikasi Kepemilikan Brand (Perlindungan Data dari Publik) */}
      {verifyingPeserta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#001c3c]">
                    Verifikasi Pemilik Usaha
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Akses Kelola: <strong className="text-slate-800">{verifyingPeserta.namaUsaha}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVerifyingPeserta(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80 text-xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[#004c80]">
                <KeyRound className="w-4 h-4" />
                <span>Keamanan Data Brand Anda</span>
              </div>
              <p className="text-[11px] text-blue-800/90 leading-relaxed">
                Untuk mencegah orang lain mengubah informasi bisnis Anda secara ilegal, silakan masukkan <strong>Nomor WhatsApp</strong> atau <strong>Email</strong> yang Anda gunakan saat mendaftar program PartnerUp.
              </p>
            </div>

            {verifyError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmVerification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp atau Email Terdaftar
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Contoh: 081234567890 atau email@anda.com"
                  value={credentialInput}
                  onChange={(e) => setCredentialInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVerifyingPeserta(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#001c3c] hover:bg-[#003366] text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verifikasi & Edit Profil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Edit Profil & Unggah Foto Produk UMKM */}
      {editingPeserta && (
        <EditUmkmModal
          peserta={editingPeserta}
          isOpen={!!editingPeserta}
          isAdmin={isAdminLoggedIn}
          onClose={() => setEditingPeserta(null)}
          onSaved={(updated) => {
            setLocalPesertaList((prev) =>
              prev.map((p) => (p.row === updated.row ? updated : p))
            );
            if (activeModalPeserta && activeModalPeserta.row === updated.row) {
              setActiveModalPeserta(updated);
            }
            setEditingPeserta(null);
          }}
        />
      )}
    </div>
  );
};
