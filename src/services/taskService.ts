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

  getTaskByNamaUsaha(namaUsaha: string): StrategicCanvasTask | undefined {
    if (!namaUsaha) return undefined;
    const clean = namaUsaha.toLowerCase().trim();
    return this.tasks.find(t => t.namaUsaha.toLowerCase().trim() === clean);
  }

  saveDraft(taskData: Partial<StrategicCanvasTask> & { namaUsaha: string; namaPemilik: string }): StrategicCanvasTask {
    const existingIndex = this.tasks.findIndex(t => 
      t.namaUsaha.toLowerCase().trim() === taskData.namaUsaha.toLowerCase().trim() ||
      (taskData.id && t.id === taskData.id)
    );

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (existingIndex >= 0) {
      const updated: StrategicCanvasTask = {
        ...this.tasks[existingIndex],
        ...taskData,
        status: this.tasks[existingIndex].status === 'reviewed' ? 'reviewed' : 'draft',
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
        gasService.dispatchRemoteAction('submitTask', { task: finalTask });
      } catch {}
      return finalTask;
    }
    return task;
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
}

export const taskService = new TaskService();
