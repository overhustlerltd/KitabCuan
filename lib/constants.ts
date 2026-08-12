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
  eyebrow: "Panduan Digital Bisnis Kuliner Rumahan",
  headlineLine1: "Resep Cuan dari",
  headlineLine2: "Dapur Rumahmu",
  subheadline:
    "Panduan buat kamu yang pengen hasilkan uang dari masak-masakan — dari pilih menu yang laku, hitung HPP, sampai dapat pelanggan pertama lewat WhatsApp dan Instagram.",
  primaryCta: { label: "Ambil Kitabnya", href: "/#harga" },
  secondaryCta: { label: "Intip Isi Kitab", href: "/#isi-kitab" },
  socialProofCount: "3.200+",
  socialProofLabel: "penjual makanan rumahan sudah mulai cuan",
  socialProofNote: "Disusun dari praktik nyata ibu rumah tangga dan pejuang dapur, bukan teori koki profesional",
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
  headline: "Kalau Ini Kamu Banget, Panduan Ini Emang Dibuat Buat Kamu",
  subheadline:
    "Empat hal ini yang paling sering bikin niat jualan masakan berhenti cuma jadi wacana di dapur.",
  points: [
    {
      icon: "Compass" as IconName,
      title: "Mau Jualan Masakan tapi Bingung Mulai dari Mana",
      description:
        "Sudah bisa masak enak, tapi nggak tahu menu apa yang paling laku, harga berapa, dan bagaimana cara jualinnya.",
    },
    {
      icon: "ShieldAlert" as IconName,
      title: "Takut Harga Jual Salah, Malah Buntung",
      description:
        "Bingung ngitung HPP dan takut harga terlalu murah sampai nggak untung, atau terlalu mahal sampai nggak ada yang beli.",
    },
    {
      icon: "Wallet" as IconName,
      title: "Modal Dapur Terbatas, Nggak Berani Ambil Risiko",
      description:
        "Bahan-bahan mahal, takut salah beli stok yang akhirnya mubazir karena belum ada pembeli.",
    },
    {
      icon: "Clock" as IconName,
      title: "Masak Sudah Capek, Promosinya Nggak Tahu Caranya",
      description:
        "Habis masak seharian, energi tinggal seuprit buat mikirin caption, foto produk, dan cara posting di medsos.",
    },
  ],
  reassurance: {
    icon: "Users" as IconName,
    title: "Yang ngerasain ini bukan cuma kamu",
    description:
      "Ribuan ibu rumah tangga dan pejuang dapur mulai dari titik yang sama, dan sekarang sudah punya pelanggan setia sendiri.",
  },
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
  urgencyBadge: "🔥 DISKON 60% — KHUSUS HARI INI",
  discountTag: "SAVINGS 60%",
  savingsText: "HEMAT Rp300.000",
  title: "Paket KitabCuan Resep Dapur",
  description: "Kitab utama, seluruh template, kalkulator HPP, plus semua bonusnya. Sekali bayar, punya selamanya.",
  originalPrice: "Rp497.000",
  promoPrice: "Rp197.000",
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
  ctaLabel: "AMBIL DISKON Rp197.000 SEKARANG",
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
        "Justru kamu yang paling disasar. Panduan ini dimulai dari titik paling awal — dari cara pilih menu yang laku sampai cara dapat pembeli pertama, semuanya dijelaskan step by step tanpa asumsi kamu sudah paham bisnis.",
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
        "Konten gratis biasanya fokus pada resep, bukan bisnis. Di sini kamu dapat panduan lengkap soal hitung HPP, strategi harga, cara foto makanan yang menggoda, sampai cara jualan di medsos — semuanya dalam satu alur yang rapi.",
    },
    {
      question: "Panduannya dikirim gimana? Ada buku fisiknya?",
      answer:
        "Semuanya berbentuk digital dan langsung bisa dibuka begitu pembayaran dikonfirmasi. Nggak perlu tunggu paket, bisa langsung baca hari itu juga dari HP, laptop, atau tablet kamu.",
    },
  ] as FaqItem[],
};

export const FINAL_CTA_CONTENT = {
  eyebrow: "⚡ HARI INI DISKON 60%",
  headline: "Jangan Sampai Dapur Kamu Cuma Jadi Tempat Masak",
  description:
    "Harga hemat Rp197.000 (Diskon 60%) cuma berlaku selama kuota gelombang ini masih tersedia.",
  priceRecapLabel: "Harga Spesial Hari Ini",
  savingsBadge: "HEMAT Rp300.000",
  promoPrice: "Rp197.000",
  originalPrice: "Rp497.000",
  ctaLabel: "AMBIL PANDUAN (RP197.000)",
  ctaHref: "#order",
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
