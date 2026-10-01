import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  X, 
  Sparkles, 
  Users, 
  Shield, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink,
  Settings,
  AlertCircle,
  Clock,
  CheckCheck
} from 'lucide-react';
import { whatsappService, WhatsAppSettings } from '../services/whatsappService';

interface WhatsAppBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export const WhatsAppBroadcastModal: React.FC<WhatsAppBroadcastModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings
}) => {
  const [settings, setSettings] = useState<WhatsAppSettings>(whatsappService.getSettings());
  const [targetType, setTargetType] = useState<'peserta' | 'panitia' | 'both' | 'custom'>('peserta');
  const [customTarget, setCustomTarget] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(whatsappService.getSettings());
      setStatusNotification(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasToken = !!settings.fonnteToken;
  const hasPesertaGroup = !!settings.pesertaGroupId;
  const hasPanitiaGroup = !!settings.panitiaGroupId;

  const handleApplyTemplate = (type: string) => {
    let tpl = '';
    if (type === 'jadwal') {
      tpl = `Halo rekan-rekan UMKM Kreatif Kota Batu! 🌟\n\nMengingatkan kembali bahwa sesi kelas pembinaan berikutnya akan dilaksanakan pada:\n📅 Hari/Tanggal: Sabtu, 10 Oktober 2026\n⏰ Waktu: 09.00 - 12.00 WIB\n📍 Lokasi: Graha Pancasila Balai Kota Among Tani, Batu\n📌 Agenda: *Workshop Strategi Branding & Kemasan Ekraf*\n\nMohon hadir tepat waktu dan membawa contoh produk usaha masing-masing. Presensi akan menggunakan scan QR di lokasi acara. Sampai jumpa! 🚀`;
    } else if (type === 'presensi') {
      tpl = `Halo semuanya! 📢\n\nPresensi kehadiran sesi hari ini telah dibuka di aplikasi web GEKRAFS PartnerUp.\nSilakan lakukan scan QR Code pada layar panitia atau buka menu *Presensi & Absensi QR* pada aplikasi:\nhttps://ais-dev-ijwjef33hzkvilef4tuyto-118536196094.asia-east1.run.app/?page=kehadiran\n\nTerima kasih! 🙌`;
    } else if (type === 'asesmen') {
      tpl = `Pengumuman Evaluasi Mandiri 📊\n\nBagi rekan-rekan peserta yang belum menyelesaikan *Asesmen Mandiri 5 Pilar*, diharapkan untuk melengkapinya sebelum evaluasi kurasi pekan ini.\nDiagram radar hasil asesmen Anda akan menjadi acuan pendampingan intensif bersama kurator ahli.`;
    } else if (type === 'penting') {
      tpl = `*PEMBERITAHUAN PENTING:* ⚠️\n\nSehubungan dengan persiapan pameran ekraf Kota Batu, seluruh peserta dimohon memperbarui data legalitas (NIB & Sertifikat Halal) di form aplikasi sebelum hari Jumat pukul 17.00 WIB.\n\nJika ada kendala, hubungi panitia kurator melalui kontak resmi GEKRAFS.`;
    }
    setMessage(tpl);
  };

  const handleSendFonnte = async () => {
    if (!message.trim()) {
      setStatusNotification({ type: 'error', text: 'Isi pesan pengumuman tidak boleh kosong.' });
      return;
    }

    if (!hasToken) {
      setStatusNotification({
        type: 'error',
        text: 'Token Fonnte belum dikonfigurasi. Silakan atur token di menu Pengaturan.'
      });
      return;
    }

    setIsSending(true);
    setStatusNotification(null);

    try {
      const res = await whatsappService.broadcastToGroups(
        message,
        targetType,
        targetType === 'custom' ? customTarget : undefined
      );

      const allSuccess = res.results.length > 0 && res.results.every((r) => r.success);
      if (allSuccess) {
        setStatusNotification({
          type: 'success',
          text: `🎉 Pengumuman berhasil dikirim ke grup WhatsApp! (${res.summaryMessage})`
        });
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        const errorDetails = res.results.map((r) => r.message).join(', ');
        setStatusNotification({
          type: 'error',
          text: `Pengiriman belum sepenuhnya berhasil: ${errorDetails || res.summaryMessage}`
        });
      }
    } catch (err: any) {
      setStatusNotification({
        type: 'error',
        text: `Gagal mengirim pengumuman: ${err.message}`
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyMessage = () => {
    const fullText = whatsappService.buildBroadcastMessage(message || 'Isi pengumuman');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenManualWhatsApp = () => {
    const fullText = whatsappService.buildBroadcastMessage(message);
    const url = `https://web.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#001c3c] via-[#003966] to-[#075e54] text-white p-5 sm:p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Broadcast Pengumuman WhatsApp
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Fonnte Gateway
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Kirim pengumuman resmi instan ke Grup Peserta & Panitia PartnerUp
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusNotification && (
          <div
            className={`p-3 text-xs font-bold flex items-center gap-2 border-b ${
              statusNotification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : statusNotification.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{statusNotification.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Fonnte Configuration Warning */}
          {!hasToken && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Token Fonnte Belum Diisi</p>
                  <p className="text-amber-800 mt-0.5">
                    Pengiriman otomatis ke grup memerlukan token API Fonnte. Anda tetap bisa menggunakan tombol <strong>Kirim Manual via WA Web</strong>.
                  </p>
                </div>
              </div>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-extrabold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Pengaturan</span>
                </button>
              )}
            </div>
          )}

          {/* Target Group Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-[#001c3c] tracking-wider mb-2">
              Pilih Target Penerima Pengumuman:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTargetType('peserta')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  targetType === 'peserta'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">Grup Peserta</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  {settings.pesertaGroupName || (hasPesertaGroup ? settings.pesertaGroupId : 'Belum diatur')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('panitia')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  targetType === 'panitia'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">Grup Panitia</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  {settings.panitiaGroupName || (hasPanitiaGroup ? settings.panitiaGroupId : 'Belum diatur')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('both')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  targetType === 'both'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">Kedua Grup</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Peserta & Panitia serentak
                </p>
              </button>
            </div>

            {targetType === 'custom' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="Masukkan Nomor WhatsApp atau ID Grup (contoh: 08123456789 atau 12036302482@g.us)"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Quick Template Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pilih Template Cepat:</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyTemplate('jadwal')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                📅 Pengingat Sesi Kelas
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('presensi')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                📱 Pembukaan Scan Presensi
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('asesmen')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                📊 Asesmen 5 Pilar
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('penting')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                ⚠️ Pemberitahuan Penting
              </button>
            </div>
          </div>

          {/* Textarea Composer */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold uppercase text-[#001c3c] tracking-wider">
                Isi Pengumuman:
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {message.length} karakter
              </span>
            </div>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik isi pengumuman bebas untuk grup WhatsApp di sini... Format WhatsApp didukung: *tebal*, _miring_, dan bullet poin."
              className="w-full text-xs p-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans leading-relaxed"
            />
          </div>

          {/* Live WhatsApp Bubble Preview */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Pratinjau Tampilan di WhatsApp:
            </span>
            <div className="bg-[#efeae2] p-4 rounded-2xl border border-slate-200 relative overflow-hidden">
              <div className="max-w-md bg-white rounded-xl p-3 shadow-xs border border-emerald-100 relative text-xs leading-relaxed space-y-2">
                <div className="text-[11px] font-bold text-[#075e54] flex items-center justify-between border-b border-slate-100 pb-1">
                  <span>GEKRAFS PartnerUp Official</span>
                  <span className="text-[10px] text-slate-400 font-normal">Hari ini</span>
                </div>
                <div className="text-slate-800 whitespace-pre-wrap font-sans">
                  {message ? (
                    message
                  ) : (
                    <em className="text-slate-400">Pratinjau pesan akan muncul di sini...</em>
                  )}
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>Sekarang</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyMessage}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenManualWhatsApp}
              title="Kirim manual via WhatsApp Web"
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-emerald-300 hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Buka WA Web</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSendFonnte}
              disabled={isSending || !message.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isSending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengirim ke Grup...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim ke Grup Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
