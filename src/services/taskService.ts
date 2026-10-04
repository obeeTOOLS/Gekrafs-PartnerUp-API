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
  },
  {
    id: 'TASK-SUB-003',
    namaUsaha: 'Linara Craft',
    namaPemilik: 'Lilis Suryani',
    whatsapp: '085257324459',
    email: 'linaracraft.id@gmail.com',
    subsektor: 'Kriya / Kerajinan',
    sesiPartnerUp: 'Sesi 2',
    status: 'submitted',
    visi: 'Menjadi sentra kerajinan kriya tangan kreatif terkemuka di Kota Batu yang mengedepankan inovasi desain kustom dan edukasi workshop komunitas.',
    misi: 'Memproduksi aneka kerajinan tangan berkualitas tinggi sesuai kebutuhan pelanggan secara daring maupun luring serta membuka peluang kolaborasi pelatihan.',
    goal: 'Membangun jejaring pesanan kustom corporate/souvenir instansi secara berkala dan memperluas jangkauan pelatihan workshop.',
    objective: 'Meningkatkan omzet pesanan suvenir 30% dalam 90 hari dan menyelenggarakan minimal 3 workshop kriya berkolaborasi dengan kampus/komunitas.',
    nilaiUsaha: 'Kerapian Hasil Karya, Keterbukaan Kolaborasi, Ketepatan Waktu, Berbagi Ilmu.',
    keahlianOrganisasi: 'Keahlian teknik kriya tangan multi-material, pengalaman sebagai instruktur workshop Universitas Brawijaya, pelayanan pesanan custom.',
    matriks: {
      problemSolving: {
        recent: 'Standardisasi waktu pengerjaan untuk pesanan suvenir dalam jumlah besar.',
        midTerm: 'Penyusunan modul materi workshop kriya terstruktur untuk peserta pemula.',
        longTerm: 'Membangun studio workshop kerajinan permanen yang nyaman di Kota Batu.'
      },
      incremental: {
        recent: 'Peningkatan etalase video proses pembuatan produk di akun TikTok @nabiellaaccessories.',
        midTerm: 'Membuat paket bundle DIY kit kerajinan tangan siap pakai.',
        longTerm: 'Kerjasama rutin pengadaan cinderamata dengan dinas & hotel se-Malang Raya.'
      },
      breakthrough: {
        recent: 'Kolaborasi desain produk suvenir eksklusif bermotif ikonik Kota Batu.',
        midTerm: 'Pelatihan bersertifikat kriya kreatif bekerjasama dengan lembaga vokasi.',
        longTerm: 'Mendirikan galeri kriya kolaboratif untuk menampung karya pengrajin lokal.'
      }
    },
    createdAt: '2026-10-04 09:22:24',
    updatedAt: '2026-10-04 09:22:24'
  },
  {
    id: 'TASK-SUB-004',
    namaUsaha: 'The Apsara',
    namaPemilik: 'Ciciek Kemalasari',
    whatsapp: '085313855181',
    email: 'chicikemala@gmail.com',
    subsektor: 'Fashion',
    sesiPartnerUp: 'Sesi 2',
    status: 'submitted',
    visi: 'Menjadikan The Apsara sebagai brand fesyen lokal berkarakter kuat, anggun, dan bernilai estetika tinggi yang dicintai pecinta busana nusantara.',
    misi: 'Merancang busana dan produk fesyen berkualitas dengan potongan nyaman, material pilihan, dan sentuhan visual konten yang inspiratif.',
    goal: 'Memperkuat identitas brand di pasar digital dan memperluas distribusi penjualan ke butik-butik fesyen terpilih.',
    objective: 'Merilis koleksi busana tematik baru dan meningkatkan penjualan online 25% melalui optimalisasi konten visual dalam 90 hari.',
    nilaiUsaha: 'Kualitas Jahitan, Keanggunan Desain, Kejujuran Transaksi, Kepuasan Pelanggan.',
    keahlianOrganisasi: 'Desain pola busana modis, kreasi konten visual fesyen (storytelling & reels), komunikasi ramah dengan pelanggan setia.',
    matriks: {
      problemSolving: {
        recent: 'Menjaga konsistensi ketersediaan stok bahan kain motif khusus.',
        midTerm: 'Peningkatan kecepatan respon konsultasi ukuran dan pemesanan.',
        longTerm: 'Sistem manajemen inventori kain dan pakaian jadi berbasis digital.'
      },
      incremental: {
        recent: 'Peningkatan kualitas foto katalog dan lookbook koleksi fesyen.',
        midTerm: 'Menyediakan layanan konsultasi styling busana personal untuk pelanggan VIP.',
        longTerm: 'Membuka butik pamer (showroom) representatif di kawasan strategis Kota Batu.'
      },
      breakthrough: {
        recent: 'Kolaborasi koleksi busana fesyen terbatas (limited edition) dengan desainer lokal.',
        midTerm: 'Mengikuti pagelaran fesyen nasional (Fashion Week) untuk memperluas jangkauan brand.',
        longTerm: 'Ekspansi penjualan ke pasar mancanegara melalui platform e-commerce global.'
      }
    },
    createdAt: '2026-10-04 09:34:15',
    updatedAt: '2026-10-04 09:34:15'
  }
];

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
