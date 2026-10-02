import React, { useState } from 'react';
import { PesertaItem } from '../types';
import { SUBSEKTOR_LIST } from '../data/initialData';
import { gasService } from '../services/gasService';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Trash2, 
  Save, 
  Store, 
  Sparkles,
  Instagram,
  MessageCircle,
  MapPin,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface EditUmkmModalProps {
  peserta: PesertaItem;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (updated: PesertaItem) => void;
}

export const EditUmkmModal: React.FC<EditUmkmModalProps> = ({
  peserta,
  isOpen,
  onClose,
  onSaved
}) => {
  const [formData, setFormData] = useState<Partial<PesertaItem>>({
    namaUsaha: peserta.namaUsaha || '',
    namaPemilik: peserta.namaPemilik || '',
    subsektor: peserta.subsektor || 'Kuliner',
    produkUnggulan: peserta.produkUnggulan || '',
    deskripsi: peserta.deskripsi || '',
    alamatUsaha: peserta.alamatUsaha || '',
    kotaKabupaten: peserta.kotaKabupaten || 'Kota Batu',
    whatsapp: peserta.whatsapp || '',
    instagram: peserta.instagram || '',
    tiktok: peserta.tiktok || '',
    marketplace: peserta.marketplace || '',
    fotoProdukUrl: peserta.fotoProdukUrl || '',
    omzet: peserta.omzet || ''
  });

  const [activeTabUpload, setActiveTabUpload] = useState<'upload' | 'url'>('upload');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle file upload dari galeri atau kamera HP
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 5MB.');
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      // Resize gambar menggunakan HTML5 Canvas agar hemat memori & cepat dimuat
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = Math.min(img.width, MAX_WIDTH);
        canvas.height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, fotoProdukUrl: optimizedDataUrl }));
          showToast('Foto produk berhasil diunggah!');
        } else {
          setFormData((prev) => ({ ...prev, fotoProdukUrl: dataUrl }));
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setFormData((prev) => ({ ...prev, fotoProdukUrl: dataUrl }));
        setIsProcessingImage(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!peserta.row) {
      alert('Gagal menyimpan: Baris data tidak valid.');
      return;
    }

    const res = gasService.updatePeserta(peserta.row, formData);
    if (res.status === 'success') {
      const updatedItem: PesertaItem = {
        ...peserta,
        ...formData
      };
      if (onSaved) onSaved(updatedItem);
      onClose();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#001c3c] to-[#003866] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#001c3c] flex items-center justify-center font-black shadow-md flex-shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Kelola Profil & Foto Produk UMKM
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-[#001c3c] uppercase">
                  Katalog
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Perbarui showcase untuk <strong className="text-amber-300">{peserta.namaUsaha}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {toastMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Section 1: FOTO PRODUK SHOWCASE */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black text-[#001c3c] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <span>Foto Produk Utama (Hero Showcase)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Foto ini akan tampil di kartu katalog Direktori Ekraf Kota Batu.
                </p>
              </div>
              {formData.fotoProdukUrl && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, fotoProdukUrl: '' }))}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Foto</span>
                </button>
              )}
            </div>

            {/* Preview Banner Foto */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center group">
              {formData.fotoProdukUrl ? (
                <>
                  <img 
                    src={formData.fotoProdukUrl} 
                    alt="Foto Produk UMKM" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-lg">
                      Foto Aktif
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white text-slate-400 flex items-center justify-center mx-auto shadow-sm">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    Belum ada foto produk yang diunggah
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Unggah file foto dari HP/Laptop atau masukkan tautan URL gambar
                  </p>
                </div>
              )}
            </div>

            {/* Opsi Upload: File vs URL */}
            <div className="space-y-3 pt-1">
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTabUpload('upload')}
                  className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTabUpload === 'upload'
                      ? 'border-[#004c80] text-[#004c80]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah dari File (HP / PC)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabUpload('url')}
                  className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTabUpload === 'url'
                      ? 'border-[#004c80] text-[#004c80]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Gunakan Tautan Link URL</span>
                </button>
              </div>

              {activeTabUpload === 'upload' ? (
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50 hover:border-[#004c80] transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <p className="text-xs font-bold text-slate-700">
                        {isProcessingImage ? 'Memproses gambar...' : 'Klik untuk memilih foto dari galeri/kamera'}
                      </p>
                      <p className="text-[10px] text-slate-400">PNG, JPG, WEBP (Maksimal 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      disabled={isProcessingImage}
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... atau link gambar Google Drive"
                      value={formData.fotoProdukUrl || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fotoProdukUrl: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent bg-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Masukkan URL gambar langsung yang dapat diakses publik.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: DETAIL IDENTITAS USAHA & PRODUK */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#001c3c] uppercase tracking-wider border-b border-slate-100 pb-2">
              Informasi Usaha & Produk
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Brand / Usaha *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaUsaha || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, namaUsaha: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pemilik / Founder *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaPemilik || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, namaPemilik: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subsektor Ekonomi Kreatif
                </label>
                <select
                  value={formData.subsektor || 'Kuliner'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subsektor: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent bg-white"
                >
                  {SUBSEKTOR_LIST.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Produk / Jasa Unggulan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Keripik Apel Kristal 250gr"
                  value={formData.produkUnggulan || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, produkUnggulan: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Profil & Narasi Produk
              </label>
              <textarea
                rows={3}
                placeholder="Ceritakan keunikan produk, bahan baku lokal khas Kota Batu, kelebihan daya saing, atau kisah brand..."
                value={formData.deskripsi || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, deskripsi: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Usaha / Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Jl. Raya Pandanrejo, Kec. Bumiaji"
                  value={formData.alamatUsaha || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alamatUsaha: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Omzet Bulanan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rp 15.000.000 - Rp 25.000.000"
                  value={formData.omzet || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, omzet: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Section 3: KONTAK PEMESANAN & MEDIA SOSIAL */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#001c3c] uppercase tracking-wider border-b border-slate-100 pb-2">
              Saluran Pemesanan & Media Sosial
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Pemesanan *
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="081234567890"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username Instagram
                </label>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-pink-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="@namabrand"
                    value={formData.instagram || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Akun TikTok
                </label>
                <input
                  type="text"
                  placeholder="@brandtiktok"
                  value={formData.tiktok || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tiktok: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Marketplace / Website Toko
                </label>
                <input
                  type="text"
                  placeholder="https://shopee.co.id/... atau www.tokoanda.com"
                  value={formData.marketplace || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, marketplace: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004c80] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessingImage}
            className="px-5 py-2.5 bg-gradient-to-r from-[#004c80] to-[#001c3c] hover:from-[#003866] hover:to-[#001428] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Simpan Informasi & Foto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
