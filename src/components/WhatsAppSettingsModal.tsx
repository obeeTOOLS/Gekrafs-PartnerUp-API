import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Users, 
  Shield, 
  Smartphone, 
  Send,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { whatsappService, WhatsAppSettings, FonnteGroupItem } from '../services/whatsappService';

interface WhatsAppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const WhatsAppSettingsModal: React.FC<WhatsAppSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [settings, setSettings] = useState<WhatsAppSettings>(whatsappService.getSettings());
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isCheckingDevice, setIsCheckingDevice] = useState(false);
  const [isFetchingGroups, setIsFetchingGroups] = useState(false);
  const [groups, setGroups] = useState<FonnteGroupItem[]>([]);
  const [dedupCount, setDedupCount] = useState<number>(0);
  const [resetDedupMsg, setResetDedupMsg] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<{
    success: boolean;
    status: string;
    device?: string;
    quota?: string | number;
    message: string;
  } | null>(null);

  const [testPhone, setTestPhone] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const s = whatsappService.getSettings();
      setSettings(s);
      setTestResult(null);
      setSaveSuccess(false);
      setResetDedupMsg(null);
      const log = whatsappService.getDedupLog();
      setDedupCount(Object.keys(log).length);

      if (s.fonnteToken) {
        checkDevice(s.fonnteToken);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearDedup = () => {
    whatsappService.clearDedupLog();
    setDedupCount(0);
    setResetDedupMsg('Riwayat anti-duplikasi telah direset. Anda dapat menguji coba nomor yang sama kembali.');
    setTimeout(() => setResetDedupMsg(null), 4000);
  };

  const checkDevice = async (token?: string) => {
    setIsCheckingDevice(true);
    const res = await whatsappService.checkDeviceStatus(token || settings.fonnteToken);
    setDeviceInfo(res);
    setIsCheckingDevice(false);
  };

  const fetchGroups = async () => {
    setIsFetchingGroups(true);
    const res = await whatsappService.fetchFonnteGroups(settings.fonnteToken);
    if (res.success) {
      setGroups(res.groups);
    }
    setDeviceInfo((prev) => ({
      success: res.success,
      status: prev?.status || 'connect',
      message: res.message,
      quota: prev?.quota
    }));
    setIsFetchingGroups(false);
  };

  const handleSave = () => {
    whatsappService.saveSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (onSaved) onSaved();
      onClose();
    }, 1500);
  };

  const handleTestSend = async () => {
    if (!testPhone.trim()) {
      setTestResult({ success: false, message: 'Nomor WhatsApp uji coba wajib diisi.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    const testMsg = 
      `Halo! 👋\n\nIni adalah *pesan uji coba* dari sistem *GEKRAFS PartnerUp Kota Batu* via Fonnte Gateway.\n\n` +
      `Waktu Uji: ${new Date().toLocaleTimeString('id-ID')}\nStatus: *Berhasil Terhubung* 🚀`;

    const res = await whatsappService.sendViaFonnte(testPhone, testMsg);
    setTestResult(res);
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#001c3c] to-[#075e54] text-white p-5 sm:p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Pengaturan WhatsApp & Fonnte Gateway
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Konfigurasi Token API, ID Grup WhatsApp, dan Otomatisasi
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

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Guide Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#001c3c] flex items-center gap-1.5 uppercase tracking-wide">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Panduan Singkat Fonnte:</span>
              </span>
              <a
                href="https://fonnte.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
              >
                <span>Buka Fonnte.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Daftar gratis di <strong>fonnte.com</strong>, scan QR WhatsApp nomor resmi/panitia, salin <strong>API Token</strong> ke kolom di bawah ini.
            </p>
          </div>

          {/* Section 1: API Token */}
          <div className="space-y-2">
            <label className="block font-extrabold uppercase text-[#001c3c] tracking-wider">
              Token API Fonnte:
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="Contoh: abcd1234xyz..."
                value={settings.fonnteToken}
                onChange={(e) => setSettings({ ...settings, fonnteToken: e.target.value })}
                className="w-full p-2.5 pr-20 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-xs"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => checkDevice()}
                  disabled={isCheckingDevice || !settings.fonnteToken}
                  title="Cek Status Device & Kuota"
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isCheckingDevice ? 'animate-spin' : ''}`} />
                  <span>Cek</span>
                </button>
              </div>
            </div>

            {/* Device Info Badge */}
            {deviceInfo && (
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-[11px] ${
                  deviceInfo.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {deviceInfo.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{deviceInfo.message}</span>
                </div>
                {deviceInfo.quota !== undefined && (
                  <span className="font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-mono">
                    Kuota: {deviceInfo.quota}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Section 2: WhatsApp Group IDs */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-extrabold uppercase text-[#001c3c] tracking-wider">
                  Target Grup WhatsApp Resmi:
                </label>
                <p className="text-[11px] text-slate-500">
                  Untuk menerima notifikasi otomatis dan broadcast pengumuman.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchGroups}
                disabled={isFetchingGroups || !settings.fonnteToken}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isFetchingGroups ? 'animate-spin' : ''}`} />
                <span>Tarik Daftar Grup WA</span>
              </button>
            </div>

            {/* Dropdown list if fetched */}
            {groups.length > 0 && (
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                <span className="font-bold text-emerald-950 block">Pilih dari Daftar Grup yang Ditemukan:</span>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {groups.map((g) => (
                    <div
                      key={g.id}
                      className="p-1.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px]"
                    >
                      <div className="truncate max-w-[240px]">
                        <span className="font-bold text-slate-800 block truncate">{g.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">{g.id}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, pesertaGroupId: g.id, pesertaGroupName: g.name })}
                          className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold"
                        >
                          Set Peserta
                        </button>
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, panitiaGroupId: g.id, panitiaGroupName: g.name })}
                          className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-800 text-[10px] font-bold"
                        >
                          Set Panitia
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Grup Peserta */}
            <div className="space-y-1">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>ID Grup Peserta PartnerUp:</span>
              </span>
              <input
                type="text"
                placeholder="Contoh: 120363024829384729@g.us"
                value={settings.pesertaGroupId}
                onChange={(e) => setSettings({ ...settings, pesertaGroupId: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
              {settings.pesertaGroupName && (
                <span className="text-[10px] text-blue-700 font-medium">
                  Nama Grup: <strong>{settings.pesertaGroupName}</strong>
                </span>
              )}
            </div>

            {/* Input Grup Panitia */}
            <div className="space-y-1">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>ID Grup Internal Panitia & Kurator:</span>
              </span>
              <input
                type="text"
                placeholder="Contoh: 120363999999999999@g.us"
                value={settings.panitiaGroupId}
                onChange={(e) => setSettings({ ...settings, panitiaGroupId: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
              {settings.panitiaGroupName && (
                <span className="text-[10px] text-purple-700 font-medium">
                  Nama Grup: <strong>{settings.panitiaGroupName}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Section 3: Automation Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block font-extrabold uppercase text-[#001c3c] tracking-wider">
              Otomatisasi Pemicu Pesan:
            </label>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Kirim Konfirmasi ke WA Peserta Baru</span>
                  <span className="text-[10px] text-slate-500 block">
                    Otomatis kirim ucapan terima kasih & ID pendaftaran saat form disubmit.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSendRegistration}
                  onChange={(e) => setSettings({ ...settings, autoSendRegistration: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Kirim Notifikasi ke Grup Panitia</span>
                  <span className="text-[10px] text-slate-500 block">
                    Panitia langsung tahu nama usaha & subsektor pendaftar baru di grup WA.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoNotifyGroupOnRegister}
                  onChange={(e) => setSettings({ ...settings, autoNotifyGroupOnRegister: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Opsi Kirim Status Kurasi</span>
                  <span className="text-[10px] text-slate-500 block">
                    Menyediakan pengiriman hasil kurasi (Lolos/Cadangan) via Fonnte otomatis atau wa.me.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSendCurationStatus}
                  onChange={(e) => setSettings({ ...settings, autoSendCurationStatus: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 4: Test Send */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <span className="font-extrabold uppercase text-[#001c3c] tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>Uji Coba Pengiriman Pesan (Test Send):</span>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nomor WhatsApp Anda (misal: 08123456789)"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-slate-300 text-xs"
              />
              <button
                type="button"
                onClick={handleTestSend}
                disabled={isTesting || !testPhone.trim() || !settings.fonnteToken}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50 transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isTesting ? 'Menguji...' : 'Kirim Tes'}</span>
              </button>
            </div>

            {testResult && (
              <p className={`text-[11px] font-bold ${testResult.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                {testResult.message}
              </p>
            )}
          </div>

          {/* Section 5: Proteksi Anti-Duplikasi & Anti-Spam */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold uppercase text-emerald-950 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Proteksi Anti-Duplikasi & Anti-Spam (Aktif)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-800 text-[10px] font-bold">
                {dedupCount} Pesan Terproteksi
              </span>
            </div>
            
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              Sistem secara otomatis mencegah pesan yang sama terkirim berulang kali:
              <br />
              &bull; <strong>Konfirmasi Pendaftaran:</strong> Maksimal 1x per nomor dalam 24 jam.
              <br />
              &bull; <strong>Notifikasi Panitia:</strong> Maksimal 1x per pendaftar dalam 24 jam.
              <br />
              &bull; <strong>Status Kurasi:</strong> Jeda 10 menit untuk mencegah klik ganda tak sengaja.
              <br />
              &bull; <strong>Rapid-Click Guard:</strong> Pesan identik ke target sama dibatasi jeda 15 detik.
            </p>

            <div className="pt-1 flex items-center justify-between border-t border-emerald-200/50">
              <span className="text-[10px] text-emerald-700 italic">
                Ingin mengulang tes ke nomor HP yang sama?
              </span>
              <button
                type="button"
                onClick={handleClearDedup}
                className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Hapus cache riwayat pengiriman agar Anda dapat menguji kembali nomor yang sama"
              >
                <RotateCcw className="w-3 h-3 text-emerald-600" />
                <span>Reset Cache Uji Coba</span>
              </button>
            </div>

            {resetDedupMsg && (
              <p className="text-[11px] font-bold text-emerald-800 bg-white/80 p-2 rounded-lg border border-emerald-300">
                {resetDedupMsg}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
          <div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pengaturan berhasil disimpan!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#001c3c] hover:bg-[#002c5c] text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
