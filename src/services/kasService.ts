/**
 * Untungin — Kas Usaha Service (Hybrid Native untuk PartnerUp)
 * Ditenagai oleh logika arsitektur Untungin v1.3 (obeecreatives · Lalu Mahendra)
 * 
 * Fitur:
 * - Multi-tenant isolated storage per nama usaha (Zero Leak across participants)
 * - Multi-akun kas (Kas Tunai, Rekening Bank, E-Wallet, dll.)
 * - Pencatatan Transaksi (Pendapatan, Pengeluaran, Transfer Antar Akun)
 * - Transfer antar akun memindahkan saldo tanpa dihitung sebagai omzet/beban
 * - Peringatan Saldo Minus
 * - Kalkulasi Laba/Rugi, Rincian Pengeluaran, Arus Kas Sederhana
 * - Estimasi PPh Final UMKM 0,5% (PP 23/2018)
 */

import { gasService } from './gasService';

export interface KasAccount {
  id: string;
  namaUsaha: string;
  name: string;
  type: 'Kas' | 'Bank' | 'E-Wallet' | 'Lainnya';
  initialBalance: number;
}

export interface KasTransaction {
  id: string;
  namaUsaha: string;
  date: string; // YYYY-MM-DD
  type: 'income' | 'expense' | 'transfer';
  accountId: string;
  toAccountId?: string;
  category: string;
  desc: string;
  amount: number;
  createdBy: string;
  createdAt: string;
}

export interface KasCategories {
  income: string[];
  expense: string[];
}

export interface KasFinancialSummary {
  totalSaldo: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  pphFinalEstimasi: number;
  negativeAccounts: KasAccount[];
  transactionCount: number;
}

const STORAGE_PREFIX = 'gkf_untungin_kas_data_v1_';

export const REF_INCOME_CATEGORIES = [
  'Penjualan Produk',
  'Penjualan Jasa',
  'Pesanan B2B / Katering',
  'Pendapatan Lain-lain'
];

export const REF_EXPENSE_CATEGORIES = [
  'Pembelian Stok/Bahan Baku',
  'Kemasan & Packaging',
  'Gaji & Upah Karyawan',
  'Ambil Gaji Pemilik (Prive)',
  'Sewa Tempat Usaha',
  'Listrik, Air & Internet',
  'Transportasi & Pengiriman',
  'Marketing & Promosi',
  'Perlengkapan & ATK',
  'Perawatan & Perbaikan',
  'Pajak & Perizinan',
  'Biaya Administrasi Bank',
  'Pengeluaran Lain-lain'
];

export const REF_DEFAULT_ACCOUNTS = [
  { name: 'Kas Tunai Toko', type: 'Kas' as const, initialBalance: 0 },
  { name: 'Rekening Bank Usaha', type: 'Bank' as const, initialBalance: 0 },
  { name: 'E-Wallet (QRIS / OVO / GoPay)', type: 'E-Wallet' as const, initialBalance: 0 }
];

export const TARIF_PPH_FINAL_UMKM = 0.005; // 0,5% sesuai PP 23 Tahun 2018
export const BATAS_OMZET_PP23 = 4800000000; // Rp 4,8 miliar/tahun
export const DEFAULT_KAS_PIN = '123456'; // Default PIN pengaman buku kas bagi UMKM
export const DEFAULT_ENGINEER_PIN = 'obeecreatives2026#*'; // PIN Terkunci Bawaan Khusus Developer & Engineer Full Akses

export interface KasPinData {
  namaUsaha: string;
  pin: string;
  isDefaultPin: boolean;
  lastUpdated?: string;
  updatedBy?: string;
}

const STORAGE_PIN_PREFIX = 'gkf_untungin_pin_v1_';

class KasService {
  private getStorageKey(namaUsaha: string): string {
    const clean = (namaUsaha || 'default').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `${STORAGE_PREFIX}${clean}`;
  }

