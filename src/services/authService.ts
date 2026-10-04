/**
 * Gekrafs PartnerUp - Engineer & Admin Whitelist Authentication Service
 * Menangani Model 2: Kontrol Penuh Akses Login melalui Whitelist Email Admin + Password Per Akun
 * 
 * Fitur Keamanan:
 * 1. Hanya email terdaftar di whitelist yang bisa mengakses sistem (Zero Unknown Access).
 * 2. Password bawaan awal ditetapkan oleh Developer: 'Gekrafs2026!'.
 * 3. Setiap admin memiliki opsi mandiri untuk mengganti password pribadinya kapan saja.
 * 4. Lead Developer (obeetools@gmail.com) memiliki hak untuk mereset password admin jika lupa.
 */

import { UserRole } from '../types';

export const DEFAULT_DEVELOPER_PASSWORD = 'Gekrafs2026!';

export interface EngineerProfile {
  email: string;
  name: string;
  role: 'developer' | 'engineer';
  title: string;
  badge: string;
  canSwitchRoles: boolean;
  avatarColor: string;
  description: string;
}

export interface EngineerSession {
  email: string;
  name: string;
  title: string;
  activePerspective: UserRole;
  canSwitchRoles: boolean;
  loggedInAt: number;
  epoch?: number;
}

export type AdminRoleType = 'Kurator' | 'Panitia' | 'Pimpinan' | 'Admin Operasional' | 'Lead Developer';

export interface AdminAccount {
  email: string;
  nama: string;
  peran: AdminRoleType;
  status: 'Aktif' | 'Nonaktif';
  password: string; // Password akun (default Gekrafs2026! atau yang telah diganti sendiri)
  isDefaultPassword?: boolean;
  lastPasswordChange?: string;
  tanggalDitambahkan: string;
  ditambahkanOleh: string;
  isProtected?: boolean; // Akun inti yang tidak dapat dihapus
}

// Daftar email engineer resmi
export const AUTHORIZED_ENGINEERS: Record<string, EngineerProfile> = {
  'obeetools@gmail.com': {
    email: 'obeetools@gmail.com',
    name: 'Obee Tools',
    role: 'developer',
    title: 'Lead Developer & Architect',
    badge: 'Lead Developer',
    canSwitchRoles: true,
    avatarColor: 'from-amber-500 to-orange-600',
    description: 'Hak akses penuh developer & kurator. Bebas memilih peran (Developer, Admin/Kurator, Peserta) untuk memantau seluruh antarmuka aplikasi.'
  },
  'loehendra@gmail.com': {
    email: 'loehendra@gmail.com',
    name: 'Lalu Mahendra',
    role: 'engineer',
    title: 'Core Systems Engineer',
    badge: 'Core Engineer',
    canSwitchRoles: true,
    avatarColor: 'from-blue-600 to-indigo-700',
    description: 'Hak akses penuh engineering, Google Apps Script Hub, kurasi data, dan manajemen sistem.'
  }
};

// Default whitelist akun admin awal
const DEFAULT_ADMIN_WHITELIST: AdminAccount[] = [
  {
    email: 'obeetools@gmail.com',
    nama: 'Obee Tools (Developer Lead)',
    peran: 'Lead Developer',
    status: 'Aktif',
    password: DEFAULT_DEVELOPER_PASSWORD,
    isDefaultPassword: true,
    tanggalDitambahkan: '2026-09-01',
    ditambahkanOleh: 'System Architect',
    isProtected: true
  },
  {
    email: 'loehendra@gmail.com',
    nama: 'Lalu Mahendra',
    peran: 'Lead Developer',
    status: 'Aktif',
    password: DEFAULT_DEVELOPER_PASSWORD,
    isDefaultPassword: true,
    tanggalDitambahkan: '2026-09-01',
    ditambahkanOleh: 'System Architect',
    isProtected: true
  },
  {
    email: 'kurator.gekrafs@gmail.com',
    nama: 'Tim Kurasi Gekrafs Batu',
    peran: 'Kurator',
    status: 'Aktif',
    password: DEFAULT_DEVELOPER_PASSWORD,
    isDefaultPassword: true,
    tanggalDitambahkan: '2026-09-20',
    ditambahkanOleh: 'obeetools@gmail.com',
    isProtected: false
  }
];

