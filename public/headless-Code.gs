/**
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

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action;
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

      default:
        return createJsonResponse({ status: 'error', message: 'Aksi tidak dikenali: ' + action });
    }
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}
