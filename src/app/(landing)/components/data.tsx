import { Music, MapPin, Gift, Users, Send, BookOpen, Sparkles, Zap, Image as ImageIcon } from "lucide-react";

export const FEATURES_PRIMARY = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Desain Undangan Elegan",
    desc: "Ribuan pasangan sudah mempercayakan undangan mereka pada Vowify. Template kami dirancang oleh desainer profesional.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Buat Undangan dalam 5 Menit",
    desc: "Pilih template, isi data pasangan dan acara, undangan siap dibagikan. Semudah itu.",
  },
  {
    icon: <Send className="w-6 h-6" />,
    title: "Kirim via WhatsApp",
    desc: "Bagikan link undangan ke seluruh tamu dengan satu ketukan. Langsung dari aplikasi.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "RSVP Kehadiran Tamu",
    desc: "Kelola konfirmasi kehadiran tamu secara otomatis. Tidak perlu tanya satu per satu.",
  },
  {
    icon: <ImageIcon className="w-6 h-6" />,
    title: "Galeri Foto & Video",
    desc: "Tampilkan kenangan indah momen-momen spesial bersama pasangan dalam galeri yang elegan.",
  },
];

export const TEMPLATES = [
  {
    id: "luxury",
    name: "Elegant Gold",
    desc: "Mewah, elegan, dengan sentuhan warna emas.",
    bg: "bg-white",
    accent: "#A88132",
    floral: "✨",
  },
  {
    id: "modern",
    name: "Modern Minimal",
    desc: "Bersih, simpel, dan fokus pada keindahan visual.",
    bg: "bg-stone-50",
    accent: "#9ca3af",
    floral: "🤍",
  },
  {
    id: "garden",
    name: "Garden Wedding",
    desc: "Nuansa floral, dedaunan, segar dan romantis.",
    bg: "bg-green-50",
    accent: "#86EFAC",
    floral: "🌿",
  },
  {
    id: "javanese",
    name: "Royal Javanese",
    desc: "Kekayaan budaya klasik, agung, dan bermakna tajam.",
    bg: "bg-orange-50",
    accent: "#d97706",
    floral: "🏛️",
  },
];

export const STEPS = [
  {
    num: "01",
    title: "Pilih Template Undangan",
    desc: "Temukan template sesuai tema pernikahan impian Anda dari koleksi premium kami.",
  },
  {
    num: "02",
    title: "Isi Informasi Pasangan & Acara",
    desc: "Lengkapi nama, tanggal, lokasi, dan cerita cinta Anda dalam formulir yang mudah dipahami.",
  },
  {
    num: "03",
    title: "Bagikan ke Seluruh Tamu",
    desc: "Kirim link undangan via WhatsApp, email, atau media sosial dalam satu klik.",
  },
];

export const DEMOS = [
  {
    names: "Andi & Sari",
    date: "14 Februari 2025",
    theme: "Modern Minimalist",
    slug: "aditya-ratna",
    color: "#C6A75E",
  },
  {
    names: "Ahmad & Fatima",
    date: "20 Maret 2025",
    theme: "Islamic Wedding",
    slug: "aditya-ratna",
    color: "#5EEAD4",
  },
  {
    names: "Budi & Rina",
    date: "5 April 2025",
    theme: "Wedding Garden",
    slug: "aditya-ratna",
    color: "#86EFAC",
  },
];

export const FEATURES_DETAIL = [
  { icon: <Music className="w-5 h-5" />, title: "Musik Latar Undangan", desc: "Sambut tamu dengan melodi yang mengiringi momen romantis." },
  { icon: <ImageIcon className="w-5 h-5" />, title: "Galeri Foto", desc: "Tampilkan memories indah bersama pasangan." },
  { icon: <MapPin className="w-5 h-5" />, title: "Lokasi dengan Peta", desc: "Integrasi Google Maps agar tamu mudah menemukan venue." },
  { icon: <Users className="w-5 h-5" />, title: "RSVP Tamu", desc: "Konfirmasi kehadiran otomatis tanpa perlu menghubungi satu per satu." },
  { icon: <Send className="w-5 h-5" />, title: "Kirim via WhatsApp", desc: "Bagikan undangan langsung ke kontak WhatsApp." },
  { icon: <Gift className="w-5 h-5" />, title: "Amplop Digital", desc: "Terima hadiah dari tamu dengan mudah melalui transfer digital." },
  { icon: <BookOpen className="w-5 h-5" />, title: "Cerita Cinta Pasangan", desc: "Ceritakan perjalanan cinta kalian dalam timeline yang menyentuh hati." },
  { icon: <Zap className="w-5 h-5" />, title: "Buku Tamu Digital", desc: "Simpan ucapan dan doa tulus dari para tamu secara digital selamanya." },
];

