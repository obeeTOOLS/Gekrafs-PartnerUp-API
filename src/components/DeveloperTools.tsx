import React, { useState } from 'react';
import { gasService } from '../services/gasService';
import { HEADLESS_GAS_CODE } from '../services/headlessGasCode';
import { whatsappService } from '../services/whatsappService';
import { authService } from '../services/authService';
import { WhatsAppSettingsModal } from './WhatsAppSettingsModal';
import { WhatsAppBroadcastModal } from './WhatsAppBroadcastModal';
import { 
  Terminal, 
  Copy, 
  Check, 
  Send, 
  Download, 
  RotateCcw, 
  FileCode, 
  CheckCircle2, 
  AlertCircle,
  Database,
  CloudDownload,
  FileSpreadsheet,
  FileCheck,
  MessageSquare,
  Settings,
  Smartphone,
  ExternalLink,
  Key,
  Clipboard,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

export const DeveloperTools: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [testUrl, setTestUrl] = useState(gasService.getSettings().gasEndpointUrl);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(gasService.getSettings().autoSync);

  // WhatsApp states
  const [isWaSettingsOpen, setIsWaSettingsOpen] = useState(false);
  const [isWaBroadcastOpen, setIsWaBroadcastOpen] = useState(false);
  const [waSettings, setWaSettings] = useState(whatsappService.getSettings());
  const [quickTokenInput, setQuickTokenInput] = useState(waSettings.fonnteToken || '');
  const [showQuickToken, setShowQuickToken] = useState(false);
  const [isSavingQuickToken, setIsSavingQuickToken] = useState(false);
  const [quickTokenFeedback, setQuickTokenFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Live Sheet Pull State
  const [customSheetId, setCustomSheetId] = useState('183uoyYw6opnr3w7T6oljvwuy5Rzs7GZE7fM3vi_pwm4');
  const [isPulling, setIsPulling] = useState(false);
  const [pullResult, setPullResult] = useState<{
    success: boolean;
    message: string;
    counts?: { peserta: number; asesmen: number; timeline: number; jadwal: number };
  } | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(HEADLESS_GAS_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestEndpoint = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await gasService.testConnection(testUrl);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSaveEndpoint = () => {
    gasService.saveSettings({ gasEndpointUrl: testUrl, autoSync });
    alert('Pengaturan endpoint GAS berhasil disimpan!');
  };

  const handlePullFromLiveSheet = async () => {
    setIsPulling(true);
    setPullResult(null);
    const res = await gasService.syncFromLiveSpreadsheet(customSheetId.trim());
    setPullResult(res);
    setIsPulling(false);
  };

  const handleExportJson = () => {
    const jsonStr = gasService.exportAllDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GekrafsPartnerUp_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Yakin ingin mereset data lokal ke data awal? Data perubahan lokal akan dikembalikan.')) {
      const res = gasService.resetToDefaultData();
      setResetMessage(res.message);
      setTimeout(() => setResetMessage(null), 3000);
    }
  };

  const handleSaveQuickToken = async () => {
    const clean = quickTokenInput.trim();
    if (!clean) {
      setQuickTokenFeedback({ success: false, message: 'Masukkan atau tempelkan token Fonnte terlebih dahulu.' });
      setTimeout(() => setQuickTokenFeedback(null), 4000);
      return;
    }
    setIsSavingQuickToken(true);
    setQuickTokenFeedback(null);

    // Simpan ke whatsappService multi-storage (localStorage + master backup + cookie + gasService)
    const updated = whatsappService.saveSettings({ fonnteToken: clean });
    setWaSettings({ ...updated });

    // Uji status device langsung ke server Fonnte
    const deviceRes = await whatsappService.checkDeviceStatus(clean);
    setIsSavingQuickToken(false);

    if (deviceRes.success) {
      setQuickTokenFeedback({
        success: true,
        message: `Token Fonnte tersimpan & TERHUBUNG! Device: ${deviceRes.device || 'Online'} (Sisa kuota: ${deviceRes.quota ?? '-'})`
      });
    } else {
      setQuickTokenFeedback({
        success: true,
        message: `Token berhasil disimpan di sistem! Peringatan Fonnte: "${deviceRes.message}". Pastikan device WA sudah di-scan di fonnte.com.`
      });
    }

    setTimeout(() => {
      setQuickTokenFeedback(null);
    }, 7000);
  };

  const handlePasteQuickToken = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const clean = text.trim();
          setQuickTokenInput(clean);
          setQuickTokenFeedback({
            success: true,
            message: 'Token berhasil disalin dari clipboard! Klik "Simpan & Aktifkan" untuk mengaktifkan.'
          });
          setTimeout(() => setQuickTokenFeedback(null), 4000);
          return;
        }
      }
    } catch (e) {
      console.warn('Clipboard read failed:', e);
    }
    setQuickTokenFeedback({
      success: false,
      message: 'Gunakan tombol keyboard Ctrl+V (atau Cmd+V) di kolom input untuk menempelkan token.'
    });
    setTimeout(() => setQuickTokenFeedback(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Dev Header */}
      <div className="bg-[#001c3c] rounded-2xl p-6 text-white border-l-4 border-purple-500 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
            <Terminal className="w-4 h-4" />
            <span>Developer Console & Architecture</span>
          </div>
          <h1 className="text-2xl font-extrabold mt-1">Headless Google Apps Script Hub</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed max-w-xl">
            Kelola arsitektur headless hybrid antara Google Apps Script, Google Sheets, dan frontend React ini &middot; <strong className="text-emerald-300">Data langsung tersambung ke Google Spreadsheet</strong>
          </p>
          {(() => {
            const sess = authService.getCurrentSession();
            return sess ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs mt-2.5 font-medium">
                <Terminal className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span>Akses Penuh: <strong className="text-white">{sess.name}</strong> ({sess.email}) &middot; {sess.title}</span>
              </div>
            ) : null;
          })()}
        </div>

        <a
          href="/laporan-verifikasi.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#001c3c] font-black text-xs shadow-md transition-all group"
          title="Buka & Unduh Laporan Resmi Audit Verifikasi Sistem (Format Cetak PDF)"
        >
          <FileCheck className="w-4 h-4 text-[#001c3c] group-hover:scale-110 transition-transform" />
          <span>Unduh Laporan Verifikasi (PDF)</span>
        </a>
      </div>

      {resetMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Section 1: Tarik Data Langsung dari Google Spreadsheet Asli */}
      <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Tarik Data Langsung dari Google Spreadsheet Asli</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mengambil data asli secara instan dari seluruh tab Google Sheets (Pendaftaran, Peserta, Timeline, Jadwal, Asesmen, Kehadiran).
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Google Spreadsheet ID
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customSheetId}
              onChange={(e) => setCustomSheetId(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <button
              onClick={handlePullFromLiveSheet}
              disabled={isPulling}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-50"
            >
              <CloudDownload className={`w-4 h-4 ${isPulling ? 'animate-bounce' : ''}`} />
              <span>{isPulling ? 'Menarik Data...' : 'Tarik Data Sekarang'}</span>
            </button>
          </div>
        </div>

        {pullResult && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-start gap-3 ${
              pullResult.success
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {pullResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold">{pullResult.message}</div>
              {pullResult.counts && (
                <div className="text-[11px] opacity-90 flex flex-wrap gap-3 pt-1">
                  <span>Peserta: <strong>{pullResult.counts.peserta}</strong></span>
                  <span>Asesmen: <strong>{pullResult.counts.asesmen}</strong></span>
                  <span>Timeline: <strong>{pullResult.counts.timeline}</strong></span>
                  <span>Jadwal: <strong>{pullResult.counts.jadwal}</strong></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Endpoint Tester */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
            <Send className="w-4 h-4 text-[#004c80]" />
            <span>Koneksi Endpoint GAS (doGet & doPost)</span>
          </h2>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Google Apps Script Web App URL (/exec)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#004c80] outline-none"
            />
            <button
              onClick={handleTestEndpoint}
              disabled={isTesting}
              className="px-4 py-2 bg-[#004c80] hover:bg-[#0070b3] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTesting ? 'Menguji...' : 'Uji Koneksi (Ping)'}</span>
            </button>
            <button
              onClick={handleSaveEndpoint}
              className="px-4 py-2 bg-[#001c3c] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
            >
              Simpan URL
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 text-[#004c80] rounded"
              />
              <span className="font-semibold">Aktifkan sinkronisasi otomatis ke Google Apps Script di latar belakang</span>
            </label>
          </div>
        </div>

        {testResult && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div>{testResult.message}</div>
              {testResult.latency !== undefined && (
                <div className="text-[11px] opacity-75 mt-0.5">Latency: {testResult.latency} ms</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: WhatsApp Gateway Fonnte & Notifikasi */}
      <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Gateway (Fonnte API) & Notifikasi Otomatis</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Integrasi pengiriman pesan otomatis ke nomor pribadi peserta dan broadcast ke grup WhatsApp resmi PartnerUp.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWaBroadcastOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Grup</span>
            </button>
            <button
              type="button"
              onClick={() => setIsWaSettingsOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Pengaturan WA</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Token Fonnte</span>
            <span className={`text-xs font-black mt-0.5 flex items-center gap-1 ${waSettings.fonnteToken ? 'text-emerald-700' : 'text-amber-700'}`}>
              {waSettings.fonnteToken ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
              <span>{waSettings.fonnteToken ? 'Token Terpasang' : 'Belum Dikonfigurasi'}</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Grup Peserta</span>
            <span className="text-xs font-bold text-[#001c3c] mt-0.5 truncate block">
              {waSettings.pesertaGroupName || waSettings.pesertaGroupId || 'Belum dihubungkan'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Grup Panitia</span>
            <span className="text-xs font-bold text-[#001c3c] mt-0.5 truncate block">
              {waSettings.panitiaGroupName || waSettings.panitiaGroupId || 'Belum dihubungkan'}
            </span>
          </div>
        </div>

        {/* Fitur Tempel & Perbarui Token Fonnte Langsung */}
        <div className="p-4 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-purple-50/40 rounded-xl border border-emerald-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                <Key className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-black text-[#001c3c] uppercase tracking-wide">
                  Fitur Tempel & Perbarui Token Fonnte
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tempelkan token baru dari dashboard Fonnte kapan saja token berubah.
                </p>
              </div>
            </div>
            {waSettings.fonnteToken && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 self-start sm:self-auto">
                Tersimpan & Terhubung Cloud
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showQuickToken ? 'text' : 'password'}
                value={quickTokenInput}
                onChange={(e) => setQuickTokenInput(e.target.value)}
                placeholder="Tempel / ketik token Fonnte di sini..."
                className="w-full px-3 py-2 pr-10 text-xs font-mono rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowQuickToken(!showQuickToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showQuickToken ? 'Sembunyikan Token' : 'Tampilkan Token'}
              >
                {showQuickToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={handlePasteQuickToken}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Tempel token yang sudah disalin di clipboard"
            >
              <Clipboard className="w-3.5 h-3.5 text-slate-600" />
              <span>Tempel Clipboard</span>
            </button>

            <button
              type="button"
              disabled={isSavingQuickToken || !quickTokenInput.trim()}
              onClick={handleSaveQuickToken}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm whitespace-nowrap"
            >
              {isSavingQuickToken ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menguji Token...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan & Aktifkan</span>
                </>
              )}
            </button>
          </div>

          {quickTokenFeedback && (
            <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              quickTokenFeedback.success 
                ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-300' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {quickTokenFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{quickTokenFeedback.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Headless Code.gs Viewer & Copier */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#004c80]" />
              <span>Kode Backend Headless GAS (Code.gs)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Salin kode ini ke Google Apps Script Anda untuk mengubah web app lama menjadi REST/JSON API murni.
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001c3c] text-white hover:bg-[#004c80] text-xs font-bold transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Tersalin!' : 'Salin Code.gs'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
            {HEADLESS_GAS_CODE}
          </pre>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900">Petunjuk Deployment Headless:</strong>
          <ol className="list-decimal list-inside mt-1.5 space-y-1 text-slate-600">
            <li>Buka project Google Apps Script Anda di <code>script.google.com</code></li>
            <li>Ganti isi file <code>Code.gs</code> dengan kode di atas</li>
            <li>Klik <strong>Deploy &rarr; Manage deployments &rarr; Edit &rarr; New version &rarr; Deploy</strong></li>
            <li>Pastikan akses diatur <strong>"Who has access: Anyone"</strong></li>
            <li>Salin URL <code>/exec</code> ke input di atas. Data akan langsung tersinkron secara headless tanpa banner Google!</li>
          </ol>
        </div>
      </div>

      {/* Section 4: Data Management & Reset */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-[#001c3c] uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
          <Database className="w-4 h-4 text-[#004c80]" />
          <span>Cadangan Data & Reset</span>
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Semua Data (JSON Backup)</span>
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Data Asli Bawaan</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Modals */}
      <WhatsAppSettingsModal
        isOpen={isWaSettingsOpen}
        onClose={() => {
          setIsWaSettingsOpen(false);
          const current = whatsappService.getSettings();
          setWaSettings(current);
          setQuickTokenInput(current.fonnteToken || '');
        }}
        onSaved={() => {
          const current = whatsappService.getSettings();
          setWaSettings(current);
          setQuickTokenInput(current.fonnteToken || '');
        }}
      />

      <WhatsAppBroadcastModal
        isOpen={isWaBroadcastOpen}
        onClose={() => setIsWaBroadcastOpen(false)}
        onOpenSettings={() => {
          setIsWaBroadcastOpen(false);
          setIsWaSettingsOpen(true);
        }}
      />
    </div>
  );
};
