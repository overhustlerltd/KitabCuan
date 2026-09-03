export const SITE_CONFIG = {
  name: "KitabCuan",
  nameParts: { first: "Kitab", second: "Cuan" },
  tagline: "Resep cuan dari dapur rumahmu",
  description:
    "KitabCuan adalah panduan digital lengkap buat kamu yang mau hasilkan uang dari masak-masakan di rumah — mulai dari pilih menu yang laku, hitung HPP, sampai promosi di medsos, semua dibedah tuntas dengan tools AI pendamping.",
};

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Isi Kitab", href: "/#isi-kitab" },
  { label: "Bonus", href: "/#bonus" },
  { label: "Harga", href: "/#harga" },
  { label: "FAQ", href: "/#faq" },
];

export const TOOLS_NAV_LINK: NavLink = { label: "Tools AI Dapur", href: "/tools" };

export const FOOTER_LINK_GROUPS: { title: string; links: NavLink[] }[] = [
  {
    title: "Kitab",
    links: [
      { label: "Isi Kitab", href: "/#isi-kitab" },
      { label: "Harga", href: "/#harga" },
      { label: "Tools AI Dapur", href: "/tools" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "#" },
      { label: "Blog Resep Cuan", href: "#" },
      { label: "Komunitas", href: "#" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Pusat Bantuan", href: "#" },
      { label: "Kontak", href: "#" },
    ],
  },
];

export type SocialLink = {
  label: string;
  href: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Website", href: "https://dapurcuan.com" },
  { label: "Email", href: "#" },
  { label: "Komunitas", href: "#" },
  { label: "Bagikan", href: "#" },
];

export const HERO_CONTENT = {
  eyebrow: "🔥 KHUSUS KAMU YANG MAU MULAI USAHA TANPA HARUS MODAL BESAR",
  headlineLine1: "Bangun Bisnis dari Nol Sampai Punya",
  headlineLine2: "Sistem yang Menghasilkan Jutaan Rupiah",
  subheadlineLead:
    "Tanpa harus sewa toko, punya karyawan, atau keluar modal puluhan juta!",
  subheadline:
    "Dapatkan 100+ ide bisnis + sistem jualan + strategi marketing + tools bisnis dan panduan lengkap, yang bisa langsung kamu gunakan untuk mulai membangun usaha dari rumah.",
  primaryCta: { label: "💰 SAYA MAU PUNYA SUMBER CUAN", href: "#order" },
  secondaryCta: { label: "Intip Isi Kitab", href: "#produk" },
  socialProofCount: "3.200+",
  socialProofLabel: "orang sudah mulai cuan dari paket ini",
  bookTitleTop: "KITAB",
  bookTitleBottom: "CUAN",
  bookEdition: "Resep Bisnis Dapur",
  statCardLabel: "Omzet bulan ini",
  statCardValue: "Rp6.750.000",
  chapterCardLabel: "Total bab",
  chapterCardValue: "10 Bab",
};

export type IconName =
  | "Compass"
  | "ShieldAlert"
  | "Wallet"
  | "Clock"
  | "Users"
  | "GraduationCap"
  | "Map"
  | "Smartphone"
  | "PackageCheck"
  | "BookOpen"
  | "LayoutTemplate"
  | "Lightbulb"
  | "Calculator"
  | "Image"
  | "FileText"
  | "MessageSquareText"
  | "Landmark"
  | "QrCode"
  | "CreditCard"
  | "ClipboardList"
  | "PenLine"
  | "Tag"
  | "MessageCircle"
  | "ChefHat"
  | "UtensilsCrossed"
  | "Flame";

export const PAIN_POINTS_CONTENT = {
  headline: "MAU CUAN, TAPI BINGUNG MULAI DARI MANA?",
  points: [
    "Pengen bisnis, tapi nggak tahu mau jual apa.",
    "Punya ide, tapi nggak tahu cara mulai.",
    "Takut keluar modal tapi ternyata nggak laku.",
    "Sudah coba jualan, tapi bingung cara marketingnya.",
    "Mau bikin konten, tapi setiap hari kehabisan ide.",
  ],
  closing: "Sekarang, semuanya ada dalam satu paket.",
};

export const SOLUTION_CONTENT = {
  headline: "Kenapa Banyak Orang Gagal Mulai Bisnis? 💡",
  intro:
    "Karena mereka mencoba membangun sesuatu yang besar tanpa punya sistem yang jelas.",
  struggles: [
    "Mencari ide sendiri.",
    "Belajar dari banyak tempat.",
    "Mencoba banyak strategi.",
    "Dan sering kali berhenti sebelum melihat hasilnya.",
  ],
  pivotLabel: "Sekarang?",
  pivot: "Kamu tidak perlu lagi melewati proses itu sendirian.",
  body:
    "KitabCuan membantu menyederhanakan perjalanan membangun bisnis, dari bingung menjadi punya arah, dari rencana menjadi aksi.",
  transforms: [
    { from: "Bingung", to: "Punya arah" },
    { from: "Rencana", to: "Aksi" },
  ],
  closing: "Bisnis yang dulu terasa rumit... sekarang bisa dimulai dengan lebih mudah.",
  ctaLabel: "📕 DAPATKAN KITABCUAN SEKARANG",
  ctaHref: "#order",
};

export const WHY_NOW_CONTENT = {
  headline: "Kenapa Sekarang Waktu Terbaik Jualan Makanan Rumahan",
  subheadline:
    "Tren makanan rumahan makin booming. Yang dulu butuh toko fisik, sekarang bisa jualan dari dapur sendiri lewat HP.",
  before: {
    title: "Dulu",
    points: [
      "Harus sewa tempat, beli peralatan lengkap dulu baru bisa jualan",
      "Belajar sendiri soal harga dan promosi sambil nabrak-nabrak",
      "Butuh koneksi banyak dan lokasi strategis biar dilirik pembeli",
    ],
  },
  after: {
    title: "Sekarang",
    points: [
      "Modal peralatan dapur yang sudah ada, langsung bisa mulai",
      "Panduan HPP, harga jual, dan strategi promosi sudah dipetakan",
      "Pembeli ada di WhatsApp dan Instagram, tinggal foto dan posting",
    ],
  },
  checklist: [
    {
      icon: "GraduationCap" as IconName,
      title: "Tanpa Pengalaman Bisnis F&B",
      description: "Bahasanya sehari-hari dan dijelasin dari paling dasar, bukan bahasa koki profesional.",
    },
    {
      icon: "Map" as IconName,
      title: "Tanpa Nebak-Nebak Harga",
      description: "Kalkulator HPP otomatis bantu kamu hitung harga jual yang pas — untung dan tetap laku.",
    },
    {
      icon: "Smartphone" as IconName,
      title: "Cukup Dapur dan HP",
      description: "Hampir semua praktiknya bisa dikerjain langsung dari dapur dan genggaman kamu.",
    },
  ],
  highlight: {
    icon: "PackageCheck" as IconName,
    title: "Semuanya Udah Diracik Jadi Satu",
    description:
      "Kamu nggak perlu ngumpulin info dari mana-mana lagi. Dari pilih menu, hitung modal, sampai cara promosi — semua urutannya rapi dalam satu panduan.",
  },
};

export const AUDIENCE_CONTENT = {
  headline: "KITABCUAN DIBUAT UNTUK KAMU",
  subheadline: "Apa pun titik mulaimu, panduannya menyesuaikan.",
  items: [
    {
      emoji: "👩🏻",
      title: "Ibu Rumah Tangga",
      description: "Ingin punya penghasilan tambahan dari rumah tanpa harus meninggalkan keluarga.",
    },
    {
      emoji: "💼",
      title: "Karyawan",
      description: "Ingin membangun side business sambil tetap menjalankan pekerjaan utama.",
    },
    {
      emoji: "🎓",
      title: "Mahasiswa & Anak Muda",
      description: "Ingin mulai belajar bisnis dan menghasilkan dengan modal yang lebih terjangkau.",
    },
    {
      emoji: "💡",
      title: "Pemula",
      description: "Belum pernah punya bisnis dan benar-benar nggak tahu harus mulai dari mana.",
    },
  ],
};

export const BRIDGE_CONTENT = {
  headline: "SEMUA SUDAH KAMI SIAPKAN ❗",
  body: "Kami sudah menyusun panduan, strategi, dan tools bisnis yang kamu butuhkan dalam satu paket lengkap untuk membantu kamu mulai dan mengembangkan bisnis.",
  highlight: "TIDAK PERLU MULAI DARI NOL",
};

export const PRODUCT_REVEAL_CONTENT = {
  eyebrow: "Paket Usaha Sumber Cuan",
  headline: "APA SAJA YANG AKAN KAMU DAPATKAN?",
  core: [
    {
      emoji: "💡",
      title: "100+ Ide Bisnis Potensial",
      description: "Berbagai ide usaha yang bisa kamu pilih sesuai minat, modal, dan peluang pasar.",
    },
    {
      emoji: "📕",
      title: "Panduan Lengkap Memulai Bisnis",
      description: "Langkah-langkah praktis untuk membantu kamu mulai dari mencari ide sampai menjalankan bisnis.",
    },
    {
      emoji: "🚀",
      title: "Sistem Bisnis Siap Pakai",
      description: "Panduan, strategi, dan cara kerja bisnis yang bisa langsung kamu pelajari dan praktikkan.",
    },
  ],
  bonusTitle: "BONUS EKSKLUSIF",
  bonusValueNote: "Senilai Rp2.000.000+",
  bonuses: [
    {
      title: "Strategi Marketing & Branding",
      description: "Cara membuat bisnis lebih dikenal, menarik customer, dan membangun brand yang kuat.",
      value: "Rp300rb",
    },
    {
      title: "48+ Template Desain Marketing",
      description: "Template siap edit untuk kebutuhan promosi, konten sosial media, banner, dan materi jualan.",
      value: "Rp350rb",
    },
    {
      title: "Panduan Jualan Online",
      description: "Pelajari cara memasarkan produk melalui marketplace dan platform online.",
      value: "Rp200rb",
    },
    {
      title: "Template Keuangan Bisnis",
      description: "Bantu mencatat pemasukan, pengeluaran, modal, dan menghitung keuntungan bisnis.",
      value: "Rp250rb",
    },
    {
      title: "Kalkulator Simulasi Profit",
      description: "Hitung perkiraan modal, omzet, dan keuntungan sebelum menjalankan bisnis.",
      value: "Rp197rb",
    },
    {
      title: "AI Tools Untuk Bisnis",
      description: "Gunakan AI untuk membantu mencari ide, membuat konten, dan mempercepat pekerjaan bisnis.",
      value: "Rp500rb",
    },
    {
      title: "Kumpulan Resource Bisnis",
      description: "Berbagai tambahan tools dan materi pendukung untuk membantu perjalanan bisnis kamu.",
      value: "Rp200rb",
    },
  ],
  totalLabel: "TOTAL NILAI SEMUA YANG KAMU DAPATKAN",
  totalValue: "Rp3.000.000+",
  todayLabel: "HARGA SPESIAL KHUSUS HARI INI",
  priceLead: "Kamu tidak perlu membayar jutaan rupiah untuk mendapatkan semuanya. Hari ini, cukup:",
  promoPrice: "Rp297.000",
  ctaLabel: "📦 DAPATKAN KITABCUAN SEKARANG",
  ctaHref: "#order",
};

export const IMAGINE_CONTENT = {
  headline: "Bayangin Kalau Mulai Bisnis Jadi Semudah Ini…",
  steps: [
    {
      emoji: "🌅",
      time: "Pagi",
      seg: [
        { t: "Kamu buka KitabCuan", b: true },
        { t: " dan sudah tahu apa yang harus dilakukan hari ini." },
      ],
    },
    {
      emoji: "💡",
      seg: [
        { t: "Kamu menemukan " },
        { t: "ide bisnis yang cocok", b: true },
        { t: ", lalu mulai menyusun produk dan strategi tanpa harus menebak-nebak dari nol." },
      ],
    },
    {
      emoji: "📱",
      time: "Siang",
      seg: [
        { t: "Kamu mulai " },
        { t: "promosi, membuat konten, dan menawarkan produk", b: true },
        { t: " dengan bantuan tools yang sudah disiapkan." },
      ],
    },
    {
      emoji: "💰",
      seg: [
        { t: "Perlahan, " },
        { t: "order pertama mulai masuk.", b: true },
        { t: " Lalu repeat order. Lalu pelanggan baru." },
      ],
    },
    {
      emoji: "🔄",
      time: "Besoknya",
      seg: [
        { t: "Kamu tinggal " },
        { t: "evaluasi, perbaiki, dan kembangkan", b: true },
        { t: " apa yang sudah berjalan." },
      ],
    },
  ],
  reassure:
    "Semua bisa dimulai dari rumah, sambil kerja, kuliah, atau menjalankan aktivitasmu sehari-hari.",
  withouts: [
    "Tanpa harus punya pengalaman bisnis bertahun-tahun",
    "Tanpa harus langsung mengeluarkan modal besar",
    "Tanpa harus bingung mencari semuanya sendiri",
  ],
  closingTitle: "🚀 INI BUKAN SEKADAR PANDUAN BISNIS.",
  closingBody:
    "KitabCuan dirancang untuk membantu kamu menemukan ide, mulai berjualan, dan membangun sumber penghasilan dari bisnis.",
  fomoLead:
    "Sudah banyak yang menggunakannya untuk mulai membangun penghasilan tambahan, bahkan dengan hasil hingga",
  fomoHighlight: "Rp20 juta+ / bulan",
  transition: "Dan sekarang…",
  finalLine: "💚 Giliran kamu mulai membangun cuanmu sendiri.",
  ctaLabel: "📦 DAPATKAN KITABCUAN SEKARANG",
  ctaHref: "#order",
};

export const MAIN_REASON_CONTENT = {
  headline: "Kenapa Harus Ambil KitabCuan Sekarang?",
  reasons: [
    {
      emoji: "🛠️",
      title: "Bukan Sekadar E-Book Teori",
      description: "KitabCuan berisi panduan, tools, dan template praktis yang bisa langsung kamu gunakan untuk membangun bisnis.",
    },
    {
      emoji: "⏱️",
      title: "Hemat Waktu & Hindari Trial Error",
      description: "Tidak perlu menghabiskan waktu mencari informasi dari banyak tempat. Semua sudah dirangkum dalam satu paket lengkap.",
    },
    {
      emoji: "💎",
      title: "Value Besar Dengan Harga Terjangkau",
      description: "Dapatkan berbagai resource bisnis senilai jutaan rupiah tanpa harus membeli semuanya satu per satu.",
    },
  ],
};

export const PRODUCT_CONTENTS_CONTENT = {
  headline: "Apa Aja yang Ada di Dalam Panduan",
  subheadline:
    "Bukan resep masak biasa. Ini panduan bisnis kuliner rumahan yang nemenin kamu dari bahan baku sampai pelanggan pertama.",
  items: [
    {
      icon: "BookOpen" as IconName,
      value: "10",
      label: "Bab panduan bertahap mulai dari nol",
    },
    {
      icon: "LayoutTemplate" as IconName,
      value: "30+",
      label: "Template caption & foto produk siap pakai",
    },
    {
      icon: "Lightbulb" as IconName,
      value: "6",
      label: "Studi kasus dapur rumahan yang sukses cuan",
    },
    {
      icon: "Calculator" as IconName,
      value: "1",
      label: "Kalkulator HPP & harga jual otomatis",
    },
  ],
};

export const BONUS_CONTENT = {
  eyebrow: "Bonus Eksklusif",
  headline: "Nggak Cuma Panduannya, Ini Ikut Kamu Bawa Pulang",
  subheadline: "Semua bonus di bawah otomatis masuk begitu kamu ambil panduannya hari ini.",
  items: [
    {
      icon: "Users" as IconName,
      title: "Grup diskusi pejuang dapur cuan",
      value: "Rp150.000",
    },
    {
      icon: "FileText" as IconName,
      title: "50+ template caption & foto makanan",
      value: "Rp100.000",
    },
    {
      icon: "Image" as IconName,
      title: "Panduan foto makanan yang menggoda selera",
      value: "Rp75.000",
    },
    {
      icon: "MessageSquareText" as IconName,
      title: "Sesi tanya jawab live resep & strategi jualan",
      value: "Rp200.000",
    },
  ],
  totalLabel: "Total Nilai Bonus",
  totalValue: "Rp525.000",
  totalNote: "Gratis, nggak nambah biaya sepeser pun.",
};

export const PRICING_CONTENT = {
  urgencyBadge: "🔥 DISKON 75% — KHUSUS HARI INI",
  discountTag: "SAVINGS 75%",
  savingsText: "HEMAT Rp891.000",
  title: "Paket KitabCuan Resep Dapur",
  description: "Kitab utama, seluruh template, kalkulator HPP, plus semua bonusnya. Sekali bayar, punya selamanya.",
  originalPrice: "Rp1.188.000",
  promoPrice: "Rp297.000",
  priceNote: "Sekali bayar. Nggak ada biaya bulanan.",
  benefits: [
    "Akses seumur hidup ke seluruh isi kitab",
    "10 bab panduan bisnis kuliner rumahan dari nol",
    "30+ template caption & foto makanan siap pakai",
    "Kalkulator HPP dan harga jual otomatis",
    "Tools AI Dapur eksklusif (rencana menu, promosi, nama brand)",
    "Seluruh bonus eksklusif senilai Rp525.000",
    "Update edisi baru, gratis selamanya",
  ],
  ctaLabel: "AMBIL DISKON Rp297.000 SEKARANG",
  ctaHref: "#order",
  footnote: "Sekali bayar. Nggak ada biaya langganan tersembunyi.",
};

export type FaqItem = { question: string; answer: string };

export const FAQ_CONTENT = {
  headline: "Pertanyaan yang Sering Ditanyakan",
  subheadline: "Kalau masih ada yang mengganjal, mudah-mudahan sudah terjawab di sini.",
  items: [
    {
      question: "Aku bisa masak tapi nggak punya pengalaman bisnis, cocok nggak?",
      answer:
        "Justru kamu yang paling disasar. Panduan ini dimulai dari titik paling awal, dari cara pilih menu yang laku sampai cara dapat pembeli pertama, semuanya dijelaskan step by step tanpa asumsi kamu sudah paham bisnis.",
    },
    {
      question: "Butuh modal berapa buat mulai jualan makanan rumahan?",
      answer:
        "Banyak menu yang bisa dimulai dengan modal Rp100.000–300.000 saja. Di panduan ada kalkulator HPP yang bantu kamu hitung modal dan harga jual yang pas, jadi kamu tahu persis berapa yang dibutuhkan sebelum mulai.",
    },
    {
      question: "Aksesnya berlaku sampai kapan?",
      answer:
        "Selamanya, cukup sekali bayar. Kalau nanti ada edisi atau materi tambahan tentang tren kuliner terbaru, kamu otomatis dapat tanpa perlu bayar lagi.",
    },
    {
      question: "Bedanya apa sama konten memasak gratis di YouTube atau Instagram?",
      answer:
        "Konten gratis biasanya fokus pada resep, bukan bisnis. Di sini kamu dapat panduan lengkap soal hitung HPP, strategi harga, cara foto makanan yang menggoda, sampai cara jualan di medsos, semuanya dalam satu alur yang rapi.",
    },
    {
      question: "Panduannya dikirim gimana? Ada buku fisiknya?",
      answer:
        "Semuanya berbentuk digital dan langsung bisa dibuka begitu pembayaran dikonfirmasi. Nggak perlu tunggu paket, bisa langsung baca hari itu juga dari HP, laptop, atau tablet kamu.",
    },
  ] as FaqItem[],
};

export const FINAL_OFFER_CONTENT = {
  badge: "🔴 KESEMPATAN TERAKHIR",
  headline: "JANGAN HABISKAN JUTAAN RUPIAH UNTUK MULAI BISNIS DARI NOL",
  painIntro: "Banyak orang ingin mulai bisnis, tapi akhirnya menghabiskan banyak uang untuk:",
  pains: [
    "Membeli berbagai kelas bisnis yang mahal",
    "Menggunakan tools yang harus dibayar satu per satu",
    "Mencoba strategi yang belum tentu berhasil",
    "Trial & error tanpa tahu langkah yang tepat",
  ],
  painClosing:
    "Dan yang paling mahal… adalah waktu yang terbuang karena tidak memiliki panduan yang jelas.",
  pivot: "TAPI SEKARANG…",
  pivotBody:
    "Kamu bisa mendapatkan akses dengan total value jutaan rupiah tanpa harus mengeluarkan modal besar di awal.",
  valueLabel: "Dengan seluruh isi paket:",
  valueAmount: "Rp3.000.000+",
  valueTag: "VALUE",
  valueNote: "Kamu tidak perlu membeli semuanya satu per satu.",
  todayLabel: "KHUSUS HARI INI…",
  todayOriginal: "Rp2.475.000",
  todayPrice: "Rp297.000",
  todayDiscount: "DISKON 88%",
  imagine:
    "Bayangkan… dengan modal kurang dari Rp300 ribu, kamu sudah memiliki bekal lengkap untuk mulai membangun bisnis dan membuka peluang menghasilkan jutaan rupiah setiap bulannya.",
  earlyBadge: "🎁 KHUSUS 50 PEMBELI PERTAMA HARI INI",
  earlyLabel: "Bisa mendapatkan harga spesial:",
  earlyPrice: "Rp197.000",
  earlyBonusLabel: "Dengan bonus tambahan:",
  earlyBonuses: [
    { icon: "✅", text: "Akses KitabCuan Selamanya" },
    { icon: "🎁", text: "BONUS Template Keuangan Bisnis" },
    { icon: "🎁", text: "BONUS Template Marketing Premium" },
    { icon: "🎁", text: "FREE Update & Resource Tambahan" },
  ],
  warningLabel: "⚠️ INGAT!",
  warning:
    "Harga promo Rp197.000 akan kembali menjadi Rp297.000 setelah 50 pembeli pertama terpenuhi. Karena kami ingin memberikan harga terbaik untuk orang-orang yang benar-benar siap mengambil langkah pertama.",
  urgency:
    "Semakin lama kamu menunda, semakin lama kamu berada di titik yang sama. Sementara orang lain sudah mulai belajar, mencoba, dan membangun bisnis mereka lebih dulu.",
  promoCtaLabel: "AMBIL PROMO SPESIAL INI SEBELUM KEHABISAN",
  countdownHours: 6,
  ctaLabel: "📦 DAPATKAN KITABCUAN SEKARANG",
  ctaHref: "#order",
};

export const FINAL_CTA_CONTENT = {
  eyebrow: "⚡ HARI INI DISKON 75%",
  headline: "Jangan Sampai Dapur Kamu Cuma Jadi Tempat Masak",
  description:
    "Harga hemat Rp297.000 (Diskon 75%) cuma berlaku selama kuota gelombang ini masih tersedia.",
  priceRecapLabel: "Harga Spesial Hari Ini",
  savingsBadge: "HEMAT Rp891.000",
  promoPrice: "Rp297.000",
  originalPrice: "Rp1.188.000",
  ctaLabel: "AMBIL PANDUAN (RP297.000)",
  ctaHref: "#order",
};

export const TESTIMONIALS_CONTENT = {
  eyebrow: "💬 Buktinya? Kata Mereka.",
  headline: "Cerita dari yang sudah pakai KitabCuan",
  images: [
    "/testimonials/1.png",
    "/testimonials/2.png",
    "/testimonials/3.png",
    "/testimonials/4.png",
    "/testimonials/5.png",
    "/testimonials/6.png",
    "/testimonials/7.png",
  ],
};

export type PaymentMethod = { value: string; label: string; icon: IconName };

export const ORDER_FORM_CONTENT = {
  headline: "Amankan Kitabmu Sekarang",
  description: "Isi datanya, kami kirim akses kitabnya begitu pembayaran dikonfirmasi.",
  paymentMethods: [
    { value: "bca", label: "Bank Central Asia" },
    { value: "qris", label: "QRIS" },
    { value: "bri", label: "BRI Virtual Account" },
    { value: "mandiri", label: "Bank Mandiri Virtual Account" },
    { value: "bni", label: "BNI Virtual Account" },
    { value: "dana", label: "Dana" },
    { value: "shopeepay", label: "ShopeePay" },
    { value: "gopay", label: "GoPay" },
  ],
  summaryTitle: "Rincian Pesanan",
  summaryItems: [
    { label: "Paket Usaha Sumber Cuan", note: "Akses selamanya + semua bonus", value: "Rp497.000", isDiscount: false },
    { label: "Diskon Spesial Hari Ini", note: "", value: "-Rp300.000", isDiscount: true },
  ],
  totalLabel: "Total Bayar",
  totalValue: "Rp197.000",
  submitLabel: "Kirim & Amankan Kitab",
  successMessage:
    "Pendaftaran berhasil! Tim kami akan menghubungi kamu lewat WhatsApp untuk konfirmasi pembayaran dan kirim akses kitabnya.",
};

export type ToolTab = {
  value: string;
  label: string;
  icon: IconName;
  cardTitle: string;
  cardDescription: string;
};

export const TOOLS_PAGE_CONTENT = {
  badge: "Tools AI Dapur Eksklusif",
  title: "Tools AI Pendamping KitabCuan",
  subtitle:
    "Lima asisten AI khusus bisnis kuliner rumahan — bantu kamu susun rencana menu, hitung HPP, bikin caption makanan, cari nama brand, sampai tanya langsung ke mentor dapur.",
  backLabel: "Kembali ke Beranda",
  tabs: [
    {
      value: "rencana-menu",
      label: "Rencana Menu",
      icon: "ClipboardList" as IconName,
      cardTitle: "Susun Rencana Menu Jualan 7 Hari",
      cardDescription: "Isi form di bawah, biar AI susunin menu harian yang laku dan cocok buat dapurmu.",
    },
    {
      value: "kalkulator-hpp",
      label: "Kalkulator HPP",
      icon: "Calculator" as IconName,
      cardTitle: "Hitung HPP & Harga Jual yang Pas",
      cardDescription: "Masukkan bahan-bahan dan biaya operasional, AI bantu hitung harga jual yang untung dan tetap kompetitif.",
    },
    {
      value: "tulisan-promosi",
      label: "Caption Makanan",
      icon: "PenLine" as IconName,
      cardTitle: "Bikin Caption Makanan yang Menggoda",
      cardDescription: "Caption Instagram, status WA, sampai template chat pembeli — semua otomatis dibuatkan.",
    },
    {
      value: "nama-brand",
      label: "Nama Brand",
      icon: "Tag" as IconName,
      cardTitle: "Cari Nama Brand Kuliner yang Nempel",
      cardDescription: "Bingung mau kasih nama apa buat usaha masakanmu? Biar AI kasih beberapa pilihan plus taglinenya.",
    },
    {
      value: "tanya-mentor",
      label: "Tanya Mentor",
      icon: "MessageCircle" as IconName,
      cardTitle: "Tanya Langsung ke Mentor Dapur AI",
      cardDescription: "Tanya apa aja soal modal, resep yang laku, strategi harga, atau cara promosi makanan rumahan.",
    },
  ] as ToolTab[],
};
