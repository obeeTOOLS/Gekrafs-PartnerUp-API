/**
 * Gekrafs PartnerUp - Strategic Business Canvas & Task Service
 * Mengelola Lembar Kerja Rencana Aksi Strategis Sesi (Strategic Canvas & Horizon Matrix 3x3)
 * Mendukung Simpan Draf Otomatis, Pengajuan Final ke Kurator, dan Penilaian Feedback Mentor.
 */

import { StrategicCanvasTask, StrategicInnovationMatrix } from '../types';

const STORAGE_KEY = 'gkf_strategic_tasks_v2';

export const DEFAULT_INNOVATION_MATRIX: StrategicInnovationMatrix = {
  problemSolving: {
    recent: 'Memperbaiki SOP higienitas dapur produksi & konsistensi rasa kemasan.',
    midTerm: 'Mengurangi limbah bahan baku (waste) apel afkir hingga di bawah 5%.',
    longTerm: 'Standarisasi otomatisasi mesin pengering vakum hemat listrik.'
  },
  incremental: {
    recent: 'Memperbarui desain label kemasan dengan QR Code katalog direktori.',
    midTerm: 'Mendapatkan sertifikasi Halal & P-IRT untuk varian keripik baru.',
    longTerm: 'Ekspansi jaringan konsinyasi ke 20 toko pusat oleh-oleh se-Malang Raya.'
  },
  breakthrough: {
    recent: 'Uji coba produk turunan cuka apel fermentasi organik premium.',
    midTerm: 'Membuka kanal ekspor B2B ke pasar diaspora di Malaysia & Singapura.',
    longTerm: 'Membangun wisata edukasi petik & olah apel terintegrasi di Kota Batu.'
  }
};

const INITIAL_SAMPLE_TASKS: StrategicCanvasTask[] = [
  {
    id: 'TASK-2026-001',
    namaUsaha: 'Kripik Apel Batu Mandiri',
    namaPemilik: 'Budi Santoso',
    subsektor: 'Kuliner',
    whatsapp: '081234567890',
    email: 'budi.apel@gmail.com',
    sesiPartnerUp: 'Sesi 2',
    visi: 'Menjadi produsen camilan olahan apel sehat dan higienis nomor satu di Jawa Timur pada tahun 2028.',
    misi: 'Mengolah apel petani lokal Kota Batu menjadi produk olahan bernilai tambah tinggi yang aman dikonsumsi seluruh keluarga.',
    goal: 'Membangun ekosistem rantai pasok apel petani lokal dengan kapasitas produksi stabil 2 ton/bulan.',
    objective: 'Meningkatkan omzet bulanan sebesar 25% dalam 90 hari melalui pembukaan 5 mitra reseller dan standarisasi izin edar BPOM.',
    nilaiUsaha: 'Kearifan Lokal Petani, Kualitas Tanpa Pengawet, Kejujuran Rasa, Keberlanjutan Lingkungan.',
    keahlianOrganisasi: 'Formulasi resep penggorengan vakum (vacuum frying) suhu rendah, hubungan erat dengan paguyuban petani apel Bumiaji.',
    matriks: DEFAULT_INNOVATION_MATRIX,
    status: 'reviewed',
    nilai: 92,
    catatanKurator: 'Pondasi strategi sudah sangat solid! Visi dan misi terdefinisi tajam. Pada matriks breakthrough, pastikan uji lab cuka apel mulai disiapkan di bulan ke-2.',
    reviewedBy: 'Tim Kurator Gekrafs',
    reviewedAt: '2026-09-30 14:15',
    createdAt: '2026-09-28 10:00',
    updatedAt: '2026-09-30 14:15'
  },
  {
    id: 'TASK-2026-002',
    namaUsaha: 'Batik Among Tani Creative',
    namaPemilik: 'Dewi Rahmawati',
    subsektor: 'Kriya & Fesyen',
    whatsapp: '082198765432',
    email: 'dewi.amongtani@gmail.com',
    sesiPartnerUp: 'Sesi 2',
    visi: 'Membawa motif batik khas flora & lanskap alam Kota Batu ke panggung fesyen etnik modern nusantara.',
    misi: 'Memproduksi kain dan busana batik pewarna alam ramah lingkungan serta memberdayakan ibu rumah tangga di desa wisata.',
    goal: 'Menjadikan motif apel & bunga anggrek Batu sebagai ikon cenderamata fesyen premium yang bernilai seni tinggi.',
    objective: 'Merilis koleksi busana etnik kasual bertema "Batu Heritage" dan menjual minimal 100 helai pakaian dalam 90 hari.',
    nilaiUsaha: 'Kelestarian Budaya, Ramah Lingkungan (Eco-friendly), Pemberdayaan Perempuan.',
    keahlianOrganisasi: 'Keahlian teknik canting cap malam dingin & pewarnaan alami dari limbah kulit pohon pinus dan daun mangga.',
    matriks: {
      problemSolving: {
        recent: 'Mengatasi kelunturan warna alam dengan formula fiksasi tawas & tunjung yang presisi.',
        midTerm: 'Mengurangi waktu proses pengeringan saat musim hujan dengan ruang solar dryer.',
        longTerm: 'Mengembangkan formula pewarna bubuk siap pakai yang tahan simpan 1 tahun.'
      },
      incremental: {
        recent: 'Membuat katalog digital busana kasual untuk katalog direktori PartnerUp.',
        midTerm: 'Mengadakan workshop membatik mini untuk tamu hotel & vila di Kota Batu.',
        longTerm: 'Membuka galeri butik mandiri di jalur wisata utama Sultan Agung Kota Batu.'
      },
      breakthrough: {
        recent: 'Kolaborasi desain motif eksklusif dengan ilustrator muda Kota Batu.',
        midTerm: 'Tampil di pameran fesyen etnik nasional (INACRAFT Jakarta).',
        longTerm: 'Mendapatkan sertifikasi Label Eko-Fesyen Internasional untuk pasar ekspor Jepang.'
      }
    },
    status: 'submitted',
    createdAt: '2026-10-01 09:30',
    updatedAt: '2026-10-01 09:30'
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
        this.tasks = JSON.parse(data);
      } else {
        this.tasks = INITIAL_SAMPLE_TASKS;
        this.saveToStorage();
      }
    } catch (e) {
      console.error('Failed to load tasks from storage:', e);
      this.tasks = INITIAL_SAMPLE_TASKS;
    }
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
      return newTask;
    }
  }

  submitTask(taskData: Partial<StrategicCanvasTask> & { namaUsaha: string; namaPemilik: string }): StrategicCanvasTask {
    const task = this.saveDraft(taskData);
    const existingIndex = this.tasks.findIndex(t => t.id === task.id);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (existingIndex >= 0) {
      this.tasks[existingIndex] = {
        ...this.tasks[existingIndex],
        status: 'submitted',
        updatedAt: now
      };
      this.saveToStorage();
      return this.tasks[existingIndex];
    }
    return task;
  }

  reviewTask(id: string, review: { nilai: number; catatanKurator: string; reviewerName: string; status?: 'reviewed' | 'revision' }): StrategicCanvasTask | null {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.tasks[index] = {
      ...this.tasks[index],
      nilai: review.nilai,
      catatanKurator: review.catatanKurator,
      reviewedBy: review.reviewerName || 'Tim Kurator Gekrafs',
      reviewedAt: now,
      status: review.status || 'reviewed',
      updatedAt: now
    };

    this.saveToStorage();
    return this.tasks[index];
  }

  deleteTask(id: string): boolean {
    const prevLen = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length !== prevLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

export const taskService = new TaskService();