export const TESTIMONIALS = [
  {
    name: "Rania & Dafa",
    date: "Januari 2025",
    text: "Undangannya cantik banget dan mudah digunakan. Tamu-tamu kami juga suka karena praktis bisa dibuka di HP mana saja. Terima kasih Vowify!",
    stars: 5,
  },
  {
    name: "Farah & Rizky",
    date: "Februari 2025",
    text: "Awalnya ragu mau pakai undangan digital, tapi Vowify benar-benar luar biasa. Template-nya elegan dan proses buatnya cepat sekali!",
    stars: 5,
  },
  {
    name: "Dewi & Arif",
    date: "Maret 2025",
    text: "Fitur RSVP-nya sangat membantu. Kami bisa tahu berapa tamu yang hadir tanpa harus tanya satu per satu. Sangat direkomendasikan!",
    stars: 5,
  },
];

export const PRICING = [
  {
    name: "Basic",
    price: "Gratis",
    sub: "Untuk eksplorasi awal",
    highlight: false,
    features: [
      "2 Pilihan Tema Basic",
      "Masa Aktif 3 Hari",
      "Tanpa Fitur RSVP",
      "Musik Latar Default",
      "Support Komunitas",
    ],
    cta: "Basic — Gratis",
    href: "/register",
  },
  {
    name: "Premium",
    price: "Rp 149.000",
    sub: "Paling Direkomendasikan",
    highlight: true,
    features: [
      "Akses Semua Tema",
      "Masa Aktif 6 Bulan",
      "Galeri Foto & Video",
      "Custom Musik Latar",
      "RSVP & Peta Lokasi",
      "Buku Tamu Digital",
    ],
    cta: "Pilih Premium",
    href: "/register?plan=premium",
  },
  {
    name: "Luxury",
    price: "Rp 299.000",
    sub: "Dedikasi Kesempurnaan",
    highlight: false,
    features: [
      "Semua Fitur Premium",
      "Masa Aktif 1 Tahun",
      "Custom Domain Nama",
      "Amplop Digital Interaktif",
      "Galeri Tanpa Batas",
      "Prioritas Dukungan 24/7",
    ],
    cta: "Pilih Luxury",
    href: "/register?plan=luxury",
  },
];

export const FAQS = [
  {
    q: "Apakah undangan bisa dibuka di HP?",
    a: "Ya, undangan Vowify didesain responsif sehingga tampil sempurna di semua ukuran layar — dari HP hingga laptop.",
  },
  {
    q: "Apakah bisa kirim lewat WhatsApp?",
    a: "Tentu saja! Anda hanya perlu menyalin link undangan dan kirimkan ke kontak WhatsApp, atau gunakan fitur kirim bawaan Vowify.",
  },
  {
    q: "Apakah ada batas jumlah tamu?",
    a: "Paket Basic tidak membatasi jumlah tamu yang bisa membuka link. Fitur kirim massal tersedia di paket Premium ke atas.",
  },
  {
    q: "Berapa lama masa aktif undangan?",
    a: "Paket Basic aktif 30 hari setelah tanggal acara. Paket Premium dan Luxury aktif seumur hidup.",
  },
  {
    q: "Apakah saya bisa mengubah isi undangan setelah dibagikan?",
    a: "Ya, Anda bisa mengedit konten undangan kapan saja, dan perubahan akan langsung terlihat oleh tamu.",
  },
];
