import { authService } from './authService';

export interface ActiveUserItem {
  id: string;
  userId: string;
  namaUsaha: string;
  namaPemilik: string;
  role: 'peserta' | 'admin' | 'developer';
  activeTab: string;
  deviceType: 'mobile' | 'desktop';
  lastSeen: number;
  loginTime: number;
}

export interface PresenceSummary {
  totalOnline: number;
  counts: {
    total: number;
    peserta: number;
    admin: number;
    developer: number;
  };
  users: ActiveUserItem[];
}

type PresenceListener = (summary: PresenceSummary) => void;

class PresenceService {
  private sessionId: string;
  private timer: any = null;
  private currentActiveTab: string = 'pendaftaran';
  private listeners: Set<PresenceListener> = new Set();
  private lastSummary: PresenceSummary = {
    totalOnline: 0,
    counts: { total: 0, peserta: 0, admin: 0, developer: 0 },
    users: []
  };

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initLifecycle();
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server_session';
    try {
      let sid = sessionStorage.getItem('gkf_presence_sid');
      if (!sid) {
        sid = 'sid_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
        sessionStorage.setItem('gkf_presence_sid', sid);
      }
      return sid;
    } catch {
      return 'sid_' + Math.random().toString(36).substring(2, 10);
    }
  }

  private initLifecycle() {
    if (typeof window === 'undefined') return;

    // Bersihkan sesi saat jendela ditutup
    window.addEventListener('beforeunload', () => {
      this.leave();
    });

    window.addEventListener('pagehide', () => {
      this.leave();
    });

    // Mulai polling heartbeat jika halaman aktif
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.ping(this.currentActiveTab);
      }
    });

    // Mulai polling otomatis tiap 25 detik
    this.startHeartbeat();
  }

  public startHeartbeat() {
    if (this.timer) clearInterval(this.timer);
    // Ping pertama langsung jalan
    this.ping(this.currentActiveTab);

    this.timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.ping(this.currentActiveTab);
      }
    }, 25000);
  }

  public stopHeartbeat() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Mengirim sinyal detak jantung (heartbeat) ke server
   */
  public async ping(activeTab?: string): Promise<PresenceSummary | null> {
    if (activeTab) {
      this.currentActiveTab = activeTab;
    }

    // Identifikasi apakah ada user yang sedang login
    const engineerSess = authService.getCurrentSession();
    const adminSess = authService.getAdminAuthSession();
    const pesertaSess = authService.getPesertaSession();

    if (!engineerSess && !adminSess && !pesertaSess) {
      // Belum login - hanya ambil data aktif tanpa mendaftarkan sebagai user login
      return this.fetchActivePresence();
    }

    let role: 'developer' | 'admin' | 'peserta' = 'peserta';
    let userId = 'anon';
    let namaUsaha = 'Peserta UMKM';
    let namaPemilik = '';

    if (engineerSess) {
      role = 'developer';
      userId = engineerSess.email;
      namaUsaha = 'Lead Developer';
      namaPemilik = engineerSess.name;
    } else if (adminSess) {
      role = 'admin';
      userId = adminSess.email;
      namaUsaha = 'Tim Kurator Gekrafs';
      namaPemilik = adminSess.nama || adminSess.email;
    } else if (pesertaSess) {
      role = 'peserta';
      userId = pesertaSess.whatsapp || pesertaSess.namaUsaha;
      namaUsaha = pesertaSess.namaUsaha;
      namaPemilik = pesertaSess.namaPemilik || pesertaSess.namaUsaha;
    }

    const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

    const payload = {
      id: this.sessionId,
      userId,
      namaUsaha,
      namaPemilik,
      role,
      activeTab: this.currentActiveTab,
      deviceType: isMobile ? 'mobile' : 'desktop'
    };

    try {
      await fetch('/api/presence/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return this.fetchActivePresence();
    } catch {
      return null;
    }
  }

  /**
   * Mengirim sinyal leave saat logout atau keluar
   */
  public leave() {
    if (typeof window === 'undefined') return;
    const payload = JSON.stringify({ id: this.sessionId });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/presence/leave', payload);
      } else {
        fetch('/api/presence/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    } catch {}
  }

  /**
   * Mengambil data seluruh pengguna aktif saat ini
   */
  public async fetchActivePresence(): Promise<PresenceSummary | null> {
    try {
      const res = await fetch('/api/presence/active');
      if (!res.ok) return null;
      const data: PresenceSummary = await res.json();
      this.lastSummary = data;
      this.notifyListeners(data);
      return data;
    } catch {
      return null;
    }
  }

  public getLastSummary(): PresenceSummary {
    return this.lastSummary;
  }

  public subscribe(listener: PresenceListener): () => void {
    this.listeners.add(listener);
    // Panggil langsung dengan data terakhir jika ada
    listener(this.lastSummary);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(summary: PresenceSummary) {
    this.listeners.forEach((fn) => {
      try {
        fn(summary);
      } catch {}
    });
  }
}

export const presenceService = new PresenceService();
