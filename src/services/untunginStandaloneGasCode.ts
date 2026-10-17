/**
 * ============================================================================
 * UNTUNGIN PRO API ENGINE — STANDALONE BACKEND GAS (v1.0)
 * ============================================================================
 * Proyek: UNTUNGIN - PRO API ENGINE (script.google.com)
 * Target Spreadsheet ID: 1l_MT50H0blcu771UYMm6Tqc4Q1R2s4U2iOglx-cW4kE
 * Arsitektur: Headless Serverless REST API untuk Database Kas & UMKM Mandiri
 * Sifat: 100% Terpisah & Decoupled dari PartnerUp
 * ============================================================================
 */

export const UNTUNGIN_STANDALONE_GAS_CODE = `/**
 * ============================================================================
 * UNTUNGIN PRO API ENGINE — STANDALONE BACKEND v1.0
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
        result = { status: "success", message: "PONG! Untungin Pro Engine Standalone Siap.", timestamp: new Date().toISOString() };
        break;

      case "initSheets":
        result = initUntunginDatabase();
        break;

      case "pushTransaksi":
        result = handlePushTransaksi(payload);
        break;

      case "deleteTransaksi":
        result = handleDeleteTransaksi(payload);
        break;

      case "pushBatchTransaksi":
        result = handlePushBatchTransaksi(payload);
        break;

      case "syncProfil":
        result = handleSyncProfil(payload);
        break;

      case "syncAkun":
        result = handleSyncAkun(payload);
        break;

      case "activateVoucher":
        result = handleActivateVoucher(payload);
        break;

      case "getKasData":
        result = handleGetKasData(payload);
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
 * Simpan atau perbarui transaksi kas tunggal (Smart Update vs Append)
 */
function handlePushTransaksi(p) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Untungin_Transaksi");
  if (!sheet) {
    initUntunginDatabase();
    sheet = ss.getSheetByName("Untungin_Transaksi");
  }

  const txId = (p.id || ("TX-" + Utilities.getUuid().substring(0, 8).toUpperCase())).trim();
  const nowStr = new Date().toISOString();
  const txDate = p.tanggal || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
  const namaUsaha = (p.namaUsaha || "UMKM").trim();
  const arusKas = p.arusKas || p.tipe || "Masuk";
  const kategori = p.kategori || "Umum";
  const nominal = Number(p.nominal) || 0;
  const rekening = p.rekening || p.akun || "Kas Tunai";
  const keterangan = p.keterangan || "-";
  const catatan = p.catatan || "-";

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
 * Hapus transaksi dari Vault Standalone (Delete Propagation)
 */
function handleDeleteTransaksi(p) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Untungin_Transaksi");
  if (!sheet) return { status: "success", message: "Tab transaksi belum dibuat" };

  const txId = (p.id || p.txId || "").trim();
  if (!txId) return { status: "error", message: "ID transaksi tidak disertakan" };

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  let namaUsaha = (p.namaUsaha || "").trim();

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
    const arusKas = t.arusKas || t.tipe || "Masuk";
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
 * Helper JSON Response dengan Header CORS Bebas
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
