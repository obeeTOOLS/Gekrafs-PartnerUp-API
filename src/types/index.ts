/**
 * Gekrafs PartnerUp - Type Definitions
 */

export type UserRole = 'developer' | 'admin' | 'peserta';

export type StatusKurasi =
  | 'Belum Direview'
  | 'Lolos Administrasi'
  | 'Lolos Wawancara'
  | 'Diterima'
  | 'Lolos Kurasi'
  | 'Menunggu Kurasi'
  | 'Ditolak';

export type AssessmentWindowStatus = 'open' | 'not_yet_open' | 'closed';

export interface PendaftaranFormData {
  namaUsaha: string;
  namaPemilik: string;
  subsektor: string;
  tahunBerdiri: string;
  nib: string;
  alamatUsaha: string;
  kotaKabupaten: string;
  omzet: string;
  whatsapp: string;
  email: string;
  instagram: string;
  tiktok: string;
  marketplace: string;
  ktpFile?: { filename: string; mimeType: string; base64: string } | null;
  nibFile?: { filename: string; mimeType: string; base64: string } | null;
  ktpUrl?: string;
  nibUrl?: string;
  deskripsi: string;
  laporanKeuangan: 'Ya' | 'Tidak';
  kolaborasi: 'Ya' | 'Tidak';
  ikutPelatihan: 'Ya' | 'Tidak';
  auditMedsos: 'Ya' | 'Tidak';
  picKonten: string;
  studiKasus: 'Ya' | 'Tidak';
  pernahIkutProgram: 'Ya' | 'Tidak';
  paktaIntegritas: 'Ya' | 'Tidak';
  sesiPartnerUp?: string;
  timestamp?: string;
}

export interface PesertaItem {
  row?: number;
  timestamp: string;
  namaUsaha: string;
  namaPemilik: string;
  subsektor: string;
  whatsapp: string;
  email: string;
  statusKurasi: StatusKurasi;
  catatanKurator: string;
  sesi: string;
  nib?: string;
  alamatUsaha?: string;
  kotaKabupaten?: string;
  omzet?: string;
  instagram?: string;
  tiktok?: string;
  marketplace?: string;
  deskripsi?: string;
  ktpUrl?: string;
  nibUrl?: string;
  fotoProdukUrl?: string;
  produkUnggulan?: string;
}

export interface TimelineItem {
  row?: number;
  urutan: number | string;
  tahapan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  keterangan: string;
}

export interface JadwalItem {
  row?: number;
  idSesi: string;
  tanggal: string;
  waktu: string;
  topik: string;
  pemateri: string;
  lokasi: string;
  catatan?: string;
  linkMateri?: string;
  notifikasiTerkirim?: string;
}

export interface KehadiranItem {
  id?: string;
  timestamp: string;
  idSesi: string;
  tanggalSesi: string;
  topikSesi: string;
  namaUsaha: string;
  whatsapp: string;
  sesiPartnerUp: string;
  metode: 'Self Check-in' | 'Manual Admin';
}

export interface QuestionAnswerDetail {
  pertanyaan: string;
  jawaban: string;
  skor: number;
}

export interface Bagian3CategoryDetail {
  kategori: string;
  skorRataRata: number;
  rincian: QuestionAnswerDetail[];
}

export interface AsesmenCriteriaDetail {
  kriteria: string;
  skor: number;
  catatan: string;
}

export interface AsesmenItem {
  row?: number;
  timestamp: string;
  namaUsaha: string;
  whatsapp: string;
  totalSkor: number;
  poinBisaAjarkan: string;
  materiBisaAjarkan: string;
  poinPerluDipelajari: string;
  sesi: string;
  kekuatan: string;
  kekuatanSkor: number;
  kelemahan: string;
  kelemahanSkor: number;
  rincian: AsesmenCriteriaDetail[];
  bagian3: { kategori: string; skorRataRata: number }[];
  bagian3Detail: Bagian3CategoryDetail[];
}

export interface Bagian3Question {
  teks: string;
  opsi: string[];
}

export interface Bagian3CategoryDef {
  kategori: string;
  pertanyaan: Bagian3Question[];
}

export interface DashboardStats {
  totalPendaftar: number;
  totalDiterima: number;
  totalDitolak: number;
  belumDireview: number;
  subsektor: { label: string; count: number }[];
  domisili: { label: string; count: number }[];
  statusKurasi: { label: string; count: number }[];
  persenIkutPelatihan: string;
  nextSession: { tanggal: string; waktu: string; topik: string; lokasi: string } | null;
  totalAsesmenSelesai: number;
  persenAsesmenSelesai: string;
}

