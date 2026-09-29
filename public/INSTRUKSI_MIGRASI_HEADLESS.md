# PANDUAN MIGRASI HEADLESS - GEKRAFS PARTNERUP
**Organisasi:** GEKRAFS Kota Batu  
**Arsitektur:** Headless Google Apps Script + Google Sheets + React SPA (Vite + Tailwind CSS)

---

## 1. Keunggulan Arsitektur Headless
1. **100% Bebas Banner Peringatan Google**: Banner abu-abu *"Aplikasi ini dibuat oleh pengguna Google Apps Script"* tidak akan pernah muncul lagi karena aplikasi frontend berjalan di hosting independen (Vercel / GitHub Pages / Cloud Run), dan GAS hanya bertindak sebagai REST/JSON API backend.
2. **Kecepatan 0.01 Detik (Optimistic UI Update)**: Layar aplikasi seketika merespons klik dan input pengguna tanpa menunggu latensi jaringan Google Sheets. Data tersimpan di cache lokal dan otomatis tersinkronisasi di latar belakang.
3. **Data Eksisting Aman 100%**: Tidak ada sheet atau kolom yang dihapus. Struktur sheet `Pendaftaran`, `Peserta`, `Timeline`, `Jadwal Pelatihan`, `Asesmen`, dan `Kehadiran` tetap bekerja seperti sedia kala.

---

## 2. Cara Mengaktifkan Endpoint REST JSON di Google Apps Script

1. Buka project Apps Script Anda di **https://script.google.com**.
2. Buka file script Anda (misal `Code.gs` atau `Code[GekrafsBatu].gs`).
3. Anda dapat menyalin kode dari menu **Developer / Headless API** di web app ini (atau dari file `public/headless-Code.gs`).
4. Klik **Deploy** -> **Manage deployments**.
5. Klik ikon pensil **Edit**, pilih versi **New version**, dan pastikan:
   - **Execute as:** `Me (akun Anda)`
   - **Who has access:** `Anyone`
6. Klik **Deploy**.
7. Salin URL Web App yang berakhiran `/exec`.
8. Di web app React ini, masuk ke menu **Developer / Headless API**, masukkan URL `/exec` tersebut, lalu klik **Simpan URL**.

---

## 3. Cara Deploy Frontend ke Vercel (Gratis)

1. Upload seluruh folder proyek ini ke repositori **GitHub** Anda.
2. Buka **https://vercel.com** dan hubungkan akun GitHub Anda.
3. Klik **Add New Project** -> Pilih repositori `Gekrafs-PartnerUp`.
4. Vercel akan otomatis mendeteksi framework **Vite**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Klik **Deploy**.
6. Selesai! Web app modern Anda kini aktif di URL Vercel (misal `https://gekrafs-partnerup.vercel.app`) dengan performa kilat dan tampilan profesional.
