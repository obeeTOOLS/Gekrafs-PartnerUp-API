/**
 * Gekrafs PartnerUp - WhatsApp Service
 * Menangani integrasi Fonnte WhatsApp Gateway (Otomatis) + Fallback Manual (wa.me)
 * Mendukung pengiriman ke nomor pribadi peserta dan grup WhatsApp PartnerUp.
 */

import { gasService } from './gasService';

export interface WhatsAppSettings {
  fonnteToken: string;
  pesertaGroupId: string;
  pesertaGroupName: string;
  panitiaGroupId: string;
  panitiaGroupName: string;
  autoSendRegistration: boolean;
  autoNotifyGroupOnRegister: boolean;
  autoSendCurationStatus: boolean;
  officialSenderName: string;
}

export interface FonnteGroupItem {
  id: string;
  name: string;
}

export interface SendResult {
  success: boolean;
  message: string;
  target?: string;
  method: 'fonnte' | 'manual';
  rawResponse?: any;
}

const SETTINGS_KEY = 'gkf_whatsapp_settings_v1';
const MASTER_TOKEN_KEY = 'gkf_fonnte_token_master';
const DEDUP_LOG_KEY = 'gkf_wa_dedup_log_v1';

// Dukungan Environment Variable Vercel / Vite (Otomatis Aktif untuk Semua User)
const ENV_FONNTE_TOKEN = ((import.meta as any).env?.VITE_FONNTE_TOKEN as string) || '';
const ENV_PESERTA_GROUP = ((import.meta as any).env?.VITE_FONNTE_PESERTA_GROUP_ID as string) || '';
const ENV_PANITIA_GROUP = ((import.meta as any).env?.VITE_FONNTE_PANITIA_GROUP_ID as string) || '';

function getCookie(name: string): string {
  try {
    if (typeof document === 'undefined') return '';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  } catch {}
  return '';
}

function setCookie(name: string, val: string, days = 365) {
  try {
    if (typeof document === 'undefined') return;
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(val)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  } catch {}
}

export interface WaDedupEntry {
  key: string;
  target: string;
  type: string;
  timestamp: number;
}

export const DEFAULT_WA_SETTINGS: WhatsAppSettings = {
  fonnteToken: ENV_FONNTE_TOKEN,
  pesertaGroupId: ENV_PESERTA_GROUP,
  pesertaGroupName: '',
  panitiaGroupId: ENV_PANITIA_GROUP,
  panitiaGroupName: '',
  autoSendRegistration: true,
  autoNotifyGroupOnRegister: true,
  autoSendCurationStatus: true,
  officialSenderName: 'GEKRAFS PartnerUp Kota Batu'
};

