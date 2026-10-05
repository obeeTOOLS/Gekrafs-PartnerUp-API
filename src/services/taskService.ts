/**
 * Gekrafs PartnerUp - Strategic Business Canvas & Task Service
 * Mengelola Lembar Kerja Rencana Aksi Strategis Sesi (Strategic Canvas & Horizon Matrix 3x3)
 * Mendukung Simpan Draf Otomatis, Pengajuan Final ke Kurator, dan Penilaian Feedback Mentor.
 */

import { StrategicCanvasTask, StrategicInnovationMatrix } from '../types';
import { gasService } from './gasService';

const STORAGE_KEY = 'gkf_strategic_tasks_v2';

export const DEFAULT_INNOVATION_MATRIX: StrategicInnovationMatrix = {
  problemSolving: {
    recent: '',
    midTerm: '',
    longTerm: ''
  },
  incremental: {
    recent: '',
    midTerm: '',
    longTerm: ''
  },
  breakthrough: {
    recent: '',
    midTerm: '',
    longTerm: ''
  }
};

import { ALL_34_SUBMITTED_TASKS } from '../data/initialTasks';

const INITIAL_SAMPLE_TASKS: StrategicCanvasTask[] = [];

// Data Tugas Terverifikasi dari 34 Peserta Aktif
export const VERIFIED_SUBMISSIONS: StrategicCanvasTask[] = ALL_34_SUBMITTED_TASKS;

class TaskService {
  private tasks: StrategicCanvasTask[] = [];