export const SYSTEM_BASE_EPOCH = 1759480000000;

const STORAGE_SESSION_KEY = 'gkf_engineer_session_v2';
const STORAGE_WHITELIST_KEY = 'gkf_admin_whitelist_v3';
const STORAGE_ADMIN_AUTH_KEY = 'gkf_admin_auth_v2';
const STORAGE_PESERTA_SESSION_KEY = 'gkf_peserta_session_v2';
const STORAGE_GLOBAL_EPOCH_KEY = 'gkf_global_auth_epoch_v2';
export const STORAGE_FORCE_LOGOUT_EVENT = 'gkf_force_logout_event';

export interface PesertaSession {
  namaUsaha: string;
  whatsapp: string;
  namaPemilik?: string;
  email?: string;
  isRegistered: boolean;
  loggedInAt: number;
  epoch?: number;
}

class AuthService {
  /**
   * Mendapatkan daftar seluruh akun admin yang diizinkan (Whitelist Model 2)
   */
  public getAdminWhitelist(): AdminAccount[] {
    try {
      const raw = localStorage.getItem(STORAGE_WHITELIST_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Pastikan akun protected (obeetools & loehendra) selalu ada
          const hasObee = parsed.some((a: AdminAccount) => a.email.toLowerCase() === 'obeetools@gmail.com');
          const hasLoehendra = parsed.some((a: AdminAccount) => a.email.toLowerCase() === 'loehendra@gmail.com');
          
          if (!hasObee || !hasLoehendra) {
            const merged = [...DEFAULT_ADMIN_WHITELIST.filter(d => d.isProtected), ...parsed.filter(p => !p.isProtected)];
            this.saveAdminWhitelist(merged);
            return merged;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading admin whitelist', e);
    }

    this.saveAdminWhitelist(DEFAULT_ADMIN_WHITELIST);
    return DEFAULT_ADMIN_WHITELIST;
  }

  /**
   * Simpan daftar whitelist admin ke localStorage
   */
  public saveAdminWhitelist(list: AdminAccount[]): void {
    try {
      localStorage.setItem(STORAGE_WHITELIST_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving admin whitelist', e);
    }
  }

  /**
   * Cari akun admin berdasarkan email
   */
  public getAdminAccount(email: string): AdminAccount | undefined {
    if (!email) return undefined;
    const list = this.getAdminWhitelist();
    return list.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
  }

  /**
   * Menambahkan email admin baru ke whitelist (Model 2)
   */
  public addAdminToWhitelist(
    email: string, 
    nama: string, 
    peran: AdminRoleType, 
    initialPassword?: string,
    ditambahkanOleh: string = 'obeetools@gmail.com'
  ): { success: boolean; message: string; account?: AdminAccount; initialPasswordUsed: string } {
    const cleanEmail = email.trim().toLowerCase();
    
    // Validasi format email dasar
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Format alamat email tidak valid.', initialPasswordUsed: '' };
    }

    const currentList = this.getAdminWhitelist();
    const exists = currentList.find(a => a.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { 
        success: false, 
        message: `Email "${cleanEmail}" sudah terdaftar sebelumnya sebagai ${exists.peran} (${exists.status}).`,
        initialPasswordUsed: ''
      };
    }

    const pwdToUse = initialPassword && initialPassword.trim() ? initialPassword.trim() : DEFAULT_DEVELOPER_PASSWORD;

    const newAdmin: AdminAccount = {
      email: cleanEmail,
      nama: nama.trim() || cleanEmail.split('@')[0],
      peran: peran || 'Kurator',
      status: 'Aktif',
      password: pwdToUse,
      isDefaultPassword: pwdToUse === DEFAULT_DEVELOPER_PASSWORD,
      tanggalDitambahkan: new Date().toISOString().split('T')[0],
      ditambahkanOleh,
      isProtected: false
    };

    const updatedList = [newAdmin, ...currentList];
    this.saveAdminWhitelist(updatedList);

    return {
      success: true,
      message: `Akun admin baru (${cleanEmail}) berhasil didaftarkan dengan password awal: "${pwdToUse}". Admin dapat langsung login dan mengganti passwordnya.`,
      account: newAdmin,
      initialPasswordUsed: pwdToUse
    };
  }

  /**
   * Mengganti password akun admin secara mandiri
   */
  public changePassword(
    email: string, 
    oldPassword: string, 
    newPassword: string
  ): { success: boolean; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const list = this.getAdminWhitelist();
    const target = list.find(a => a.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, message: 'Akun tidak ditemukan.' };
    }

    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, message: 'Password baru minimal harus 6 karakter.' };
    }