class WhatsAppService {
  /**
   * Helper hash ringkas untuk mendeteksi isi pesan identik
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Membaca riwayat pengiriman untuk anti-duplikasi
   */
  getDedupLog(): Record<string, WaDedupEntry> {
    try {
      const stored = localStorage.getItem(DEDUP_LOG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Gagal membaca dedup log:', e);
    }
    return {};
  }

  /**
   * Cek apakah pesan dengan kunci tertentu sudah pernah terkirim dalam batas waktu cooldown (menit)
   */
  isDuplicate(key: string, cooldownMinutes: number = 30): boolean {
    const log = this.getDedupLog();
    const entry = log[key];
    if (!entry) return false;

    const elapsedMs = Date.now() - entry.timestamp;
    const cooldownMs = cooldownMinutes * 60 * 1000;
    return elapsedMs < cooldownMs;
  }

  /**
   * Mencatat pesan telah berhasil dikirim untuk mencegah duplikasi
   */
  recordSent(key: string, target: string, type: string): void {
    try {
      const log = this.getDedupLog();
      const now = Date.now();
      
      // Bersihkan entri lama lebih dari 7 hari agar hemat memori localStorage
      const cleaned: Record<string, WaDedupEntry> = {};
      const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
      for (const [k, v] of Object.entries(log)) {
        if (now - v.timestamp < maxAgeMs) {
          cleaned[k] = v;
        }
      }

      cleaned[key] = {
        key,
        target,
        type,
        timestamp: now
      };

      localStorage.setItem(DEDUP_LOG_KEY, JSON.stringify(cleaned));
    } catch (e) {
      console.warn('Gagal menyimpan catatan dedup WA:', e);
    }
  }

  /**
   * Reset / bersihkan riwayat anti-duplikasi (berguna saat admin ingin mengulang tes kirim)
   */
  clearDedupLog(): void {
    try {
      localStorage.removeItem(DEDUP_LOG_KEY);
    } catch (e) {
      console.warn('Gagal reset dedup log:', e);
    }
  }

  /**
   * Mengambil konfigurasi WhatsApp secara tahan-banting (Multi-Storage Persistence)
   * Membaca dari: LocalStorage -> Master Key Backup -> Cookie -> Cloud Settings (gasService) -> Environment Variable
   */
  getSettings(): WhatsAppSettings {
    try {
      // 1. Baca dari localStorage utama
      let parsed: Partial<WhatsAppSettings> = {};
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        try {
          parsed = JSON.parse(stored);
        } catch {}
      }

      // 2. Baca dari Master Key Backup
      const masterToken = localStorage.getItem(MASTER_TOKEN_KEY) || '';

      // 3. Baca dari Cookie Browser (Tahan pembersihan storage per-domain)
      const cookieToken = getCookie('gkf_fonnte_token');
      const cookiePesertaGroup = getCookie('gkf_wa_peserta_group');
      const cookiePanitiaGroup = getCookie('gkf_wa_panitia_group');

      // 4. Baca dari Cloud / AppSettings gasService
      let gasToken = '';
      let gasPeserta = '';
      let gasPanitia = '';
      try {
        const gasS = gasService.getSettings();
        gasToken = gasS.fonnteToken || '';
        gasPeserta = gasS.pesertaGroupId || '';
        gasPanitia = gasS.panitiaGroupId || '';
      } catch {}

      // Tentukan token terbaik yang ditemukan
      const resolvedToken = (
        parsed.fonnteToken ||
        masterToken ||
        cookieToken ||
        gasToken ||
        ENV_FONNTE_TOKEN
      ).trim();

      const resolvedPesertaGroup = (
        parsed.pesertaGroupId ||
        cookiePesertaGroup ||
        gasPeserta ||
        ENV_PESERTA_GROUP
      ).trim();

      const resolvedPanitiaGroup = (
        parsed.panitiaGroupId ||
        cookiePanitiaGroup ||
        gasPanitia ||
        ENV_PANITIA_GROUP
      ).trim();

      const result: WhatsAppSettings = {
        ...DEFAULT_WA_SETTINGS,
        ...parsed,
        fonnteToken: resolvedToken,
        pesertaGroupId: resolvedPesertaGroup,
        panitiaGroupId: resolvedPanitiaGroup
      };

      // Self-healing: jika token ditemukan dari backup tetapi belum ada di storage utama, pulihkan otomatis
      if (resolvedToken && (!stored || !parsed.fonnteToken)) {
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(result));
          localStorage.setItem(MASTER_TOKEN_KEY, resolvedToken);
          setCookie('gkf_fonnte_token', resolvedToken);
        } catch {}
      }

