import React, { useState } from 'react';
import { gasService } from '../services/gasService';
import { 
  ASESMEN_KRITERIA, 
  BAGIAN_3_DEFINITIONS 
} from '../data/initialData';
import { formatTanggalIndonesia } from '../utils/qrUtils';
import { 
  ClipboardCheck, 
  UserCheck, 
  AlertCircle, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AsesmenMandiriProps {
  onNavigateToRegister?: () => void;
}

export const AsesmenMandiri: React.FC<AsesmenMandiriProps> = ({ onNavigateToRegister }) => {
  const settings = gasService.getSettings();
  const registeredNames = gasService.getRegisteredBusinessNames();

  // Check window status
  const todayStr = new Date().toISOString().split('T')[0];
  let windowStatus: 'open' | 'not_yet_open' | 'closed' = 'open';
  if (settings.assessmentOpenDate && todayStr < settings.assessmentOpenDate) {
    windowStatus = 'not_yet_open';
  } else if (settings.assessmentCloseDate && todayStr > settings.assessmentCloseDate) {
    windowStatus = 'closed';
  }

  // Step 1: Identification
  const [identStep, setIdentStep] = useState(true);
  const [identNama, setIdentNama] = useState('');
  const [identWa, setIdentWa] = useState('');
  const [identError, setIdentError] = useState<string | null>(null);
  const [verifiedNama, setVerifiedNama] = useState('');

  // Step 2: Assessment Data
  // Bagian 1: 35 questions (8 categories)
  const [b3Answers, setB3Answers] = useState<(number | null)[][]>(
    BAGIAN_3_DEFINITIONS.map((kat) => kat.pertanyaan.map(() => null))
  );

  // Bagian 2 (indices 0-6): Kurasi Kesiapan (1-5 buttons)
  // Bagian 3 (indices 7-14): Radar Kinerja (sliders 1-5)
  const [scores, setScores] = useState<number[]>(
    ASESMEN_KRITERIA.map((_, i) => (i >= 7 ? 3 : 0))
  );
  const [sliderTouched, setSliderTouched] = useState<boolean[]>(
    ASESMEN_KRITERIA.map(() => false)
  );
  const [catatan, setCatatan] = useState<string[]>(
    ASESMEN_KRITERIA.map(() => '')
  );

  // Reflection
  const [poinBisaAjarkan, setPoinBisaAjarkan] = useState('');
  const [materiBisaAjarkan, setMateriBisaAjarkan] = useState('');
  const [poinPerluDipelajari, setPoinPerluDipelajari] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{ totalSkor: number } | null>(null);

  // Verify Identification
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIdentError(null);

    if (!identNama.trim() || !identWa.trim()) {
      setIdentError('Nama Usaha dan Nomor WhatsApp wajib diisi.');
      return;
    }

    const check = gasService.verifyPesertaIdentity(identNama.trim(), identWa.trim());
    if (check.alreadySubmitted) {
      setIdentError(`Asesmen mandiri untuk "${check.namaUsaha || identNama}" sudah pernah dikirimkan sebelumnya. Setiap peserta hanya dapat mengisi satu kali per sesi.`);
      return;
    }
    if (check.found && check.namaUsaha) {
      setVerifiedNama(check.namaUsaha);
      setIdentStep(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIdentError('Data tidak ditemukan. Pastikan Nama Usaha dan Nomor WhatsApp sama persis seperti saat mendaftar program.');
    }
  };

  const handleB3Select = (catIdx: number, qIdx: number, optIdx: number) => {
    setB3Answers((prev) => {
      const next = prev.map((row) => [...row]);
      next[catIdx][qIdx] = optIdx;
      return next;
    });
  };

  const handleScoreChange = (idx: number, score: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[idx] = score;
      return next;
    });
  };

  const handleSliderChange = (idx: number, val: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    setSliderTouched((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const handleCatatanChange = (idx: number, text: string) => {
    setCatatan((prev) => {
      const next = [...prev];
      next[idx] = text;
      return next;
    });
  };

  // Helper labels for slider
  const getSliderLabel = (score: number) => {
    if (score <= 2) return { text: 'Lemah', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (score === 3) return { text: 'Sedang', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { text: 'Kuat', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  // Dynamic Kuat / Lemah lists for reflection dropdowns
  const radarCategories = ASESMEN_KRITERIA.slice(7);
  const kuatCategories = radarCategories.filter((_, i) => scores[7 + i] >= 4);
  const lemahCategories = radarCategories.filter((_, i) => scores[7 + i] <= 2);

  const totalScore = scores.reduce((sum, s) => sum + s, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate Bagian 1 (35 questions)
    for (let c = 0; c < BAGIAN_3_DEFINITIONS.length; c++) {
      for (let q = 0; q < BAGIAN_3_DEFINITIONS[c].pertanyaan.length; q++) {
        if (b3Answers[c][q] === null) {
          setFormError(`Mohon jawab pertanyaan di Bagian 1 (${BAGIAN_3_DEFINITIONS[c].kategori}) nomor ${q + 1}.`);
          return;
        }
      }
    }

    // Validate Bagian 2 (Kurasi 1-5 buttons)
    for (let i = 0; i < 7; i++) {
      if (scores[i] === 0) {
        setFormError(`Mohon berikan skor untuk kriteria "${ASESMEN_KRITERIA[i]}" pada Bagian 2.`);
        return;
      }
    }

    // Validate Bagian 3 (Sliders & explanation notes >= 15 chars)
    for (let i = 7; i < ASESMEN_KRITERIA.length; i++) {
      if (!sliderTouched[i]) {
        setFormError(`Kategori "${ASESMEN_KRITERIA[i]}" pada Bagian 3 belum dinilai. Geser slider untuk menyesuaikan kondisi usaha Anda.`);
        return;
      }
      if (catatan[i].trim().length < 15) {
        setFormError(`Penjelasan pada kategori "${ASESMEN_KRITERIA[i]}" terlalu singkat (minimal 15 karakter). Berikan bukti/penjelasan yang lebih jelas.`);
        return;
      }
    }

    // Validate reflection
    if (materiBisaAjarkan.trim().length < 10) {
      setFormError('Mohon isi "Bidang/Materi spesifik yang bisa diajarkan" (minimal 10 karakter).');
      return;
    }

    setIsSubmitting(true);

    const kriteriaData = ASESMEN_KRITERIA.map((k, i) => ({
      skor: scores[i],
      catatan: catatan[i] || ''
    }));

    const bagian3Data = BAGIAN_3_DEFINITIONS.map((kat, c) => {
      const rincian = kat.pertanyaan.map((q, qIdx) => {
        const optIdx = b3Answers[c][qIdx] || 0;
        return {
          pertanyaan: q.teks,
          jawaban: q.opsi[optIdx] || '',
          skor: optIdx + 1
        };
      });
      const avg = rincian.reduce((sum, r) => sum + r.skor, 0) / rincian.length;
      return {
        kategori: kat.kategori,
        skorRataRata: Math.round(avg * 100) / 100,
        rincian
      };
    });

    const res = gasService.submitAssessment({
      namaUsaha: verifiedNama,
      whatsapp: identWa,
      kriteria: kriteriaData,
      poinBisaAjarkan,
      materiBisaAjarkan,
      poinPerluDipelajari,
      bagian3: bagian3Data
    });

    setIsSubmitting(false);

    if (res.status === 'success') {
      setSubmitSuccess({ totalSkor: res.totalSkor || totalScore });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setFormError(res.message);
    }
  };

  // Closed or Not yet open
  if (windowStatus !== 'open') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
            {windowStatus === 'not_yet_open' ? <Clock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl font-bold text-[#001c3c]">
            {windowStatus === 'not_yet_open' ? 'Asesmen Belum Dibuka' : 'Asesmen Telah Ditutup'}
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed text-sm max-w-md mx-auto">
            {windowStatus === 'not_yet_open' ? (
              <>
                Pengisian asesmen mandiri untuk peserta dijadwalkan dibuka pada{' '}
                <strong>{formatTanggalIndonesia(settings.assessmentOpenDate)}</strong>. Silakan cek kembali saat periode dibuka.
              </>
            ) : (
              <>
                Pengisian asesmen mandiri telah ditutup sejak{' '}
                <strong>{formatTanggalIndonesia(settings.assessmentCloseDate)}</strong>. Terima kasih atas partisipasi Anda.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Success screen
  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#001c3c]">Asesmen Mandiri Berhasil Terkirim!</h2>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-lg mx-auto">
            Terima kasih <strong className="text-slate-900">{verifiedNama}</strong>. Asesmen mandiri Anda telah berhasil dihitung dengan total skor:
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#eaf2fb] text-[#001c3c] font-black text-2xl border border-blue-200">
            <span>{submitSuccess.totalSkor}</span>
            <span className="text-base text-slate-500 font-semibold">/ 75</span>
          </div>

          <p className="mt-4 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Data ini langsung masuk ke pemetaan Peta Kolaborasi untuk pencocokan program saling mengajar dan kelompok circle mentoring UMKM Kota Batu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#001c3c] via-[#004c80] to-[#0070b3] rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg border-b-4 border-[#ffc72c] mb-5 sm:mb-6">
        <div className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#ffc72c] mb-1">
          Gekrafs PartnerUp &middot; Kota Batu
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
          Asesmen Mandiri Peserta
        </h1>
        <p className="mt-2 text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
          Isi asesmen ini dengan jujur dan objektif sesuai kondisi usaha saat ini. Hasilnya digunakan untuk memetakan kebutuhan pelatihan dan mencocokkan Anda dalam sesi mentoring kolaboratif.
        </p>
      </div>

      {/* Step 1: Identification */}
      {identStep ? (
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            Halaman asesmen ini khusus untuk peserta yang <strong>sudah mendaftar program</strong>. Jika belum mendaftar, silakan{' '}
            {onNavigateToRegister ? (
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="underline font-bold text-[#001c3c]"
              >
                isi form pendaftaran terlebih dahulu
              </button>
            ) : (
              'isi form pendaftaran terlebih dahulu'
            )}.
          </div>

          <div className="flex items-center gap-2 text-[#001c3c] font-bold text-base border-b border-slate-100 pb-2">
            <UserCheck className="w-5 h-5 text-[#004c80]" />
            <span>Identifikasi Peserta</span>
          </div>

          <p className="text-xs text-slate-600">
            Masukkan Nama Usaha dan Nomor WhatsApp yang sama seperti saat mendaftar, agar asesmen tertaut secara akurat ke data pendaftaran Anda.
          </p>

          {identError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{identError}</div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Usaha <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                list="registeredNamesDatalist"
                placeholder="Pilih atau ketik nama usaha..."
                value={identNama}
                onChange={(e) => setIdentNama(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-[#004c80] outline-none"
              />
              <datalist id="registeredNamesDatalist">
                {registeredNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nomor WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Sesuai nomor WhatsApp saat mendaftar"
                value={identWa}
                onChange={(e) => setIdentWa(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-[#004c80] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#001c3c] to-[#004c80] text-white font-extrabold text-sm hover:opacity-95 active:opacity-90 transition-opacity shadow-md"
            >
              Lanjutkan ke Form Asesmen &rarr;
            </button>
          </form>
        </div>
      ) : (
        /* Step 2: Assessment Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Verified Badge */}
          <div className="bg-[#eaf2fb] border-l-4 border-[#001c3c] p-3.5 sm:p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm">
            <div>
              <span className="text-slate-600">Mengisi asesmen sebagai:</span>{' '}
              <strong className="text-[#001c3c] font-bold text-sm sm:text-base">{verifiedNama}</strong>
            </div>
            <button
              type="button"
              onClick={() => setIdentStep(true)}
              className="text-xs text-[#004c80] underline font-semibold"
            >
              Ganti Usaha
            </button>
          </div>

          {formError && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>{formError}</div>
            </div>
          )}

          {/* Bagian 1: Diagnosa Mendalam (35 Questions) */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#001c3c] font-extrabold text-sm sm:text-base uppercase pb-2 border-b border-slate-100">
                <ClipboardCheck className="w-5 h-5 text-[#004c80] flex-shrink-0" />
                <span>Bagian 1 — Diagnosa 8 Kategori Bisnis</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pilih <strong>SATU</strong> pernyataan yang paling menggambarkan kondisi usaha Anda saat ini pada tiap pertanyaan.
              </p>
            </div>

            {BAGIAN_3_DEFINITIONS.map((kat, catIdx) => (
              <div key={kat.kategori} className="pt-2">
                <div className="px-3.5 py-2 rounded-lg bg-[#001c3c] text-white text-xs font-bold uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>
                    {catIdx + 1}. {kat.kategori}
                  </span>
                </div>

                <div className="space-y-4">
                  {kat.pertanyaan.map((q, qIdx) => {
                    const selectedOpt = b3Answers[catIdx][qIdx];
                    const isAnswered = selectedOpt !== null;

                    return (
                      <div
                        key={qIdx}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                          isAnswered
                            ? 'border-slate-200 bg-white'
                            : 'border-amber-300 bg-amber-50/40'
                        }`}
                      >
                        <div className="font-bold text-xs sm:text-sm text-slate-900 mb-2.5 leading-snug">
                          {qIdx + 1}. {q.teks}
                        </div>

                        <div className="space-y-2">
                          {q.opsi.map((opsiText, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleB3Select(catIdx, qIdx, optIdx)}
                                className={`w-full text-left p-3 sm:p-2.5 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-2.5 active:scale-[0.99] ${
                                  isChosen
                                    ? 'bg-[#eaf2fb] border-[#001c3c] font-semibold text-[#001c3c] shadow-sm ring-1 ring-[#001c3c]'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                                    isChosen ? 'border-[#001c3c] bg-[#001c3c]' : 'border-slate-300'
                                  }`}
                                >
                                  {isChosen && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <span className="flex-1">{opsiText}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bagian 2: Kurasi Kesiapan (7 Kriteria, Score 1-5) */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#001c3c] font-extrabold text-sm sm:text-base uppercase pb-2 border-b border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-[#004c80] flex-shrink-0" />
                <span>Bagian 2 — Kurasi Kesiapan UMKM Kreatif</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Beri skor 1 (sangat kurang) sampai 5 (sangat baik) beserta catatan penjelasan singkat.
              </p>
            </div>

            <div className="space-y-5">
              {ASESMEN_KRITERIA.slice(0, 7).map((kriteria, idx) => (
                <div key={kriteria} className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="font-bold text-xs sm:text-sm text-[#001c3c]">
                    {idx + 1}. {kriteria}
                  </div>

                  {/* 1-5 buttons */}
                  <div>
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleScoreChange(idx, val)}
                          className={`py-2.5 sm:py-2 rounded-lg font-bold text-sm sm:text-xs transition-colors active:scale-95 ${
                            scores[idx] === val
                              ? 'bg-[#001c3c] text-white shadow ring-2 ring-[#001c3c]'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1 font-semibold">
                      <span>1 = Kurang</span>
                      <span>5 = Baik</span>
                    </div>
                  </div>

                  {/* Explanation note */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Catatan / Bukti Penjelasan
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tuliskan alasan singkat skor yang Anda pilih..."
                      value={catatan[idx]}
                      onChange={(e) => handleCatatanChange(idx, e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#004c80] outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian 3: Radar Kinerja Bisnis (8 Sliders) */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#001c3c] font-extrabold text-sm sm:text-base uppercase pb-2 border-b border-slate-100">
                <Sliders className="w-5 h-5 text-[#004c80] flex-shrink-0" />
                <span>Bagian 3 — Kategori Kinerja Bisnis (Radar)</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Geser slider untuk menunjukkan posisi usaha Anda saat ini: Lemah (1-2), Sedang (3), atau Kuat (4-5).
                Wajib sertakan penjelasan (minimal 15 karakter).
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {ASESMEN_KRITERIA.slice(7).map((kriteria, relIdx) => {
                const globalIdx = 7 + relIdx;
                const score = scores[globalIdx];
                const touched = sliderTouched[globalIdx];
                const labelInfo = getSliderLabel(score);

                return (
                  <div
                    key={kriteria}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      !touched ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="font-bold text-xs sm:text-sm text-[#001c3c]">
                        {relIdx + 1}. {kriteria}
                      </div>

                      {touched ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${labelInfo.color}`}>
                          {labelInfo.text} ({score}/5)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Geser Slider
                        </span>
                      )}
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={score}
                      onChange={(e) => handleSliderChange(globalIdx, Number(e.target.value))}
                      className="w-full h-3 sm:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#001c3c]"
                    />

                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                      <span>1 - Lemah</span>
                      <span>3 - Sedang</span>
                      <span>5 - Kuat</span>
                    </div>

                    <div className="mt-3">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Penjelasan Mengapa Lemah / Sedang / Kuat (Min. 15 karakter) <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Jelaskan alasan kondisi pilar bisnis Anda ini..."
                        value={catatan[globalIdx]}
                        onChange={(e) => handleCatatanChange(globalIdx, e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#004c80] outline-none resize-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Refleksi Kolaborasi */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm uppercase text-[#001c3c] border-b border-slate-100 pb-2">
              Refleksi Kolaborasi & Peer Mentoring
            </h3>
            <p className="text-xs text-slate-600">
              Jawaban ini membantu tim kurator mencocokkan Anda dengan peserta lain untuk saling belajar dan mengajar.
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dari poin yang dirasa KUAT, poin mana yang mampu Anda bagikan/ajarkan?
                </label>
                <select
                  value={poinBisaAjarkan}
                  onChange={(e) => setPoinBisaAjarkan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#004c80] outline-none bg-slate-50/50 font-semibold"
                >
                  <option value="">-- Pilih Kategori Unggulan Anda --</option>
                  {kuatCategories.map((k) => (
                    <option key={k} value={k}>
                      {k} (Skor Kuat)
                    </option>
                  ))}
                  {kuatCategories.length === 0 && (
                    <option value="" disabled>
                      (Belum ada kategori yang dinilai Kuat skor 4-5)
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Bidang/Materi spesifik apa yang bisa Anda ajarkan? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Strategi closing WhatsApp, fotografi produk dengan HP, SOP dapur higienis, manajemen kas via aplikasi..."
                  value={materiBisaAjarkan}
                  onChange={(e) => setMateriBisaAjarkan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#004c80] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dari poin yang dirasa LEMAH, poin mana yang paling mendesak untuk Anda pelajari?
                </label>
                <select
                  value={poinPerluDipelajari}
                  onChange={(e) => setPoinPerluDipelajari(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#004c80] outline-none bg-slate-50/50 font-semibold"
                >
                  <option value="">-- Pilih Kategori yang Perlu Ditingkatkan --</option>
                  {lemahCategories.map((k) => (
                    <option key={k} value={k}>
                      {k} (Skor Lemah)
                    </option>
                  ))}
                  {lemahCategories.length === 0 && (
                    <option value="" disabled>
                      (Semua kategori dinilai Sedang/Kuat)
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Sticky Total Score Bar & Submit */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#001c3c] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="text-xs text-[#ffc72c] font-bold uppercase">Total Skor Asesmen</div>
              <div className="text-2xl font-black">
                {totalScore} <span className="text-sm font-semibold opacity-70">/ 75</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffc72c] to-amber-500 text-[#001c3c] font-extrabold text-sm hover:opacity-95 transition-opacity shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan Asesmen...' : 'Kirim Asesmen Mandiri'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
