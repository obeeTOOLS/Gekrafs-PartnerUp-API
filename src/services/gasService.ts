/**
 * Gekrafs PartnerUp - Headless GAS Data & Sync Service
 * Menghubungkan SPA React dengan Google Apps Script secara Headless REST/JSON,
 * dilengkapi Local Caching, Optimistic UI Updates (< 0.01 detik),
 * dan Fitur Tarik Data Langsung dari Google Spreadsheet Asli.
 */

import {
  PendaftaranFormData,
  PesertaItem,
  TimelineItem,
  JadwalItem,
  KehadiranItem,
  AsesmenItem,
  DashboardStats,
  PetaKolaborasiCategory,
  KelompokItem,
  AppSettings
} from '../types';

import {
  INITIAL_TIMELINE,
  INITIAL_JADWAL,
  INITIAL_PESERTA,
  INITIAL_ASESMEN,
  INITIAL_KEHADIRAN,
  INITIAL_SETTINGS,
  ASESMEN_KRITERIA,
  BAGIAN_3_KATEGORI
} from '../data/initialData';

import { fetchSheetCsv } from '../utils/csvParser';
import { taskService } from './taskService';

const DEFAULT_SPREADSHEET_ID = '183uoyYw6opnr3w7T6oljvwuy5Rzs7GZE7fM3vi_pwm4';

const STORAGE_KEYS = {
  TIMELINE: 'gkf_timeline_v2',
  JADWAL: 'gkf_jadwal_v2',
  PESERTA: 'gkf_peserta_v2',
  ASESMEN: 'gkf_asesmen_v2',
  KEHADIRAN: 'gkf_kehadiran_v2',
  SETTINGS: 'gkf_settings_v2',
  LAST_SYNC: 'gkf_last_sync_v2'
};

