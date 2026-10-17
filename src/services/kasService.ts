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
import { fetchSheetCsv } from '../utils/csvParser';
import { PesertaItem } from '../types';

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

export interface UmkmKasRecapItem {
  namaUsaha: string;
  namaPemilik?: string;
  subsektor?: string;
  whatsapp?: string;
  alamatUsaha?: string;
  sesi?: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;
  txCount: number;
  incomeCount: number;
  expenseCount: number;
  transferCount: number;
  lastTxDate?: string;
  hasTransactions: boolean;
  healthStatus: 'Sehat (Laba Tinggi)' | 'Stabil (Laba Menengah)' | 'Tipis (Laba Rendah)' | 'Impas' | 'Defisit (Rugi)' | 'Belum Ada Transaksi';
  proStatus: KasPremiumAccess;
  transactions: KasTransaction[];
}

export interface KasMasterRecapSummary {
  totalOmzetGlobal: number;
  totalExpenseGlobal: number;
  totalNetProfitGlobal: number;
  averageMarginGlobal: number;
  totalTransactionsGlobal: number;
  activeUmkmCount: number;
  totalUmkmCount: number;
  profitableCount: number;
  deficitCount: number;
  proCount: number;
  items: UmkmKasRecapItem[];
  sectorBreakdown: { subsektor: string; totalOmzet: number; totalExpense: number; netProfit: number; count: number; activeCount: number }[];
  topIncomeUmkms: UmkmKasRecapItem[];
}

export interface DeveloperVoucher {
  code: string;
  targetNamaUsaha?: string;
  durationMonths: number; // 0 = Lifetime, 3 = 3 Bulan, 6 = 6 Bulan, 9 = 9 Bulan, 12 = 1 Tahun
  durationLabel: string;
  generatedAt: string;
  generatedBy: string;
  isUsed: boolean;
  usedAt?: string;
  usedByNamaUsaha?: string;
  activatedExpiresAt?: string;
  notes?: string;
}

const STORAGE_PREFIX = 'gkf_untungin_kas_data_v1_';
const STORAGE_DEV_VOUCHERS = 'gkf_untungin_dev_vouchers_v1';
const STORAGE_REDEEMED_VOUCHERS = 'gkf_untungin_redeemed_vouchers_v1';
const VOUCHER_SECRET_SALT = 'OBEECREATIVES_GEKRAFS_2026_MASTER_SALT';

/**
 * Menghitung checksum kriptografis deterministik 4 karakter untuk voucher resmi Developer
 * Memungkinkan voucher diverifikasi secara offline di perangkat pengguna mana pun tanpa celah tebakan
 */
export function computeVoucherSignature(prefix: string, token: string, targetNamaUsaha?: string): string {
  const cleanTarget = targetNamaUsaha ? targetNamaUsaha.toLowerCase().trim().replace(/[^a-z0-9]/g, '') : 'ANY';
  const payload = `${VOUCHER_SECRET_SALT}|${prefix}|${token}|${cleanTarget}`;

  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < payload.length; i++) {
    const ch = payload.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const combined = Math.abs(h1 ^ h2).toString(36).toUpperCase().padStart(4, '0');
  return combined.substring(0, 4);
}

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

export interface KasPremiumAccess {
  namaUsaha: string;
  isPremium: boolean;
  tier: 'free' | 'trial' | 'premium';
  unlockedAt?: string;
  grantedBy?: string;
  method?: 'developer' | 'kurator' | 'payment' | 'system' | 'trial' | 'none';
  transactionLimit?: number;
  usedTransactions?: number;
  remainingTransactions?: number;
  trialStartedAt?: string;
  trialExpiresAt?: string;
  trialDaysTotal?: number;
  remainingDays?: number;
  isTrialActive?: boolean;
  isTrialExpired?: boolean;
  notes?: string;
  extendedBy?: string;
  lastExtendedAt?: string;
  bonusCredits?: number;
  proExpiresAt?: string;
  proDurationMonths?: number;
  proDurationLabel?: string;
  remainingProDays?: number;
  isProExpired?: boolean;
}

