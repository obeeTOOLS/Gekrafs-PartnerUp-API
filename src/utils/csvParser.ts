/**
 * CSV Parser RFC 4180 compliant untuk membaca data ekspor Google Sheets.
 * Menangani teks multiline, tanda petik ganda (""), dan koma di dalam string.
 */

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"';
      i++; // Skip escaped quote
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip CRLF
      }
      currentRow.push(currentCell.trim());
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export async function fetchSheetCsv(spreadsheetId: string, sheetName: string): Promise<string[][]> {
  const timestamp = Date.now();
  // Gunakan parameter timestamp & cache: 'no-store' agar browser (terutama Chrome Android)
  // tidak menyajikan CSV basi dari cache HTTP internal
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&_t=${timestamp}`;
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'text/csv',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache'
    }
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data sheet "${sheetName}" (HTTP ${response.status})`);
  }

  const text = await response.text();
  return parseCsv(text);
}
