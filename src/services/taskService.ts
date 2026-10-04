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

const INITIAL_SAMPLE_TASKS: StrategicCanvasTask[] = [];

class TaskService {
  private tasks: StrategicCanvasTask[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: StrategicCanvasTask[] = JSON.parse(data);
        // Bersihkan tugas dummy lama dari penyimpanan lokal browser
        this.tasks = parsed.filter(t => 
          t.id !== 'TASK-2026-001' && 
          t.id !== 'TASK-2026-002' &&
          t.namaUsaha.toLowerCase().trim() !== 'kripik apel batu mandiri' &&
          t.namaUsaha.toLowerCase().trim() !== 'batik among tani creative'
        );
        this.saveToStorage();
      } else {
        this.tasks = [];
      }
    } catch (e) {
      console.error('Failed to load tasks from storage:', e);
      this.tasks = [];
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
