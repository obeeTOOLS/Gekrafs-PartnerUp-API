import {
  Bagian3CategoryDef,
  TimelineItem,
  JadwalItem,
  PesertaItem,
  AsesmenItem,
  AppSettings,
  KehadiranItem
} from '../types';

export const ASESMEN_KRITERIA = [
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

export const BAGIAN_3_KATEGORI = [
  'Leadership (Kepemimpinan)',
  'Finance (Keuangan)',
  'Operation (Operasional)',
  'Product (Produk/Jasa)',
  'Service (Layanan)',
  'Sales (Penjualan)',
  'Marketing (Pemasaran)',
  'Growth (Pertumbuhan)'
];

export const RADAR_CATEGORIES = [
  'Leadership',
  'Finance',
  'Operation',
  'Product',
  'Service',
  'Sales',
  'Marketing',
  'Growth'
];

export const SUBSEKTOR_LIST = [
  'Kuliner',
  'Fashion',
  'Kriya / Kerajinan',
  'Desain Produk',
  'Desain Grafis / Komunikasi Visual',
  'Fotografi',
  'Film, Animasi & Video',
  'Musik',
  'Seni Rupa',
  'Lainnya'
];

export const KOTA_LIST = [
  'Kota Batu',
  'Kabupaten Malang',
  'Kota Malang',
  'Kota Surabaya',
  'Kabupaten Pasuruan',
  'Kabupaten Mojokerto',
  'Lainnya'
];

export const OMZET_OPTIONS = [
  'Di bawah Rp50 juta',
  'Rp50 juta – Rp300 juta',
  'Rp300 juta – Rp2,5 miliar',
  'Di atas Rp2,5 miliar'
];

export const BAGIAN_3_DEFINITIONS: Bagian3CategoryDef[] = [
  {
    kategori: 'Leadership (Kepemimpinan)',
    pertanyaan: [
      {
        teks: 'Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?',
        opsi: [
          'Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.',
          'Saya mulai mendelegasikan tugas teknis, tapi mengawasi setiap gerak-gerik tim secara berlebihan.',
          'Saya memiliki tim pengelola, tapi setiap keputusan dan masalah teknis tetap menunggu penyelesaian dari saya.',
          'Saya berfokus pada evaluasi dan strategi; operasional harian sudah berjalan sesuai panduan kerja.',
          'Bisnis berjalan terstruktur dan terus bertumbuh tanpa bergantung pada kehadiran fisik saya setiap hari.'
        ]
      },
      {
        teks: 'Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?',
        opsi: [
          'Tidak ada komunikasi arah bisnis. Tim hanya datang, bekerja sesuai perintah, dan pulang.',
          'Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini.',
          'Evaluasi dan penyampaian target hanya dilakukan secara reaktif saat ada masalah atau omset turun.',
          'Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala.',
          'Tim sangat memahami tujuan besar bisnis ini dan berani mengambil inisiatif mandiri untuk mencapainya tanpa harus selalu diperintah.'
        ]
      },
      {
        teks: 'Bagaimana cara Anda membuat keputusan strategis dan krusial?',
        opsi: [
          'Berdasarkan insting spontan atau kepanikan saat ada masalah mendadak.',
          'Berdasarkan asumsi dan selera pribadi saya semata, tanpa melihat data lapangan.',
          'Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.',
          'Keputusan selalu diambil berdasarkan data angka objektif dan analisa riwayat bisnis.',
          'Keputusan didesentralisasi; tim memiliki kewenangan mengambil keputusan operasional asalkan sejalan dengan prinsip dasar bisnis.'
        ]
      },
      {
        teks: 'Bagaimana Anda merekrut dan membangun tim?',
        opsi: [
          'Merekrut siapa saja yang bersedia dibayar murah atau sekadar kenalan saat sedang terdesak.',
          'Merekrut semata-mata karena keahlian teknisnya, meski sering menimbulkan konflik internal.',
          'Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.',
          'Memiliki standar rekrutmen yang jelas, menilai kecocokan sikap kerja (karakter) dan kompetensi teknis secara seimbang.',
          'Memiliki jalur pembinaan dan pengembangan tim dari dalam, sehingga saat butuh pemimpin baru, regenerasi berjalan alami.'
        ]
      }
    ]
  },
  {
    kategori: 'Finance (Keuangan)',
    pertanyaan: [
      {
        teks: 'Bagaimana cara Anda mengelola uang bisnis?',
        opsi: [
          'Rekening campur aduk. Uang bisnis sering terpakai untuk keperluan pribadi tanpa pencatatan.',
          'Uang dipisah, tapi pengelolaannya serampangan; jika bisnis kekurangan uang, saya sering nombok pakai uang pribadi.',
          'Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin.',
          'Memiliki alokasi pos pengeluaran yang ketat sehingga biaya operasional selalu terjaga sesuai batas aman anggaran.',
          'Tata kelola kas sangat sehat, bisnis memiliki dana cadangan operasional yang cukup untuk mengamankan bulan-bulan sepi.'
        ]
      },
      {
        teks: 'Bagaimana strategi Anda dalam menentukan harga jual?',
        opsi: [
          'Tebak-tebakan saja atau sekadar memasang harga paling murah di pasaran agar laku.',
          'Menyalin persis harga yang dipatok oleh rata-rata kompetitor di sekitar.',
          'Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.',
          'Menentukan harga berdasarkan besarnya manfaat, kualitas, dan solusi yang dirasakan langsung oleh pelanggan.',
          'Harga ditentukan secara strategis untuk menyaring dan mendapatkan target segmen pasar spesifik yang paling menguntungkan.'
        ]
      },
      {
        teks: 'Metrik keuangan apa yang paling sering Anda pantau?',
        opsi: [
          'Hanya melihat sisa saldo akhir di rekening bank.',
          'Hanya memantau omset atau total uang masuk tanpa tahu persis keuntungannya.',
          'Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.',
          'Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian.',
          'Fokus memantau nilai jangka panjang dari pelanggan setia dan membandingkannya dengan anggaran promosi yang dikeluarkan.'
        ]
      },
      {
        teks: 'Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?',
        opsi: [
          'Sering mengandalkan pinjaman jangka pendek yang berbunga tinggi atau tanpa perhitungan yang jelas.',
          'Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan.',
          'Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis.',
          'Mampu menggunakan modal eksternal atau investasi secara aman karena memiliki proyeksi keuntungan yang jelas dan terukur.',
          'Ekspansi dibiayai oleh model bisnis yang berputar sehat atau didukung oleh sistem kemitraan strategis yang minim risiko.'
        ]
      }
    ]
  },
  {
    kategori: 'Operation (Operasional)',
    pertanyaan: [
      {
        teks: 'Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?',
        opsi: [
          'Sangat tertutup; menganggap semua usaha lain sebagai saingan yang harus dikalahkan.',
          'Sesekali berjejaring, namun hanya untuk kepentingan mencari pelanggan baru (transaksional).',
          'Terbuka untuk berkolaborasi jika ada pihak lain yang mengajak dan menanggung biayanya.',
          'Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.',
          'Menjadi motor penggerak atau inisiator yang membangun ekosistem kolaborasi di komunitas lokal.'
        ]
      },
      {
        teks: 'Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?',
        opsi: [
          'Menolak sepenuhnya; bersikeras bahwa cara manual tradisional adalah yang paling aman dan terbaik.',
          'Merasa terintimidasi dan hanya mau menggunakan teknologi jika dipaksa oleh keadaan (misal: dipaksa pelanggan pakai QRIS).',
          'Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.',
          'Terbuka belajar dan rutin menggunakan perangkat lunak digital untuk memangkas waktu kerja manual tim.',
          'Secara proaktif selalu mencari dan menguji teknologi baru (seperti otomasi atau AI) untuk menekan biaya dan melipatgandakan produktivitas.'
        ]
      },
      {
        teks: 'Bagaimana status perizinan dasar operasional bisnis Anda saat ini?',
        opsi: [
          'Belum memiliki dokumen perizinan apa pun; bisnis berjalan sepenuhnya secara informal.',
          'Merasa belum perlu mengurus izin karena skala bisnis masih kecil dan beroperasi dari rumah.',
          'Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.',
          'Sudah memiliki badan usaha resmi (seperti CV, PT, atau Koperasi) yang memisahkan tanggung jawab hukum pribadi dan bisnis.',
          'Legalitas badan usaha sangat lengkap, tersimpan rapi, dan rutin melaporkan kewajiban pajak bisnis secara disiplin.'
        ]
      },
      {
        teks: 'Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?',
        opsi: [
          'Sistem hancur. Banyak pesanan terbengkalai, telat, dan pelanggan marah besar.',
          'Tim harus lembur memaksakan diri, stres tinggi, dan kualitas pekerjaan atau produk menurun drastis.',
          'Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.',
          'Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan.',
          'Sangat mulus. Alur kerja operasional bisnis sudah dirancang elastis untuk menangani kapasitas besar secara efisien.'
        ]
      },
      {
        teks: 'Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?',
        opsi: [
          'Semuanya hanya ada di ingatan saya pribadi.',
          'Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru.',
          'Ada sedikit panduan tertulis secara acak, namun tidak lengkap dan jarang diperbarui.',
          'Seluruh standar operasional diatur dalam panduan baku tertulis yang wajib diikuti oleh tim.',
          'Panduan baku sudah terintegrasi menjadi alat kerja harian (seperti daftar periksa mandiri) yang menjaga konsistensi tanpa perlu diawasi.'
        ]
      },
      {
        teks: 'Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?',
        opsi: [
          'Fokus mencari tahu siapa karyawan yang bersalah dan memarahinya.',
          'Saya sendiri yang langsung melompat mengambil alih pekerjaan untuk memperbaiki kesalahan tersebut.',
          'Karyawan diminta segera memperbaiki kesalahan saat itu juga tanpa ada evaluasi lanjutan.',
          'Tim merujuk pada panduan standar penyelesaian masalah yang sudah disepakati sebelumnya.',
          'Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.'
        ]
      },
      {
        teks: 'Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?',
        opsi: [
          'Sering kewalahan; tiba-tiba kehabisan bahan saat ramai, atau barang rusak karena menumpuk.',
          'Pengecekan stok atau kapasitas dilakukan secara acak hanya jika teringat atau terlihat menipis.',
          'Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.',
          'Memiliki pencatatan sistematis dengan pengingat otomatis sebelum batas minimum bahan/kapasitas tercapai.',
          'Sistem persediaan terkelola sangat presisi, terintegrasi mulus dengan putaran kas dan jadwal pengerjaan agar efisiensi maksimal.'
        ]
      }
    ]
  },
  {
    kategori: 'Product (Produk/Jasa)',
    pertanyaan: [
      {
        teks: 'Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?',
        opsi: [
          'Karena faktor kebetulan, harga paling murah, atau sekadar lokasi paling dekat.',
          'Karena kemasan atau tampilannya dirasa lebih menarik dibanding pilihan lain.',
          'Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan.',
          'Karena produk mampu memberikan solusi yang sangat spesifik dan relevan dengan masalah mereka.',
          'Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka.'
        ]
      },
      {
        teks: 'Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?',
        opsi: [
          'Hampir identik. Kami hanya bersaing melalui perang harga untuk mendapatkan pelanggan.',
          'Mirip, tetapi kami mencoba bersaing dengan memberikan tambahan bonus atau fitur ekstra.',
          'Kami fokus melayani celah pasar spesifik yang tidak digarap dengan serius oleh kompetitor besar.',
          'Kami diakui sebagai rujukan utama atau pilihan prioritas di wilayah operasional atau kategori kami.',
          'Produk kami memiliki karakter atau ciri khas yang sangat kuat, sehingga pelanggan merasa sulit mencari penggantinya di tempat lain.'
        ]
      },
      {
        teks: 'Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?',
        opsi: [
          'Sekadar mengikuti apa yang sedang ramai dibicarakan (tren sesaat) atau mengikuti selera pribadi.',
          'Mengamati lalu meniru mentah-mentah strategi atau produk baru yang dikeluarkan kompetitor.',
          'Mengandalkan asumsi atau perkiraan internal bahwa pasar pasti akan menyukainya.',
          'Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.',
          'Menganalisa kebiasaan dan kesulitan pelanggan secara mendalam untuk menawarkan solusi yang bahkan belum mereka sadari.'
        ]
      },
      {
        teks: 'Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?',
        opsi: [
          'Didominasi pembeli sesaat yang hanya bertransaksi sekali lalu tidak pernah kembali.',
          'Pelanggan lama hanya mau kembali bertransaksi jika ada potongan harga atau promosi.',
          'Pelanggan kembali bertransaksi secara natural hanya jika sedang benar-benar butuh.',
          'Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing.',
          'Produk/jasa kami telah terintegrasi erat dengan aktivitas rutin pelanggan sehingga sulit bagi mereka untuk beralih.'
        ]
      }
    ]
  },
  {
    kategori: 'Service (Layanan)',
    pertanyaan: [
      {
        teks: 'Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?',
        opsi: [
          'Sering kali berbelit, instruksi kurang jelas, dan memicu kebingungan dari sisi pelanggan.',
          'Berjalan kaku seadanya; interaksi sebatas serah terima uang dan produk tanpa keramahan ekstra.',
          'Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.',
          'Sangat mulus dan minim hambatan; kami selalu mencari cara menyederhanakan proses bagi pelanggan.',
          'Tim sangat proaktif memandu, mengantisipasi kebingungan, dan membantu pelanggan sebelum mereka memintanya.'
        ]
      },
      {
        teks: 'Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?',
        opsi: [
          'Membela diri, berdebat panjang, atau menyalahkan kondisi di luar kendali kami.',
          'Asal meminta maaf atau langsung memberikan ganti rugi semata-mata agar masalah cepat selesai.',
          'Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.',
          'Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata.',
          'Tim garda depan diberi wewenang, keluwesan, dan batasan anggaran mandiri untuk menebus kekecewaan pelanggan secara langsung saat itu juga.'
        ]
      },
      {
        teks: 'Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?',
        opsi: [
          'Tidak ada sistem. Kami baru tahu ada masalah jika pelanggan marah besar atau omset anjlok.',
          'Hanya menyediakan saluran pasif (seperti kotak saran atau form) yang jarang diisi pelanggan.',
          'Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.',
          'Memiliki mekanisme berkala untuk memantau tingkat kepuasan pelanggan setelah transaksi selesai.',
          'Secara aktif menggali pendapat pelanggan secara mendalam untuk memahami kelebihan dan kekurangan bisnis kami.'
        ]
      },
      {
        teks: 'Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?',
        opsi: [
          'Tidak ada tindakan lanjutan; interaksi berakhir sepenuhnya saat pembayaran diterima.',
          'Hanya merespons komunikasi jika pelanggan yang terlebih dahulu bertanya atau menghubungi.',
          'Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.',
          'Memiliki metode atau program terstruktur yang mendorong pelanggan untuk terus berinteraksi atau bertransaksi kembali.',
          'Konsisten memberikan nilai tambah edukasi, perhatian khusus, atau membangun komunitas di sekitar merek kami.'
        ]
      }
    ]
  },
  {
    kategori: 'Sales (Penjualan)',
    pertanyaan: [
      {
        teks: 'Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?',
        opsi: [
          'Langsung membanjiri mereka dengan tawaran harga dan mendesak agar segera membeli.',
          'Menjelaskan kehebatan produk panjang lebar secara satu arah tanpa henti.',
          'Menjawab secara kaku dan seadanya, murni sebatas apa yang mereka tanyakan.',
          'Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.',
          'Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka.'
        ]
      },
      {
        teks: 'Ketika calon pelanggan keberatan dan mengatakan "Harganya mahal", apa respons Anda?',
        opsi: [
          'Langsung panik dan refleks memberikan potongan harga demi menyelamatkan penjualan.',
          'Berdebat dan berusaha membuktikan bahwa bahan atau proses pengerjaan kami memang pantas dibayar mahal.',
          'Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.',
          'Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh.',
          'Merelakan pelanggan tersebut dengan profesional karena menyadari bahwa mereka memang bukan segmen target pasar kami.'
        ]
      },
      {
        teks: 'Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?',
        opsi: [
          'Hanya mengandalkan daya ingat atau kertas catatan yang mudah hilang.',
          'Dibiarkan menumpuk berantakan dalam riwayat pesan instan sehingga sulit dicari.',
          'Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana.',
          'Data kontak dikelompokkan berdasarkan seberapa besar minat atau kesiapan mereka untuk bertransaksi.',
          'Memiliki sistem tindak lanjut (follow-up) yang terjadwal rapi dan konsisten agar tidak ada peluang yang terlewat.'
        ]
      },
      {
        teks: 'Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?',
        opsi: [
          'Sering menggunakan nada memaksa, memohon, atau memanipulasi informasi agar mereka beli.',
          'Cenderung pasif, hanya menunggu tanpa ada usaha untuk memastikan kepastian jawaban pelanggan.',
          'Perlu proses menagih atau mengingatkan pelanggan berkali-kali hingga akhirnya transaksi terjadi.',
          'Menggunakan penawaran menarik dengan batas waktu atau batas ketersediaan yang jelas dan tidak dibuat-buat.',
          'Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal.'
        ]
      }
    ]
  },
  {
    kategori: 'Marketing (Pemasaran)',
    pertanyaan: [
      {
        teks: 'Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?',
        opsi: [
          'Semuanya hanya berupa katalog jualan langsung: harga, ketersediaan, dan ajakan membeli.',
          'Selalu memosisikan bisnis kami sebagai pihak yang paling hebat, berpengalaman, atau tiada tanding.',
          'Fokus utama hanya memancing perhatian lewat informasi undian berhadiah, diskon, atau promo murah.',
          'Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.',
          'Menyampaikan nilai, cerita, dan semangat merek yang membuat pelanggan merasa bangga dan sejalan dengan ideologi kami.'
        ]
      },
      {
        teks: 'Bagaimana variasi jenis konten pemasaran yang diproduksi?',
        opsi: [
          'Sepenuhnya berisi tawaran jualan dari ujung ke ujung.',
          'Sering menunggangi tren acak yang tidak berhubungan dengan bisnis asalkan bisa mendapat banyak penonton.',
          'Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting.',
          'Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional.',
          'Sering membagikan ilmu atau referensi berkualitas tinggi secara gratis yang memperkuat citra profesional bisnis di industrinya.'
        ]
      },
      {
        teks: 'Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?',
        opsi: [
          'Sepenuhnya bersikap pasif; hanya berharap ada keajaiban dari promosi mulut ke mulut.',
          'Sering mengeluarkan uang promosi tanpa ada pencatatan yang jelas apakah iklan tersebut membuahkan hasil.',
          'Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.',
          'Memiliki penawaran daya tarik khusus (seperti sampel, sesi gratis, atau materi panduan) untuk memancing kontak calon pelanggan potensial.',
          'Memiliki pola pemasaran stabil yang secara konsisten dan terprediksi mampu mendatangkan audiens baru.'
        ]
      },
      {
        teks: 'Seberapa kuat daya ingat masyarakat terhadap merek Anda?',
        opsi: [
          'Sangat umum dan pasaran; bisnis kami dengan mudah bisa digantikan oleh pesaing baru besok hari.',
          'Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat.',
          'Mulai membangun gaya visual, gaya bahasa, atau ciri khas konsisten yang mudah dikenali pelanggan.',
          'Diakui sebagai rujukan terpercaya atau standar kualitas di kelasnya oleh mayoritas pelaku wilayah/pasar.',
          'Memiliki daya pikat alami yang begitu kuat, sehingga orang-orang secara sukarela merekomendasikan dan membicarakannya.'
        ]
      }
    ]
  },
  {
    kategori: 'Growth (Pertumbuhan)',
    pertanyaan: [
      {
        teks: 'Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?',
        opsi: [
          'Bermodalkan nekat; langsung memproduksi dalam jumlah besar dengan ekspektasi pasti meledak di pasar.',
          'Menghabiskan waktu berbulan-bulan di belakang layar menyempurnakan tapi belum mengujinya ke pihak luar.',
          'Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu.',
          'Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal.',
          'Terbiasa menjalankan siklus pengembangan bertahap, di mana perbaikan dilakukan terus-menerus berdasarkan respon pasar.'
        ]
      },
      {
        teks: 'Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?',
        opsi: [
          'Pemilik langsung mengambil beban ganda dengan bekerja jauh lebih keras dan mengorbankan waktu istirahat.',
          'Selalu menyelesaikan masalah keterbatasan kapasitas dengan terburu-buru merekrut tenaga tambahan tanpa perhitungan efisiensi.',
          'Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik.',
          'Mampu meningkatkan kapasitas produksi dan pelayanan secara signifikan melalui perbaikan sistem tanpa melipatgandakan biaya pokok.',
          'Menggunakan skema terstruktur untuk bertumbuh (seperti kemitraan, lisensi, atau perbaikan model distribusi) yang meminimalkan beban harian pemilik.'
        ]
      },
      {
        teks: 'Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?',
        opsi: [
          'Sama sekali tidak ada; energi dan dana murni habis tersita untuk bertahan hidup menjalankan kegiatan hari ini.',
          'Pemilik baru mencoba memikirkan ide-ide segar ketika dilanda kepanikan akibat penurunan omset.',
          'Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra.',
          'Secara terencana selalu menyediakan alokasi waktu dan modal khusus secara rutin demi memikirkan perbaikan bisnis ke depan.',
          'Semangat mencoba cara kerja yang lebih baik telah menjadi budaya tim; setiap orang didorong untuk menguji usulan ide baru.'
        ]
      },
      {
        teks: 'Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?',
        opsi: [
          'Terjadi serba kebetulan dan pemilik tidak pernah melacak dari mana asal rekomendasi tersebut.',
          'Pemilik sering kali harus memohon secara langsung agar pelanggan bersedia mempromosikan bisnis ini ke orang lain.',
          'Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.',
          'Memiliki sistem apresiasi yang tertata dengan standar keuntungan yang jelas bagi setiap orang yang membawa pelanggan baru.',
          'Reputasi dan kualitas produk sangat bisa diandalkan, sehingga merekomendasikannya kepada orang lain menjadi bentuk kebanggaan alami bagi pelanggan.'
        ]
      }
    ]
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  sesiAktif: 'Sesi 2',
  registrationDeadline: '2026-10-31',
  assessmentOpenDate: '2026-09-01',
  assessmentCloseDate: '2026-11-15',
  modeUjicoba: false,
  gasEndpointUrl: 'https://script.google.com/macros/s/AKfycbwpLuT1HtWX7I9l1ABa2YthchqYEZ4cEuLcmXjeyW_PHOgXw9D9GhoOROySnKFHr1vO/exec',
  autoSync: true,
  passcode: '123456'
};

export const INITIAL_TIMELINE: TimelineItem[] = [
  {
    "row": 2,
    "urutan": 1,
    "tahapan": "Pembukaan pendaftaran dan kurasi",
    "tanggalMulai": "2026-09-03",
    "tanggalSelesai": "2026-09-23",
    "keterangan": "Setiap pendafataran yang masuk didata dan dianalisa"
  },
  {
    "row": 3,
    "urutan": 2,
    "tahapan": "Kurasi Tim PartnerUp",
    "tanggalMulai": "2026-09-04",
    "tanggalSelesai": "2026-09-26",
    "keterangan": "Peserta mengisi kuisioner kondisi usaha, dilanjutkan dengan pengecekan lapangan bila dibutuhkan"
  },
  {
    "row": 4,
    "urutan": 3,
    "tahapan": "Seleksi dan Pemetaan",
    "tanggalMulai": "2026-09-27",
    "tanggalSelesai": "2026-10-02",
    "keterangan": "Tim PartnerUp melakukan pemetaann usaha dan peluang kolaborasi antar usaha"
  },
  {
    "row": 5,
    "urutan": 4,
    "tahapan": "Program dimulai: Pelatihan 1",
    "tanggalMulai": "2026-10-03",
    "tanggalSelesai": "2026-10-03",
    "keterangan": "Pelatihan mindset bisnis dan penyelarasan tujuan kegiatan."
  }
];

export const INITIAL_JADWAL: JadwalItem[] = [
  {
    "row": 2,
    "tanggal": "2026-10-03",
    "waktu": "14.00 - 18.00",
    "topik": "MINDSET BISNIS DAN PENYELARASAN TUJUAN KEGIATAN",
    "pemateri": "Yanuar Baihaqi",
    "lokasi": "Buah Tangan Lantai 4",
    "catatan": "",
    "linkMateri": "",
    "idSesi": "8f75e785"
  },
  {
    "row": 3,
    "tanggal": "2026-10-10",
    "waktu": "15.15 - 17.00",
    "topik": "MINDSET KEUANGAN",
    "pemateri": "Yanuar Baihaqi",
    "lokasi": "Buah Tangan Lt 4",
    "catatan": "Offline",
    "linkMateri": "",
    "idSesi": "7a0f968c"
  }
];

export const INITIAL_PESERTA: PesertaItem[] = [
  {
    "row": 2,
    "timestamp": "04/09/2026 8:43:14",
    "namaUsaha": "obeecreatives",
    "namaPemilik": "Lalu Mahendra Ali Akbar",
    "subsektor": "Fotografi",
    "whatsapp": "81335125277",
    "email": "loehendra@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "81335125277",
    "alamatUsaha": "Kota Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "https://www.instagram.com/lalumahendra/",
    "tiktok": "",
    "marketplace": "https://www.instagram.com/lalumahendra/",
    "deskripsi": "Agency"
  },
  {
    "row": 3,
    "timestamp": "04/09/2026 10:22:34",
    "namaUsaha": "Dulloch",
    "namaPemilik": "Yogi Abdullah",
    "subsektor": "Kuliner",
    "whatsapp": "83834735811",
    "email": "ydulloch@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "83834735811",
    "alamatUsaha": "Jalan Aji Mustofa no 20b RT 03 RW 02 torongrejo klerek kecamatan Junrejo kota batu Jawa Timur",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.tiktok.com/@dulloch_snack?_r=1&_t=ZS-99RPmnyoAUC",
    "tiktok": "https://www.tiktok.com/@dulloch_snack?_r=1&_t=ZS-99RPmnyoAUC",
    "marketplace": "https://www.tiktok.com/@dulloch_snack?_r=1&_t=ZS-99RPmnyoAUC",
    "deskripsi": "Usaha yang bergerak di bidang makanan dan minuman yang pengolahan nya masih secara manual"
  },
  {
    "row": 4,
    "timestamp": "04/09/2026 10:54:48",
    "namaUsaha": "Cleopatra",
    "namaPemilik": "Erna Eriana",
    "subsektor": "Lainnya",
    "whatsapp": "81252513996",
    "email": "ernacleopatra6969@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "81252513996",
    "alamatUsaha": "Kota Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di atas Rp2,5 miliar",
    "instagram": "https://www.instagram.com/cleopatramanagement?igsi=dnE5OTk2a2Vpa2lx",
    "tiktok": "https://www.tiktok.com/@cleopatra_management?_r=1&_t=ZS-99RSPuYo2sa",
    "marketplace": "",
    "deskripsi": "Usaha Jasa Biro Perjalanan Wisata, EO dan Konsultan Management"
  },
  {
    "row": 5,
    "timestamp": "04/09/2026 11:06:57",
    "namaUsaha": "Happy Food",
    "namaPemilik": "Happy Izvestya Andhini",
    "subsektor": "Kuliner",
    "whatsapp": "81564899723",
    "email": "happyandhini9@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "81564899723",
    "alamatUsaha": "Kota Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/cuka_apel_albariqi?igsi=Y3czbmV6czN1MWdy",
    "tiktok": "https://www.tiktok.com/@cuka_apel_albariqi?_r=1&_t=ZS-99RT8KHPcHM",
    "marketplace": "https://id.shp.ee/ESZ1sgVd",
    "deskripsi": "HAPPY FOOD memulai perjalanannya pada November 2023 dengan memproduksi Cuka Apel \"Albariqi\", sebuah produk fermentasi alami yang terbuat dari apel pilihan. Berasal dari Kota Batu, yang terkenal dengan kekayaan alamnya, kami berkomitmen untuk menghadirkan produk berkualitas tinggi yang ramah lingkungan dan bermanfaat bagi kesehatan.\n\nMelalui Cuka Apel Albariqi, kami ingin menghidupkan kembali kearifan lokal dan memberikan solusi alami bagi masyarakat untuk menjaga kesehatan secara holistik."
  },
  {
    "row": 6,
    "timestamp": "04/09/2026 11:10:43",
    "namaUsaha": "Kriups!",
    "namaPemilik": "Dwi Lili Indayani",
    "subsektor": "Lainnya",
    "whatsapp": "8982229600",
    "email": "kriups.chips@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "8982229600",
    "alamatUsaha": "Kota Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp300 juta – Rp2,5 miliar",
    "instagram": "https://www.instagram.com/kriups.chipss?utm_source=qr&igsi=Nnc3aDUyOG80enVy",
    "tiktok": "https://www.tiktok.com/@kriups?_r=1&_t=ZS-99RTDQ53A8u",
    "marketplace": "",
    "deskripsi": "Kriups! adalah produsen keripik sayur dan buah yang menghadirkan aneka camilan dengan cita rasa lezat, tekstur renyah, dan pilihan produk yang beragam. Kriups! mengolah berbagai bahan pangan lokal menjadi keripik berkualitas melalui proses produksi yang memperhatikan kebersihan, kualitas bahan, dan konsistensi rasa.\n\nSelain memproduksi dan menjual keripik dengan merek Kriups!, kami juga melayani kebutuhan reseller, grosir, hampers, serta maklon/private label. Dengan layanan ini, pelanggan dapat memiliki produk keripik sayur dan buah dengan merek sendiri.\n\nDengan semangat mengangkat potensi hasil pertanian lokal menjadi produk bernilai tambah, Kriups! hadir sebagai produsen keripik sayur dan buah yang renyah, praktis, dan cocok dinikmati kapan saja."
  },
  {
    "row": 7,
    "timestamp": "04/09/2026 11:20:40",
    "namaUsaha": "Kopi Kedungroso",
    "namaPemilik": "Sumiarsih",
    "subsektor": "Kuliner",
    "whatsapp": "85755034299",
    "email": "kopikedungasih@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "0",
    "alamatUsaha": "Kedung Giripurno Kec Bumiaji",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://instagram.com/@kopi kedungroso",
    "tiktok": "https://Tiktok.com/@kopi kedungroso",
    "marketplace": "https:// shopee seler / kopi kedungroso",
    "deskripsi": "Kopi kedungroso melakukan usaha mulai proses produksi sampai penjualan/ pemasaran nya. Biji kopi di peroleh dari kelompok tani.khusus biji kopi lereng gunung arjuno"
  },
  {
    "row": 8,
    "timestamp": "04/09/2026 11:22:16",
    "namaUsaha": "Soundpov",
    "namaPemilik": "Yudha Setyawan",
    "subsektor": "Musik",
    "whatsapp": "81249869311",
    "email": "bharatayudhaofficial@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1200001491691",
    "alamatUsaha": "Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp300 juta – Rp2,5 miliar",
    "instagram": "https://www.instagram.com/bharays99?igsi=MWlkY3R2M2tkc3g4bg==",
    "tiktok": "https://www.tiktok.com/@bhara_yudha?_r=1&_t=ZS-99RUOYnWPSP",
    "marketplace": "htpps://www.soundpov.com",
    "deskripsi": "Platform digital kami bergerak di ekosistem musik digital."
  },
  {
    "row": 9,
    "timestamp": "04/09/2026 11:58:25",
    "namaUsaha": "Linara Craft",
    "namaPemilik": "Lilis Suryani",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "85257324459",
    "email": "linaracraft.id@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1210210010293",
    "alamatUsaha": "Jalan imam Bonjol dusun Kedung RT 67 RW 10 giripurno Bumiaji",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.tiktok.com/@nabiellaaccessories?_r=1&_t=ZS-99RWads9tjR",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Linara craft adalah umkm yang bergerak di bidang kriya. Kami melakukan pemasaran dengan cara offline dan online. Kami juga melayani orderan sesuai permintaan customer. Apapun itu yg berkaitan dengan kerajinan tangan"
  },
  {
    "row": 10,
    "timestamp": "04/09/2026 12:13:16",
    "namaUsaha": "Bloom Garden",
    "namaPemilik": "Eva Yuanita",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "85755554335",
    "email": "soelepah@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "284010100698",
    "alamatUsaha": "Jl patimura gg 6 ko 31 RT 07 RW 05 kelurahan temas",
    "kotaKabupaten": "Kota Batu",
    "omzet": "-",
    "instagram": "https://www.instagram.com/bloom40garden?igsi=cjRtMm5ydXYzejZy",
    "tiktok": "https://www.tiktok.com/@evayuanita8?_r=1&_t=ZS-99RXvMPDEuO",
    "marketplace": "https://www.instagram.com/bloom40garden?igsi=cjRtMm5ydXYzejZyhttps://www.tiktok.com/@evayuanita8?_r=1&_t=ZS-99RXvMPDEuO",
    "deskripsi": "Bloom garden merupakan sebuah usaha yang berbasis crafting dan mentoring berbahan dasar kawat bulu.untuk product bermacam2,mulai dari gantungan kunci,buket bunga,hiasan meja,hiasan dinding,tas,acesories dll"
  },
  {
    "row": 11,
    "timestamp": "04/09/2026 12:20:40",
    "namaUsaha": "Rbc(rahmat Berkah Cemerlang)",
    "namaPemilik": "Nunuk Desi Ningrum",
    "subsektor": "Kuliner",
    "whatsapp": "81311302110",
    "email": "ivansuanta8@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "262011150428",
    "alamatUsaha": "Segundu RT 04 RW 01 Dsn Segundu Desa Sumbergondo Kecamatan Bumiaji Kota Batu Provinsi Jawa Timur",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/yoghurtmahim/",
    "tiktok": "https://www.instagram.com/yoghurtmahim/",
    "marketplace": "https://mbizmarket.co.id",
    "deskripsi": "RBC adalah usaha dibidang kuliner ,dan kami juga bermitra dengan pemerintahan sebagai penyedia Mamin( Nasi kotak,tumpeng,Snack box dll)"
  },
  {
    "row": 12,
    "timestamp": "04/09/2026 12:22:17",
    "namaUsaha": "Ahas Berkah Ibrahim",
    "namaPemilik": "Hastuti Sulistyoningsih",
    "subsektor": "Kuliner",
    "whatsapp": "81219750746",
    "email": "ahasberkahibrahim@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "2312220022586",
    "alamatUsaha": "Jalan Damun no 5 RT 3 RW 6 Beji Ngemplak KEC Junrejo kota batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "AHAS BERKAH IBRAHIM adalah usaha UMKM milik hastuti sulistyoningsih yang bergerak dibidang kuliner..yaitu memproduksi minuman Yoghurt aneka rasa buah. Di pasak dari bahan baku peternakan keluarga besar.. di olah secara higienis dengan mesin semi manual. Usaha ini dimulai tahun 2020 ketika terjadi covid 19, dan berkembang Sampai hari ini dengan sekali produksi 80 liter di pasarkan ke berbagai pusat oleh oleh, restoran, RS, sekolah pondok pesantren dan secara online maupun offline langsung ke konsumen. Pasar Yoghurt maHim di Jawa Timur dan bbrp kali pengiriman di luar Jawa Timur"
  },
  {
    "row": 13,
    "timestamp": "04/09/2026 12:30:07",
    "namaUsaha": "Kripik Lokal Dewi Nurjan Mbah Batu",
    "namaPemilik": "Siti Mukharomah",
    "subsektor": "Kuliner",
    "whatsapp": "81336546890",
    "email": "mukaromah.546890@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "0",
    "alamatUsaha": "torongrejo krajan rt 05 rw 06",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "kripik talas\nkripik pisang\nkripik ubi ungu"
  },
  {
    "row": 14,
    "timestamp": "04/09/2026 12:37:34",
    "namaUsaha": "Sidoasri Kopi",
    "namaPemilik": "Alvitalia Kusumaningsih",
    "subsektor": "Kuliner",
    "whatsapp": "81336612673",
    "email": "alvitalia110596@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1002230028397",
    "alamatUsaha": "Jl damun beji junrejo kota batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/sido.kopi?igsi=MXRucnJiYmIxeXhjYw%3D%3D&utm_source=qr",
    "tiktok": "https://www.tiktok.com/@sidoasrikopi?_r=1&_t=ZS-99RZw191smq",
    "marketplace": "",
    "deskripsi": "Sido Asri adalah produsen kopi lokal yang menghadirkan Kopi Bubuk Robusta Murni 100% Original. Diolah dari biji kopi pilihan, Sido Asri menyajikan karakter cita rasa khas Robusta yang bold, pekat, dan earthy yang otentik."
  },
  {
    "row": 15,
    "timestamp": "04/09/2026 12:45:19",
    "namaUsaha": "Creative Kokedama",
    "namaPemilik": "Dwi Lili Indayani",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "81230493939",
    "email": "creative.kokedama@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Sidomulyo",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp300 juta – Rp2,5 miliar",
    "instagram": "https://www.instagram.com/creative_kokedama/",
    "tiktok": "https://www.tiktok.com/@creativekokedama",
    "marketplace": "https://shopee.co.id/creative.kokedama",
    "deskripsi": "Creative Kokedama adalah inovasi tanaman hias yang menggabungkan keindahan tanaman dengan seni kerajinan dalam bentuk kokedama yang unik dan estetik. Creative Kokedama mengembangkan berbagai produk berbasis tanaman hias dengan memanfaatkan material seperti serat kelapa, rotan, moss, dan bahan pendukung lainnya. Produk dirancang sebagai dekorasi untuk rumah, perkantoran, hotel, restoran, maupun berbagai kebutuhan event dan gift.\n\nCreative Kokedama tidak hanya menghadirkan produk dekoratif, tetapi juga memiliki misi untuk meningkatkan nilai tambah tanaman hias lokal, membuka peluang usaha kreatif, serta memberdayakan petani dan masyarakat sekitar. Melalui inovasi desain dan pemanfaatan bahan yang lebih ramah lingkungan, Creative Kokedama mengubah tanaman hias menjadi produk bernilai ekonomi yang memadukan unsur nature, art, and sustainability.\n\nDengan mengusung konsep handmade, natural, dan modern botanical, Creative Kokedama menghadirkan produk yang cocok bagi konsumen yang menginginkan dekorasi hijau yang berbeda, praktis, dan memiliki nilai estetika. Creative Kokedama juga aktif dalam kegiatan edukasi dan workshop untuk memperkenalkan teknik kokedama serta mendorong kreativitas masyarakat melalui tanaman dan kerajinan."
  },
  {
    "row": 16,
    "timestamp": "04/09/2026 12:51:07",
    "namaUsaha": "Toko Suryamart",
    "namaPemilik": "Ismiyati",
    "subsektor": "Lainnya",
    "whatsapp": "8992681372",
    "email": "izmisuwito@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "2304250034832",
    "alamatUsaha": "Jln Darsono barat GG gelatik no 15 RT 03 RW 10",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Jualan sembako dan pakaian anak+dewasa juga perlengkapan bayi."
  },
  {
    "row": 17,
    "timestamp": "04/09/2026 12:57:56",
    "namaUsaha": "Arsyelly 19collection",
    "namaPemilik": "Marlina Sari",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "81517643083",
    "email": "sarimarlina367@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "220209391815",
    "alamatUsaha": "Jl.agus salim GG 1 RT 01/01",
    "kotaKabupaten": "Kota Batu",
    "omzet": "-",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Ingin lebih maju"
  },
  {
    "row": 18,
    "timestamp": "04/09/2026 13:21:23",
    "namaUsaha": "Kedai Es Sekop",
    "namaPemilik": "Riadul Badi'ah",
    "subsektor": "Kuliner",
    "whatsapp": "87752892445",
    "email": "rbadiah9@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "0",
    "alamatUsaha": "JL. WUKIR GG V NO 31 TEMAS BATU",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/kedai_essekop?igsi=YTN1M21mNmNnMGl3",
    "tiktok": "https://www.tiktok.com/@kedai_essekop?_r=1&_t=ZS-99RblFbegWf",
    "marketplace": "https://spf.shopee.co.id/1BM4ckkhqR",
    "deskripsi": "Halo hay pecinta es krim, merupakan jargon kami untuk membranding produk kami yakni es krim sekop dan es krim goreng. Menu Es sekop berupa es krim yang diberi berbagai macam topping mulai dari oreo, kacang, rainbow meses, coklat meses, marshmallow, jelly, nyam-nyam, chococrunch, fruity d'loops dan permen. Sedangkan menu paling viral yakni es krim goreng berupa roti yang didalamnya dikasih es krim kemudian digoreng. Cara penyajiannya dengan dikasih selai dan topping."
  },
  {
    "row": 19,
    "timestamp": "04/09/2026 13:47:09",
    "namaUsaha": "Dapur Fuji",
    "namaPemilik": "Aprianti Eko Fuji Lestari",
    "subsektor": "Kuliner",
    "whatsapp": "85782724883",
    "email": "apriantifujilestari@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "2509250155803",
    "alamatUsaha": "jl sakura Pesanggrahan",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "https://www.instagram.com/apriantifuji?igsi=eDR1dWdxOGxkaDBn",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "usaha kami menyediakan aneka kue berkualitas dengan harga terjangkau.\nproduk kami aneka kue basah ,snack box,kue nampan ,dll .Yang bisa di sesuaikan dengan request customer."
  },
  {
    "row": 20,
    "timestamp": "04/09/2026 15:43:33",
    "namaUsaha": "Tumini Decoration",
    "namaPemilik": "Rory Widianto",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "8739204786",
    "email": "rorywidianto91@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "0",
    "alamatUsaha": "Jl hasanudin gg8 no 26 rt3rw9 desa Pesanggrahan kecamatan batu",
    "kotaKabupaten": "Kota Malang",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/tumini_food_and_decoration?igsi=MTlidGdzMXZzY2dyag==",
    "tiktok": "https://tiktok.com/@tumini_decoration",
    "marketplace": "",
    "deskripsi": "Usaha Tumini decoration bergerak di bidang penjualan poster kaligrafi dan typographi"
  },
  {
    "row": 21,
    "timestamp": "04/09/2026 16:23:34",
    "namaUsaha": "Terno",
    "namaPemilik": "Tanwir Fuad Abdah",
    "subsektor": "Lainnya",
    "whatsapp": "8551937890",
    "email": "Ternobatu@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "809220096816",
    "alamatUsaha": "Jalan raya mojorejo gg blimbing no 26 mojorejo",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/ternosaiki?igsi=ZTl2cW5ubHZ0Mmtr",
    "tiktok": "https://vm.tiktok.com/ZS9BErQag5CWn-auiQJ/",
    "marketplace": "",
    "deskripsi": "TERNO JASA KURIR BELANJA MAKANAN\nTERNO BARANG"
  },
  {
    "row": 22,
    "timestamp": "04/09/2026 18:03:18",
    "namaUsaha": "Pixora",
    "namaPemilik": "Leo Setiyawan",
    "subsektor": "Desain Grafis / Komunikasi Visual",
    "whatsapp": "085646714314",
    "email": "leosetiyawan86@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1203260092608",
    "alamatUsaha": "JL. ABDUL GANI GG III NO 44",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/pixora.indonesia/",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Pixora adalah partner branding yang membantu bisnis membangun identitas visual yang kuat, jelas, dan tepat guna."
  },
  {
    "row": 23,
    "timestamp": "04/09/2026 18:25:10",
    "namaUsaha": "De Rivi",
    "namaPemilik": "Devi Fortuna Ambar Wati",
    "subsektor": "Lainnya",
    "whatsapp": "081216104768",
    "email": "alrizalhelmi@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "0309250053581",
    "alamatUsaha": "jl wukir rt4 rw4 Temas,batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/de_rivi?utm_source=qr",
    "tiktok": "",
    "marketplace": "https://s.shopee.co.id/Lmxy5g8zF",
    "deskripsi": "PROFIL USAHA\n\nDERIVI LABEL\n\nDeRivi Label merupakan usaha yang bergerak di bidang custom, printing, souvenir, dan produk kreatif, yang melayani berbagai kebutuhan personal, UMKM, sekolah, komunitas, maupun acara spesial.\n\nDeRivi mulai berdiri pada Juli 2014 dan terus berkembang hingga saat ini. Dengan pengalaman lebih dari satu dekade, DeRivi berkomitmen menghadirkan produk yang kreatif, berkualitas, rapi, dan dapat disesuaikan dengan keinginan pelanggan.\n\nPRODUK & LAYANAN\n\nDeRivi menyediakan berbagai produk custom dan kreatif, meliputi:\n\n🏷️ Label & Branding\n\n* Label kulit sintetis custom\n* Label kulit gravir\n* Label produk dan label nama\n* Stiker custom\n\n🎁 Buket & Hampers\n\n* Buket bunga\n* Buket uang\n* Buket snack\n* Buket custom untuk berbagai acara\n* Hampers dan hadiah custom\n\n🖨️ Custom & Printing\n\n* Buku Yasin custom\n* Notebook custom\n* Mug custom\n* Acrylic custom\n* Souvenir dan merchandise\n* Produk printing dan personalisasi lainnya\n\nKEUNGGULAN DERIVI\n\n* Berpengalaman – telah menjalankan usaha sejak Juli 2014.\n* Custom sesuai kebutuhan – desain, nama, warna, tulisan, dan konsep dapat disesuaikan.\n* Kreatif & inovatif – terus mengembangkan produk mengikuti kebutuhan dan tren.\n* Melayani berbagai kebutuhan – mulai dari kebutuhan pribadi, hadiah, acara, sekolah, hingga branding UMKM.\n* Mengutamakan kualitas & kepuasan pelanggan – setiap produk dikerjakan dengan memperhatikan detail dan kerapian.\n\nVISI\n\nMenjadi usaha kreatif dan custom yang terpercaya dengan menghadirkan produk berkualitas, inovatif, dan memiliki nilai bagi setiap pelanggan.\n\nMISI\n\n1. Menghasilkan produk custom dan kreatif yang berkualitas.\n2. Memberikan pelayanan yang ramah dan profesional.\n3. Mengutamakan kepuasan dan kepercayaan pelanggan.\n4. Mengembangkan inovasi produk sesuai kebutuhan pasar.\n5. Mendukung UMKM dan masyarakat dalam kebutuhan branding, hadiah, souvenir, dan produk personalisasi.\n\nIDENTITAS USAHA\n\nNama Usaha: DeRivi Label\nBidang Usaha: Custom, Printing, Label, Buket, Souvenir & Produk Kreatif\nMulai Berdiri: Juli 2014\nTarget Pasar: Personal, UMKM, sekolah, komunitas, perusahaan, dan berbagai kebutuhan acara."
  },
  {
    "row": 24,
    "timestamp": "04/09/2026 19:57:03",
    "namaUsaha": "Salty Tasty By Azr Kitchen",
    "namaPemilik": "Anggun Sinta Maretasari",
    "subsektor": "Kuliner",
    "whatsapp": "081392085321",
    "email": "anggunsintawork@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "3008250029546",
    "alamatUsaha": "Jl Joko Bundu RT 01/01 Desa Sumbergondo Kec Bumiaji",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/saltytasty_",
    "tiktok": "https://www.tiktok.com/@saltytasty_",
    "marketplace": "https://threads.com/anggunsinta14",
    "deskripsi": "Usaha kami bergerak di bidang kuliner, khususnya olahan ayam yaitu Bakso Goreng, Dimsum keju, shumai ayam dengan beberapa varian, chicken nori roll, dan cireng pedas isi (ayam, bakso, usus). Usaha kami berjalan baru 1 tahun, tetapi respon masyarakat sangat bagus."
  },
  {
    "row": 25,
    "timestamp": "04/09/2026 20:51:40",
    "namaUsaha": "Pastlove",
    "namaPemilik": "Dya Anggraeni",
    "subsektor": "Kuliner",
    "whatsapp": "081334503518",
    "email": "dyaanggraeni40@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "0408260074495",
    "alamatUsaha": "Jl. Kapten Ibnu no.35E",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://Pastlovbygath.com",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Pastlove adalah usaha kuliner yang bergerak dalam produksi dan penjualan brownies dengan cita rasa cokelat yang lezat, tekstur lembut dan fudgy, serta tampilan yang menarik. Pastlove hadir untuk memberikan pilihan camilan berkualitas yang cocok dinikmati sendiri maupun dibagikan kepada keluarga, teman, dan orang-orang terkasih.\nNama “Pastlove” terinspirasi dari kata “Past” dan “Love”, yang menggambarkan sebuah produk yang dibuat dengan penuh perhatian dan rasa cinta. Setiap produk Pastlove diharapkan dapat menghadirkan pengalaman menikmati brownies yang berkesan dan menjadi bagian dari momen-momen spesial pelanggan."
  },
  {
    "row": 26,
    "timestamp": "04/09/2026 22:32:10",
    "namaUsaha": "Inday Kueku",
    "namaPemilik": "Elok Bakti Pratiwi",
    "subsektor": "Kuliner",
    "whatsapp": "082333118190",
    "email": "elokbakti@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "2310230009759",
    "alamatUsaha": "Jl.samadi No:12 A RT;03,Rw;10 Pesanggrahan Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://elokbp.ig.com",
    "tiktok": "https://elokbp.tiktok.com",
    "marketplace": "https:// elokba go food.com",
    "deskripsi": "Awal pendirian usaha ini karena anak² saya suka kue buatan saya,sehingga terbersitlah niat untu menawarkan ke teman² dan kolega saya .setelah itu ada tawaran untuk menjadi supleyer jajan pasar di hypermart.Sehingga saya memutuskn untuk berjualan jajan pasar dan lauk pauk yang laenya."
  },
  {
    "row": 27,
    "timestamp": "04/09/2026 22:52:23",
    "namaUsaha": "Binka Shop",
    "namaPemilik": "Sri Astuti",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "081249674137",
    "email": "warungmaksri2@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1407250083944",
    "alamatUsaha": "Malang town square Blok gc11-15",
    "kotaKabupaten": "Kota Malang",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Binka shop Bergerak bidang ritel accesories wanita. Dan kerajinan"
  },
  {
    "row": 28,
    "timestamp": "05/09/2026 5:28:42",
    "namaUsaha": "Janeetaqu",
    "namaPemilik": "Ernawati",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "085755557908",
    "email": "janeetaqusukses908@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "9120310073690",
    "alamatUsaha": "Jl patimura GG 1 no 38 b RT 5 RW 8 kelurahan Temas",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/creationjaneeta?igsi=MzB3eHcyeXVnbzJq",
    "tiktok": "https://www.tiktok.com/@janeetacreation?_r=1&_t=ZS-99SksXVgpU0",
    "marketplace": "",
    "deskripsi": "JANEETAQU usaha dibidang kriya dengan produk kreasi rajutan dan kain ecoprint melalui usaha ini saya ingin berbagi karya handycraft yang dibuat dengan penuh ketelitian dikerjakan secara manual bukan mesin sehingga setiap karya tidak bisa sama persis. Saya menyediakan koleksi rajutan amigurumi yang lucu, gantungan kunci (ganci) rajut yang unik,boneka rajut untuk event khusus serta aneka produk kain ecoprint yang cantik dan ramah lingkungan.\n​Setiap produk dibuat secara handmade, \nUsaha ini berdiri akhir 2019 masa covid"
  },
  {
    "row": 29,
    "timestamp": "05/09/2026 8:02:03",
    "namaUsaha": "Happy_zd",
    "namaPemilik": "Heppi",
    "subsektor": "Kuliner",
    "whatsapp": "082141279260",
    "email": "amurwawira@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Jl. Dewi sartika gang rt7 rw 9 temas",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "https://www.instagram.com/happyzd2026?igsi=dWlwb3lrYTFhdnBr",
    "tiktok": "",
    "marketplace": "https://id.shp.ee/MxTGF22N",
    "deskripsi": "Usaha kuliner dan distributor coklat kiloan, snack, jajanan kantin. Ngisi kantin sekolah, toko area batu. Selain itu bidang retail jual lemari, meja lipat  koper, gula sprei"
  },
  {
    "row": 30,
    "timestamp": "05/09/2026 9:02:14",
    "namaUsaha": "The Apsara",
    "namaPemilik": "Ciciek Kemalasari",
    "subsektor": "Fashion",
    "whatsapp": "085313855181",
    "email": "chicikemala@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Lesti Utara 17 Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "One stop shopping cullinary and make up"
  },
  {
    "row": 31,
    "timestamp": "05/09/2026 9:58:22",
    "namaUsaha": "Yoghurt Kisnamilk",
    "namaPemilik": "Putri",
    "subsektor": "Kuliner",
    "whatsapp": "081357914024",
    "email": "krisnajamaludin452@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "jalan flamboyan",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "yoghurt KisnaMilk, produk lokal dari batu malang, umkm yang sekaligus peternak sapi.\njadi kami dari hulu ke hilir"
  },
  {
    "row": 32,
    "timestamp": "05/09/2026 11:06:19",
    "namaUsaha": "Party Utara",
    "namaPemilik": "Rizkyta Bintang",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "081333187243",
    "email": "partyutara@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1218000332794",
    "alamatUsaha": "Jln Petinggi no 23 kota batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "https://www.instagram.com/party_utara?igsi=MXA4d2Y1ZHp6aXFldQ==",
    "tiktok": "https://www.tiktok.com/@party_utara?_r=1&_t=ZS-99TAMiQjUor",
    "marketplace": "https://id.shp.ee/8M1HFweb",
    "deskripsi": "One stop gift shopping, sedia party supply, gift dan dekorasi"
  },
  {
    "row": 33,
    "timestamp": "05/09/2026 14:37:15",
    "namaUsaha": "Moofbride",
    "namaPemilik": "Lukluul Mukaromah",
    "subsektor": "Fashion",
    "whatsapp": "08973097633",
    "email": "alfahrezadzakiandra@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1807250053449",
    "alamatUsaha": "Jl drs moch hatta 201b pendem junrejo batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/moofbride?igsi=MWI1N2xxbGRzbmI5Ng==",
    "tiktok": "https://www.tiktok.com/@moofbride?_r=1&_d=f2811h1m0d699d&sec_uid=MS4wLjABAAAAn-qdfYnGaV4FO-wFD_3-Ly3RuPeu95UxM0u-HK6Pu5_na5rZVbXl33KG47JRyHGC&share_author_id=7022238585895306241&sharer_language=id&source=h5_t&u_code=dla0h0eim24ha1&timestamp=1788593769&user_id=7022238585895306241&sec_user_id=MS4wLjABAAAAn-qdfYnGaV4FO-wFD_3-Ly3RuPeu95UxM0u-HK6Pu5_na5rZVbXl33KG47JRyHGC&item_author_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7681737815709828885&share_link_id=c2426fb2-07c1-4bfe-8bd1-7001aea70ce9&share_app_id=1180&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb7360&social_share_type=5&enable_checksum=1",
    "marketplace": "",
    "deskripsi": "Moofbride bergerak di bidang jasa di sektor fashion craft  ,dengan jenis usaha seperti custom  & gaun pengantin , kebaya dan sewa box & hias hantaran"
  },
  {
    "row": 34,
    "timestamp": "06/09/2026 8:24:15",
    "namaUsaha": "Mazedo Inti Jaya",
    "namaPemilik": "Taufiq Hidayah Irianti/agus Suparmanto",
    "subsektor": "Kuliner",
    "whatsapp": "081335371078",
    "email": "iriantimalang2000@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1608230061239",
    "alamatUsaha": "-",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "https://www.instagram.com/mazedoherbal?igsh=aTF4bmNxYXR4eDNk",
    "tiktok": "https://www.tiktok.com/@mazedo_herbal?_t=ZS-90oDuuTOCHq&_r=1",
    "marketplace": "https://id.shp.ee/1Uf3CtMf",
    "deskripsi": "Produsen minuman herbal instan yang menggunakan bahan herbal alami tanpa zat pengawet serta tanpa mengunakan bahan kimia. Diolah dengan alat2 food grade dikemas dalam sachet foil  dalam pouch atau box,Sdh halal pirt ,kemasan praktis siap seduh"
  },
  {
    "row": 35,
    "timestamp": "06/09/2026 15:19:28",
    "namaUsaha": "Non'k Kitchen",
    "namaPemilik": "Enok Sri Kustiyah",
    "subsektor": "Kuliner",
    "whatsapp": "081336554420",
    "email": "enosrikutiya@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "-",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Non'k Kitchen memiliki beberapa produk makanan dan minuman andalan,terutama healthy food maupun healthy drink berbahan organik dan hydrophonik maupun organik,tapi karena saat ini tempat usaha yg ada segmennya untuk abak muda jadi non'k kichen mengikuti"
  },
  {
    "row": 36,
    "timestamp": "06/09/2026 20:00:00",
    "namaUsaha": "Cinematosh Presenter Indonesia",
    "namaPemilik": "Sugoy Suhendra & Diana Dwi Novita",
    "subsektor": "Film, Animasi & Video",
    "whatsapp": "081334484106",
    "email": "diananovita13@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "0103220039671",
    "alamatUsaha": "Jl.Cemara Kipas, Perumahan Troya Residence Ruko D, Sidomulyo",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/cinematosh_tv/",
    "tiktok": "https://tiktok.com/@cinematosh_tv",
    "marketplace": "",
    "deskripsi": "Lembaga pendidikan yang bergerak di bidang pelatihan/kursus public speaking yang dipadu dengan dunia broadcast dan youtuber, serta memproduksi program acara sendiri yang ditayangkan di Channel YouTube."
  },
  {
    "row": 37,
    "timestamp": "07/09/2026 7:25:02",
    "namaUsaha": "Omah Kreatif Ekomando",
    "namaPemilik": "Liana Afianita",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "08383586821",
    "email": "nitha.ribby@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "-",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/omah.kreatifekomando2?stkn=cWZsY3pjMXk0OXZ3",
    "tiktok": "https://www.tiktok.com/@nitharibby",
    "marketplace": "",
    "deskripsi": "Menyediakan berbagai macam hampres \nBuket uang, buket Snack \nBallon gift\nMahar.seserahan\nAneka parcel pecah belah, parcel baby, parcel lebaran"
  },
  {
    "row": 38,
    "timestamp": "07/09/2026 7:25:36",
    "namaUsaha": "Kedai My Wonton",
    "namaPemilik": "Yeni Indra Dewi",
    "subsektor": "Kuliner",
    "whatsapp": "082143001341",
    "email": "mawarasih91@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "Ada",
    "alamatUsaha": "-",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Pangsit rebus dengan isian ayam dan udang cincang dengan saus chili oil"
  },
  {
    "row": 39,
    "timestamp": "07/09/2026 7:36:23",
    "namaUsaha": "Tahu Campur Pak Arifin",
    "namaPemilik": "Ahmad Arifin",
    "subsektor": "Kuliner",
    "whatsapp": "085850354342",
    "email": "aarifintc@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1210230061606",
    "alamatUsaha": "-",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Usaha kuliner tahu campur yg diroses dari bahan fres diolah sendiri tamoa msg dan pengawet"
  },
  {
    "row": 40,
    "timestamp": "07/09/2026 10:36:36",
    "namaUsaha": "Tresnaning Karyo",
    "namaPemilik": "Ridha Hartatik",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "081334198519",
    "email": "ridhahartatik9@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "3108210027971",
    "alamatUsaha": "Jalan Mawar Putih no . 17 RT 01 RW 11 Sidomulyo",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Membuat kerajinan berbahan dasar daur ulang  dari sak semen dan juga glangsi , dibuat tas , dompet dan kostum daur ulang ."
  },
  {
    "row": 41,
    "timestamp": "07/09/2026 10:37:01",
    "namaUsaha": "Galery Kepon",
    "namaPemilik": "Indrayanti Alfa Sulaiman",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "081615641044",
    "email": "indrasembiloka12@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1232000492033",
    "alamatUsaha": "Dsn kandangan rt 7 rw 4 gunungsari bumiaji",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Membuat kerajinan berbahan dasar daur ulang menjadi sebuah kostum dan kerajinan tangan berupa gantungan kunci, bunga, vas dll"
  },
  {
    "row": 42,
    "timestamp": "08/09/2026 15:26:32",
    "namaUsaha": "Batu Camping",
    "namaPemilik": "Devi Aristiningtias",
    "subsektor": "Lainnya",
    "whatsapp": "085791566286",
    "email": "devi.aris11@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "2310210012411",
    "alamatUsaha": "Jl. Wukir rt.01 rw.04 no.137, kelurahan temas",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "https://www.instagram.com/batu.camping",
    "tiktok": "https://tiktok.com/batu.camping",
    "marketplace": "",
    "deskripsi": "Batu Camping adalah penyedia layanan sewa dan setup perlengkapan camping dan VW Combi Campervan Experience di Kota Batu, Jawa Timur. Kami membantu customer untuk menikmati pengalaman camping dan campervan yang lebih praktis tanpa perlu repot menyiapkan perlengkapannya sendiri. Mulai dari camping bersama keluarga, teman, hingga berbagai kebutuhan outdoor experience, semuanya bisa disesuaikan dengan kebutuhan."
  },
  {
    "row": 43,
    "timestamp": "08/09/2026 15:30:20",
    "namaUsaha": "Mau Grill",
    "namaPemilik": "Sela Aliyansi Meilita",
    "subsektor": "Lainnya",
    "whatsapp": "081232456859",
    "email": "selaaliyansi@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "2310210012411",
    "alamatUsaha": "Jl. Wukir RT 1 RW 4 Temas, Batu, Kota Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "https://www.instagram.com/mau.grill?stkn=a2lwazI5ejF3MGNx",
    "tiktok": "https://www.tiktok.com/@mau.grill?_r=1&_t=ZS-99YZZHmsvVh",
    "marketplace": "",
    "deskripsi": "Mau Grill adalah usaha kuliner yang bergerak di bidang home service grill dan catering, dengan layanan penyajian menu grill langsung di lokasi pelanggan seperti rumah, villa, kantor, dan berbagai acara.\n\nProduk yang ditawarkan meliputi paket grill berupa pilihan daging, seafood, sayuran, saus, serta perlengkapan grill, yang tersedia dalam berbagai pilihan paket sesuai jumlah orang dan kebutuhan acara. Tidak hanya paket yang disajikan produk satuan juga melayani regular dan B2B untuk suplai horeca dengan varian produk frozen dan siap saji. Mau Grill mengutamakan kemudahan, kualitas produk, dan pengalaman menikmati grill bersama keluarga, teman, maupun komunitas."
  },
  {
    "row": 44,
    "timestamp": "08/09/2026 15:34:11",
    "namaUsaha": "Binka Shop",
    "namaPemilik": "Sri Astuti",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "081249674137",
    "email": "sriastuti054@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1407250083944",
    "alamatUsaha": "Jl raya dieng 3b batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Binka shop .kami menjual accesories wanita barang handmade dan pabrikan"
  },
  {
    "row": 45,
    "timestamp": "09/09/2026 10:52:45",
    "namaUsaha": "Fida Accessories",
    "namaPemilik": "Wahida Haeraty",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "081253426280",
    "email": "wahidahaeraty@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1277000480186",
    "alamatUsaha": "Batu Love Garden (BALOGA) Jatim Park, Kota Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/fidaaccessories.oleholeh",
    "tiktok": "",
    "marketplace": "https://shopee.co.id/tokowahida12",
    "deskripsi": "Fida Accessories Batu merupakan industri UMKM yang memproduksi (hand made) berbagai kerajinan fashion, seperti gelang, kalung,gantungan kunci, tali masker, tali kacamata, dan accessories oleh-oleh sejenis lainnya dengan motif etnik dan kekinian. kami memasarkan secara retail (eceran) dan juga melayani partai besar (grosir). kami memiliki tempat pemasaran secara konvensional di BALOGA Batu dan Jatim Park kota Batu dan juga memulai memasarkan melalui marketplace Shopee."
  },
  {
    "row": 46,
    "timestamp": "09/09/2026 11:39:25",
    "namaUsaha": "Janus Cafe",
    "namaPemilik": "Yauar Baihaqi",
    "subsektor": "Kuliner",
    "whatsapp": "085895807020",
    "email": "yanuarfree@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Jalan Munif No. 3 Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di atas Rp2,5 miliar",
    "instagram": "https://www.instagram.com/januscoffee/?hl=en",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Usaha cafe, roastery dan produk sirup dan powder"
  },
  {
    "row": 47,
    "timestamp": "10/09/2026 10:51:08",
    "namaUsaha": "Mentari Peyek",
    "namaPemilik": "Miftachul Jannah",
    "subsektor": "Kuliner",
    "whatsapp": "081233659660",
    "email": "itapurnama@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Jl. Hasanudin Gg. Mbah Karyo no 14 RT 01 RW 06 Beru, Bumiaji",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Saya baru merintis usaha peyek, sementara ini untuk pemasaran hanya dititipkan ke warung teman dan ke perseorangan"
  },
  {
    "row": 48,
    "timestamp": "10/09/2026 12:35:53",
    "namaUsaha": "Bandar Buah Sayur Dan Kelapa Muda",
    "namaPemilik": "Hendra Agus Hartoko",
    "subsektor": "Lainnya",
    "whatsapp": "085713665331",
    "email": "freshfruitbandarbuah@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Jl Wukir ratau torong Rejo Krajan RT.01 RW 04 Junrejo kota batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Pedagang sayur dan  buah"
  },
  {
    "row": 49,
    "timestamp": "10/09/2026 12:44:55",
    "namaUsaha": "Chloe Crochet",
    "namaPemilik": "Gracyana Gitta",
    "subsektor": "Kriya / Kerajinan",
    "whatsapp": "085117470414",
    "email": "chloe.crochet.id@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Jl. Gondorejo RT2/RW5, Oro-oro Ombo, Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/chloecrochet.id?igsh=MWF0NHdlYXJ3ZXMwMg==",
    "tiktok": "",
    "marketplace": "https://id.shp.ee/ARkTcGTJ",
    "deskripsi": "Chloe Crochet merupakan sebuah brand rajutan handmade yang menghadirkan boneka, bag charm/keychain, dan bunga rajut dengan mengutamakan detail serta kualitas setiap produk yang dibuat, sehingga setiap produknya memiliki karakter tersendiri."
  },
  {
    "row": 50,
    "timestamp": "12/09/2026 21:01:34",
    "namaUsaha": "Istana Keripik Kentang",
    "namaPemilik": "Priscillia Citra Devi Handoyo",
    "subsektor": "Kuliner",
    "whatsapp": "082230422747",
    "email": "istanakeripikkentang@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1701230001776",
    "alamatUsaha": "Jl raya gangsiran Junrejo",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "https://www.instagram.com/keripik_kentang_istana/?hl=id/@keripik_kentang_istana",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Pusat Produksi Keripik Kentang Istana didirikan dengan semangat untuk\nmemanfaatkan potensi luar biasa hasil pertanian kentang di Kota Batu, yang\ndikenal dengan tanahnya yang subur dan kondisi geologis yang mendukung.\nMenyadari kualitas kentang yang dihasilkan di daerah ini, saya terinspirasi untuk\nmengolahnya menjadi produk yang tidak hanya bernilai jual tinggi, tetapi juga\nbisa dinikmati oleh banyak orang sebagai camilan khas yang berkualitas.\nUsaha ini berawal dari keinginan untuk memberikan nilai tambah pada hasil\npertanian kentang yang melimpah, yang selama ini kurang dimanfaatkan dengan\noptimal. Melalui inovasi dalam proses pengolahan, saya berhasil menciptakan\nkeripik kentang yang renyah, lezat, dan berkualitas tinggi, yang mendapat\nsambutan baik di pasar lokal.\nSeiring waktu, usaha ini terus berkembang. Saya mulai mengikuti berbagai\npameran untuk memperkenalkan produk kepada khalayak yang lebih luas. Hal ini\nmembuka banyak peluang dan memperluas jaringan, baik di tingkat nasional\nmaupun internasional. Saat ini, produksi saya telah mampu mencapai lebih dari\n500 kilogram per bulan dan produk kami telah dikirimkan ke berbagai wilayah di\nIndonesia, dari Sabang hingga Merauke.\nPusat Produksi Keripik Kentang Istana berkomitmen untuk terus menjaga kualitas\nproduk, berinovasi dalam rasa, dan memperkenalkan keripik kentang Batu yang\nkhas ke pasar yang lebih luas. Harapan saya ke depan adalah untuk dapat\nmenembus pasar internasional dan mengekspor produk ini ke beberapa negara\ndi dunia, sehingga dapat membawa kebanggaan bagi Kota Batu dan memberikan\nmanfaat lebih besar bagi masyarakat setempat"
  },
  {
    "row": 51,
    "timestamp": "16/09/2026 10:56:07",
    "namaUsaha": "Nickamakeupstudio",
    "namaPemilik": "Nikka Savitri",
    "subsektor": "Lainnya",
    "whatsapp": "085749468931",
    "email": "nickamakeupstudio751@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "2602240247886",
    "alamatUsaha": "Jl Wr Supratman Gg 1 No 4 Sisir Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/nickamakeupstudio?stkn=MWdoOXo1YXM2NnF1aw%3D%3D&utm_source=qr",
    "tiktok": "https://www.tiktok.com/@nickamakeupstudio?_r=1&_t=ZS-99lqSMpio0u",
    "marketplace": "https://id.shp.ee/71yh25a0?fromSource=copy_link&smtt=0.0.9",
    "deskripsi": "Nickamakeupstudio menjual jasa makeup, course makeup dan konten kreator dan sedang merambah ke affiliator"
  },
  {
    "row": 52,
    "timestamp": "17/09/2026 11:51:10",
    "namaUsaha": "Itravel Malang",
    "namaPemilik": "Rika Kartika",
    "subsektor": "Lainnya",
    "whatsapp": "08133338269",
    "email": "rikakartikaw@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Puri wana lestari \nJl. Jati raya B11/9a Pandanlandung Wagir",
    "kotaKabupaten": "Kabupaten Malang",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/itravel_mlg?stkn=cm95bXVoMmMyY25z&utm_source=qr",
    "tiktok": "https://www.tiktok.com/@itravel_mlg?_r=1&_t=ZS-99ncJLJ3UM3",
    "marketplace": "",
    "deskripsi": "Travel agent yang melayani trip di area jawa bali"
  },
  {
    "row": 53,
    "timestamp": "23/09/2026 9:07:34",
    "namaUsaha": "Petite Plates",
    "namaPemilik": "Lana Winda",
    "subsektor": "Kuliner",
    "whatsapp": "082229029992",
    "email": "lanawindada@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "1210240016374",
    "alamatUsaha": "Jl mangga dalam no 33 gondorejo",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/petiteplates__?stkn=MXhjankwM2Y0MDY2Nw==",
    "tiktok": "https://www.tiktok.com/@petiteplates__?_r=1&_t=ZS-99xcEmLis7Q",
    "marketplace": "https://s.shopee.co.id/5VVXnqPCBN",
    "deskripsi": "Menjual berbagai macam olahan untuk mpasi anak siap makan, berupa frozen food. Beberapa ikan fillet"
  },
  {
    "row": 54,
    "timestamp": "23/09/2026 11:16:35",
    "namaUsaha": "Kenayu",
    "namaPemilik": "Hesti Wiluejeng",
    "subsektor": "Kuliner",
    "whatsapp": "081233715875",
    "email": "hesti.wilujeng.kristanti@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Perum puri indah Blok B3/8 beji kota Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "https://www.instagram.com/ken.ayu2021?stkn=bjNxaGlvN3lkbjBr",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Kenayu merupakan salah satu usaha runahan yg bergerak di bidang makanan ringan/snack dan kue kering. Dengan tagline \"Jajanan tradisional dengan konsep kekinian\" kami hadir untuk memberikan rasa nostalgia dalam setiap gigitan kelezatan namun dengan konsep yang kekinian."
  },
  {
    "row": 55,
    "timestamp": "23/09/2026 11:25:21",
    "namaUsaha": "Treya Creative Studio",
    "namaPemilik": "Hesti",
    "subsektor": "Lainnya",
    "whatsapp": "085172420800",
    "email": "ken.ayu2021@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Perum puri indah blok B3/8 Beji kota Batu",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/treya.creativestudio?stkn=MWdtYmd6YXJzbGUweg==",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Sebuah konsep usaha yg bergerak di bidang jasa  sebagai tempat untuk berkolaborasi dengan UMKM lainnya"
  },
  {
    "row": 56,
    "timestamp": "23/09/2026 11:41:59",
    "namaUsaha": "Ajang Ombo",
    "namaPemilik": "Laili Inayah",
    "subsektor": "Kuliner",
    "whatsapp": "085817239918",
    "email": "lailiinayah95@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "3009210015593",
    "alamatUsaha": "Jln tvri no 3 oro-oro ombo",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Camilan olahan labu"
  },
  {
    "row": 57,
    "timestamp": "23/09/2026 11:49:30",
    "namaUsaha": "Lwegitcake",
    "namaPemilik": "Voni Arianti",
    "subsektor": "Kuliner",
    "whatsapp": "081236692449",
    "email": "lwegitcake@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Jln. Abdulgani g2 no 59a",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Lwegitcake adalah brand bakery modern yang merevolusi segmen oleh-oleh dan camilan harian melalui inovasi produk berbasis bahan baku lokal. Dengan produk unggulan Brownies Tempe Crispy—kombinasi unik cita rasa lokal bernutrisi tinggi dan tren snacking modern—serta varian cookies premium, kami menghadirkan produk tahan lama dengan potensi skalabilitas pasar yang luas. Kami siap menguasai pasar nasional."
  },
  {
    "row": 58,
    "timestamp": "03/10/2026 15:46:39",
    "namaUsaha": "Keripik Tempe \"Iben\"",
    "namaPemilik": "Choirul Anisah",
    "subsektor": "Kuliner",
    "whatsapp": "085784432076",
    "email": "anisahchoirul@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Jl Patimura gg 1 no 51A rt 02 rw 08",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Keripik tempe iben renyahnya bikin nagih.di buat dari tempe kedelai pilihan di iris manual dengan bumbu rempah yang meresap tidak keras dan tidak berminyak.varian pack 3picis 2000an dan pack oleh**150gr"
  },
  {
    "row": 59,
    "timestamp": "03/10/2026 16:01:24",
    "namaUsaha": "Pentol Juara Ngalam",
    "namaPemilik": "Titi Purwoningsih",
    "subsektor": "Lainnya",
    "whatsapp": "087808091991",
    "email": "titipurwoningsih9@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Perum D'Rich Garden blok JB A16 Kedungkandang",
    "kotaKabupaten": "Kota Malang",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.tiktok.com/@titi_8991?_r=1&_t=ZS-9AF6ZrVdlxg",
    "tiktok": "https://www.tiktok.com/@titi_8991?_r=1&_t=ZS-9AF6ZrVdlxg",
    "marketplace": "",
    "deskripsi": "Produk Pentol Frozen"
  },
  {
    "row": 60,
    "timestamp": "03/10/2026 16:38:45",
    "namaUsaha": "Sawetu",
    "namaPemilik": "Vita Belfi",
    "subsektor": "Kuliner",
    "whatsapp": "081252622176",
    "email": "loevie02@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "jl Batok No.10 Sisir Kota Batu Rt03. Rw.07",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "https://www.instagram.com/sawetu.botanica?stkn=eDV5aHpmd2c2N3li&utm_source=qr",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Sawetu adalah sebuah usaha yang bergerak di bidang teh celup bunga telang dan rosella, berangkat dari komitmen untuk mendukung gaya hidup sehat masyarakat modern, kami hadirkan teh celup bunga berkualitas, higienis, dan praktis bisa dibawa kemanapun. \nproduk kami bukan sekedar minuman penghangat tubuh, melainkan pengalaman menikmati seduhan herbal yang kaya manfaat dan estetis. dikemas secara praktis dalam kantong teh ramah lingkungan. Sawetu siap menjadi teman setia relaksasi dan kesehatan anda disetiap tegukan"
  },
  {
    "row": 61,
    "timestamp": "04/10/2026 20:13:43",
    "namaUsaha": "Teman Lapar",
    "namaPemilik": "Nine Dhita",
    "subsektor": "Kuliner",
    "whatsapp": "085857196058",
    "email": "ninedhita@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "-",
    "alamatUsaha": "Joko bundu 115, rt 04 rw 3 sumber gondo",
    "kotaKabupaten": "Kota Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": "Produk frozen food ( ayam goreng, kebab )"
  },
  {
    "row": 62,
    "timestamp": "08/10/2026 22:16:43",
    "namaUsaha": "Goodsigma Sportwear",
    "namaPemilik": "Osman Nur Chaidir",
    "subsektor": "Fashion",
    "whatsapp": "81296159877",
    "email": "odie0706@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "odie0706@gmail.com",
    "alamatUsaha": "Fashion",
    "kotaKabupaten": "Jl Bantaran 1 Nomor 45, Lowokwaru",
    "omzet": "2022",
    "instagram": "",
    "tiktok": "",
    "marketplace": "",
    "deskripsi": ""
  },
  {
    "row": 63,
    "timestamp": "10/10/2026 16:05:02",
    "namaUsaha": "Abhin Sewa",
    "namaPemilik": "Sri Happy Nisaur",
    "subsektor": "Lainnya",
    "whatsapp": "81239069060",
    "email": "foto.srihappy@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "foto.srihappy@gmail.com",
    "alamatUsaha": "Kota Batu",
    "kotaKabupaten": "Jl. Utomorejo No 54",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "Saya memiliki usaha rental perlengkapan bayi dan stroller harian di Kota Batu",
    "deskripsi": "Saya memiliki usaha rental perlengkapan bayi dan stroller harian di Kota Batu"
  },
  {
    "row": 64,
    "timestamp": "10/10/2026 17:01:50",
    "namaUsaha": "Abhin Sewa",
    "namaPemilik": "Sri Happy Nisaur",
    "subsektor": "Lainnya",
    "whatsapp": "81239069060",
    "email": "foto.srihappy@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "foto.srihappy@gmail.com",
    "alamatUsaha": "Kota Batu",
    "kotaKabupaten": "Jl. Utomorejo No 58",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "Sewa rental pompa asi dan mainan. Sewa stroller harian di kota batu",
    "deskripsi": "Sewa rental pompa asi dan mainan. Sewa stroller harian di kota batu"
  },
  {
    "row": 65,
    "timestamp": "10/10/2026 17:03:33",
    "namaUsaha": "Kripik Lokal Dewi Nurjan Mbah Batu",
    "namaPemilik": "Siti Mukaromah",
    "subsektor": "Kuliner",
    "whatsapp": "81336546890",
    "email": "mukaromah.546890@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "mukaromah.546890@gmail.com",
    "alamatUsaha": "Kota Batu",
    "kotaKabupaten": "torongrejo krajan rt 05 rw 06",
    "omzet": "Rp50 juta – Rp300 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "aneka kripik lokal \nkripik pisang\nkripik talas\nkripik ubi ungu",
    "deskripsi": "aneka kripik lokal \nkripik pisang\nkripik talas\nkripik ubi ungu"
  },
  {
    "row": 66,
    "timestamp": "10/10/2026 17:06:59",
    "namaUsaha": "Keripik Tempe \"Iben\"",
    "namaPemilik": "Choirul Anisah",
    "subsektor": "Kuliner",
    "whatsapp": "85784432076",
    "email": "anisahchoirul10@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "anisahchoirul10@gmail.com",
    "alamatUsaha": "Kota Batu",
    "kotaKabupaten": "Jl patimura gg 1 no 51A rt 02 rw08 Temas Batu",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "Keripik tempe di buat dari tempe kedelai pilihan dg bumbu tradisional..berasa ngrempah banget sangat renyah dan tidak bermibyak",
    "deskripsi": "Keripik tempe di buat dari tempe kedelai pilihan dg bumbu tradisional..berasa ngrempah banget sangat renyah dan tidak bermibyak"
  },
  {
    "row": 67,
    "timestamp": "10/10/2026 17:20:02",
    "namaUsaha": "Keripik Tempe \"Iben\"",
    "namaPemilik": "Choirul Anisah",
    "subsektor": "Kuliner",
    "whatsapp": "85784432076",
    "email": "anisahchoirul@gmail.com",
    "statusKurasi": "Lolos Kurasi",
    "catatanKurator": "",
    "sesi": "Sesi 2",
    "nib": "anisahchoirul@gmail.com",
    "alamatUsaha": "Kota Batu",
    "kotaKabupaten": "Jl patimura gg 1no 51A rt02 rw08",
    "omzet": "Di bawah Rp50 juta",
    "instagram": "",
    "tiktok": "",
    "marketplace": "Keripik Tempe \"Iben\" sangat renyah ngrempah d buat dr bahan tempe kedelai pilihan serta bumbu rempah alami",
    "deskripsi": "Keripik Tempe \"Iben\" sangat renyah ngrempah d buat dr bahan tempe kedelai pilihan serta bumbu rempah alami"
  }
];

export const INITIAL_ASESMEN: AsesmenItem[] = [
  {
    "row": 2,
    "timestamp": "10/09/2026 18:34:03",
    "namaUsaha": "Janus Cafe",
    "whatsapp": "85895807020",
    "totalSkor": 60,
    "poinBisaAjarkan": "Leadership",
    "materiBisaAjarkan": "Mindset pengusaha",
    "poinPerluDipelajari": "Marketing",
    "sesi": "Sesi 2",
    "kekuatan": "Kualitas & Keunikan Produk/Jasa",
    "kekuatanSkor": 5,
    "kelemahan": "Marketing",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": "Lokasi strategis, produk berkualitas, keuntungan jelas"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 5,
        "catatan": "Terus mengembangkan kualitas dan membuat terobosan baru"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": "Punya identitas visual, namun masih belum dikenal luas di luar daerah"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 4,
        "catatan": "Sudah memisahkan keuangan pribadi dan usaha, namun ada momen kekurangan modal dan harus menyuntik"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Halal bpom pirt ada"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Open for all possibilities"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": "Menjadi tempat berkumpul"
      },
      {
        "kriteria": "Leadership",
        "skor": 4,
        "catatan": "Usaha sudah berdiri sendiri dan tidak tergantung saya"
      },
      {
        "kriteria": "Operasional",
        "skor": 4,
        "catatan": "Sudah berjalan otomatis"
      },
      {
        "kriteria": "Marketing",
        "skor": 2,
        "catatan": "Hanya mengandalkan instagram dan orang lewat"
      },
      {
        "kriteria": "Financial",
        "skor": 4,
        "catatan": "Keuangan tertata"
      },
      {
        "kriteria": "Sales",
        "skor": 4,
        "catatan": "Penjualan cenderung stabil"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Tidak ada komplain berarti"
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "Banyak kesempatan berkembang"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Kualitas bisa diadu"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 4
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.29
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 2
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "jawaban": "Bisnis berjalan terstruktur dan terus bertumbuh tanpa bergantung pada kehadiran fisik saya setiap hari.",
            "skor": 5,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "jawaban": "Tim sangat memahami tujuan besar bisnis ini dan berani mengambil inisiatif mandiri untuk mencapainya tanpa harus selalu diperintah."
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "skor": 3
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku."
          }
        ],
        "skorRataRata": 4
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin.",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis.",
            "skor": 3
          }
        ],
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3
      },
      {
        "skorRataRata": 3.29,
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Sesekali berjejaring, namun hanya untuk kepentingan mencari pelanggan baru (transaksional).",
            "skor": 2
          },
          {
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "skor": 5,
            "jawaban": "Legalitas badan usaha sangat lengkap, tersimpan rapi, dan rutin melaporkan kewajiban pajak bisnis secara disiplin.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?"
          },
          {
            "skor": 2,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "jawaban": "Tim harus lembur memaksakan diri, stres tinggi, dan kualitas pekerjaan atau produk menurun drastis."
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "jawaban": "Seluruh standar operasional diatur dalam panduan baku tertulis yang wajib diikuti oleh tim."
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Tim merujuk pada panduan standar penyelesaian masalah yang sudah disepakati sebelumnya."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal."
          }
        ],
        "kategori": "Operation (Operasional)"
      },
      {
        "rincian": [
          {
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka.",
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "skor": 5
          },
          {
            "jawaban": "Kami diakui sebagai rujukan utama atau pilihan prioritas di wilayah operasional atau kategori kami.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 4
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengandalkan asumsi atau perkiraan internal bahwa pasar pasti akan menyukainya."
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing."
          }
        ],
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4
      },
      {
        "rincian": [
          {
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "skor": 3
          },
          {
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata.",
            "skor": 4,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?"
          },
          {
            "jawaban": "Tidak ada sistem. Kami baru tahu ada masalah jika pelanggan marah besar atau omset anjlok.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "jawaban": "Memiliki metode atau program terstruktur yang mendorong pelanggan untuk terus berinteraksi atau bertransaksi kembali.",
            "skor": 4
          }
        ],
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.25,
        "rincian": [
          {
            "skor": 5,
            "jawaban": "Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?"
          },
          {
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh.",
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "skor": 4
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Dibiarkan menumpuk berantakan dalam riwayat pesan instan sehingga sulit dicari."
          },
          {
            "jawaban": "Cenderung pasif, hanya menunggu tanpa ada usaha untuk memastikan kepastian jawaban pelanggan.",
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "skor": 2
          }
        ]
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 2,
        "rincian": [
          {
            "skor": 2,
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Selalu memosisikan bisnis kami sebagai pihak yang paling hebat, berpengalaman, atau tiada tanding."
          },
          {
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "jawaban": "Sepenuhnya bersikap pasif; hanya berharap ada keajaiban dari promosi mulut ke mulut.",
            "skor": 1
          },
          {
            "skor": 2,
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat."
          }
        ]
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "skor": 4,
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal."
          },
          {
            "skor": 3,
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "skor": 3,
            "jawaban": "Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra."
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 3,
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis."
          }
        ],
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25
      }
    ]
  },
  {
    "row": 3,
    "timestamp": "13/09/2026 15:09:46",
    "namaUsaha": "Cleopatra",
    "whatsapp": "81252513996",
    "totalSkor": 55,
    "poinBisaAjarkan": "Service",
    "materiBisaAjarkan": "Service Excellence, Komunikasi, Public Speaking",
    "poinPerluDipelajari": "Growth",
    "sesi": "Sesi 2",
    "kekuatan": "Kualitas & Keunikan Produk/Jasa",
    "kekuatanSkor": 5,
    "kelemahan": "Growth",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 3,
        "catatan": "Masih kurang, masih sangat bergantung pada pemilik"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 5,
        "catatan": "Saya percaya kualitas dan keunikan jasa kami sangat baik dibanding kompetitor sejenis"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": "Cukup, belum maksimal"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 4,
        "catatan": "Lumayan baik, terpisah dr pribadi"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Sangat baik"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 4,
        "catatan": "Sangat baik, namun terhambat waktu karena jalannya usaha masih sangat bergabtung besar ke pemilik"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 5,
        "catatan": "Usaha kami melibatkan banyak vendor lain"
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Saya leader yg baik dlm membangun teamwork dan kebersamaan, namun kurang memiliki ketegasan"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "Sedang, belum tertata dgn maksimal"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "Promosi dan branding masih secara manual, secara digital masih standarr2 saja"
      },
      {
        "kriteria": "Financial",
        "skor": 3,
        "catatan": "Pencatatan tertata dgn baik, namun pengelolaan masih morat marit"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "Sedang saja, mayoritas prospek menggunakan jasa kami. Namun masih bergantung pada pemilik"
      },
      {
        "kriteria": "Service",
        "skor": 5,
        "catatan": "Mayoritas pelanggan menyatakan puas dan repeat order. Hasil survey kepuasan pelanggan rata2 tinggi"
      },
      {
        "kriteria": "Growth",
        "skor": 2,
        "catatan": "Masih lemah, pemilik masih umek saja dengan operasional pekerjaan sehari2"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Kualitas saya percaya baik,"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.75
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 5
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.25
      }
    ],
    "bagian3Detail": [
      {
        "skorRataRata": 3,
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "jawaban": "Saya mulai mendelegasikan tugas teknis, tapi mengawasi setiap gerak-gerik tim secara berlebihan.",
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 2
          },
          {
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 3,
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu."
          },
          {
            "skor": 3,
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?"
          }
        ]
      },
      {
        "skorRataRata": 3,
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?"
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menentukan harga berdasarkan besarnya manfaat, kualitas, dan solusi yang dirasakan langsung oleh pelanggan.",
            "skor": 4
          },
          {
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "skor": 3
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan."
          }
        ]
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Terbuka untuk berkolaborasi jika ada pihak lain yang mengajak dan menanggung biayanya.",
            "skor": 3
          },
          {
            "jawaban": "Terbuka belajar dan rutin menggunakan perangkat lunak digital untuk memangkas waktu kerja manual tim.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "skor": 4
          },
          {
            "jawaban": "Legalitas badan usaha sangat lengkap, tersimpan rapi, dan rutin melaporkan kewajiban pajak bisnis secara disiplin.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 5
          },
          {
            "skor": 3,
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "jawaban": "Ada sedikit panduan tertulis secara acak, namun tidak lengkap dan jarang diperbarui."
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Tim merujuk pada panduan standar penyelesaian masalah yang sudah disepakati sebelumnya."
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "skor": 3
          }
        ],
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "rincian": [
          {
            "skor": 5,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka."
          },
          {
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 4,
            "jawaban": "Kami diakui sebagai rujukan utama atau pilihan prioritas di wilayah operasional atau kategori kami."
          },
          {
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "skor": 5,
            "jawaban": "Menganalisa kebiasaan dan kesulitan pelanggan secara mendalam untuk menawarkan solusi yang bahkan belum mereka sadari."
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "skor": 5,
            "jawaban": "Produk/jasa kami telah terintegrasi erat dengan aktivitas rutin pelanggan sehingga sulit bagi mereka untuk beralih."
          }
        ],
        "skorRataRata": 4.75,
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "skorRataRata": 5,
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "skor": 5,
            "jawaban": "Tim sangat proaktif memandu, mengantisipasi kebingungan, dan membantu pelanggan sebelum mereka memintanya.",
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 5,
            "jawaban": "Tim garda depan diberi wewenang, keluwesan, dan batasan anggaran mandiri untuk menebus kekecewaan pelanggan secara langsung saat itu juga."
          },
          {
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Secara aktif menggali pendapat pelanggan secara mendalam untuk memahami kelebihan dan kekurangan bisnis kami.",
            "skor": 5
          },
          {
            "skor": 5,
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "jawaban": "Konsisten memberikan nilai tambah edukasi, perhatian khusus, atau membangun komunitas di sekitar merek kami."
          }
        ]
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.25,
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka.",
            "skor": 5
          },
          {
            "skor": 4,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh."
          },
          {
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?"
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal."
          }
        ]
      },
      {
        "skorRataRata": 3.25,
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Menyampaikan nilai, cerita, dan semangat merek yang membuat pelanggan merasa bangga dan sejalan dengan ideologi kami.",
            "skor": 5
          },
          {
            "jawaban": "Sering membagikan ilmu atau referensi berkualitas tinggi secara gratis yang memperkuat citra profesional bisnis di industrinya.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 5
          },
          {
            "skor": 1,
            "jawaban": "Sepenuhnya bersikap pasif; hanya berharap ada keajaiban dari promosi mulut ke mulut.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "skor": 2,
            "jawaban": "Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat.",
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?"
          }
        ]
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.25,
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu.",
            "skor": 3
          },
          {
            "jawaban": "Pemilik langsung mengambil beban ganda dengan bekerja jauh lebih keras dan mengorbankan waktu istirahat.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "skor": 1
          },
          {
            "jawaban": "Pemilik baru mencoba memikirkan ide-ide segar ketika dilanda kepanikan akibat penurunan omset.",
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "skor": 2
          },
          {
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.",
            "skor": 3,
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?"
          }
        ]
      }
    ]
  },
  {
    "row": 4,
    "timestamp": "13/09/2026 16:02:22",
    "namaUsaha": "Linara Craft",
    "whatsapp": "85257324459",
    "totalSkor": 68,
    "poinBisaAjarkan": "Operasional",
    "materiBisaAjarkan": "Saya beberapa kali berkolaborasi menjadi pemateri workshop yang diselenggarakan oleh Universitas Brawijaya",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Kejelasan Model Bisnis",
    "kekuatanSkor": 5,
    "kelemahan": "Operasional",
    "kelemahanSkor": 4,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 5,
        "catatan": "Sangat jelas. Saya sering mencari info event-event bazar dan promosi digital serta pelanggan yang sering kembali ke saya"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 5,
        "catatan": "Saya bergerak di bidang kriya. Yang saya tawarkan kepada customer yaitu servis gratis. Karena saya yakin akan kualitas produk saya. Saya juga melayani orderan sesuai permintaan customer"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 5,
        "catatan": "Photo profile saya adalah logo brand usaha saya. Sering melakukan komunikasi dengan calon-calon customer"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 5,
        "catatan": "Saya sudah melakukan pembukuan dasar sehingga terpantau jelas naik atau turunnya omset tiap periode"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Saya sudah melengkapi dokumen kepemilikan usaha yaitu NIB dan juga legalitas brand usaha saya yaitu Hki"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Saya sangat terbuka untuk bekerjasama dengan pihak manapun. Asal komit dan jelas"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 5,
        "catatan": "Sebagai UMKM minimal saya telah menciptakan lapangan pekerjaan untuk diri sendiri dan membantu perekonomian tim saya"
      },
      {
        "kriteria": "Leadership",
        "skor": 5,
        "catatan": "Saya sudah memimpin usaha saya yang bergerak dibidang kriya,sejak tahun 2012 hingga sekarang."
      },
      {
        "kriteria": "Operasional",
        "skor": 4,
        "catatan": "Semampu saya. Jika ada orderan,maka orderan yang saya dahulukan. Tetapi jika tidak ada orderan maka saya membuat stok yang banyak dan berinovasi mencoba hal baru"
      },
      {
        "kriteria": "Marketing",
        "skor": 4,
        "catatan": "Selama ini pemasaran yang saya lakukan terjun langsung ke pasar,dan  berkolaborasi dengan beberapa pihak. Dan belum mengoptimalkan digital marketing."
      },
      {
        "kriteria": "Financial",
        "skor": 4,
        "catatan": "Uang usaha dan pribadi yang terpisah. Serta melakukan pencatatan keuangan secara rutin dan berkelanjutan. Tapi masih menggunakan sistem manual"
      },
      {
        "kriteria": "Sales",
        "skor": 4,
        "catatan": "Saya sendiri yang bertatap muka dengan customer dan menanyakan kebutuhan customer. Memberi saran dan solusi terbaik kepada customer"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Sejauh ini, customer saya sering balik lagi dan merekomendasikan produk saya kepada kenalan mereka"
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "Saya selalu memantau trend yang sedang digemari saat ini. Dan terus melakukan inovasi. Karena trend Acesories itu selalu berubah-ubah sesuai jamannya"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Produk saya bisa dikatakan sama seperti produk-produk dari umkm lain. Kelebihan saya selalu menawarkan servis gratis."
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.43
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4.75
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.",
            "skor": 1
          },
          {
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 2
          },
          {
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "skor": 3
          }
        ],
        "skorRataRata": 2.25
      },
      {
        "skorRataRata": 3.5,
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Memiliki alokasi pos pengeluaran yang ketat sehingga biaya operasional selalu terjaga sesuai batas aman anggaran.",
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?"
          },
          {
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "skor": 3
          },
          {
            "skor": 4,
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "jawaban": "Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis."
          }
        ],
        "kategori": "Finance (Keuangan)"
      },
      {
        "kategori": "Operation (Operasional)",
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Terbuka untuk berkolaborasi jika ada pihak lain yang mengajak dan menanggung biayanya."
          },
          {
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "skor": 3
          },
          {
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 3
          },
          {
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan.",
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 4
          },
          {
            "skor": 4,
            "jawaban": "Seluruh standar operasional diatur dalam panduan baku tertulis yang wajib diikuti oleh tim.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "jawaban": "Tim merujuk pada panduan standar penyelesaian masalah yang sudah disepakati sebelumnya.",
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 4
          },
          {
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 3
          }
        ],
        "skorRataRata": 3.43
      },
      {
        "skorRataRata": 4.5,
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka.",
            "skor": 5,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "jawaban": "Produk kami memiliki karakter atau ciri khas yang sangat kuat, sehingga pelanggan merasa sulit mencari penggantinya di tempat lain.",
            "skor": 5
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan."
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "skor": 4,
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing."
          }
        ]
      },
      {
        "skorRataRata": 3.75,
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Sangat mulus dan minim hambatan; kami selalu mencari cara menyederhanakan proses bagi pelanggan.",
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata.",
            "skor": 4
          },
          {
            "jawaban": "Memiliki mekanisme berkala untuk memantau tingkat kepuasan pelanggan setelah transaksi selesai.",
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "skor": 4
          },
          {
            "skor": 3,
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?"
          }
        ]
      },
      {
        "skorRataRata": 4.5,
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 5,
            "jawaban": "Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka."
          },
          {
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "skor": 4,
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh."
          },
          {
            "jawaban": "Data kontak dikelompokkan berdasarkan seberapa besar minat atau kesiapan mereka untuk bertransaksi.",
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?"
          },
          {
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal.",
            "skor": 5,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?"
          }
        ],
        "kategori": "Sales (Penjualan)"
      },
      {
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.",
            "skor": 4
          },
          {
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "skor": 5,
            "jawaban": "Memiliki daya pikat alami yang begitu kuat, sehingga orang-orang secara sukarela merekomendasikan dan membicarakannya.",
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?"
          }
        ],
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.75
      },
      {
        "skorRataRata": 4.75,
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal.",
            "skor": 4
          },
          {
            "jawaban": "Menggunakan skema terstruktur untuk bertumbuh (seperti kemitraan, lisensi, atau perbaikan model distribusi) yang meminimalkan beban harian pemilik.",
            "skor": 5,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Semangat mencoba cara kerja yang lebih baik telah menjadi budaya tim; setiap orang didorong untuk menguji usulan ide baru.",
            "skor": 5
          },
          {
            "jawaban": "Reputasi dan kualitas produk sangat bisa diandalkan, sehingga merekomendasikannya kepada orang lain menjadi bentuk kebanggaan alami bagi pelanggan.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 5
          }
        ],
        "kategori": "Growth (Pertumbuhan)"
      }
    ]
  },
  {
    "row": 5,
    "timestamp": "13/09/2026 17:05:07",
    "namaUsaha": "De Rivi",
    "whatsapp": "81216104768",
    "totalSkor": 46,
    "poinBisaAjarkan": "Growth",
    "materiBisaAjarkan": "peluang usaha dibidang advertising",
    "poinPerluDipelajari": "Marketing",
    "sesi": "Sesi 2",
    "kekuatan": "Growth",
    "kekuatanSkor": 5,
    "kelemahan": "Marketing",
    "kelemahanSkor": 1,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": "DeRivi merupakan usaha custom dan printing yang menyediakan berbagai produk personalisasi, seperti label kulit, label akrilik, buket custom, mug custom, undangan, buku Yasin, serta berbagai produk hadiah dan kebutuhan acara.\n\nTarget pasar DeRivi cukup luas, mulai dari pelajar dan mahasiswa, orang tua, guru, pelaku UMKM, hingga masyarakat yang membutuhkan hadiah atau produk custom untuk ulang tahun, pernikahan, wisuda, acara sekolah, maupun kebutuhan usaha.\n\nCara DeRivi menghasilkan pendapatan adalah melalui penjualan produk custom secara langsung maupun melalui pemesanan online. Pelanggan dapat memilih produk dan melakukan personalisasi sesuai kebutuhan. Pendapatan diperoleh dari selisih harga jual dengan biaya bahan, produksi, dan pengerjaan setiap pesanan. Sistem produksi berdasarkan pesanan juga membantu menyesuaikan jumlah produksi dengan permintaan pelanggan."
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "Nilai tambah DeRivi terletak pada kemampuan menyediakan produk custom yang dapat disesuaikan dengan kebutuhan dan keinginan pelanggan. Pelanggan tidak hanya membeli produk, tetapi juga mendapatkan produk yang lebih personal dan memiliki nilai emosional.\n\nKualitas menjadi perhatian utama, mulai dari pemilihan bahan, proses desain, hingga proses produksi dan finishing. Setiap pesanan dikerjakan dengan memperhatikan kerapian dan detail agar menghasilkan produk yang layak digunakan maupun diberikan sebagai hadiah.\n\nPembeda DeRivi dibanding kompetitor adalah menawarkan berbagai jenis produk custom dalam satu usaha, seperti label kulit, label akrilik, buket, mug custom, dan produk personalisasi lainnya. DeRivi juga memberikan ruang bagi pelanggan untuk menentukan desain, nama, tulisan, atau konsep sesuai kebutuhan, sehingga setiap produk dapat dibuat lebih unik dan tidak terasa seperti produk massal.\n\nDengan mengutamakan kreativitas, personalisasi, kualitas, dan pelayanan yang fleksibel, DeRivi berusaha memberikan pengalaman pembelian yang lebih dekat dengan kebutuhan setiap pelanggan."
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": "DeRivi menggunakan identitas visual yang konsisten melalui penggunaan nama dan logo DeRivi pada materi promosi, produk, serta kemasan. Identitas tersebut menjadi ciri yang membantu pelanggan mengenali produk DeRivi.\n\nDalam pemasaran, DeRivi aktif memanfaatkan media sosial dan marketplace untuk menampilkan katalog produk, hasil pesanan, promosi, serta konten produk custom seperti label, buket, mug, dan produk personalisasi lainnya.\n\nKonten dibuat dengan menampilkan produk secara menarik dan informatif, sehingga pelanggan dapat melihat contoh hasil, memahami pilihan custom, dan menghubungi DeRivi untuk melakukan pemesanan. Ke depannya, DeRivi terus memperkuat konsistensi branding, kualitas foto/video produk, kemasan, dan aktivitas media sosial agar lebih mudah dikenali dan dipercaya oleh pelanggan."
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 2,
        "catatan": "masih tidak tertata"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 4,
        "catatan": "memiliki NIB dan HKI"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 3,
        "catatan": "DeRivi terbuka terhadap masukan, kritik, dan saran dari pelanggan sebagai bahan evaluasi untuk meningkatkan kualitas produk dan pelayanan. Masukan pelanggan digunakan untuk mengetahui kebutuhan pasar serta mengembangkan desain dan produk baru.\n\nDeRivi juga memiliki semangat untuk terus belajar dan meningkatkan keterampilan, baik melalui pelatihan, tutorial, maupun mengikuti perkembangan tren di bidang desain, custom printing, dan pemasaran digital.\n\nSelain itu, DeRivi terbuka untuk berkolaborasi dengan pelaku usaha kreatif lainnya, seperti UMKM, jasa dekorasi, percetakan, fotografer, maupun pelaku usaha handmade. Kolaborasi diharapkan dapat menciptakan produk yang lebih beragam, memperluas pasar, dan saling mendukung perkembangan usaha."
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 3,
        "catatan": "DeRivi memiliki potensi untuk menciptakan lapangan kerja seiring dengan bertambahnya jumlah pesanan dan perkembangan usaha. Ke depannya, DeRivi dapat melibatkan tenaga tambahan untuk membantu proses produksi, desain, pengemasan, maupun pemasaran.\n\nSelain itu, DeRivi turut berkontribusi pada ekosistem kreatif lokal dengan menggunakan dan bekerja sama dengan pemasok bahan, percetakan, pelaku UMKM, serta usaha kreatif lainnya. Melalui produk custom dan kolaborasi, DeRivi dapat membuka peluang bagi pelaku usaha lokal untuk saling mendukung, memperluas pasar, dan menciptakan produk kreatif yang memiliki nilai jual.\n\nDengan perkembangan usaha yang berkelanjutan, DeRivi diharapkan dapat menjadi salah satu usaha kreatif lokal yang tidak hanya berkembang secara mandiri, tetapi juga memberikan manfaat ekonomi bagi lingkungan sekitarnya."
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "kesalahan pengambilan keputusan ekspansi bisnis menyebabkan kesulitan arus kas"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "seringkali keteteran karena keterbatasan kapasitas mesin dan modal"
      },
      {
        "kriteria": "Marketing",
        "skor": 1,
        "catatan": "kesulitan karena persaingan makin ketat"
      },
      {
        "kriteria": "Financial",
        "skor": 1,
        "catatan": "kegagalan pengembangan usaha menyebabkan arus kas menjadi lemah"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "masih dipercaya mayoritas pelanggan"
      },
      {
        "kriteria": "Service",
        "skor": 3,
        "catatan": "beberapa kali telat menyelesaikan deadline karena keterbatasan kapasitas produksi"
      },
      {
        "kriteria": "Growth",
        "skor": 5,
        "catatan": "apabila ada dukungan mesin dan marketing yg lebih proper pasarnya masih sangat besar"
      },
      {
        "kriteria": "Product",
        "skor": 3,
        "catatan": "karena keterbatasan mesin jenis produk masih terbatas"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 1
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 2
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.25
      }
    ],
    "bagian3Detail": [
      {
        "skorRataRata": 1,
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.",
            "skor": 1,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "skor": 1,
            "jawaban": "Tidak ada komunikasi arah bisnis. Tim hanya datang, bekerja sesuai perintah, dan pulang.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 1,
            "jawaban": "Berdasarkan insting spontan atau kepanikan saat ada masalah mendadak."
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Merekrut siapa saja yang bersedia dibayar murah atau sekadar kenalan saat sedang terdesak.",
            "skor": 1
          }
        ]
      },
      {
        "skorRataRata": 3,
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin.",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "skor": 3,
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar."
          },
          {
            "skor": 3,
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis."
          }
        ],
        "kategori": "Finance (Keuangan)"
      },
      {
        "kategori": "Operation (Operasional)",
        "rincian": [
          {
            "skor": 2,
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Sesekali berjejaring, namun hanya untuk kepentingan mencari pelanggan baru (transaksional)."
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "jawaban": "Terbuka belajar dan rutin menggunakan perangkat lunak digital untuk memangkas waktu kerja manual tim.",
            "skor": 4
          },
          {
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 3
          },
          {
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan.",
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 4
          },
          {
            "jawaban": "Seluruh standar operasional diatur dalam panduan baku tertulis yang wajib diikuti oleh tim.",
            "skor": 4,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "skor": 5
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal."
          }
        ],
        "skorRataRata": 3.57
      },
      {
        "rincian": [
          {
            "jawaban": "Karena produk mampu memberikan solusi yang sangat spesifik dan relevan dengan masalah mereka.",
            "skor": 4,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "jawaban": "Kami fokus melayani celah pasar spesifik yang tidak digarap dengan serius oleh kompetitor besar.",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.",
            "skor": 4
          },
          {
            "jawaban": "Produk/jasa kami telah terintegrasi erat dengan aktivitas rutin pelanggan sehingga sulit bagi mereka untuk beralih.",
            "skor": 5,
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?"
          }
        ],
        "skorRataRata": 4,
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "skorRataRata": 3.25,
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "jawaban": "Sangat mulus dan minim hambatan; kami selalu mencari cara menyederhanakan proses bagi pelanggan.",
            "skor": 4,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 3
          },
          {
            "jawaban": "Memiliki mekanisme berkala untuk memantau tingkat kepuasan pelanggan setelah transaksi selesai.",
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "jawaban": "Hanya merespons komunikasi jika pelanggan yang terlebih dahulu bertanya atau menghubungi.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 2
          }
        ]
      },
      {
        "skorRataRata": 4,
        "kategori": "Sales (Penjualan)",
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "skor": 4
          },
          {
            "skor": 4,
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh.",
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 3,
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana."
          },
          {
            "skor": 5,
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal.",
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?"
          }
        ]
      },
      {
        "skorRataRata": 2,
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "jawaban": "Semuanya hanya berupa katalog jualan langsung: harga, ketersediaan, dan ajakan membeli.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 1
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting."
          },
          {
            "skor": 3,
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 1,
            "jawaban": "Sangat umum dan pasaran; bisnis kami dengan mudah bisa digantikan oleh pesaing baru besok hari."
          }
        ]
      },
      {
        "skorRataRata": 2.25,
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal.",
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "jawaban": "Pemilik langsung mengambil beban ganda dengan bekerja jauh lebih keras dan mengorbankan waktu istirahat.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra.",
            "skor": 3
          },
          {
            "skor": 1,
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Terjadi serba kebetulan dan pemilik tidak pernah melacak dari mana asal rekomendasi tersebut."
          }
        ]
      }
    ]
  },
  {
    "row": 6,
    "timestamp": "14/09/2026 9:33:20",
    "namaUsaha": "The Apsara",
    "whatsapp": "85313855181",
    "totalSkor": 46,
    "poinBisaAjarkan": "Sales",
    "materiBisaAjarkan": "Membuat konten",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Financial",
    "kekuatanSkor": 4,
    "kelemahan": "Kejelasan Model Bisnis",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 2,
        "catatan": "Usahanya baru mulai dirintis"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 3,
        "catatan": "Banyak promo Dan program baru"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": "Branding kecantikan dan spa"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 2,
        "catatan": "Masih belum terstruktur"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 2,
        "catatan": "Sudah ada"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 3,
        "catatan": "Siap menerima masukan"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 3,
        "catatan": "Menciptakan lapangan kerja"
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Sedang karena dalam tim"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "Sumber daya bergantung koperasi"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "Blm ada tim marketing"
      },
      {
        "kriteria": "Financial",
        "skor": 4,
        "catatan": "Belum ada investor"
      },
      {
        "kriteria": "Sales",
        "skor": 4,
        "catatan": "Belum ada tim sales"
      },
      {
        "kriteria": "Service",
        "skor": 3,
        "catatan": "Program belum mulai"
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "Belum ada perkembangan"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Produk unik dan belum ada yg sama"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 1.5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 2.14
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 2
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 2.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 1.75
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.",
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 1
          },
          {
            "skor": 1,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "jawaban": "Tidak ada komunikasi arah bisnis. Tim hanya datang, bekerja sesuai perintah, dan pulang."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu."
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "skor": 3
          }
        ],
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2
      },
      {
        "rincian": [
          {
            "jawaban": "Rekening campur aduk. Uang bisnis sering terpakai untuk keperluan pribadi tanpa pencatatan.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?"
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "skor": 1,
            "jawaban": "Tebak-tebakan saja atau sekadar memasang harga paling murah di pasaran agar laku."
          },
          {
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "skor": 2,
            "jawaban": "Hanya memantau omset atau total uang masuk tanpa tahu persis keuntungannya."
          },
          {
            "skor": 2,
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?"
          }
        ],
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 1.5
      },
      {
        "skorRataRata": 2.14,
        "kategori": "Operation (Operasional)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "skor": 2,
            "jawaban": "Sesekali berjejaring, namun hanya untuk kepentingan mencari pelanggan baru (transaksional)."
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "skor": 3,
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan."
          },
          {
            "jawaban": "Tim harus lembur memaksakan diri, stres tinggi, dan kualitas pekerjaan atau produk menurun drastis.",
            "skor": 2,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru.",
            "skor": 2,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 2,
            "jawaban": "Saya sendiri yang langsung melompat mengambil alih pekerjaan untuk memperbaiki kesalahan tersebut."
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 1,
            "jawaban": "Sering kewalahan; tiba-tiba kehabisan bahan saat ramai, atau barang rusak karena menumpuk."
          }
        ]
      },
      {
        "skorRataRata": 2,
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "jawaban": "Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan.",
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "skor": 3
          },
          {
            "jawaban": "Mirip, tetapi kami mencoba bersaing dengan memberikan tambahan bonus atau fitur ekstra.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 2
          },
          {
            "jawaban": "Sekadar mengikuti apa yang sedang ramai dibicarakan (tren sesaat) atau mengikuti selera pribadi.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "skor": 1
          },
          {
            "jawaban": "Pelanggan lama hanya mau kembali bertransaksi jika ada potongan harga atau promosi.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "skor": 2
          }
        ]
      },
      {
        "skorRataRata": 2.25,
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "skor": 1,
            "jawaban": "Sering kali berbelit, instruksi kurang jelas, dan memicu kebingungan dari sisi pelanggan."
          },
          {
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "skor": 3
          },
          {
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "jawaban": "Hanya merespons komunikasi jika pelanggan yang terlebih dahulu bertanya atau menghubungi.",
            "skor": 2,
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?"
          }
        ]
      },
      {
        "rincian": [
          {
            "jawaban": "Menjelaskan kehebatan produk panjang lebar secara satu arah tanpa henti.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 2
          },
          {
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.",
            "skor": 3,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana.",
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 3
          },
          {
            "jawaban": "Cenderung pasif, hanya menunggu tanpa ada usaha untuk memastikan kepastian jawaban pelanggan.",
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "skor": 2
          }
        ],
        "skorRataRata": 2.5,
        "kategori": "Sales (Penjualan)"
      },
      {
        "skorRataRata": 2.25,
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "jawaban": "Semuanya hanya berupa katalog jualan langsung: harga, ketersediaan, dan ajakan membeli.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 1
          },
          {
            "skor": 3,
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas."
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 2,
            "jawaban": "Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat."
          }
        ]
      },
      {
        "skorRataRata": 1.75,
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal."
          },
          {
            "skor": 1,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "jawaban": "Pemilik langsung mengambil beban ganda dengan bekerja jauh lebih keras dan mengorbankan waktu istirahat."
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "skor": 1,
            "jawaban": "Sama sekali tidak ada; energi dan dana murni habis tersita untuk bertahan hidup menjalankan kegiatan hari ini."
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 1,
            "jawaban": "Terjadi serba kebetulan dan pemilik tidak pernah melacak dari mana asal rekomendasi tersebut."
          }
        ]
      }
    ]
  },
  {
    "row": 7,
    "timestamp": "15/09/2026 11:14:54",
    "namaUsaha": "Creative Kokedama",
    "whatsapp": "81230493939",
    "totalSkor": 55,
    "poinBisaAjarkan": "Leadership",
    "materiBisaAjarkan": "manajemen team",
    "poinPerluDipelajari": "Marketing",
    "sesi": "Sesi 2",
    "kekuatan": "Legalitas & Kelengkapan Dokumen",
    "kekuatanSkor": 5,
    "kelemahan": "Marketing",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": "masih belum terlalu terstruktur, lebih ke continue supply ke outlet yang sudah ada, dll."
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "memiliki keunikan yang cukup menonjol dan seringkali menjadi salah satu poin yang dilihat pelanggan"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": "branding sudah cukup kuat, penggunaan media digital ada di semua platform, tapi belum rutin untuk update"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "masih manual, belum menggunakan aplikasi digital."
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "dokumen lengkap"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "sangat siap"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": "cukup berkontribusi."
      },
      {
        "kriteria": "Leadership",
        "skor": 4,
        "catatan": "mampu memimpin team hingga autopilot"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "perlu ditingkatkan"
      },
      {
        "kriteria": "Marketing",
        "skor": 2,
        "catatan": "promosi perlu di boost"
      },
      {
        "kriteria": "Financial",
        "skor": 2,
        "catatan": "karena masih serba manual"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "team masih kurang persuasif"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "pelayanan sudah diusahakan seoptimal mungkin"
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "diversifikasi produk terus dilakukan"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "brand dan keunikan produk memiliki nilai yang kuat"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.71
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3,
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "jawaban": "Saya memiliki tim pengelola, tapi setiap keputusan dan masalah teknis tetap menunggu penyelesaian dari saya."
          },
          {
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini.",
            "skor": 2
          },
          {
            "jawaban": "Keputusan selalu diambil berdasarkan data angka objektif dan analisa riwayat bisnis.",
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 4
          },
          {
            "skor": 3,
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?"
          }
        ]
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2.75,
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Uang dipisah, tapi pengelolaannya serampangan; jika bisnis kekurangan uang, saya sering nombok pakai uang pribadi.",
            "skor": 2
          },
          {
            "skor": 3,
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?"
          },
          {
            "jawaban": "Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian.",
            "skor": 4,
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 2
          }
        ]
      },
      {
        "skorRataRata": 3.71,
        "kategori": "Operation (Operasional)",
        "rincian": [
          {
            "jawaban": "Menjadi motor penggerak atau inisiator yang membangun ekosistem kolaborasi di komunitas lokal.",
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "skor": 5
          },
          {
            "skor": 3,
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 4,
            "jawaban": "Sudah memiliki badan usaha resmi (seperti CV, PT, atau Koperasi) yang memisahkan tanggung jawab hukum pribadi dan bisnis."
          },
          {
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan.",
            "skor": 4
          },
          {
            "jawaban": "Ada sedikit panduan tertulis secara acak, namun tidak lengkap dan jarang diperbarui.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "skor": 3
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Tim merujuk pada panduan standar penyelesaian masalah yang sudah disepakati sebelumnya."
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 3,
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal."
          }
        ]
      },
      {
        "rincian": [
          {
            "skor": 5,
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka.",
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "jawaban": "Kami diakui sebagai rujukan utama atau pilihan prioritas di wilayah operasional atau kategori kami."
          },
          {
            "skor": 5,
            "jawaban": "Menganalisa kebiasaan dan kesulitan pelanggan secara mendalam untuk menawarkan solusi yang bahkan belum mereka sadari.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?"
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "skor": 4,
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing."
          }
        ],
        "skorRataRata": 4.5,
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "skorRataRata": 3,
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "skor": 3,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "skor": 4,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata."
          },
          {
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "skor": 3,
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung."
          },
          {
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 2,
            "jawaban": "Hanya merespons komunikasi jika pelanggan yang terlebih dahulu bertanya atau menghubungi."
          }
        ]
      },
      {
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "skor": 4
          },
          {
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "skor": 4,
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh."
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 3,
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana."
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Menggunakan penawaran menarik dengan batas waktu atau batas ketersediaan yang jelas dan tidak dibuat-buat."
          }
        ],
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.75
      },
      {
        "rincian": [
          {
            "jawaban": "Fokus utama hanya memancing perhatian lewat informasi undian berhadiah, diskon, atau promo murah.",
            "skor": 3,
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?"
          },
          {
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting.",
            "skor": 3
          },
          {
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "jawaban": "Diakui sebagai rujukan terpercaya atau standar kualitas di kelasnya oleh mayoritas pelaku wilayah/pasar.",
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 4
          }
        ],
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.25
      },
      {
        "skorRataRata": 4,
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "jawaban": "Terbiasa menjalankan siklus pengembangan bertahap, di mana perbaikan dilakukan terus-menerus berdasarkan respon pasar.",
            "skor": 5,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "skor": 4,
            "jawaban": "Secara terencana selalu menyediakan alokasi waktu dan modal khusus secara rutin demi memikirkan perbaikan bisnis ke depan.",
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?"
          },
          {
            "jawaban": "Memiliki sistem apresiasi yang tertata dengan standar keuntungan yang jelas bagi setiap orang yang membawa pelanggan baru.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 4
          }
        ]
      }
    ]
  },
  {
    "row": 8,
    "timestamp": "15/09/2026 12:00:03",
    "namaUsaha": "Chloe Crochet",
    "whatsapp": "85117470414",
    "totalSkor": 42,
    "poinBisaAjarkan": "Product",
    "materiBisaAjarkan": "Cara membuat produk rajutan yang berkualitas.",
    "poinPerluDipelajari": "Marketing",
    "sesi": "Sesi 2",
    "kekuatan": "Kesiapan Berkolaborasi & Belajar",
    "kekuatanSkor": 4,
    "kelemahan": "Legalitas & Kelengkapan Dokumen",
    "kelemahanSkor": 1,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 3,
        "catatan": "Jenis produk yang dibuat mulai memiliki karakter tersendiri, tetapi belum mencapai target pasar yang diinginkan."
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 3,
        "catatan": "Kualitas hasil rajutan yang dihasilkan cukup baik."
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 2,
        "catatan": "Identitas visual seperti logo dan kemasan produk sudah cukup baik dan konsisten. Namun aktivitas di marketplace dan media sosial sangat kurang."
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "Sudah memiliki rekening tersendiri. Pencatatan keuangan untuk setiap event sudah cukup baik. Namun untuk keuangan harian masih tercatat seadanya."
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 1,
        "catatan": "Belum memiliki dokumen lagalitas apapun."
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 4,
        "catatan": "Sangat terbuka untuk menerima masukan dan mengikuti pelatihan. Terbuka juga untuk berkolaborasi dengan listas usaha kreatif, tetapi tetap menyesuaikan dengan identitas brand yang sudah ada sekarang dan yang akan berkembang kedepannya."
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": "Berpotensi unutk menciptakan lapangan kerja, terutama bagi para perajut lokal."
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Karena sekarang usaha ini masih saya jalankan sendiri, sehingga saya belum mengetahui apakah kemampuan leadership saya kuat atau lemah."
      },
      {
        "kriteria": "Operasional",
        "skor": 2,
        "catatan": "Untuk kegiatan operasional sehari-hari saat ini yang sudah berjalan dengan cukup baik adalah proses produksi. Sedangkan untuk kegiatan operasional yang lain masih berjalan kurang efisien karena belum ada sistem yang pasti dan keterbatasan waktu bekerja."
      },
      {
        "kriteria": "Marketing",
        "skor": 1,
        "catatan": "Belum ada strategi promosi yang baik. Sejauh ini untuk menjangkau pelanggan baru hanya mengandalkan event dan rajin upload story instagram."
      },
      {
        "kriteria": "Financial",
        "skor": 3,
        "catatan": "Pencatatan keuangan sudah ada tetapi belum cukup baik, hanya tercatat seadanya saja."
      },
      {
        "kriteria": "Sales",
        "skor": 2,
        "catatan": "Karena hanya mengandalkan event, jadi untuk sales harian masih kurang."
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Sejauh ini pelanggan selalu merasa puas dan memberikan review yang baik dari produk yang mereka terima."
      },
      {
        "kriteria": "Growth",
        "skor": 3,
        "catatan": "Dari pengalaman selama mengikuti beberapa event, jika sudah berhasil menemukan target pasar yang tepat dan selalu berinovasi dengan jenis produk yang dibuat, maka potensi unutk berkembang juga akan besar."
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Kualitas hasil rajutan dari Chloe Crochet sudah dinilai beberapa orang sangat baik. Hanya perlu tetap berinovasi untuk membuat jenis karakter yang lain, untuk membedakan produk Chloe dengan kompetitor."
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2.5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 2.29
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 2
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 1.25
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "skor": 1,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti."
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini."
          },
          {
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "skor": 3
          }
        ],
        "skorRataRata": 2.25,
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "skorRataRata": 2.5,
        "rincian": [
          {
            "jawaban": "Uang dipisah, tapi pengelolaannya serampangan; jika bisnis kekurangan uang, saya sering nombok pakai uang pribadi.",
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar."
          },
          {
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "skor": 3
          },
          {
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 2
          }
        ],
        "kategori": "Finance (Keuangan)"
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 2.29,
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Terbuka untuk berkolaborasi jika ada pihak lain yang mengajak dan menanggung biayanya."
          },
          {
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "jawaban": "Merasa belum perlu mengurus izin karena skala bisnis masih kecil dan beroperasi dari rumah.",
            "skor": 2
          },
          {
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 3,
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja."
          },
          {
            "skor": 1,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "jawaban": "Semuanya hanya ada di ingatan saya pribadi."
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 2,
            "jawaban": "Saya sendiri yang langsung melompat mengambil alih pekerjaan untuk memperbaiki kesalahan tersebut."
          },
          {
            "skor": 2,
            "jawaban": "Pengecekan stok atau kapasitas dilakukan secara acak hanya jika teringat atau terlihat menipis.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?"
          }
        ]
      },
      {
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "jawaban": "Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan."
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "jawaban": "Mirip, tetapi kami mencoba bersaing dengan memberikan tambahan bonus atau fitur ekstra."
          },
          {
            "skor": 1,
            "jawaban": "Sekadar mengikuti apa yang sedang ramai dibicarakan (tren sesaat) atau mengikuti selera pribadi.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan kembali bertransaksi secara natural hanya jika sedang benar-benar butuh."
          }
        ],
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual."
          },
          {
            "skor": 4,
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata.",
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?"
          },
          {
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "skor": 3
          },
          {
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 2,
            "jawaban": "Hanya merespons komunikasi jika pelanggan yang terlebih dahulu bertanya atau menghubungi."
          }
        ],
        "skorRataRata": 3
      },
      {
        "skorRataRata": 3.25,
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "skor": 4
          },
          {
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "skor": 3,
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan."
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Hanya mengandalkan daya ingat atau kertas catatan yang mudah hilang.",
            "skor": 1
          },
          {
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal.",
            "skor": 5,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?"
          }
        ],
        "kategori": "Sales (Penjualan)"
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "skor": 1,
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Semuanya hanya berupa katalog jualan langsung: harga, ketersediaan, dan ajakan membeli."
          },
          {
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting.",
            "skor": 3
          },
          {
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "jawaban": "Sangat umum dan pasaran; bisnis kami dengan mudah bisa digantikan oleh pesaing baru besok hari.",
            "skor": 1,
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?"
          }
        ],
        "skorRataRata": 2
      },
      {
        "skorRataRata": 1.25,
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "skor": 2,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Menghabiskan waktu berbulan-bulan di belakang layar menyempurnakan tapi belum mengujinya ke pihak luar."
          },
          {
            "jawaban": "Pemilik langsung mengambil beban ganda dengan bekerja jauh lebih keras dan mengorbankan waktu istirahat.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "jawaban": "Sama sekali tidak ada; energi dan dana murni habis tersita untuk bertahan hidup menjalankan kegiatan hari ini.",
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "skor": 1
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Terjadi serba kebetulan dan pemilik tidak pernah melacak dari mana asal rekomendasi tersebut.",
            "skor": 1
          }
        ]
      }
    ]
  },
  {
    "row": 9,
    "timestamp": "15/09/2026 13:37:43",
    "namaUsaha": "Kopi Kedungroso",
    "whatsapp": "85755034299",
    "totalSkor": 59,
    "poinBisaAjarkan": "Operasional",
    "materiBisaAjarkan": "Proses produksi, promosi/pemasaran offline, cara interaksi dengan pelanggan",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Legalitas & Kelengkapan Dokumen",
    "kekuatanSkor": 5,
    "kelemahan": "Marketing",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": "Produk berupa bubuk/biji roasting, target nya untuk pecinta/ penikmat kopi, cara menghasilkan pendapatan dg menjual secara online/ off line"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "Produk lokal yg bisa bersaing di pasar nasional"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": "Sudah berlogo dan mempunyai marketplace"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 4,
        "catatan": "Sudah disiplin mencatat/ memisahkan uang pribadi dan usaha"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Sudah lengkap perijinan nya sampai HKI"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 4,
        "catatan": "Sangat terbuka dan antusias untuk menambah wawasan dan jaringan"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": "Berusaha untuk bisa merekrut karyawan"
      },
      {
        "kriteria": "Leadership",
        "skor": 4,
        "catatan": "Sudah memiliki tujuan yg jelas untuk meningkatkan usaha"
      },
      {
        "kriteria": "Operasional",
        "skor": 4,
        "catatan": "Sudah memiliki stock produk"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "Di lakukan secara online dan offline"
      },
      {
        "kriteria": "Financial",
        "skor": 4,
        "catatan": "Disiplin dalam pencatatan dan memisahkan rekening pribadi dan usaha tetapi masih manual pencatatan nya"
      },
      {
        "kriteria": "Sales",
        "skor": 4,
        "catatan": "Di lakukan secara online dan offline"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Rata\" mereka puas dengan produk kami"
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "Ingin bisa membuat produk \" turunan lainnya"
      },
      {
        "kriteria": "Product",
        "skor": 3,
        "catatan": "Dari biji kopi asli tanpa campuran. Berasal dri lereng Arjuno yg mempunyai ciri khas khusus"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2.5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.43
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.",
            "skor": 1,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "skor": 2,
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "skor": 3
          }
        ],
        "skorRataRata": 2.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin.",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "skor": 3,
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar."
          },
          {
            "skor": 2,
            "jawaban": "Hanya memantau omset atau total uang masuk tanpa tahu persis keuntungannya.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan."
          }
        ],
        "skorRataRata": 2.5
      },
      {
        "skorRataRata": 3.43,
        "kategori": "Operation (Operasional)",
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?"
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "skor": 3
          },
          {
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "skor": 3,
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?"
          },
          {
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Ada sedikit panduan tertulis secara acak, namun tidak lengkap dan jarang diperbarui.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 5
          },
          {
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 3
          }
        ]
      },
      {
        "skorRataRata": 3.5,
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "jawaban": "Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan.",
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Kami fokus melayani celah pasar spesifik yang tidak digarap dengan serius oleh kompetitor besar.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?"
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan."
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing.",
            "skor": 4
          }
        ]
      },
      {
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "skor": 3,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 3
          },
          {
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 3
          }
        ],
        "skorRataRata": 3
      },
      {
        "rincian": [
          {
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 4
          },
          {
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh.",
            "skor": 4,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Data kontak dikelompokkan berdasarkan seberapa besar minat atau kesiapan mereka untuk bertransaksi.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "skor": 5,
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal."
          }
        ],
        "skorRataRata": 4.25,
        "kategori": "Sales (Penjualan)"
      },
      {
        "skorRataRata": 3.5,
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 4,
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan."
          },
          {
            "skor": 4,
            "jawaban": "Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas."
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Mulai membangun gaya visual, gaya bahasa, atau ciri khas konsisten yang mudah dikenali pelanggan.",
            "skor": 3
          }
        ]
      },
      {
        "skorRataRata": 3.25,
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "skor": 3,
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu.",
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik.",
            "skor": 3
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Secara terencana selalu menyediakan alokasi waktu dan modal khusus secara rutin demi memikirkan perbaikan bisnis ke depan."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis."
          }
        ]
      }
    ]
  },
  {
    "row": 10,
    "timestamp": "15/09/2026 15:12:22",
    "namaUsaha": "Batu Camping",
    "whatsapp": "85791566286",
    "totalSkor": 54,
    "poinBisaAjarkan": "Marketing",
    "materiBisaAjarkan": "Membuat konten plan di ig",
    "poinPerluDipelajari": "Growth",
    "sesi": "Sesi 2",
    "kekuatan": "Legalitas & Kelengkapan Dokumen",
    "kekuatanSkor": 5,
    "kelemahan": "Leadership",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": "Cukup baik, untuk ranah usaha di bidang rekreasi dan berlokasi di Kota Batu"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 3,
        "catatan": "Walaupun segmented, penambahan trip VW jadi daya tarik yg unik di usaha saya"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": "Kami cukup rutin membuat konten dan collab dengan KOL"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "Untuk pemisahan keuangan pribadi dan usaha memang sudah dilakukan dari awal. Hanya pencatatan rinci jarang dilakukan"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Sudab ada NIB"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Jujur untuk saat ini usaha saya sudah mulai meredup, butuh hal-hal baru dan bertemu dengan orang2 baru untuk mendapatkan insight"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 3,
        "catatan": "Sebenarnya bisa dikembangkan lebih besar, tapi kemampuan pribadi saya membutuhkan banyak sekali relasi"
      },
      {
        "kriteria": "Leadership",
        "skor": 2,
        "catatan": "Untuk usaha outdoor yang dipimpin perempuan/seorang ibu, dengan tim dominan laki-laki terkadang kami tidak sinkron"
      },
      {
        "kriteria": "Operasional",
        "skor": 4,
        "catatan": "Dalam konsepnya sebenarnya sudah efisien namun terkadang ada hal-hal teknis di luar prediksi"
      },
      {
        "kriteria": "Marketing",
        "skor": 4,
        "catatan": "Untuk masalah konten, kami cukup bisa bersaing. Hanya saja keterbatasan waktu dan sdm yang menjadikan kurang konsisten"
      },
      {
        "kriteria": "Financial",
        "skor": 4,
        "catatan": "Pemisahan keuangan pribadi dan usaha sudah dilakukan, proyeksi kebutuhan ke depan juga sudah dijalankan"
      },
      {
        "kriteria": "Sales",
        "skor": 4,
        "catatan": "Sejauh ini banyak customer yang langsung closing tanpa harus membandingkan lebih lanjut"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Kami berusaha memberikan layanan yg terbaik. Enath itu layanan admin ataupun teknis lapangan"
      },
      {
        "kriteria": "Growth",
        "skor": 2,
        "catatan": "Untuk saat ini perkembangannya masih sangat slow, apalagi muncul berbagai macam pesaing baru"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Pada dasarnya layanannya sama, hanya berbeda di harga dan lokasi. Keunikan di service kami yaitu punya unit vw yang bisa dijadikan identitas"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.29
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.25
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "jawaban": "Saya memiliki tim pengelola, tapi setiap keputusan dan masalah teknis tetap menunggu penyelesaian dari saya."
          },
          {
            "skor": 2,
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "skor": 3,
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "skor": 3,
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku."
          }
        ],
        "skorRataRata": 2.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.25,
        "rincian": [
          {
            "jawaban": "Memiliki alokasi pos pengeluaran yang ketat sehingga biaya operasional selalu terjaga sesuai batas aman anggaran.",
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "skor": 3,
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar."
          },
          {
            "skor": 3,
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis."
          }
        ]
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "skor": 2,
            "jawaban": "Sesekali berjejaring, namun hanya untuk kepentingan mencari pelanggan baru (transaksional)."
          },
          {
            "skor": 4,
            "jawaban": "Terbuka belajar dan rutin menggunakan perangkat lunak digital untuk memangkas waktu kerja manual tim.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 3
          },
          {
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "skor": 3
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "jawaban": "Ada sedikit panduan tertulis secara acak, namun tidak lengkap dan jarang diperbarui."
          },
          {
            "skor": 5,
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?"
          },
          {
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 3
          }
        ],
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.29
      },
      {
        "rincian": [
          {
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka.",
            "skor": 5,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "jawaban": "Mirip, tetapi kami mencoba bersaing dengan memberikan tambahan bonus atau fitur ekstra."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengandalkan asumsi atau perkiraan internal bahwa pasar pasti akan menyukainya."
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Didominasi pembeli sesaat yang hanya bertransaksi sekali lalu tidak pernah kembali.",
            "skor": 1
          }
        ],
        "skorRataRata": 2.75,
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "skorRataRata": 3,
        "rincian": [
          {
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "skor": 3,
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual."
          },
          {
            "skor": 4,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata."
          },
          {
            "skor": 3,
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "skor": 2,
            "jawaban": "Hanya merespons komunikasi jika pelanggan yang terlebih dahulu bertanya atau menghubungi.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?"
          }
        ],
        "kategori": "Service (Layanan)"
      },
      {
        "skorRataRata": 3.25,
        "rincian": [
          {
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 4
          },
          {
            "jawaban": "Merelakan pelanggan tersebut dengan profesional karena menyadari bahwa mereka memang bukan segmen target pasar kami.",
            "skor": 5,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "jawaban": "Dibiarkan menumpuk berantakan dalam riwayat pesan instan sehingga sulit dicari.",
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 2
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Cenderung pasif, hanya menunggu tanpa ada usaha untuk memastikan kepastian jawaban pelanggan."
          }
        ],
        "kategori": "Sales (Penjualan)"
      },
      {
        "rincian": [
          {
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 4
          },
          {
            "jawaban": "Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional.",
            "skor": 4,
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "jawaban": "Memiliki pola pemasaran stabil yang secara konsisten dan terprediksi mampu mendatangkan audiens baru.",
            "skor": 5,
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Sangat umum dan pasaran; bisnis kami dengan mudah bisa digantikan oleh pesaing baru besok hari.",
            "skor": 1
          }
        ],
        "skorRataRata": 3.5,
        "kategori": "Marketing (Pemasaran)"
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal."
          },
          {
            "jawaban": "Pemilik langsung mengambil beban ganda dengan bekerja jauh lebih keras dan mengorbankan waktu istirahat.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "skor": 1
          },
          {
            "jawaban": "Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra.",
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "skor": 3
          },
          {
            "jawaban": "Terjadi serba kebetulan dan pemilik tidak pernah melacak dari mana asal rekomendasi tersebut.",
            "skor": 1,
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?"
          }
        ],
        "skorRataRata": 2.25
      }
    ]
  },
  {
    "row": 11,
    "timestamp": "15/09/2026 16:21:39",
    "namaUsaha": "Kriups!",
    "whatsapp": "8982229600",
    "totalSkor": 57,
    "poinBisaAjarkan": "Product",
    "materiBisaAjarkan": "membuat konten, foto produk dengan modal kamera handphone",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Kejelasan Model Bisnis",
    "kekuatanSkor": 5,
    "kelemahan": "Marketing",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Saya sudah mampu mengarahkan visi usaha dengan jelas, namun masih perlu meningkatkan kemampuan dalam mendelegasikan tugas kepada tim secara efektif."
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "roses produksi dan operasional sehari-hari sudah berjalan dengan alur yang jelas, namun masih sering menghadapi kendala teknis atau hambatan komunikasi antar divisi. Pengelolaan sumber daya (bahan baku, tenaga kerja, dan waktu) dinilai cukup stabil, tetapi belum mencapai tingkat efisiensi yang optimal."
      },
      {
        "kriteria": "Marketing",
        "skor": 2,
        "catatan": "Hanya mengandalkan promosi konvensional atau tidak konsisten."
      },
      {
        "kriteria": "Financial",
        "skor": 3,
        "catatan": "Kesehatan finansial usaha Anda sedang berada di posisi lemah akibat arus kas dan pencatatan yang belum optimal"
      },
      {
        "kriteria": "Sales",
        "skor": 2,
        "catatan": "Menghabiskan waktu pada orang yang salah atau tidak memiliki daya beli."
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "elanggan cenderung melakukan pembelian ulang dan merekomendasikan usaha Anda ke orang lain."
      },
      {
        "kriteria": "Growth",
        "skor": 3,
        "catatan": "Mengadopsi sistem otomatisasi operasional (seperti CRM untuk manajemen pelanggan, atau software ERP untuk inventaris) guna menekan biaya produksi dan waktu tunggu."
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "unik, belum banyak sainganya"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 2.5
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 1.75
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.25
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "jawaban": "Bisnis berjalan terstruktur dan terus bertumbuh tanpa bergantung pada kehadiran fisik saya setiap hari.",
            "skor": 5,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "skor": 4,
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 3,
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu."
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "skor": 2,
            "jawaban": "Merekrut semata-mata karena keahlian teknisnya, meski sering menimbulkan konflik internal."
          }
        ],
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "skor": 4,
            "jawaban": "Memiliki alokasi pos pengeluaran yang ketat sehingga biaya operasional selalu terjaga sesuai batas aman anggaran."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar."
          },
          {
            "skor": 4,
            "jawaban": "Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 3,
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis."
          }
        ],
        "skorRataRata": 3.5
      },
      {
        "skorRataRata": 3.57,
        "rincian": [
          {
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "skor": 4,
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?"
          },
          {
            "jawaban": "Terbuka belajar dan rutin menggunakan perangkat lunak digital untuk memangkas waktu kerja manual tim.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 3,
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan."
          },
          {
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan.",
            "skor": 4
          },
          {
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "skor": 2
          },
          {
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "skor": 5,
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?"
          },
          {
            "skor": 3,
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?"
          }
        ],
        "kategori": "Operation (Operasional)"
      },
      {
        "rincian": [
          {
            "skor": 3,
            "jawaban": "Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan.",
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "jawaban": "Mirip, tetapi kami mencoba bersaing dengan memberikan tambahan bonus atau fitur ekstra.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 2
          },
          {
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Didominasi pembeli sesaat yang hanya bertransaksi sekali lalu tidak pernah kembali.",
            "skor": 1
          }
        ],
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 2.5
      },
      {
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "skor": 3,
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 4,
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung."
          },
          {
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "jawaban": "Hanya merespons komunikasi jika pelanggan yang terlebih dahulu bertanya atau menghubungi.",
            "skor": 2
          }
        ],
        "skorRataRata": 3
      },
      {
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 5,
            "jawaban": "Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka."
          },
          {
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.",
            "skor": 3,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Data kontak dikelompokkan berdasarkan seberapa besar minat atau kesiapan mereka untuk bertransaksi."
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Cenderung pasif, hanya menunggu tanpa ada usaha untuk memastikan kepastian jawaban pelanggan."
          }
        ],
        "skorRataRata": 3.5,
        "kategori": "Sales (Penjualan)"
      },
      {
        "skorRataRata": 1.75,
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Semuanya hanya berupa katalog jualan langsung: harga, ketersediaan, dan ajakan membeli.",
            "skor": 1
          },
          {
            "skor": 3,
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "jawaban": "Sering mengeluarkan uang promosi tanpa ada pencatatan yang jelas apakah iklan tersebut membuahkan hasil.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "skor": 2
          },
          {
            "jawaban": "Sangat umum dan pasaran; bisnis kami dengan mudah bisa digantikan oleh pesaing baru besok hari.",
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 1
          }
        ],
        "kategori": "Marketing (Pemasaran)"
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.25,
        "rincian": [
          {
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu.",
            "skor": 3,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "jawaban": "Selalu menyelesaikan masalah keterbatasan kapasitas dengan terburu-buru merekrut tenaga tambahan tanpa perhitungan efisiensi.",
            "skor": 2,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "skor": 1,
            "jawaban": "Sama sekali tidak ada; energi dan dana murni habis tersita untuk bertahan hidup menjalankan kegiatan hari ini.",
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?"
          },
          {
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 3
          }
        ]
      }
    ]
  },
  {
    "row": 12,
    "timestamp": "17/09/2026 13:26:22",
    "namaUsaha": "Janeetaqu",
    "whatsapp": "85755557908",
    "totalSkor": 48,
    "poinBisaAjarkan": "Product",
    "materiBisaAjarkan": "Merajut mulai dasar , motif dan teknik rajut( amigurumi , tapestry, mozaik dll)",
    "poinPerluDipelajari": "Marketing",
    "sesi": "Sesi 2",
    "kekuatan": "Kesiapan Berkolaborasi & Belajar",
    "kekuatanSkor": 5,
    "kelemahan": "Pengelolaan Keuangan Usaha",
    "kelemahanSkor": 1,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 3,
        "catatan": ""
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "Rajutan rapi ,boneka /ganci karakter bisa mirip dgn karakter aslinya ( tdk jauh melenceng)"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": "Ken blom ada team tersendiri utk medsos ,postingan jika ingat saja"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 1,
        "catatan": "Tidak ada pencatatan keuangan , TPI rekening usaha sdh dipisah"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 4,
        "catatan": "Legalitas usaha , NIB ,halal, dan merk ( sdh terdaftar tinggal nunggu terbit)"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Dengan senang hati dan siap berkolaborasi"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Kadang masih sering bimbang ambil keputusan"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "Klu stok sdh numpuk sementara jualan sepi mau produksi jdi malas"
      },
      {
        "kriteria": "Marketing",
        "skor": 2,
        "catatan": "Jualan online blom fokus, upload produk klu inggat saja"
      },
      {
        "kriteria": "Financial",
        "skor": 2,
        "catatan": "Tidak pernah mencatat pengeluaran dan pemasukan , tpi uang usaha sdh dipisah rekening sendiri, yg penting saldo akhir tdk pernah minus 😁"
      },
      {
        "kriteria": "Sales",
        "skor": 4,
        "catatan": "Klu target sdh tdk minat dgn produk kita ya sdh tdk bisa maksa utk meyakinkan lgi"
      },
      {
        "kriteria": "Service",
        "skor": 3,
        "catatan": "Jarang minta review ke pelanggan"
      },
      {
        "kriteria": "Growth",
        "skor": 3,
        "catatan": "Mau coba berinovasi ecoprint mix rajut utk fashion maupun home decor"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Kualitas bagus ,rapi"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.5
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.",
            "skor": 1,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala.",
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 3
          },
          {
            "jawaban": "Memiliki standar rekrutmen yang jelas, menilai kecocokan sikap kerja (karakter) dan kompetensi teknis secara seimbang.",
            "skor": 4,
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?"
          }
        ],
        "skorRataRata": 3,
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "skorRataRata": 2.25,
        "rincian": [
          {
            "jawaban": "Uang dipisah, tapi pengelolaannya serampangan; jika bisnis kekurangan uang, saya sering nombok pakai uang pribadi.",
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?"
          },
          {
            "skor": 3,
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?"
          },
          {
            "jawaban": "Hanya melihat sisa saldo akhir di rekening bank.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "skor": 1
          },
          {
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 3
          }
        ],
        "kategori": "Finance (Keuangan)"
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3,
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama."
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "skor": 3,
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal."
          },
          {
            "skor": 3,
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?"
          },
          {
            "skor": 3,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja."
          },
          {
            "skor": 1,
            "jawaban": "Semuanya hanya ada di ingatan saya pribadi.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "skor": 5
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 2,
            "jawaban": "Pengecekan stok atau kapasitas dilakukan secara acak hanya jika teringat atau terlihat menipis."
          }
        ]
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "skor": 3,
            "jawaban": "Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan.",
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 2,
            "jawaban": "Mirip, tetapi kami mencoba bersaing dengan memberikan tambahan bonus atau fitur ekstra."
          },
          {
            "jawaban": "Sekadar mengikuti apa yang sedang ramai dibicarakan (tren sesaat) atau mengikuti selera pribadi.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "skor": 1
          },
          {
            "skor": 3,
            "jawaban": "Pelanggan kembali bertransaksi secara natural hanya jika sedang benar-benar butuh.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?"
          }
        ],
        "skorRataRata": 2.25
      },
      {
        "skorRataRata": 3,
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual."
          },
          {
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "skor": 3,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?"
          },
          {
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 3
          }
        ]
      },
      {
        "kategori": "Sales (Penjualan)",
        "rincian": [
          {
            "skor": 5,
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka."
          },
          {
            "jawaban": "Merelakan pelanggan tersebut dengan profesional karena menyadari bahwa mereka memang bukan segmen target pasar kami.",
            "skor": 5,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "jawaban": "Dibiarkan menumpuk berantakan dalam riwayat pesan instan sehingga sulit dicari.",
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 2
          },
          {
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "skor": 5,
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal."
          }
        ],
        "skorRataRata": 4.25
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 2.25,
        "rincian": [
          {
            "skor": 1,
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Semuanya hanya berupa katalog jualan langsung: harga, ketersediaan, dan ajakan membeli."
          },
          {
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 3,
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting."
          },
          {
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "skor": 3
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 2,
            "jawaban": "Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat."
          }
        ]
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.5,
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "skor": 3,
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik."
          },
          {
            "skor": 3,
            "jawaban": "Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra.",
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?"
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Terjadi serba kebetulan dan pemilik tidak pernah melacak dari mana asal rekomendasi tersebut.",
            "skor": 1
          }
        ]
      }
    ]
  },
  {
    "row": 13,
    "timestamp": "22/09/2026 13:12:03",
    "namaUsaha": "Inday Kueku",
    "whatsapp": "82333118190",
    "totalSkor": 70,
    "poinBisaAjarkan": "Operasional",
    "materiBisaAjarkan": "Meminimalkan bahan sisa produksi yang tidak terpakai .",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Kejelasan Model Bisnis",
    "kekuatanSkor": 5,
    "kelemahan": "Branding & Kehadiran Digital",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 5,
        "catatan": "Produk saya sdh masuk di 4 mall di kota batu dan kota malang yaitu hypermart dan mog, Dan pesanan pribadi dari pelangan saja."
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 5,
        "catatan": "Saya menggunakan bahan- bahan yang berkualitas dalam memproduksi jajan pasar dan kue kering"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": "Hanya memposting di washap saja.kadang-kadang di facebook dan masih belum memaksimalkan pemasaran lewat media IG dan Tiktok"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "Sudah melalukan pencatatan walaipun masih sering luoa untuk melalukan pencatatan pembelian bahan baku produksi"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Sudah memiliki NIB,sertifikat Halal,Pirt dan sertifikat Haki"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Sangat terbuka untuk berkolaborasi dengan rekan- rekan sesama UMKM yang lain.serta masih ingin terus meningkatkan ketrampilan melalui pelatihan.p"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": "Hanya jika pesanan yang masuk besar baru mencari tenaga kerja tambahan.dan mengunakan kurir untuk pengantaran yang agak jauh ."
      },
      {
        "kriteria": "Leadership",
        "skor": 5,
        "catatan": "Semua keputusan saya yang menentukan"
      },
      {
        "kriteria": "Operasional",
        "skor": 5,
        "catatan": "Kami berupaya untuk seefisein mungkin dalam berproduksi dan memanfaatkan sumber daya yang kami miliki."
      },
      {
        "kriteria": "Marketing",
        "skor": 5,
        "catatan": "Memalukan coking demo di hypermart di momen- momen tertentu dan memberikan promo berupa  produk gratiskepada konsumen jika melalukan pembelian dengan jumlah tertentu."
      },
      {
        "kriteria": "Financial",
        "skor": 5,
        "catatan": "Sudah menerapkan hpp untuk menghitung harga jual.produk.Tetapi Masih kurang teratur dalam.melalukaun pencatatan keuangan .serta kurang teliti dalam melakukan pencatatan"
      },
      {
        "kriteria": "Sales",
        "skor": 5,
        "catatan": "Melemahnya daya beli masyarakat saat ini terkadang membuat konsumen ragu-ragu dalam melakukan pembelian .Tetapi dengan penawaran melalui promo produk serta menjaga kualitas produk konsumen akan tetap.menyukai produk saya."
      },
      {
        "kriteria": "Service",
        "skor": 5,
        "catatan": "Saya melakukan pengiriman pesan konsumen sendiri secara gratis,agar dapat berbincang-bincang dengan konsumen mengenai produk hang saya hasilkan."
      },
      {
        "kriteria": "Growth",
        "skor": 5,
        "catatan": "Jika melihat pasar saat ini dapat di lakukan inovasi dengan membuat produk yang ada lebih cantik kemasanya dan membuat beberapa vafian produk baru."
      },
      {
        "kriteria": "Product",
        "skor": 5,
        "catatan": "Produk saya mampu bersaing dengan produk laen di pasaran karna saya selalu menjaga kwalitas produk .serta berupaya melalukan inovasi produk baru ."
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.14
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.",
            "skor": 1,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 2
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 4,
            "jawaban": "Keputusan selalu diambil berdasarkan data angka objektif dan analisa riwayat bisnis."
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Memiliki standar rekrutmen yang jelas, menilai kecocokan sikap kerja (karakter) dan kompetensi teknis secara seimbang.",
            "skor": 4
          }
        ],
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin.",
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "skor": 3
          },
          {
            "jawaban": "Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian.",
            "skor": 4,
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 2,
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan."
          }
        ],
        "skorRataRata": 3
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "skor": 4
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal."
          },
          {
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "skor": 3
          },
          {
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 3
          },
          {
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru.",
            "skor": 2,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 5,
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang."
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Pengecekan stok atau kapasitas dilakukan secara acak hanya jika teringat atau terlihat menipis.",
            "skor": 2
          }
        ],
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.14
      },
      {
        "skorRataRata": 4.5,
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "skor": 5,
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka.",
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "jawaban": "Produk kami memiliki karakter atau ciri khas yang sangat kuat, sehingga pelanggan merasa sulit mencari penggantinya di tempat lain.",
            "skor": 5,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.",
            "skor": 4
          },
          {
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "skor": 4
          }
        ]
      },
      {
        "rincian": [
          {
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "skor": 3,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata.",
            "skor": 4,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?"
          },
          {
            "skor": 3,
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "skor": 3,
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?"
          }
        ],
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.25
      },
      {
        "skorRataRata": 4.25,
        "rincian": [
          {
            "jawaban": "Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 5
          },
          {
            "skor": 4,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh."
          },
          {
            "skor": 3,
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana.",
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?"
          },
          {
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal.",
            "skor": 5
          }
        ],
        "kategori": "Sales (Penjualan)"
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.25,
        "rincian": [
          {
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.",
            "skor": 4,
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?"
          },
          {
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting.",
            "skor": 3,
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "skor": 3,
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas."
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 3,
            "jawaban": "Mulai membangun gaya visual, gaya bahasa, atau ciri khas konsisten yang mudah dikenali pelanggan."
          }
        ]
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "skor": 3,
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik."
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Secara terencana selalu menyediakan alokasi waktu dan modal khusus secara rutin demi memikirkan perbaikan bisnis ke depan.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.",
            "skor": 3
          }
        ],
        "skorRataRata": 3.25
      }
    ]
  },
  {
    "row": 14,
    "timestamp": "24/09/2026 13:08:24",
    "namaUsaha": "Itravel Malang",
    "whatsapp": "8133338269",
    "totalSkor": 53,
    "poinBisaAjarkan": "Service",
    "materiBisaAjarkan": "Customer service satisfaction",
    "poinPerluDipelajari": "Financial",
    "sesi": "Sesi 2",
    "kekuatan": "Kesiapan Berkolaborasi & Belajar",
    "kekuatanSkor": 5,
    "kelemahan": "Financial",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 3,
        "catatan": ""
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 3,
        "catatan": ""
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": ""
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Leadership",
        "skor": 4,
        "catatan": "Karena di dalam usaha yang saya jalankan saat ini saya pengambil keputusan tunggal"
      },
      {
        "kriteria": "Operasional",
        "skor": 4,
        "catatan": "Karena saat ini usaha belum dijalankan secara maksimal"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "Karena modal belum terlalu kuat hingga belum bisa membuat promosi secara maksimal"
      },
      {
        "kriteria": "Financial",
        "skor": 2,
        "catatan": "Karena belum terstruktur dan berjalan sebagaimana mestinya"
      },
      {
        "kriteria": "Sales",
        "skor": 2,
        "catatan": "Karena banyaknya benturan jadwal dan minat pelanggan"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Karena kami selalu memberikan yang terbaik bagi pelanggan dibandung usaha sejenis yg lain"
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "Pontensi di bidang usaha ini saat baik terlebih di dukung dengan modal yang cukup dan promosi yang baik"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Kami bisa memberikan service yang terbaik bagi pelanggan dan melayani customer bagai keluarga"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.86
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "skor": 2,
            "jawaban": "Saya mulai mendelegasikan tugas teknis, tapi mengawasi setiap gerak-gerik tim secara berlebihan.",
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala.",
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "skor": 3
          }
        ],
        "skorRataRata": 3,
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "rincian": [
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Uang dipisah, tapi pengelolaannya serampangan; jika bisnis kekurangan uang, saya sering nombok pakai uang pribadi."
          },
          {
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "skor": 3
          },
          {
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "skor": 3,
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "skor": 5,
            "jawaban": "Ekspansi dibiayai oleh model bisnis yang berputar sehat atau didukung oleh sistem kemitraan strategis yang minim risiko.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?"
          }
        ],
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.86,
        "rincian": [
          {
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "skor": 4
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "jawaban": "Terbuka belajar dan rutin menggunakan perangkat lunak digital untuk memangkas waktu kerja manual tim."
          },
          {
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 4,
            "jawaban": "Sudah memiliki badan usaha resmi (seperti CV, PT, atau Koperasi) yang memisahkan tanggung jawab hukum pribadi dan bisnis."
          },
          {
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan.",
            "skor": 4,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru.",
            "skor": 2,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 5,
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang."
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 4,
            "jawaban": "Memiliki pencatatan sistematis dengan pengingat otomatis sebelum batas minimum bahan/kapasitas tercapai."
          }
        ]
      },
      {
        "rincian": [
          {
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka.",
            "skor": 5,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "jawaban": "Mirip, tetapi kami mencoba bersaing dengan memberikan tambahan bonus atau fitur ekstra.",
            "skor": 2
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan."
          },
          {
            "skor": 5,
            "jawaban": "Produk/jasa kami telah terintegrasi erat dengan aktivitas rutin pelanggan sehingga sulit bagi mereka untuk beralih.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?"
          }
        ],
        "skorRataRata": 4,
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "skor": 3
          },
          {
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Secara aktif menggali pendapat pelanggan secara mendalam untuk memahami kelebihan dan kekurangan bisnis kami.",
            "skor": 5
          },
          {
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.",
            "skor": 3
          }
        ],
        "skorRataRata": 3.5
      },
      {
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "skor": 4
          },
          {
            "skor": 4,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh."
          },
          {
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana.",
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 3
          },
          {
            "jawaban": "Menggunakan penawaran menarik dengan batas waktu atau batas ketersediaan yang jelas dan tidak dibuat-buat.",
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "skor": 4
          }
        ],
        "skorRataRata": 3.75,
        "kategori": "Sales (Penjualan)"
      },
      {
        "skorRataRata": 3.25,
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?"
          },
          {
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 4,
            "jawaban": "Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional."
          },
          {
            "skor": 3,
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "skor": 2,
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat."
          }
        ]
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25,
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu.",
            "skor": 3
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik."
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Secara terencana selalu menyediakan alokasi waktu dan modal khusus secara rutin demi memikirkan perbaikan bisnis ke depan.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 3,
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis."
          }
        ]
      }
    ]
  },
  {
    "row": 15,
    "timestamp": "24/09/2026 13:46:56",
    "namaUsaha": "Pixora",
    "whatsapp": "85646714314",
    "totalSkor": 51,
    "poinBisaAjarkan": "Service",
    "materiBisaAjarkan": "memaksimalkan ponsel untuk foto produk, dan desain, baik kemasan, baner, dll",
    "poinPerluDipelajari": "Financial",
    "sesi": "Sesi 2",
    "kekuatan": "Kejelasan Model Bisnis",
    "kekuatanSkor": 4,
    "kelemahan": "Financial",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": "produk ditujukan ke pondok, ukm, sekolah, kader, yang membutuhkan jasa desain, baik baner, kartu nama dll"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "desain tidak asal, ada maping, dan brainstorming terlebih dahulu agar desain lebih kuat dalam berkompetisi"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": "konsisten dan disamakan disetiap medsos"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "masih tercampur belum terpisah dengan uang pribadi"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 3,
        "catatan": "nib dan npwp pribadi saja yang ada"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 4,
        "catatan": "siap menerima masukan dan ilmu tambahan, share project atau kolaborasi"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": "di industri kreatif kebutuhan lapangan kerja masih tinggi,"
      },
      {
        "kriteria": "Leadership",
        "skor": 4,
        "catatan": "berpengalaman dibidang yang digeluti, mempunyai beberapa koneksi di bidang terkait"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "oprasional jelas tersetruktur, dari hulu sampai hilir"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "masih baru espansi dengan ide baru"
      },
      {
        "kriteria": "Financial",
        "skor": 2,
        "catatan": "tercampur antara uang bisnis dan uang pribadi"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "mendengar kebutuhan konsumen, baru diarahkan dengan produk /  layanan kita"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "analisis kebutuhan terlebih dahulu, dan fokus pada penyelesaian kebutuhan pelanggan"
      },
      {
        "kriteria": "Growth",
        "skor": 3,
        "catatan": "masih stag jalan ditempat, bingung mau ekspansi"
      },
      {
        "kriteria": "Product",
        "skor": 3,
        "catatan": "kita lakukan brainstorming terlebih dahulu, kita konsep dan kita bandingan dengan kompetitor terlbih dahulu, baru esekusi"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.29
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25
      }
    ],
    "bagian3Detail": [
      {
        "skorRataRata": 2,
        "rincian": [
          {
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 1,
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti."
          },
          {
            "jawaban": "Tidak ada komunikasi arah bisnis. Tim hanya datang, bekerja sesuai perintah, dan pulang.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "skor": 3
          }
        ],
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "jawaban": "Rekening campur aduk. Uang bisnis sering terpakai untuk keperluan pribadi tanpa pencatatan.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar."
          },
          {
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "skor": 2,
            "jawaban": "Hanya memantau omset atau total uang masuk tanpa tahu persis keuntungannya."
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan."
          }
        ],
        "skorRataRata": 2
      },
      {
        "skorRataRata": 3.29,
        "kategori": "Operation (Operasional)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "skor": 4,
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama."
          },
          {
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "skor": 3,
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?"
          },
          {
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "skor": 3,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru."
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "skor": 5
          },
          {
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 3
          }
        ]
      },
      {
        "skorRataRata": 3.75,
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "jawaban": "Karena produk mampu memberikan solusi yang sangat spesifik dan relevan dengan masalah mereka.",
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "skor": 4
          },
          {
            "jawaban": "Kami fokus melayani celah pasar spesifik yang tidak digarap dengan serius oleh kompetitor besar.",
            "skor": 3,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?"
          },
          {
            "skor": 4,
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?"
          },
          {
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "skor": 4
          }
        ]
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.5,
        "rincian": [
          {
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "jawaban": "Sangat mulus dan minim hambatan; kami selalu mencari cara menyederhanakan proses bagi pelanggan.",
            "skor": 4
          },
          {
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata.",
            "skor": 4,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "skor": 3
          },
          {
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.",
            "skor": 3,
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?"
          }
        ]
      },
      {
        "skorRataRata": 4.5,
        "kategori": "Sales (Penjualan)",
        "rincian": [
          {
            "jawaban": "Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka.",
            "skor": 5,
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?"
          },
          {
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "jawaban": "Merelakan pelanggan tersebut dengan profesional karena menyadari bahwa mereka memang bukan segmen target pasar kami.",
            "skor": 5
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana."
          },
          {
            "skor": 5,
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal.",
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?"
          }
        ]
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4,
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan."
          },
          {
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 5,
            "jawaban": "Sering membagikan ilmu atau referensi berkualitas tinggi secara gratis yang memperkuat citra profesional bisnis di industrinya."
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "jawaban": "Memiliki penawaran daya tarik khusus (seperti sampel, sesi gratis, atau materi panduan) untuk memancing kontak calon pelanggan potensial.",
            "skor": 4
          },
          {
            "skor": 3,
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Mulai membangun gaya visual, gaya bahasa, atau ciri khas konsisten yang mudah dikenali pelanggan."
          }
        ]
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "skor": 3,
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu."
          },
          {
            "skor": 3,
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra."
          },
          {
            "skor": 4,
            "jawaban": "Memiliki sistem apresiasi yang tertata dengan standar keuntungan yang jelas bagi setiap orang yang membawa pelanggan baru.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?"
          }
        ],
        "skorRataRata": 3.25
      }
    ]
  },
  {
    "row": 16,
    "timestamp": "24/09/2026 20:25:33",
    "namaUsaha": "Yoghurt Kisnamilk",
    "whatsapp": "81357914024",
    "totalSkor": 53,
    "poinBisaAjarkan": "Product",
    "materiBisaAjarkan": "strategi closing",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Kesiapan Berkolaborasi & Belajar",
    "kekuatanSkor": 5,
    "kelemahan": "Pengelolaan Keuangan Usaha",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "tanpa pengawet\nlangsung dari sumber bahan bakunya"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": ""
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 3,
        "catatan": "lagi ngurus bpom dan dipersulit karena banyak peraturan baru"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "sangat welcome"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "karena saya masih perlu belajar"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "masih harus meningkatkan operasional"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "harus belajar banyak"
      },
      {
        "kriteria": "Financial",
        "skor": 3,
        "catatan": "sudah terpilah tapi pencatatan masih belum lengkap"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "sebisa mungkin closing dengan cara memberi edukasi manfaat produk saya"
      },
      {
        "kriteria": "Service",
        "skor": 3,
        "catatan": "banyak pelanggan yang kembali repeat order"
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "karena kami semangat untuk up date"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "karena produk kami tanpa pengawet dimana jaman sekarang semua serba pengawet"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "jawaban": "Saya memiliki tim pengelola, tapi setiap keputusan dan masalah teknis tetap menunggu penyelesaian dari saya.",
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 2,
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini."
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 3,
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu."
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "skor": 3
          }
        ],
        "skorRataRata": 2.75
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "skor": 3,
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar."
          },
          {
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan.",
            "skor": 2
          }
        ],
        "skorRataRata": 2.75,
        "kategori": "Finance (Keuangan)"
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3,
        "rincian": [
          {
            "jawaban": "Terbuka untuk berkolaborasi jika ada pihak lain yang mengajak dan menanggung biayanya.",
            "skor": 3,
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?"
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "skor": 3
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan."
          },
          {
            "skor": 3,
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "jawaban": "Ada sedikit panduan tertulis secara acak, namun tidak lengkap dan jarang diperbarui.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "skor": 3
          },
          {
            "jawaban": "Tim merujuk pada panduan standar penyelesaian masalah yang sudah disepakati sebelumnya.",
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Pengecekan stok atau kapasitas dilakukan secara acak hanya jika teringat atau terlihat menipis.",
            "skor": 2
          }
        ]
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "jawaban": "Karena produk mampu memberikan solusi yang sangat spesifik dan relevan dengan masalah mereka.",
            "skor": 4,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "skor": 5,
            "jawaban": "Produk kami memiliki karakter atau ciri khas yang sangat kuat, sehingga pelanggan merasa sulit mencari penggantinya di tempat lain.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.",
            "skor": 4
          },
          {
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "skor": 4
          }
        ],
        "skorRataRata": 4.25
      },
      {
        "rincian": [
          {
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?"
          },
          {
            "skor": 3,
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "jawaban": "Konsisten memberikan nilai tambah edukasi, perhatian khusus, atau membangun komunitas di sekitar merek kami.",
            "skor": 5,
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?"
          }
        ],
        "skorRataRata": 3.5,
        "kategori": "Service (Layanan)"
      },
      {
        "skorRataRata": 3.5,
        "rincian": [
          {
            "skor": 5,
            "jawaban": "Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?"
          },
          {
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.",
            "skor": 3,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 1,
            "jawaban": "Hanya mengandalkan daya ingat atau kertas catatan yang mudah hilang."
          },
          {
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "skor": 5,
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal."
          }
        ],
        "kategori": "Sales (Penjualan)"
      },
      {
        "rincian": [
          {
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 3,
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting."
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "skor": 3,
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas."
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 3,
            "jawaban": "Mulai membangun gaya visual, gaya bahasa, atau ciri khas konsisten yang mudah dikenali pelanggan."
          }
        ],
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.25
      },
      {
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal.",
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra."
          },
          {
            "skor": 3,
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?"
          }
        ],
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25
      }
    ]
  },
  {
    "row": 17,
    "timestamp": "27/09/2026 16:18:01",
    "namaUsaha": "Party Utara",
    "whatsapp": "81333187243",
    "totalSkor": 66,
    "poinBisaAjarkan": "Operasional",
    "materiBisaAjarkan": "Sharing KPI dan SOP",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Kualitas & Keunikan Produk/Jasa",
    "kekuatanSkor": 5,
    "kelemahan": "Legalitas & Kelengkapan Dokumen",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 3,
        "catatan": ""
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Leadership",
        "skor": 5,
        "catatan": "saya mencoba membuat keputusan dan mengarahkan visi usaha setiap bulan"
      },
      {
        "kriteria": "Operasional",
        "skor": 4,
        "catatan": "saya sudah mencoba Efisiensi proses produksi/operasional sehari-hari dan pengelolaan sumber daya usaha."
      },
      {
        "kriteria": "Marketing",
        "skor": 4,
        "catatan": "saya sudah mencoba strategi promosi, branding,"
      },
      {
        "kriteria": "Financial",
        "skor": 4,
        "catatan": "saya sudah mencoba Pengelolaan arus kas, pencatatan keuangan, dan kesehatan finansial usaha."
      },
      {
        "kriteria": "Sales",
        "skor": 4,
        "catatan": "team kami beberapa kali menvapai target alhamdulilah"
      },
      {
        "kriteria": "Service",
        "skor": 5,
        "catatan": "kami mengedepankan Kualitas pelayanan dan kepuasan pelanggan terhadap usaha Anda."
      },
      {
        "kriteria": "Growth",
        "skor": 5,
        "catatan": "kami meksimalkan Potensi ekspansi, inovasi, dan strategi pengembangan usaha ke depan."
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "kami berusaha untuk menajaga Kualitas, keunikan, dan daya saing produk"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 4
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 4.29
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4.75
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4.25
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 4,
            "jawaban": "Saya berfokus pada evaluasi dan strategi; operasional harian sudah berjalan sesuai panduan kerja."
          },
          {
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "jawaban": "Keputusan selalu diambil berdasarkan data angka objektif dan analisa riwayat bisnis.",
            "skor": 4
          },
          {
            "jawaban": "Memiliki standar rekrutmen yang jelas, menilai kecocokan sikap kerja (karakter) dan kompetensi teknis secara seimbang.",
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "skor": 4
          }
        ],
        "skorRataRata": 4,
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "skorRataRata": 3.75,
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "skor": 4,
            "jawaban": "Memiliki alokasi pos pengeluaran yang ketat sehingga biaya operasional selalu terjaga sesuai batas aman anggaran."
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menentukan harga berdasarkan besarnya manfaat, kualitas, dan solusi yang dirasakan langsung oleh pelanggan.",
            "skor": 4
          },
          {
            "jawaban": "Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian.",
            "skor": 4,
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?"
          }
        ]
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "skor": 4,
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama."
          },
          {
            "skor": 5,
            "jawaban": "Secara proaktif selalu mencari dan menguji teknologi baru (seperti otomasi atau AI) untuk menekan biaya dan melipatgandakan produktivitas.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan."
          },
          {
            "skor": 4,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan."
          },
          {
            "skor": 5,
            "jawaban": "Panduan baku sudah terintegrasi menjadi alat kerja harian (seperti daftar periksa mandiri) yang menjaga konsistensi tanpa perlu diawasi.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang."
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Memiliki pencatatan sistematis dengan pengingat otomatis sebelum batas minimum bahan/kapasitas tercapai."
          }
        ],
        "skorRataRata": 4.29,
        "kategori": "Operation (Operasional)"
      },
      {
        "rincian": [
          {
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka.",
            "skor": 5,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "jawaban": "Kami diakui sebagai rujukan utama atau pilihan prioritas di wilayah operasional atau kategori kami.",
            "skor": 4,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.",
            "skor": 4
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing."
          }
        ],
        "skorRataRata": 4.25,
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "skorRataRata": 3.75,
        "rincian": [
          {
            "jawaban": "Sangat mulus dan minim hambatan; kami selalu mencari cara menyederhanakan proses bagi pelanggan.",
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "skor": 4
          },
          {
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata.",
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Memiliki mekanisme berkala untuk memantau tingkat kepuasan pelanggan setelah transaksi selesai.",
            "skor": 4
          },
          {
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 3
          }
        ],
        "kategori": "Service (Layanan)"
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.75,
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?"
          },
          {
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.",
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "skor": 3
          },
          {
            "jawaban": "Data kontak dikelompokkan berdasarkan seberapa besar minat atau kesiapan mereka untuk bertransaksi.",
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 4
          },
          {
            "jawaban": "Menggunakan penawaran menarik dengan batas waktu atau batas ketersediaan yang jelas dan tidak dibuat-buat.",
            "skor": 4,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?"
          }
        ]
      },
      {
        "rincian": [
          {
            "jawaban": "Menyampaikan nilai, cerita, dan semangat merek yang membuat pelanggan merasa bangga dan sejalan dengan ideologi kami.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 5
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "jawaban": "Sering membagikan ilmu atau referensi berkualitas tinggi secara gratis yang memperkuat citra profesional bisnis di industrinya."
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "jawaban": "Memiliki pola pemasaran stabil yang secara konsisten dan terprediksi mampu mendatangkan audiens baru."
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 4,
            "jawaban": "Diakui sebagai rujukan terpercaya atau standar kualitas di kelasnya oleh mayoritas pelaku wilayah/pasar."
          }
        ],
        "skorRataRata": 4.75,
        "kategori": "Marketing (Pemasaran)"
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal.",
            "skor": 4,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "skor": 4,
            "jawaban": "Mampu meningkatkan kapasitas produksi dan pelayanan secara signifikan melalui perbaikan sistem tanpa melipatgandakan biaya pokok."
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "skor": 5,
            "jawaban": "Semangat mencoba cara kerja yang lebih baik telah menjadi budaya tim; setiap orang didorong untuk menguji usulan ide baru."
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Memiliki sistem apresiasi yang tertata dengan standar keuntungan yang jelas bagi setiap orang yang membawa pelanggan baru."
          }
        ],
        "skorRataRata": 4.25
      }
    ]
  },
  {
    "row": 18,
    "timestamp": "27/09/2026 17:20:43",
    "namaUsaha": "Kenayu",
    "whatsapp": "81233715875",
    "totalSkor": 51,
    "poinBisaAjarkan": "Service",
    "materiBisaAjarkan": "cara penawaran produk kepada customer baru baik itu offline maupun online",
    "poinPerluDipelajari": "Financial",
    "sesi": "Sesi 2",
    "kekuatan": "Legalitas & Kelengkapan Dokumen",
    "kekuatanSkor": 5,
    "kelemahan": "Financial",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 3,
        "catatan": "65%"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 3,
        "catatan": "70%"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": "Kenayu memiliki logo yang mudah di kenali dan looks luxury"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "masih harus banyak belajar program keuangan"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "nib,pirt, halal, dan HKI sudah dimiliki"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "85% siap brkolaborasi"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 3,
        "catatan": "masih dengan area lokal sekitarnya"
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "sering masih merasa insecure"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "kadang, jika mood jelek efisiensi tidak dapat dipergunakan"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "kurang bisa dalam hal digital marketing"
      },
      {
        "kriteria": "Financial",
        "skor": 2,
        "catatan": "masih harus banyak belajar mengenai aplikasi atau sistem keuangan"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "pengalaman sales di era dl dan era now berbeda"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "selalu mendapatkan feedback atau testimoni yang cukup baik dari customer"
      },
      {
        "kriteria": "Growth",
        "skor": 3,
        "catatan": "belum memiliki ide untuk berinovasi"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "saya yakin produk kenayu memiliki ciri khas tersendiri, baik dalam bentuk maupun rasa"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.5
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2.5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "jawaban": "Saya memiliki tim pengelola, tapi setiap keputusan dan masalah teknis tetap menunggu penyelesaian dari saya.",
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 3,
            "jawaban": "Evaluasi dan penyampaian target hanya dilakukan secara reaktif saat ada masalah atau omset turun."
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "jawaban": "Berdasarkan insting spontan atau kepanikan saat ada masalah mendadak.",
            "skor": 1
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "skor": 3
          }
        ],
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.5
      },
      {
        "skorRataRata": 2.5,
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Uang dipisah, tapi pengelolaannya serampangan; jika bisnis kekurangan uang, saya sering nombok pakai uang pribadi."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar."
          },
          {
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan.",
            "skor": 2
          }
        ]
      },
      {
        "rincian": [
          {
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "skor": 4,
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?"
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "skor": 3,
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal."
          },
          {
            "skor": 3,
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?"
          },
          {
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan.",
            "skor": 4,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "jawaban": "Ada sedikit panduan tertulis secara acak, namun tidak lengkap dan jarang diperbarui.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "skor": 5
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "skor": 3
          }
        ],
        "skorRataRata": 3.57,
        "kategori": "Operation (Operasional)"
      },
      {
        "rincian": [
          {
            "jawaban": "Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan.",
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 2,
            "jawaban": "Mirip, tetapi kami mencoba bersaing dengan memberikan tambahan bonus atau fitur ekstra."
          },
          {
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing.",
            "skor": 4
          }
        ],
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "skor": 3
          },
          {
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "skor": 3,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?"
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Memiliki mekanisme berkala untuk memantau tingkat kepuasan pelanggan setelah transaksi selesai."
          },
          {
            "jawaban": "Memiliki metode atau program terstruktur yang mendorong pelanggan untuk terus berinteraksi atau bertransaksi kembali.",
            "skor": 4,
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?"
          }
        ],
        "skorRataRata": 3.5
      },
      {
        "skorRataRata": 3.5,
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?"
          },
          {
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.",
            "skor": 3,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana.",
            "skor": 3
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Menggunakan penawaran menarik dengan batas waktu atau batas ketersediaan yang jelas dan tidak dibuat-buat."
          }
        ],
        "kategori": "Sales (Penjualan)"
      },
      {
        "skorRataRata": 2.25,
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 1,
            "jawaban": "Semuanya hanya berupa katalog jualan langsung: harga, ketersediaan, dan ajakan membeli."
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "jawaban": "Sering menunggangi tren acak yang tidak berhubungan dengan bisnis asalkan bisa mendapat banyak penonton."
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "jawaban": "Memiliki penawaran daya tarik khusus (seperti sampel, sesi gratis, atau materi panduan) untuk memancing kontak calon pelanggan potensial.",
            "skor": 4
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat.",
            "skor": 2
          }
        ],
        "kategori": "Marketing (Pemasaran)"
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3,
        "rincian": [
          {
            "skor": 3,
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu.",
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "skor": 3,
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik."
          },
          {
            "skor": 3,
            "jawaban": "Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra.",
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?"
          },
          {
            "skor": 3,
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?"
          }
        ]
      }
    ]
  },
  {
    "row": 19,
    "timestamp": "27/09/2026 18:14:14",
    "namaUsaha": "Mau Grill",
    "whatsapp": "81232456859",
    "totalSkor": 59,
    "poinBisaAjarkan": "Service",
    "materiBisaAjarkan": "- Dari Produk Menjadi Solusi: Membangun Service Experience untuk UMKM\n- Cara Menangani Customer dengan Pendekatan Solusi",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Branding & Kehadiran Digital",
    "kekuatanSkor": 5,
    "kelemahan": "Legalitas & Kelengkapan Dokumen",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": "Mau Grill adalah UMKM jasa dan kuliner yang berdiri sejak 2020 di Kota Batu, dengan core business home service grill dan catering. Model bisnis kami menggabungkan penjualan langsung kepada konsumen melalui paket grill dengan model B2B berupa supply untuk villa, glamping, cafe maupun resto, serta pengembangan reseller dan event. \n\nRoadmap kami adalah memperkuat home service sebagai core business, memperbesar lini catering, dan membangun jaringan partnership B2B serta reseller sehingga Mau Grill bisa menjadi penyedia solusi grill yang praktis, berkualitas dan terpercaya di Kota Batu"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "- Kualitas: bahan baku berkualitas, higienis, packaging menarik, serta alat yang aman dan disertai panduan.\n-Nilai tambah: pelanggan mendapatkan solusi grill yang lengkap dan praktis, bukan sekadar membeli bahan makanan. Social proff drngsn verifikasi akun meta yg menambah trust.\n-Keunikan: konsep home service grill yang menghadirkan pengalaman grill langsung di lokasi pelanggan dan dapat dikustomisasi untuk kebutuhan personal maupun B2B"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 5,
        "catatan": "Secara branding, Mau Grill kami bangun sebagai brand home service grill yang praktis, berkualitas dan terpercaya. Kehadiran digital kami menggunakan Instagram dan TikTok sebagai kanal utama, didukung konten edukasi, kolaborasi, tester, dan follow-up WhatsApp. Branding ini ke depan akan kami konsistenkan untuk mendukung ekspansi consumer maupun B2B."
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 5,
        "catatan": "Mau Grill sudah memisahkan keuangan pribadi dan usaha melalui rekening terpisah. Transaksi kami dicatat menggunakan sistem Qasir, kemudian direkap dalam laporan keuangan bulanan berupa laba rugi hingga neraca. Sistem ini kami gunakan untuk menjaga transparansi dan membantu owner mengambil keputusan berdasarkan kondisi keuangan usaha"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 3,
        "catatan": "Mau grill masih memiliki NIB dan dokumen halal untuk produk, belum lengkap dengan PIRT dll tetapi sedang mengupayakan pendaftaran merek"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 4,
        "catatan": "Owner Mau Grill aktif belajar dan terbuka terhadap masukan melalui berbagai pelatihan serta komunitas bisnis. Kami aktif membangun relasi di Sukses Berkah Community, IIBF, TDA, Entrepreneur University, High Class Response, Scale Up Grounded, Profit Camp, dan beberapa komunitas lainnya. Bagi kami, networking bukan hanya untuk belajar, tetapi juga membuka peluang kolaborasi dan bertukar pengalaman dengan sesama pelaku usaha."
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 3,
        "catatan": "Kontribusi Mau Grill kami arahkan pada penciptaan lapangan kerja dan penguatan ekosistem UMKM lokal. Kami melibatkan tenaga kerja, supplier lokal, serta membangun kolaborasi dengan villa, glamping, cafe, dan resto di Kota Batu. Ke depan, kami ingin memperluas jaringan reseller dan partnership agar pertumbuhan Mau Grill juga memberikan multiplier effect bagi pelaku usaha lokal lainnya."
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Sebagai owner, saya berperan dalam menentukan arah dan mengambil keputusan strategis Mau Grill. Kami pernah melalui beberapa fase bisnis, dari home service, membuka gerai dine-in, hingga melakukan evaluasi dan kembali memfokuskan bisnis pada home service, catering, dan B2B. Ke depan, leadership saya diarahkan untuk memperkuat sistem bisnis, mengembangkan tim, dan memperluas partnership agar Mau Grill dapat tumbuh secara berkelanjutan"
      },
      {
        "kriteria": "Operasional",
        "skor": 5,
        "catatan": "Kekuatan operasional Mau Grill ada pada model home service yang praktis dan fleksibel. Kami mengelola bahan, perlengkapan, tenaga kerja, dan proses produksi untuk memenuhi pesanan secara terstruktur. Sumber daya juga kami arahkan sesuai fungsi—produksi dan marketing—serta didukung jaringan supplier dan mitra hospitality. Dengan model ini, kami dapat menyesuaikan kapasitas operasional dengan kebutuhan pesanan tanpa bergantung pada kapasitas restoran fisik."
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "Marketing Mau Grill saat ini berada di kondisi sedang karena belum optimal akibat keterbatasan tim. Selama ini kami lebih memprioritaskan operasional dan kualitas layanan. Namun, kami mulai belajar menerapkan strategi marketing yang lebih sederhana dan realistis sesuai kapasitas tim, seperti konten edukasi, kolaborasi, promo bundling, dan follow-up WhatsApp. Ke depan, fokus kami adalah membangun marketing yang lebih konsisten agar dapat meningkatkan customer acquisition dan repeat order."
      },
      {
        "kriteria": "Financial",
        "skor": 5,
        "catatan": "Financial menjadi salah satu kekuatan Mau Grill karena sejak awal kami sudah membiasakan keuangan usaha dipisahkan dari keuangan pribadi. Kami menggunakan rekening khusus usaha dan sistem Qasir untuk pencatatan transaksi, kemudian menyusun laporan laba rugi dan neraca setiap bulan. Dengan sistem tersebut, kami dapat memantau arus kas dan kondisi kesehatan usaha secara lebih terukur, sekaligus menjadi dasar dalam mengambil keputusan bisnis"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "Sales Mau Grill saat ini berada di kondisi sedang. Seluruh prospek kami arahkan ke satu WhatsApp sebagai kanal utama sampai terjadi transaksi, sehingga customer journey cukup sederhana. Namun, kelemahannya tracking conversion belum spesifik karena kami belum membedakan sumber prospek dan conversion rate masing-masing kanal. Saat ini kami sedang belajar membangun sistem tracking yang lebih sederhana dan terukur agar proses dari prospek sampai transaksi dapat dievaluasi dengan lebih baik"
      },
      {
        "kriteria": "Service",
        "skor": 5,
        "catatan": "Service dan kualitas menjadi kekuatan Mau Grill karena kami mengedepankan pelayanan terbaik dan hadir sebagai solusi bagi pelanggan. Kami tidak hanya menyediakan makanan, tetapi memberikan pengalaman grill yang lengkap, praktis, nyaman, dan tanpa ribet. Kami juga menjaga kualitas produk, kebersihan, serta pelayanan yang ramah dan responsif. Jadi, value yang kami tawarkan bukan hanya produknya, tetapi bagaimana kami memberikan solusi dan pengalaman yang baik dari awal sampai selesai."
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "Growth Mau Grill saat ini kami kategorikan sedang karena arah dan potensi ekspansi sudah cukup jelas, tetapi implementasinya masih bertahap. Kami sudah melihat peluang pengembangan melalui catering, B2B hospitality, reseller, dan inovasi layanan. Saat ini kami juga memiliki mentor bisnis khusus yang membantu kami mengevaluasi strategi dan mempersiapkan proses scale-up. Fokus kami berikutnya adalah mengubah potensi tersebut menjadi eksekusi dan pertumbuhan yang lebih terukur."
      },
      {
        "kriteria": "Product",
        "skor": 3,
        "catatan": "Kami menilai kualitas dan daya saing Mau Grill berada di kondisi sedang. Keunikan kami ada pada konsep home service grill yang praktis dan lengkap, dengan perhatian pada kualitas, kebersihan, keamanan, dan pelayanan. Namun, kami masih perlu memperkuat diferensiasi agar keunggulan tersebut semakin kuat dan tidak hanya bergantung pada konsep. Karena itu, inovasi produk, paket, perlengkapan, dan service experience menjadi fokus pengembangan kami ke depan"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 4.43
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.75
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 4.75
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4.75
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "jawaban": "Saya memiliki tim pengelola, tapi setiap keputusan dan masalah teknis tetap menunggu penyelesaian dari saya.",
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 4,
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala."
          },
          {
            "skor": 5,
            "jawaban": "Keputusan didesentralisasi; tim memiliki kewenangan mengambil keputusan operasional asalkan sejalan dengan prinsip dasar bisnis.",
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "skor": 3,
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?"
          }
        ],
        "skorRataRata": 3.75,
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "skorRataRata": 5,
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "skor": 5,
            "jawaban": "Tata kelola kas sangat sehat, bisnis memiliki dana cadangan operasional yang cukup untuk mengamankan bulan-bulan sepi."
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Harga ditentukan secara strategis untuk menyaring dan mendapatkan target segmen pasar spesifik yang paling menguntungkan."
          },
          {
            "skor": 5,
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "jawaban": "Fokus memantau nilai jangka panjang dari pelanggan setia dan membandingkannya dengan anggaran promosi yang dikeluarkan."
          },
          {
            "skor": 5,
            "jawaban": "Ekspansi dibiayai oleh model bisnis yang berputar sehat atau didukung oleh sistem kemitraan strategis yang minim risiko.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?"
          }
        ],
        "kategori": "Finance (Keuangan)"
      },
      {
        "rincian": [
          {
            "jawaban": "Menjadi motor penggerak atau inisiator yang membangun ekosistem kolaborasi di komunitas lokal.",
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "skor": 5
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "skor": 5,
            "jawaban": "Secara proaktif selalu mencari dan menguji teknologi baru (seperti otomasi atau AI) untuk menekan biaya dan melipatgandakan produktivitas."
          },
          {
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "skor": 3
          },
          {
            "jawaban": "Sangat mulus. Alur kerja operasional bisnis sudah dirancang elastis untuk menangani kapasitas besar secara efisien.",
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 5
          },
          {
            "jawaban": "Panduan baku sudah terintegrasi menjadi alat kerja harian (seperti daftar periksa mandiri) yang menjaga konsistensi tanpa perlu diawasi.",
            "skor": 5,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "skor": 5,
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?"
          },
          {
            "skor": 3,
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?"
          }
        ],
        "kategori": "Operation (Operasional)",
        "skorRataRata": 4.43
      },
      {
        "skorRataRata": 4.75,
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "skor": 5,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka."
          },
          {
            "jawaban": "Produk kami memiliki karakter atau ciri khas yang sangat kuat, sehingga pelanggan merasa sulit mencari penggantinya di tempat lain.",
            "skor": 5,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?"
          },
          {
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.",
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?"
          },
          {
            "jawaban": "Produk/jasa kami telah terintegrasi erat dengan aktivitas rutin pelanggan sehingga sulit bagi mereka untuk beralih.",
            "skor": 5,
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?"
          }
        ]
      },
      {
        "rincian": [
          {
            "jawaban": "Tim sangat proaktif memandu, mengantisipasi kebingungan, dan membantu pelanggan sebelum mereka memintanya.",
            "skor": 5,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Tim garda depan diberi wewenang, keluwesan, dan batasan anggaran mandiri untuk menebus kekecewaan pelanggan secara langsung saat itu juga.",
            "skor": 5
          },
          {
            "jawaban": "Memiliki mekanisme berkala untuk memantau tingkat kepuasan pelanggan setelah transaksi selesai.",
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "skor": 5,
            "jawaban": "Konsisten memberikan nilai tambah edukasi, perhatian khusus, atau membangun komunitas di sekitar merek kami.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?"
          }
        ],
        "kategori": "Service (Layanan)",
        "skorRataRata": 4.75
      },
      {
        "skorRataRata": 3.75,
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 4,
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu."
          },
          {
            "skor": 3,
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.",
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana."
          },
          {
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal.",
            "skor": 5
          }
        ],
        "kategori": "Sales (Penjualan)"
      },
      {
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 5,
            "jawaban": "Menyampaikan nilai, cerita, dan semangat merek yang membuat pelanggan merasa bangga dan sejalan dengan ideologi kami."
          },
          {
            "jawaban": "Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 4
          },
          {
            "skor": 5,
            "jawaban": "Memiliki pola pemasaran stabil yang secara konsisten dan terprediksi mampu mendatangkan audiens baru.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "skor": 4,
            "jawaban": "Diakui sebagai rujukan terpercaya atau standar kualitas di kelasnya oleh mayoritas pelaku wilayah/pasar.",
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?"
          }
        ],
        "skorRataRata": 4.5,
        "kategori": "Marketing (Pemasaran)"
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Terbiasa menjalankan siklus pengembangan bertahap, di mana perbaikan dilakukan terus-menerus berdasarkan respon pasar.",
            "skor": 5
          },
          {
            "jawaban": "Menggunakan skema terstruktur untuk bertumbuh (seperti kemitraan, lisensi, atau perbaikan model distribusi) yang meminimalkan beban harian pemilik.",
            "skor": 5,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Secara terencana selalu menyediakan alokasi waktu dan modal khusus secara rutin demi memikirkan perbaikan bisnis ke depan.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Reputasi dan kualitas produk sangat bisa diandalkan, sehingga merekomendasikannya kepada orang lain menjadi bentuk kebanggaan alami bagi pelanggan.",
            "skor": 5
          }
        ],
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4.75
      }
    ]
  },
  {
    "row": 20,
    "timestamp": "27/09/2026 19:15:44",
    "namaUsaha": "Fida Accessories",
    "whatsapp": "81253426280",
    "totalSkor": 57,
    "poinBisaAjarkan": "Sales",
    "materiBisaAjarkan": "Cara menyapa dan ngobrol dgn calon pembeli",
    "poinPerluDipelajari": "Marketing",
    "sesi": "Sesi 2",
    "kekuatan": "Kesiapan Berkolaborasi & Belajar",
    "kekuatanSkor": 5,
    "kelemahan": "Marketing",
    "kelemahanSkor": 1,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": "Produk kami dibuat untuk penyuka aksesories baik dewasa maupun anak² ,untuk digunakan pribadi,sbg gift maupun untuk usaha atau dijual kembali dgn harga yg sangat kompetitif"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "Untuk grosiran,hampir sering kami sbg pelopor atau pihak yg mengawali grosiran produk trtentu, pilihan warna yg banyak dan kualitas produk baik serta kemudahan pembayaran."
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": "Ada namun Masih belum maksimal"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 4,
        "catatan": "Sudah terpisah walupun tdk trcatat sempurna"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 4,
        "catatan": "Memiliki NIB"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Bersedia belajar dan berkolaborasi"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 3,
        "catatan": "Sudah berdampak walau kecil sesuai dgn kemajuan usaha"
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Dlm 1 tahun terakhir ini dengan modal sangat terbatas mampu membuka 2 cabang gerai lainnya yg nilainya tergolong sehat"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "Mampu berhasil menentukan mana produk yg harus diproduksi dan mana yg ditunda dulu"
      },
      {
        "kriteria": "Marketing",
        "skor": 1,
        "catatan": "Selama ini masih dengan pelanggan lama (grosiran)"
      },
      {
        "kriteria": "Financial",
        "skor": 3,
        "catatan": "Ada rekening berbeda dan Ada pencatatan,namun kurang lengkap"
      },
      {
        "kriteria": "Sales",
        "skor": 5,
        "catatan": "Untuk temu muka,memiliki kemampuan sales yg kuat"
      },
      {
        "kriteria": "Service",
        "skor": 5,
        "catatan": "Ada jaga perbaikan gratis"
      },
      {
        "kriteria": "Growth",
        "skor": 5,
        "catatan": "Potensi tinggi karena minat org trhdp aksesoris masih tinggi"
      },
      {
        "kriteria": "Product",
        "skor": 5,
        "catatan": "Ada bnyk produk yg memiliki keunikan"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.14
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 1.75
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.75
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 2,
            "jawaban": "Saya mulai mendelegasikan tugas teknis, tapi mengawasi setiap gerak-gerik tim secara berlebihan."
          },
          {
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 2,
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini."
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 4,
            "jawaban": "Keputusan selalu diambil berdasarkan data angka objektif dan analisa riwayat bisnis."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku."
          }
        ],
        "skorRataRata": 2.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Memiliki alokasi pos pengeluaran yang ketat sehingga biaya operasional selalu terjaga sesuai batas aman anggaran.",
            "skor": 4
          },
          {
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?"
          },
          {
            "skor": 3,
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "skor": 3,
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?"
          }
        ],
        "skorRataRata": 3.25
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.14,
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Terbuka untuk berkolaborasi jika ada pihak lain yang mengajak dan menanggung biayanya.",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "skor": 3,
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?"
          },
          {
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 4,
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan."
          },
          {
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru.",
            "skor": 2
          },
          {
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "skor": 5,
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?"
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Pengecekan stok atau kapasitas dilakukan secara acak hanya jika teringat atau terlihat menipis.",
            "skor": 2
          }
        ]
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.75,
        "rincian": [
          {
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka.",
            "skor": 5
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "jawaban": "Kami fokus melayani celah pasar spesifik yang tidak digarap dengan serius oleh kompetitor besar."
          },
          {
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "skor": 4,
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan."
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan kembali bertransaksi secara natural hanya jika sedang benar-benar butuh.",
            "skor": 3
          }
        ]
      },
      {
        "rincian": [
          {
            "jawaban": "Tim sangat proaktif memandu, mengantisipasi kebingungan, dan membantu pelanggan sebelum mereka memintanya.",
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "skor": 5
          },
          {
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 4,
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata."
          },
          {
            "skor": 1,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Tidak ada sistem. Kami baru tahu ada masalah jika pelanggan marah besar atau omset anjlok."
          },
          {
            "skor": 3,
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi."
          }
        ],
        "skorRataRata": 3.25,
        "kategori": "Service (Layanan)"
      },
      {
        "skorRataRata": 3.5,
        "kategori": "Sales (Penjualan)",
        "rincian": [
          {
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 4
          },
          {
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh.",
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "skor": 4
          },
          {
            "jawaban": "Hanya mengandalkan daya ingat atau kertas catatan yang mudah hilang.",
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 1
          },
          {
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal.",
            "skor": 5
          }
        ]
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "skor": 1,
            "jawaban": "Semuanya hanya berupa katalog jualan langsung: harga, ketersediaan, dan ajakan membeli.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?"
          },
          {
            "jawaban": "Sepenuhnya berisi tawaran jualan dari ujung ke ujung.",
            "skor": 1,
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "skor": 3
          },
          {
            "jawaban": "Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat.",
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 2
          }
        ],
        "skorRataRata": 1.75
      },
      {
        "rincian": [
          {
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu.",
            "skor": 3,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "skor": 3,
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik."
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Pemilik baru mencoba memikirkan ide-ide segar ketika dilanda kepanikan akibat penurunan omset.",
            "skor": 2
          },
          {
            "skor": 3,
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?"
          }
        ],
        "skorRataRata": 2.75,
        "kategori": "Growth (Pertumbuhan)"
      }
    ]
  },
  {
    "row": 21,
    "timestamp": "27/09/2026 19:16:06",
    "namaUsaha": "Nickamakeupstudio",
    "whatsapp": "85749468931",
    "totalSkor": 64,
    "poinBisaAjarkan": "Marketing",
    "materiBisaAjarkan": "Marketing lewat sosial media dalam membuat konten",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Branding & Kehadiran Digital",
    "kekuatanSkor": 5,
    "kelemahan": "Kejelasan Model Bisnis",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 3,
        "catatan": "Selama ini mengandalkan pendapatan dari fee klien dan kemudian diputar lagi untuk modal"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "Yg menjadi pembeda adalah kami menggunakan sosmed untuk pemasaran yg jarang dilakukan oleh owner di sekitar kami"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 5,
        "catatan": "Selain menjual jasa kami juga seorang konten kreator jadi sosial media selalu beriringan dengan bisnis kami"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 4,
        "catatan": "Sudah mulai memindahkan untuk rekening pribadi dan usaha"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Kami sudah membuat perizinan"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Kami selalu terus belajar dan mengupgrade skill"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": "Usaha kami selalu menciptakan lapangan pekerjaan dan banyak memberi manfaat untuk tim"
      },
      {
        "kriteria": "Leadership",
        "skor": 5,
        "catatan": "Menjadi Owner selama 18th di bidang yg sama membuat sy belajar banyak hal, bagaimana memimpin sebuah tim dan bagaimana bs terus memberikan manfaat serta ilmu untuk saling belajar agar usaha ini tetap berdiri tegak"
      },
      {
        "kriteria": "Operasional",
        "skor": 5,
        "catatan": "Semua sudah terjadwal bahkan dalam 3 bulan sebelum melakukan promosi maupun menjalani  operasional sehari2."
      },
      {
        "kriteria": "Marketing",
        "skor": 4,
        "catatan": "Selalu melakukan evaluasi dengan tim dan"
      },
      {
        "kriteria": "Financial",
        "skor": 4,
        "catatan": "Sudah kami lakukan pencatatan"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "Terkadang merasa kurang jago sales"
      },
      {
        "kriteria": "Service",
        "skor": 5,
        "catatan": "Kami sangat menjaga kualitas terbaik dan service yg paling utama"
      },
      {
        "kriteria": "Growth",
        "skor": 3,
        "catatan": "Masih butuh bimbingan karena terkadang masih kurang ilmu yg dimiliki"
      },
      {
        "kriteria": "Product",
        "skor": 5,
        "catatan": "Insyaallah sudah memberi kualitas yg terbaik"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.25
      }
    ],
    "bagian3Detail": [
      {
        "skorRataRata": 2.75,
        "rincian": [
          {
            "jawaban": "Saya memiliki tim pengelola, tapi setiap keputusan dan masalah teknis tetap menunggu penyelesaian dari saya.",
            "skor": 3,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 2
          },
          {
            "skor": 3,
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "skor": 3,
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?"
          }
        ],
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Uang dipisah, tapi pengelolaannya serampangan; jika bisnis kekurangan uang, saya sering nombok pakai uang pribadi.",
            "skor": 2
          },
          {
            "jawaban": "Menyalin persis harga yang dipatok oleh rata-rata kompetitor di sekitar.",
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "skor": 2
          },
          {
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "skor": 5,
            "jawaban": "Fokus memantau nilai jangka panjang dari pelanggan setia dan membandingkannya dengan anggaran promosi yang dikeluarkan."
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 4,
            "jawaban": "Mampu menggunakan modal eksternal atau investasi secara aman karena memiliki proyeksi keuntungan yang jelas dan terukur."
          }
        ],
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57,
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?"
          },
          {
            "jawaban": "Secara proaktif selalu mencari dan menguji teknologi baru (seperti otomasi atau AI) untuk menekan biaya dan melipatgandakan produktivitas.",
            "skor": 5,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "skor": 3
          },
          {
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "skor": 3,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "jawaban": "Semuanya hanya ada di ingatan saya pribadi.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "skor": 5,
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?"
          },
          {
            "jawaban": "Memiliki pencatatan sistematis dengan pengingat otomatis sebelum batas minimum bahan/kapasitas tercapai.",
            "skor": 4,
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?"
          }
        ]
      },
      {
        "skorRataRata": 4.25,
        "rincian": [
          {
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "skor": 4,
            "jawaban": "Karena produk mampu memberikan solusi yang sangat spesifik dan relevan dengan masalah mereka."
          },
          {
            "jawaban": "Kami diakui sebagai rujukan utama atau pilihan prioritas di wilayah operasional atau kategori kami.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 4
          },
          {
            "skor": 5,
            "jawaban": "Menganalisa kebiasaan dan kesulitan pelanggan secara mendalam untuk menawarkan solusi yang bahkan belum mereka sadari.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?"
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing."
          }
        ],
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "rincian": [
          {
            "skor": 5,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "jawaban": "Tim sangat proaktif memandu, mengantisipasi kebingungan, dan membantu pelanggan sebelum mereka memintanya."
          },
          {
            "skor": 3,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan."
          },
          {
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "skor": 5,
            "jawaban": "Secara aktif menggali pendapat pelanggan secara mendalam untuk memahami kelebihan dan kekurangan bisnis kami."
          },
          {
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 5,
            "jawaban": "Konsisten memberikan nilai tambah edukasi, perhatian khusus, atau membangun komunitas di sekitar merek kami."
          }
        ],
        "kategori": "Service (Layanan)",
        "skorRataRata": 4.5
      },
      {
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Memberikan solusi yang jujur, bahkan berani menyarankan produk lain jika produk kami memang tidak cocok untuk mereka.",
            "skor": 5
          },
          {
            "skor": 3,
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.",
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 5,
            "jawaban": "Memiliki sistem tindak lanjut (follow-up) yang terjadwal rapi dan konsisten agar tidak ada peluang yang terlewat."
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal."
          }
        ],
        "skorRataRata": 4.5,
        "kategori": "Sales (Penjualan)"
      },
      {
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 4,
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan."
          },
          {
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 5,
            "jawaban": "Sering membagikan ilmu atau referensi berkualitas tinggi secara gratis yang memperkuat citra profesional bisnis di industrinya."
          },
          {
            "skor": 4,
            "jawaban": "Memiliki penawaran daya tarik khusus (seperti sampel, sesi gratis, atau materi panduan) untuk memancing kontak calon pelanggan potensial.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "skor": 4,
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Diakui sebagai rujukan terpercaya atau standar kualitas di kelasnya oleh mayoritas pelaku wilayah/pasar."
          }
        ],
        "skorRataRata": 4.25,
        "kategori": "Marketing (Pemasaran)"
      },
      {
        "skorRataRata": 3.25,
        "rincian": [
          {
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu.",
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Secara terencana selalu menyediakan alokasi waktu dan modal khusus secara rutin demi memikirkan perbaikan bisnis ke depan.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.",
            "skor": 3
          }
        ],
        "kategori": "Growth (Pertumbuhan)"
      }
    ]
  },
  {
    "row": 22,
    "timestamp": "27/09/2026 20:28:03",
    "namaUsaha": "Cinematosh Presenter Indonesia",
    "whatsapp": "81334484106",
    "totalSkor": 67,
    "poinBisaAjarkan": "Marketing",
    "materiBisaAjarkan": "Berkokaborasi uniuk saling berpromosi",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Kejelasan Model Bisnis",
    "kekuatanSkor": 5,
    "kelemahan": "Kualitas & Keunikan Produk/Jasa",
    "kelemahanSkor": 4,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Leadership",
        "skor": 4,
        "catatan": "Kami berproses menjadi dewasa Dan lebih matang dala berusaha"
      },
      {
        "kriteria": "Operasional",
        "skor": 5,
        "catatan": "Disiplin lenggunaaan uang perusahaan Dan pribadi"
      },
      {
        "kriteria": "Marketing",
        "skor": 4,
        "catatan": "Alhamdulillah berimnbang antara offline _ online"
      },
      {
        "kriteria": "Financial",
        "skor": 4,
        "catatan": "Sedang menuju perbaikan"
      },
      {
        "kriteria": "Sales",
        "skor": 4,
        "catatan": "Bisa Dari word of mouth/media sosial"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Mereka bisa bertahan mempercayakan anaknya unyuk belajar di kami"
      },
      {
        "kriteria": "Growth",
        "skor": 5,
        "catatan": "Sedang berproses menuju per aikan diri & perusahaan"
      },
      {
        "kriteria": "Product",
        "skor": 5,
        "catatan": "Belum ada banyak kompeyitor sejenis"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 4.43
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.75
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 4
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4.5
      }
    ],
    "bagian3Detail": [
      {
        "skorRataRata": 3.75,
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Saya berfokus pada evaluasi dan strategi; operasional harian sudah berjalan sesuai panduan kerja.",
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 4,
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala."
          },
          {
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "jawaban": "Memiliki standar rekrutmen yang jelas, menilai kecocokan sikap kerja (karakter) dan kompetensi teknis secara seimbang.",
            "skor": 4,
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?"
          }
        ],
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Memiliki alokasi pos pengeluaran yang ketat sehingga biaya operasional selalu terjaga sesuai batas aman anggaran."
          },
          {
            "skor": 3,
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?"
          },
          {
            "jawaban": "Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian.",
            "skor": 4,
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 3
          }
        ],
        "skorRataRata": 3.5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 4.43,
        "rincian": [
          {
            "jawaban": "Menjadi motor penggerak atau inisiator yang membangun ekosistem kolaborasi di komunitas lokal.",
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "skor": 5
          },
          {
            "jawaban": "Terbuka belajar dan rutin menggunakan perangkat lunak digital untuk memangkas waktu kerja manual tim.",
            "skor": 4,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 5,
            "jawaban": "Legalitas badan usaha sangat lengkap, tersimpan rapi, dan rutin melaporkan kewajiban pajak bisnis secara disiplin."
          },
          {
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan.",
            "skor": 4
          },
          {
            "skor": 5,
            "jawaban": "Panduan baku sudah terintegrasi menjadi alat kerja harian (seperti daftar periksa mandiri) yang menjaga konsistensi tanpa perlu diawasi.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "skor": 5
          },
          {
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 3
          }
        ]
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.75,
        "rincian": [
          {
            "skor": 5,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka."
          },
          {
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "jawaban": "Produk kami memiliki karakter atau ciri khas yang sangat kuat, sehingga pelanggan merasa sulit mencari penggantinya di tempat lain.",
            "skor": 5
          },
          {
            "jawaban": "Menganalisa kebiasaan dan kesulitan pelanggan secara mendalam untuk menawarkan solusi yang bahkan belum mereka sadari.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "skor": 5
          },
          {
            "skor": 4,
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?"
          }
        ]
      },
      {
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "skor": 3
          },
          {
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata.",
            "skor": 4
          },
          {
            "jawaban": "Memiliki mekanisme berkala untuk memantau tingkat kepuasan pelanggan setelah transaksi selesai.",
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "jawaban": "Konsisten memberikan nilai tambah edukasi, perhatian khusus, atau membangun komunitas di sekitar merek kami.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 5
          }
        ],
        "skorRataRata": 4
      },
      {
        "skorRataRata": 4.25,
        "rincian": [
          {
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 4
          },
          {
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh.",
            "skor": 4,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "jawaban": "Memiliki sistem tindak lanjut (follow-up) yang terjadwal rapi dan konsisten agar tidak ada peluang yang terlewat.",
            "skor": 5,
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?"
          },
          {
            "jawaban": "Menggunakan penawaran menarik dengan batas waktu atau batas ketersediaan yang jelas dan tidak dibuat-buat.",
            "skor": 4,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?"
          }
        ],
        "kategori": "Sales (Penjualan)"
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.75,
        "rincian": [
          {
            "skor": 5,
            "jawaban": "Menyampaikan nilai, cerita, dan semangat merek yang membuat pelanggan merasa bangga dan sejalan dengan ideologi kami.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?"
          },
          {
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "jawaban": "Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional.",
            "skor": 4
          },
          {
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "jawaban": "Mulai membangun gaya visual, gaya bahasa, atau ciri khas konsisten yang mudah dikenali pelanggan.",
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 3
          }
        ]
      },
      {
        "skorRataRata": 4.5,
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Terbiasa menjalankan siklus pengembangan bertahap, di mana perbaikan dilakukan terus-menerus berdasarkan respon pasar.",
            "skor": 5
          },
          {
            "skor": 4,
            "jawaban": "Mampu meningkatkan kapasitas produksi dan pelayanan secara signifikan melalui perbaikan sistem tanpa melipatgandakan biaya pokok.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Semangat mencoba cara kerja yang lebih baik telah menjadi budaya tim; setiap orang didorong untuk menguji usulan ide baru."
          },
          {
            "jawaban": "Memiliki sistem apresiasi yang tertata dengan standar keuntungan yang jelas bagi setiap orang yang membawa pelanggan baru.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 4
          }
        ],
        "kategori": "Growth (Pertumbuhan)"
      }
    ]
  },
  {
    "row": 23,
    "timestamp": "27/09/2026 20:31:12",
    "namaUsaha": "Moofbride",
    "whatsapp": "8973097633",
    "totalSkor": 48,
    "poinBisaAjarkan": "Service",
    "materiBisaAjarkan": "Cara membuat konten",
    "poinPerluDipelajari": "Growth",
    "sesi": "Sesi 2",
    "kekuatan": "Legalitas & Kelengkapan Dokumen",
    "kekuatanSkor": 5,
    "kelemahan": "Operasional",
    "kelemahanSkor": 1,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": ""
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "Dari segi produksi di eksekusi jahit menggunakan standart kualitas butik"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": ""
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "Masih belum rutin masih kadang\""
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Nib & Haki"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Saya sangat siap belajar untuk bisnis saya agar bisa grow up"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 5,
        "catatan": "Bisa berkontribusi"
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Mampu mendelegasikan perintah kepada tim  dengan baik sehingga tidak terjadi miss kom"
      },
      {
        "kriteria": "Operasional",
        "skor": 1,
        "catatan": "Tetap produksi tiap ada orderan"
      },
      {
        "kriteria": "Marketing",
        "skor": 2,
        "catatan": "Dari konten untuk branding dan marketing dan ikut komunitas untuk memperkenalkan usaha"
      },
      {
        "kriteria": "Financial",
        "skor": 1,
        "catatan": "Masih belum konsisten mencatat keuangan"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "Masih  banyak belajar untuk ini"
      },
      {
        "kriteria": "Service",
        "skor": 5,
        "catatan": "Banyak cust yang re order untuk jasa yang kami berikan"
      },
      {
        "kriteria": "Growth",
        "skor": 1,
        "catatan": "Masih belajar untuk ini"
      },
      {
        "kriteria": "Product",
        "skor": 3,
        "catatan": "Kualitas butik untuk jasa custom gaun ,"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "jawaban": "Saya memiliki tim pengelola, tapi setiap keputusan dan masalah teknis tetap menunggu penyelesaian dari saya.",
            "skor": 3
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala."
          },
          {
            "skor": 3,
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu.",
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?"
          },
          {
            "skor": 3,
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?"
          }
        ],
        "skorRataRata": 3.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Rekening campur aduk. Uang bisnis sering terpakai untuk keperluan pribadi tanpa pencatatan.",
            "skor": 1
          },
          {
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "skor": 3,
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?"
          },
          {
            "skor": 2,
            "jawaban": "Hanya memantau omset atau total uang masuk tanpa tahu persis keuntungannya.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan.",
            "skor": 2
          }
        ],
        "skorRataRata": 2
      },
      {
        "rincian": [
          {
            "jawaban": "Menjadi motor penggerak atau inisiator yang membangun ekosistem kolaborasi di komunitas lokal.",
            "skor": 5,
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?"
          },
          {
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 3,
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan."
          },
          {
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 5,
            "jawaban": "Sangat mulus. Alur kerja operasional bisnis sudah dirancang elastis untuk menangani kapasitas besar secara efisien."
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru."
          },
          {
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 5
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Pengecekan stok atau kapasitas dilakukan secara acak hanya jika teringat atau terlihat menipis."
          }
        ],
        "skorRataRata": 3.57,
        "kategori": "Operation (Operasional)"
      },
      {
        "skorRataRata": 3.75,
        "rincian": [
          {
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "jawaban": "Karena produk mampu memberikan solusi yang sangat spesifik dan relevan dengan masalah mereka.",
            "skor": 4
          },
          {
            "jawaban": "Kami fokus melayani celah pasar spesifik yang tidak digarap dengan serius oleh kompetitor besar.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 3
          },
          {
            "skor": 5,
            "jawaban": "Menganalisa kebiasaan dan kesulitan pelanggan secara mendalam untuk menawarkan solusi yang bahkan belum mereka sadari.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?"
          },
          {
            "skor": 3,
            "jawaban": "Pelanggan kembali bertransaksi secara natural hanya jika sedang benar-benar butuh.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?"
          }
        ],
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual.",
            "skor": 3,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "skor": 3
          },
          {
            "jawaban": "Hanya merespons komunikasi jika pelanggan yang terlebih dahulu bertanya atau menghubungi.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 2
          }
        ],
        "skorRataRata": 2.75
      },
      {
        "skorRataRata": 3.75,
        "kategori": "Sales (Penjualan)",
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu."
          },
          {
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "skor": 4,
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh."
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "skor": 2,
            "jawaban": "Dibiarkan menumpuk berantakan dalam riwayat pesan instan sehingga sulit dicari."
          },
          {
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "skor": 5,
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal."
          }
        ]
      },
      {
        "skorRataRata": 4,
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan."
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "jawaban": "Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional."
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "jawaban": "Memiliki pola pemasaran stabil yang secara konsisten dan terprediksi mampu mendatangkan audiens baru.",
            "skor": 5
          },
          {
            "skor": 3,
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Mulai membangun gaya visual, gaya bahasa, atau ciri khas konsisten yang mudah dikenali pelanggan."
          }
        ]
      },
      {
        "rincian": [
          {
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal.",
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "skor": 4
          },
          {
            "skor": 3,
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Pemilik baru mencoba memikirkan ide-ide segar ketika dilanda kepanikan akibat penurunan omset.",
            "skor": 2
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis."
          }
        ],
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3
      }
    ]
  },
  {
    "row": 24,
    "timestamp": "27/09/2026 21:28:44",
    "namaUsaha": "Tresnaning Karyo",
    "whatsapp": "81334198519",
    "totalSkor": 48,
    "poinBisaAjarkan": "Service",
    "materiBisaAjarkan": "Penjualan lewat wa",
    "poinPerluDipelajari": "Financial",
    "sesi": "Sesi 2",
    "kekuatan": "Legalitas & Kelengkapan Dokumen",
    "kekuatanSkor": 5,
    "kelemahan": "Pengelolaan Keuangan Usaha",
    "kelemahanSkor": 1,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 3,
        "catatan": "Masih belum bisa maksimal"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "Kuwalitas baik tidak ada yg menyamai"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": "Branding tidak ada yg MW menyamai"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 1,
        "catatan": "Belum bisa mencatat rapi"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Semua legalitas sudah ada"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 4,
        "catatan": "Kami siap untuk diberi pengarahan untuk kemajuan usaha kami"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": "Sangat berpotensi untuk menciptakan lapangan kerja"
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Keputusan sering salah"
      },
      {
        "kriteria": "Operasional",
        "skor": 2,
        "catatan": "Produksi masih blm efisien"
      },
      {
        "kriteria": "Marketing",
        "skor": 4,
        "catatan": "Karena promosi hanya sekarena mbatas saja"
      },
      {
        "kriteria": "Financial",
        "skor": 1,
        "catatan": "Karena masih belum bisa lmencatat keuangan secara benar"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "Masih blm bisa  pasar luas"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Karena kami selalu mengutamakan kepuasan pelanggan"
      },
      {
        "kriteria": "Growth",
        "skor": 2,
        "catatan": "Masih belum punya strategi"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Karena produk tidak dan hampir tidak ada yg menuamao"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 1.75
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 2.43
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 1.75
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "skor": 1,
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.",
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "jawaban": "Tidak ada komunikasi arah bisnis. Tim hanya datang, bekerja sesuai perintah, dan pulang.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "jawaban": "Berdasarkan asumsi dan selera pribadi saya semata, tanpa melihat data lapangan."
          },
          {
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku.",
            "skor": 3,
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?"
          }
        ],
        "skorRataRata": 1.75,
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2,
        "rincian": [
          {
            "skor": 1,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Rekening campur aduk. Uang bisnis sering terpakai untuk keperluan pribadi tanpa pencatatan."
          },
          {
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "skor": 3
          },
          {
            "jawaban": "Hanya memantau omset atau total uang masuk tanpa tahu persis keuntungannya.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "skor": 2
          },
          {
            "jawaban": "Seluruh uang bisnis selalu habis terputar kembali untuk operasional, sehingga sulit menabung untuk pengembangan.",
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?"
          }
        ]
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Terbuka untuk berkolaborasi jika ada pihak lain yang mengajak dan menanggung biayanya.",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "skor": 3,
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal."
          },
          {
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "skor": 3,
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?"
          },
          {
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "skor": 3,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "jawaban": "Semuanya hanya ada di ingatan saya pribadi.",
            "skor": 1
          },
          {
            "jawaban": "Karyawan diminta segera memperbaiki kesalahan saat itu juga tanpa ada evaluasi lanjutan.",
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 3
          },
          {
            "jawaban": "Sering kewalahan; tiba-tiba kehabisan bahan saat ramai, atau barang rusak karena menumpuk.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 1
          }
        ],
        "skorRataRata": 2.43,
        "kategori": "Operation (Operasional)"
      },
      {
        "skorRataRata": 3.75,
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "jawaban": "Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan.",
            "skor": 3
          },
          {
            "jawaban": "Produk kami memiliki karakter atau ciri khas yang sangat kuat, sehingga pelanggan merasa sulit mencari penggantinya di tempat lain.",
            "skor": 5,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "skor": 4,
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan kembali bertransaksi secara natural hanya jika sedang benar-benar butuh."
          }
        ]
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3,
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual."
          },
          {
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "skor": 3
          },
          {
            "skor": 3,
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi."
          }
        ]
      },
      {
        "skorRataRata": 3.5,
        "rincian": [
          {
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "skor": 4,
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?"
          },
          {
            "skor": 3,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan."
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana.",
            "skor": 3
          },
          {
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Menggunakan penawaran menarik dengan batas waktu atau batas ketersediaan yang jelas dan tidak dibuat-buat.",
            "skor": 4
          }
        ],
        "kategori": "Sales (Penjualan)"
      },
      {
        "skorRataRata": 2.25,
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "skor": 1,
            "jawaban": "Semuanya hanya berupa katalog jualan langsung: harga, ketersediaan, dan ajakan membeli.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?"
          },
          {
            "skor": 3,
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "skor": 3,
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas."
          },
          {
            "skor": 2,
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat."
          }
        ]
      },
      {
        "skorRataRata": 1.75,
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "skor": 3,
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu.",
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "jawaban": "Pemilik langsung mengambil beban ganda dengan bekerja jauh lebih keras dan mengorbankan waktu istirahat.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Sama sekali tidak ada; energi dan dana murni habis tersita untuk bertahan hidup menjalankan kegiatan hari ini.",
            "skor": 1
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 2,
            "jawaban": "Pemilik sering kali harus memohon secara langsung agar pelanggan bersedia mempromosikan bisnis ini ke orang lain."
          }
        ]
      }
    ]
  },
  {
    "row": 25,
    "timestamp": "27/09/2026 21:33:35",
    "namaUsaha": "Happy Food",
    "whatsapp": "81564899723",
    "totalSkor": 58,
    "poinBisaAjarkan": "Financial",
    "materiBisaAjarkan": "Pencatatan keuangan usaha UMKM, menghitung HPP dan margin, memisahkan keuangan pribadi dan usaha, mengelola arus kas, serta menggunakan data keuangan sebagai dasar pengambilan keputusan bisnis.",
    "poinPerluDipelajari": "Leadership",
    "sesi": "Sesi 2",
    "kekuatan": "Pengelolaan Keuangan Usaha",
    "kekuatanSkor": 5,
    "kelemahan": "Leadership",
    "kelemahanSkor": 2,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 4,
        "catatan": "Cuka Apel Albariqi memiliki model bisnis yang jelas, yaitu memproduksi dan menjual cuka apel berbahan sari apel Kota Batu. Target pasar meliputi konsumen yang peduli terhadap gaya hidup sehat, keluarga, wisatawan, toko oleh-oleh, reseller, retail, serta sektor kuliner dan HORECA. Penjualan dilakukan melalui kanal online dan offline."
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 4,
        "catatan": "Cuka Apel Albariqi dibuat dari sari apel melalui proses fermentasi alami dengan cita rasa asam yang lembut. Produk memiliki legalitas dan sertifikasi yang mendukung kepercayaan konsumen, serta memiliki keunikan sebagai produk cuka apel khas Kota Batu dengan kemasan yang praktis dan relatif aman untuk dibawa maupun dikirim."
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 4,
        "catatan": "Identitas merek Cuka Apel Albariqi sudah cukup kuat dan konsisten, didukung kemasan, media sosial, marketplace, serta berbagai materi promosi digital. Produk juga memiliki positioning yang jelas sebagai cuka apel dari Kota Batu."
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 5,
        "catatan": "Pengelolaan keuangan usaha sudah dilakukan dengan pencatatan penjualan, biaya produksi, HPP, dan pemisahan kebutuhan usaha dengan pribadi. Namun, sistem pencatatan dan monitoring keuangan masih terus disempurnakan agar lebih rapi dan terstruktur."
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Cuka Apel Albariqi telah memiliki legalitas dan dokumen pendukung usaha yang lengkap, termasuk NIB, BPOM, Halal, dan TKDN, sehingga mendukung kesiapan produk untuk masuk ke pasar yang lebih luas."
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Aktif mengikuti pelatihan, mentoring, program pengembangan UMKM, serta terbuka terhadap masukan dan kolaborasi. Pengembangan produk, branding, digital marketing, dan akses pasar terus dilakukan untuk meningkatkan kapasitas usaha."
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 4,
        "catatan": "Berkontribusi pada pengembangan ekonomi lokal Kota Batu melalui produk olahan apel, keterlibatan dalam ekosistem UMKM, serta promosi produk lokal. Usaha juga memiliki potensi untuk terus membuka peluang kerja dan kolaborasi dengan pelaku usaha kreatif lainnya."
      },
      {
        "kriteria": "Leadership",
        "skor": 2,
        "catatan": "Masih perlu meningkatkan kemampuan dalam membangun dan mengelola tim, mendelegasikan tugas, serta menyusun sistem kerja yang lebih terstruktur. Saat ini beberapa keputusan dan aktivitas usaha masih banyak bergantung pada pemilik, sehingga perlu penguatan leadership agar usaha dapat berkembang lebih mandiri dan berkelanjutan."
      },
      {
        "kriteria": "Operasional",
        "skor": 4,
        "catatan": "Proses produksi dan pengelolaan operasional sudah berjalan secara terstruktur dengan memperhatikan kualitas, konsistensi produk, pengemasan, dan pemenuhan standar produksi pangan. Operasional terus dikembangkan agar kapasitas produksi, efisiensi, dan distribusi dapat mengikuti pertumbuhan permintaan"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "Strategi branding dan pemasaran sudah berjalan melalui media sosial, marketplace, reseller, serta promosi offline. Namun, strategi pemasaran masih perlu dikembangkan lebih konsisten dan terukur, terutama dalam meningkatkan jangkauan pasar, efektivitas konten, dan konversi penjualan."
      },
      {
        "kriteria": "Financial",
        "skor": 5,
        "catatan": "Pengelolaan keuangan usaha sudah dilakukan melalui pencatatan penjualan, biaya produksi, HPP, dan pemantauan arus kas. Namun, sistem financial planning, analisis profitabilitas, dan monitoring arus kas masih perlu diperkuat agar pengambilan keputusan bisnis semakin terukur."
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "Produk telah memiliki penjualan melalui berbagai kanal, baik online maupun offline, serta didukung reseller dan jaringan toko. Kemampuan menjangkau pelanggan terus dikembangkan melalui perluasan distribusi dan strategi pemasaran."
      },
      {
        "kriteria": "Service",
        "skor": 3,
        "catatan": "Pelayanan pelanggan dilakukan melalui komunikasi langsung, marketplace, dan media sosial dengan mengutamakan respons yang baik dan membantu kebutuhan konsumen. Masukan dan pertanyaan pelanggan juga menjadi bahan evaluasi untuk meningkatkan kualitas pelayanan"
      },
      {
        "kriteria": "Growth",
        "skor": 3,
        "catatan": "Memiliki peluang pertumbuhan melalui perluasan distribusi, pengembangan reseller, masuk ke jaringan ritel, penguatan kanal digital, serta pengembangan inovasi produk. Pengembangan pasar terus diarahkan agar produk dapat menjangkau konsumen di lebih banyak wilayah."
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Cuka Apel Albariqi memiliki keunikan sebagai produk olahan apel dari Kota Batu dengan rasa asam yang lembut dan positioning yang jelas. Produk didukung legalitas, kemasan yang praktis dan tidak mudah pecah, serta tersedia dalam beberapa ukuran untuk memenuhi kebutuhan konsumen."
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 2.25
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 2.25,
        "rincian": [
          {
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 1,
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti."
          },
          {
            "skor": 3,
            "jawaban": "Evaluasi dan penyampaian target hanya dilakukan secara reaktif saat ada masalah atau omset turun.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 3,
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu."
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Merekrut semata-mata karena keahlian teknisnya, meski sering menimbulkan konflik internal.",
            "skor": 2
          }
        ]
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin.",
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "skor": 3
          },
          {
            "skor": 4,
            "jawaban": "Menentukan harga berdasarkan besarnya manfaat, kualitas, dan solusi yang dirasakan langsung oleh pelanggan.",
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?"
          },
          {
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "skor": 3,
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "jawaban": "Ekspansi dibiayai oleh model bisnis yang berputar sehat atau didukung oleh sistem kemitraan strategis yang minim risiko.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 5
          }
        ],
        "skorRataRata": 3.75
      },
      {
        "skorRataRata": 3.57,
        "rincian": [
          {
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "skor": 4,
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?"
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "jawaban": "Secara proaktif selalu mencari dan menguji teknologi baru (seperti otomasi atau AI) untuk menekan biaya dan melipatgandakan produktivitas."
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "jawaban": "Legalitas badan usaha sangat lengkap, tersimpan rapi, dan rutin melaporkan kewajiban pajak bisnis secara disiplin."
          },
          {
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan.",
            "skor": 4
          },
          {
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "skor": 2
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "jawaban": "Saya sendiri yang langsung melompat mengambil alih pekerjaan untuk memperbaiki kesalahan tersebut.",
            "skor": 2
          },
          {
            "skor": 3,
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?"
          }
        ],
        "kategori": "Operation (Operasional)"
      },
      {
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "jawaban": "Karena produk mampu memberikan solusi yang sangat spesifik dan relevan dengan masalah mereka."
          },
          {
            "skor": 3,
            "jawaban": "Kami fokus melayani celah pasar spesifik yang tidak digarap dengan serius oleh kompetitor besar.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "jawaban": "Mengandalkan asumsi atau perkiraan internal bahwa pasar pasti akan menyukainya."
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan kembali bertransaksi secara natural hanya jika sedang benar-benar butuh.",
            "skor": 3
          }
        ],
        "skorRataRata": 3.25,
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual."
          },
          {
            "skor": 3,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung."
          },
          {
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.",
            "skor": 3
          }
        ],
        "skorRataRata": 3,
        "kategori": "Service (Layanan)"
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.5,
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "skor": 4
          },
          {
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.",
            "skor": 3,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Dibiarkan menumpuk berantakan dalam riwayat pesan instan sehingga sulit dicari."
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal."
          }
        ]
      },
      {
        "skorRataRata": 3,
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.",
            "skor": 4
          },
          {
            "skor": 4,
            "jawaban": "Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "skor": 2,
            "jawaban": "Sering mengeluarkan uang promosi tanpa ada pencatatan yang jelas apakah iklan tersebut membuahkan hasil."
          },
          {
            "jawaban": "Cukup dikenal, namun jangkauannya hanya sebatas masyarakat di lingkungan operasional yang sangat dekat.",
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 2
          }
        ],
        "kategori": "Marketing (Pemasaran)"
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal.",
            "skor": 4,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?"
          },
          {
            "jawaban": "Pemilik langsung mengambil beban ganda dengan bekerja jauh lebih keras dan mengorbankan waktu istirahat.",
            "skor": 1,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "jawaban": "Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra.",
            "skor": 3,
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?"
          },
          {
            "jawaban": "Terjadi serba kebetulan dan pemilik tidak pernah melacak dari mana asal rekomendasi tersebut.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 1
          }
        ],
        "skorRataRata": 2.25
      }
    ]
  },
  {
    "row": 26,
    "timestamp": "27/09/2026 22:25:48",
    "namaUsaha": "Lwegitcake",
    "whatsapp": "81236692449",
    "totalSkor": 51,
    "poinBisaAjarkan": "Product",
    "materiBisaAjarkan": "Strategi closing di wa",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Kualitas & Keunikan Produk/Jasa",
    "kekuatanSkor": 5,
    "kelemahan": "Kejelasan Model Bisnis",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 3,
        "catatan": "Masih menggunakan modal pribadi"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 5,
        "catatan": "Tetap mempertahankn rasa dan menggunakan bhn2 berkualitas"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": "Masih blm optimal"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "Belum teratur dkm pencatatan"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Sudah lengkap"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 3,
        "catatan": "Siap berkolaborasi, dan mengikuti pelatihan"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 3,
        "catatan": "Siap menciptakn lapangan kerja"
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Srdang, karna madih tahap belajar"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "Sedang , karna opetasional harian sudah tertata"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "Sedang karna blm optimalkn sosmed"
      },
      {
        "kriteria": "Financial",
        "skor": 3,
        "catatan": "Sedang karna masih sering lupa dlm pencatatan keuangan"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "Sedsng , blm optimalkn medsos"
      },
      {
        "kriteria": "Service",
        "skor": 3,
        "catatan": "Sedang , karna masih bnyk perbaikan dan butuh belajar lagi"
      },
      {
        "kriteria": "Growth",
        "skor": 3,
        "catatan": "Sedang, karna situasi pasar masih sepi"
      },
      {
        "kriteria": "Product",
        "skor": 5,
        "catatan": "Kuat karna kami tttp pertahankn rasa"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 5
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.5
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4.5
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "jawaban": "Saya berfokus pada evaluasi dan strategi; operasional harian sudah berjalan sesuai panduan kerja.",
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "skor": 4
          },
          {
            "skor": 2,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "jawaban": "Saya hanya memberikan instruksi harian terkait pekerjaan yang harus diselesaikan hari ini."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku."
          }
        ],
        "skorRataRata": 3
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin."
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "skor": 3
          },
          {
            "skor": 4,
            "jawaban": "Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian.",
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?"
          },
          {
            "skor": 5,
            "jawaban": "Ekspansi dibiayai oleh model bisnis yang berputar sehat atau didukung oleh sistem kemitraan strategis yang minim risiko.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?"
          }
        ],
        "skorRataRata": 3.75
      },
      {
        "skorRataRata": 3.57,
        "kategori": "Operation (Operasional)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "skor": 4
          },
          {
            "skor": 3,
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?"
          },
          {
            "jawaban": "Legalitas badan usaha sangat lengkap, tersimpan rapi, dan rutin melaporkan kewajiban pajak bisnis secara disiplin.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 5
          },
          {
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 4,
            "jawaban": "Terkendali karena kami sudah memiliki persiapan dan sistem penambahan kapasitas (staf ekstra/alat) yang bisa langsung diaktifkan."
          },
          {
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru.",
            "skor": 2,
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?"
          },
          {
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "skor": 5,
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?"
          },
          {
            "jawaban": "Pengecekan stok atau kapasitas dilakukan secara acak hanya jika teringat atau terlihat menipis.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "skor": 2
          }
        ]
      },
      {
        "skorRataRata": 5,
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "skor": 5,
            "jawaban": "Karena produk memberikan pengalaman istimewa, nilai tambah, kebanggaan, atau transformasi yang berarti bagi mereka."
          },
          {
            "jawaban": "Produk kami memiliki karakter atau ciri khas yang sangat kuat, sehingga pelanggan merasa sulit mencari penggantinya di tempat lain.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 5
          },
          {
            "jawaban": "Menganalisa kebiasaan dan kesulitan pelanggan secara mendalam untuk menawarkan solusi yang bahkan belum mereka sadari.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "skor": 5
          },
          {
            "skor": 5,
            "jawaban": "Produk/jasa kami telah terintegrasi erat dengan aktivitas rutin pelanggan sehingga sulit bagi mereka untuk beralih.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?"
          }
        ]
      },
      {
        "skorRataRata": 4.5,
        "kategori": "Service (Layanan)",
        "rincian": [
          {
            "jawaban": "Sangat mulus dan minim hambatan; kami selalu mencari cara menyederhanakan proses bagi pelanggan.",
            "skor": 4,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 4,
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata."
          },
          {
            "jawaban": "Secara aktif menggali pendapat pelanggan secara mendalam untuk memahami kelebihan dan kekurangan bisnis kami.",
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "skor": 5
          },
          {
            "jawaban": "Konsisten memberikan nilai tambah edukasi, perhatian khusus, atau membangun komunitas di sekitar merek kami.",
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 5
          }
        ]
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4.5,
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu."
          },
          {
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "jawaban": "Mengembalikan fokus pembicaraan kepada nilai manfaat dan solusi masalah yang akan mereka peroleh.",
            "skor": 4
          },
          {
            "skor": 5,
            "jawaban": "Memiliki sistem tindak lanjut (follow-up) yang terjadwal rapi dan konsisten agar tidak ada peluang yang terlewat.",
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?"
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal."
          }
        ]
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4,
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.",
            "skor": 4
          },
          {
            "skor": 4,
            "jawaban": "Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional.",
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "skor": 3
          },
          {
            "skor": 5,
            "jawaban": "Memiliki daya pikat alami yang begitu kuat, sehingga orang-orang secara sukarela merekomendasikan dan membicarakannya.",
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?"
          }
        ]
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "skor": 5,
            "jawaban": "Terbiasa menjalankan siklus pengembangan bertahap, di mana perbaikan dilakukan terus-menerus berdasarkan respon pasar."
          },
          {
            "skor": 4,
            "jawaban": "Mampu meningkatkan kapasitas produksi dan pelayanan secara signifikan melalui perbaikan sistem tanpa melipatgandakan biaya pokok.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Secara terencana selalu menyediakan alokasi waktu dan modal khusus secara rutin demi memikirkan perbaikan bisnis ke depan.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "jawaban": "Reputasi dan kualitas produk sangat bisa diandalkan, sehingga merekomendasikannya kepada orang lain menjadi bentuk kebanggaan alami bagi pelanggan.",
            "skor": 5
          }
        ],
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4.5
      }
    ]
  },
  {
    "row": 27,
    "timestamp": "27/09/2026 22:47:26",
    "namaUsaha": "Salty Tasty By Azr Kitchen",
    "whatsapp": "81392085321",
    "totalSkor": 69,
    "poinBisaAjarkan": "Service",
    "materiBisaAjarkan": "Good Service for a Good Deals",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Kejelasan Model Bisnis",
    "kekuatanSkor": 5,
    "kelemahan": "Pengelolaan Keuangan Usaha",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 5,
        "catatan": "Usaha kami sangat jelas karena berfokus pada bidang kuliner dimsum dan bakso goreng yang sudah familiar di kalangan masyarakat"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 5,
        "catatan": "Produk kami mengusung konsep homemade dan menggunakan bahan premium & fresh. Sehingga produk kami berkualitas tinggi."
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 5,
        "catatan": "Untuk branding dan kehadiran digital kami baik. Karena identitas visual kami jelas, dan kami rajin upload konten di media sosial terutama tiktok"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "Pencatatan keuangan cukup baik, namun perlu ditingkatkan karena uang pribadi kadang tercampur untuk usaha"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": "Kami sudah memiliki NIB dan Sertifikat Halal MUI"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": "Kami terbuka untuk menerima masukan, pelatihan dan kolaborasi usahaa"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 5,
        "catatan": "Berpeluang besar dalam menciptakan lapangan kerja karena kami membutuhkan tenaga produksi, sehingga berkontribusi ke ekosistem kreatif lokal"
      },
      {
        "kriteria": "Leadership",
        "skor": 5,
        "catatan": "Karena sebelum mengambil keputusan, saya riset dulu dan meminta pendapat atas keputusan yg saya ambil agar selaras dengan visi"
      },
      {
        "kriteria": "Operasional",
        "skor": 3,
        "catatan": "Karena saat ini kami belum bisa menambah tenaga produksi, sehingga untuk operasional tidak bisa seoptimal jika ada tambahan tenaga produksi baru."
      },
      {
        "kriteria": "Marketing",
        "skor": 5,
        "catatan": "Pelanggan baru kami dapatkan dari CFD setiap minggu maupun stand, selain itu juga didapatkan dari responder konten-konten kami."
      },
      {
        "kriteria": "Financial",
        "skor": 3,
        "catatan": "Kami merasa harus dievaluasi untuk segi pencatatan keuangannya, karena kadang tercampur dengan dana pribadi."
      },
      {
        "kriteria": "Sales",
        "skor": 5,
        "catatan": "Kami melakukan follow up bagi calon pelanggan dan membantu memberikan solusi sesuai kebutuhan pelanggan."
      },
      {
        "kriteria": "Service",
        "skor": 5,
        "catatan": "Kualitas pelayanan kami sangat baik, sehingga hampir tidak ada komplain terkait pelayanan kami"
      },
      {
        "kriteria": "Growth",
        "skor": 5,
        "catatan": "Usaha kami berprogress dengan cukup baik, terlihat dari minat pelanggan dan produk kami semakin dikenal. Sehingga kami optimis bisa melakukan ekspansi yang lebih luas."
      },
      {
        "kriteria": "Product",
        "skor": 5,
        "catatan": "Prinsip kami : not only serve a good taste, but also in a good quality. Setiap produk kami kerjakan dengan teliti. Sehingga, daya saing kami cukup kuat di pasaran."
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2.75
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.43
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 4
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3.75
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4.5
      }
    ],
    "bagian3Detail": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.",
            "skor": 1
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala."
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 4,
            "jawaban": "Keputusan selalu diambil berdasarkan data angka objektif dan analisa riwayat bisnis."
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "skor": 3,
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku."
          }
        ],
        "skorRataRata": 3
      },
      {
        "rincian": [
          {
            "skor": 2,
            "jawaban": "Uang dipisah, tapi pengelolaannya serampangan; jika bisnis kekurangan uang, saya sering nombok pakai uang pribadi.",
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?"
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "skor": 3
          },
          {
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "jawaban": "Mampu membedakan dengan jelas antara omset kotor dan laba bersih tiap periode.",
            "skor": 3
          },
          {
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis.",
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 3
          }
        ],
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 2.75
      },
      {
        "skorRataRata": 3.43,
        "rincian": [
          {
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?",
            "skor": 3,
            "jawaban": "Terbuka untuk berkolaborasi jika ada pihak lain yang mengajak dan menanggung biayanya."
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "jawaban": "Terbuka belajar dan rutin menggunakan perangkat lunak digital untuk memangkas waktu kerja manual tim.",
            "skor": 4
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan."
          },
          {
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?",
            "skor": 3
          },
          {
            "jawaban": "Ada sedikit panduan tertulis secara acak, namun tidak lengkap dan jarang diperbarui.",
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "skor": 3
          },
          {
            "skor": 5,
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang.",
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?"
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "skor": 3
          }
        ],
        "kategori": "Operation (Operasional)"
      },
      {
        "rincian": [
          {
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "skor": 4,
            "jawaban": "Karena produk mampu memberikan solusi yang sangat spesifik dan relevan dengan masalah mereka."
          },
          {
            "jawaban": "Produk kami memiliki karakter atau ciri khas yang sangat kuat, sehingga pelanggan merasa sulit mencari penggantinya di tempat lain.",
            "skor": 5,
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?"
          },
          {
            "jawaban": "Mengambil keputusan berdasarkan survei kebutuhan, keluhan, dan masukan langsung dari pelanggan.",
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan menjadikan produk/jasa kami sebagai pilihan reguler dan memprioritaskannya dibanding pesaing.",
            "skor": 4
          }
        ],
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 4,
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "jawaban": "Sangat mulus dan minim hambatan; kami selalu mencari cara menyederhanakan proses bagi pelanggan."
          },
          {
            "skor": 4,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Tim terbiasa merespons dengan tenang, meminta maaf secara tulus, dan memperbaiki masalah dengan solusi nyata."
          },
          {
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "skor": 5,
            "jawaban": "Secara aktif menggali pendapat pelanggan secara mendalam untuk memahami kelebihan dan kekurangan bisnis kami."
          },
          {
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 3,
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi."
          }
        ]
      },
      {
        "skorRataRata": 3.75,
        "kategori": "Sales (Penjualan)",
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu."
          },
          {
            "skor": 3,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan."
          },
          {
            "skor": 3,
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana.",
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?"
          },
          {
            "skor": 5,
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Kesepakatan terjadi sangat alami dan mulus karena pelanggan sudah merasa cocok dan percaya sejak proses awal."
          }
        ]
      },
      {
        "skorRataRata": 3.75,
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.",
            "skor": 4
          },
          {
            "jawaban": "Porsi konten dominan pada informasi yang bermanfaat atau menghibur bagi target pasar, dan menyisipkan jualan secara proporsional.",
            "skor": 4,
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?"
          },
          {
            "jawaban": "Memiliki penawaran daya tarik khusus (seperti sampel, sesi gratis, atau materi panduan) untuk memancing kontak calon pelanggan potensial.",
            "skor": 4,
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?"
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "jawaban": "Mulai membangun gaya visual, gaya bahasa, atau ciri khas konsisten yang mudah dikenali pelanggan.",
            "skor": 3
          }
        ],
        "kategori": "Marketing (Pemasaran)"
      },
      {
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Meluncurkan versi dasar dari ide tersebut secepat mungkin ke pasar nyata untuk melihat tingkat antusiasme awal."
          },
          {
            "jawaban": "Menggunakan skema terstruktur untuk bertumbuh (seperti kemitraan, lisensi, atau perbaikan model distribusi) yang meminimalkan beban harian pemilik.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "skor": 5
          },
          {
            "jawaban": "Secara terencana selalu menyediakan alokasi waktu dan modal khusus secara rutin demi memikirkan perbaikan bisnis ke depan.",
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "skor": 4
          },
          {
            "jawaban": "Reputasi dan kualitas produk sangat bisa diandalkan, sehingga merekomendasikannya kepada orang lain menjadi bentuk kebanggaan alami bagi pelanggan.",
            "skor": 5,
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?"
          }
        ],
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 4.5
      }
    ]
  },
  {
    "row": 28,
    "timestamp": "28/09/2026 0:08:08",
    "namaUsaha": "Petite Plates",
    "whatsapp": "82229029992",
    "totalSkor": 59,
    "poinBisaAjarkan": "Operasional",
    "materiBisaAjarkan": "Sepedrinya saya masih perlu belajar",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Kejelasan Model Bisnis",
    "kekuatanSkor": 5,
    "kelemahan": "Branding & Kehadiran Digital",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": ""
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": ""
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 5,
        "catatan": ""
      },
      {
        "kriteria": "Leadership",
        "skor": 3,
        "catatan": "Saat ini kemampuan leadership hanya sebatas di tim kecil saja"
      },
      {
        "kriteria": "Operasional",
        "skor": 4,
        "catatan": "Saat stok menipis kita langsung produksi"
      },
      {
        "kriteria": "Marketing",
        "skor": 3,
        "catatan": "Belum memiliki tim marketing"
      },
      {
        "kriteria": "Financial",
        "skor": 3,
        "catatan": "Masih saya pegang sendiri"
      },
      {
        "kriteria": "Sales",
        "skor": 3,
        "catatan": "Belum memiliki tim"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Konsumen sering repeat order"
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "Memiliki banyak reseller"
      },
      {
        "kriteria": "Product",
        "skor": 4,
        "catatan": "Awalmya jarang yang jual produk kita, semakin kesini sudah banyak"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.57
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 4
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4.25
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.75
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "jawaban": "Bisnis ini adalah saya. Jika saya tidak bekerja seharian, operasional total terhenti.",
            "skor": 1,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?"
          },
          {
            "jawaban": "Kami memiliki target rutin yang jelas, terukur, dan dievaluasi bersama secara berkala.",
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "skor": 4,
            "jawaban": "Keputusan selalu diambil berdasarkan data angka objektif dan analisa riwayat bisnis."
          },
          {
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Memiliki standar rekrutmen yang jelas, menilai kecocokan sikap kerja (karakter) dan kompetensi teknis secara seimbang.",
            "skor": 4
          }
        ],
        "skorRataRata": 3.25,
        "kategori": "Leadership (Kepemimpinan)"
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?",
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin."
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?",
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "skor": 3
          },
          {
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "skor": 4,
            "jawaban": "Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian."
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 3,
            "jawaban": "Disiplin menyisihkan sebagian keuntungan yang ditahan secara terencana untuk persiapan pengembangan bisnis."
          }
        ],
        "skorRataRata": 3.25
      },
      {
        "skorRataRata": 3.57,
        "kategori": "Operation (Operasional)",
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?"
          },
          {
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "jawaban": "Secara proaktif selalu mencari dan menguji teknologi baru (seperti otomasi atau AI) untuk menekan biaya dan melipatgandakan produktivitas.",
            "skor": 5
          },
          {
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "skor": 2,
            "jawaban": "Aturan dan cara kerja diturunkan sebatas komunikasi lisan dari karyawan lama ke karyawan baru."
          },
          {
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 5,
            "jawaban": "Kami mengevaluasi celah pada sistem kerjanya, bukan sekadar menyalahkan orangnya, agar akar masalah terselesaikan dan tidak terulang."
          },
          {
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?",
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "skor": 3
          }
        ]
      },
      {
        "skorRataRata": 3.25,
        "kategori": "Product (Produk/Jasa)",
        "rincian": [
          {
            "jawaban": "Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan.",
            "skor": 3,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?"
          },
          {
            "jawaban": "Mirip, tetapi kami mencoba bersaing dengan memberikan tambahan bonus atau fitur ekstra.",
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "skor": 2
          },
          {
            "jawaban": "Menganalisa kebiasaan dan kesulitan pelanggan secara mendalam untuk menawarkan solusi yang bahkan belum mereka sadari.",
            "skor": 5,
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?"
          },
          {
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "jawaban": "Pelanggan kembali bertransaksi secara natural hanya jika sedang benar-benar butuh.",
            "skor": 3
          }
        ]
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3.25,
        "rincian": [
          {
            "jawaban": "Sangat mulus dan minim hambatan; kami selalu mencari cara menyederhanakan proses bagi pelanggan.",
            "skor": 4,
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?"
          },
          {
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan.",
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung.",
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?"
          },
          {
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi.",
            "skor": 3,
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?"
          }
        ]
      },
      {
        "skorRataRata": 4,
        "kategori": "Sales (Penjualan)",
        "rincian": [
          {
            "jawaban": "Berperan seperti konsultan; banyak mendengarkan dan menggali kebutuhan pasti mereka terlebih dahulu.",
            "skor": 4,
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?"
          },
          {
            "skor": 3,
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan.",
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?"
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Memiliki sistem tindak lanjut (follow-up) yang terjadwal rapi dan konsisten agar tidak ada peluang yang terlewat.",
            "skor": 5
          },
          {
            "jawaban": "Menggunakan penawaran menarik dengan batas waktu atau batas ketersediaan yang jelas dan tidak dibuat-buat.",
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "skor": 4
          }
        ]
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 4.25,
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Berfokus pada penyampaian solusi, tips, atau pesan edukasi yang relevan dengan kebutuhan pelanggan.",
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?"
          },
          {
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "skor": 5,
            "jawaban": "Sering membagikan ilmu atau referensi berkualitas tinggi secara gratis yang memperkuat citra profesional bisnis di industrinya."
          },
          {
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "skor": 3,
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas."
          },
          {
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?",
            "skor": 5,
            "jawaban": "Memiliki daya pikat alami yang begitu kuat, sehingga orang-orang secara sukarela merekomendasikan dan membicarakannya."
          }
        ]
      },
      {
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu."
          },
          {
            "skor": 4,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?",
            "jawaban": "Mampu meningkatkan kapasitas produksi dan pelayanan secara signifikan melalui perbaikan sistem tanpa melipatgandakan biaya pokok."
          },
          {
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?",
            "jawaban": "Semangat mencoba cara kerja yang lebih baik telah menjadi budaya tim; setiap orang didorong untuk menguji usulan ide baru.",
            "skor": 5
          },
          {
            "skor": 3,
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?"
          }
        ],
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3.75
      }
    ]
  },
  {
    "row": 29,
    "timestamp": "28/09/2026 7:31:00",
    "namaUsaha": "Binka Shop",
    "whatsapp": "81249674137",
    "totalSkor": 55,
    "poinBisaAjarkan": "Marketing",
    "materiBisaAjarkan": "Managenem produksi",
    "poinPerluDipelajari": "-",
    "sesi": "Sesi 2",
    "kekuatan": "Operasional",
    "kekuatanSkor": 5,
    "kelemahan": "Kejelasan Model Bisnis",
    "kelemahanSkor": 3,
    "rincian": [
      {
        "kriteria": "Kejelasan Model Bisnis",
        "skor": 3,
        "catatan": "Pangsa Pasar middle up"
      },
      {
        "kriteria": "Kualitas & Keunikan Produk/Jasa",
        "skor": 3,
        "catatan": "Unik"
      },
      {
        "kriteria": "Branding & Kehadiran Digital",
        "skor": 3,
        "catatan": "Masih tahap merintis"
      },
      {
        "kriteria": "Pengelolaan Keuangan Usaha",
        "skor": 3,
        "catatan": "Sdh ada sistem tapi masih perlu penguatan"
      },
      {
        "kriteria": "Legalitas & Kelengkapan Dokumen",
        "skor": 3,
        "catatan": "Untuk UMKM SDH LEGAL"
      },
      {
        "kriteria": "Kesiapan Berkolaborasi & Belajar",
        "skor": 3,
        "catatan": "Tetap upgrade"
      },
      {
        "kriteria": "Dampak & Kontribusi ke Ekosistem Kreatif",
        "skor": 3,
        "catatan": "Mendorong penguatan ekosistem dari hukum dan hioir"
      },
      {
        "kriteria": "Leadership",
        "skor": 4,
        "catatan": "Meski hanya memiliki beberapa staf namun managerial tetap diutamakan karena mereka bukan mesin tapi berusaha dijadikan bagian dari usaha sehingga ada loyalitas yg terbangun. Pelatihan"
      },
      {
        "kriteria": "Operasional",
        "skor": 5,
        "catatan": "Opearasioanal berjalan normatif sesuai jam kerja dengan 2 shift"
      },
      {
        "kriteria": "Marketing",
        "skor": 5,
        "catatan": "Direct selling dan berusaha memperkuat konten melalui sosmed"
      },
      {
        "kriteria": "Financial",
        "skor": 5,
        "catatan": "Meski masih ditopang KUR namun adh berorientasi untuk pengembangan usaha dengan skala yg lebih besar dan berusaha untuk membuka cabang"
      },
      {
        "kriteria": "Sales",
        "skor": 4,
        "catatan": "Seling cireng tapi berusaha menerapkan Markom sehingga kelangsungan usaha bisa dipertahankan dan bisa berkelanjutan"
      },
      {
        "kriteria": "Service",
        "skor": 4,
        "catatan": "Service selling dan dan service customer diupgrafe sehingga muncul loyalitas konsumrn"
      },
      {
        "kriteria": "Growth",
        "skor": 4,
        "catatan": "Pertumbuhan meningkat namun tergantung flukstisasi ekonomi"
      },
      {
        "kriteria": "Product",
        "skor": 3,
        "catatan": "Product khas dan berorientasi pasar, menjaga keseimbangan sesuai dengan target market yg dibidok"
      }
    ],
    "bagian3": [
      {
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "skorRataRata": 3.5
      },
      {
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.14
      },
      {
        "kategori": "Product (Produk/Jasa)",
        "skorRataRata": 3
      },
      {
        "kategori": "Service (Layanan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3
      },
      {
        "kategori": "Marketing (Pemasaran)",
        "skorRataRata": 3
      },
      {
        "kategori": "Growth (Pertumbuhan)",
        "skorRataRata": 3
      }
    ],
    "bagian3Detail": [
      {
        "rincian": [
          {
            "skor": 4,
            "pertanyaan": "Bagaimana peran Anda sebagai pemilik/founder dalam aktivitas harian bisnis?",
            "jawaban": "Saya berfokus pada evaluasi dan strategi; operasional harian sudah berjalan sesuai panduan kerja."
          },
          {
            "jawaban": "Evaluasi dan penyampaian target hanya dilakukan secara reaktif saat ada masalah atau omset turun.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mengkomunikasikan arah dan tujuan perusahaan kepada tim?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda membuat keputusan strategis dan krusial?",
            "jawaban": "Mulai berdiskusi dengan tim dan melihat data dasar sebelum memutuskan sesuatu."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana Anda merekrut dan membangun tim?",
            "jawaban": "Mulai mencari kecocokan karakter pekerja, tetapi proses rekrutmen belum memiliki standar baku."
          }
        ],
        "kategori": "Leadership (Kepemimpinan)",
        "skorRataRata": 3.25
      },
      {
        "kategori": "Finance (Keuangan)",
        "rincian": [
          {
            "skor": 3,
            "jawaban": "Disiplin memisahkan rekening pribadi dan bisnis, serta mengambil jatah penghasilan/gaji secara rutin.",
            "pertanyaan": "Bagaimana cara Anda mengelola uang bisnis?"
          },
          {
            "skor": 3,
            "jawaban": "Menghitung seluruh biaya modal ditambah dengan target persentase keuntungan yang wajar.",
            "pertanyaan": "Bagaimana strategi Anda dalam menentukan harga jual?"
          },
          {
            "pertanyaan": "Metrik keuangan apa yang paling sering Anda pantau?",
            "jawaban": "Rutin menganalisa mana produk yang memberi margin keuntungan terbesar dan memantau kesehatan arus kas harian.",
            "skor": 4
          },
          {
            "pertanyaan": "Bagaimana cara Anda mendanai pertumbuhan dan operasional bisnis?",
            "skor": 4,
            "jawaban": "Mampu menggunakan modal eksternal atau investasi secara aman karena memiliki proyeksi keuntungan yang jelas dan terukur."
          }
        ],
        "skorRataRata": 3.5
      },
      {
        "rincian": [
          {
            "skor": 4,
            "jawaban": "Secara rutin mencari mitra bisnis yang saling melengkapi untuk membuat promo atau produk bersama.",
            "pertanyaan": "Bagaimana sikap bisnis Anda terhadap peluang kolaborasi dengan usaha atau pihak lain?"
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara bisnis Anda merespons perkembangan teknologi alat bantu kerja terbaru?",
            "jawaban": "Mulai mencoba satu atau dua aplikasi dasar, namun penggunaannya belum maksimal."
          },
          {
            "jawaban": "Sudah memiliki perizinan dasar atas nama pribadi, seperti Nomor Induk Berusaha (NIB) perorangan.",
            "pertanyaan": "Bagaimana status perizinan dasar operasional bisnis Anda saat ini?",
            "skor": 3
          },
          {
            "jawaban": "Sedikit tersendat, tetapi perlahan bisa diatasi dengan tenaga manual ekstra atau tambahan jam kerja.",
            "skor": 3,
            "pertanyaan": "Jika pesanan melonjak 3 kali lipat hari ini, apa yang terjadi?"
          },
          {
            "pertanyaan": "Bagaimana cara kerja dan pengetahuan operasional bisnis disimpan?",
            "jawaban": "Ada sedikit panduan tertulis secara acak, namun tidak lengkap dan jarang diperbarui.",
            "skor": 3
          },
          {
            "jawaban": "Karyawan diminta segera memperbaiki kesalahan saat itu juga tanpa ada evaluasi lanjutan.",
            "pertanyaan": "Bagaimana Anda menangani kesalahan kerja atau kegagalan pelayanan?",
            "skor": 3
          },
          {
            "skor": 3,
            "jawaban": "Melakukan pembaruan data stok atau evaluasi kapasitas secara berkala dan terjadwal.",
            "pertanyaan": "Bagaimana Anda mengelola ketersediaan bahan atau kapasitas kerja?"
          }
        ],
        "kategori": "Operation (Operasional)",
        "skorRataRata": 3.14
      },
      {
        "rincian": [
          {
            "skor": 3,
            "pertanyaan": "Mengapa mayoritas pelanggan memutuskan membeli produk/jasa Anda?",
            "jawaban": "Karena produknya memenuhi fungsi dasar yang memang mereka butuhkan."
          },
          {
            "pertanyaan": "Bagaimana posisi produk/jasa Anda jika disandingkan dengan kompetitor?",
            "jawaban": "Kami fokus melayani celah pasar spesifik yang tidak digarap dengan serius oleh kompetitor besar.",
            "skor": 3
          },
          {
            "jawaban": "Mengandalkan asumsi atau perkiraan internal bahwa pasar pasti akan menyukainya.",
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menentukan produk, layanan, atau ide baru yang akan dijual?"
          },
          {
            "jawaban": "Pelanggan kembali bertransaksi secara natural hanya jika sedang benar-benar butuh.",
            "pertanyaan": "Bagaimana pola pembelian kembali (Retensi) produk/jasa Anda?",
            "skor": 3
          }
        ],
        "skorRataRata": 3,
        "kategori": "Product (Produk/Jasa)"
      },
      {
        "rincian": [
          {
            "pertanyaan": "Bagaimana proses yang dilalui pelanggan dari awal bertanya hingga selesai bertransaksi?",
            "skor": 3,
            "jawaban": "Proses cukup rapi dan terarah, meski ada beberapa tahapan yang masih serba manual."
          },
          {
            "skor": 3,
            "pertanyaan": "Ketika ada pelanggan komplain keras karena kekecewaan, apa reaksi pihak Anda?",
            "jawaban": "Saya sebagai pemilik harus turun tangan sendiri untuk menenangkan dan menyelesaikan masalah pelanggan."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda menampung umpan balik (Feedback) dari pelanggan?",
            "jawaban": "Sesekali menanyakan kepuasan pelanggan secara lisan jika sempat berinteraksi langsung."
          },
          {
            "pertanyaan": "Tindakan apa yang Anda lakukan untuk merawat pelanggan setelah transaksi selesai (Purna Jual)?",
            "skor": 3,
            "jawaban": "Sesekali menyapa pelanggan lama untuk sekadar mengirimkan informasi penawaran promosi."
          }
        ],
        "skorRataRata": 3,
        "kategori": "Service (Layanan)"
      },
      {
        "rincian": [
          {
            "pertanyaan": "Saat prospek (calon pelanggan) mulai bertanya, bagaimana pola pendekatan Anda?",
            "skor": 3,
            "jawaban": "Menjawab secara kaku dan seadanya, murni sebatas apa yang mereka tanyakan."
          },
          {
            "skor": 3,
            "pertanyaan": "Ketika calon pelanggan keberatan dan mengatakan \"Harganya mahal\", apa respons Anda?",
            "jawaban": "Tetap tenang dan mulai menjabarkan rincian keuntungan spesifikasi agar harga terlihat sepadan."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana cara Anda mendata calon pelanggan yang menaruh minat tapi belum jadi membeli?",
            "jawaban": "Mulai mencatat kontak mereka di buku atau lembar kerja digital secara sederhana."
          },
          {
            "pertanyaan": "Bagaimana proses penutupan (Closing) atau kesepakatan akhir biasa terjadi?",
            "jawaban": "Perlu proses menagih atau mengingatkan pelanggan berkali-kali hingga akhirnya transaksi terjadi.",
            "skor": 3
          }
        ],
        "kategori": "Sales (Penjualan)",
        "skorRataRata": 3
      },
      {
        "skorRataRata": 3,
        "kategori": "Marketing (Pemasaran)",
        "rincian": [
          {
            "pertanyaan": "Apa fokus utama dari pesan promosi atau konten yang Anda publikasikan?",
            "skor": 3,
            "jawaban": "Fokus utama hanya memancing perhatian lewat informasi undian berhadiah, diskon, atau promo murah."
          },
          {
            "skor": 3,
            "pertanyaan": "Bagaimana variasi jenis konten pemasaran yang diproduksi?",
            "jawaban": "Konten dibuat campur aduk tanpa tema yang jelas asalkan akun terlihat rajin memposting."
          },
          {
            "jawaban": "Aktif melakukan pergerakan menjemput bola secara fisik, seperti sebar brosur, ikut bazar, atau mendatangi komunitas.",
            "pertanyaan": "Bagaimana strategi Anda dalam mendatangkan calon pelanggan baru (Akuisisi)?",
            "skor": 3
          },
          {
            "jawaban": "Mulai membangun gaya visual, gaya bahasa, atau ciri khas konsisten yang mudah dikenali pelanggan.",
            "skor": 3,
            "pertanyaan": "Seberapa kuat daya ingat masyarakat terhadap merek Anda?"
          }
        ]
      },
      {
        "skorRataRata": 3,
        "kategori": "Growth (Pertumbuhan)",
        "rincian": [
          {
            "pertanyaan": "Bagaimana pendekatan Anda saat mengeksekusi ide inovasi baru?",
            "skor": 3,
            "jawaban": "Mencoba memvalidasi ide dengan menawarkannya dalam skala kecil kepada kelompok terdekat terlebih dahulu."
          },
          {
            "skor": 3,
            "jawaban": "Mencoba berekspansi atau membuka titik baru yang seluruh modal, waktu, dan pengelolaannya ditanggung mandiri oleh pemilik.",
            "pertanyaan": "Bagaimana cara bisnis Anda merespons peluang perluasan usaha (Ekspansi)?"
          },
          {
            "jawaban": "Pengembangan dicoba sesekali hanya ketika kebetulan ada sisa waktu luang atau keuntungan ekstra.",
            "skor": 3,
            "pertanyaan": "Bagaimana pengelolaan fokus atau alokasi sumber daya untuk inovasi bisnis?"
          },
          {
            "jawaban": "Mulai memberikan imbalan atau ucapan terima kasih secara spontan kepada pihak yang ketahuan merekomendasikan bisnis.",
            "pertanyaan": "Bagaimana strategi merekomendasikan ulang (Referral) bekerja di dalam bisnis Anda?",
            "skor": 3
          }
        ]
      }
    ]
  }
];

export const INITIAL_KEHADIRAN: KehadiranItem[] = [];
