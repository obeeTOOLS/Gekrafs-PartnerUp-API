/**
 * Code.gs Headless Google Apps Script Template
 * Digunakan untuk backend REST/JSON API murni pada Google Apps Script.
 * Bebas 100% dari banner peringatan Google karena diakses secara headless via JSON.
 */

export const HEADLESS_GAS_CODE = `/**
 * ============================================================
 * GEKRAFS PARTNERUP - HEADLESS REST/JSON API BACKEND (Google Apps Script)
 * Organisasi: GEKRAFS Kota Batu
 * Database  : Google Sheets (Spreadsheet ID terlampir)
 * Output    : JSON murni (ContentService.MimeType.JSON) + CORS
 * ============================================================
 */

const SPREADSHEET_ID = '183uoyYw6opnr3w7T6oljvwuy5Rzs7GZE7fM3vi_pwm4';
const DRIVE_FOLDER_ID = '1z7bNsyau6tikjopZxSKljqY6ErdLXwz0';

const SHEET_PENDAFTARAN = 'Pendaftaran';
const SHEET_PESERTA = 'Peserta';
const SHEET_TIMELINE = 'Timeline';
const SHEET_JADWAL = 'Jadwal Pelatihan';
const SHEET_DASHBOARD = 'Dashboard';
const SHEET_ASESMEN = 'Asesmen';
const SHEET_KEHADIRAN = 'Kehadiran';
const SHEET_TUGAS = 'Tugas';
const SHEET_KAS_TRANSAKSI = 'Kas_Transaksi';
const SHEET_KAS_PROFIL = 'Kas_Profil';

const ASESMEN_KRITERIA = [
  'Kejelasan Model Bisnis',
  'Kualitas & Keunikan Produk/Jasa',
  'Branding & Kehadiran Digital',
  'Pengelolaan Keuangan Usaha',
  'Legalitas & Kelengkapan Dokumen',
  'Kesiapan Berkolaborasi & Belajar',
  'Dampak & Kontribusi ke Ekosistem Kreatif',
  'Leadership',
  'Operasional',
  'Marketing',
  'Financial',
  'Sales',
  'Service',
  'Growth',
  'Product'
];

const BAGIAN_3_KATEGORI = [
  'Leadership (Kepemimpinan)',
  'Finance (Keuangan)',
  'Operation (Operasional)',
  'Product (Produk/Jasa)',
  'Service (Layanan)',
  'Sales (Penjualan)',
  'Marketing (Pemasaran)',
  'Growth (Pertumbuhan)'
];

function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active && active.getId()) {
      return active;
    }
  } catch (e) {}
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'ping';
    const filterSesi = e && e.parameter && e.parameter.sesi;

    switch (action) {
      case 'ping':
        return createJsonResponse({ status: 'success', message: 'Gekrafs PartnerUp API Online', time: new Date() });

      case 'getTimeline':
        return createJsonResponse({ status: 'success', data: getTimeline() });

      case 'getJadwal':
      case 'getJadwalPelatihan':
        return createJsonResponse({ status: 'success', data: getJadwalPelatihan() });

      case 'getPeserta':
      case 'getPesertaList':
        return createJsonResponse({ status: 'success', data: getPesertaList(filterSesi) });

      case 'getDashboardStats':
        return createJsonResponse({ status: 'success', data: getDashboardStats(filterSesi) });

      case 'getAsesmenList':
        return createJsonResponse({ status: 'success', data: getAsesmenList(filterSesi) });

      case 'getRegisteredBusinessNames':
        return createJsonResponse({ status: 'success', data: getRegisteredBusinessNames() });

      case 'getKehadiranBySesi':
        const idSesi = e.parameter.idSesi;
        return createJsonResponse({ status: 'success', data: getKehadiranBySesi(idSesi) });

      case 'getTaskList':
      case 'getTasks':
        return createJsonResponse({ status: 'success', data: getTaskList() });

      case 'getKasData':
      case 'getKasTransactions':
        const kasNamaUsaha = e && e.parameter && e.parameter.namaUsaha;
        return createJsonResponse({
          status: 'success',
          data: getKasTransactions(kasNamaUsaha),
          accounts: getKasAccounts(kasNamaUsaha)
        });

      case 'getSettings':
        return createJsonResponse({
          status: 'success',
          data: {
            sesiAktif: getSesiAktif(),
            registrationDeadline: getRegistrationDeadline(),
            assessmentWindow: getAssessmentWindow(),
            isModeUjicoba: isModeUjicobaAktif()
          }
        });

      default:
        return createJsonResponse({
          status: 'success',
          service: 'Gekrafs PartnerUp Headless API',
          version: '2.0-headless',
          endpoints: [
            'getTimeline', 'getJadwal', 'getPeserta', 'getDashboardStats',
            'getAsesmenList', 'getRegisteredBusinessNames', 'getKehadiranBySesi', 'getSettings'
          ]
        });
    }
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockErr) {}

  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else {
      payload = e.parameter || {};
    }

    const action = payload.action;

    switch (action) {
      case 'submitForm':
        return createJsonResponse(submitForm(payload.data));

      case 'verifyPesertaIdentity':
        return createJsonResponse(verifyPesertaIdentity(payload.namaUsaha, payload.whatsapp));

      case 'submitAssessment':
        return createJsonResponse(submitAssessment(payload.data));

      case 'checkinKehadiran':
        return createJsonResponse(checkinKehadiran(payload.idSesi, payload.namaUsaha, payload.whatsapp));

      case 'initSheetKehadiran':
        return createJsonResponse({ status: 'success', message: inisialisasiSheetKehadiran() });

      case 'initAllSheets':
        return createJsonResponse({ status: 'success', message: inisialisasiSemuaTab() });

      case 'saveKehadiranManual':
        return createJsonResponse(saveKehadiranManual(payload.idSesi, payload.namaUsaha));

      case 'deleteKehadiranItem':
        return createJsonResponse(deleteKehadiranItem(payload.idSesi, payload.namaUsaha));

      case 'updateStatusKurasi':
        return createJsonResponse(updateStatusKurasi(payload.row, payload.status, payload.catatan));

      case 'saveTimelineItem':
        return createJsonResponse(saveTimelineItem(payload.item));

      case 'deleteTimelineItem':
        return createJsonResponse(deleteTimelineItem(payload.row));

      case 'saveJadwalItem':
        return createJsonResponse(saveJadwalItem(payload.item));

      case 'deleteJadwalItem':
        return createJsonResponse(deleteJadwalItem(payload.row));

      case 'setSesiAktif':
        return createJsonResponse(setSesiAktif(payload.namaSesi));

      case 'setRegistrationDeadline':
        return createJsonResponse(setRegistrationDeadline(payload.dateStr));

      case 'setAssessmentWindow':
        return createJsonResponse(setAssessmentWindow(payload.openDate, payload.closeDate));

      case 'setModeUjicoba':
        return createJsonResponse(setModeUjicoba(payload.aktif));

      case 'setSettings':
        const s = payload.settings || {};
        if (s.sesiAktif) setSesiAktif(s.sesiAktif);
        if (s.registrationDeadline) {
          setRegistrationDeadline(s.registrationDeadline);
          try {
            const tlSheet = getSpreadsheet().getSheetByName(SHEET_TIMELINE);
            if (tlSheet) {
              const tlRows = tlSheet.getDataRange().getValues();
              for (let r = 1; r < tlRows.length; r++) {
                if (String(tlRows[r][1] || '').toLowerCase().includes('pendaftaran') || Number(tlRows[r][0]) === 1) {
                  tlSheet.getRange(r + 1, 4).setValue(s.registrationDeadline);
                  break;
                }
              }
            }
          } catch (e) {}
        }
        if (s.assessmentOpenDate || s.assessmentCloseDate) {
          setAssessmentWindow(s.assessmentOpenDate, s.assessmentCloseDate);
        }
        if (s.modeUjicoba !== undefined) setModeUjicoba(s.modeUjicoba);
        return createJsonResponse({ status: 'success', message: 'Pengaturan dan sheet Timeline berhasil diselaraskan.' });

      case 'submitTask':
        return createJsonResponse(saveOrSubmitTask(payload.task, 'submitted'));

      case 'saveTaskDraft':
        return createJsonResponse(saveOrSubmitTask(payload.task, 'draft'));

      case 'reviewTask':
        return createJsonResponse(saveOrSubmitTask(payload.task, payload.task ? payload.task.status || 'reviewed' : 'reviewed'));

      case 'deleteTask':
        return createJsonResponse(deleteTaskRow(payload.id));

      case 'saveKasTransaction':
        return createJsonResponse(saveKasTransaction(payload.transaction));

      case 'saveKasTransactionsBatch':
        return createJsonResponse(saveKasTransactionsBatch(payload.transactions, payload.namaUsaha));

      case 'deleteKasTransaction':
        return createJsonResponse(deleteKasTransaction(payload.id, payload.namaUsaha));

      case 'saveKasAccounts':
      case 'saveKasProfile':
        return createJsonResponse(saveKasAccounts(payload.namaUsaha, payload.accounts, payload.pinData));

      case 'getKasData':
        return createJsonResponse({
          status: 'success',
          data: getKasTransactions(payload.namaUsaha),
          accounts: getKasAccounts(payload.namaUsaha)
        });

      case 'initSheetKas':
        return createJsonResponse({ status: 'success', message: inisialisasiSheetKas() });

      default:
        return createJsonResponse({ status: 'error', message: 'Aksi tidak dikenali: ' + action });
    }
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

// ============================================================
// MODUL INISIALISASI OTOMATIS SELURUH TAB SPREADSHEET
// ============================================================

/**
 * FUNGSI LANGSUNG RUN DI APPS SCRIPT:
 * Pilih fungsi 'inisialisasiSheetKehadiran' di toolbar atas Apps Script
 * lalu klik 'Jalankan / Run' (▶️) untuk membuat tab 'Kehadiran' beserta Header.
 */
function inisialisasiSheetKehadiran() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_KEHADIRAN);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_KEHADIRAN);
    Logger.log('Tab "' + SHEET_KEHADIRAN + '" baru berhasil dibuat.');
  }

  const headers = [
    'Timestamp', 
    'ID Sesi', 
    'Tanggal Sesi', 
    'Topik Sesi', 
    'Nama Usaha', 
    'Nomor WhatsApp', 
    'Sesi PartnerUp', 
    'Metode'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#001c3c');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    Logger.log('Header tab Kehadiran berhasil ditambahkan dan diformat rapi.');
  }

  return '✅ Tab "' + SHEET_KEHADIRAN + '" siap digunakan di Google Spreadsheet!';
}

/**
 * FUNGSI LANGSUNG RUN DI APPS SCRIPT:
 * Pilih fungsi 'inisialisasiSheetTugas' di toolbar atas Apps Script
 * lalu klik 'Jalankan / Run' (▶️) untuk membuat tab 'Tugas' beserta Header.
 */
function inisialisasiSheetTugas() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_TUGAS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TUGAS);
    Logger.log('Tab "' + SHEET_TUGAS + '" baru berhasil dibuat.');
  }

  const headers = [
    'Timestamp', 'ID Tugas', 'Nama Usaha', 'Nama Pemilik', 'Nomor WhatsApp',
    'Subsektor', 'Sesi PartnerUp', 'Status Tugas', 'Nilai (0-100)', 'Catatan Kurator',
    'Visi Usaha', 'Misi Usaha', 'Goal (Sasaran)', 'Objective (Target)', 'Nilai-nilai Usaha', 'Keahlian Organisasi',
    'Problem Solving (JSON)', 'Incremental (JSON)', 'Breakthrough (JSON)', 'Data Lengkap Task (JSON)'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#001c3c');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    Logger.log('Header tab Tugas berhasil dibuat dan diformat rapi.');
  }

  return '✅ Tab "' + SHEET_TUGAS + '" siap digunakan di Google Spreadsheet!';
}

/**
 * FUNGSI LANGSUNG RUN DI APPS SCRIPT:
 * Pilih fungsi 'inisialisasiSheetKas' di toolbar atas Apps Script
 * lalu klik 'Jalankan / Run' (▶️) untuk membuat tab 'Kas_Transaksi' dan 'Kas_Profil'.
 */
function inisialisasiSheetKas() {
  const ss = getSpreadsheet();
  
  // 1. Tab Kas_Transaksi
  let sheetTx = ss.getSheetByName(SHEET_KAS_TRANSAKSI);
  if (!sheetTx) {
    sheetTx = ss.insertSheet(SHEET_KAS_TRANSAKSI);
    Logger.log('Tab "' + SHEET_KAS_TRANSAKSI + '" baru berhasil dibuat.');
  }

  const txHeaders = [
    'Timestamp',
    'ID Transaksi',
    'Nama Usaha',
    'Tanggal (YYYY-MM-DD)',
    'Jenis (income/expense/transfer)',
    'Kategori',
    'Nominal (Rp)',
    'ID Akun Sumber',
    'ID Akun Tujuan',
    'Deskripsi / Catatan',
    'Dibuat Oleh',
    'Waktu Dibuat',
    'Data Lengkap (JSON)'
  ];

  if (sheetTx.getLastRow() === 0) {
    sheetTx.appendRow(txHeaders);
    const headerRange = sheetTx.getRange(1, 1, 1, txHeaders.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#001c3c');
    headerRange.setFontColor('#ffffff');
    sheetTx.setFrozenRows(1);
    Logger.log('Header tab ' + SHEET_KAS_TRANSAKSI + ' berhasil dibuat.');
  }

  // 2. Tab Kas_Profil (Akun & PIN)
  let sheetProfil = ss.getSheetByName(SHEET_KAS_PROFIL);
  if (!sheetProfil) {
    sheetProfil = ss.insertSheet(SHEET_KAS_PROFIL);
    Logger.log('Tab "' + SHEET_KAS_PROFIL + '" baru berhasil dibuat.');
  }

  const profileHeaders = [
    'Timestamp',
    'Nama Usaha',
    'Daftar Akun (JSON)',
    'PIN Kas',
    'Terakhir Diperbarui'
  ];

  if (sheetProfil.getLastRow() === 0) {
    sheetProfil.appendRow(profileHeaders);
    const pHeaderRange = sheetProfil.getRange(1, 1, 1, profileHeaders.length);
    pHeaderRange.setFontWeight('bold');
    pHeaderRange.setBackground('#001c3c');
    pHeaderRange.setFontColor('#ffffff');
    sheetProfil.setFrozenRows(1);
  }

  return '✅ Tab "' + SHEET_KAS_TRANSAKSI + '" dan "' + SHEET_KAS_PROFIL + '" siap digunakan di Google Spreadsheet!';
}

/**
 * Inisialisasi Seluruh Tab Sekaligus (Kehadiran, Tugas & Buku Kas)
 */
function inisialisasiSemuaTab() {
  inisialisasiSheetKehadiran();
  inisialisasiSheetTugas();
  inisialisasiSheetKas();
  return '✅ Seluruh tab database (Kehadiran, Tugas, Kas_Transaksi & Kas_Profil) berhasil disiapkan dan diformat rapi!';
}

function deleteTaskRow(id) {
  if (!id) return { status: 'error', message: 'ID Tugas kosong' };
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_TUGAS);
  if (!sheet) return { status: 'error', message: 'Tab Tugas belum dibuat' };
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1] || '').trim() === String(id).trim()) {
      sheet.deleteRow(i + 1);
      return { status: 'success', message: 'Baris tugas ' + id + ' berhasil dihapus.' };
    }
  }
  return { status: 'error', message: 'Data tugas dengan ID ' + id + ' tidak ditemukan di sheet.' };
}

function checkinKehadiran(idSesi, namaUsaha, whatsapp) {
  if (!idSesi || !namaUsaha) {
    return { status: 'error', message: 'ID Sesi dan Nama Usaha wajib diisi.' };
  }

  const sheet = getOrCreateSheet(SHEET_KEHADIRAN);
  const data = sheet.getDataRange().getValues();

  // Validasi apakah sheet kosong, buat header jika belum ada
  if (data.length === 0 || !data[0][0]) {
    sheet.appendRow([
      'Timestamp', 'ID Sesi', 'Tanggal Sesi', 'Topik Sesi', 'Nama Usaha', 'Nomor WhatsApp', 'Sesi PartnerUp', 'Metode'
    ]);
  }

  const cleanNama = String(namaUsaha).toLowerCase().trim();
  const cleanIdSesi = String(idSesi).trim();

  // Cek apakah peserta sudah pernah absensi pada sesi ini
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const rowIdSesi = String(rows[i][1] || '').trim();
    const rowNamaUsaha = String(rows[i][4] || '').toLowerCase().trim();

    if (rowIdSesi === cleanIdSesi && rowNamaUsaha === cleanNama) {
      return {
        status: 'already_checked_in',
        message: 'Peserta "' + namaUsaha + '" sudah tercatat hadir pada sesi ini sebelumnya. Tidak perlu isi ulang.',
        namaUsaha: namaUsaha
      };
    }
  }

  // Dapatkan topik & tanggal sesi dari sheet Jadwal
  let topikSesi = 'Sesi Pelatihan';
  let tanggalSesi = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd');
  try {
    const jadwalSheet = getSpreadsheet().getSheetByName(SHEET_JADWAL);
    if (jadwalSheet) {
      const jData = jadwalSheet.getDataRange().getValues();
      for (let j = 1; j < jData.length; j++) {
        if (String(jData[j][8] || '').trim() === cleanIdSesi) {
          tanggalSesi = jData[j][0] || tanggalSesi;
          topikSesi = jData[j][2] || topikSesi;
          break;
        }
      }
    }
  } catch (e) {}

  const nowFormatted = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
  sheet.appendRow([
    nowFormatted,
    cleanIdSesi,
    tanggalSesi,
    topikSesi,
    namaUsaha,
    whatsapp || '',
    getSesiAktif(),
    'Self Check-in (Web Apps)'
  ]);

  return {
    status: 'success',
    message: 'Kehadiran untuk ' + namaUsaha + ' berhasil dicatat!',
    namaUsaha: namaUsaha,
    topik: topikSesi
  };
}

function saveKehadiranManual(idSesi, namaUsaha) {
  return checkinKehadiran(idSesi, namaUsaha, '-');
}

function deleteKehadiranItem(idSesi, namaUsaha) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_KEHADIRAN);
  if (!sheet) return { status: 'error', message: 'Sheet Kehadiran tidak ditemukan.' };

  const cleanNama = String(namaUsaha).toLowerCase().trim();
  const cleanId = String(idSesi).trim();
  const rows = sheet.getDataRange().getValues();

  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][1]).trim() === cleanId && String(rows[i][4]).toLowerCase().trim() === cleanNama) {
      sheet.deleteRow(i + 1);
      return { status: 'success', message: 'Presensi berhasil dihapus.' };
    }
  }
  return { status: 'error', message: 'Data presensi tidak ditemukan.' };
}

function getKehadiranBySesi(idSesi) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_KEHADIRAN);
  if (!sheet) return { hadir: [], totalHadir: 0 };

  const rows = sheet.getDataRange().getValues();
  const cleanId = String(idSesi).trim();
  const hadir = [];

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]).trim() === cleanId) {
      hadir.push({
        timestamp: rows[i][0],
        idSesi: rows[i][1],
        tanggalSesi: rows[i][2],
        topikSesi: rows[i][3],
        namaUsaha: rows[i][4],
        whatsapp: rows[i][5],
        sesiPartnerUp: rows[i][6],
        metode: rows[i][7]
      });
    }
  }
  return { hadir: hadir, totalHadir: hadir.length };
}

// ============================================================
// MODUL TIMELINE PROGRAM
// ============================================================

function getTimeline() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_TIMELINE);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  const list = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1]) {
      list.push({
        row: i + 1,
        urutan: rows[i][0] || i,
        tahapan: rows[i][1],
        tanggalMulai: rows[i][2] ? Utilities.formatDate(new Date(rows[i][2]), 'Asia/Jakarta', 'yyyy-MM-dd') : '',
        tanggalSelesai: rows[i][3] ? Utilities.formatDate(new Date(rows[i][3]), 'Asia/Jakarta', 'yyyy-MM-dd') : '',
        keterangan: rows[i][4] || ''
      });
    }
  }
  return list;
}

function saveTimelineItem(item) {
  const sheet = getOrCreateSheet(SHEET_TIMELINE);
  const rows = sheet.getDataRange().getValues();
  let targetRow = item.row ? Number(item.row) : 0;

  // Jika row tidak valid atau tidak cocok, cari baris berdasarkan urutan atau nama tahapan
  if (!targetRow || targetRow < 2 || targetRow > rows.length) {
    for (let i = 1; i < rows.length; i++) {
      if (
        (item.urutan !== undefined && Number(rows[i][0]) === Number(item.urutan)) ||
        (item.tahapan && String(rows[i][1] || '').toLowerCase().trim() === String(item.tahapan).toLowerCase().trim())
      ) {
        targetRow = i + 1;
        break;
      }
    }
  }

  if (targetRow >= 2 && targetRow <= sheet.getLastRow()) {
    sheet.getRange(targetRow, 1, 1, 5).setValues([[
      item.urutan || 1,
      item.tahapan || '',
      item.tanggalMulai || '',
      item.tanggalSelesai || '',
      item.keterangan || ''
    ]]);
    return { status: 'success', message: 'Tahapan timeline baris ' + targetRow + ' berhasil diperbarui.' };
  } else {
    sheet.appendRow([
      item.urutan || sheet.getLastRow(),
      item.tahapan || 'Tahapan Baru',
      item.tanggalMulai || '',
      item.tanggalSelesai || '',
      item.keterangan || ''
    ]);
    return { status: 'success', message: 'Tahapan timeline baru berhasil ditambahkan.' };
  }
}

function deleteTimelineItem(row) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_TIMELINE);
  if (sheet && row >= 2 && row <= sheet.getLastRow()) {
    sheet.deleteRow(row);
    return { status: 'success', message: 'Tahapan timeline berhasil dihapus.' };
  }
  return { status: 'error', message: 'Baris timeline tidak ditemukan.' };
}

// ============================================================
// MODUL JADWAL PELATIHAN
// ============================================================

function getJadwalPelatihan() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_JADWAL);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  const list = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][2]) {
      list.push({
        row: i + 1,
        tanggal: rows[i][0] ? Utilities.formatDate(new Date(rows[i][0]), 'Asia/Jakarta', 'yyyy-MM-dd') : '',
        waktu: rows[i][1] || '',
        topik: rows[i][2],
        pemateri: rows[i][3] || '-',
        lokasi: rows[i][4] || 'Kota Batu',
        catatan: rows[i][5] || '',
        linkMateri: rows[i][7] || '',
        idSesi: rows[i][8] || ('sesi-' + i)
      });
    }
  }
  return list;
}

function saveJadwalItem(item) {
  const sheet = getOrCreateSheet(SHEET_JADWAL);
  const idSesi = item.idSesi || ('sesi-' + Utilities.getUuid().slice(0, 8));
  if (item.row && item.row >= 2) {
    sheet.getRange(item.row, 1, 1, 9).setValues([[
      item.tanggal || '',
      item.waktu || '',
      item.topik || '',
      item.pemateri || '-',
      item.lokasi || 'Kota Batu',
      item.catatan || '',
      '',
      item.linkMateri || '',
      idSesi
    ]]);
    return { status: 'success', message: 'Jadwal berhasil diperbarui.' };
  } else {
    sheet.appendRow([
      item.tanggal || '',
      item.waktu || '',
      item.topik || '',
      item.pemateri || '-',
      item.lokasi || 'Kota Batu',
      item.catatan || '',
      '',
      item.linkMateri || '',
      idSesi
    ]);
    return { status: 'success', message: 'Jadwal baru berhasil disimpan.' };
  }
}

function deleteJadwalItem(row) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_JADWAL);
  if (sheet && row >= 2 && row <= sheet.getLastRow()) {
    sheet.deleteRow(row);
    return { status: 'success', message: 'Jadwal berhasil dihapus.' };
  }
  return { status: 'error', message: 'Baris jadwal tidak valid.' };
}

// ============================================================
// MODUL PESERTA & KURASI
// ============================================================

function getPesertaList(filterSesi) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_PESERTA);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  const list = [];
  const cleanFilter = filterSesi ? String(filterSesi).toLowerCase().trim() : '';

  for (let i = 1; i < rows.length; i++) {
    const sesi = String(rows[i][8] || rows[i][9] || '').trim();
    if (!cleanFilter || sesi.toLowerCase() === cleanFilter) {
      list.push({
        row: i + 1,
        timestamp: rows[i][0],
        namaUsaha: rows[i][1],
        namaPemilik: rows[i][2],
        subsektor: rows[i][3],
        whatsapp: String(rows[i][4]),
        email: rows[i][5],
        statusKurasi: rows[i][6] || 'Belum Direview',
        catatanKurator: rows[i][7] || '',
        sesi: sesi || 'Sesi 2'
      });
    }
  }
  return list;
}

function getRegisteredBusinessNames() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_PESERTA);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  const names = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1]) names.push(String(rows[i][1]).trim());
  }
  return names;
}

function verifyPesertaIdentity(namaUsaha, cred) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_PESERTA);
  if (!sheet) return { verified: false, message: 'Sheet peserta belum tersedia.' };

  const rows = sheet.getDataRange().getValues();
  const cleanNama = String(namaUsaha).toLowerCase().trim();
  const cleanCred = String(cred).replace(/[^0-9]/g, '');

  for (let i = 1; i < rows.length; i++) {
    const rowNama = String(rows[i][1]).toLowerCase().trim();
    const rowWa = String(rows[i][4]).replace(/[^0-9]/g, '');

    if (rowNama === cleanNama) {
      if (cleanCred && (rowWa.endsWith(cleanCred) || cleanCred.endsWith(rowWa))) {
        return { verified: true, namaUsaha: rows[i][1], namaPemilik: rows[i][2] };
      }
    }
  }
  return { verified: false, message: 'Identitas nomor WhatsApp tidak cocok dengan pendaftaran.' };
}

function updateStatusKurasi(row, status, catatan) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_PESERTA);
  if (!sheet || row < 2 || row > sheet.getLastRow()) {
    return { status: 'error', message: 'Baris peserta tidak ditemukan.' };
  }
  sheet.getRange(row, 8).setValue(status);
  if (catatan !== undefined) {
    sheet.getRange(row, 9).setValue(catatan);
  }
  return { status: 'success', message: 'Status kurasi berhasil diperbarui di spreadsheet.' };
}

// ============================================================
// MODUL ASESMEN MANDIRI
// ============================================================

function getAsesmenList(filterSesi) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_ASESMEN);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  const list = [];
  const cleanFilter = filterSesi ? String(filterSesi).toLowerCase().trim() : '';

  for (let i = 1; i < rows.length; i++) {
    const sesi = String(rows[i][46] || 'Sesi 2').trim();
    if (!cleanFilter || sesi.toLowerCase() === cleanFilter) {
      list.push({
        row: i + 1,
        timestamp: rows[i][0],
        namaUsaha: rows[i][1],
        whatsapp: String(rows[i][2]),
        totalSkor: Number(rows[i][33]) || 0,
        poinBisaAjarkan: rows[i][34] || '-',
        poinPerluDipelajari: rows[i][35] || '-',
        sesi: sesi
      });
    }
  }
  return list;
}

function submitAssessment(data) {
  const sheet = getOrCreateSheet(SHEET_ASESMEN);
  const nowFormatted = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
  
  const rowData = [
    nowFormatted,
    data.namaUsaha || '',
    data.whatsapp || ''
  ];

  // 15 Kriteria skor & catatan
  let totalSkor = 0;
  for (let i = 0; i < 15; i++) {
    const k = (data.kriteria && data.kriteria[i]) || { skor: 0, catatan: '' };
    rowData.push(k.skor);
    rowData.push(k.catatan);
    totalSkor += Number(k.skor) || 0;
  }

  rowData.push(totalSkor);
  rowData.push(data.poinBisaAjarkan || '-');
  rowData.push(data.poinPerluDipelajari || '-');

  // 8 Bagian rata-rata
  for (let b = 0; b < 8; b++) {
    const bg = (data.bagian3 && data.bagian3[b]) || { skorRataRata: 0 };
    rowData.push(bg.skorRataRata);
  }

  rowData.push(JSON.stringify(data.bagian3 || []));
  rowData.push(data.materiBisaAjarkan || '-');
  rowData.push(getSesiAktif());

  sheet.appendRow(rowData);
  return { status: 'success', message: 'Asesmen berhasil dicatat di sheet!', totalSkor: totalSkor };
}

function submitForm(formData) {
  const sheet = getOrCreateSheet(SHEET_PENDAFTARAN);
  const nowFormatted = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
  sheet.appendRow([
    nowFormatted,
    formData.namaUsaha || '',
    formData.namaPemilik || '',
    formData.subsektor || '',
    formData.whatsapp || '',
    formData.email || '',
    formData.kotaKabupaten || '',
    formData.alamatUsaha || '',
    formData.omzet || '',
    formData.nib || '',
    formData.instagram || '',
    formData.tiktok || '',
    formData.marketplace || '',
    formData.deskripsi || ''
  ]);
  return { status: 'success', message: 'Pendaftaran berhasil dikirim ke Google Sheets.' };
}

// ============================================================
// MODUL DASHBOARD & SETTINGS
// ============================================================

function getDashboardStats(filterSesi) {
  const sheetPeserta = getSpreadsheet().getSheetByName(SHEET_PESERTA);
  if (!sheetPeserta) return { total: 0, diterima: 0, ditolak: 0, belum: 0 };

  const rows = sheetPeserta.getDataRange().getValues();
  let total = 0, diterima = 0, ditolak = 0, belum = 0;

  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][2]) continue;
    total++;
    const st = String(rows[i][7] || '').toLowerCase();
    if (st.includes('terima') || st.includes('lolos')) diterima++;
    else if (st.includes('tolak')) ditolak++;
    else belum++;
  }
  return { total: total, diterima: diterima, ditolak: ditolak, belum: belum };
}

function getSesiAktif() {
  const prop = PropertiesService.getScriptProperties().getProperty('SESI_AKTIF');
  return prop || 'Sesi 2';
}

function setSesiAktif(namaSesi) {
  if (namaSesi) {
    PropertiesService.getScriptProperties().setProperty('SESI_AKTIF', String(namaSesi));
  }
  return { status: 'success', sesiAktif: getSesiAktif() };
}

function getRegistrationDeadline() {
  return PropertiesService.getScriptProperties().getProperty('REG_DEADLINE') || '2026-10-31';
}

function setRegistrationDeadline(dateStr) {
  if (dateStr) {
    PropertiesService.getScriptProperties().setProperty('REG_DEADLINE', String(dateStr));
  }
  return { status: 'success', registrationDeadline: getRegistrationDeadline() };
}

function getAssessmentWindow() {
  const openDate = PropertiesService.getScriptProperties().getProperty('ASSESS_OPEN') || '2026-09-01';
  const closeDate = PropertiesService.getScriptProperties().getProperty('ASSESS_CLOSE') || '2026-11-15';
  return { openDate: openDate, closeDate: closeDate };
}

function setAssessmentWindow(openDate, closeDate) {
  if (openDate) PropertiesService.getScriptProperties().setProperty('ASSESS_OPEN', String(openDate));
  if (closeDate) PropertiesService.getScriptProperties().setProperty('ASSESS_CLOSE', String(closeDate));
  return { status: 'success', window: getAssessmentWindow() };
}

function isModeUjicobaAktif() {
  return PropertiesService.getScriptProperties().getProperty('MODE_UJICOBA') === 'true';
}

function setModeUjicoba(aktif) {
  PropertiesService.getScriptProperties().setProperty('MODE_UJICOBA', aktif ? 'true' : 'false');
  return { status: 'success', modeUjicoba: aktif };
}

// ============================================================
// MODUL TUGAS & LEMBAR KERJA STRATEGIS (OTOMATIS MEMBUAT TAB 'Tugas')
// ============================================================

function saveOrSubmitTask(task, forceStatus) {
  if (!task || !task.namaUsaha) {
    return { status: 'error', message: 'Data tugas tidak lengkap atau Nama Usaha kosong.' };
  }

  const sheet = getOrCreateSheet(SHEET_TUGAS);
  const data = sheet.getDataRange().getValues();

  // Buat baris header otomatis jika tab baru dibuat
  if (data.length === 0 || !data[0][0]) {
    sheet.appendRow([
      'Timestamp',
      'ID Tugas',
      'Nama Usaha',
      'Nama Pemilik',
      'Nomor WhatsApp',
      'Subsektor',
      'Sesi PartnerUp',
      'Status Tugas',
      'Nilai (0-100)',
      'Catatan Kurator',
      'Visi Usaha',
      'Misi Usaha',
      'Goal (Sasaran)',
      'Objective (Target)',
      'Nilai-nilai Usaha',
      'Keahlian Organisasi',
      'Problem Solving (JSON)',
      'Incremental (JSON)',
      'Breakthrough (JSON)',
      'Data Lengkap Task (JSON)'
    ]);
  }

  const cleanNama = String(task.namaUsaha).toLowerCase().trim();
  const rows = sheet.getDataRange().getValues();
  let targetRow = -1;

  for (let i = 1; i < rows.length; i++) {
    const rowId = String(rows[i][1] || '').trim();
    const rowNama = String(rows[i][2] || '').toLowerCase().trim();
    if ((task.id && rowId === String(task.id).trim()) || rowNama === cleanNama) {
      targetRow = i + 1;
      break;
    }
  }

  const nowFormatted = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
  const statusToSave = forceStatus || task.status || 'draft';
  const psStr = task.matriks && task.matriks.problemSolving ? JSON.stringify(task.matriks.problemSolving) : '';
  const incStr = task.matriks && task.matriks.incremental ? JSON.stringify(task.matriks.incremental) : '';
  const btStr = task.matriks && task.matriks.breakthrough ? JSON.stringify(task.matriks.breakthrough) : '';
  const fullJson = JSON.stringify(task);

  const rowValues = [
    nowFormatted,
    task.id || ('TASK-' + new Date().getTime()),
    task.namaUsaha,
    task.namaPemilik || '',
    task.whatsapp || '',
    task.subsektor || 'Kuliner',
    task.sesiPartnerUp || getSesiAktif(),
    statusToSave,
    task.nilai !== undefined && task.nilai !== null ? task.nilai : '',
    task.catatanKurator || '',
    task.visi || '',
    task.misi || '',
    task.goal || '',
    task.objective || '',
    task.nilaiUsaha || '',
    task.keahlianOrganisasi || '',
    psStr,
    incStr,
    btStr,
    fullJson
  ];

  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    return { 
      status: 'success', 
      message: 'Lembar kerja tugas untuk "' + task.namaUsaha + '" berhasil diperbarui di spreadsheet!', 
      row: targetRow 
    };
  } else {
    sheet.appendRow(rowValues);
    return { 
      status: 'success', 
      message: 'Lembar kerja tugas untuk "' + task.namaUsaha + '" berhasil disimpan ke sheet Tugas!', 
      row: sheet.getLastRow() 
    };
  }
}

function getTaskList() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_TUGAS);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const list = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[2]) continue;

    let fullTask = null;
    try {
      if (row[19]) fullTask = JSON.parse(row[19]);
    } catch (e) {}

    if (fullTask && fullTask.namaUsaha) {
      list.push(fullTask);
    } else {
      list.push({
        id: String(row[1] || ('TASK-' + i)),
        namaUsaha: String(row[2] || ''),
        namaPemilik: String(row[3] || ''),
        whatsapp: String(row[4] || ''),
        subsektor: String(row[5] || 'Kuliner'),
        sesiPartnerUp: String(row[6] || 'Sesi 2'),
        status: String(row[7] || 'draft'),
        nilai: row[8] ? Number(row[8]) : undefined,
        catatanKurator: String(row[9] || ''),
        visi: String(row[10] || ''),
        misi: String(row[11] || ''),
        goal: String(row[12] || ''),
        objective: String(row[13] || ''),
        nilaiUsaha: String(row[14] || ''),
        keahlianOrganisasi: String(row[15] || ''),
        updatedAt: String(row[0] || '')
      });
    }
  }
  return list;
}

// ============================================================
// MODUL BUKU KAS & ARUS KEUANGAN UMKM (UNTUNGIN HYBRID)
// ============================================================

function saveKasTransaction(tx) {
  if (!tx || !tx.namaUsaha) {
    return { status: 'error', message: 'Data transaksi tidak lengkap atau Nama Usaha kosong.' };
  }

  const sheet = getOrCreateSheet(SHEET_KAS_TRANSAKSI);
  const data = sheet.getDataRange().getValues();

  if (data.length === 0 || !data[0][0]) {
    sheet.appendRow([
      'Timestamp',
      'ID Transaksi',
      'Nama Usaha',
      'Tanggal (YYYY-MM-DD)',
      'Jenis (income/expense/transfer)',
      'Kategori',
      'Nominal (Rp)',
      'ID Akun Sumber',
      'ID Akun Tujuan',
      'Deskripsi / Catatan',
      'Dibuat Oleh',
      'Waktu Dibuat',
      'Data Lengkap (JSON)'
    ]);
  }

  const cleanId = String(tx.id || '').trim();
  const rows = sheet.getDataRange().getValues();
  let targetRow = -1;

  if (cleanId) {
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][1] || '').trim() === cleanId) {
        targetRow = i + 1;
        break;
      }
    }
  }

  const nowFormatted = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
  const fullJson = JSON.stringify(tx);

  const rowValues = [
    nowFormatted,
    tx.id || ('tx_' + new Date().getTime()),
    tx.namaUsaha,
    tx.date || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd'),
    tx.type || 'income',
    tx.category || 'Umum',
    Number(tx.amount) || 0,
    tx.accountId || '',
    tx.toAccountId || '',
    tx.desc || '',
    tx.createdBy || 'Peserta',
    tx.createdAt || nowFormatted,
    fullJson
  ];

  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    return { 
      status: 'success', 
      message: 'Transaksi kas ' + cleanId + ' berhasil diperbarui di spreadsheet!', 
      row: targetRow 
    };
  } else {
    sheet.appendRow(rowValues);
    return { 
      status: 'success', 
      message: 'Transaksi kas berhasil dicatat ke spreadsheet!', 
      row: sheet.getLastRow(),
      id: tx.id 
    };
  }
}

function saveKasTransactionsBatch(transactions, namaUsaha) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { status: 'success', count: 0, message: 'Tidak ada transaksi untuk disinkronkan.' };
  }

  let count = 0;
  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    if (tx) {
      if (!tx.namaUsaha && namaUsaha) tx.namaUsaha = namaUsaha;
      saveKasTransaction(tx);
      count++;
    }
  }

  return {
    status: 'success',
    count: count,
    message: count + ' transaksi kas berhasil disimpan ke spreadsheet.'
  };
}

function deleteKasTransaction(id, namaUsaha) {
  if (!id) return { status: 'error', message: 'ID Transaksi kosong.' };
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_KAS_TRANSAKSI);
  if (!sheet) return { status: 'error', message: 'Tab ' + SHEET_KAS_TRANSAKSI + ' belum dibuat.' };

  const cleanId = String(id).trim();
  const cleanNama = namaUsaha ? String(namaUsaha).toLowerCase().trim() : '';
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    const rowId = String(rows[i][1] || '').trim();
    const rowNama = String(rows[i][2] || '').toLowerCase().trim();
    if (rowId === cleanId && (!cleanNama || rowNama === cleanNama)) {
      sheet.deleteRow(i + 1);
      return { status: 'success', message: 'Transaksi kas ' + id + ' berhasil dihapus dari spreadsheet.' };
    }
  }

  return { status: 'error', message: 'Transaksi dengan ID ' + id + ' tidak ditemukan di sheet.' };
}

function getKasTransactions(namaUsaha) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_KAS_TRANSAKSI);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const cleanNama = namaUsaha ? String(namaUsaha).toLowerCase().trim() : '';
  const list = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[1]) continue;

    const rowNama = String(row[2] || '').toLowerCase().trim();
    if (cleanNama && rowNama !== cleanNama) continue;

    let parsedTx = null;
    try {
      if (row[12]) parsedTx = JSON.parse(row[12]);
    } catch (e) {}

    if (parsedTx && parsedTx.id) {
      list.push(parsedTx);
    } else {
      list.push({
        id: String(row[1] || ''),
        namaUsaha: String(row[2] || ''),
        date: String(row[3] || ''),
        type: String(row[4] || 'income'),
        category: String(row[5] || 'Umum'),
        amount: Number(row[6]) || 0,
        accountId: String(row[7] || ''),
        toAccountId: row[8] ? String(row[8]) : undefined,
        desc: String(row[9] || ''),
        createdBy: String(row[10] || 'Peserta'),
        createdAt: String(row[11] || '')
      });
    }
  }

  list.sort(function(a, b) {
    const dateA = a.date || '';
    const dateB = b.date || '';
    return dateB.localeCompare(dateA);
  });

  return list;
}

function saveKasAccounts(namaUsaha, accounts, pinData) {
  if (!namaUsaha) return { status: 'error', message: 'Nama Usaha kosong.' };

  const sheet = getOrCreateSheet(SHEET_KAS_PROFIL);
  const data = sheet.getDataRange().getValues();

  if (data.length === 0 || !data[0][0]) {
    sheet.appendRow([
      'Timestamp',
      'Nama Usaha',
      'Daftar Akun (JSON)',
      'PIN Kas',
      'Terakhir Diperbarui'
    ]);
  }

  const cleanNama = String(namaUsaha).toLowerCase().trim();
  const rows = sheet.getDataRange().getValues();
  let targetRow = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1] || '').toLowerCase().trim() === cleanNama) {
      targetRow = i + 1;
      break;
    }
  }

  const nowFormatted = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
  const accountsJson = Array.isArray(accounts) ? JSON.stringify(accounts) : '';
  const pinStr = (pinData && pinData.pin) ? String(pinData.pin) : '';

  const rowValues = [
    nowFormatted,
    namaUsaha,
    accountsJson,
    pinStr,
    nowFormatted
  ];

  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { status: 'success', message: 'Profil kas usaha "' + namaUsaha + '" berhasil disimpan ke spreadsheet.' };
}

function getKasAccounts(namaUsaha) {
  if (!namaUsaha) return null;
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_KAS_PROFIL);
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null;

  const cleanNama = String(namaUsaha).toLowerCase().trim();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1] || '').toLowerCase().trim() === cleanNama) {
      let accounts = null;
      try {
        if (data[i][2]) accounts = JSON.parse(data[i][2]);
      } catch (e) {}

      return {
        namaUsaha: String(data[i][1] || ''),
        accounts: accounts || [],
        pin: String(data[i][3] || ''),
        lastUpdated: String(data[i][4] || '')
      };
    }
  }
  return null;
}
`;