  constructor() {
    this.loadFromStorage();
    // Tarik data remote secara asynchronous agar langsung sinkron dengan Google Sheets
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.pullTasksFromRemote();
      }, 200);
    }
  }

  /**
   * Menarik data Tugas terbaru secara real-time dari Google Apps Script / Google Spreadsheet
   */
  public async pullTasksFromRemote(): Promise<{ success: boolean; count: number; newAdded: number }> {
    const endpoint = gasService.getSettings().gasEndpointUrl;
    if (!endpoint) return { success: false, count: this.tasks.length, newAdded: 0 };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(`${endpoint}?action=getAllData`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const remoteTugas: any[] = json?.data?.tugas || [];

      if (remoteTugas && remoteTugas.length > 0) {
        const prevCount = this.tasks.length;
        const map = new Map<string, StrategicCanvasTask>();
        
        // 1. Muat task lokal yang valid
        this.tasks.forEach(t => {
          if (t && t.namaUsaha && !this.isInvalidCorruptedTask(t)) {
            map.set(t.namaUsaha.toLowerCase().trim(), t);
          }
        });

        // 2. Selaraskan dengan data remote dari Google Sheets (termasuk tugas baru yang masuk)
        remoteTugas.forEach(rt => {
          if (rt && rt.namaUsaha && !this.isInvalidCorruptedTask(rt)) {
            const key = rt.namaUsaha.toLowerCase().trim();
            const existing = map.get(key);
            if (!existing) {
              map.set(key, {
                ...rt,
                matriks: rt.matriks || DEFAULT_INNOVATION_MATRIX
              });
            } else {
              map.set(key, {
                ...existing,
                ...rt,
                matriks: rt.matriks || existing.matriks || DEFAULT_INNOVATION_MATRIX
              });
            }
          }
        });

        this.tasks = Array.from(map.values());
        this.saveToStorage();
        try {
          window.dispatchEvent(new CustomEvent('gkf-tasks-updated'));
        } catch {}

        return {
          success: true,
          count: this.tasks.length,
          newAdded: Math.max(0, this.tasks.length - prevCount)
        };
      }
    } catch (err) {
      console.warn('[taskService] Gagal menarik tugas dari remote GAS:', err);
    }
    return { success: false, count: this.tasks.length, newAdded: 0 };
  }

  private isInvalidCorruptedTask(t: Partial<StrategicCanvasTask>): boolean {
    if (!t.namaUsaha) return true;
    const cleanNama = t.namaUsaha.trim();
    // Jika nama usaha berupa angka murni atau nomor HP (misal 85895807020)
    if (/^[0-9+\s\-()]+$/.test(cleanNama)) return true;
    // Jika nama pemilik berisi teks jawaban kuesioner asesmen
    if (t.namaPemilik && (/^[0-9]\s*•/.test(t.namaPemilik) || t.namaPemilik.includes('bergantung pada pemilik') || t.namaPemilik.includes('Lokasi strategis'))) return true;
    // Jika subsektor hanya angka (misal "5")
    if (t.subsektor && /^[0-9]+$/.test(t.subsektor.trim())) return true;
    // Jika visi/misi hanya satu angka (misal "4" atau "5")
    if (t.misi && /^[0-9]+$/.test(t.misi.trim())) return true;
    if (t.objective && /^[0-9]+$/.test(t.objective.trim())) return true;
    // Jika dummy lama
    if (t.id === 'TASK-2026-001' || t.id === 'TASK-2026-002') return true;
    if (cleanNama.toLowerCase() === 'kripik apel batu mandiri' || cleanNama.toLowerCase() === 'batik among tani creative') return true;

    return false;
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: StrategicCanvasTask[] = JSON.parse(data);
        // Bersihkan tugas dummy dan data asesmen yang sempat salah tertarik
        const cleaned = parsed.filter(t => !this.isInvalidCorruptedTask(t));

        // Pastikan seluruh 4 submission peserta terverifikasi ada di daftar dengan struktur rapi
        const existingNames = new Set(cleaned.map(p => p.namaUsaha.toLowerCase().trim()));
        for (const sub of VERIFIED_SUBMISSIONS) {
          if (!existingNames.has(sub.namaUsaha.toLowerCase().trim())) {
            cleaned.push(sub);
          }
        }
        this.tasks = cleaned;
        this.saveToStorage();
      } else {
        this.tasks = [...VERIFIED_SUBMISSIONS];
        this.saveToStorage();
      }
    } catch (e) {
      console.error('Failed to load tasks from storage:', e);
      this.tasks = [...VERIFIED_SUBMISSIONS];
    }
  }

  /**
   * Menyinkronkan baris tab 'Tugas' dari live Google Sheets
   */
  public syncFromSpreadsheetRows(rows: string[][]) {
    if (!rows || rows.length <= 1) return;

    // VALIDASI KETAT HEADER: Pastikan benar-benar tab 'Tugas', bukan fallback Google Sheets ke tab Asesmen atau tab lain!
    const headerLine = rows[0].map(c => (c || '').toLowerCase().trim()).join(' ');
    const isActualTugasSheet = headerLine.includes('id tugas') || headerLine.includes('status tugas') || (headerLine.includes('visi') && headerLine.includes('misi') && headerLine.includes('matriks'));
    const isAsesmenFallback = headerLine.includes('kriteria') || headerLine.includes('bagian 3') || headerLine.includes('radar') || headerLine.includes('poinbisa') || headerLine.includes('skor');

    if (!isActualTugasSheet || isAsesmenFallback) {
      console.warn('[taskService] Tab Tugas belum dibuat di spreadsheet Anda. Google mengembalikan tab lain sebagai fallback. Sinkronisasi tab tugas dibatalkan untuk menjaga kebersihan data.');
      return;
    }

    const newTasks: StrategicCanvasTask[] = [];

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r[2]) continue;

      let fullTask: StrategicCanvasTask | null = null;
      try {
        if (r[19]) fullTask = JSON.parse(r[19]);
      } catch {}

      if (fullTask && fullTask.namaUsaha && !this.isInvalidCorruptedTask(fullTask)) {
        newTasks.push(fullTask);
      } else {
        let ps = { recent: '', midTerm: '', longTerm: '' };
        let inc = { recent: '', midTerm: '', longTerm: '' };
        let bt = { recent: '', midTerm: '', longTerm: '' };
        try { if (r[16]) ps = JSON.parse(r[16]); } catch {}
        try { if (r[17]) inc = JSON.parse(r[17]); } catch {}
        try { if (r[18]) bt = JSON.parse(r[18]); } catch {}

        const parsedTask: StrategicCanvasTask = {
          id: r[1] || `TASK-${i}`,
          namaUsaha: r[2],
          namaPemilik: r[3] || '',
          whatsapp: r[4] || '',
          subsektor: r[5] || 'Kuliner',
          sesiPartnerUp: r[6] || 'Sesi 2',
          status: (r[7] as any) || 'submitted',
          nilai: r[8] ? Number(r[8]) : undefined,
          catatanKurator: r[9] || '',
          visi: r[10] || '',
          misi: r[11] || '',
          goal: r[12] || '',
          objective: r[13] || '',
          nilaiUsaha: r[14] || '',
          keahlianOrganisasi: r[15] || '',
          matriks: {
            problemSolving: ps,
            incremental: inc,
            breakthrough: bt
          },
          createdAt: r[0] || new Date().toISOString(),
          updatedAt: r[0] || ''
        };

        if (!this.isInvalidCorruptedTask(parsedTask)) {
          newTasks.push(parsedTask);
        }
      }
    }

    if (newTasks.length > 0) {
      const map = new Map<string, StrategicCanvasTask>();
      this.tasks.forEach(t => {
        if (!this.isInvalidCorruptedTask(t)) map.set(t.namaUsaha.toLowerCase().trim(), t);
      });
      newTasks.forEach(t => {
        if (!this.isInvalidCorruptedTask(t)) map.set(t.namaUsaha.toLowerCase().trim(), t);
      });
      this.tasks = Array.from(map.values());
      this.saveToStorage();
      try {
        window.dispatchEvent(new CustomEvent('gkf-tasks-updated'));
      } catch {}
    }
  }

  /**
   * Menghapus seluruh data tugas dummy atau uji coba lama
   */
  public purgeDummyTasks(): { purgedCount: number; message: string } {
    const prevCount = this.tasks.length;
    this.tasks = this.tasks.filter(t => 
      t.id !== 'TASK-2026-001' && 
      t.id !== 'TASK-2026-002' &&
      t.namaUsaha.toLowerCase().trim() !== 'kripik apel batu mandiri' &&
      t.namaUsaha.toLowerCase().trim() !== 'batik among tani creative'
    );
    this.saveToStorage();
    try {
      window.dispatchEvent(new CustomEvent('gkf-tasks-updated'));
    } catch {}
    return {
      purgedCount: prevCount - this.tasks.length,
      message: 'Seluruh data dummy tugas berhasil dibersihkan.'
    };
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (e) {
      console.error('Failed to save tasks to storage:', e);
    }
  }

  getAllTasks(): StrategicCanvasTask[] {
    return [...this.tasks];
  }

  getTaskById(id: string): StrategicCanvasTask | undefined {
    return this.tasks.find(t => t.id === id);
  }

  /**
   * Pencocokan Cerdas Multi-Kunci (Multi-Key Smart Matcher)
   * Menemukan tugas peserta berdasarkan WhatsApp, Email, atau Nama Usaha (dengan normalisasi karakter/spasi)
   */
  getTaskByParticipant(query: { namaUsaha?: string; whatsapp?: string; email?: string } | string): StrategicCanvasTask | undefined {
    if (!query) return undefined;
    const namaUsaha = typeof query === 'string' ? query : query.namaUsaha || '';
    const whatsapp = typeof query === 'object' ? query.whatsapp || '' : '';
    const email = typeof query === 'object' ? query.email || '' : '';

    const cleanPhone = (p: string) => {
      const digits = (p || '').replace(/[^0-9]/g, '');
      if (digits.startsWith('62')) return '0' + digits.slice(2);
      if (!digits.startsWith('0') && digits.length > 0) return '0' + digits;
      return digits;
    };

    const targetPhone = cleanPhone(whatsapp);
    const targetEmail = email.toLowerCase().trim();
    const targetName = namaUsaha.toLowerCase().replace(/[^a-z0-9]/g, '');

    // 1. Kunci Utama: Cocokkan nomor WhatsApp (Paling Akurat & Unik)
    if (targetPhone.length >= 9) {
      const matchByPhone = this.tasks.find(t => t.whatsapp && cleanPhone(t.whatsapp) === targetPhone);
      if (matchByPhone) return matchByPhone;
    }

    // 2. Kunci Kedua: Cocokkan Email Akun
    if (targetEmail.length > 4 && targetEmail.includes('@')) {
      const matchByEmail = this.tasks.find(t => t.email && t.email.toLowerCase().trim() === targetEmail);
      if (matchByEmail) return matchByEmail;
    }

    // 3. Kunci Ketiga: Cocokkan Nama Usaha (Normalisasi Tanpa Spasi/Tanda Baca)
    if (targetName) {
      const matchByName = this.tasks.find(t => {
        const tn = (t.namaUsaha || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!tn) return false;
        if (tn === targetName) return true;
        if (targetName.length >= 5 && (tn.includes(targetName) || targetName.includes(tn))) return true;
        return false;
      });
      if (matchByName) return matchByName;
    }

    return undefined;
  }

  getTaskByNamaUsaha(namaUsaha: string): StrategicCanvasTask | undefined {
    if (!namaUsaha) return undefined;
    return this.getTaskByParticipant({ namaUsaha });
  }

  saveDraft(taskData: Partial<StrategicCanvasTask> & { namaUsaha: string; namaPemilik: string }): StrategicCanvasTask {
    const cleanPhone = (p: string) => {
      const digits = (p || '').replace(/[^0-9]/g, '');
      if (digits.startsWith('62')) return '0' + digits.slice(2);
      if (!digits.startsWith('0') && digits.length > 0) return '0' + digits;
      return digits;
    };

    const targetPhone = cleanPhone(taskData.whatsapp || '');
    const targetEmail = (taskData.email || '').toLowerCase().trim();
    const targetName = (taskData.namaUsaha || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    const existingIndex = this.tasks.findIndex(t => {
      if (taskData.id && t.id === taskData.id) return true;
      if (targetPhone && targetPhone.length >= 9 && cleanPhone(t.whatsapp || '') === targetPhone) return true;
      if (targetEmail && targetEmail.length > 4 && (t.email || '').toLowerCase().trim() === targetEmail) return true;
      const tn = (t.namaUsaha || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return tn && targetName && tn === targetName;
    });

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (existingIndex >= 0) {
      const prev = this.tasks[existingIndex];
      // PROTEKSI STATUS: Jika tugas sudah 'submitted', 'reviewed', atau 'revision',
      // JANGAN PERNAH turunkan kembali statusnya menjadi 'draft'!
      const preservedStatus = (prev.status === 'submitted' || prev.status === 'reviewed' || prev.status === 'revision')
        ? prev.status
        : (taskData.status || 'draft');

      const updated: StrategicCanvasTask = {
        ...prev,
        ...taskData,
        status: preservedStatus,
        updatedAt: now
      };
      this.tasks[existingIndex] = updated;
      this.saveToStorage();
      try {
        window.dispatchEvent(new CustomEvent('gkf-tasks-updated', { detail: updated }));
        gasService.dispatchRemoteAction('saveTaskDraft', { task: updated });
      } catch {}
      return updated;
    } else {
      const newTask: StrategicCanvasTask = {
        id: `TASK-${Date.now()}`,
        namaUsaha: taskData.namaUsaha,
        namaPemilik: taskData.namaPemilik || '',
        subsektor: taskData.subsektor || 'Kuliner',
        whatsapp: taskData.whatsapp || '',
        email: taskData.email || '',
        sesiPartnerUp: taskData.sesiPartnerUp || 'Sesi 2',
        visi: taskData.visi || '',
        misi: taskData.misi || '',
        goal: taskData.goal || '',
        objective: taskData.objective || '',
        nilaiUsaha: taskData.nilaiUsaha || '',
        keahlianOrganisasi: taskData.keahlianOrganisasi || '',
        matriks: taskData.matriks || DEFAULT_INNOVATION_MATRIX,
        status: 'draft',
        createdAt: now,
        updatedAt: now
      };
      this.tasks.unshift(newTask);
      this.saveToStorage();
      try {
        window.dispatchEvent(new CustomEvent('gkf-tasks-updated', { detail: newTask }));
        gasService.dispatchRemoteAction('saveTaskDraft', { task: newTask });
      } catch {}
      return newTask;
    }
  }

  submitTask(taskData: Partial<StrategicCanvasTask> & { namaUsaha: string; namaPemilik: string }): StrategicCanvasTask {
    const task = this.saveDraft(taskData);
    const existingIndex = this.tasks.findIndex(t => t.id === task.id);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (existingIndex >= 0) {
      const finalTask: StrategicCanvasTask = {
        ...this.tasks[existingIndex],
        status: 'submitted',
        updatedAt: now
      };
      this.tasks[existingIndex] = finalTask;
      this.saveToStorage();
      try {
        window.dispatchEvent(new CustomEvent('gkf-tasks-updated', { detail: finalTask }));
        const queueNumber = this.getSubmissionQueueNumber(finalTask.id);
        gasService.dispatchRemoteAction('submitTask', { task: finalTask, queueNumber });
      } catch {}
      return finalTask;
    }
    return task;
  }

  /**
   * Mengirim tugas dengan konfirmasi asynchronous hingga Google Apps Script merespon
   */
  async submitTaskAsync(taskData: Partial<StrategicCanvasTask> & { namaUsaha: string; namaPemilik: string }): Promise<StrategicCanvasTask> {
    const task = this.saveDraft(taskData);
    const existingIndex = this.tasks.findIndex(t => t.id === task.id);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (existingIndex >= 0) {
      const finalTask: StrategicCanvasTask = {
        ...this.tasks[existingIndex],
        status: 'submitted',
        updatedAt: now
      };
      this.tasks[existingIndex] = finalTask;
      this.saveToStorage();
      try {
        window.dispatchEvent(new CustomEvent('gkf-tasks-updated', { detail: finalTask }));
        const queueNumber = this.getSubmissionQueueNumber(finalTask.id);
        await gasService.dispatchRemoteAction('submitTask', { task: finalTask, queueNumber });
      } catch (err) {
        console.warn('Gagal remote dispatch submitTask:', err);
      }
      return finalTask;
    }
    return task;
  }

  /**
   * Menghitung nomor urut antrean pengiriman tugas
   */
  getSubmissionQueueNumber(taskId: string): number {
    const validSubmitted = this.tasks
      .filter(t => t.status === 'submitted' || t.status === 'reviewed')
      .sort((a, b) => (a.createdAt || a.updatedAt || '').localeCompare(b.createdAt || b.updatedAt || ''));
    const index = validSubmitted.findIndex(t => t.id === taskId);
    return index >= 0 ? index + 1 : Math.max(1, validSubmitted.length);
  }

  reviewTask(id: string, review: { nilai: number; catatanKurator: string; reviewerName: string; status?: 'reviewed' | 'revision' }): StrategicCanvasTask | null {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const reviewedTask: StrategicCanvasTask = {
      ...this.tasks[index],
      nilai: review.nilai,
      catatanKurator: review.catatanKurator,
      reviewedBy: review.reviewerName || 'Tim Kurator Gekrafs',
      reviewedAt: now,
      status: review.status || 'reviewed',
      updatedAt: now
    };
    this.tasks[index] = reviewedTask;

    this.saveToStorage();
    try {
      window.dispatchEvent(new CustomEvent('gkf-tasks-updated', { detail: reviewedTask }));
      gasService.dispatchRemoteAction('reviewTask', { task: reviewedTask });
    } catch {}
    return reviewedTask;
  }

  deleteTask(id: string): boolean {
    const prevLen = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length !== prevLen) {
      this.saveToStorage();
      try {
        window.dispatchEvent(new CustomEvent('gkf-tasks-updated', { detail: { id } }));
        gasService.dispatchRemoteAction('deleteTask', { id });
      } catch {}
      return true;
    }
    return false;
  }

  /**
   * Mengirim jawaban tugas ke Google Spreadsheet secara cerdas & super cepat (Smart Differential Sync)
   */
  async pushAllTasksToGoogleSheet(): Promise<{ success: boolean; total: number; successCount: number; message: string }> {
    // 1. Tarik data terbaru dari Google Sheets terlebih dahulu agar data lokal langsung update
    await this.pullTasksFromRemote();

    const validTasks = this.tasks.filter(t => t.namaUsaha && (t.status === 'submitted' || t.status === 'reviewed' || t.status === 'draft'));
    if (validTasks.length === 0) {
      return { success: false, total: 0, successCount: 0, message: 'Tidak ada data jawaban tugas yang tersimpan di aplikasi.' };
    }

    // 2. Cek tugas yang sudah ada di remote agar tidak mengirim ulang puluhan tugas yang sudah tersimpan
    const remoteExistingNames = new Set<string>();
    try {
      const endpoint = gasService.getSettings().gasEndpointUrl;
      if (endpoint) {
        const res = await fetch(`${endpoint}?action=getAllData`, {
          method: 'GET',
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          const json = await res.json();
          const remoteList: any[] = json?.data?.tugas || [];
          remoteList.forEach(t => {
            if (t && t.namaUsaha) remoteExistingNames.add(t.namaUsaha.toLowerCase().trim());
          });
        }
      }
    } catch {}

    // 3. Filter hanya tugas lokal yang BELUM ada di Google Spreadsheet
    const tasksToPush = validTasks.filter(t => !remoteExistingNames.has(t.namaUsaha.toLowerCase().trim()));

    // Jika seluruh tugas sudah tercatat di Google Sheets, selesai instan dalam hitungan detik!
    if (tasksToPush.length === 0) {
      return {
        success: true,
        total: validTasks.length,
        successCount: validTasks.length,
        message: `⚡ Sinkronisasi Kilat Selesai! Seluruh ${validTasks.length} Lembar Aksi selaras 100% dengan Google Spreadsheet.`
      };
    }

    // 4. Jika ada tugas baru, kirim HANYA tugas baru tersebut
    let newPushed = 0;
    for (const task of tasksToPush) {
      try {
        const queueNumber = this.getSubmissionQueueNumber(task.id);
        const res = await gasService.dispatchRemoteAction('submitTask', { task, queueNumber });
        if (res && (res.status === 'success' || res.status === 'ok')) {
          newPushed++;
        }
      } catch (err) {
        console.error('Gagal mengirim tugas baru untuk ' + task.namaUsaha, err);
      }
    }

    // Refresh data lokal sekali lagi setelah push
    await this.pullTasksFromRemote();

    return {
      success: true,
      total: this.tasks.length,
      successCount: validTasks.length,
      message: `⚡ Sinkronisasi Kilat Berhasil! ${newPushed} tugas baru tersinkron, total ${this.tasks.length} tugas aktif di Google Spreadsheet.`
    };
  }
}

export const taskService = new TaskService();
