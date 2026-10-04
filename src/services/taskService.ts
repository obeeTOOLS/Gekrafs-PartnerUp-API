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

// Data Tugas Terverifikasi dari Peserta Aktif
export const VERIFIED_SUBMISSIONS: StrategicCanvasTask[] = [
  {
    id: 'TASK-SUB-001',
    namaUsaha: 'Sidoasri kopi',
    namaPemilik: 'Alvitalia Kusumaningsih',
    whatsapp: '081336612673',
    email: 'alvitalia110596@gmail.com',
    subsektor: 'Kuliner',
    sesiPartnerUp: 'Sesi 2',
    status: 'submitted',
    visi: 'Mengembangkan cita rasa kopi khas Sidoasri lereng pegunungan Kota Batu menjadi brand kopi unggulan lokal yang dikenal luas.',
    misi: 'Menghadirkan racikan kopi berkualitas dengan biji pilihan petani lokal serta pelayanan ramah untuk penikmat kopi nusantara.',
    goal: 'Meningkatkan kapasitas roasting dan membuka kedai kemitraan strategis di kawasan wisata Kota Batu.',
    objective: 'Meningkatkan omzet bulanan 20% dalam 90 hari dan memperluas distribusi kemasan drip bag ke hotel & resto.',
    nilaiUsaha: 'Kualitas Biji Pilihan, Kebersamaan, Ketulusan Pelayanan, Kearifan Petani Lokal.',
    keahlianOrganisasi: 'Teknik roasting profil medium-dark, penyajian manual brew, dan hubungan langsung dengan petani kebun kopi.',
    matriks: {
      problemSolving: {
        recent: 'Menjaga kestabilan pasokan green beans saat musim hujan.',
        midTerm: 'Pengadaan mesin grinder dan sealer otomatis untuk mempercepat packaging.',
        longTerm: 'Standarisasi SOP cupping dan quality control di seluruh lini.'
      },
      incremental: {
        recent: 'Mempercantik packaging drip bag kopi untuk oleh-oleh wisatawan.',
        midTerm: 'Kolaborasi menu kopi susu signature dengan kafe mitra.',
        longTerm: 'Membuka flagship coffee shop di pusat Kota Batu.'
      },
      breakthrough: {
        recent: 'Peluncuran cold brew konsentrat kemasan botol siap minum.',
        midTerm: 'Kemitraan pasokan kopi resmi untuk jaringan perhotelan Batu.',
        longTerm: 'Mendirikan pusat edukasi dan wisata kopi (Coffee Experience Center) di Sidoasri.'
      }
    },
    createdAt: '2026-10-04 07:42:05',
    updatedAt: '2026-10-04 07:42:05'
  },
  {
    id: 'TASK-SUB-002',
    namaUsaha: 'Fida Accessories',
    namaPemilik: 'Wahida Haeraty',
    whatsapp: '081253426280',
    email: 'wahidahaeraty@gmail.com',
    subsektor: 'Kriya / Kerajinan',
    sesiPartnerUp: 'Sesi 2',
    status: 'submitted',
    visi: 'Menjadi brand kerajinan aksesoris fesyen handmade terdepan di Jawa Timur dengan ciri khas motif etnik kekinian.',
    misi: 'Memproduksi perhiasan dan cenderamata gelang, kalung, gantungan kunci berkualitas yang mempercantik penampilan dan memberdayakan pengrajin wanita.',
    goal: 'Memperluas jaringan distribusi retail di pusat perbelanjaan wisata utama Kota Batu dan memperbesar volume penjualan e-commerce.',
    objective: 'Menaikkan penjualan marketplace dan memperluas display konsinyasi ke 5 toko cinderamata baru dalam kurun waktu 90 hari.',
    nilaiUsaha: 'Kreativitas Tanpa Batas, Ketelitian Handmade, Keindahan Etnik, Kepuasan Pelanggan.',
    keahlianOrganisasi: 'Keahlian merangkai manik-manik etnik, desain aksesoris custom, kemitraan display di spot wisata ikonik (BALOGA & Jatim Park).',
    matriks: {
      problemSolving: {
        recent: 'Mempercepat waktu produksi handmade saat permintaan grosir membludak.',
        midTerm: 'Mengatur manajemen stok manik dan bahan baku agar tidak kehabisan.',
        longTerm: 'Membentuk kelompok pengrajin binaan untuk sistem sub-kontrak produksi.'
      },
      incremental: {
        recent: 'Meningkatkan kualitas foto produk di Shopee dan katalog direktori.',
        midTerm: 'Menyusun paket suvenir aksesoris khusus instansi/event pernikahan.',
        longTerm: 'Membuka booth eksklusif di festival kriya nasional.'
      },
      breakthrough: {
        recent: 'Merilis seri aksesoris berbahan batu alam khas dengan sertifikat keaslian.',
        midTerm: 'Kolaborasi aksesoris dengan desainer busana muslim terkemuka.',
        longTerm: 'Ekspor aksesoris kerajinan tangan ke pasar suvenir Asia Tenggara.'
      }
    },
    createdAt: '2026-10-04 08:21:40',
    updatedAt: '2026-10-04 08:21:40'
  }
];

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
        const cleaned = parsed.filter(t => 
          t.id !== 'TASK-2026-001' && 
          t.id !== 'TASK-2026-002' &&
          t.namaUsaha.toLowerCase().trim() !== 'kripik apel batu mandiri' &&
          t.namaUsaha.toLowerCase().trim() !== 'batik among tani creative'
        );

        // Pastikan submission peserta terverifikasi ada di daftar
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
    const newTasks: StrategicCanvasTask[] = [];

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r[2]) continue;

      let fullTask: StrategicCanvasTask | null = null;
      try {
        if (r[19]) fullTask = JSON.parse(r[19]);
      } catch {}

      if (fullTask && fullTask.namaUsaha) {
        newTasks.push(fullTask);
      } else {
        let ps = { recent: '', midTerm: '', longTerm: '' };
        let inc = { recent: '', midTerm: '', longTerm: '' };
        let bt = { recent: '', midTerm: '', longTerm: '' };
        try { if (r[16]) ps = JSON.parse(r[16]); } catch {}
        try { if (r[17]) inc = JSON.parse(r[17]); } catch {}
        try { if (r[18]) bt = JSON.parse(r[18]); } catch {}

        newTasks.push({
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
        });
      }
    }

    if (newTasks.length > 0) {
      const map = new Map<string, StrategicCanvasTask>();
      this.tasks.forEach(t => map.set(t.namaUsaha.toLowerCase().trim(), t));
      newTasks.forEach(t => map.set(t.namaUsaha.toLowerCase().trim(), t));
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
