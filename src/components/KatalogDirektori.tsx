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
  Tag
} from 'lucide-react';
import { SUBSEKTOR_LIST } from '../data/initialData';

interface KatalogDirektoriProps {
  pesertaList: PesertaItem[];
  onSelectPeserta?: (peserta: PesertaItem) => void;
  onNavigateToRegister?: () => void;
}

export const KatalogDirektori: React.FC<KatalogDirektoriProps> = ({
  pesertaList,
  onSelectPeserta,
  onNavigateToRegister
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubsektor, setSelectedSubsektor] = useState('Semua Subsektor');
  const [activeModalPeserta, setActiveModalPeserta] = useState<PesertaItem | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Ambil peserta yang Diterima (Lolos Kurasi).
  // Jika database masih baru dan peserta 'Diterima' sedikit, sertakan juga pendaftar aktif agar katalog tetap kaya dan bermanfaat
  const curatedList = useMemo(() => {
    const accepted = pesertaList.filter((p) => p.statusKurasi === 'Diterima');
    if (accepted.length >= 6) return accepted;
    // Fallback: sertakan juga peserta aktif lain dengan status kurasi apapun untuk showcase contoh
    return pesertaList;
  }, [pesertaList]);

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
                    Lihat Profil Lengkap
                  </button>

                  <div className="flex items-center gap-1.5">
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
    </div>
  );
};