  /**
   * Mengambil data kas lengkap milik peserta tertentu
   */
  public getKasData(namaUsaha: string): {
    categories: KasCategories;
    accounts: KasAccount[];
    transactions: KasTransaction[];
  } {
    if (!namaUsaha) {
      return {
        categories: { income: [...REF_INCOME_CATEGORIES], expense: [...REF_EXPENSE_CATEGORIES] },
        accounts: [],
        transactions: []
      };
    }

    try {
      const key = this.getStorageKey(namaUsaha);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          categories: parsed.categories || { income: [...REF_INCOME_CATEGORIES], expense: [...REF_EXPENSE_CATEGORIES] },
          accounts: parsed.accounts || [],
          transactions: parsed.transactions || []
        };
      }
    } catch (e) {
      console.error('[kasService] Error reading kas data', e);
    }

    // Default template awal bagi peserta baru
    const initialAccounts: KasAccount[] = REF_DEFAULT_ACCOUNTS.map((a, idx) => ({
      id: `acc_${Date.now()}_${idx}`,
      namaUsaha,
      name: a.name,
      type: a.type,
      initialBalance: 0
    }));

    const initialData = {
      categories: { income: [...REF_INCOME_CATEGORIES], expense: [...REF_EXPENSE_CATEGORIES] },
      accounts: initialAccounts,
      transactions: []
    };

    this.saveKasData(namaUsaha, initialData.categories, initialData.accounts, initialData.transactions);
    return initialData;
  }

  /**
   * Menyimpan data kas peserta ke storage lokal terisolasi
   */
  public saveKasData(
    namaUsaha: string,
    categories: KasCategories,
    accounts: KasAccount[],
    transactions: KasTransaction[]
  ): void {
    if (!namaUsaha) return;
    try {
      const key = this.getStorageKey(namaUsaha);
      localStorage.setItem(key, JSON.stringify({
        categories,
        accounts,
        transactions,
        updatedAt: new Date().toISOString()
      }));
      window.dispatchEvent(new CustomEvent('gkf-kas-updated', { detail: { namaUsaha } }));
    } catch (e) {
      console.error('[kasService] Error saving kas data', e);
    }
  }

  /**
   * Menghitung saldo berjalan untuk akun tertentu
   * Rumus Untungin v1.3:
   * Saldo = InitialBalance + (Pendapatan ke akun) - (Pengeluaran dari akun) - (Transfer Keluar) + (Transfer Masuk)
   */
  public calculateAccountBalance(
    account: KasAccount,
    transactions: KasTransaction[],
    asOfDate?: string
  ): number {
    let bal = Number(account.initialBalance) || 0;
    transactions.forEach(t => {
      if (asOfDate && t.date > asOfDate) return;

      if (t.type === 'transfer') {
        if (t.accountId === account.id) bal -= Number(t.amount) || 0;
        if (t.toAccountId === account.id) bal += Number(t.amount) || 0;
      } else if (t.accountId === account.id) {
        if (t.type === 'income') bal += Number(t.amount) || 0;
        else if (t.type === 'expense') bal -= Number(t.amount) || 0;
      }
    });
    return bal;
  }

  /**
   * Menghitung ringkasan finansial (omzet, pengeluaran, laba bersih, estimasi pajak)
   */
  public getSummary(
    namaUsaha: string,
    year?: string,
    month?: string
  ): KasFinancialSummary {
    const { accounts, transactions } = this.getKasData(namaUsaha);

    let filtered = transactions;
    if (year) {
      filtered = filtered.filter(t => t.date.startsWith(year));
      if (month && month !== 'all') {
        const ym = `${year}-${month.padStart(2, '0')}`;
        filtered = filtered.filter(t => t.date.startsWith(ym));
      }
    }

    const totalIncome = filtered
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const totalExpense = filtered
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const netProfit = totalIncome - totalExpense;
    const pphFinalEstimasi = totalIncome * TARIF_PPH_FINAL_UMKM;

    const totalSaldo = accounts.reduce(
      (sum, acc) => sum + this.calculateAccountBalance(acc, transactions),
      0
    );

    const negativeAccounts = accounts.filter(
      acc => this.calculateAccountBalance(acc, transactions) < 0
    );

    return {
      totalSaldo,
      totalIncome,
      totalExpense,
      netProfit,
      pphFinalEstimasi,
      negativeAccounts,
      transactionCount: filtered.length
    };
  }

  /**
   * Menambah transaksi baru (income, expense, transfer)
   */
  public addTransaction(
    namaUsaha: string,
    tx: Omit<KasTransaction, 'id' | 'createdAt' | 'namaUsaha'>
  ): KasTransaction {
    const { categories, accounts, transactions } = this.getKasData(namaUsaha);
    const newTx: KasTransaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      namaUsaha,
      createdAt: new Date().toISOString()
    };

    const updated = [newTx, ...transactions];
    this.saveKasData(namaUsaha, categories, accounts, updated);

    // Kirim pembaruan ke Google Spreadsheet di background
    gasService.dispatchRemoteAction('saveKasTransaction', { transaction: newTx }).catch(err => {
      console.warn('[kasService] Cloud sync addTransaction error:', err);
    });

    return newTx;
  }

  /**
   * Mengedit transaksi yang sudah ada
   */
  public updateTransaction(
    namaUsaha: string,
    tx: KasTransaction
  ): boolean {
    const { categories, accounts, transactions } = this.getKasData(namaUsaha);
    const idx = transactions.findIndex(t => t.id === tx.id);
    if (idx === -1) return false;

    transactions[idx] = { ...tx, namaUsaha };
    this.saveKasData(namaUsaha, categories, accounts, transactions);

    // Kirim pembaruan ke Google Spreadsheet di background
    gasService.dispatchRemoteAction('saveKasTransaction', { transaction: transactions[idx] }).catch(err => {
      console.warn('[kasService] Cloud sync updateTransaction error:', err);
    });

    return true;
  }

  /**
   * Menghapus transaksi
   */
  public deleteTransaction(namaUsaha: string, txId: string): boolean {
    const { categories, accounts, transactions } = this.getKasData(namaUsaha);
    const updated = transactions.filter(t => t.id !== txId);
    if (updated.length === transactions.length) return false;

    this.saveKasData(namaUsaha, categories, accounts, updated);

    // Hapus dari Google Spreadsheet di background
    gasService.dispatchRemoteAction('deleteKasTransaction', { id: txId, namaUsaha }).catch(err => {
      console.warn('[kasService] Cloud sync deleteTransaction error:', err);
    });

    return true;
  }

  /**
   * Menambah akun baru
   */
  public addAccount(namaUsaha: string, name: string, type: KasAccount['type'], initialBalance: number): KasAccount {
    const { categories, accounts, transactions } = this.getKasData(namaUsaha);
    const newAcc: KasAccount = {
      id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      namaUsaha,
      name: name.trim(),
      type,
      initialBalance: Number(initialBalance) || 0
    };
    accounts.push(newAcc);
    this.saveKasData(namaUsaha, categories, accounts, transactions);

    // Sinkronkan akun ke Google Spreadsheet di background
    gasService.dispatchRemoteAction('saveKasAccounts', { namaUsaha, accounts }).catch(err => {
      console.warn('[kasService] Cloud sync saveKasAccounts error:', err);
    });

    return newAcc;
  }

  /**
   * Menghapus akun (hanya jika belum memiliki transaksi)
   */
  public deleteAccount(namaUsaha: string, accId: string): boolean {
    const { categories, accounts, transactions } = this.getKasData(namaUsaha);
    const hasTx = transactions.some(t => t.accountId === accId || t.toAccountId === accId);
    if (hasTx) return false; // Dilarang menghapus akun yang memiliki riwayat

    const updated = accounts.filter(a => a.id !== accId);
    this.saveKasData(namaUsaha, categories, updated, transactions);

    // Sinkronkan akun ke Google Spreadsheet di background
    gasService.dispatchRemoteAction('saveKasAccounts', { namaUsaha, accounts: updated }).catch(err => {
      console.warn('[kasService] Cloud sync deleteAccount error:', err);
    });

    return true;
  }

  /**
   * Sinkronisasi data kas antara penyimpanan lokal dan Google Spreadsheet
   */
  public async syncKasFromCloud(namaUsaha: string): Promise<{ success: boolean; message: string; count?: number }> {
    if (!namaUsaha) return { success: false, message: 'Nama Usaha kosong' };

    try {
      const response = await gasService.dispatchRemoteAction('getKasData', { namaUsaha });
      if (!response || response.status !== 'success') {
        return { success: false, message: 'Gagal menghubungi Google Apps Script atau offline' };
      }

      const cloudTxs: KasTransaction[] = Array.isArray(response.data) ? response.data : [];
      const current = this.getKasData(namaUsaha);
      const localTxs = current.transactions;

      const txMap = new Map<string, KasTransaction>();
      
      // Masukkan cloud transactions
      cloudTxs.forEach(t => {
        if (t && t.id) txMap.set(t.id, t);
      });

      // Transaksi lokal yang belum ada di cloud
      const unsyncedLocal: KasTransaction[] = [];
      localTxs.forEach(t => {
        if (t && t.id) {
          if (!txMap.has(t.id)) {
            txMap.set(t.id, t);
            unsyncedLocal.push(t);
          }
        }
      });

      const mergedTransactions = Array.from(txMap.values()).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      // Sinkronkan akun jika ada akun dari cloud
      let mergedAccounts = current.accounts;
      if (response.accounts && Array.isArray(response.accounts.accounts) && response.accounts.accounts.length > 0) {
        if (current.accounts.length <= 3 && current.transactions.length === 0) {
          mergedAccounts = response.accounts.accounts;
        }
      }

      // Simpan hasil gabungan ke local storage
      this.saveKasData(namaUsaha, current.categories, mergedAccounts, mergedTransactions);

      // Jika ada transaksi lokal yang belum ada di cloud, upload ke spreadsheet
      if (unsyncedLocal.length > 0) {
        gasService.dispatchRemoteAction('saveKasTransactionsBatch', {
          transactions: unsyncedLocal,
          namaUsaha
        }).catch(e => console.warn('[kasService] Upload batch local unsynced error:', e));
      }

      return {
        success: true,
        message: `Sinkronisasi berhasil! ${mergedTransactions.length} transaksi kas tersambung.`,
        count: mergedTransactions.length
      };
    } catch (e: any) {
      console.error('[kasService] syncKasFromCloud error:', e);
      return { success: false, message: e.message || 'Terjadi kesalahan sinkronisasi' };
    }
  }

  /* =========================================================================
     KEAMANAN & MANAJEMEN PIN BUKU KAS (MULTI-TENANT PER NAMA USAHA)
     ========================================================================= */

  private getPinStorageKey(namaUsaha: string): string {
    const clean = (namaUsaha || 'default').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `${STORAGE_PIN_PREFIX}${clean}`;
  }

  /**
   * Mengambil data PIN kas untuk unit usaha peserta
   */
  public getKasPin(namaUsaha: string): KasPinData {
    if (!namaUsaha) {
      return { namaUsaha: '', pin: DEFAULT_KAS_PIN, isDefaultPin: true };
    }

    try {
      const key = this.getPinStorageKey(namaUsaha);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.pin) {
          return {
            namaUsaha,
            pin: String(parsed.pin),
            isDefaultPin: parsed.isDefaultPin ?? (String(parsed.pin) === DEFAULT_KAS_PIN),
            lastUpdated: parsed.lastUpdated,
            updatedBy: parsed.updatedBy
          };
        }
      }
    } catch (e) {
      console.error('[kasService] Error reading PIN data', e);
    }

    // Default PIN: 123456 untuk UMKM biasa, obeecreatives2026#* untuk unit developer
    const isDevUnit = (namaUsaha || '').toLowerCase().trim() === 'obeecreatives';
    const defaultPinToUse = isDevUnit ? DEFAULT_ENGINEER_PIN : DEFAULT_KAS_PIN;

    return {
      namaUsaha,
      pin: defaultPinToUse,
      isDefaultPin: true
    };
  }

  /**
   * Memverifikasi PIN kas
   */
  public verifyKasPin(namaUsaha: string, inputPin: string): boolean {
    if (!namaUsaha || !inputPin) return false;
    const cleanInput = inputPin.trim();
    const pinData = this.getKasPin(namaUsaha);

    // Bypass master untuk Lead Developer & Core Engineer: obeecreatives2026#*
    if (cleanInput === DEFAULT_ENGINEER_PIN) return true;

    return pinData.pin === cleanInput;
  }

  /**
   * Mengganti PIN kas secara mandiri oleh Peserta
   */
  public changeKasPin(
    namaUsaha: string, 
    oldPin: string, 
    newPin: string
  ): { success: boolean; message: string } {
    if (!namaUsaha) {
      return { success: false, message: 'Nama Usaha tidak valid.' };
    }

    const cleanOld = oldPin.trim();
    const cleanNew = newPin.trim();

    if (!cleanNew || cleanNew.length < 4 || cleanNew.length > 24) {
      return { success: false, message: 'PIN baru harus terdiri dari 4 sampai 24 karakter/angka.' };
    }

    const currentPin = this.getKasPin(namaUsaha);
    if (currentPin.pin !== cleanOld && cleanOld !== DEFAULT_ENGINEER_PIN) {
      return { success: false, message: 'PIN lama yang Anda masukkan salah.' };
    }

    try {
      const key = this.getPinStorageKey(namaUsaha);
      const updatedData: KasPinData = {
        namaUsaha,
        pin: cleanNew,
        isDefaultPin: false,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'peserta'
      };
      localStorage.setItem(key, JSON.stringify(updatedData));
      return {
        success: true,
        message: 'PIN Buku Kas berhasil diperbarui! Simpan PIN ini baik-baik untuk membuka Buku Kas berikutnya.'
      };
    } catch (e) {
      return { success: false, message: 'Gagal menyimpan PIN baru ke memori browser.' };
    }
  }

  /**
   * Reset PIN kas oleh Developer / Engineer jika peserta lupa
   */
  public resetKasPin(
    namaUsaha: string, 
    newPin: string = DEFAULT_KAS_PIN, 
    performedBy: string = 'obeetools@gmail.com'
  ): { success: boolean; pinReset: string; message: string } {
    if (!namaUsaha) {
      return { success: false, pinReset: '', message: 'Nama Usaha tidak valid.' };
    }

    const cleanPin = newPin.trim() || DEFAULT_KAS_PIN;

    try {
      const key = this.getPinStorageKey(namaUsaha);
      const updatedData: KasPinData = {
        namaUsaha,
        pin: cleanPin,
        isDefaultPin: cleanPin === DEFAULT_KAS_PIN,
        lastUpdated: new Date().toISOString(),
        updatedBy: performedBy
      };
      localStorage.setItem(key, JSON.stringify(updatedData));
      return {
        success: true,
        pinReset: cleanPin,
        message: `PIN Buku Kas untuk "${namaUsaha}" berhasil di-reset menjadi "${cleanPin}". Beritahukan PIN ini kepada pemilik usaha.`
      };
    } catch (e) {
      return { success: false, pinReset: '', message: 'Gagal melakukan reset PIN di memori browser.' };
    }
  }
}

export const kasService = new KasService();