export interface PetaKolaborasiPerson {
  namaUsaha: string;
  whatsapp: string;
  materi?: string;
}

export interface PetaKolaborasiCategory {
  kategori: string;
  bisaMengajar: PetaKolaborasiPerson[];
  perluBelajar: PetaKolaborasiPerson[];
}

export interface KelompokAnggota {
  namaUsaha: string;
  whatsapp: string;
  kategoriUnggulan: string;
  skorUnggulan: number;
}

export interface KelompokItem {
  nomor: number;
  anggota: KelompokAnggota[];
}

export interface AppSettings {
  sesiAktif: string;
  registrationDeadline: string;
  assessmentOpenDate: string;
  assessmentCloseDate: string;
  modeUjicoba: boolean;
  gasEndpointUrl: string;
  autoSync: boolean;
  passcode: string;
  // WhatsApp & Fonnte Gateway Cloud Persistent Settings
  fonnteToken?: string;
  pesertaGroupId?: string;
  pesertaGroupName?: string;
  panitiaGroupId?: string;
  panitiaGroupName?: string;
}

export interface MentoringLogItem {
  id: string;
  timestamp: string;
  namaUsaha: string;
  namaKurator: string;
  tanggal: string;
  topik: string;
  tantangan: string;
  rekomendasiAksi: string;
  tenggatWaktu: string;
  status: 'Dalam Progres' | 'Selesai' | 'Menunggu Verifikasi';
}

export interface LegalitasItem {
  id: string;
  namaUsaha: string;
  namaPemilik: string;
  subsektor: string;
  whatsapp: string;
  jenisLegalitas: 'NIB (OSS)' | 'Sertifikasi Halal' | 'P-IRT' | 'HKI Merek' | 'BPOM' | 'Badan Usaha (PT/CV)';
  statusPengajuan: 'Belum Diajukan' | 'Pemberkasan' | 'Proses Verifikasi' | 'Terbit';
  nomorIzin?: string;
  tanggalTerbit?: string;
  catatan?: string;
  dokumenUrl?: string;
}

export interface CertificateData {
  idSertifikat: string;
  namaPeserta: string;
  namaUsaha: string;
  subsektor: string;
  sesi: string;
  tanggalTerbit: string;
  nomorSertifikat: string;
  kehadiranPersen: number;
  skorAsesmen: number;
  statusKelulusan: 'Lulus dengan Pujian' | 'Lulus Terverifikasi';
}

export interface HorizonMatrixItem {
  recent: string;
  midTerm: string;
  longTerm: string;
}

export interface StrategicInnovationMatrix {
  problemSolving: HorizonMatrixItem;
  incremental: HorizonMatrixItem;
  breakthrough: HorizonMatrixItem;
}

export interface TaskQuestionDef {
  id: string;
  kategori?: string;
  label: string;
  petunjuk?: string;
  placeholder?: string;
  tipe: 'textarea' | 'text';
  wajib: boolean;
}

export interface TaskModuleDef {
  id: string;
  nomorPelatihan: number;
  judulModul: string;
  subJudul?: string;
  keterangan: string;
  aktif: boolean;
  includeMatrix3x3: boolean;
  pertanyaan: TaskQuestionDef[];
  tanggalDibuat?: string;
  diperbaruiOleh?: string;
}

export interface StrategicCanvasTask {
  id: string;
  pesertaId?: string;
  namaUsaha: string;
  namaPemilik: string;
  subsektor?: string;
  whatsapp: string;
  email?: string;
  sesiPartnerUp: string;
  moduleId?: string;
  jawabanDinamis?: Record<string, string>;
  
  // Sisi 1: Strategic Intent (Pondasi Arah Usaha)
  visi: string;
  misi: string;
  goal: string;
  objective: string;
  nilaiUsaha: string;
  
  // Sisi 2: Organizational Capability (Kapasitas Organisasi)
  keahlianOrganisasi: string;
  
  // Sisi 3: Pengembangan Keahlian & Inovasi (Matriks 3x3)
  matriks: StrategicInnovationMatrix;
  
  // Status & Penilaian Kurator
  status: 'draft' | 'submitted' | 'reviewed' | 'revision';
  nilai?: number;
  catatanKurator?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}
