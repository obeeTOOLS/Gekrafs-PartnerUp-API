/**
 * Gekrafs PartnerUp - Type Definitions
 */

export type UserRole = 'developer' | 'admin' | 'peserta';

export type StatusKurasi =
  | 'Belum Direview'
  | 'Lolos Administrasi'
  | 'Lolos Wawancara'
  | 'Diterima'
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
}
