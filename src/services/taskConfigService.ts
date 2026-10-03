import { TaskModuleDef, TaskQuestionDef } from '../types';

const STORAGE_KEY = 'gkf_task_modules_config_v1';

export const DEFAULT_TASK_MODULES: TaskModuleDef[] = [
  {
    id: 'modul-1',
    nomorPelatihan: 1,
    judulModul: 'Pelatihan 1: Fondasi Strategi Bisnis',
    subJudul: 'Strategic Intent & Innovation Horizon Matrix 3x3',
    keterangan: 'Formulasikan arah masa depan usaha Anda melalui pendekatan Strategic Intent dan Innovation Horizon Matrix 3x3 sesuai bimbingan kurator resmi GEKRAFS Kota Batu.',
    aktif: true,
    includeMatrix3x3: true,
    tanggalDibuat: '2026-09-28',
    diperbaruiOleh: 'Lead Developer',
    pertanyaan: [
      {
        id: 'visi',
        kategori: 'Fondasi Arah Usaha (Strategic Intent)',
        label: 'Visi : Gambaran Masa Depan',
        petunjuk: 'Arah jangka panjang 3-5 tahun',
        placeholder: 'Contoh: Menjadi produsen camilan olahan apel sehat dan higienis nomor satu di Jawa Timur pada tahun 2028.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: 'misi',
        kategori: 'Fondasi Arah Usaha (Strategic Intent)',
        label: 'Misi : Apa yang Dilakukan & Kepada Siapa',
        petunjuk: 'Pemberian nilai tambah',
        placeholder: 'Contoh: Mengolah buah apel petani lokal Kota Batu menjadi produk bernilai tambah tinggi yang lezat, higienis, dan aman dikonsumsi seluruh keluarga.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: 'goal',
        kategori: 'Fondasi Arah Usaha (Strategic Intent)',
        label: 'Goal / Sasaran : Target yang Menentukan Arah',
        petunjuk: 'Arah capaian besar',
        placeholder: 'Contoh: Membangun ekosistem pasokan apel stabil 2 ton/bulan dan jaringan distribusi ke 20 toko oleh-oleh se-Malang Raya.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: 'objective',
        kategori: 'Fondasi Arah Usaha (Strategic Intent)',
        label: 'Objective : Target Eksekusi (SMART, 3 Bulan)',
        petunjuk: 'Target Konkret 90 Hari',
        placeholder: 'Contoh: Meningkatkan omzet sebesar 25% dalam 90 hari dengan membuka 5 mitra reseller baru dan meluncurkan kemasan baru bersertifikasi Halal.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: 'nilaiUsaha',
        kategori: 'Fondasi Arah Usaha (Strategic Intent)',
        label: 'Nilai-nilai dalam Usaha (Core Values)',
        petunjuk: 'Prinsip & etika kerja',
        placeholder: 'Contoh: Kemitraan Petani Lokal, Kualitas Tanpa Pengawet, Kejujuran Timbangan, Pelayanan Ramah & Amanah.',
        tipe: 'textarea',
        wajib: false
      },
      {
        id: 'keahlianOrganisasi',
        kategori: 'Kapasitas Organisasi & Keahlian',
        label: 'Keahlian Organisasi Saat Ini',
        petunjuk: 'Kekuatan dan kompetensi kunci yang sudah dimiliki tim Anda saat ini',
        placeholder: 'Contoh: Penguasaan teknik vacuum frying suhu rendah, jaringan paguyuban petani apel di Desa Tulungrejo, dan kemampuan produksi konten video TikTok harian.',
        tipe: 'textarea',
        wajib: false
      }
    ]
  }
];

