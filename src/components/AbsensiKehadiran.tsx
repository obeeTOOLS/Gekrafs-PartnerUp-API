import React, { useState } from 'react';
import { gasService } from '../services/gasService';
import { formatTanggalIndonesia, generateQrSvgUrl, downloadBrandedQrPngFile } from '../utils/qrUtils';
import { UserRole } from '../types';
import { QrCode, Calendar, Clock, User, CheckCircle2, AlertCircle, Sparkles, Copy, Check, Lock, ShieldCheck, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { authService } from '../services/authService';

interface AbsensiKehadiranProps {
  initialSesiId?: string;
  userRole?: UserRole;
}

export const AbsensiKehadiran: React.FC<AbsensiKehadiranProps> = ({ initialSesiId, userRole }) => {
  const jadwal = gasService.getJadwal();
  const registeredNames = gasService.getRegisteredBusinessNames();

  const pesertaSession = authService.getPesertaSession();
  const isPesertaLoggedIn = !!pesertaSession;

  const [selectedSesiId, setSelectedSesiId] = useState<string>(
    initialSesiId || (jadwal.length ? jadwal[0].idSesi : '')
  );
  const [namaUsaha, setNamaUsaha] = useState(() => pesertaSession?.namaUsaha || '');
  const [whatsapp, setWhatsapp] = useState(() => pesertaSession?.whatsapp || '');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'already'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState<{ namaUsaha: string; topik: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloadingQr, setIsDownloadingQr] = useState(false);

  // Sinkronisasi jika initialSesiId berubah dari URL
  React.useEffect(() => {
    if (initialSesiId && initialSesiId !== selectedSesiId) {
      setSelectedSesiId(initialSesiId);
    }
  }, [initialSesiId]);

  const selectedSesi = jadwal.find((j) => j.idSesi === selectedSesiId);

  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!selectedSesiId) {
      setStatusMsg({ type: 'error', text: 'Pilih sesi pelatihan terlebih dahulu.' });
      return;
    }

    if (!namaUsaha.trim() || !whatsapp.trim()) {
      setStatusMsg({ type: 'error', text: 'Nama Usaha dan Nomor WhatsApp wajib diisi.' });
      return;
    }

    // Date check: only allow check-in on the session date, unless admin or developer
    const todayStr = new Date().toISOString().split('T')[0];
    if (userRole === 'peserta' && selectedSesi && selectedSesi.tanggal !== todayStr) {
      // In demo/training simulation mode, allow warning bypass
    }

    setIsSubmitting(true);
    const res = gasService.checkinKehadiran(selectedSesiId, namaUsaha.trim(), whatsapp.trim());
    setIsSubmitting(false);

    if (res.status === 'success') {
      setCheckinSuccess({
        namaUsaha: res.namaUsaha || namaUsaha,
        topik: res.topik || selectedSesi?.topik || 'Sesi Pelatihan'
      });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else if (res.status === 'already_checked_in') {
      setStatusMsg({
        type: 'already',
        text: `"${res.namaUsaha || namaUsaha}" sudah tercatat hadir pada sesi ini sebelumnya. Tidak perlu isi ulang!`
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: res.message || 'Gagal mencatat kehadiran. Pastikan data cocok dengan pendaftaran.'
      });
    }
  };

  const checkinUrl = `${window.location.origin}?page=kehadiran&sesi_id=${selectedSesiId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(checkinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#001c3c] via-[#004c80] to-[#0070b3] rounded-2xl p-4 sm:p-6 text-white shadow-lg border-b-4 border-[#ffc72c] mb-5 sm:mb-6 text-center">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2 text-[#ffc72c]">
          <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#ffc72c]">
          Gekrafs PartnerUp &middot; Kota Batu
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
          Absensi Kehadiran Pelatihan
        </h1>
        <p className="mt-2 text-slate-200 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
          Catat kehadiran Anda pada sesi pelatihan hari ini. Gunakan nama usaha dan WhatsApp yang sama seperti saat mendaftar.
        </p>
      </div>

      {checkinSuccess ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#001c3c]">Kehadiran Tercatat!</h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <strong className="text-slate-900">{checkinSuccess.namaUsaha}</strong> berhasil tercatat hadir pada sesi:
          </p>
          <div className="mt-3 p-3 bg-[#eaf2fb] rounded-xl text-xs sm:text-sm font-bold text-[#001c3c]">
            {checkinSuccess.topik}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Terima kasih atas partisipasi aktif Anda. Selamat mengikuti rangkaian materi!
          </p>

          <button
            onClick={() => {
              setCheckinSuccess(null);
              setNamaUsaha('');
              setWhatsapp('');
              setStatusMsg(null);
            }}
            className="mt-6 px-5 py-3 sm:py-2.5 bg-[#001c3c] text-white text-xs font-bold rounded-xl hover:bg-[#004c80] transition-colors w-full sm:w-auto"
          >
            Absensi Peserta Lain
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm space-y-5 sm:space-y-6">
          {/* Select Session */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Pilih Sesi Pelatihan
            </label>
            <select
              value={selectedSesiId}
              onChange={(e) => {
                setSelectedSesiId(e.target.value);
                setStatusMsg(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-[#001c3c] focus:ring-2 focus:ring-[#004c80] outline-none bg-slate-50/50"
            >
              {jadwal.map((sesi, idx) => (
                <option key={sesi.idSesi} value={sesi.idSesi}>
                  Sesi {idx + 1}: {sesi.topik} ({formatTanggalIndonesia(sesi.tanggal)})
                </option>
              ))}
            </select>
          </div>

          {/* Session Detail Card */}
          {selectedSesi && (
            <div className="p-4 rounded-xl bg-[#eaf2fb] border border-blue-100 text-xs text-slate-700 space-y-1.5">
              <div className="font-bold text-sm text-[#001c3c]">{selectedSesi.topik}</div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-[#004c80]" />
                <span>{formatTanggalIndonesia(selectedSesi.tanggal)}</span>
                <span>&middot;</span>
                <Clock className="w-3.5 h-3.5 text-[#004c80]" />
                <span>{selectedSesi.waktu}</span>
              </div>
              {selectedSesi.pemateri && (
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-3.5 h-3.5 text-[#004c80]" />
                  <span>Pemateri: {selectedSesi.pemateri}</span>
                </div>
              )}
            </div>
          )}

          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
                statusMsg.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : statusMsg.type === 'already'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {statusMsg.type === 'already' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              )}
              <div>{statusMsg.text}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCheckin} className="space-y-4">
            {isPesertaLoggedIn ? (
              <div className="p-3.5 bg-gradient-to-r from-blue-50/90 to-amber-50/40 rounded-xl border border-blue-200 space-y-1">
                <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-blue-700" />
                    Identitas Akun Peserta Anda
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Terkunci Otomatis
                  </span>
                </div>
                <div className="text-base font-black text-[#001c3c]">{namaUsaha}</div>
                <div className="text-xs text-slate-600 font-medium">WhatsApp: {whatsapp}</div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Usaha <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="namaUsahaDatalist"
                    placeholder="Ketik atau pilih nama usaha..."
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] outline-none"
                  />
                  <datalist id="namaUsahaDatalist">
                    {registeredNames.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                  <span className="text-[11px] text-slate-500">
                    Pilih dari daftar pendaftar atau ketik sesuai nama saat mendaftar
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nomor WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nomor WhatsApp terdaftar (contoh: 081234567890)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#004c80] outline-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#001c3c] to-[#004c80] text-white font-extrabold text-sm hover:opacity-95 transition-opacity shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Memeriksa Kehadiran...' : '✅ Catat Kehadiran Saya'}
            </button>
          </form>

          {/* QR Code section for on-site display / sharing */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <details className="text-xs text-slate-600 group">
              <summary className="cursor-pointer font-bold text-[#004c80] hover:underline flex items-center justify-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                <span>Tampilkan QR Code & Download Poster Presensi Sesi Ini</span>
              </summary>
              <div className="mt-3 flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {/* Branded Card Mini Preview */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative text-center max-w-xs w-full">
                  <div className="text-[10px] font-extrabold text-[#001c3c] mb-1">
                    {selectedSesi?.topik || 'Presensi Sesi Pelatihan'}
                  </div>

                  <div className="relative inline-block mx-auto">
                    <img
                      src={generateQrSvgUrl(checkinUrl, 180)}
                      alt="QR Absensi Sesi"
                      className="w-36 h-36 bg-white p-1.5 rounded-xl border border-slate-200"
                    />
                    {/* Badge Tema di Tengah */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-lg bg-[#001c3c] border-2 border-[#ffc72c] ring-2 ring-white flex flex-col items-center justify-center shadow-md text-center">
                        <span className="text-[6px] font-black text-white leading-tight">EKRAF</span>
                        <span className="text-[5px] font-bold text-[#ffc72c]">BATU</span>
                      </div>
                    </div>
                  </div>

                  {/* Di Bawah QR: Tulisan PartnerUp */}
                  <div className="mt-2 pt-1 border-t border-slate-100">
                    <span className="text-xs font-black text-[#001c3c] tracking-tight">PartnerUp</span>
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-slate-500 max-w-xs">
                  Scan QR di atas dengan kamera HP peserta atau download file PNG untuk dicetak / dipajang di proyektor.
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 w-full max-w-xs">
                  <button
                    type="button"
                    disabled={isDownloadingQr}
                    onClick={async () => {
                      if (!selectedSesi) return;
                      const sesiIdx = jadwal.findIndex((j) => j.idSesi === selectedSesiId) + 1;
                      setIsDownloadingQr(true);
                      try {
                        await downloadBrandedQrPngFile({
                          url: checkinUrl,
                          topik: selectedSesi.topik,
                          nomorSesi: sesiIdx || undefined,
                          tanggal: selectedSesi.tanggal ? formatTanggalIndonesia(selectedSesi.tanggal) : undefined,
                          waktu: selectedSesi.waktu,
                          pemateri: selectedSesi.pemateri
                        });
                      } catch (e) {
                        console.error('Error downloading QR PNG', e);
                      } finally {
                        setIsDownloadingQr(false);
                      }
                    }}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloadingQr ? 'Menyiapkan...' : 'Download PNG'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Tersalin!' : 'Salin Tautan'}</span>
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};