      return result;
    } catch (e) {
      console.error('Gagal membaca whatsapp settings:', e);
    }
    return DEFAULT_WA_SETTINGS;
  }

  /**
   * Menyimpan konfigurasi WhatsApp secara permanen ke seluruh lapisan (LocalStorage + Master Backup + Cookie + Cloud Settings)
   */
  saveSettings(settings: Partial<WhatsAppSettings>): WhatsAppSettings {
    const current = this.getSettings();
    const updated: WhatsAppSettings = {
      ...current,
      ...settings,
      fonnteToken: (settings.fonnteToken !== undefined ? settings.fonnteToken : current.fonnteToken).trim(),
      pesertaGroupId: (settings.pesertaGroupId !== undefined ? settings.pesertaGroupId : current.pesertaGroupId).trim(),
      panitiaGroupId: (settings.panitiaGroupId !== undefined ? settings.panitiaGroupId : current.panitiaGroupId).trim()
    };

    try {
      // 1. Simpan ke LocalStorage Utama
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

      // 2. Simpan ke Master Token Backup Key
      if (updated.fonnteToken) {
        localStorage.setItem(MASTER_TOKEN_KEY, updated.fonnteToken);
        setCookie('gkf_fonnte_token', updated.fonnteToken);
      }
      if (updated.pesertaGroupId) {
        setCookie('gkf_wa_peserta_group', updated.pesertaGroupId);
      }
      if (updated.panitiaGroupId) {
        setCookie('gkf_wa_panitia_group', updated.panitiaGroupId);
      }

      // 3. Simpan ke Cloud Settings (gasService) agar ikut tersinkron ke export & sheet
      try {
        gasService.saveSettings({
          fonnteToken: updated.fonnteToken,
          pesertaGroupId: updated.pesertaGroupId,
          pesertaGroupName: updated.pesertaGroupName,
          panitiaGroupId: updated.panitiaGroupId,
          panitiaGroupName: updated.panitiaGroupName
        });
      } catch (err) {
        console.warn('Gagal sinkron wa settings ke gasService:', err);
      }
    } catch (e) {
      console.error('Gagal menyimpan whatsapp settings:', e);
    }
    return updated;
  }

  /**
   * Menormalkan nomor telepon ke format internasional (misal 0812... -> 62812...)
   */
  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (cleaned.startsWith('8')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  }

  /**
   * Membuat URL wa.me untuk fallback manual 1-klik
   */
  createManualWaUrl(phone: string, text: string): string {
    const formatted = this.formatPhoneNumber(phone);
    return `https://wa.me/${formatted}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Cek koneksi device dan sisa kuota Fonnte
   */
  async checkDeviceStatus(token?: string): Promise<{
    success: boolean;
    status: string;
    device?: string;
    quota?: string | number;
    message: string;
  }> {
    const activeToken = token || this.getSettings().fonnteToken;
    if (!activeToken) {
      return {
        success: false,
        status: 'no_token',
        message: 'Token API Fonnte belum dikonfigurasi.'
      };
    }

    try {
      const response = await fetch('https://api.fonnte.com/device', {
        method: 'POST',
        headers: {
          Authorization: activeToken.trim()
        }
      });

      const data = await response.json();
      if (data.status) {
        return {
          success: true,
          status: data.device_status || 'connect',
          device: data.device || data.name || 'Device Terhubung',
          quota: data.quota ?? data.messages ?? 'Tersedia',
          message: 'Device terhubung dengan Fonnte.'
        };
      } else {
        return {
          success: false,
          status: 'error',
          message: data.reason || data.message || 'Gagal memverifikasi device Fonnte.'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        status: 'network_error',
        message: `Koneksi ke Fonnte gagal: ${err.message || 'Periksa jaringan internet.'}`
      };
    }
  }

  /**
   * Mengambil daftar grup WhatsApp yang diikuti oleh nomor Fonnte
   */
  async fetchFonnteGroups(token?: string): Promise<{
    success: boolean;
    groups: FonnteGroupItem[];
    message: string;
  }> {
    const activeToken = token || this.getSettings().fonnteToken;
    if (!activeToken) {
      return {
        success: false,
        groups: [],
        message: 'Token API Fonnte belum dikonfigurasi.'
      };
    }

    try {
      const response = await fetch('https://api.fonnte.com/get-whatsapp-group', {
        method: 'POST',
        headers: {
          Authorization: activeToken.trim()
        }
      });

      const data = await response.json();
      if (data.status && Array.isArray(data.data)) {
        const groups: FonnteGroupItem[] = data.data.map((g: any) => ({
          id: g.id,
          name: g.name || g.subject || g.id
        }));
        return {
          success: true,
          groups,
          message: `Berhasil menarik ${groups.length} grup WhatsApp.`
        };
      } else {
        return {
          success: false,
          groups: [],
          message: data.reason || data.message || 'Tidak ada grup ditemukan atau akun belum terhubung.'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        groups: [],
        message: `Gagal memuat daftar grup: ${err.message}`
      };
    }
  }

  /**
   * Mengirim pesan via Fonnte Gateway ke nomor pribadi atau ID grup
   */
  async sendViaFonnte(
    target: string,
    message: string,
    options?: {
      fileUrl?: string;
      delaySeconds?: number;
      bypassDedup?: boolean;
      cooldownSeconds?: number;
    }
  ): Promise<SendResult> {
    const settings = this.getSettings();
    if (!settings.fonnteToken) {
      return {
        success: false,
        method: 'fonnte',
        message: 'Token API Fonnte belum diatur di Dev Hub / Pengaturan.'
      };
    }

    if (!target) {
      return {
        success: false,
        method: 'fonnte',
        message: 'Target penerima (nomor HP atau ID Grup) tidak boleh kosong.'
      };
    }

    const cleanTarget = target.trim();

    // Pencegahan Anti-Double Click / Rapid Spam (default 15 detik untuk pesan persis sama ke target yang sama)
    const contentKey = `raw_${cleanTarget}_${this.hashString(message)}`;
    const cooldownSec = options?.cooldownSeconds ?? 15;
    if (!options?.bypassDedup && this.isDuplicate(contentKey, cooldownSec / 60)) {
      return {
        success: false,
        method: 'fonnte',
        target: cleanTarget,
        message: 'Pencegahan spam aktif: Pesan serupa baru saja dikirim ke target ini. Pengiriman berulang dibatalkan.'
      };
    }

    try {
      // Siapkan form data sesuai spesifikasi Fonnte
      const formData = new FormData();
      formData.append('target', cleanTarget);
      formData.append('message', message);
      formData.append('countryCode', '62');

      if (options?.fileUrl) {
        formData.append('url', options.fileUrl);
      }
      if (options?.delaySeconds) {
        formData.append('delay', String(options.delaySeconds));
      }

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: settings.fonnteToken.trim()
        },
        body: formData
      });

      const data = await response.json();

      if (data.status === true || data.status === 'true') {
        // Catat ke log anti-duplikasi
        this.recordSent(contentKey, cleanTarget, 'raw_fonnte');

        return {
          success: true,
          method: 'fonnte',
          target: cleanTarget,
          message: 'Pesan berhasil dikirim via Fonnte.',
          rawResponse: data
        };
      } else {
        return {
          success: false,
          method: 'fonnte',
          target: cleanTarget,
          message: data.reason || data.message || 'Pengiriman gagal dari server Fonnte.',
          rawResponse: data
        };
      }
    } catch (err: any) {
      return {
        success: false,
        method: 'fonnte',
        target: cleanTarget,
        message: `Gagal menghubungi server Fonnte: ${err.message}`
      };
    }
  }

  /**
   * Mengirim notifikasi konfirmasi otomatis ke Peserta baru (Anti-Duplikasi 24 Jam)
   */
  async notifyNewParticipant(participant: {
    id: string;
    nama: string;
    namaUsaha: string;
    subsektor: string;
    telepon: string;
    omzet?: string;
    alamat?: string;
  }): Promise<{ personalResult?: SendResult; groupResult?: SendResult }> {
    const settings = this.getSettings();
    const results: { personalResult?: SendResult; groupResult?: SendResult } = {};

    // 1. Kirim pesan ke nomor pribadi peserta (Anti-Duplikasi 24 jam)
    if (settings.autoSendRegistration && settings.fonnteToken && participant.telepon) {
      const formattedPhone = this.formatPhoneNumber(participant.telepon);
      const personalKey = `reg_personal_${formattedPhone}`;

      if (this.isDuplicate(personalKey, 24 * 60)) {
        results.personalResult = {
          success: true,
          method: 'fonnte',
          target: participant.telepon,
          message: 'Pemberitahuan pendaftaran sudah pernah terkirim ke nomor ini (anti-duplikasi aktif).'
        };
      } else {
        const personalMsg = this.buildRegistrationMessage(participant);
        const res = await this.sendViaFonnte(participant.telepon, personalMsg, { bypassDedup: true });
        results.personalResult = res;
        if (res.success) {
          this.recordSent(personalKey, participant.telepon, 'registration_personal');
        }
      }
    }

    // 2. Kirim notifikasi ringkas ke grup panitia (Anti-Duplikasi 24 jam per usaha)
    if (settings.autoNotifyGroupOnRegister && settings.fonnteToken && settings.panitiaGroupId) {
      const groupKey = `reg_group_${participant.namaUsaha.toLowerCase().trim()}_${this.formatPhoneNumber(participant.telepon)}`;

      if (this.isDuplicate(groupKey, 24 * 60)) {
        results.groupResult = {
          success: true,
          method: 'fonnte',
          target: settings.panitiaGroupId,
          message: 'Pemberitahuan pendaftar ini sudah pernah dikirim ke grup panitia (anti-duplikasi aktif).'
        };
      } else {
        const groupMsg = this.buildNewParticipantGroupNotification(participant);
        const res = await this.sendViaFonnte(settings.panitiaGroupId, groupMsg, { bypassDedup: true });
        results.groupResult = res;
        if (res.success) {
          this.recordSent(groupKey, settings.panitiaGroupId, 'registration_group');
        }
      }
    }

    return results;
  }

  /**
   * Mengirim notifikasi status kurasi (Lolos / Cadangan / Ditolak) dengan Anti-Double Send
   */
  async sendCurationStatusNotification(
    participant: {
      nama: string;
      namaUsaha: string;
      telepon: string;
      status: string;
      catatan?: string;
    },
    mode: 'auto' | 'manual' = 'auto',
    forceResend: boolean = false
  ): Promise<SendResult> {
    const message = this.buildCurationStatusMessage(participant);
    const cleanPhone = this.formatPhoneNumber(participant.telepon);
    const curationKey = `curation_${cleanPhone}_${participant.status.replace(/\s+/g, '_')}`;

    if (mode === 'manual' || !this.getSettings().fonnteToken) {
      const url = this.createManualWaUrl(participant.telepon, message);
      window.open(url, '_blank');
      return {
        success: true,
        method: 'manual',
        target: participant.telepon,
        message: 'Tautan WhatsApp Web berhasil dibuka.'
      };
    }

    // Cek anti-duplikasi 10 menit (mencegah kurator klik dobel)
    if (!forceResend && this.isDuplicate(curationKey, 10)) {
      return {
        success: false,
        method: 'fonnte',
        target: participant.telepon,
        message: `Pemberitahuan status "${participant.status}" baru saja dikirim ke ${participant.nama}. Pengiriman dobel otomatis dicegah.`
      };
    }

    const res = await this.sendViaFonnte(participant.telepon, message, { bypassDedup: true });
    if (res.success) {
      this.recordSent(curationKey, participant.telepon, 'curation_status');
    }
    return res;
  }

  /**
   * Mengirim pengumuman bebas ke Grup WhatsApp (Peserta, Panitia, atau Keduanya)
   */
  async broadcastToGroups(
    announcement: string,
    targetType: 'peserta' | 'panitia' | 'both' | 'custom',
    customTarget?: string
  ): Promise<{ results: SendResult[]; summaryMessage: string }> {
    const settings = this.getSettings();
    const results: SendResult[] = [];
    const formattedMsg = this.buildBroadcastMessage(announcement);

    const targets: { id: string; label: string }[] = [];

    if (targetType === 'peserta' || targetType === 'both') {
      if (settings.pesertaGroupId) {
        targets.push({ id: settings.pesertaGroupId, label: `Grup Peserta (${settings.pesertaGroupName || 'Peserta'})` });
      }
    }

    if (targetType === 'panitia' || targetType === 'both') {
      if (settings.panitiaGroupId) {
        targets.push({ id: settings.panitiaGroupId, label: `Grup Panitia (${settings.panitiaGroupName || 'Panitia'})` });
      }
    }

    if (targetType === 'custom' && customTarget) {
      targets.push({ id: customTarget, label: `Target Khusus (${customTarget})` });
    }

    if (targets.length === 0) {
      return {
        results: [],
        summaryMessage: 'Tidak ada ID grup yang ditentukan. Silakan pilih atau atur ID grup di Pengaturan.'
      };
    }

    for (const t of targets) {
      const res = await this.sendViaFonnte(t.id, formattedMsg);
      results.push(res);
    }

    const successCount = results.filter((r) => r.success).length;
    return {
      results,
      summaryMessage: `Terkirim ke ${successCount} dari ${targets.length} target grup.`
    };
  }

  // --- TEMPLATES ---

  buildRegistrationMessage(p: {
    id: string;
    nama: string;
    namaUsaha: string;
    subsektor: string;
  }): string {
    return (
      `Halo *${p.nama}*! 👋\n\n` +
      `Terima kasih telah mendaftar di program akselerasi *GEKRAFS PartnerUp Kota Batu 2026* ✨\n\n` +
      `Berikut rincian pendaftaran Anda:\n` +
      `🆔 *ID Pendaftaran:* ${p.id}\n` +
      `🏢 *Nama Usaha:* ${p.namaUsaha}\n` +
      `🎨 *Subsektor:* ${p.subsektor}\n` +
      `📅 *Tanggal:* ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n\n` +
      `Tim kurator GEKRAFS Kota Batu saat ini sedang memverifikasi data dan profil usaha Anda. Informasi kelolosan kurasi serta jadwal pembinaan akan diumumkan secara berkala melalui nomor WhatsApp ini.\n\n` +
      `Terima kasih atas dedikasi dan semangat kreatif Anda untuk Kota Batu! 🚀\n\n` +
      `_Salam Ekonomi Kreatif,_\n` +
      `*Panitia GEKRAFS PartnerUp Kota Batu*`
    );
  }

  buildNewParticipantGroupNotification(p: {
    id: string;
    nama: string;
    namaUsaha: string;
    subsektor: string;
    omzet?: string;
    alamat?: string;
  }): string {
    return (
      `📢 *NOTIFIKASI PENDAFTAR BARU*\n` +
      `*GEKRAFS PartnerUp Kota Batu 2026*\n\n` +
      `Telah masuk pendaftaran peserta UMKM baru:\n` +
      `👤 *Pelaku Usaha:* ${p.nama}\n` +
      `🏢 *Brand / Usaha:* *${p.namaUsaha}*\n` +
      `🎨 *Subsektor:* ${p.subsektor}\n` +
      (p.omzet ? `💰 *Skala Omzet:* ${p.omzet}\n` : '') +
      (p.alamat ? `📍 *Wilayah:* ${p.alamat}\n` : '') +
      `🆔 *ID Pendaftaran:* \`${p.id}\`\n\n` +
      `Silakan cek dan verifikasi berkas selengkapnya melalui *Dashboard Kurator*:\n` +
      `https://ais-dev-ijwjef33hzkvilef4tuyto-118536196094.asia-east1.run.app/?page=admin\n\n` +
      `_Sistem Otomatisasi GEKRAFS Kota Batu_`
    );
  }

  buildCurationStatusMessage(p: {
    nama: string;
    namaUsaha: string;
    status: string;
    catatan?: string;
  }): string {
    const isLolos = p.status.toLowerCase().includes('lolos');
    const isCadangan = p.status.toLowerCase().includes('cadangan');

    let headerStatus = `*${p.status.toUpperCase()}*`;
    let detailPesan = '';

    if (isLolos) {
      detailPesan =
        `Selamat! Profil usaha Anda dinilai memiliki potensi akselerasi yang sangat baik untuk mengikuti rangkaian pendampingan intensif GEKRAFS PartnerUp Kota Batu 2026.\n\n` +
        `Harap pantau jadwal kelas di aplikasi dan bersiap untuk menghadiri sesi perdana.`;
    } else if (isCadangan) {
      detailPesan =
        `Profil usaha Anda berada pada kuota cadangan prioritas. Tim kurator akan menghubungi Anda kembali jika terdapat slot pendaftaran yang dibuka untuk subsektor Anda.`;
    } else {
      detailPesan =
        `Terima kasih atas partisipasi Anda dalam kurasi GEKRAFS PartnerUp 2026. Tetap semangat mengembangkan produk kreatif Anda, dan Anda tetap dapat mengikuti program publik GEKRAFS lainnya.`;
    }

    return (
      `Halo *${p.nama}* (${p.namaUsaha}) 👋\n\n` +
      `Kami menyampaikan hasil kurasi resmi untuk program *GEKRAFS PartnerUp Kota Batu 2026*:\n\n` +
      `📊 *Status Kurasi:* ${headerStatus}\n` +
      (p.catatan ? `📝 *Catatan Kurator:* ${p.catatan}\n\n` : '\n') +
      `${detailPesan}\n\n` +
      `_Salam Ekonomi Kreatif,_\n` +
      `*Tim Kurasi GEKRAFS Kota Batu*`
    );
  }

  buildBroadcastMessage(announcement: string): string {
    return (
      `📢 *PENGUMUMAN RESMI GEKRAFS PARTNERUP*\n` +
      `*Kota Batu - Tahun 2026*\n\n` +
      `${announcement.trim()}\n\n` +
      `---\n` +
      `_Disampaikan oleh Panitia Pelaksana GEKRAFS PartnerUp Kota Batu_`
    );
  }
}

export const whatsappService = new WhatsAppService();