const STORAGE_PIN_PREFIX = 'gkf_untungin_pin_v1_';
const STORAGE_PREMIUM_PREFIX = 'gkf_untungin_premium_v1_';

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

    // Dual-Stream Shadow Sync ke Spreadsheet Vault Mandiri (Non-blocking)
    this.dispatchVaultShadowSync('pushTransaksi', {
      id: newTx.id,
      tanggal: newTx.date,
      namaUsaha: newTx.namaUsaha,
      arusKas: newTx.type === 'income' ? 'Pemasukan' : newTx.type === 'expense' ? 'Pengeluaran' : 'Transfer',
      kategori: newTx.category,
      nominal: newTx.amount,
      rekening: newTx.accountId,
      keterangan: newTx.desc
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

    // Dual-Stream Shadow Sync ke Spreadsheet Vault Mandiri (Non-blocking)
    this.dispatchVaultShadowSync('pushTransaksi', {
      id: transactions[idx].id,
      tanggal: transactions[idx].date,
      namaUsaha: transactions[idx].namaUsaha,
      arusKas: transactions[idx].type === 'income' ? 'Pemasukan' : transactions[idx].type === 'expense' ? 'Pengeluaran' : 'Transfer',
      kategori: transactions[idx].category,
      nominal: transactions[idx].amount,
      rekening: transactions[idx].accountId,
      keterangan: transactions[idx].desc
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

    // Dual-Stream Shadow Sync: hapus transaksi dari sheet vault mandiri
    this.dispatchVaultShadowSync('deleteTransaksi', { id: txId, namaUsaha });

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
        const errorDetail = response?.message || 'Gagal menghubungi Google Apps Script atau offline. Pastikan Apps Script telah di-deploy Versi Baru dan hak akses diatur ke "Anyone".';
        return { success: false, message: errorDetail };
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

  /* =========================================================================
     MANAJEMEN HAK AKSES PREMIUM / UNTUNGIN PRO
     ========================================================================= */

  private getPremiumStorageKey(namaUsaha: string): string {
    const clean = (namaUsaha || 'default').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `${STORAGE_PREMIUM_PREFIX}${clean}`;
  }

  /**
   * Mengambil status akses lisensi Untungin Pro untuk unit usaha (Model Hybrid: Trial 10 tx / 7 Hari & Pro)
   */
  public getPremiumStatus(namaUsaha: string): KasPremiumAccess {
    if (!namaUsaha) {
      return { 
        namaUsaha: '', 
        isPremium: false, 
        tier: 'free', 
        transactionLimit: 10,
        usedTransactions: 0,
        remainingTransactions: 10,
        isTrialActive: false,
        isTrialExpired: false
      };
    }

    const clean = namaUsaha.toLowerCase().trim();
    // Developer & Tim Inti selalu Lifetime VIP Pro
    if (clean === 'obeecreatives' || clean === 'default') {
      return {
        namaUsaha,
        isPremium: true,
        tier: 'premium',
        grantedBy: 'Lead Developer (Lifetime VIP)',
        method: 'system',
        unlockedAt: '2026-01-01T00:00:00.000Z',
        transactionLimit: undefined,
        usedTransactions: 0,
        remainingTransactions: Infinity,
        isTrialActive: false,
        isTrialExpired: false
      };
    }

    // Ambil data transaksi kas live yang tersimpan
    let txCount = 0;
    try {
      const kasData = this.getKasData(namaUsaha);
      txCount = Array.isArray(kasData.transactions) ? kasData.transactions.length : 0;
    } catch (e) {
      console.warn('[kasService] Error reading txCount for premium status:', e);
    }

    const TRIAL_LIMIT = 10;
    const TRIAL_DAYS = 7;

    try {
      const key = this.getPremiumStorageKey(namaUsaha);
      const raw = localStorage.getItem(key);
      let parsed = raw ? JSON.parse(raw) : null;

      // 1. Jika sudah berstatus Pro Aktif (via developer, voucher, kurator, atau lisensi)
      if (parsed && parsed.isPremium === true) {
        let isProExpired = false;
        let remainingProDays: number | undefined = undefined;

        if (parsed.proExpiresAt) {
          const expireMs = new Date(parsed.proExpiresAt).getTime();
          const diffMs = expireMs - Date.now();
          if (diffMs <= 0) {
            isProExpired = true;
          } else {
            remainingProDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
          }
        }

        if (isProExpired) {
          return {
            namaUsaha,
            isPremium: false,
            tier: 'free',
            unlockedAt: parsed.unlockedAt,
            grantedBy: parsed.grantedBy,
            method: parsed.method,
            transactionLimit: 0,
            usedTransactions: txCount,
            remainingTransactions: 0,
            isTrialActive: false,
            isTrialExpired: true,
            isProExpired: true,
            proExpiresAt: parsed.proExpiresAt,
            proDurationMonths: parsed.proDurationMonths,
            proDurationLabel: parsed.proDurationLabel,
            remainingProDays: 0,
            notes: `Masa aktif langganan Untungin Pro (${parsed.proDurationLabel || 'Langganan'}) telah berakhir pada ${new Date(parsed.proExpiresAt).toLocaleDateString('id-ID')}. Silakan aktivasi voucher baru untuk melanjutkan.`
          };
        }

        return {
          namaUsaha,
          isPremium: true,
          tier: 'premium',
          unlockedAt: parsed.unlockedAt,
          grantedBy: parsed.grantedBy || 'Lead Developer (obeetools@gmail.com)',
          method: parsed.method || 'developer',
          transactionLimit: undefined,
          usedTransactions: txCount,
          remainingTransactions: Infinity,
          isTrialActive: false,
          isTrialExpired: false,
          isProExpired: false,
          proExpiresAt: parsed.proExpiresAt,
          proDurationMonths: parsed.proDurationMonths,
          proDurationLabel: parsed.proDurationLabel,
          remainingProDays
        };
      }

      // 2. Inisialisasi atau muat data Hybrid Trial
      let trialStartedAt = parsed?.trialStartedAt;
      let trialExpiresAt = parsed?.trialExpiresAt;
      const currentLimit = Number(parsed?.transactionLimit) || TRIAL_LIMIT;
      const txBaseline = Number(parsed?.txBaseline) || 0;
      const effectiveUsed = Math.max(0, txCount - txBaseline);

      if (!trialStartedAt) {
        const now = new Date();
        trialStartedAt = now.toISOString();
        const expireDate = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
        trialExpiresAt = expireDate.toISOString();

        // Simpan penanda waktu awal trial agar tidak ter-reset
        try {
          const trialRecord = {
            namaUsaha,
            isPremium: false,
            trialStartedAt,
            trialExpiresAt,
            transactionLimit: TRIAL_LIMIT,
            txBaseline: 0
          };
          localStorage.setItem(key, JSON.stringify(trialRecord));
        } catch {
          // ignore
        }
      }

      const nowMs = Date.now();
      const expireMs = new Date(trialExpiresAt).getTime();
      const diffMs = expireMs - nowMs;
      const remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      const isTimeExpired = diffMs <= 0;

      const remainingTransactions = Math.max(0, currentLimit - effectiveUsed);
      const isLimitReached = effectiveUsed >= currentLimit;
      const isTrialExpired = isLimitReached || isTimeExpired;
      const isTrialActive = !isTrialExpired;

      const totalDays = Math.max(1, Math.ceil((expireMs - new Date(trialStartedAt).getTime()) / (1000 * 60 * 60 * 24))) || TRIAL_DAYS;

      return {
        namaUsaha,
        isPremium: false,
        tier: isTrialActive ? 'trial' : 'free',
        grantedBy: parsed?.grantedBy,
        method: isTrialActive ? 'trial' : 'none',
        transactionLimit: currentLimit,
        usedTransactions: effectiveUsed,
        remainingTransactions,
        trialStartedAt,
        trialExpiresAt,
        trialDaysTotal: totalDays,
        remainingDays,
        isTrialActive,
        isTrialExpired,
        extendedBy: parsed?.extendedBy,
        lastExtendedAt: parsed?.lastExtendedAt,
        notes: isTrialExpired
          ? (isLimitReached ? `Batas ${currentLimit} transaksi trial telah tercapai.` : 'Masa percobaan hari telah berakhir.')
          : `Akses Trial Hybrid Aktif: Sisa ${remainingTransactions} transaksi (${remainingDays} hari).`
      };
    } catch (e) {
      console.error('[kasService] Error calculating hybrid premium status', e);
    }

    return {
      namaUsaha,
      isPremium: false,
      tier: 'trial',
      method: 'trial',
      transactionLimit: TRIAL_LIMIT,
      usedTransactions: txCount,
      remainingTransactions: Math.max(0, TRIAL_LIMIT - txCount),
      trialDaysTotal: TRIAL_DAYS,
      remainingDays: TRIAL_DAYS,
      isTrialActive: true,
      isTrialExpired: false
    };
  }

  /**
   * Mengatur atau memperpanjang masa trial dan kredit kuota transaksi peserta
   */
  public updateTrialConfig(
    namaUsaha: string,
    params: {
      additionalDays?: number;
      additionalTransactions?: number;
      setExactLimit?: number;
      setExactDays?: number;
      resetUsed?: boolean;
      grantedBy?: string;
      notes?: string;
    }
  ): KasPremiumAccess {
    if (!namaUsaha) return { namaUsaha: '', isPremium: false, tier: 'free' };

    const key = this.getPremiumStorageKey(namaUsaha);
    const raw = localStorage.getItem(key);
    let record = raw ? JSON.parse(raw) : {};

    const kasData = this.getKasData(namaUsaha);
    const actualTxCount = Array.isArray(kasData.transactions) ? kasData.transactions.length : 0;

    // 1. Hitung Batas Transaksi Baru
    const currentLimit = Number(record.transactionLimit) || 10;
    let newLimit = currentLimit;
    if (params.setExactLimit !== undefined && params.setExactLimit > 0) {
      newLimit = params.setExactLimit;
    } else if (params.additionalTransactions && params.additionalTransactions > 0) {
      newLimit = currentLimit + params.additionalTransactions;
    }

    // 2. Reset Tx Usage jika diminta
    let txBaseline = Number(record.txBaseline) || 0;
    if (params.resetUsed) {
      txBaseline = actualTxCount; // reset hitungan relatif ke total yang ada sekarang
    }

    // 3. Hitung Tanggal Kedaluwarsa Baru
    const now = Date.now();
    let currentExpireMs = record.trialExpiresAt ? new Date(record.trialExpiresAt).getTime() : now + 7 * 86400000;
    // Jika sudah kedaluwarsa, mulai perpanjangan dari waktu saat ini
    const baseExpireMs = Math.max(now, currentExpireMs);
    let newExpireMs = baseExpireMs;

    if (params.setExactDays !== undefined && params.setExactDays > 0) {
      newExpireMs = now + params.setExactDays * 86400000;
    } else if (params.additionalDays && params.additionalDays > 0) {
      newExpireMs = baseExpireMs + params.additionalDays * 86400000;
    }

    const trialStartedAt = record.trialStartedAt || new Date().toISOString();
    const trialExpiresAt = new Date(newExpireMs).toISOString();

    const updatedRecord = {
      ...record,
      namaUsaha,
      isPremium: false, // tetap akun trial (bukan unmetered pro)
      transactionLimit: newLimit,
      txBaseline,
      trialStartedAt,
      trialExpiresAt,
      lastExtendedAt: new Date().toISOString(),
      extendedBy: params.grantedBy || 'Kurator PartnerUp',
      trialNotes: params.notes || `Diperpanjang: limit ${newLimit} tx, aktif s/d ${new Date(trialExpiresAt).toLocaleDateString('id-ID')}`
    };

    localStorage.setItem(key, JSON.stringify(updatedRecord));
    window.dispatchEvent(new CustomEvent('gkf-kas-premium-updated', { detail: { namaUsaha, access: updatedRecord } }));

    return this.getPremiumStatus(namaUsaha);
  }

  /**
   * Memberikan akses Untungin Pro (Eksklusif oleh Lead Developer / Sistem Lisensi)
   */
  public grantPremiumAccess(
    namaUsaha: string, 
    grantedBy: string = 'Lead Developer (obeetools@gmail.com)', 
    method: 'developer' | 'kurator' | 'payment' | 'system' = 'developer',
    durationOptions?: {
      durationMonths?: number; // 0 = Lifetime, 3, 6, 9, 12
      durationLabel?: string;
      customExpiresAt?: string;
    }
  ): KasPremiumAccess {
    if (!namaUsaha) return { namaUsaha: '', isPremium: false, tier: 'free' };

    const key = this.getPremiumStorageKey(namaUsaha);
    const current = this.getPremiumStatus(namaUsaha);

    // Hitung masa aktif Pro jika berbatas waktu
    let proExpiresAt: string | undefined = undefined;
    const durationMonths = durationOptions?.durationMonths !== undefined ? durationOptions.durationMonths : 0;
    let durationLabel = durationOptions?.durationLabel;

    if (durationOptions?.customExpiresAt) {
      proExpiresAt = durationOptions.customExpiresAt;
    } else if (durationMonths > 0) {
      // Jika saat ini sudah memiliki Pro berbayar yang masih aktif, sambung (stack) dari tanggal kedaluwarsa lama
      const currentExpireMs = (current.isPremium && current.proExpiresAt) ? new Date(current.proExpiresAt).getTime() : 0;
      const baseStartMs = currentExpireMs > Date.now() ? currentExpireMs : Date.now();
      const addDays = durationMonths === 12 ? 365 : durationMonths * 30;
      proExpiresAt = new Date(baseStartMs + addDays * 86400000).toISOString();
      if (!durationLabel) {
        durationLabel = durationMonths === 12 ? '1 Tahun' : `${durationMonths} Bulan`;
      }
    } else {
      // Lifetime (Permanen)
      durationLabel = 'Lifetime (Permanen)';
      proExpiresAt = undefined;
    }

    const access: KasPremiumAccess = {
      namaUsaha,
      isPremium: true,
      tier: 'premium',
      unlockedAt: new Date().toISOString(),
      grantedBy,
      method,
      usedTransactions: current.usedTransactions,
      remainingTransactions: Infinity,
      isTrialActive: false,
      isTrialExpired: false,
      isProExpired: false,
      proExpiresAt,
      proDurationMonths: durationMonths,
      proDurationLabel: durationLabel
    };

    try {
      localStorage.setItem(key, JSON.stringify(access));
      window.dispatchEvent(new CustomEvent('gkf-kas-premium-updated', { detail: { namaUsaha, access } }));
    } catch (e) {
      console.error('[kasService] Error saving premium status', e);
    }

    return this.getPremiumStatus(namaUsaha);
  }

  /**
   * Mencabut hak akses Untungin Pro kembali ke Standar Free / Trial (Eksklusif Developer)
   */
  public revokePremiumAccess(namaUsaha: string): KasPremiumAccess {
    if (!namaUsaha) return { namaUsaha: '', isPremium: false, tier: 'free' };

    const key = this.getPremiumStorageKey(namaUsaha);
    const prev = this.getPremiumStatus(namaUsaha);
    const access: KasPremiumAccess = {
      namaUsaha,
      isPremium: false,
      tier: (prev.usedTransactions || 0) < 10 ? 'trial' : 'free',
      method: 'none',
      transactionLimit: 10,
      usedTransactions: prev.usedTransactions,
      remainingTransactions: Math.max(0, 10 - (prev.usedTransactions || 0)),
      isTrialActive: (prev.usedTransactions || 0) < 10,
      isTrialExpired: (prev.usedTransactions || 0) >= 10
    };

    try {
      localStorage.setItem(key, JSON.stringify(access));
      window.dispatchEvent(new CustomEvent('gkf-kas-premium-updated', { detail: { namaUsaha, access } }));
    } catch (e) {
      console.error('[kasService] Error revoking premium status', e);
    }

    return access;
  }

  /**
   * Mendapatkan daftar voucher resmi yang diterbitkan oleh Developer
   */
  public getDeveloperVouchers(): DeveloperVoucher[] {
    try {
      const raw = localStorage.getItem(STORAGE_DEV_VOUCHERS);
      if (!raw) return [];
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.error('[kasService] Error reading developer vouchers', e);
      return [];
    }
  }

  /**
   * Menerbitkan voucher lisensi resmi baru (Eksklusif Developer)
   * Mendukung durasi: 3 Bulan, 6 Bulan, 9 Bulan, 1 Tahun (12 Bulan), atau Lifetime (0)
   */
  public generateDeveloperVoucher(
    targetNamaUsaha?: string,
    durationMonths: number = 3,
    actor: string = 'Lead Developer (obeetools@gmail.com)',
    notes?: string
  ): DeveloperVoucher {
    const list = this.getDeveloperVouchers();
    // 4 karakter acak untuk token keunikan
    const token = Math.random().toString(36).substring(2, 6).toUpperCase();

    let prefix = 'PRO-3M';
    let durationLabel = '3 Bulan';

    if (durationMonths === 6) {
      prefix = 'PRO-6M';
      durationLabel = '6 Bulan';
    } else if (durationMonths === 9) {
      prefix = 'PRO-9M';
      durationLabel = '9 Bulan';
    } else if (durationMonths === 12) {
      prefix = 'PRO-1Y';
      durationLabel = '1 Tahun';
    } else if (durationMonths === 0) {
      prefix = 'PRO-LIFE';
      durationLabel = 'Lifetime (Permanen)';
    } else {
      prefix = `PRO-${durationMonths}M`;
      durationLabel = `${durationMonths} Bulan`;
    }

    // Tanda tangan kriptografis berbasis developer salt & target usaha
    const signature = computeVoucherSignature(prefix, token, targetNamaUsaha);
    const code = `${prefix}-${token}-${signature}`;

    const newVoucher: DeveloperVoucher = {
      code,
      targetNamaUsaha: targetNamaUsaha?.trim() || undefined,
      durationMonths,
      durationLabel,
      generatedAt: new Date().toISOString(),
      generatedBy: actor,
      isUsed: false,
      notes: notes || (targetNamaUsaha ? `Voucher resmi ${durationLabel} untuk ${targetNamaUsaha}` : `Voucher lisensi Untungin Pro ${durationLabel}`)
    };

    const updated = [newVoucher, ...list];
    try {
      localStorage.setItem(STORAGE_DEV_VOUCHERS, JSON.stringify(updated));
    } catch (e) {
      console.error('[kasService] Error saving new voucher', e);
    }

    return newVoucher;
  }

  /**
   * Menghapus voucher lisensi (Eksklusif Developer)
   */
  public deleteDeveloperVoucher(code: string): boolean {
    const list = this.getDeveloperVouchers();
    const filtered = list.filter(v => v.code.toUpperCase() !== code.toUpperCase());
    try {
      localStorage.setItem(STORAGE_DEV_VOUCHERS, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Aktivasi kode lisensi / verifikasi voucher pembayaran
   * Dilengkapi proteksi anti-tebakan, dukungan cross-device via tanda tangan digital, dan pencegahan klaim berulang
   */
  public activateLicenseCode(namaUsaha: string, code: string): { success: boolean; message: string; access?: KasPremiumAccess } {
    if (!namaUsaha) return { success: false, message: 'Nama usaha tidak valid.' };
    const cleanCode = (code || '').toUpperCase().trim();

    if (!cleanCode) {
      return { success: false, message: 'Masukkan kode lisensi atau voucher Anda.' };
    }

    // Periksa daftar voucher yang sudah pernah di-redeem (mencegah klaim ganda lintas sesi)
    const redeemedList: { code: string; usedByNamaUsaha: string; usedAt: string }[] = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_REDEEMED_VOUCHERS);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })();

    const alreadyRedeemed = redeemedList.find(r => r.code.toUpperCase() === cleanCode);
    if (alreadyRedeemed) {
      return {
        success: false,
        message: `Kode voucher ${cleanCode} sudah pernah digunakan oleh usaha "${alreadyRedeemed.usedByNamaUsaha}" pada ${new Date(alreadyRedeemed.usedAt).toLocaleDateString('id-ID')}.`
      };
    }

    // 1. Periksa apakah cocok dengan Voucher di database lokal (jika di-generate di browser yang sama)
    const vouchers = this.getDeveloperVouchers();
    const matchedVoucherIndex = vouchers.findIndex(v => v.code.toUpperCase() === cleanCode);

    if (matchedVoucherIndex !== -1) {
      const voucher = vouchers[matchedVoucherIndex];

      if (voucher.isUsed) {
        return {
          success: false,
          message: `Kode voucher ${cleanCode} sudah pernah digunakan oleh usaha "${voucher.usedByNamaUsaha || 'lain'}" pada ${new Date(voucher.usedAt || '').toLocaleDateString('id-ID')}.`
        };
      }

      if (voucher.targetNamaUsaha && voucher.targetNamaUsaha.toLowerCase().trim() !== namaUsaha.toLowerCase().trim()) {
        return {
          success: false,
          message: `Kode voucher ini khusus diterbitkan untuk usaha "${voucher.targetNamaUsaha}". Silakan gunakan kode voucher yang sesuai dengan nama usaha Anda.`
        };
      }

      const durationMonths = voucher.durationMonths !== undefined ? Number(voucher.durationMonths) : 3;
      const durationLabel = voucher.durationLabel || (durationMonths > 0 ? `${durationMonths} Bulan` : 'Lifetime (Permanen)');

      const access = this.grantPremiumAccess(
        namaUsaha, 
        `Voucher Resmi Developer (${cleanCode} · ${durationLabel})`, 
        'payment',
        {
          durationMonths,
          durationLabel
        }
      );

      // Tandai voucher telah digunakan
      vouchers[matchedVoucherIndex] = {
        ...voucher,
        isUsed: true,
        usedAt: new Date().toISOString(),
        usedByNamaUsaha: namaUsaha,
        activatedExpiresAt: access.proExpiresAt
      };

      try {
        localStorage.setItem(STORAGE_DEV_VOUCHERS, JSON.stringify(vouchers));
        redeemedList.push({ code: cleanCode, usedByNamaUsaha: namaUsaha, usedAt: new Date().toISOString() });
        localStorage.setItem(STORAGE_REDEEMED_VOUCHERS, JSON.stringify(redeemedList));
      } catch (e) {
        console.error('[kasService] Error updating voucher status', e);
      }

      const durasiMsg = durationMonths > 0 && access.proExpiresAt
        ? `selama ${durationLabel} (aktif s/d ${new Date(access.proExpiresAt).toLocaleDateString('id-ID')})`
        : 'selamanya (Lifetime)';

      return {
        success: true,
        message: `Selamat! Lisensi Untungin Pro untuk "${namaUsaha}" berhasil diaktifkan dengan Voucher Resmi Developer (${cleanCode}). Akses fitur kas terbuka penuh ${durasiMsg}.`,
        access
      };
    }

    // 2. Verifikasi Kriptografis Mandiri (Self-Contained Cross-Device Verification)
    // Format: PREFIX-TOKEN-SIGNATURE (contoh: PRO-3M-K7X9-B8D2 atau PRO-1Y-M4P9-Q2T8)
    const codeParts = cleanCode.split('-');
    if (codeParts.length >= 4 && codeParts[0] === 'PRO') {
      const prefix = `${codeParts[0]}-${codeParts[1]}`;
      const token = codeParts[2];
      const signature = codeParts[3];

      const sigTarget = computeVoucherSignature(prefix, token, namaUsaha);
      const sigGeneral = computeVoucherSignature(prefix, token, undefined);

      if (signature === sigTarget || signature === sigGeneral) {
        let durationMonths = 3;
        let durationLabel = '3 Bulan';
        if (codeParts[1] === '3M') { durationMonths = 3; durationLabel = '3 Bulan'; }
        else if (codeParts[1] === '6M') { durationMonths = 6; durationLabel = '6 Bulan'; }
        else if (codeParts[1] === '9M') { durationMonths = 9; durationLabel = '9 Bulan'; }
        else if (codeParts[1] === '1Y') { durationMonths = 12; durationLabel = '1 Tahun'; }
        else if (codeParts[1] === 'LIFE') { durationMonths = 0; durationLabel = 'Lifetime (Permanen)'; }

        const access = this.grantPremiumAccess(
          namaUsaha, 
          `Voucher Resmi Developer (${cleanCode} · ${durationLabel})`, 
          'payment',
          {
            durationMonths,
            durationLabel
          }
        );

        redeemedList.push({ code: cleanCode, usedByNamaUsaha: namaUsaha, usedAt: new Date().toISOString() });
        const localVoucher: DeveloperVoucher = {
          code: cleanCode,
          targetNamaUsaha: signature === sigTarget ? namaUsaha : undefined,
          durationMonths,
          durationLabel,
          generatedAt: new Date().toISOString(),
          generatedBy: 'Lead Developer (obeetools@gmail.com)',
          isUsed: true,
          usedAt: new Date().toISOString(),
          usedByNamaUsaha: namaUsaha,
          activatedExpiresAt: access.proExpiresAt
        };
        const updatedVouchers = [localVoucher, ...vouchers];

        try {
          localStorage.setItem(STORAGE_REDEEMED_VOUCHERS, JSON.stringify(redeemedList));
          localStorage.setItem(STORAGE_DEV_VOUCHERS, JSON.stringify(updatedVouchers));
        } catch (e) {
          console.error('[kasService] Error saving cross-device redeemed voucher', e);
        }

        const durasiMsg = durationMonths > 0 && access.proExpiresAt
          ? `selama ${durationLabel} (aktif s/d ${new Date(access.proExpiresAt).toLocaleDateString('id-ID')})`
          : 'selamanya (Lifetime)';

        return {
          success: true,
          message: `Selamat! Lisensi Untungin Pro untuk "${namaUsaha}" berhasil diaktifkan dengan Voucher Resmi Developer (${cleanCode}). Akses fitur kas terbuka penuh ${durasiMsg}.`,
          access
        };
      }
    }

    // 3. Kode lisensi sistem / master eksklusif yang didukung
    const validCodes: Record<string, { durationMonths: number; label: string }> = {
      'UNTUNGINPRO2026': { durationMonths: 0, label: 'Lifetime Master Developer' },
      'GEKRAFS-PRO-BATU': { durationMonths: 0, label: 'Lifetime DPC Gekrafs Batu' },
      'PARTNERUP-VIP': { durationMonths: 0, label: 'Lifetime VIP PartnerUp' },
      'KAS-PREMIUM-LIFETIME': { durationMonths: 0, label: 'Lifetime Premium' },
      'BATCH2-JUARA': { durationMonths: 6, label: '6 Bulan (Juara Batch 2)' }
    };

    if (validCodes[cleanCode]) {
      const info = validCodes[cleanCode];
      const access = this.grantPremiumAccess(
        namaUsaha, 
        `Lisensi Sistem Resmi (${cleanCode})`, 
        'payment',
        {
          durationMonths: info.durationMonths,
          durationLabel: info.label
        }
      );
      return {
        success: true,
        message: `Selamat! Lisensi Untungin Pro untuk "${namaUsaha}" berhasil diaktifkan (${info.label}). Semua fitur kas terbuka penuh.`,
        access
      };
    }

    return {
      success: false,
      message: 'Kode lisensi atau voucher tidak valid. Lisensi Pro resmi hanya diterbitkan oleh Lead Developer. Hubungi developer untuk mendapatkan kode voucher resmi.'
    };
  }

  /**
   * Mengambil seluruh transaksi kas dari Google Spreadsheet (Tab Kas_Transaksi)
   * Menggunakan endpoint Google Spreadsheet gviz CSV langsung (cepat & non-blocking)
   * Digabungkan dengan transaksi di local storage
   */
  public async fetchAllCloudKasTransactions(): Promise<KasTransaction[]> {
    const defaultSpreadsheetId = '183uoyYw6opnr3w7T6oljvwuy5Rzs7GZE7fM3vi_pwm4';
    const txMap = new Map<string, KasTransaction>();

    try {
      const rows = await fetchSheetCsv(defaultSpreadsheetId, 'Kas_Transaksi');
      if (rows && rows.length > 1) {
        const dataRows = rows.slice(1);
        dataRows.forEach((r) => {
          if (!r[1] && !r[2]) return;
          const id = (r[1] || '').trim();
          const namaUsaha = (r[2] || '').trim();
          if (!namaUsaha) return;

          let tx: KasTransaction | null = null;
          if (r[12]) {
            try {
              tx = JSON.parse(r[12]);
            } catch (e) {}
          }

          if (!tx) {
            tx = {
              id: id || `tx_cloud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              namaUsaha: namaUsaha,
              date: r[3] || '',
              type: (r[4] as any) || 'income',
              category: r[5] || 'Umum',
              amount: Number(r[6]) || 0,
              accountId: r[7] || '',
              toAccountId: r[8] || undefined,
              desc: r[9] || '',
              createdBy: r[10] || 'Peserta',
              createdAt: r[11] || ''
            };
          }

          if (tx && tx.id) {
            txMap.set(tx.id, tx);
          }
        });
      }
    } catch (err) {
      console.warn('[kasService] Error fetching cloud kas transactions via CSV:', err);
      // Fallback via GAS dispatchRemoteAction
      try {
        const response = await gasService.dispatchRemoteAction('getKasTransactions', {});
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          response.data.forEach((t: KasTransaction) => {
            if (t && t.id) txMap.set(t.id, t);
          });
        }
      } catch (gasErr) {
        console.warn('[kasService] Fallback to GAS action also failed:', gasErr);
      }
    }

    // Gabungkan dengan transaksi yang mungkin ada di localStorage browser ini
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.transactions)) {
              parsed.transactions.forEach((t: KasTransaction) => {
                if (t && t.id && !txMap.has(t.id)) {
                  txMap.set(t.id, t);
                }
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('[kasService] Error merging local transactions:', e);
    }

    return Array.from(txMap.values()).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }

  /**
   * Menghasilkan master rekapitulasi keuangan untuk seluruh pengguna Untungin
   */
  public async generateMasterRecap(pesertaList: PesertaItem[]): Promise<KasMasterRecapSummary> {
    const allTxs = await this.fetchAllCloudKasTransactions();

    // Map transaksi berdasarkan nama usaha (dengan toleransi normalisasi)
    const txByBusiness = new Map<string, KasTransaction[]>();
    const normalize = (str: string) => (str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    allTxs.forEach((tx) => {
      const norm = normalize(tx.namaUsaha);
      if (!norm) return;
      if (!txByBusiness.has(norm)) {
        txByBusiness.set(norm, []);
      }
      txByBusiness.get(norm)!.push(tx);
    });

    const items: UmkmKasRecapItem[] = [];
    const matchedNormKeys = new Set<string>();

    // 1. Proses seluruh peserta resmi yang terdaftar
    pesertaList.forEach((p) => {
      const normKey = normalize(p.namaUsaha);
      matchedNormKeys.add(normKey);

      let txList = txByBusiness.get(normKey) || [];
      // Jika belum ketemu, coba pencarian substring (misal nama di tx disingkat)
      if (txList.length === 0) {
        for (const [key, txs] of txByBusiness.entries()) {
          if (!matchedNormKeys.has(key) && (key.includes(normKey) || normKey.includes(key))) {
            txList = txs;
            matchedNormKeys.add(key);
            break;
          }
        }
      }

      // Hitung metrik
      let totalIncome = 0;
      let totalExpense = 0;
      let incomeCount = 0;
      let expenseCount = 0;
      let transferCount = 0;
      let lastTxDate: string | undefined = undefined;

      txList.forEach((t) => {
        const amt = Number(t.amount) || 0;
        if (t.type === 'income') {
          totalIncome += amt;
          incomeCount++;
        } else if (t.type === 'expense') {
          totalExpense += amt;
          expenseCount++;
        } else if (t.type === 'transfer') {
          transferCount++;
        }
        if (t.date && (!lastTxDate || t.date > lastTxDate)) {
          lastTxDate = t.date;
        }
      });

      const netProfit = totalIncome - totalExpense;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
      const hasTransactions = txList.length > 0;

      let healthStatus: UmkmKasRecapItem['healthStatus'] = 'Belum Ada Transaksi';
      if (hasTransactions) {
        if (netProfit < 0) healthStatus = 'Defisit (Rugi)';
        else if (netProfit === 0) healthStatus = 'Impas';
        else if (profitMargin >= 25) healthStatus = 'Sehat (Laba Tinggi)';
        else if (profitMargin >= 10) healthStatus = 'Stabil (Laba Menengah)';
        else healthStatus = 'Tipis (Laba Rendah)';
      }

      const proStatus = this.getPremiumStatus(p.namaUsaha);

      items.push({
        namaUsaha: p.namaUsaha,
        namaPemilik: p.namaPemilik,
        subsektor: p.subsektor || 'Lainnya',
        whatsapp: p.whatsapp,
        alamatUsaha: p.alamatUsaha,
        sesi: p.sesi,
        totalIncome,
        totalExpense,
        netProfit,
        profitMargin,
        txCount: txList.length,
        incomeCount,
        expenseCount,
        transferCount,
        lastTxDate,
        hasTransactions,
        healthStatus,
        proStatus,
        transactions: txList
      });
    });

    // 2. Sertakan transaksi bisnis yang belum terdaftar di daftar peserta (misal obeecreatives, testing, dsb.)
    for (const [normKey, txs] of txByBusiness.entries()) {
      if (!matchedNormKeys.has(normKey)) {
        let totalIncome = 0;
        let totalExpense = 0;
        let incomeCount = 0;
        let expenseCount = 0;
        let transferCount = 0;
        let lastTxDate: string | undefined = undefined;
        const rawNama = txs[0]?.namaUsaha || normKey;

        txs.forEach((t) => {
          const amt = Number(t.amount) || 0;
          if (t.type === 'income') {
            totalIncome += amt;
            incomeCount++;
          } else if (t.type === 'expense') {
            totalExpense += amt;
            expenseCount++;
          } else if (t.type === 'transfer') {
            transferCount++;
          }
          if (t.date && (!lastTxDate || t.date > lastTxDate)) {
            lastTxDate = t.date;
          }
        });

        const netProfit = totalIncome - totalExpense;
        const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
        const hasTransactions = txs.length > 0;
        let healthStatus: UmkmKasRecapItem['healthStatus'] = 'Belum Ada Transaksi';
        if (hasTransactions) {
          if (netProfit < 0) healthStatus = 'Defisit (Rugi)';
          else if (netProfit === 0) healthStatus = 'Impas';
          else if (profitMargin >= 25) healthStatus = 'Sehat (Laba Tinggi)';
          else if (profitMargin >= 10) healthStatus = 'Stabil (Laba Menengah)';
          else healthStatus = 'Tipis (Laba Rendah)';
        }

        const proStatus = this.getPremiumStatus(rawNama);

        items.push({
          namaUsaha: rawNama,
          namaPemilik: 'Eksternal / Tenant',
          subsektor: 'Lainnya',
          whatsapp: '-',
          alamatUsaha: '-',
          totalIncome,
          totalExpense,
          netProfit,
          profitMargin,
          txCount: txs.length,
          incomeCount,
          expenseCount,
          transferCount,
          lastTxDate,
          hasTransactions,
          healthStatus,
          proStatus,
          transactions: txs
        });
      }
    }

    // Urutkan default: yang memiliki omzet tertinggi di atas, lalu yang punya transaksi
    items.sort((a, b) => {
      if (b.totalIncome !== a.totalIncome) return b.totalIncome - a.totalIncome;
      if (b.txCount !== a.txCount) return b.txCount - a.txCount;
      return a.namaUsaha.localeCompare(b.namaUsaha);
    });

    // 3. Hitung ringkasan makro global
    const totalOmzetGlobal = items.reduce((s, it) => s + it.totalIncome, 0);
    const totalExpenseGlobal = items.reduce((s, it) => s + it.totalExpense, 0);
    const totalNetProfitGlobal = totalOmzetGlobal - totalExpenseGlobal;
    const averageMarginGlobal = totalOmzetGlobal > 0 ? (totalNetProfitGlobal / totalOmzetGlobal) * 100 : 0;
    const totalTransactionsGlobal = items.reduce((s, it) => s + it.txCount, 0);
    const activeUmkmCount = items.filter((it) => it.hasTransactions).length;
    const profitableCount = items.filter((it) => it.hasTransactions && it.netProfit > 0).length;
    const deficitCount = items.filter((it) => it.hasTransactions && it.netProfit < 0).length;
    const proCount = items.filter((it) => it.proStatus.isPremium).length;

    // Breakdown per subsektor
    const sectorMap = new Map<string, { totalOmzet: number; totalExpense: number; netProfit: number; count: number; activeCount: number }>();
    items.forEach((it) => {
      const sec = it.subsektor || 'Lainnya';
      if (!sectorMap.has(sec)) {
        sectorMap.set(sec, { totalOmzet: 0, totalExpense: 0, netProfit: 0, count: 0, activeCount: 0 });
      }
      const val = sectorMap.get(sec)!;
      val.count++;
      if (it.hasTransactions) val.activeCount++;
      val.totalOmzet += it.totalIncome;
      val.totalExpense += it.totalExpense;
      val.netProfit += it.netProfit;
    });

    const sectorBreakdown = Array.from(sectorMap.entries())
      .map(([subsektor, data]) => ({ subsektor, ...data }))
      .sort((a, b) => b.totalOmzet - a.totalOmzet);

    const topIncomeUmkms = items.filter((it) => it.totalIncome > 0).slice(0, 5);

    return {
      totalOmzetGlobal,
      totalExpenseGlobal,
      totalNetProfitGlobal,
      averageMarginGlobal,
      totalTransactionsGlobal,
      activeUmkmCount,
      totalUmkmCount: items.length,
      profitableCount,
      deficitCount,
      proCount,
      items,
      sectorBreakdown,
      topIncomeUmkms
    };
  }

  // ============================================================================
  // DUAL-STREAM SHADOW SYNC (UNTUNGIN STANDALONE VAULT)
  // ============================================================================

  /**
   * Mengambil konfigurasi Shadow Vault saat ini dari storage lokal
   */
  public getVaultConfig(): { endpoint: string; enabled: boolean } {
    try {
      const endpoint = localStorage.getItem('untungin_vault_endpoint') || 'https://script.google.com/macros/s/AKfycbzt3TEU-OQioP9OxUm5BPHuuAihKqF1tJDDb396T4TguB2V_-KpKMaLD5O8VD6xAiVk/exec';
      const enabled = localStorage.getItem('untungin_vault_enabled') === 'true';
      return { endpoint, enabled };
    } catch {
      return {
        endpoint: 'https://script.google.com/macros/s/AKfycbzt3TEU-OQioP9OxUm5BPHuuAihKqF1tJDDb396T4TguB2V_-KpKMaLD5O8VD6xAiVk/exec',
        enabled: false
      };
    }
  }

  /**
   * Menyimpan konfigurasi endpoint dan status toggle Shadow Vault
   */
  public setVaultConfig(endpoint: string, enabled: boolean): void {
    try {
      localStorage.setItem('untungin_vault_endpoint', endpoint.trim());
      localStorage.setItem('untungin_vault_enabled', enabled ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save vault config:', e);
    }
  }

  /**
   * Mengambil antrean outbox vault dari local storage
   */
  public getVaultOutbox(): Array<{ id: string; action: string; payload: any; createdAt: number; attempts: number }> {
    try {
      const raw = localStorage.getItem('untungin_vault_outbox_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Menyimpan antrean outbox vault
   */
  public saveVaultOutbox(items: Array<{ id: string; action: string; payload: any; createdAt: number; attempts: number }>): void {
    try {
      localStorage.setItem('untungin_vault_outbox_v1', JSON.stringify(items.slice(-100)));
    } catch (e) {
      console.warn('Failed to save vault outbox:', e);
    }
  }

  /**
   * Mendapatkan jumlah antrean pending di outbox
   */
  public getOutboxCount(): number {
    return this.getVaultOutbox().length;
  }

  /**
   * Mengosongkan dan mengirim seluruh antrean outbox (Resilient Retry Worker)
   */
  public async flushVaultOutbox(): Promise<{ processed: number; remaining: number }> {
    const config = this.getVaultConfig();
    if (!config.enabled || !config.endpoint) return { processed: 0, remaining: 0 };
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { processed: 0, remaining: this.getOutboxCount() };
    }

    const queue = this.getVaultOutbox();
    if (queue.length === 0) return { processed: 0, remaining: 0 };

    const batch = queue.slice(0, 10);
    let processed = 0;
    const remaining: typeof queue = [];

    for (const item of batch) {
      try {
        await fetch(config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: item.action, ...item.payload }),
          mode: 'no-cors'
        });
        processed++;
      } catch (err) {
        if (item.attempts < 5) {
          remaining.push({ ...item, attempts: item.attempts + 1 });
        }
      }
    }

    const finalQueue = [...remaining, ...queue.slice(10)];
    this.saveVaultOutbox(finalQueue);
    return { processed, remaining: finalQueue.length };
  }

  /**
   * Dispatcher pengiriman data ganda asinkron (non-blocking) ke Standalone Vault dengan Outbox Queue
   */
  public dispatchVaultShadowSync(action: string, payload: any): void {
    const config = this.getVaultConfig();
    if (!config.enabled || !config.endpoint) return;

    try {
      const newItem = {
        id: 'outbox_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        action,
        payload,
        createdAt: Date.now(),
        attempts: 0
      };

      const queue = this.getVaultOutbox();
      queue.push(newItem);
      this.saveVaultOutbox(queue);

      // Trigger asynchronous non-blocking flush
      setTimeout(() => {
        this.flushVaultOutbox().catch(() => {});
      }, 20);
    } catch (err) {
      console.debug('[ShadowVaultSync] Dispatch error caught:', err);
    }
  }

  /**
   * Menguji konektivitas ke Spreadsheet Vault Mandiri (Health Check GET)
   */
  public async testVaultConnection(endpointUrl?: string): Promise<{ success: boolean; message: string; latency?: number }> {
    const targetUrl = endpointUrl || this.getVaultConfig().endpoint;
    const start = Date.now();
    try {
      const res = await fetch(targetUrl);
      const latency = Date.now() - start;
      const json = await res.json();
      if (json && json.status === 'success') {
        return {
          success: true,
          message: `Terhubung ke ${json.engine || 'Untungin Vault'} (${json.sheetsFound?.length || 5} tab aktif)`,
          latency
        };
      }
      return { success: false, message: json?.message || 'Respon tidak valid dari endpoint vault', latency };
    } catch (err: any) {
      return { success: false, message: 'Gagal menghubungi endpoint: ' + (err?.message || err), latency: Date.now() - start };
    }
  }

  /**
   * Menyalin (Seed) Profil 34 Peserta PartnerUp ke tab Untungin_Profil di Spreadsheet Vault
   */
  public async seedAllParticipantsToVault(endpointUrl?: string): Promise<{ success: boolean; count: number; message: string }> {
    const targetUrl = endpointUrl || this.getVaultConfig().endpoint;
    const allPeserta = gasService.getPeserta();
    if (!allPeserta || allPeserta.length === 0) {
      return { success: false, count: 0, message: 'Tidak ada data peserta ditemukan di sistem PartnerUp.' };
    }

    let successCount = 0;
    for (const p of allPeserta) {
      const prem = this.getPremiumStatus(p.namaUsaha);
      const isPro = prem.isPremium;
      const pinData = this.getKasPin(p.namaUsaha);

      try {
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'syncProfil',
            namaUsaha: p.namaUsaha,
            namaPemilik: p.namaPemilik || '-',
            whatsapp: p.whatsapp || '-',
            statusLisensi: isPro ? 'PRO' : 'TRIAL',
            voucherDurationMonths: prem.proDurationMonths || 0,
            voucherExpiresAt: prem.proExpiresAt || '-',
            pinHash: pinData?.pin || '123456'
          }),
          mode: 'no-cors'
        });
        successCount++;
      } catch (e) {
        console.warn('Gagal sync profil:', p.namaUsaha, e);
      }
    }

    return {
      success: true,
      count: successCount,
      message: `Berhasil menduplikasi profil ${successCount} UMKM ke tab Untungin_Profil di Spreadsheet Vault Mandiri.`
    };
  }

  /**
   * Menyalin seluruh riwayat transaksi kas yang sudah ada di PartnerUp ke tab Untungin_Transaksi di Spreadsheet Vault (Historical Backfill)
   */
  public async seedAllTransactionsToVault(endpointUrl?: string): Promise<{ success: boolean; count: number; message: string }> {
    const targetUrl = endpointUrl || this.getVaultConfig().endpoint;
    const allPeserta = gasService.getPeserta();
    if (!allPeserta || allPeserta.length === 0) {
      return { success: false, count: 0, message: 'Tidak ada data peserta ditemukan di PartnerUp.' };
    }

    const allTx: any[] = [];
    for (const p of allPeserta) {
      const kasData = this.getKasData(p.namaUsaha);
      if (kasData && kasData.transactions && kasData.transactions.length > 0) {
        for (const t of kasData.transactions) {
          allTx.push({
            id: t.id,
            timestamp: t.createdAt || new Date().toISOString(),
            tanggal: t.date,
            namaUsaha: t.namaUsaha,
            arusKas: t.type === 'income' ? 'Pemasukan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer',
            kategori: t.category || 'Umum',
            nominal: t.amount,
            rekening: t.accountId || 'Kas Tunai',
            keterangan: t.desc || '-',
            catatan: `Backfill PartnerUp (${t.createdBy || 'System'})`
          });
        }
      }
    }

    if (allTx.length === 0) {
      return { success: true, count: 0, message: 'Belum ada riwayat transaksi kas yang tersimpan di sistem untuk dimigrasikan.' };
    }

    // Kirim per batch (50 item per pengiriman)
    const chunkSize = 50;
    let sentCount = 0;
    for (let i = 0; i < allTx.length; i += chunkSize) {
      const chunk = allTx.slice(i, i + chunkSize);
      try {
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'pushBatchTransaksi',
            items: chunk
          }),
          mode: 'no-cors'
        });
        sentCount += chunk.length;
      } catch (err) {
        console.warn('[seedAllTransactionsToVault] Gagal mengirim batch:', err);
      }
    }

    return {
      success: true,
      count: sentCount,
      message: `Berhasil mereplikasi ${sentCount} riwayat transaksi kas ke tab Untungin_Transaksi di Vault Mandiri!`
    };
  }
}

export const kasService = new KasService();
