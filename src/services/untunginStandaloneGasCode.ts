/**
 * ============================================================================
 * UNTUNGIN PRO API ENGINE — STANDALONE BACKEND GAS (v1.2)
 * ============================================================================
 * Proyek: UNTUNGIN - PRO API ENGINE (script.google.com)
 * Target Spreadsheet ID: 1l_MT50H0blcu771UYMm6Tqc4Q1R2s4U2iOglx-cW4kE
 * Arsitektur: Headless Serverless REST API untuk Database Kas & UMKM Mandiri
 * Fitur: Multi-Akun, Smart Update Transaksi, Batch Backfill, Modul Hutang & Piutang
 * Sifat: 100% Terpisah & Decoupled dari PartnerUp
 * ============================================================================
 */

export const UNTUNGIN_STANDALONE_GAS_CODE = `/**
 * ============================================================================
 * UNTUNGIN PRO API ENGINE — STANDALONE BACKEND v1.2
 * Database & API Serverless Mandiri untuk Ekosistem Kas Untungin
 * ============================================================================
 * Spreadsheet Target: 1l_MT50H0blcu771UYMm6Tqc4Q1R2s4U2iOglx-cW4kE
 * Developer & Owner: Obee Creatives
 * Lisensi: Proprietary - Khusus Untungin Standalone Ecosystem
 * ============================================================================
 */

// Target Spreadsheet ID Utama
const DEFAULT_SPREADSHEET_ID = "1l_MT50H0blcu771UYMm6Tqc4Q1R2s4U2iOglx-cW4kE";

/**
 * Mengambil objek Spreadsheet yang valid
 */
function getSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  const targetId = props.getProperty("SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID;
  return SpreadsheetApp.openById(targetId);
}

/**
 * ============================================================================
 * 1. INSIALISASI STRUKTUR TAB & SKEMA DATABASE OTOMATIS
 * Jalankan fungsi ini sekali dari editor toolbar untuk membuat semua tab!
 * ============================================================================
 */
function initUntunginDatabase() {
  const ss = getSpreadsheet();
  const sheetsToCreate = [
    {
      name: "Untungin_Profil",
      headers: [
        "Nama Usaha (Key)",
        "Nama Pemilik",
        "Nomor WhatsApp",
        "Status Lisensi",
        "Durasi Voucher (Bulan)",
        "Tanggal Expired Voucher",
        "Hash PIN Keamanan",
        "Total Saldo Kas (Rp)",
        "Total Transaksi",
        "Terakhir Aktif",
        "Tanggal Didaftarkan"
      ],
      color: "#001c3c" // Navy Blue
    },
    {
      name: "Untungin_Transaksi",
      headers: [
        "ID Transaksi",
        "Timestamp ISO",
        "Tanggal Transaksi",
        "Nama Usaha",
        "Arus Kas (Masuk/Keluar)",
        "Kategori",
        "Nominal (Rp)",
        "Rekening / Akun",
        "Keterangan / Uraian",
        "Catatan Tambahan",
        "Waktu Input Sistem"
      ],
      color: "#065f46" // Emerald Green
    },
    {
      name: "Untungin_Akun",
      headers: [
        "ID Akun",
        "Nama Usaha",
        "Nama Dompet/Akun",
        "Tipe Akun (Tunai/Bank/QRIS)",
        "Nomor Rekening",
        "Atas Nama",
        "Saldo Awal (Rp)",
        "Saldo Berjalan (Rp)",
        "Status Aktif"
      ],
      color: "#4338ca" // Indigo
    },
    {
      name: "Untungin_Voucher",
      headers: [
        "Kode Voucher",
        "Durasi (Bulan)",
        "Status (Available/Claimed/Expired)",
        "Klaim Oleh (Nama Usaha)",
        "Tanggal Klaim",
        "Tanggal Berakhir",
        "Catatan Lisensi"
      ],
      color: "#b45309" // Amber Gold
    },
    {
      name: "Untungin_HutangPiutang",
      headers: [
        "ID Catatan",
        "Timestamp ISO",
        "Nama Usaha",
        "Tipe (HUTANG/PIUTANG)",
        "Pihak Terkait",
        "Nomor WhatsApp",
        "Nominal (Rp)",
        "Tanggal Transaksi",
        "Tanggal Jatuh Tempo",
        "Status (BELUM_LUNAS/LUNAS)",
        "Keterangan",
        "Terakhir Diperbarui"
      ],
      color: "#0284c7" // Light Blue / Sky
    },
    {
      name: "Untungin_Audit",
      headers: [
        "ID Log",
        "Waktu Kejadian",
        "Nama Usaha",
        "Aksi Sistem",
        "Detail Perubahan",
        "Status Eksekusi",
        "IP / Client Agent"
      ],
      color: "#475569" // Slate Gray
    }
  ];

  const results = [];

  sheetsToCreate.forEach(cfg => {
    let sheet = ss.getSheetByName(cfg.name);
    let isCreated = false;

    if (!sheet) {
      sheet = ss.insertSheet(cfg.name);
      isCreated = true;
    }

    // Set header jika kosong atau baru
    if (isCreated || sheet.getLastRow() === 0) {
      sheet.clear();
      sheet.getRange(1, 1, 1, cfg.headers.length).setValues([cfg.headers]);
      
      // Styling Header Modern
      const headerRange = sheet.getRange(1, 1, 1, cfg.headers.length);
      headerRange.setBackground(cfg.color);
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setFontFamily("Arial");
      headerRange.setFontSize(10);
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 34);

      // Freeze Baris 1
      sheet.setFrozenRows(1);
    }

    results.push(cfg.name + (isCreated ? " (Dibuat Baru)" : " (Sudah Ada)"));
  });

  // Hapus "Sheet1" bawaan jika ada dan tab lain sudah siap
  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {}
  }

  Logger.log("✅ Inisialisasi Database Untungin Sukses: " + results.join(", "));
  return {
    status: "success",
    message: "Inisialisasi Database Untungin Berhasil Sempurna",
    createdSheets: results
  };
}

/**
 * ============================================================================
 * 2. ENDPOINT HTTP GET (HEALTH CHECK & VERIFIKASI KONEKSI)
 * ============================================================================
 */
function doGet(e) {
  try {
    const ss = getSpreadsheet();
    const sheetNames = ss.getSheets().map(s => s.getName());

    const response = {
      status: "success",
      engine: "UNTUNGIN - PRO API ENGINE (STANDALONE)",
      version: "1.0.0",
      spreadsheetId: ss.getId(),
      spreadsheetName: ss.getName(),
      databaseReady: sheetNames.includes("Untungin_Transaksi"),
      sheetsFound: sheetNames,
      serverTime: new Date().toISOString()
    };

    return createJsonResponse(response);
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "Gagal menghubungkan ke spreadsheet: " + err.message
    });
  }
}

/**
 * ============================================================================
 * 3. ENDPOINT HTTP POST (PUSAT DISPATCHER TRANSAKSI & PROFIL)
 * ============================================================================
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Kunci eksekusi 30 detik untuk mencegah race-condition saat input bersamaan
    lock.waitLock(30000);

    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || "ping";
    let result = null;

    switch (action) {
      case "ping":
        result = { status: "success", message: "PONG! Untungin Pro Engine Standalone Siap (v1.3 Universal Dual-Stream Audit Bridge).", timestamp: new Date().toISOString() };
        break;

      case "initSheets":
        result = initUntunginDatabase();
        break;

      case "perbaikiKlasifikasi":
      case "recalculateSaldo":
        result = perbaikiKlasifikasiTransaksiDanSaldo();
        break;

      // Mendukung aksi dari PartnerUp dual-sync maupun Standalone Vercel Engine
      case "pushTransaksi":
      case "tambahTransaksi":
      case "smartUpdate":
        result = handlePushTransaksi(payload);
        break;

      case "deleteTransaksi":
      case "smartDelete":
        result = handleDeleteTransaksi(payload);
        break;

      case "pushBatchTransaksi":
        result = handlePushBatchTransaksi(payload);
        break;

      case "syncProfil":
      case "daftarUsaha":
        result = handleSyncProfil(payload);
        break;

      case "syncAkun":
      case "tambahAkun":
        result = handleSyncAkun(payload);
        break;

      case "activateVoucher":
      case "aktivasiVoucher":
        result = handleActivateVoucher(payload);
        break;

      case "gantiPin":
        result = handleGantiPin(payload);
        break;

      case "getKasData":
        result = handleGetKasData(payload);
        break;

      case "pushHutangPiutang":
      case "syncHutangPiutang":
        result = handlePushHutangPiutang(payload);
        break;

      case "deleteHutangPiutang":
        result = handleDeleteHutangPiutang(payload);
        break;

      case "getHutangPiutang":
        result = handleGetHutangPiutang(payload);
        break;

      default:
        result = { status: "error", message: "Aksi tidak dikenal: " + action };
        break;
    }

    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "Terjadi kesalahan internal engine: " + err.message
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Simpan atau perbarui transaksi kas tunggal (Mendukung PartnerUp & Standalone Vercel payload)
 */
function handlePushTransaksi(p) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Untungin_Transaksi");
  if (!sheet) {
    initUntunginDatabase();
    sheet = ss.getSheetByName("Untungin_Transaksi");
  }

  // Dukungan struktur nested dari Standalone Vercel ({ transaction: {...} } atau { data: {...} })
  const item = p.transaction || p.data || p;

  const txId = (item.id || item.transactionId || p.transactionId || ("TX-" + Utilities.getUuid().substring(0, 8).toUpperCase())).trim();
  const nowStr = new Date().toISOString();
  const txDate = item.tanggal || item.date || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
  const namaUsaha = (item.namaUsaha || item.umkmId || p.namaUsaha || "UMKM").trim();
  
  // Normalisasi jenis arus kas menggunakan universal parser
  const arusKas = normalizeArusKas(item);

  const kategori = item.kategori || item.category || "Umum";
  const nominal = Number(item.nominal || item.amount) || 0;
  const rekening = item.rekening || item.akun || item.accountId || "Kas Tunai";
  const keterangan = item.keterangan || item.desc || "-";
  const catatan = item.catatan || "-";

  // Cek apakah transaksi sudah ada (Smart Update vs Append)
  const data = sheet.getDataRange().getValues();
  let existingRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === txId) {
      existingRow = i + 1;
      break;
    }
  }

  if (existingRow > 0) {
    // Update data pada baris yang sudah ada
    sheet.getRange(existingRow, 3).setValue(txDate);
    sheet.getRange(existingRow, 4).setValue(namaUsaha);
    sheet.getRange(existingRow, 5).setValue(arusKas);
    sheet.getRange(existingRow, 6).setValue(kategori);
    sheet.getRange(existingRow, 7).setValue(nominal);
    sheet.getRange(existingRow, 8).setValue(rekening);
    sheet.getRange(existingRow, 9).setValue(keterangan);
    sheet.getRange(existingRow, 10).setValue(catatan);
    sheet.getRange(existingRow, 11).setValue(new Date());
  } else {
    // Tambah baris baru
    sheet.appendRow([
      txId,
      nowStr,
      txDate,
      namaUsaha,
      arusKas,
      kategori,
      nominal,
      rekening,
      keterangan,
      catatan,
      new Date()
    ]);
  }

  // Update rekapan profil UMKM
  updateProfilSummary(ss, namaUsaha);

  return {
    status: "success",
    message: existingRow > 0 ? "Transaksi berhasil diperbarui di Vault" : "Transaksi baru berhasil dicatat ke Vault",
    transactionId: txId,
    namaUsaha: namaUsaha,
    nominal: nominal,
    isUpdated: existingRow > 0
  };
}

/**
 * Hapus transaksi dari Vault Standalone (Mendukung deleteTransaksi dan smartDelete)
 */
function handleDeleteTransaksi(p) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Untungin_Transaksi");
  if (!sheet) return { status: "success", message: "Tab transaksi belum dibuat" };

  const txId = (p.id || p.txId || p.transactionId || "").trim();
  if (!txId) return { status: "error", message: "ID transaksi tidak disertakan" };

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  let namaUsaha = (p.namaUsaha || p.umkmId || "").trim();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === txId) {
      foundRow = i + 1;
      if (!namaUsaha) namaUsaha = String(data[i][3]).trim();
      break;
    }
  }

  if (foundRow > 0) {
    sheet.deleteRow(foundRow);
    if (namaUsaha) {
      updateProfilSummary(ss, namaUsaha);
    }
    return {
      status: "success",
      message: "Transaksi " + txId + " berhasil dihapus dari Vault",
      deletedId: txId
    };
  }

  return {
    status: "success",
    message: "Transaksi tidak ditemukan di Vault (mungkin sudah terhapus)",
    txId: txId
  };
}

/**
 * Pembaruan PIN Kas Peserta dari Standalone
 */
function handleGantiPin(p) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("Untungin_Profil");
  if (!sheet) return { status: "error", message: "Tab Untungin_Profil belum siap" };

  const profileId = (p.profileId || p.namaUsaha || "").trim().toLowerCase();
  const newPin = String(p.newPin || p.pin || "123456").trim();

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase().trim() === profileId) {
      sheet.getRange(i + 1, 7).setValue(newPin);
      return { status: "success", message: "PIN Kas berhasil diperbarui" };
    }
  }
  return { status: "success", message: "PIN baru dicatat" };
}

/**
 * Simpan atau perbarui transaksi kas dalam jumlah banyak (Batch Sync & Backfill)
 */
function handlePushBatchTransaksi(p) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Untungin_Transaksi");
  if (!sheet) {
    initUntunginDatabase();
    sheet = ss.getSheetByName("Untungin_Transaksi");
  }

  const items = Array.isArray(p.items) ? p.items : [];
  if (items.length === 0) {
    return { status: "success", message: "Tidak ada transaksi yang dikirim.", count: 0 };
  }

  const nowStr = new Date().toISOString();
  const data = sheet.getDataRange().getValues();
  const existingIdMap = {};
  for (let i = 1; i < data.length; i++) {
    const id = String(data[i][0]).trim();
    if (id) existingIdMap[id] = i + 1;
  }

  const newRows = [];
  let updatedCount = 0;
  const touchedBiz = {};

  items.forEach(t => {
    const txId = (t.id || ("TX-" + Utilities.getUuid().substring(0, 8).toUpperCase())).trim();
    const txDate = t.tanggal || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
    const biz = (t.namaUsaha || p.namaUsaha || "UMKM").trim();
    const arusKas = normalizeArusKas(t);
    const kategori = t.kategori || "Umum";
    const nominal = Number(t.nominal) || 0;
    const rekening = t.rekening || t.akun || "Kas Tunai";
    const keterangan = t.keterangan || "-";
    const catatan = t.catatan || "-";

    touchedBiz[biz] = true;

    if (existingIdMap[txId]) {
      const rowIdx = existingIdMap[txId];
      sheet.getRange(rowIdx, 3).setValue(txDate);
      sheet.getRange(rowIdx, 4).setValue(biz);
      sheet.getRange(rowIdx, 5).setValue(arusKas);
      sheet.getRange(rowIdx, 6).setValue(kategori);
      sheet.getRange(rowIdx, 7).setValue(nominal);
      sheet.getRange(rowIdx, 8).setValue(rekening);
      sheet.getRange(rowIdx, 9).setValue(keterangan);
      sheet.getRange(rowIdx, 10).setValue(catatan);
      sheet.getRange(rowIdx, 11).setValue(new Date());
      updatedCount++;
    } else {
      newRows.push([
        txId,
        t.timestamp || nowStr,
        txDate,
        biz,
        arusKas,
        kategori,
        nominal,
        rekening,
        keterangan,
        catatan,
        new Date()
      ]);
    }
  });

  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
  }

  Object.keys(touchedBiz).forEach(biz => {
    updateProfilSummary(ss, biz);
  });

  return {
    status: "success",
    message: "Batch sync sukses: " + newRows.length + " baru ditambahkan, " + updatedCount + " diperbarui.",
    newCount: newRows.length,
    updatedCount: updatedCount,
    total: items.length
  };
}

/**
 * Mengambil transaksi kas dari Vault
 */
function handleGetKasData(p) {
  const ss = getSpreadsheet();
  const txSheet = ss.getSheetByName("Untungin_Transaksi");
  if (!txSheet) return { status: "success", transactions: [] };

  const namaUsaha = (p.namaUsaha || "").toLowerCase().trim();
  const data = txSheet.getDataRange().getValues();
  const txList = [];

  for (let i = 1; i < data.length; i++) {
    const rowBiz = String(data[i][3]).toLowerCase().trim();
    if (!namaUsaha || rowBiz === namaUsaha) {
      txList.push({
        id: data[i][0],
        timestamp: data[i][1],
        tanggal: data[i][2],
        namaUsaha: data[i][3],
        arusKas: data[i][4],
        kategori: data[i][5],
        nominal: data[i][6],
        rekening: data[i][7],
        keterangan: data[i][8],
        catatan: data[i][9]
      });
    }
  }

  return {
    status: "success",
    count: txList.length,
    transactions: txList
  };
}

/**
 * Sinkronisasi Profil UMKM (Lisensi, PIN, Nomor WA)
 */
function handleSyncProfil(p) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Untungin_Profil");
  if (!sheet) {
    initUntunginDatabase();
    sheet = ss.getSheetByName("Untungin_Profil");
  }

  const namaUsaha = (p.namaUsaha || "").trim();
  if (!namaUsaha) {
    return { status: "error", message: "Nama usaha wajib diisi" };
  }

  const pemilik = p.namaPemilik || "-";
  const wa = p.whatsapp || "-";
  const lisensi = p.statusLisensi || (p.isPro ? "PRO" : "TRIAL");
  const durasiBulan = Number(p.voucherDurationMonths) || 0;
  const expiredAt = p.voucherExpiresAt || "-";
  const pinHash = p.pinHash || p.pin || "-";
  const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

  const data = sheet.getDataRange().getValues();
  let targetRowIndex = -1;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase().trim() === namaUsaha.toLowerCase()) {
      targetRowIndex = i + 1;
      break;
    }
  }

  if (targetRowIndex > 0) {
    // Update baris yang sudah ada
    sheet.getRange(targetRowIndex, 2).setValue(pemilik);
    sheet.getRange(targetRowIndex, 3).setValue(wa);
    sheet.getRange(targetRowIndex, 4).setValue(lisensi);
    sheet.getRange(targetRowIndex, 5).setValue(durasiBulan);
    sheet.getRange(targetRowIndex, 6).setValue(expiredAt);
    if (pinHash && pinHash !== "-") {
      sheet.getRange(targetRowIndex, 7).setValue(pinHash);
    }
    sheet.getRange(targetRowIndex, 10).setValue(nowStr);
  } else {
    // Baris baru
    sheet.appendRow([
      namaUsaha,
      pemilik,
      wa,
      lisensi,
      durasiBulan,
      expiredAt,
      pinHash,
      0, // Saldo Awal
      0, // Total Tx
      nowStr,
      nowStr
    ]);
  }

  return {
    status: "success",
    message: "Profil usaha " + namaUsaha + " berhasil disinkronkan ke Vault Standalone",
    namaUsaha: namaUsaha
  };
}

/**
 * Sinkronisasi Rekening / Akun Kas (Multi-Dompet)
 */
function handleSyncAkun(p) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Untungin_Akun");
  if (!sheet) {
    initUntunginDatabase();
    sheet = ss.getSheetByName("Untungin_Akun");
  }

  const item = p.account || p.data || p;
  const accountId = (item.id || item.accountId || ("ACC-" + Utilities.getUuid().substring(0, 8).toUpperCase())).trim();
  const namaUsaha = (item.namaUsaha || p.namaUsaha || "UMKM").trim();
  const namaAkun = (item.namaAkun || item.name || "Kas Tunai").trim();
  const tipeAkun = (item.tipe || item.type || "Tunai").trim();
  const nomorRek = (item.nomorRekening || item.noRek || "-").trim();
  const atasNama = (item.atasNama || "-").trim();
  const saldoAwal = Number(item.saldoAwal || item.initialBalance) || 0;
  const saldoBerjalan = Number(item.saldoBerjalan || item.balance || saldoAwal) || 0;
  const statusAktif = (item.status || "Aktif").trim();

  const data = sheet.getDataRange().getValues();
  let existingRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === accountId) {
      existingRow = i + 1;
      break;
    }
  }

  if (existingRow > 0) {
    sheet.getRange(existingRow, 2).setValue(namaUsaha);
    sheet.getRange(existingRow, 3).setValue(namaAkun);
    sheet.getRange(existingRow, 4).setValue(tipeAkun);
    sheet.getRange(existingRow, 5).setValue(nomorRek);
    sheet.getRange(existingRow, 6).setValue(atasNama);
    sheet.getRange(existingRow, 7).setValue(saldoAwal);
    sheet.getRange(existingRow, 8).setValue(saldoBerjalan);
    sheet.getRange(existingRow, 9).setValue(statusAktif);
  } else {
    sheet.appendRow([
      accountId,
      namaUsaha,
      namaAkun,
      tipeAkun,
      nomorRek,
      atasNama,
      saldoAwal,
      saldoBerjalan,
      statusAktif
    ]);
  }

  return {
    status: "success",
    message: "Akun kas " + namaAkun + " berhasil disinkronkan",
    accountId: accountId
  };
}

/**
 * Aktivasi Voucher Lisensi Untungin PRO
 */
function handleActivateVoucher(p) {
  const ss = getSpreadsheet();
  let vSheet = ss.getSheetByName("Untungin_Voucher");
  let pSheet = ss.getSheetByName("Untungin_Profil");
  if (!vSheet || !pSheet) {
    initUntunginDatabase();
    vSheet = ss.getSheetByName("Untungin_Voucher");
    pSheet = ss.getSheetByName("Untungin_Profil");
  }

  const voucherCode = (p.voucherCode || p.kodeVoucher || p.code || "").trim().toUpperCase();
  const namaUsaha = (p.namaUsaha || "").trim();

  if (!voucherCode) return { status: "error", message: "Kode voucher wajib diisi" };
  if (!namaUsaha) return { status: "error", message: "Nama usaha wajib diisi" };

  const vData = vSheet.getDataRange().getValues();
  let foundRow = -1;
  let durasiBulan = 12;

  for (let i = 1; i < vData.length; i++) {
    if (String(vData[i][0]).trim().toUpperCase() === voucherCode) {
      const status = String(vData[i][2]).trim().toLowerCase();
      if (status !== "available" && status !== "aktif") {
        return { status: "error", message: "Voucher sudah pernah digunakan atau hangus" };
      }
      foundRow = i + 1;
      durasiBulan = Number(vData[i][1]) || 12;
      break;
    }
  }

  const expiredDate = new Date();
  expiredDate.setMonth(expiredDate.getMonth() + durasiBulan);
  const expStr = Utilities.formatDate(expiredDate, "Asia/Jakarta", "yyyy-MM-dd");

  if (foundRow > 0) {
    vSheet.getRange(foundRow, 3).setValue("Claimed");
    vSheet.getRange(foundRow, 4).setValue(namaUsaha);
    vSheet.getRange(foundRow, 5).setValue(new Date());
    vSheet.getRange(foundRow, 6).setValue(expStr);
  }

  const pData = pSheet.getDataRange().getValues();
  for (let j = 1; j < pData.length; j++) {
    if (String(pData[j][0]).toLowerCase().trim() === namaUsaha.toLowerCase()) {
      pSheet.getRange(j + 1, 4).setValue("PRO");
      pSheet.getRange(j + 1, 5).setValue(durasiBulan);
      pSheet.getRange(j + 1, 6).setValue(expStr);
      break;
    }
  }

  return {
    status: "success",
    message: "Voucher berhasil diaktivasi! Status PRO aktif hingga " + expStr,
    statusLisensi: "PRO",
    expiredAt: expStr
  };
}

/**
 * Update ringkasan saldo & total transaksi di tabel profil
 */
function updateProfilSummary(ss, namaUsaha) {
  try {
    const txSheet = ss.getSheetByName("Untungin_Transaksi");
    const profilSheet = ss.getSheetByName("Untungin_Profil");
    if (!txSheet || !profilSheet) return;

    const txData = txSheet.getDataRange().getValues();
    let totalMasuk = 0;
    let totalKeluar = 0;
    let txCount = 0;

    for (let i = 1; i < txData.length; i++) {
      const rowBiz = String(txData[i][3]).toLowerCase().trim();
      if (rowBiz === namaUsaha.toLowerCase()) {
        txCount++;
        const tipe = String(txData[i][4]).toLowerCase();
        const nom = Number(txData[i][6]) || 0;
        if (tipe.includes("masuk")) totalMasuk += nom;
        else if (tipe.includes("keluar")) totalKeluar += nom;
      }
    }

    const netSaldo = totalMasuk - totalKeluar;
    const profilData = profilSheet.getDataRange().getValues();

    for (let j = 1; j < profilData.length; j++) {
      if (String(profilData[j][0]).toLowerCase().trim() === namaUsaha.toLowerCase()) {
        profilSheet.getRange(j + 1, 8).setValue(netSaldo);
        profilSheet.getRange(j + 1, 9).setValue(txCount);
        profilSheet.getRange(j + 1, 10).setValue(new Date());
        break;
      }
    }
  } catch (e) {}
}

/**
 * Normalisasi Cerdas Jenis Arus Kas (Pemasukan vs Pengeluaran vs Transfer)
 * Mendukung format PartnerUp, Standalone Vercel, akuntansi umum, dan fallback kategori pengeluaran
 */
function normalizeArusKas(item) {
  if (!item) return "Pemasukan";
  const rawType = String(item.arusKas || item.tipe || item.type || item.jenis || "").toLowerCase().trim();
  
  if (rawType.includes("keluar") || rawType === "expense" || rawType === "out" || rawType === "debit") {
    return "Pengeluaran";
  }
  if (rawType.includes("transfer")) {
    return "Transfer";
  }
  if (rawType.includes("masuk") || rawType === "income" || rawType === "in" || rawType === "credit") {
    return "Pemasukan";
  }

  // Heuristik kategori & deskripsi pengeluaran standar
  const cat = String(item.kategori || item.category || "").toLowerCase();
  const desc = String(item.keterangan || item.desc || "").toLowerCase();
  const expenseKeywords = [
    "bahan baku", "kemasan", "packaging", "operasional", "gaji", "upah",
    "transport", "ongkir", "sewa", "listrik", "air", "pembelian", "beli",
    "cetak", "canva", "accurate", "alat", "peralatan", "tandon", "stiker",
    "gula", "apel", "terigu", "biaya", "pengeluaran"
  ];

  for (let i = 0; i < expenseKeywords.length; i++) {
    if (cat.includes(expenseKeywords[i]) || desc.includes(expenseKeywords[i])) {
      return "Pengeluaran";
    }
  }

  return "Pemasukan";
}

/**
 * FUNGSI UTILITY PERBAIKAN SATU-KLIK (Jalankan di Apps Script Editor atau via Remote API):
 * Memperbaiki seluruh klasifikasi 'Pemasukan' vs 'Pengeluaran' pada baris transaksi yang sudah ada
 * dan memperbarui saldo bersih seluruh profil UMKM di tab Untungin_Profil secara otomatis.
 */
function perbaikiKlasifikasiTransaksiDanSaldo() {
  const ss = getSpreadsheet();
  const txSheet = ss.getSheetByName("Untungin_Transaksi");
  if (!txSheet) return { status: "error", message: "Tab Untungin_Transaksi tidak ditemukan." };

  const data = txSheet.getDataRange().getValues();
  if (data.length <= 1) return { status: "success", message: "Belum ada transaksi di tab Untungin_Transaksi." };

  let fixedCount = 0;
  const touchedBiz = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const biz = String(row[3] || "").trim();
    const currentArus = String(row[4] || "").trim();
    const kategori = String(row[5] || "").trim();
    const keterangan = String(row[8] || "").trim();
    const catatan = String(row[9] || "").trim();

    // Deteksi jika ada jejak pengeluaran di kategori/keterangan/catatan
    let probeType = currentArus;
    if (catatan.toLowerCase().includes("expense") || keterangan.toLowerCase().includes("expense")) {
      probeType = "expense";
    }

    const calculatedArus = normalizeArusKas({
      arusKas: probeType,
      kategori: kategori,
      keterangan: keterangan,
      catatan: catatan
    });

    if (calculatedArus !== currentArus) {
      txSheet.getRange(i + 1, 5).setValue(calculatedArus);
      txSheet.getRange(i + 1, 11).setValue(new Date());
      fixedCount++;
    }

    if (biz) touchedBiz[biz] = true;
  }

  // Update ringkasan saldo di Untungin_Profil
  Object.keys(touchedBiz).forEach(biz => {
    updateProfilSummary(ss, biz);
  });

  return {
    status: "success",
    message: "Berhasil memperbaiki klasifikasi " + fixedCount + " transaksi dan menyinkronkan saldo profil UMKM.",
    fixedCount: fixedCount,
    totalBiz: Object.keys(touchedBiz).length
  };
}

/**
 * ============================================================================
 * MODUL HUTANG & PIUTANG (BON PELANGGAN & KEWAJIBAN SUPPLIER)
 * ============================================================================
 */

/**
 * Simpan atau perbarui catatan hutang/piutang (Smart Update vs Append)
 */
function handlePushHutangPiutang(p) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Untungin_HutangPiutang");
  if (!sheet) {
    initUntunginDatabase();
    sheet = ss.getSheetByName("Untungin_HutangPiutang");
  }

  const item = p.data || p.item || p;
  const debtId = (item.id || item.debtId || ("DEBT-STD-" + Utilities.getUuid().substring(0, 8).toUpperCase())).trim();
  const nowStr = new Date().toISOString();
  const namaUsaha = (item.namaUsaha || p.namaUsaha || "UMKM").trim();
  const rawType = String(item.tipe || item.type || "PIUTANG").toUpperCase();
  const tipe = rawType.includes("HUTANG") ? "HUTANG" : "PIUTANG";
  const pihakTerkait = item.pihakTerkait || item.pihak || "-";
  const kontakWa = item.kontakWa || item.whatsapp || item.noHp || "-";
  const nominal = Number(item.nominal || item.amount) || 0;
  const tanggal = item.tanggal || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
  const jatuhTempo = item.jatuhTempo || item.dueDate || tanggal;
  const status = (item.status || "BELUM_LUNAS").toUpperCase();
  const keterangan = item.keterangan || "-";

  // Cek apakah data sudah ada (Smart Update)
  const data = sheet.getDataRange().getValues();
  let existingRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === debtId) {
      existingRow = i + 1;
      break;
    }
  }

  if (existingRow > 0) {
    sheet.getRange(existingRow, 3).setValue(namaUsaha);
    sheet.getRange(existingRow, 4).setValue(tipe);
    sheet.getRange(existingRow, 5).setValue(pihakTerkait);
    sheet.getRange(existingRow, 6).setValue(kontakWa);
    sheet.getRange(existingRow, 7).setValue(nominal);
    sheet.getRange(existingRow, 8).setValue(tanggal);
    sheet.getRange(existingRow, 9).setValue(jatuhTempo);
    sheet.getRange(existingRow, 10).setValue(status);
    sheet.getRange(existingRow, 11).setValue(keterangan);
    sheet.getRange(existingRow, 12).setValue(new Date());
  } else {
    sheet.appendRow([
      debtId,
      nowStr,
      namaUsaha,
      tipe,
      pihakTerkait,
      kontakWa,
      nominal,
      tanggal,
      jatuhTempo,
      status,
      keterangan,
      new Date()
    ]);
  }

  return {
    status: "success",
    message: "Data " + tipe + " (" + debtId + ") berhasil disimpan ke Vault",
    id: debtId
  };
}

/**
 * Hapus catatan hutang/piutang dari tab Untungin_HutangPiutang
 */
function handleDeleteHutangPiutang(p) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("Untungin_HutangPiutang");
  if (!sheet) return { status: "success", message: "Tab hutang piutang belum ada" };

  const debtId = (p.id || p.debtId || "").trim();
  if (!debtId) return { status: "error", message: "ID catatan tidak disertakan" };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === debtId) {
      sheet.deleteRow(i + 1);
      return {
        status: "success",
        message: "Catatan " + debtId + " berhasil dihapus dari Vault",
        deletedId: debtId
      };
    }
  }

  return {
    status: "success",
    message: "Data tidak ditemukan atau sudah terhapus",
    id: debtId
  };
}

/**
 * Mengambil catatan hutang piutang dari Vault
 */
function handleGetHutangPiutang(p) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("Untungin_HutangPiutang");
  if (!sheet) return { status: "success", items: [] };

  const namaUsaha = (p.namaUsaha || "").toLowerCase().trim();
  const data = sheet.getDataRange().getValues();
  const items = [];

  for (let i = 1; i < data.length; i++) {
    const rowBiz = String(data[i][2]).toLowerCase().trim();
    if (!namaUsaha || rowBiz === namaUsaha) {
      items.push({
        id: data[i][0],
        timestamp: data[i][1],
        namaUsaha: data[i][2],
        tipe: data[i][3],
        pihakTerkait: data[i][4],
        kontakWa: data[i][5],
        nominal: data[i][6],
        tanggal: data[i][7],
        jatuhTempo: data[i][8],
        status: data[i][9],
        keterangan: data[i][10]
      });
    }
  }

  return {
    status: "success",
    count: items.length,
    items: items
  };
}

/**
 * Helper JSON Response dengan Header CORS Bebas
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
