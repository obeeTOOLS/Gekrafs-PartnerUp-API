import React from 'react';
import { 
  X, 
  Printer, 
  Wallet, 
  Key, 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Smartphone, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  Building2,
  Users,
  Terminal,
  Shield
} from 'lucide-react';
import { DEFAULT_KAS_PIN } from '../services/kasService';

interface PanduanAksesKasPinPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanduanAksesKasPinPdfModal: React.FC<PanduanAksesKasPinPdfModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in print:p-0 print:bg-white">
      {/* Backdrop */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 z-10 flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Sticky Top Header Controls (Hidden during print) */}
        <div className="sticky top-0 bg-[#001c3c] text-white p-4 px-6 rounded-t-2xl flex items-center justify-between z-20 print:hidden shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#ffc72c] font-black uppercase tracking-wider">
                Dokumen Resmi Panduan Operasional & Keamanan
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Buku Panduan Akses Buku Kas, Pengelolaan PIN & SOP Reset Developer
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-xs font-black text-white shadow transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (A4 Styled Layout) */}
        <div className="p-6 sm:p-10 bg-white space-y-7 text-slate-800 leading-relaxed print:p-4">
          
          {/* 1. KOP SURAT RESMI */}
          <div className="border-b-2 border-[#001c3c] pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-full bg-[#001c3c] text-white flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                  <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#ffffff" />
                  <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="#ffc72c" />
                  <text x="50" y="60" fontSize="22" fontWeight="bold" textAnchor="middle" fill="#001c3c">GK</text>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-[#001c3c] tracking-tight">
                  GEKRAFS KOTA BATU
                </h1>
                <p className="text-xs font-bold text-[#b8860b] uppercase tracking-wide">
                  Gerakan Ekonomi Kreatif Nasional &middot; DPC Kota Batu
                </p>
                <p className="text-[11px] text-slate-500">
                  Modul Laporan Keuangan Terpadu UMKM: <strong>Untungin &middot; PartnerUp</strong>
                </p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-500 font-mono">
              <div className="font-bold text-[#001c3c]">DOKUMEN PANDUAN PENGGUNA & SOP</div>
              <div>No: SOP-UNTUNGIN/KAS-PIN/2026/01</div>
              <div>Tanggal Rilis: {todayStr}</div>
              <div className="text-amber-700 font-bold uppercase">Klasifikasi: Panduan Peserta & Developer</div>
            </div>
          </div>

          {/* 2. JUDUL DOKUMEN */}
          <div className="text-center py-2 space-y-1 bg-gradient-to-r from-purple-50 via-slate-50 to-amber-50 rounded-xl p-4 border border-purple-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-0.5 rounded-full inline-block">
              MODUL KEUANGAN UNTUNGIN v1.3 &middot; PROTOKOL KEAMANAN DATA
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#001c3c] tracking-tight">
              PANDUAN AKSES BUKU KAS, PENGELOLAAN PIN PESERTA & PROSEDUR RESET DEVELOPER
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl mx-auto">
              Dokumen petunjuk teknis resmi bagi Pelaku Usaha UMKM untuk mengakses dan mengamankan catatan buku kas, serta panduan operasional bagi Lead Developer / Core Engineer untuk memulihkan PIN peserta yang lupa.
            </p>
          </div>

          {/* 3. BAB I: CARA AKSES BUKU KAS (UNTUNGIN) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#001c3c] border-b border-slate-200 pb-1.5">
              <Wallet className="w-4 h-4 text-purple-600" />
              <span>BAB I: PANDUAN CARA PESERTA MENGAKSES BUKU KAS (UNTUNGIN)</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Modul <strong>Untungin</strong> adalah sistem pencatatan keuangan dan laporan laba/rugi mandiri yang dirancang khusus untuk mendampingi UMKM dampingan Gekrafs Kota Batu. Seluruh data keuangan disimpan dalam ruang penyimpanan terisolasi (<em>multi-tenant isolated storage</em>) per unit usaha.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/60 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="text-xs font-black text-purple-950">Akses Cepat di HP (Bawah)</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pada layar ponsel, menu <strong>"💼 Kas"</strong> tersedia langsung di bilah navigasi bawah (bottom navigation bar) berwarna ungu di sebelah tab Direktori. Sentuh tombol ini untuk membuka Buku Kas kapan saja.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="text-xs font-black text-blue-950">Header Atas Layar</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pada bagian atas layar (baik ponsel maupun laptop), tersedia tombol berlabel <strong>"💼 Buku Kas"</strong> dengan latar ungu lembut di sebelah Direktori Ekraf.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="text-xs font-black text-amber-950">Menu Direktori UMKM</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Peserta juga dapat membuka Buku Kas usahanya melalui menu <strong>Direktori Ekraf</strong> &gt; klik kartu usaha milik sendiri &gt; klik tombol <strong>"Buka Buku Kas Untungin"</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* 4. BAB II: SISTEM KEAMANAN & PIN PENGAMAN KAS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#001c3c] border-b border-slate-200 pb-1.5">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>BAB II: SISTEM KEAMANAN & PIN PENGAMAN BUKU KAS</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Catatan pendapatan, pengeluaran, saldo rekening, dan laba kotor UMKM merupakan data privat yang sensitif. Untuk mencegah orang lain mengintip catatan uang usaha saat meminjam ponsel peserta, sistem menerapkan <strong>Layar Kunci PIN (PIN Lock Gate)</strong>:
            </p>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <h4 className="text-xs font-extrabold text-amber-900">
                  PIN Bawaan Standar Awal Peserta: <code className="bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-mono text-sm tracking-wider font-black">{DEFAULT_KAS_PIN}</code>
                </h4>
              </div>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside leading-relaxed pl-1">
                <li>Setiap peserta UMKM yang baru pertama kali membuka buku kas akan diminta memasukkan PIN awal standar: <strong>123456</strong>.</li>
                <li>Setelah PIN benar dimasukkan, buku kas langsung terbuka dan menampilkan seluruh fitur keuangan.</li>
                <li>Sesi buku kas akan tetap terbuka selama modal aktif. Apabila modal ditutup dan dibuka kembali, keamanan PIN akan kembali melindungi data.</li>
              </ul>
            </div>
          </div>

          {/* 5. BAB III: CARA PESERTA MENGUBAH PIN KAS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#001c3c] border-b border-slate-200 pb-1.5">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>BAB III: PANDUAN CARA PESERTA MENGUBAH PIN KAS SECARA MANDIRI</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Peserta UMKM berhak dan dianjurkan untuk mengganti PIN kas bawaan menjadi PIN unik pribadi agar kerahasiaan semakin terjamin. Langkah-langkahnya sebagai berikut:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                <span className="w-6 h-6 rounded-full bg-[#001c3c] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-[#001c3c]">Buka Buku Kas Usaha:</strong>
                  <p className="text-slate-600 text-[11px] mt-0.5">Masuk ke Buku Kas dengan memasukkan PIN aktif saat ini (standar awal: <code>123456</code>).</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                <span className="w-6 h-6 rounded-full bg-[#001c3c] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-[#001c3c]">Tekan Tombol "🔑 Ganti PIN":</strong>
                  <p className="text-slate-600 text-[11px] mt-0.5">Pada bagian kanan atas header modal Buku Kas (sebelah tombol mata privasi), tekan tombol <strong>"Ganti PIN"</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                <span className="w-6 h-6 rounded-full bg-[#001c3c] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-[#001c3c]">Isi Formulir Perubahan PIN:</strong>
                  <ul className="list-disc list-inside text-slate-600 text-[11px] mt-1 space-y-0.5">
                    <li><strong>PIN Lama:</strong> Masukkan PIN yang saat ini berlaku (misal: <code>123456</code>).</li>
                    <li><strong>PIN Baru:</strong> Masukkan PIN baru yang diinginkan (4 sampai 8 digit angka, misal: <code>262626</code>).</li>
                    <li><strong>Konfirmasi PIN Baru:</strong> Ulangi pengetikan PIN baru untuk memastikan tidak ada salah ketik.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                <span className="w-6 h-6 rounded-full bg-[#001c3c] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="text-[#001c3c]">Simpan PIN Baru:</strong>
                  <p className="text-slate-600 text-[11px] mt-0.5">Tekan tombol <strong>"Simpan PIN Baru"</strong>. Sistem akan langsung menyimpan PIN baru tersebut dan menampilkan notifikasi sukses.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 6. BAB IV: SOP RESET PIN BAGI DEVELOPER / ENGINEER */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#001c3c] border-b border-slate-200 pb-1.5">
              <Terminal className="w-4 h-4 text-purple-700" />
              <span>BAB IV: SOP RESET PIN BAGI DEVELOPER / ENGINEER (SOLUSI LUPA PIN)</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Untuk mengantisipasi peserta yang mengganti PIN lalu lupa di kemudian hari, <strong>Lead Developer</strong> (<code>obeetools@gmail.com</code>) dan <strong>Core Engineer</strong> (<code>loehendra@gmail.com</code>) dilengkapi hak istimewa (*super privilege*) untuk memulihkan PIN peserta dalam hitungan detik.
            </p>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/70 space-y-3">
              <h4 className="text-xs font-black text-purple-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-700" />
                <span>Prosedur Melalui Menu Developer Hub (Tab "🔐 Reset PIN Kas Peserta"):</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Langkah 1: Masuk ke Menu Dev Hub</strong> &gt; Pilih sub-tab <strong>"Reset PIN Kas Peserta"</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Langkah 2: Cari Peserta</strong> melalui kolom pencarian (ketikkan Nama Usaha, Pemilik, atau Nomor WhatsApp).
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Langkah 3: Pantau Status PIN Aktif</strong>:
                    <ul className="list-disc list-inside text-[11px] text-slate-600 mt-0.5 pl-2">
                      <li>Badge Kuning (<em>Standar: 123456</em>): Peserta belum pernah mengubah PIN.</li>
                      <li>Badge Hijau (<em>Diubah Peserta</em>): Menampilkan nilai PIN aktif yang sedang digunakan. Developer bahkan dapat membacakan PIN tersebut kepada peserta tanpa perlu meresetnya jika diinginkan.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Langkah 4: Pilih Metode Pemulihan</strong>:
                    <ul className="list-disc list-inside text-[11px] text-slate-600 mt-0.5 pl-2">
                      <li><strong>Tombol "⚡ Reset 123456":</strong> Seketika mengembalikan PIN peserta ke standar bawaan (123456) disertai konfirmasi terpusat <em>PartnerUp Says</em>.</li>
                      <li><strong>Tombol "✏️ Set Kustom":</strong> Membuka dialog untuk menetapkan PIN baru tertentu sesuai permintaan khusus peserta (misal: <em>202626</em>).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
              <div className="font-bold text-[#001c3c] flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Opsi Reset Cepat dari Modal Buku Kas:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Saat akun Developer membuka buku kas peserta (dari Portal Kurator atau Profil Modal), tombol emas <strong>"⚡ Reset PIN"</strong> selalu tersedia di header modal untuk perbaikan instan di tempat.
              </p>
            </div>
          </div>

          {/* 7. BAB V: MATRIKS HAK AKSES PERAN (CHEAT SHEET) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#001c3c] border-b border-slate-200 pb-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>BAB V: MATRIKS HAK AKSES & OTORISASI BUKU KAS</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-[#001c3c] text-white text-[11px] uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="py-2.5 px-3">Peran Pengguna</th>
                    <th className="py-2.5 px-3">Akses Data Kas</th>
                    <th className="py-2.5 px-3">Ganti PIN Sendiri</th>
                    <th className="py-2.5 px-3">Reset PIN Orang Lain</th>
                    <th className="py-2.5 px-3">Bypass Kunci PIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  <tr className="bg-white">
                    <td className="py-2.5 px-3 font-bold text-[#001c3c]">Peserta UMKM</td>
                    <td className="py-2.5 px-3">Hanya Usaha Sendiri</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">Ya (Mandiri)</td>
                    <td className="py-2.5 px-3 text-rose-600 font-semibold">Tidak Diizinkan</td>
                    <td className="py-2.5 px-3 text-slate-500">Tidak (Wajib PIN)</td>
                  </tr>
                  <tr className="bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-[#001c3c]">Kurator / Panitia</td>
                    <td className="py-2.5 px-3">Seluruh Peserta (Pantau)</td>
                    <td className="py-2.5 px-3 text-slate-500">—</td>
                    <td className="py-2.5 px-3 text-slate-500">Minta ke Developer</td>
                    <td className="py-2.5 px-3 text-amber-700 font-semibold">Mode Pantau</td>
                  </tr>
                  <tr className="bg-purple-50/60 font-semibold text-purple-950">
                    <td className="py-2.5 px-3 font-black text-purple-900">Lead Developer / Engineer</td>
                    <td className="py-2.5 px-3">Akses Penuh Seluruh Usaha</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-black">Ya (Mandiri)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-black">Ya (1-Klik / Kustom)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-black">Ya (Auto Bypass)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 8. LEMBAR TANDA TANGAN PENGESAHAN DOKUMEN */}
          <div className="pt-6 border-t-2 border-slate-200 text-xs">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div className="space-y-12">
                <div className="text-slate-600">
                  <div>Ditetapkan di: Kota Batu, Jawa Timur</div>
                  <div className="font-bold text-[#001c3c] mt-0.5">Tim Pengembang Sistem & Arsitektur:</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-extrabold text-[#001c3c] underline text-sm">
                    Lalu Mahendra Ali Akbar
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Lead Developer &middot; obeecreatives &middot; Gekrafs Batu
                  </div>
                  <div className="text-[10px] text-purple-700 font-mono">obeetools@gmail.com</div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="text-slate-600">
                  <div>Mengetahui & Menyetujui:</div>
                  <div className="font-bold text-[#001c3c] mt-0.5">Ketua DPC Gekrafs Kota Batu:</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-extrabold text-[#001c3c] underline text-sm">
                    Pimpinan DPC Gekrafs Kota Batu
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Gerakan Ekonomi Kreatif Nasional Kota Batu
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono">Periode Inkubasi 2026</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
