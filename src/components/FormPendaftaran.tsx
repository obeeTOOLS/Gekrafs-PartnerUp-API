import React, { useState } from 'react';
import { PendaftaranFormData } from '../types';
import { SUBSEKTOR_LIST, KOTA_LIST, OMZET_OPTIONS } from '../data/initialData';
import { toProperCase, formatTanggalIndonesia } from '../utils/qrUtils';
import { gasService } from '../services/gasService';
import { 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  FileCheck, 
  Upload, 
  Check, 
  Copy, 
  MessageCircle, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/IWVRQD1S3qj6CnfvYguNp7?s=hd&p=i&mlu=4&ilr=4';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FormPendaftaranProps {
  onSuccessNavigate?: (tab: string) => void;
}

export const FormPendaftaran: React.FC<FormPendaftaranProps> = ({ onSuccessNavigate }) => {
  const settings = gasService.getSettings();
  const todayStr = new Date().toISOString().split('T')[0];
  const isClosed = settings.registrationDeadline && todayStr > settings.registrationDeadline;

  const [formData, setFormData] = useState<PendaftaranFormData>({
    namaUsaha: '',
    namaPemilik: '',
    subsektor: '',
    tahunBerdiri: '2022',
    nib: '',
    alamatUsaha: '',
    kotaKabupaten: 'Kota Batu',
    omzet: '',
    whatsapp: '',
    email: '',
    instagram: '',
    tiktok: '',
    marketplace: '',
    deskripsi: '',
    laporanKeuangan: 'Tidak',
    kolaborasi: 'Tidak',
    ikutPelatihan: 'Tidak',
    auditMedsos: 'Tidak',
    picKonten: '',
    studiKasus: 'Tidak',
    pernahIkutProgram: 'Tidak',
    paktaIntegritas: 'Tidak',
    ktpFile: null,
    nibFile: null
  });

  const [kotaLainnya, setKotaLainnya] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submittedData, setSubmittedData] = useState<PendaftaranFormData | null>(null);
  const [copiedIntro, setCopiedIntro] = useState(false);
  const [ktpFileName, setKtpFileName] = useState<string>('');
  const [nibFileName, setNibFileName] = useState<string>('');

  const handleInputChange = (field: keyof PendaftaranFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlurProperCase = (field: 'namaUsaha' | 'namaPemilik' | 'picKonten') => {
    setFormData((prev) => ({
      ...prev,
      [field]: toProperCase(prev[field])
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'ktpFile' | 'nibFile',
    setName: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(`Ukuran file "${file.name}" melebihi batas 5MB.`);
      e.target.value = '';
      return;
    }

    setName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      handleInputChange(field, {
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        base64
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    // Validasi WhatsApp Indonesia
    const phoneClean = formData.whatsapp.replace(/[\s\-()]/g, '');
    const phonePattern = /^(\+?62|0)8[1-9][0-9]{7,11}$/;
    if (!phonePattern.test(phoneClean)) {
      setStatusMsg({
        type: 'error',
        text: 'Format Nomor WhatsApp tidak valid. Gunakan 08xxxxxxxxxx atau +628xxxxxxxxxx (10-14 digit).'
      });
      return;
    }

    if (!formData.ktpFile) {
      setStatusMsg({
        type: 'error',
        text: 'Dokumen KTP Pemilik wajib diunggah (JPG/PNG/PDF).'
      });
      return;
    }

    if (
      formData.laporanKeuangan !== 'Ya' ||
      formData.kolaborasi !== 'Ya' ||
      formData.ikutPelatihan !== 'Ya' ||
      formData.auditMedsos !== 'Ya' ||
      formData.paktaIntegritas !== 'Ya'
    ) {
      setStatusMsg({
        type: 'error',
        text: 'Mohon centang seluruh pernyataan kesediaan dan pakta integritas program.'
      });
      return;
    }

    setIsSubmitting(true);

    const finalData: PendaftaranFormData = {
      ...formData,
      kotaKabupaten: formData.kotaKabupaten === 'Lainnya' ? toProperCase(kotaLainnya) : formData.kotaKabupaten
    };

    const res = gasService.submitForm(finalData);

    setIsSubmitting(false);

    if (res.status === 'success') {
      setSubmittedData(finalData);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: res.message
      });
    }
  };

  const copyIntroText = () => {
    if (!submittedData) return;
    const introText = `Halo Admin & Teman-teman Gekrafs PartnerUp! 👋\n\nPerkenalkan, saya ${submittedData.namaPemilik} dari ${submittedData.namaUsaha} (Subsektor: ${submittedData.subsektor}). Saya baru saja menyelesaikan pendaftaran Program Pendampingan Usaha UMKM Gekrafs PartnerUp Kota Batu. Mohon bimbingan dan kerjasamanya! 🙏✨`;
    navigator.clipboard.writeText(introText);
    setCopiedIntro(true);
    setTimeout(() => setCopiedIntro(false), 2500);
  };

  // If closed
  if (isClosed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#001c3c]">Pendaftaran Telah Ditutup</h2>
          <p className="mt-3 text-slate-600 leading-relaxed text-sm max-w-md mx-auto">
            Periode pendaftaran untuk sesi ini telah berakhir pada{' '}
            <span className="font-bold text-slate-900">{formatTanggalIndonesia(settings.registrationDeadline)}</span>.
            Silakan pantau pengumuman dan jadwal pelatihan berikutnya.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onSuccessNavigate?.('timeline')}
              className="px-5 py-2.5 rounded-xl bg-[#001c3c] text-white font-bold text-sm hover:bg-[#004c80] transition-colors"
            >
              Lihat Timeline & Jadwal Pelatihan
            </button>
            <button
              onClick={() => onSuccessNavigate?.('asesmen')}
              className="px-5 py-2.5 rounded-xl bg-[#eaf2fb] text-[#004c80] font-bold text-sm hover:bg-[#dbe7f7] transition-colors"
            >
              Halaman Asesmen Mandiri
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If successfully submitted
  if (submittedData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#001c3c]">Pendaftaran Berhasil Diterima!</h2>
          <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            Terima kasih <span className="font-bold text-slate-900">{submittedData.namaPemilik}</span> ({submittedData.namaUsaha}). Data usaha Anda telah tersimpan di sistem kurasi Gekrafs PartnerUp.
          </p>

          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-left">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>Langkah Selanjutnya: Wajib Masuk Grup WhatsApp Peserta</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed mb-4">
              Semua info verifikasi, pengumuman kurasi, dan link materi pelatihan dibagikan di grup resmi WhatsApp Gekrafs PartnerUp.
            </p>

            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#25D366] text-white font-extrabold text-base hover:bg-[#20bd5a] transition-all shadow-md animate-pulse-subtle"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Gabung Grup WhatsApp Sekarang</span>
            </a>
          </div>

          <div className="mt-6 text-left bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Template Perkenalan Diri (Salin & Kirim ke Grup)
            </div>
            <textarea
              readOnly
              rows={4}
              value={`Halo Admin & Teman-teman Gekrafs PartnerUp! 👋\n\nPerkenalkan, saya ${submittedData.namaPemilik} dari ${submittedData.namaUsaha} (Subsektor: ${submittedData.subsektor}). Saya baru saja menyelesaikan pendaftaran Program Pendampingan Usaha UMKM Gekrafs PartnerUp Kota Batu. Mohon bimbingan dan kerjasamanya! 🙏✨`}
              className="w-full text-xs font-mono p-3 bg-white border border-slate-200 rounded-lg text-slate-800 leading-relaxed resize-none focus:outline-none"
            />
            <button
              onClick={copyIntroText}
              className="mt-2.5 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#001c3c] text-white text-xs font-bold hover:bg-[#004c80] transition-colors"
            >
              {copiedIntro ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedIntro ? 'Teks Perkenalan Tersalin!' : 'Salin Teks Perkenalan'}</span>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedData(null);
                setFormData({
                  namaUsaha: '',
                  namaPemilik: '',
                  subsektor: '',
                  tahunBerdiri: '2022',
                  nib: '',
                  alamatUsaha: '',
                  kotaKabupaten: 'Kota Batu',
                  omzet: '',
                  whatsapp: '',
                  email: '',
                  instagram: '',
                  tiktok: '',
                  marketplace: '',
                  deskripsi: '',
                  laporanKeuangan: 'Tidak',
                  kolaborasi: 'Tidak',
                  ikutPelatihan: 'Tidak',
                  auditMedsos: 'Tidak',
                  picKonten: '',
                  studiKasus: 'Tidak',
                  pernahIkutProgram: 'Tidak',
                  paktaIntegritas: 'Tidak',
                  ktpFile: null,
                  nibFile: null
                });
                setKtpFileName('');
                setNibFileName('');
              }}
              className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Daftarkan Usaha Lain
            </button>
            <button
              onClick={() => onSuccessNavigate?.('timeline')}
              className="px-4 py-2 bg-[#004c80] text-white text-xs font-bold rounded-lg hover:bg-[#0070b3]"
            >
              Lihat Timeline & Jadwal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Hero Banner Card */}
      <div className="bg-gradient-to-br from-[#001c3c] via-[#004c80] to-[#0070b3] rounded-2xl p-6 sm:p-8 text-white shadow-lg border-b-4 border-[#ffc72c] mb-6">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#ffc72c] mb-1">
          <Building2 className="w-4 h-4" />
          <span>Gerakan Ekonomi Kreatif Nasional (GEKRAFS) Kota Batu</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
          Form Pendaftaran Pendampingan Usaha
        </h1>
        <p className="mt-2 text-slate-200 text-sm leading-relaxed max-w-2xl">
          Program akselerasi dan kurasi kapasitas usaha ekonomi kreatif Kota Batu. Seluruh data yang diisi akan ditinjau secara profesional oleh tim kurator.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold mb-6 flex items-start gap-3 ${
            statusMsg.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>{statusMsg.text}</div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Section 1: Data Usaha */}
        <div>
          <div className="flex items-center gap-2 text-[#001c3c] pb-2 border-b border-slate-100 font-bold text-base uppercase tracking-wide">
            <Building2 className="w-5 h-5 text-[#004c80]" />
            <span>1. Data Usaha</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Usaha <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Janus Cafe, Cleopatra"
                value={formData.namaUsaha}
                onChange={(e) => handleInputChange('namaUsaha', e.target.value)}
                onBlur={() => handleBlurProperCase('namaUsaha')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Pemilik / Pendiri <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nama lengkap pendiri"
                value={formData.namaPemilik}
                onChange={(e) => handleInputChange('namaPemilik', e.target.value)}
                onBlur={() => handleBlurProperCase('namaPemilik')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Subsektor Ekonomi Kreatif <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.subsektor}
                onChange={(e) => handleInputChange('subsektor', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
              >
                <option value="">-- Pilih Subsektor --</option>
                {SUBSEKTOR_LIST.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tahun Berdiri <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1990"
                max="2026"
                required
                value={formData.tahunBerdiri}
                onChange={(e) => handleInputChange('tahunBerdiri', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nomor NIB / Surat Keterangan Usaha
            </label>
            <input
              type="text"
              placeholder="Kosongkan jika belum memiliki NIB"
              value={formData.nib}
              onChange={(e) => handleInputChange('nib', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Upload KTP Pemilik <span className="text-rose-500">*</span>
              </label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-3 text-center hover:border-[#004c80] transition-colors bg-slate-50/50">
                <input
                  type="file"
                  required
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'ktpFile', setKtpFileName)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700 truncate max-w-full">
                    {ktpFileName || 'Pilih KTP (JPG/PNG/PDF, Max 5MB)'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Upload Dokumen NIB / Izin
              </label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-3 text-center hover:border-[#004c80] transition-colors bg-slate-50/50">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'nibFile', setNibFileName)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700 truncate max-w-full">
                    {nibFileName || 'Pilih NIB (Opsional, Max 5MB)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Alamat Usaha Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Jalan, nomor, RT/RW, kelurahan/desa, kecamatan"
              value={formData.alamatUsaha}
              onChange={(e) => handleInputChange('alamatUsaha', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kota / Kabupaten <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.kotaKabupaten}
                onChange={(e) => handleInputChange('kotaKabupaten', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
              >
                {KOTA_LIST.map((kota) => (
                  <option key={kota} value={kota}>
                    {kota}
                  </option>
                ))}
              </select>
              {formData.kotaKabupaten === 'Lainnya' && (
                <input
                  type="text"
                  required
                  placeholder="Tulis nama Kota/Kabupaten..."
                  value={kotaLainnya}
                  onChange={(e) => setKotaLainnya(e.target.value)}
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#004c80] outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Estimasi Omzet per Tahun
              </label>
              <select
                value={formData.omzet}
                onChange={(e) => handleInputChange('omzet', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
              >
                <option value="">-- Pilih Rentang Omzet --</option>
                {OMZET_OPTIONS.map((omz) => (
                  <option key={omz} value={omz}>
                    {omz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Kontak */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[#001c3c] pb-2 border-b border-slate-100 font-bold text-base uppercase tracking-wide">
            <Phone className="w-5 h-5 text-[#004c80]" />
            <span>2. Kontak Peserta</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="081234567890"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
              />
              <span className="text-[11px] text-slate-500">Format: 08xxxxxxxxxx atau +628xxxxxxxxxx</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="usaha@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Kanal Digital */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[#001c3c] pb-2 border-b border-slate-100 font-bold text-base uppercase tracking-wide">
            <Mail className="w-5 h-5 text-[#004c80]" />
            <span>3. Kanal Digital (Untuk Audit Awal)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Link Instagram
              </label>
              <input
                type="text"
                placeholder="https://instagram.com/..."
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#004c80] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Link TikTok
              </label>
              <input
                type="text"
                placeholder="https://tiktok.com/@..."
                value={formData.tiktok}
                onChange={(e) => handleInputChange('tiktok', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#004c80] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Marketplace / Web
              </label>
              <input
                type="text"
                placeholder="Shopee, Tokopedia, GoFood, dll"
                value={formData.marketplace}
                onChange={(e) => handleInputChange('marketplace', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#004c80] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Profil Usaha */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[#001c3c] pb-2 border-b border-slate-100 font-bold text-base uppercase tracking-wide">
            <User className="w-5 h-5 text-[#004c80]" />
            <span>4. Profil & Keunikan Produk</span>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Deskripsi Singkat Usaha & Produk Unggulan <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ceritakan apa produk/layanan Anda, keunggulan dibanding kompetitor, dan cara Anda menjualnya..."
              value={formData.deskripsi}
              onChange={(e) => handleInputChange('deskripsi', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] focus:border-transparent outline-none bg-slate-50/50 leading-relaxed"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Pernah Menjadi Penerima Utama Program Serupa?
            </label>
            <select
              value={formData.pernahIkutProgram}
              onChange={(e) => handleInputChange('pernahIkutProgram', e.target.value as 'Ya' | 'Tidak')}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] outline-none bg-slate-50/50"
            >
              <option value="Tidak">Tidak Pernah</option>
              <option value="Ya">Pernah</option>
            </select>
          </div>
        </div>

        {/* Section 5: Komitmen Program */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[#001c3c] pb-2 border-b border-slate-100 font-bold text-base uppercase tracking-wide">
            <FileCheck className="w-5 h-5 text-[#004c80]" />
            <span>5. Kesediaan Mengikuti Ketentuan Program</span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              {
                id: 'laporanKeuangan',
                text: 'Bersedia memberikan laporan keuangan sederhana selama program berlangsung'
              },
              {
                id: 'kolaborasi',
                text: 'Bersedia berkolaborasi dengan pelaku usaha dari bidang kreatif lain'
              },
              {
                id: 'ikutPelatihan',
                text: 'Bersedia mengikuti seluruh rangkaian pelatihan (maksimal 1x/minggu, setiap hari Sabtu)'
              },
              {
                id: 'auditMedsos',
                text: 'Bersedia menjalani audit media sosial/channel distribusi dan menjalankan rekomendasi'
              },
              {
                id: 'studiKasus',
                text: 'Bersedia menjadi studi kasus/testimoni untuk keperluan pelaporan program (Opsional)',
                optional: true
              },
              {
                id: 'paktaIntegritas',
                text: 'Saya menyatakan data yang diisi benar dan bersedia menandatangani pakta integritas/PKS jika terpilih'
              }
            ].map((chk) => {
              const isChecked = formData[chk.id as keyof PendaftaranFormData] === 'Ya';
              return (
                <label
                  key={chk.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-[#eaf2fb] border-[#004c80]/40 text-[#001c3c]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleInputChange(
                        chk.id as keyof PendaftaranFormData,
                        e.target.checked ? 'Ya' : 'Tidak'
                      )
                    }
                    className="mt-0.5 w-4 h-4 rounded text-[#004c80] focus:ring-[#004c80] accent-[#004c80]"
                  />
                  <span className="text-xs leading-relaxed font-medium">
                    {chk.text} {!chk.optional && <span className="text-rose-500">*</span>}
                  </span>
                </label>
              );
            })}

            <div className="mt-3">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama PIC Pengelola Konten (Jika Ada)
              </label>
              <input
                type="text"
                placeholder="Bisa diisi nama pemilik jika belum memiliki tim khusus"
                value={formData.picKonten}
                onChange={(e) => handleInputChange('picKonten', e.target.value)}
                onBlur={() => handleBlurProperCase('picKonten')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] outline-none bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#001c3c] to-[#004c80] text-white font-extrabold text-base hover:opacity-95 transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Mengirim & Menyimpan Data...</span>
            ) : (
              <span>Kirim Pendaftaran Program</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