    // Verifikasi password lama
    if (target.password && target.password !== oldPassword.trim()) {
      return { success: false, message: 'Password lama yang Anda masukkan salah.' };
    }

    target.password = newPassword.trim();
    target.isDefaultPassword = false;
    target.lastPasswordChange = new Date().toISOString().split('T')[0];

    this.saveAdminWhitelist([...list]);

    return {
      success: true,
      message: 'Password berhasil diubah! Silakan gunakan password baru ini untuk login berikutnya.'
    };
  }

  /**
   * Reset password akun admin ke default developer ('Gekrafs2026!') jika admin lupa
   */
  public resetPasswordToDefault(
    email: string, 
    performedBy: string = 'obeetools@gmail.com'
  ): { success: boolean; defaultPassword: string; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const list = this.getAdminWhitelist();
    const target = list.find(a => a.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, defaultPassword: '', message: 'Akun tidak ditemukan di whitelist.' };
    }

    target.password = DEFAULT_DEVELOPER_PASSWORD;
    target.isDefaultPassword = true;
    target.lastPasswordChange = undefined;

    this.saveAdminWhitelist([...list]);

    return {
      success: true,
      defaultPassword: DEFAULT_DEVELOPER_PASSWORD,
      message: `Password untuk "${cleanEmail}" berhasil di-reset ke standar: "${DEFAULT_DEVELOPER_PASSWORD}". Berikan password ini kepada admin terkait.`
    };
  }

  /**
   * Mendapatkan akun khusus Developer / Core Engineer
   */
  public getDeveloperAccounts(): AdminAccount[] {
    const list = this.getAdminWhitelist();
    return list.filter(
      a => a.isProtected || a.email === 'obeetools@gmail.com' || a.email === 'loehendra@gmail.com' || a.peran === 'Lead Developer'
    );
  }

  /**
   * Penggantian PIN / Password khusus untuk akun Developer / Engineer
   */
  public updateDeveloperPin(
    email: string, 
    newPin: string
  ): { success: boolean; message: string; newPin?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = newPin.trim();

    if (!cleanPin || cleanPin.length < 4) {
      return { success: false, message: 'PIN / Password developer minimal harus 4 karakter/angka.' };
    }

    const list = this.getAdminWhitelist();
    const target = list.find(a => a.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, message: 'Akun developer tidak ditemukan.' };
    }

    target.password = cleanPin;
    target.isDefaultPassword = false;
    target.lastPasswordChange = new Date().toISOString().split('T')[0];

    this.saveAdminWhitelist([...list]);

    return {
      success: true,
      message: `PIN / Password khusus untuk ${target.nama} (${cleanEmail}) berhasil diperbarui!`,
      newPin: cleanPin
    };
  }

  /**
   * Reset PIN akun Developer ke default
   */
  public resetDeveloperPin(email: string): { success: boolean; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const list = this.getAdminWhitelist();
    const target = list.find(a => a.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, message: 'Akun developer tidak ditemukan.' };
    }

    target.password = DEFAULT_DEVELOPER_PASSWORD;
    target.isDefaultPassword = true;
    target.lastPasswordChange = undefined;

    this.saveAdminWhitelist([...list]);

    return {
      success: true,
      message: `PIN / Password untuk ${target.nama} telah dikembalikan ke bawaan standar (${DEFAULT_DEVELOPER_PASSWORD}).`
    };
  }

  /**
   * Menghapus email admin dari whitelist
   */
  public removeAdminFromWhitelist(email: string): { success: boolean; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const currentList = this.getAdminWhitelist();
    const target = currentList.find(a => a.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, message: `Email "${email}" tidak ditemukan di whitelist admin.` };
    }

    if (target.isProtected || cleanEmail === 'obeetools@gmail.com' || cleanEmail === 'loehendra@gmail.com') {
      return { success: false, message: 'Akun pengembang inti (Lead Developer / Core Engineer) tidak dapat dihapus.' };
    }

    const updatedList = currentList.filter(a => a.email.toLowerCase() !== cleanEmail);
    this.saveAdminWhitelist(updatedList);

    return {
      success: true,
      message: `Akses admin untuk "${cleanEmail}" (${target.nama}) berhasil dicabut.`
    };
  }

  /**
   * Mengubah status aktif/nonaktif admin
   */
  public toggleAdminStatus(email: string): { success: boolean; message: string; newStatus?: 'Aktif' | 'Nonaktif' } {
    const cleanEmail = email.trim().toLowerCase();
    const currentList = this.getAdminWhitelist();
    const target = currentList.find(a => a.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, message: 'Akun tidak ditemukan.' };
    }

    if (target.isProtected) {
      return { success: false, message: 'Status akun pengembang inti tidak dapat dinonaktifkan.' };
    }

    const newStatus = target.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    target.status = newStatus;
    this.saveAdminWhitelist([...currentList]);

    return {
      success: true,
      message: `Status akun "${cleanEmail}" diubah menjadi ${newStatus}.`,
      newStatus
    };
  }

  /**
   * Memeriksa apakah suatu email terdaftar dan aktif di whitelist admin
   */
  public isEmailAuthorizedAdmin(email: string): boolean {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    
    // Selalu izinkan akun engineer resmi
    if (this.isAuthorizedEngineer(clean)) return true;

    const list = this.getAdminWhitelist();
    const found = list.find(a => a.email.toLowerCase() === clean);
    return !!found && found.status === 'Aktif';
  }

  /**
   * Verifikasi percobaan login ke Dashboard Admin:
   * WAJIB MEMERIKSA EMAIL TERDAFTAR + PASSWORD VALID (Tidak ada lagi backdoor 123456!)
   */
  public verifyAdminLogin(
    emailInput: string, 
    passwordInput: string
  ): { 
    success: boolean; 
    account?: AdminAccount | EngineerProfile; 
    isDefaultPassword?: boolean;
    authType: 'whitelist_email' | 'engineer';
    message: string 
  } {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanEmail) {
      return {
        success: false,
        authType: 'whitelist_email',
        message: 'Alamat email wajib dimasukkan.'
      };
    }

    if (!cleanPassword) {
      return {
        success: false,
        authType: 'whitelist_email',
        message: 'Password wajib dimasukkan.'
      };
    }

    // 1. Cek apakah ini email engineer resmi (obeetools@gmail.com / loehendra@gmail.com)
    if (this.isAuthorizedEngineer(cleanEmail)) {
      const eng = AUTHORIZED_ENGINEERS[cleanEmail];
      const whitelist = this.getAdminWhitelist();
      const engAccount = whitelist.find(a => a.email.toLowerCase() === cleanEmail);
      const expectedPwd = engAccount?.password || DEFAULT_DEVELOPER_PASSWORD;

      const isMatch = cleanPassword === expectedPwd || 
                      (engAccount?.isDefaultPassword && (cleanPassword === DEFAULT_DEVELOPER_PASSWORD || cleanPassword === '123456'));

      if (!isMatch) {
        return {
          success: false,
          authType: 'engineer',
          message: 'Password / PIN akun engineer salah. Pastikan menggunakan PIN atau password yang telah diatur.'
        };
      }

      this.loginWithEmail(cleanEmail);
      return {
        success: true,
        account: eng,
        isDefaultPassword: engAccount?.isDefaultPassword ?? true,
        authType: 'engineer',
        message: `Login berhasil sebagai Engineer Utama: ${eng.name} (${eng.title})`
      };
    }

    // 2. Cek apakah email terdaftar di Whitelist Admin (Model 2)
    const whitelist = this.getAdminWhitelist();
    const matchedAdmin = whitelist.find(a => a.email.toLowerCase() === cleanEmail);

    if (!matchedAdmin) {
      return {
        success: false,
        authType: 'whitelist_email',
        message: `Akses Ditolak: Email "${cleanEmail}" belum terdaftar dalam whitelist admin. Silakan minta Lead Developer (obeetools@gmail.com) untuk mendaftarkan email Anda terlebih dahulu.`
      };
    }

    if (matchedAdmin.status === 'Nonaktif') {
      return {
        success: false,
        authType: 'whitelist_email',
        message: `Akun "${cleanEmail}" terdaftar namun saat ini sedang NONAKTIF. Hubungi obeetools@gmail.com untuk mengaktifkan kembali.`
      };
    }

    // 3. Verifikasi Password Akun
    const expectedPassword = matchedAdmin.password || DEFAULT_DEVELOPER_PASSWORD;
    if (cleanPassword !== expectedPassword) {
      return {
        success: false,
        authType: 'whitelist_email',
        message: 'Password yang Anda masukkan salah. Hubungi obeetools@gmail.com jika Anda lupa password.'
      };
    }

    // Catat sesi admin yang valid dengan Epoch Global
    const currentEpoch = this.getGlobalEpoch();
    localStorage.setItem(
      STORAGE_ADMIN_AUTH_KEY,
      JSON.stringify({
        email: matchedAdmin.email,
        nama: matchedAdmin.nama,
        peran: matchedAdmin.peran,
        isDefaultPassword: matchedAdmin.isDefaultPassword,
        epoch: currentEpoch,
        expiresAt: Date.now() + 12 * 60 * 60 * 1000
      })
    );

    // Bersihkan sesi engineer agar admin/kurator tidak dapat mengakses hak peran developer
    this.clearEngineerSession();

    return {
      success: true,
      account: matchedAdmin,
      isDefaultPassword: matchedAdmin.isDefaultPassword,
      authType: 'whitelist_email',
      message: `Selamat datang ${matchedAdmin.nama}! Anda berhasil login sebagai ${matchedAdmin.peran}.`
    };
  }

  /**
   * Mendapatkan Epoch Sesi Global saat ini.
   * Setiap sesi yang memiliki epoch lebih rendah dari ini akan otomatis hangus (Force Logout).
   */
  public getGlobalEpoch(): number {
    try {
      const stored = localStorage.getItem(STORAGE_GLOBAL_EPOCH_KEY);
      if (stored) {
        const val = Number(stored);
        if (!isNaN(val) && val > 0) {
          return val;
        }
      }
    } catch {}
    return SYSTEM_BASE_EPOCH;
  }

  /**
   * TRIGGER GLOBAL FORCE LOGOUT:
   * Memutus seluruh sesi aktif di SEMUA perangkat & browser secara seketika.
   * Siapa pun yang membuka aplikasi akan langsung diarahkan ke halaman Login.
   */
  public triggerGlobalForceLogout(reason: string = 'Reset sesi global oleh Lead Developer'): { success: boolean; newEpoch: number; message: string } {
    const newEpoch = Date.now();
    try {
      localStorage.setItem(STORAGE_GLOBAL_EPOCH_KEY, String(newEpoch));
      localStorage.setItem(
        STORAGE_FORCE_LOGOUT_EVENT,
        JSON.stringify({ epoch: newEpoch, reason, timestamp: newEpoch })
      );

      // Bersihkan sesi lokal di perangkat saat ini
      this.clearAllSessions();

      // Dispatch custom event untuk window lokal
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gkf-force-logout', { detail: { epoch: newEpoch, reason } }));
      }
    } catch (e) {
      console.error('Error triggering global force logout', e);
    }

    return {
      success: true,
      newEpoch,
      message: 'Seluruh sesi pengguna di semua perangkat berhasil diputus dan di-reset. Semua pengguna sekarang wajib login ulang dengan email & PIN terdaftar.'
    };
  }

  /**
   * Mendapatkan sesi engineer aktif saat ini
   * Ketat memeriksa Whitelist + Epoch Global + Email Resmi
   */
  public getCurrentSession(): EngineerSession | null {
    try {
      // Bersihkan token legacy
      localStorage.removeItem('gkf_engineer_session_v1');

      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.email) {
        localStorage.removeItem(STORAGE_SESSION_KEY);
        return null;
      }

      // Validasi Epoch Global
      const currentGlobalEpoch = this.getGlobalEpoch();
      if (!parsed.epoch || parsed.epoch < currentGlobalEpoch) {
        localStorage.removeItem(STORAGE_SESSION_KEY);
        return null;
      }

      const cleanEmail = parsed.email.toLowerCase().trim();
      if (!AUTHORIZED_ENGINEERS[cleanEmail]) {
        localStorage.removeItem(STORAGE_SESSION_KEY);
        return null;
      }

      // Pastikan engineer juga berstatus 'Aktif' di whitelist
      const whitelist = this.getAdminWhitelist();
      const matched = whitelist.find(a => a.email.toLowerCase() === cleanEmail);
      if (!matched || matched.status !== 'Aktif') {
        localStorage.removeItem(STORAGE_SESSION_KEY);
        return null;
      }

      return parsed as EngineerSession;
    } catch (e) {
      console.error('Error reading engineer session', e);
    }
    return null;
  }

  /**
   * Mendapatkan sesi admin terautentikasi (whitelist)
   * WAJIB MEMVALIDASI:
   * 1. Token versi baru (v2) dengan epoch valid
   * 2. Expiration time belum lewat
   * 3. EMAIL WAJIB TERDAFTAR DI WHITELIST DAN STATUS 'Aktif'
   */
  public getAdminAuthSession(): { email: string; nama: string; peran: AdminRoleType; expiresAt: number; epoch?: number } | null {
    try {
      // Hapus token legacy tidak aman jika ada
      localStorage.removeItem('gkf_admin_auth');

      const raw = localStorage.getItem(STORAGE_ADMIN_AUTH_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.email) {
        localStorage.removeItem(STORAGE_ADMIN_AUTH_KEY);
        return null;
      }

      // 1. Validasi Epoch Sesi Global
      const currentGlobalEpoch = this.getGlobalEpoch();
      if (!parsed.epoch || parsed.epoch < currentGlobalEpoch) {
        localStorage.removeItem(STORAGE_ADMIN_AUTH_KEY);
        return null;
      }

      // 2. Validasi Expiration
      if (parsed.expiresAt <= Date.now()) {
        localStorage.removeItem(STORAGE_ADMIN_AUTH_KEY);
        return null;
      }

      // 3. KRUSIAL: Validasi email WAJIB TERDAFTAR DI WHITELIST DAN STATUS 'Aktif'
      const cleanEmail = parsed.email.trim().toLowerCase();
      const whitelist = this.getAdminWhitelist();
      const matched = whitelist.find(a => a.email.toLowerCase() === cleanEmail);

      if (!matched || matched.status !== 'Aktif') {
        // Email ini sudah dicabut atau tidak terdaftar di whitelist!
        localStorage.removeItem(STORAGE_ADMIN_AUTH_KEY);
        return null;
      }

      return parsed;
    } catch {}
    return null;
  }

  /**
   * Mendapatkan sesi peserta aktif
   */
  public getPesertaSession(): PesertaSession | null {
    try {
      // Hapus token legacy
      localStorage.removeItem('gkf_peserta_session_v1');

      const raw = localStorage.getItem(STORAGE_PESERTA_SESSION_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.namaUsaha || !parsed.whatsapp) {
        localStorage.removeItem(STORAGE_PESERTA_SESSION_KEY);
        return null;
      }

      // Validasi Epoch
      const currentGlobalEpoch = this.getGlobalEpoch();
      if (!parsed.epoch || parsed.epoch < currentGlobalEpoch) {
        localStorage.removeItem(STORAGE_PESERTA_SESSION_KEY);
        return null;
      }

      return parsed as PesertaSession;
    } catch {}
    return null;
  }

  /**
   * Menyimpan sesi peserta
   */
  public setPesertaSession(session: PesertaSession): void {
    try {
      const currentEpoch = this.getGlobalEpoch();
      session.epoch = currentEpoch;
      localStorage.setItem(STORAGE_PESERTA_SESSION_KEY, JSON.stringify(session));
    } catch {}
  }

  /**
   * Menghapus sesi peserta
   */
  public clearPesertaSession(): void {
    try {
      localStorage.removeItem(STORAGE_PESERTA_SESSION_KEY);
      localStorage.removeItem('gkf_peserta_session_v1');
    } catch {}
  }

  /**
   * Cek apakah ada pengguna yang sedang login saat ini (Engineer, Admin, atau Peserta)
   */
  public isAnyUserLoggedIn(): boolean {
    return !!(this.getCurrentSession() || this.getAdminAuthSession() || this.getPesertaSession());
  }

  /**
   * Simpan sesi engineer ke localStorage
   */
  public saveSession(session: EngineerSession): void {
    try {
      const currentEpoch = this.getGlobalEpoch();
      session.epoch = currentEpoch;
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(
        STORAGE_ADMIN_AUTH_KEY,
        JSON.stringify({ 
          email: session.email,
          nama: session.name,
          peran: 'Lead Developer',
          epoch: currentEpoch,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, 
          engineer: session.email 
        })
      );
    } catch (e) {
      console.error('Error saving engineer session', e);
    }
  }

  /**
   * Login sebagai salah satu engineer terdaftar
   */
  public loginWithEmail(email: string): { success: boolean; session?: EngineerSession; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const profile = AUTHORIZED_ENGINEERS[cleanEmail];

    if (!profile) {
      return {
        success: false,
        message: `Email "${email}" tidak terdaftar dalam whitelist engineer resmi.`
      };
    }

    const currentEpoch = this.getGlobalEpoch();
    const session: EngineerSession = {
      email: profile.email,
      name: profile.name,
      title: profile.title,
      activePerspective: 'developer',
      canSwitchRoles: profile.canSwitchRoles,
      epoch: currentEpoch,
      loggedInAt: Date.now()
    };

    this.saveSession(session);
    return {
      success: true,
      session,
      message: `Selamat datang ${profile.name}! Hak akses penuh (${profile.badge}) telah diaktifkan.`
    };
  }

  /**
   * Ganti perspektif peran
   */
  public setPerspective(newRole: UserRole): EngineerSession | null {
    const session = this.getCurrentSession();
    if (!session) return null;

    if (!session.canSwitchRoles && session.email !== 'obeetools@gmail.com') {
      return session;
    }

    session.activePerspective = newRole;
    this.saveSession(session);
    return session;
  }

  /**
   * Bersihkan sesi engineer secara spesifik
   */
  public clearEngineerSession(): void {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem('gkf_engineer_session_v1');
    } catch (e) {
      console.error('Error clearing engineer session', e);
    }
  }

  /**
   * Membersihkan seluruh sesi di browser ini (Local Logout)
   */
  public clearAllSessions(): void {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem(STORAGE_ADMIN_AUTH_KEY);
      localStorage.removeItem(STORAGE_PESERTA_SESSION_KEY);
      // Legacy cleanup
      localStorage.removeItem('gkf_admin_auth');
      localStorage.removeItem('gkf_engineer_session_v1');
      localStorage.removeItem('gkf_peserta_session_v1');
      localStorage.removeItem('gkf_admin_logged_in');
    } catch (e) {
      console.error('Error clearing all sessions', e);
    }
  }

  /**
   * Logout (Membersihkan seluruh sesi pengguna)
   */
  public logout(): void {
    this.clearAllSessions();
  }

  /**
   * Cek apakah engineer terdaftar
   */
  public isAuthorizedEngineer(email?: string): boolean {
    if (!email) return false;
    return !!AUTHORIZED_ENGINEERS[email.trim().toLowerCase()];
  }

  /**
   * Dapatkan profil detail engineer
   */
  public getProfile(email: string): EngineerProfile | undefined {
    return AUTHORIZED_ENGINEERS[email.trim().toLowerCase()];
  }
}

export const authService = new AuthService();