class TaskConfigService {
  private modules: TaskModuleDef[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.modules = parsed;
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load task modules config:', e);
    }
    this.modules = DEFAULT_TASK_MODULES;
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.modules));
      window.dispatchEvent(new Event('gkf-task-config-updated'));
    } catch (e) {
      console.error('Failed to save task modules config:', e);
    }
  }

  public getModules(): TaskModuleDef[] {
    return [...this.modules];
  }

  public getModuleById(id: string): TaskModuleDef | undefined {
    return this.modules.find(m => m.id === id);
  }

  public getActiveModule(): TaskModuleDef {
    const active = this.modules.find(m => m.aktif);
    return active || this.modules[0] || DEFAULT_TASK_MODULES[0];
  }

  public setActiveModule(id: string): boolean {
    let found = false;
    this.modules = this.modules.map(m => {
      if (m.id === id) {
        found = true;
        return { ...m, aktif: true };
      }
      return { ...m, aktif: false };
    });
    if (found) {
      this.saveToStorage();
    }
    return found;
  }

  public saveModule(moduleData: TaskModuleDef): void {
    const index = this.modules.findIndex(m => m.id === moduleData.id);
    const now = new Date().toISOString().split('T')[0];
    const dataWithMeta = {
      ...moduleData,
      tanggalDibuat: moduleData.tanggalDibuat || now
    };

    if (index >= 0) {
      this.modules[index] = dataWithMeta;
    } else {
      this.modules.push(dataWithMeta);
    }

    if (dataWithMeta.aktif) {
      // Pastikan modul lain menjadi nonaktif jika ini aktif
      this.modules = this.modules.map(m => m.id === dataWithMeta.id ? m : { ...m, aktif: false });
    }

    this.saveToStorage();
  }

  public createModule(
    judulModul: string, 
    subJudul: string = '', 
    keterangan: string = '', 
    includeMatrix3x3: boolean = false,
    peranPengubah: string = 'Kurator / Developer'
  ): TaskModuleDef {
    const newNumber = this.modules.length + 1;
    const newId = `modul-${Date.now()}`;
    const newModule: TaskModuleDef = {
      id: newId,
      nomorPelatihan: newNumber,
      judulModul: judulModul.trim() || `Pelatihan ${newNumber}: Modul Baru`,
      subJudul: subJudul.trim() || 'Tugas & Lembar Aksi Peserta',
      keterangan: keterangan.trim() || 'Jawab pertanyaan tugas berikut sesuai arahan pemateri pelatihan.',
      aktif: false,
      includeMatrix3x3,
      tanggalDibuat: new Date().toISOString().split('T')[0],
      diperbaruiOleh: peranPengubah,
      pertanyaan: [
        {
          id: `q_${Date.now()}_1`,
          kategori: 'Tugas Utama',
          label: 'Pertanyaan 1',
          petunjuk: 'Jelaskan rencana aksi Anda secara rinci',
          placeholder: 'Tuliskan jawaban Anda di sini...',
          tipe: 'textarea',
          wajib: true
        }
      ]
    };

    this.modules.push(newModule);
    this.saveToStorage();
    return newModule;
  }

  public deleteModule(id: string): boolean {
    if (this.modules.length <= 1) {
      return false; // Jangan hapus modul terakhir
    }
    const prev = this.modules.length;
    this.modules = this.modules.filter(m => m.id !== id);
    if (this.modules.length < prev) {
      // Jika yang dihapus aktif, aktifkan modul pertama
      if (!this.modules.some(m => m.aktif)) {
        this.modules[0].aktif = true;
      }
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public addQuestion(moduleId: string, question: Omit<TaskQuestionDef, 'id'>): TaskQuestionDef | null {
    const target = this.modules.find(m => m.id === moduleId);
    if (!target) return null;

    const newQuestion: TaskQuestionDef = {
      ...question,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };

    target.pertanyaan.push(newQuestion);
    this.saveToStorage();
    return newQuestion;
  }

  public updateQuestion(moduleId: string, question: TaskQuestionDef): boolean {
    const target = this.modules.find(m => m.id === moduleId);
    if (!target) return false;

    const qIdx = target.pertanyaan.findIndex(q => q.id === question.id);
    if (qIdx === -1) return false;

    target.pertanyaan[qIdx] = question;
    this.saveToStorage();
    return true;
  }

  public deleteQuestion(moduleId: string, questionId: string): boolean {
    const target = this.modules.find(m => m.id === moduleId);
    if (!target) return false;

    target.pertanyaan = target.pertanyaan.filter(q => q.id !== questionId);
    this.saveToStorage();
    return true;
  }

  public resetToDefault(): void {
    this.modules = DEFAULT_TASK_MODULES;
    this.saveToStorage();
  }
}

export const taskConfigService = new TaskConfigService();
