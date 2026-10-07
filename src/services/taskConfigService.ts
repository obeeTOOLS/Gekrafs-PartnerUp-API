import { TaskModuleDef, TaskQuestionDef } from '../types';

const STORAGE_KEY = 'gkf_task_modules_config_v2';
const LEGACY_STORAGE_KEY = 'gkf_task_modules_config_v1';

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
  },
  {
    id: 'modul-2',
    nomorPelatihan: 2,
    judulModul: 'Pelatihan 2: The 1-Page Marketing Plan (1PMP)',
    subJudul: '9-Square Direct Response Marketing Canvas (Allan Dib)',
    keterangan: 'Rancang peta strategi pemasaran komprehensif 1 halaman berbasis metodologi Allan Dib: Menemukan target pasar, menyusun penawaran tak tertolak, menangkap prospek, hingga membangun sistem referal otomatis.',
    aktif: false,
    includeMatrix3x3: false,
    tanggalDibuat: '2026-10-06',
    diperbaruiOleh: 'Lead Developer & Kurator',
    pertanyaan: [
      {
        id: '1pmp_target_market',
        kategori: 'Fase 1: BEFORE (Calon Prospek / Prospect)',
        label: '1. Pasar Sasaran Spesifik (My Target Market)',
        petunjuk: 'Siapa niche pasar ideal Anda? Hindari "semua orang". Tentukan demografi, psikografi, dan problem utamanya.',
        placeholder: 'Contoh: Wisatawan keluarga & instansi dinas yang berkunjung ke Kota Batu dan membutuhkan cenderamata oleh-oleh sehat premium.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: '1pmp_message',
        kategori: 'Fase 1: BEFORE (Calon Prospek / Prospect)',
        label: '2. Pesan untuk Pasar Sasaran (My Message to Target Market)',
        petunjuk: 'Apa Unique Selling Proposition (USP) Anda? Mengapa mereka harus memilih produk Anda dibanding kompetitor?',
        placeholder: 'Contoh: Olahan apel murni tanpa pengawet dengan garansi rasa renyah asli perkebunan Bumiaji.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: '1pmp_media',
        kategori: 'Fase 1: BEFORE (Calon Prospek / Prospect)',
        label: '3. Media Penjangkauan (The Media I Will Use to Reach Them)',
        petunjuk: 'Kanal apa yang dipakai untuk menyampaikan pesan? (Media sosial, Google Maps SEO, brosur hotel, kolaborasi komunitas).',
        placeholder: 'Contoh: Konten video TikTok edukasi petik apel, titik Google Maps optimalisasi ulasan bintang 5, dan katalog WhatsApp Business.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: '1pmp_lead_capture',
        kategori: 'Fase 2: DURING (Calon Pembeli / Lead)',
        label: '4. Sistem Penangkapan Prospek (My Lead Capture System)',
        petunjuk: 'Bagaimana cara Anda mencatat kontak (WhatsApp/Email) mereka sebelum mereka memutuskan membeli?',
        placeholder: 'Contoh: Memberikan tester gratis dan voucher potongan Rp10.000 dengan menukar nomor WhatsApp di kasir atau link bio medsos.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: '1pmp_lead_nurturing',
        kategori: 'Fase 2: DURING (Calon Pembeli / Lead)',
        label: '5. Sistem Pemeliharaan Prospek (My Lead Nurturing System)',
        petunjuk: 'Bagaimana mengedukasi dan menjaga hubungan agar mereka percaya dan segera membeli? (Follow-up rutin, tips bermanfaat).',
        placeholder: 'Contoh: Broadcast WhatsApp mingguan berisi tips oleh-oleh tahan lama dan info promo seasonal akhir pekan.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: '1pmp_sales_conversion',
        kategori: 'Fase 2: DURING (Calon Pembeli / Lead)',
        label: '6. Strategi Konversi Penjualan (My Sales Conversion Strategy)',
        petunjuk: 'Bagaimana mengubah prospek menjadi pembeli pertama kali? (Penawaran tak tertolak / Irresistible offer, jaminan tanpa risiko).',
        placeholder: 'Contoh: Paket bundle 3 kotak gratis 1 botol sari apel dengan garansi 100% uang kembali jika kemasan bocor.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: '1pmp_delivering_experience',
        kategori: 'Fase 3: AFTER (Pelanggan & Fan Fanatik / Customer)',
        label: '7. Menghadirkan Pengalaman Kelas Dunia (Delivering a World-Class Experience)',
        petunjuk: 'Bagaimana memberikan efek "WOW" saat pelanggan menerima produk/layanan Anda?',
        placeholder: 'Contoh: Kemasan eksklusif dengan kartu ucapan terima kasih personal tulisan tangan dan bonus sampel varian baru.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: '1pmp_customer_lifetime_value',
        kategori: 'Fase 3: AFTER (Pelanggan & Fan Fanatik / Customer)',
        label: '8. Meningkatkan Nilai Seumur Hidup Pelanggan (Increasing Customer Lifetime Value)',
        petunjuk: 'Bagaimana membuat pelanggan membeli lagi dan lagi? (Upsell, cross-sell, program langganan berkala).',
        placeholder: 'Contoh: Pengingat kirim parcel lebaran otomatis untuk pelanggan korporat dan diskon VIP belanja ulang dalam 30 hari.',
        tipe: 'textarea',
        wajib: true
      },
      {
        id: '1pmp_orchestrating_referrals',
        kategori: 'Fase 3: AFTER (Pelanggan & Fan Fanatik / Customer)',
        label: '9. Mengorkestrasi & Memicu Referal (Orchestrating Referrals)',
        petunjuk: 'Bagaimana menciptakan sistem agar pelanggan aktif merekomendasikan usaha Anda ke teman/keluarga?',
        placeholder: 'Contoh: Program "Bawa Teman": pembeli mendapat voucher belanja gratis jika temannya berbelanja minimal Rp100.000 menggunakan kupon rekomendasinya.',
        tipe: 'textarea',
        wajib: true
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
      let data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        data = localStorage.getItem(LEGACY_STORAGE_KEY);
      }
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Selalu pastikan seluruh modul preset (modul-1 dan modul-2) ada di daftar
          DEFAULT_TASK_MODULES.forEach(defMod => {
            if (!parsed.some((p: TaskModuleDef) => p.id === defMod.id)) {
              parsed.push(defMod);
            }
          });
          this.modules = parsed;
          this.saveToStorage();
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load task modules config:', e);
    }
    this.modules = [...DEFAULT_TASK_MODULES];
    this.saveToStorage();
  }

  public ensureDefaultModules(): TaskModuleDef[] {
    let hasChange = false;
    DEFAULT_TASK_MODULES.forEach(defMod => {
      const exists = this.modules.some(m => m.id === defMod.id);
      if (!exists) {
        this.modules.push(defMod);
        hasChange = true;
      }
    });
    if (hasChange) {
      this.saveToStorage();
    }
    return [...this.modules];
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