class GasService {
  private timeline: TimelineItem[] = [];
  private jadwal: JadwalItem[] = [];
  private peserta: PesertaItem[] = [];
  private asesmen: AsesmenItem[] = [];
  private kehadiran: KehadiranItem[] = [];
  private settings: AppSettings = INITIAL_SETTINGS;
  private syncStatus: 'online' | 'offline' | 'syncing' | 'error' = 'online';
  private syncMessage: string = 'Lokal Sinkron';
  private lastSyncTime: string = '';
  private isSyncingSpreadsheet: boolean = false;
  private lastLiveSyncTimestamp: number = 0;

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    try {
      const storedTimeline = localStorage.getItem(STORAGE_KEYS.TIMELINE);
      this.timeline = storedTimeline ? JSON.parse(storedTimeline) : INITIAL_TIMELINE;

      const storedJadwal = localStorage.getItem(STORAGE_KEYS.JADWAL);
      this.jadwal = storedJadwal ? JSON.parse(storedJadwal) : INITIAL_JADWAL;

      const storedPeserta = localStorage.getItem(STORAGE_KEYS.PESERTA);
      this.peserta = storedPeserta ? JSON.parse(storedPeserta) : INITIAL_PESERTA;

      const storedAsesmen = localStorage.getItem(STORAGE_KEYS.ASESMEN);
      this.asesmen = storedAsesmen ? JSON.parse(storedAsesmen) : INITIAL_ASESMEN;

      const storedKehadiran = localStorage.getItem(STORAGE_KEYS.KEHADIRAN);
      this.kehadiran = storedKehadiran ? JSON.parse(storedKehadiran) : INITIAL_KEHADIRAN;

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = storedSettings ? JSON.parse(storedSettings) : INITIAL_SETTINGS;

      // OTOMATIS MIGRASI: Jika localStorage masih menyimpan URL deployment lama, perbarui seketika ke URL aktif baru
      const OLD_DEPLOYMENT_ID = 'AKfycbwwaVC7GNTlNC5qFSj0VZDD89fB36rNdUokLwnr_nfYsP9yzVyfYhSKnYQtEIWDcqar';
      if (!this.settings.gasEndpointUrl || this.settings.gasEndpointUrl.includes(OLD_DEPLOYMENT_ID)) {
        this.settings.gasEndpointUrl = INITIAL_SETTINGS.gasEndpointUrl;
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      }

      this.lastSyncTime = localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || '';
    } catch {
      this.timeline = INITIAL_TIMELINE;
      this.jadwal = INITIAL_JADWAL;
      this.peserta = INITIAL_PESERTA;
      this.asesmen = INITIAL_ASESMEN;
      this.kehadiran = INITIAL_KEHADIRAN;
      this.settings = INITIAL_SETTINGS;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(this.timeline));
      localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(this.jadwal));
      localStorage.setItem(STORAGE_KEYS.PESERTA, JSON.stringify(this.peserta));
      localStorage.setItem(STORAGE_KEYS.ASESMEN, JSON.stringify(this.asesmen));
      localStorage.setItem(STORAGE_KEYS.KEHADIRAN, JSON.stringify(this.kehadiran));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      if (this.lastSyncTime) {
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, this.lastSyncTime);
      }
    } catch (e) {
      console.warn('Storage quota error:', e);
    }
  }

  public getSyncState() {
    return {
      status: this.syncStatus,
      message: this.syncMessage,
      endpoint: this.settings.gasEndpointUrl,
      lastSyncTime: this.lastSyncTime
    };
  }

  public resetToDefaultData() {
    this.timeline = [...INITIAL_TIMELINE];
    this.jadwal = [...INITIAL_JADWAL];
    this.peserta = [...INITIAL_PESERTA];
    this.asesmen = [...INITIAL_ASESMEN];
    this.kehadiran = [...INITIAL_KEHADIRAN];
    this.settings = { ...INITIAL_SETTINGS };
    this.lastSyncTime = '';
    this.saveToStorage();
    return { status: 'success', message: 'Data telah di-reset ke data bawaan sistem.' };
  }

  /**
   * Tarik data langsung secara lengkap dan real-time dari Google Spreadsheet asli
   * (Spreadsheet ID: 183uoyYw6opnr3w7T6oljvwuy5Rzs7GZE7fM3vi_pwm4).
   * Mendukung silent mode untuk Auto Background-Refresh tanpa merusak indikator UI manual.
   */
  public async syncFromLiveSpreadsheet(customSheetId?: string, silent: boolean = false): Promise<{
    success: boolean;
    message: string;
    counts?: { peserta: number; asesmen: number; timeline: number; jadwal: number };
  }> {
    if (this.isSyncingSpreadsheet) {
      return {
        success: false,
        message: 'Sinkronisasi sedang berjalan di latar belakang.'
      };
    }

    const spreadsheetId = customSheetId || DEFAULT_SPREADSHEET_ID;
    this.isSyncingSpreadsheet = true;
    if (!silent) {
      this.syncStatus = 'syncing';
      this.syncMessage = 'Menarik data dari Google Sheets...';
    }

    try {
      // 1. Ambil data Pendaftaran (profil lengkap)
      const pendaftaranRaw = await fetchSheetCsv(spreadsheetId, 'Pendaftaran');
      const pendaftaranRows = pendaftaranRaw.slice(1);
      const profileMap: Record<string, any> = {};

      pendaftaranRows.forEach((r) => {
        if (!r[1]) return;
        const key = r[1].trim().toLowerCase();
        profileMap[key] = {
          namaUsaha: r[1],
          namaPemilik: r[2],
          subsektor: r[3],
          tahunBerdiri: r[4],
          nib: r[5],
          alamatUsaha: r[6],
          kotaKabupaten: r[7],
          omzet: r[8],
          whatsapp: r[9],
          email: r[10],
          instagram: r[11],
          tiktok: r[12],
          marketplace: r[13],
          ktpUrl: r[14],
          nibUrl: r[15],
          deskripsi: r[16],
          sesi: r[25] || 'Sesi 2'
        };
      });

      // 2. Ambil data Peserta
      const pesertaRaw = await fetchSheetCsv(spreadsheetId, 'Peserta');
      const pesertaRows = pesertaRaw.slice(1);
      const newPesertaList: PesertaItem[] = [];

      pesertaRows.forEach((r, i) => {
        if (!r[1]) return;
        const key = r[1].trim().toLowerCase();
        const prof = profileMap[key] || {};
        newPesertaList.push({
          row: i + 2,
          timestamp: r[0] || '',
          namaUsaha: r[1],
          namaPemilik: r[2] || prof.namaPemilik || '-',
          subsektor: r[3] || prof.subsektor || 'Lainnya',
          whatsapp: r[4] || prof.whatsapp || '-',
          email: r[5] || prof.email || '-',
          statusKurasi: (r[6] as any) || 'Belum Direview',
          catatanKurator: r[7] || '',
          sesi: r[8] || prof.sesi || 'Sesi 2',
          nib: prof.nib || '-',
          alamatUsaha: prof.alamatUsaha || '-',
          kotaKabupaten: prof.kotaKabupaten || 'Kota Batu',
          omzet: prof.omzet || '-',
          instagram: prof.instagram || '',
          tiktok: prof.tiktok || '',
          marketplace: prof.marketplace || '',
          deskripsi: prof.deskripsi || ''
        });
      });

      // 3. Ambil data Timeline
      const timelineRaw = await fetchSheetCsv(spreadsheetId, 'Timeline');
      const timelineRows = timelineRaw.slice(1);
      const newTimelineList: TimelineItem[] = timelineRows
        .filter((r) => r[1])
        .map((r, i) => ({
          row: i + 2,
          urutan: Number(r[0]) || i + 1,
          tahapan: r[1],
          tanggalMulai: r[2] || '',
          tanggalSelesai: r[3] || '',
          keterangan: r[4] || ''
        }));

      // 4. Ambil data Jadwal Pelatihan
      const jadwalRaw = await fetchSheetCsv(spreadsheetId, 'Jadwal Pelatihan');
      const jadwalRows = jadwalRaw.slice(1);
      const newJadwalList: JadwalItem[] = jadwalRows
        .filter((r) => r[2])
        .map((r, i) => ({
          row: i + 2,
          tanggal: r[0] || '',
          waktu: r[1] || '',
          topik: r[2],
          pemateri: r[3] || '-',
          lokasi: r[4] || 'Kota Batu',
          catatan: r[5] || '',
          linkMateri: r[7] || '',
          idSesi: r[8] || `sesi-${i + 1}`
        }));

      // 5. Ambil data Asesmen
      const asesmenRaw = await fetchSheetCsv(spreadsheetId, 'Asesmen');
      const asesmenRows = asesmenRaw.slice(1);
      const newAsesmenList: AsesmenItem[] = [];

      asesmenRows.forEach((r, idx) => {
        if (!r[1]) return;
        const rincian = [];
        let maxSkor = -1;
        let minSkor = 99;
        let kekuatan = '';
        let kelemahan = '';

        for (let i = 0; i < 15; i++) {
          const skor = Number(r[3 + i * 2]) || 0;
          const cat = r[4 + i * 2] || '';
          rincian.push({
            kriteria: ASESMEN_KRITERIA[i],
            skor: skor,
            catatan: cat
          });
          if (skor > maxSkor) {
            maxSkor = skor;
            kekuatan = ASESMEN_KRITERIA[i];
          }
          if (skor < minSkor) {
            minSkor = skor;
            kelemahan = ASESMEN_KRITERIA[i];
          }
        }

        const totalSkor = Number(r[33]) || rincian.reduce((acc, x) => acc + x.skor, 0);
        const poinBisa = r[34] || '';
        const poinPerlu = r[35] || '';

        const bagian3 = [];
        for (let i = 0; i < 8; i++) {
          const valStr = String(r[36 + i] || '0').replace(',', '.');
          bagian3.push({
            kategori: BAGIAN_3_KATEGORI[i],
            skorRataRata: Number(valStr) || 0
          });
        }

        let b3Detail = [];
        try {
          if (r[44]) b3Detail = JSON.parse(r[44]);
        } catch {
          b3Detail = [];
        }

        const materiBisa = r[45] || '';
        const sesi = r[46] || 'Sesi 2';

        newAsesmenList.push({
          row: idx + 2,
          timestamp: r[0],
          namaUsaha: r[1],
          whatsapp: r[2],
          totalSkor,
          poinBisaAjarkan: poinBisa || '-',
          materiBisaAjarkan: materiBisa || '-',
          poinPerluDipelajari: poinPerlu || '-',
          sesi,
          kekuatan: kekuatan || poinBisa,
          kekuatanSkor: maxSkor,
          kelemahan: kelemahan || poinPerlu,
          kelemahanSkor: minSkor,
          rincian,
          bagian3,
          bagian3Detail: b3Detail
        });
      });

      // Update state aplikasi jika data berhasil ditarik
      if (newPesertaList.length > 0) this.peserta = newPesertaList;
      if (newAsesmenList.length > 0) this.asesmen = newAsesmenList;
      if (newTimelineList.length > 0) this.timeline = newTimelineList;
      if (newJadwalList.length > 0) this.jadwal = newJadwalList;

      // 6. Ambil data Tugas Peserta (hanya jika tab 'Tugas' benar-benar ada di spreadsheet dan bukan fallback)
      try {
        const tugasRaw = await fetchSheetCsv(spreadsheetId, 'Tugas');
        if (tugasRaw && tugasRaw.length > 1) {
          const headerText = tugasRaw[0].join(' ').toLowerCase();
          const isTugas = (headerText.includes('id tugas') || headerText.includes('status tugas')) && !headerText.includes('kriteria');
          if (isTugas) {
            taskService.syncFromSpreadsheetRows(tugasRaw);
          } else {
            console.warn('[GAS] Sheet Tugas belum ada di spreadsheet (Google fallback ke sheet lain). Diabaikan.');
          }
        }
      } catch (tugasErr) {
        // Tab 'Tugas' belum dibuat di spreadsheet atau belum ada baris, abaikan secara graceful
      }

      const now = new Date();
      this.lastSyncTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
      this.lastLiveSyncTimestamp = Date.now();
      this.syncStatus = 'online';
      this.syncMessage = `Sinkron (${this.lastSyncTime})`;
      this.saveToStorage();

      // Dispatch event agar seluruh tampilan (Timeline, Jadwal, Peserta, dll) langsung diperbarui otomatis
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gkf-data-updated', {
          detail: {
            counts: {
              peserta: this.peserta.length,
              asesmen: this.asesmen.length,
              timeline: this.timeline.length,
              jadwal: this.jadwal.length
            },
            timestamp: this.lastLiveSyncTimestamp,
            silent
          }
        }));
      }

      return {
        success: true,
        message: `Berhasil menarik ${this.peserta.length} Peserta, ${this.asesmen.length} Asesmen, ${this.timeline.length} Timeline, dan ${this.jadwal.length} Jadwal dari Google Sheets asli.`,
        counts: {
          peserta: this.peserta.length,
          asesmen: this.asesmen.length,
          timeline: this.timeline.length,
          jadwal: this.jadwal.length
        }
      };
    } catch (err: any) {
      if (!silent) {
        this.syncStatus = 'error';
        this.syncMessage = 'Gagal sinkron spreadsheet';
      }
      return {
        success: false,
        message: `Gagal menarik data dari Google Sheets: ${err.message || 'Periksa koneksi internet Anda.'}`
      };
    } finally {
      this.isSyncingSpreadsheet = false;
    }
  }

  /**
   * Auto Background-Refresh data dari Google Spreadsheet secara silent dan aman.
   * Dilengkapi throttling jeda waktu (minIntervalMs) agar efisien dan tidak membebani kuota API.
   */
  public async triggerBackgroundRefresh(force: boolean = false, minIntervalMs: number = 30000): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false;
    }
    const now = Date.now();
    if (!force && this.lastLiveSyncTimestamp && (now - this.lastLiveSyncTimestamp < minIntervalMs)) {
      return false;
    }
    if (this.isSyncingSpreadsheet) {
      return false;
    }

    try {
      const res = await this.syncFromLiveSpreadsheet(undefined, true);
      return res.success;
    } catch {
      return false;
    }
  }

  // --- Remote Call Helper (Non-blocking background sync) ---
  public async dispatchRemoteAction(action: string, payload: any = {}): Promise<any> {
    if (!this.settings.autoSync || !this.settings.gasEndpointUrl) {
      console.warn('[GAS Sync] Sinkronisasi otomatis mati atau URL endpoint belum diisi.', {
        autoSync: this.settings.autoSync,
        gasEndpointUrl: this.settings.gasEndpointUrl
      });
      return null;
    }

    try {
      console.log(`[GAS Sync] Mengirim aksi '${action}' ke:`, this.settings.gasEndpointUrl, payload);
      const controller = new AbortController();
      // Memberikan waktu hingga 25 detik untuk cold-start Apps Script & eksekusi spreadsheet lock
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(this.settings.gasEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({ action, ...payload }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        console.log(`[GAS Sync] Respon sukses untuk aksi '${action}':`, json);
        this.syncStatus = 'online';
        this.syncMessage = 'Sinkron ke GAS Berhasil';
        return json;
      } else {
        console.error(`[GAS Sync] Server merespon dengan status ${response.status}`);
      }
    } catch (err: any) {
      console.error(`[GAS Sync] Gagal mengirim aksi '${action}':`, err);
      this.syncStatus = 'offline';
      this.syncMessage = 'Mode Cache Lokal (Offline)';
    }
    return null;
  }

  public async testConnection(url?: string): Promise<{ success: boolean; message: string; latency?: number }> {
    const targetUrl = url || this.settings.gasEndpointUrl;
    const start = performance.now();
    try {
      const response = await fetch(`${targetUrl}?action=ping`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });
      const end = performance.now();
      const latency = Math.round(end - start);

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: `Berhasil terhubung ke Google Apps Script! (${data.message || 'Online'})`,
          latency
        };
      }
      return {
        success: false,
        message: `HTTP Status ${response.status}: Periksa deployment Web App Anda.`
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal menjangkau URL: ${err.message || 'Periksa koneksi atau CORS'}. Pastikan akses diatur 'Anyone'.`
      };
    }
  }

  // --- Timeline Methods ---
  public getTimeline(): TimelineItem[] {
    return [...this.timeline].sort((a, b) => Number(a.urutan) - Number(b.urutan));
  }

  public async saveTimelineItem(item: Partial<TimelineItem>): Promise<{ status: string; message: string; remoteResult?: any }> {
    let savedItem: TimelineItem;
    if (item.row) {
      const index = this.timeline.findIndex((t) => t.row === item.row);
      if (index !== -1) {
        this.timeline[index] = { ...this.timeline[index], ...item } as TimelineItem;
        savedItem = this.timeline[index];
      } else {
        savedItem = item as TimelineItem;
      }
    } else {
      const newRow = this.timeline.length ? Math.max(...this.timeline.map((t) => t.row || 0)) + 1 : 2;
      savedItem = {
        row: newRow,
        urutan: item.urutan || this.timeline.length + 1,
        tahapan: item.tahapan || 'Tahapan Baru',
        tanggalMulai: item.tanggalMulai || '',
        tanggalSelesai: item.tanggalSelesai || '',
        keterangan: item.keterangan || ''
      };
      this.timeline.push(savedItem);
    }
    this.saveToStorage();

    const remoteRes = await this.dispatchRemoteAction('saveTimelineItem', { item: savedItem });
    if (remoteRes && remoteRes.status === 'success') {
      return {
        status: 'success',
        message: `Tahapan timeline berhasil disimpan & disinkronkan ke Google Sheet! (${remoteRes.message || 'OK'})`,
        remoteResult: remoteRes
      };
    } else if (remoteRes && remoteRes.status === 'error') {
      return {
        status: 'error',
        message: `Tersimpan di lokal, tapi Google Sheet merespon error: ${remoteRes.message}`,
        remoteResult: remoteRes
      };
    } else {
      return {
        status: 'warning',
        message: `Tersimpan di cache lokal. Belum ada konfirmasi dari Google Apps Script (Periksa URL & koneksi).`,
        remoteResult: null
      };
    }
  }

  public async deleteTimelineItem(row: number): Promise<{ status: string; message: string }> {
    this.timeline = this.timeline.filter((t) => t.row !== row);
    this.saveToStorage();
    await this.dispatchRemoteAction('deleteTimelineItem', { row });
    return { status: 'success', message: 'Tahapan timeline dihapus.' };
  }

  // --- Jadwal Pelatihan Methods ---
  public getJadwal(): JadwalItem[] {
    return [...this.jadwal].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  }

  public saveJadwalItem(item: Partial<JadwalItem>): { status: string; message: string } {
    if (item.row) {
      const index = this.jadwal.findIndex((j) => j.row === item.row);
      if (index !== -1) {
        this.jadwal[index] = { ...this.jadwal[index], ...item } as JadwalItem;
      }
    } else {
      const newRow = this.jadwal.length ? Math.max(...this.jadwal.map((j) => j.row || 0)) + 1 : 2;
      const newId = `sesi-${String(Math.random()).slice(2, 8)}`;
      this.jadwal.push({
        row: newRow,
        idSesi: item.idSesi || newId,
        tanggal: item.tanggal || '',
        waktu: item.waktu || '09.00 - 12.00 WIB',
        topik: item.topik || 'Sesi Pelatihan Baru',
        pemateri: item.pemateri || '-',
        lokasi: item.lokasi || 'Kota Batu',
        catatan: item.catatan || '',
        linkMateri: item.linkMateri || '',
        notifikasiTerkirim: ''
      });
    }
    this.saveToStorage();
    this.dispatchRemoteAction('saveJadwalItem', { item });
    return { status: 'success', message: 'Jadwal sesi pelatihan berhasil disimpan!' };
  }

  public deleteJadwalItem(row: number): { status: string; message: string } {
    this.jadwal = this.jadwal.filter((j) => j.row !== row);
    this.saveToStorage();
    this.dispatchRemoteAction('deleteJadwalItem', { row });
    return { status: 'success', message: 'Jadwal pelatihan dihapus.' };
  }

  // --- Peserta Methods ---
  public getPeserta(filterSesi?: string): PesertaItem[] {
    let list = [...this.peserta];
    if (filterSesi) {
      list = list.filter((p) => p.sesi.toLowerCase().trim() === filterSesi.toLowerCase().trim());
    }
    return list.reverse();
  }

  public getRegisteredBusinessNames(): string[] {
    const sesiAktif = this.settings.sesiAktif.toLowerCase().trim();
    const names = this.peserta
      .filter((p) => !sesiAktif || p.sesi.toLowerCase().trim() === sesiAktif)
      .map((p) => p.namaUsaha.trim());
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }

  public getPesertaProfile(namaUsaha: string, whatsapp: string): PesertaItem | null {
    const cleanNama = namaUsaha.toLowerCase().trim();
    const cleanWa = whatsapp.replace(/[\s\-()]/g, '').replace(/^\+?62/, '').replace(/^0/, '');
    const found = this.peserta.find((p) => {
      const pWa = p.whatsapp.replace(/[\s\-()]/g, '').replace(/^\+?62/, '').replace(/^0/, '');
      return p.namaUsaha.toLowerCase().trim() === cleanNama && pWa === cleanWa;
    });
    return found || null;
  }

  public verifyPesertaOwnership(namaUsaha: string, credential: string): { verified: boolean; message: string; peserta?: PesertaItem } {
    const cleanNama = namaUsaha.toLowerCase().trim();
    const cleanCred = credential.toLowerCase().trim();
    const cleanWaInput = credential.replace(/[\s\-()]/g, '').replace(/^\+?62/, '').replace(/^0/, '');

    const found = this.peserta.find((p) => {
      if (p.namaUsaha.toLowerCase().trim() !== cleanNama) return false;
      
      const pWa = (p.whatsapp || '').replace(/[\s\-()]/g, '').replace(/^\+?62/, '').replace(/^0/, '');
      const pEmail = (p.email || '').toLowerCase().trim();
      const pNib = (p.nib || '').toLowerCase().trim();

      // Cocokkan dengan WhatsApp terdaftar atau Email terdaftar
      return (
        (cleanWaInput.length >= 7 && pWa === cleanWaInput) ||
        (cleanCred.includes('@') && pEmail === cleanCred) ||
        (cleanCred && pNib && pNib.length >= 5 && pNib === cleanCred)
      );
    });

    if (found) {
      return { verified: true, message: 'Verifikasi kepemilikan berhasil!', peserta: found };
    }
    return { 
      verified: false, 
      message: 'Verifikasi gagal: Nomor WhatsApp atau Email tidak sesuai dengan data pendaftar brand ini.' 
    };
  }

  public updateStatusKurasi(row: number, status: string, catatan: string): { status: string; message: string } {
    const index = this.peserta.findIndex((p) => p.row === row);
    if (index !== -1) {
      this.peserta[index].statusKurasi = status as any;
      this.peserta[index].catatanKurator = catatan;
      this.saveToStorage();
      this.dispatchRemoteAction('updateStatusKurasi', { row, status, catatan });
      return { status: 'success', message: 'Status kurasi berhasil diperbarui!' };
    }
    return { status: 'error', message: 'Peserta tidak ditemukan.' };
  }

  public updatePeserta(row: number, updatedFields: Partial<PesertaItem>): { status: string; message: string } {
    const index = this.peserta.findIndex((p) => p.row === row);
    if (index !== -1) {
      this.peserta[index] = {
        ...this.peserta[index],
        ...updatedFields
      };
      this.saveToStorage();
      this.dispatchRemoteAction('updatePeserta', { row, updatedFields });
      return { status: 'success', message: 'Informasi dan foto produk UMKM berhasil diperbarui!' };
    }
    return { status: 'error', message: 'Data peserta tidak ditemukan.' };
  }

  public submitForm(formData: PendaftaranFormData): { status: string; message: string } {
    const cleanEmail = formData.email.toLowerCase().trim();
    const cleanSesi = (formData.sesiPartnerUp || this.settings.sesiAktif).toLowerCase().trim();
    const exists = this.peserta.some(
      (p) => p.email.toLowerCase().trim() === cleanEmail && p.sesi.toLowerCase().trim() === cleanSesi
    );

    if (exists) {
      return {
        status: 'error',
        message: 'Email ini sudah pernah digunakan mendaftar pada sesi ini. Setiap usaha hanya boleh mendaftar sekali.'
      };
    }

    const now = new Date();
    const dateFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newRow = this.peserta.length ? Math.max(...this.peserta.map((p) => p.row || 0)) + 1 : 2;

    const newPeserta: PesertaItem = {
      row: newRow,
      timestamp: dateFormatted,
      namaUsaha: formData.namaUsaha,
      namaPemilik: formData.namaPemilik,
      subsektor: formData.subsektor,
      whatsapp: formData.whatsapp,
      email: formData.email,
      statusKurasi: 'Belum Direview',
      catatanKurator: '',
      sesi: formData.sesiPartnerUp || this.settings.sesiAktif,
      nib: formData.nib || '-',
      alamatUsaha: formData.alamatUsaha,
      kotaKabupaten: formData.kotaKabupaten,
      omzet: formData.omzet,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      marketplace: formData.marketplace,
      deskripsi: formData.deskripsi,
      ktpUrl: formData.ktpFile ? `blob:local-${Date.now()}` : undefined,
      nibUrl: formData.nibFile ? `blob:local-${Date.now()}` : undefined
    };

    this.peserta.push(newPeserta);
    this.saveToStorage();
    this.dispatchRemoteAction('submitForm', { data: formData });

    return { status: 'success', message: 'Pendaftaran berhasil dikirim!' };
  }

  // --- Asesmen Methods ---
  public verifyPesertaIdentity(
    namaUsaha: string,
    whatsapp: string
  ): { found: boolean; namaUsaha?: string; alreadySubmitted?: boolean } {
    const cleanNama = namaUsaha.toLowerCase().trim();
    const cleanWa = whatsapp.replace(/[\s\-()]/g, '').replace(/^\+?62/, '').replace(/^0/, '');
    const cleanSesi = this.settings.sesiAktif.toLowerCase().trim();

    const matched = this.peserta.find((p) => {
      const pWa = p.whatsapp.replace(/[\s\-()]/g, '').replace(/^\+?62/, '').replace(/^0/, '');
      return (
        p.namaUsaha.toLowerCase().trim() === cleanNama &&
        pWa === cleanWa &&
        (!cleanSesi || p.sesi.toLowerCase().trim() === cleanSesi)
      );
    });

    if (!matched) {
      return { found: false };
    }

    const alreadySubmitted = this.asesmen.some(
      (a) =>
        a.namaUsaha.toLowerCase().trim() === cleanNama &&
        (!cleanSesi || a.sesi.toLowerCase().trim() === cleanSesi)
    );

    return {
      found: true,
      namaUsaha: matched.namaUsaha,
      alreadySubmitted
    };
  }

  public submitAssessment(formData: {
    namaUsaha: string;
    whatsapp: string;
    kriteria: { skor: number; catatan: string }[];
    poinBisaAjarkan: string;
    materiBisaAjarkan: string;
    poinPerluDipelajari: string;
    bagian3: { kategori: string; skorRataRata: number; rincian: any[] }[];
  }): { status: string; message: string; totalSkor?: number } {
    const ident = this.verifyPesertaIdentity(formData.namaUsaha, formData.whatsapp);
    if (!ident.found) {
      return { status: 'error', message: 'Nama Usaha dan WhatsApp tidak cocok dengan data pendaftaran.' };
    }
    if (ident.alreadySubmitted) {
      return {
        status: 'error',
        message: 'Asesmen mandiri untuk usaha ini sudah pernah diisi pada sesi ini.'
      };
    }

    let totalSkor = 0;
    const rincian = formData.kriteria.map((k, idx) => {
      totalSkor += k.skor;
      return {
        kriteria: ASESMEN_KRITERIA[idx] || `Kriteria ${idx + 1}`,
        skor: k.skor,
        catatan: k.catatan
      };
    });

    let maxSkor = -1;
    let minSkor = 99;
    let kekuatan = '';
    let kelemahan = '';

    rincian.forEach((r) => {
      if (r.skor > maxSkor) {
        maxSkor = r.skor;
        kekuatan = r.kriteria;
      }
      if (r.skor < minSkor) {
        minSkor = r.skor;
        kelemahan = r.kriteria;
      }
    });

    const now = new Date();
    const dateFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newRow = this.asesmen.length ? Math.max(...this.asesmen.map((a) => a.row || 0)) + 1 : 2;

    const newAsesmen: AsesmenItem = {
      row: newRow,
      timestamp: dateFormatted,
      namaUsaha: ident.namaUsaha || formData.namaUsaha,
      whatsapp: formData.whatsapp,
      totalSkor,
      poinBisaAjarkan: formData.poinBisaAjarkan || '-',
      materiBisaAjarkan: formData.materiBisaAjarkan || '-',
      poinPerluDipelajari: formData.poinPerluDipelajari || '-',
      sesi: this.settings.sesiAktif,
      kekuatan,
      kekuatanSkor: maxSkor,
      kelemahan,
      kelemahanSkor: minSkor,
      rincian,
      bagian3: formData.bagian3.map((b) => ({ kategori: b.kategori, skorRataRata: b.skorRataRata })),
      bagian3Detail: formData.bagian3
    };

    this.asesmen.push(newAsesmen);
    this.saveToStorage();
    this.dispatchRemoteAction('submitAssessment', { data: formData });

    return {
      status: 'success',
      message: 'Asesmen mandiri berhasil dikirim! Terima kasih.',
      totalSkor
    };
  }

  public getAsesmenList(filterSesi?: string): AsesmenItem[] {
    let list = [...this.asesmen];
    if (filterSesi) {
      list = list.filter((a) => a.sesi.toLowerCase().trim() === filterSesi.toLowerCase().trim());
    }
    return list.reverse();
  }

  // --- Kehadiran Methods ---
  public getKehadiranBySesi(idSesi: string) {
    const list = this.kehadiran.filter((k) => k.idSesi === idSesi);
    const totalTerdaftar = this.getRegisteredBusinessNames().length;
    return {
      hadir: list.sort((a, b) => a.namaUsaha.localeCompare(b.namaUsaha)),
      totalHadir: list.length,
      totalTerdaftar
    };
  }

  public checkinKehadiran(
    idSesi: string,
    namaUsaha: string,
    whatsapp: string
  ): { status: string; message?: string; namaUsaha?: string; topik?: string } {
    const sesi = this.jadwal.find((j) => j.idSesi === idSesi);
    if (!sesi) {
      return { status: 'error', message: 'Sesi pelatihan tidak ditemukan atau link QR tidak valid.' };
    }

    const ident = this.verifyPesertaIdentity(namaUsaha, whatsapp);
    if (!ident.found) {
      return {
        status: 'error',
        message: 'Nama Usaha atau Nomor WhatsApp tidak cocok dengan data pendaftaran peserta.'
      };
    }

    const already = this.kehadiran.some(
      (k) =>
        k.idSesi === idSesi &&
        k.namaUsaha.toLowerCase().trim() === (ident.namaUsaha || namaUsaha).toLowerCase().trim()
    );

    if (already) {
      return {
        status: 'already_checked_in',
        namaUsaha: ident.namaUsaha || namaUsaha,
        topik: sesi.topik
      };
    }

    const now = new Date();
    const dateFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const item: KehadiranItem = {
      id: `kh-${Date.now()}`,
      timestamp: dateFormatted,
      idSesi,
      tanggalSesi: sesi.tanggal,
      topikSesi: sesi.topik,
      namaUsaha: ident.namaUsaha || namaUsaha,
      whatsapp,
      sesiPartnerUp: this.settings.sesiAktif,
      metode: 'Self Check-in'
    };

    this.kehadiran.push(item);
    this.saveToStorage();
    this.dispatchRemoteAction('checkinKehadiran', { idSesi, namaUsaha: ident.namaUsaha, whatsapp });

    return {
      status: 'success',
      namaUsaha: ident.namaUsaha || namaUsaha,
      topik: sesi.topik
    };
  }

  public saveKehadiranManual(idSesi: string, namaUsaha: string): { status: string; message: string } {
    const sesi = this.jadwal.find((j) => j.idSesi === idSesi);
    if (!sesi) {
      return { status: 'error', message: 'Sesi tidak ditemukan.' };
    }

    const cleanNama = namaUsaha.toLowerCase().trim();
    const cleanSesi = this.settings.sesiAktif.toLowerCase().trim();
    const p = this.peserta.find(
      (item) => item.namaUsaha.toLowerCase().trim() === cleanNama && (!cleanSesi || item.sesi.toLowerCase().trim() === cleanSesi)
    );

    if (!p) {
      return { status: 'error', message: 'Peserta tidak ditemukan di daftar terdaftar.' };
    }

    const already = this.kehadiran.some(
      (k) => k.idSesi === idSesi && k.namaUsaha.toLowerCase().trim() === cleanNama
    );
    if (already) {
      return { status: 'error', message: `"${p.namaUsaha}" sudah tercatat hadir pada sesi ini.` };
    }

    const now = new Date();
    const dateFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    this.kehadiran.push({
      id: `kh-${Date.now()}`,
      timestamp: dateFormatted,
      idSesi,
      tanggalSesi: sesi.tanggal,
      topikSesi: sesi.topik,
      namaUsaha: p.namaUsaha,
      whatsapp: p.whatsapp,
      sesiPartnerUp: this.settings.sesiAktif,
      metode: 'Manual Admin'
    });

    this.saveToStorage();
    this.dispatchRemoteAction('saveKehadiranManual', { idSesi, namaUsaha: p.namaUsaha });

    return { status: 'success', message: `"${p.namaUsaha}" berhasil ditandai hadir.` };
  }

  public deleteKehadiranItem(idSesi: string, namaUsaha: string): { status: string; message: string } {
    const cleanNama = namaUsaha.toLowerCase().trim();
    this.kehadiran = this.kehadiran.filter(
      (k) => !(k.idSesi === idSesi && k.namaUsaha.toLowerCase().trim() === cleanNama)
    );
    this.saveToStorage();
    this.dispatchRemoteAction('deleteKehadiranItem', { idSesi, namaUsaha });
    return { status: 'success', message: 'Presensi kehadiran dihapus.' };
  }

  // --- Statistik Methods ---
  public getDashboardStats(filterSesi?: string): DashboardStats {
    const cleanSesi = (filterSesi || this.settings.sesiAktif).toLowerCase().trim();

    const filteredPeserta = this.peserta.filter(
      (p) => !filterSesi || p.sesi.toLowerCase().trim() === cleanSesi
    );

    const filteredAsesmen = this.asesmen.filter(
      (a) => !filterSesi || a.sesi.toLowerCase().trim() === cleanSesi
    );

    let diterima = 0;
    let ditolak = 0;
    let belum = 0;
    const subsektorMap: Record<string, number> = {};
    const domisiliMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};

    filteredPeserta.forEach((p) => {
      if (p.statusKurasi === 'Diterima') diterima++;
      else if (p.statusKurasi === 'Ditolak') ditolak++;
      else belum++;

      statusMap[p.statusKurasi] = (statusMap[p.statusKurasi] || 0) + 1;
      if (p.subsektor) subsektorMap[p.subsektor] = (subsektorMap[p.subsektor] || 0) + 1;
      if (p.kotaKabupaten) domisiliMap[p.kotaKabupaten] = (domisiliMap[p.kotaKabupaten] || 0) + 1;
    });

    const toSorted = (map: Record<string, number>) =>
      Object.keys(map)
        .map((k) => ({ label: k, count: map[k] }))
        .sort((a, b) => b.count - a.count);

    // Next upcoming session
    const today = new Date().toISOString().split('T')[0];
    const upcoming = this.jadwal
      .filter((j) => j.tanggal >= today)
      .sort((a, b) => a.tanggal.localeCompare(b.tanggal))[0];

    const totalPendaftar = filteredPeserta.length;
    const totalAsesmenSelesai = filteredAsesmen.length;
    const persenAsesmenSelesai =
      totalPendaftar > 0 ? `${((totalAsesmenSelesai / totalPendaftar) * 100).toFixed(1)}%` : '0%';

    return {
      totalPendaftar,
      totalDiterima: diterima,
      totalDitolak: ditolak,
      belumDireview: belum,
      subsektor: toSorted(subsektorMap),
      domisili: toSorted(domisiliMap),
      statusKurasi: toSorted(statusMap),
      persenIkutPelatihan: '100.00%',
      nextSession: upcoming
        ? {
            tanggal: upcoming.tanggal,
            waktu: upcoming.waktu,
            topik: upcoming.topik,
            lokasi: upcoming.lokasi
          }
        : null,
      totalAsesmenSelesai,
      persenAsesmenSelesai
    };
  }

  public getPetaKolaborasi(filterSesi?: string): PetaKolaborasiCategory[] {
    const list = this.getAsesmenList(filterSesi);
    const radar = ASESMEN_KRITERIA.slice(7);

    const peta: PetaKolaborasiCategory[] = radar.map((kategori) => {
      const bisaMengajar = list
        .filter((a) => a.poinBisaAjarkan === kategori)
        .map((a) => ({
          namaUsaha: a.namaUsaha,
          whatsapp: a.whatsapp,
          materi: a.materiBisaAjarkan
        }));

      const perluBelajar = list
        .filter((a) => a.poinPerluDipelajari === kategori)
        .map((a) => ({
          namaUsaha: a.namaUsaha,
          whatsapp: a.whatsapp
        }));

      return { kategori, bisaMengajar, perluBelajar };
    });

    return peta.sort((a, b) => {
      const scoreA = a.bisaMengajar.length > 0 && a.perluBelajar.length > 0 ? 1 : 0;
      const scoreB = b.bisaMengajar.length > 0 && b.perluBelajar.length > 0 ? 1 : 0;
      return scoreB - scoreA;
    });
  }

  public generateKelompok(filterSesi?: string, ukuranKelompok: number = 5): KelompokItem[] {
    const items = this.getAsesmenList(filterSesi);
    if (!items.length) return [];

    const mapped = items.map((it) => {
      let topKategori = 'Operasional';
      let topSkor = -1;

      if (it.bagian3 && it.bagian3.length) {
        it.bagian3.forEach((b) => {
          if (b.skorRataRata > topSkor) {
            topSkor = b.skorRataRata;
            topKategori = b.kategori;
          }
        });
      } else {
        topKategori = it.kekuatan || 'Operasional';
        topSkor = it.kekuatanSkor || 4;
      }

      return {
        namaUsaha: it.namaUsaha,
        whatsapp: it.whatsapp,
        kategoriUnggulan: topKategori,
        skorUnggulan: topSkor
      };
    });

    const shuffled = [...mapped].sort(() => Math.random() - 0.5);
    const numGroups = Math.max(1, Math.ceil(shuffled.length / ukuranKelompok));
    const groups: KelompokItem[] = Array.from({ length: numGroups }, (_, i) => ({
      nomor: i + 1,
      anggota: []
    }));

    shuffled.forEach((person, idx) => {
      groups[idx % numGroups].anggota.push(person);
    });

    return groups;
  }

  // --- Settings Methods ---
  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public saveSettings(newSettings: Partial<AppSettings>): { status: string; message: string } {
    this.settings = { ...this.settings, ...newSettings };

    // Jika batas akhir pendaftaran diubah, selaraskan otomatis dengan baris Timeline "Pendaftaran"
    if (newSettings.registrationDeadline) {
      const regDate = newSettings.registrationDeadline;
      const targetTimeline = this.timeline.find(
        (t) => t.tahapan.toLowerCase().includes('pendaftaran') || Number(t.urutan) === 1
      );
      if (targetTimeline) {
        targetTimeline.tanggalSelesai = regDate;
        this.dispatchRemoteAction('saveTimelineItem', { item: targetTimeline });
      }
    }

    this.saveToStorage();
    this.dispatchRemoteAction('setSettings', { settings: this.settings });
    return { status: 'success', message: 'Pengaturan berhasil disimpan dan diselaraskan ke Google Sheets!' };
  }

  // --- Backup / Export Methods ---
  public exportAllDataAsJson(): string {
    const backup = {
      exportedAt: new Date().toISOString(),
      organization: 'Gekrafs Kota Batu',
      application: 'Gekrafs PartnerUp',
      settings: this.settings,
      timeline: this.timeline,
      jadwal: this.jadwal,
      peserta: this.peserta,
      asesmen: this.asesmen,
      kehadiran: this.kehadiran
    };
    return JSON.stringify(backup, null, 2);
  }
}

export const gasService = new GasService();
