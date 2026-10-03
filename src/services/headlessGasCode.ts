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
// MODUL KEHADIRAN (DENGAN PENGECEKAN DUPLIKASI KETAT)
// ============================================================

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
  if (item.row && item.row >= 2) {
    sheet.getRange(item.row, 1, 1, 5).setValues([[
      item.urutan || 1,
      item.tahapan || '',
      item.tanggalMulai || '',
      item.tanggalSelesai || '',
      item.keterangan || ''
    ]]);
    return { status: 'success', message: 'Tahapan timeline berhasil diperbarui.' };
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
    const sesi = String(rows[i][9] || '').trim();
    if (!cleanFilter || sesi.toLowerCase() === cleanFilter) {
      list.push({
        row: i + 1,
        timestamp: rows[i][1],
        namaUsaha: rows[i][2],
        namaPemilik: rows[i][3],
        subsektor: rows[i][4],
        whatsapp: String(rows[i][5]),
        email: rows[i][6],
        statusKurasi: rows[i][7] || 'Belum Direview',
        catatanKurator: rows[i][8] || '',
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
    if (rows[i][2]) names.push(String(rows[i][2]).trim());
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
    const rowNama = String(rows[i][2]).toLowerCase().trim();
    const rowWa = String(rows[i][5]).replace(/[^0-9]/g, '');

    if (rowNama === cleanNama) {
      if (cleanCred && (rowWa.endsWith(cleanCred) || cleanCred.endsWith(rowWa))) {
        return { verified: true, namaUsaha: rows[i][2], namaPemilik: rows[i][3] };
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
`;
