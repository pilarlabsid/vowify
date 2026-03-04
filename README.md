<div align="center">

# 💍 Vowify.id

**Platform Undangan Pernikahan Digital Modern**

_Buat, kelola, dan kirimkan undangan pernikahan digital yang cantik dengan sekali klik_

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)

</div>

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🎨 **Koleksi Template** | Multi-template dengan CSS terisolasi per-tema (Javanese, Minimalist, Elegant, dst) |
| 👥 **Manajemen Tamu** | Daftar tamu dengan nomor WhatsApp |
| 📱 **Kirim via WhatsApp** | Satu klik kirim undangan personal ke setiap tamu |
| 🔗 **Link Personal** | URL dengan nama tamu `?to=Nama+Tamu` |
| 💬 **RSVP & Ucapan** | Tamu bisa konfirmasi hadir dan kirim doa |
| 🖼️ **Galeri Foto** | Upload lokal foto + sistem slot per-template |
| 👁️ **Live Preview** | Preview template dengan data nyata sebelum apply |
| ✉️ **Verifikasi Email** | OTP 6 digit ke email asli saat registrasi |
| 🔒 **Autentikasi** | Login aman dengan NextAuth + JWT |
| 📊 **Dashboard** | Ringkasan statistik undangan, RSVP, ucapan |
| 🛡️ **Admin Panel** | Kelola semua user, undangan, dan setting platform |

---

## 🛠️ Tech Stack

```
Frontend     → Next.js 16 (App Router) + TypeScript
Styling      → Tailwind CSS v4 + Framer Motion
Database     → PostgreSQL + Prisma ORM
Auth         → NextAuth.js v4 (Credentials + JWT)
Email        → Nodemailer + Gmail SMTP
UI Icons     → Lucide React
```

---

## 🚀 Memulai

### Prasyarat

- Node.js 18+
- PostgreSQL 14+
- Akun Gmail (untuk pengiriman OTP verifikasi email)

### 1. Clone & Install

```bash
git clone https://github.com/username/vowify-id.git
cd vowify-id
npm install
```

### 2. Konfigurasi Environment

Salin dan isi file `.env`:

```bash
cp .env.example .env
```

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/wedding_db?schema=public"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Gmail SMTP (untuk kirim OTP verifikasi email)
# Tutorial App Password: https://myaccount.google.com/apppasswords
GMAIL_USER="emailanda@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
```

> **Cara buat `NEXTAUTH_SECRET`:**
> ```bash
> openssl rand -base64 32
> ```

### 3. Setup Database

```bash
# Jalankan migrasi
npx prisma migrate dev

# (Opsional) Isi data seed
npx prisma db seed
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📂 Struktur Proyek

```
vowify/
├── prisma/
│   ├── schema.prisma          # Schema database
│   └── migrations/            # Riwayat migrasi
│
├── public/
│   ├── images/
│   │   └── templates/         # Gambar preview template
│   ├── audio/                 # Musik gamelan (Javanese template)
│   └── uploads/               # File upload lokal (foto tamu)
│
└── src/
    ├── app/
    │   ├── [slug]/            # Halaman undangan publik
    │   │   ├── layout.tsx     # Zone template (data-zone="template")
    │   │   └── page.tsx       # Resolver template + graceful fallback
    │   ├── preview/[themeId]/ # Preview template dengan dummy data
    │   ├── dashboard/         # Seluruh halaman dashboard user
    │   │   ├── weddings/      # Kelola undangan
    │   │   ├── edit/          # Edit konten undangan
    │   │   ├── guests/        # Daftar tamu + kirim WA
    │   │   ├── greetings/     # Ucapan & doa dari tamu
    │   │   ├── gallery/       # Upload foto per-slot template
    │   │   ├── templates/     # Koleksi & ganti template (+ filter kategori)
    │   │   └── settings/      # Pengaturan akun
    │   ├── admin/             # Panel admin platform
    │   ├── api/
    │   │   ├── auth/          # Register, login, OTP
    │   │   ├── weddings/      # CRUD undangan
    │   │   ├── guests/        # CRUD daftar tamu
    │   │   ├── greetings/     # CRUD ucapan tamu
    │   │   ├── upload/        # Upload file ke storage lokal
    │   │   ├── storage/       # Info storage usage
    │   │   └── admin/         # Admin: user, wedding, settings, export
    │   ├── login/             # Halaman login
    │   └── register/          # Halaman register (3 langkah)
    │
    ├── lib/
    │   ├── prisma.ts          # Prisma client singleton
    │   ├── auth.ts            # Konfigurasi NextAuth
    │   ├── email.ts           # Nodemailer + template email OTP
    │   ├── storage.ts         # File storage utilities
    │   ├── types.ts           # TypeScript types (WeddingData, dll)
    │   └── dummy-data.ts      # Data dummy untuk preview template
    │
    ├── templates/             # ⭐ Semua template undangan
    │   ├── _types.ts          # Tipe TemplateConfig, PhotoSlot, category, dll
    │   ├── _slots.ts          # Canonical photo slots (dishare lintas template)
    │   ├── registry.ts        # Agregator — kumpulkan semua kategori
    │   ├── tradisional/
    │   │   └── _index.ts      # ✏️ Daftar template tradisional ← edit di sini
    │   ├── modern/
    │   │   └── _index.ts      # ✏️ Daftar template modern ← edit di sini
    │   ├── javanese/          # Komponen template Javanese
    │   ├── minimalist/        # Komponen template Minimalist
    │   ├── elegant/           # Komponen template Elegant Night
    │   └── README.md          # Panduan lengkap tambah template
    │
    └── services/
        └── wedding.ts         # Data access layer (query DB)
```

---

## 🎨 Menambah Template Baru

Sistem template menggunakan **Category Registry Pattern** — scalable untuk 100+ template.
Setiap template memiliki CSS-nya sendiri yang terisolasi.

### Langkah 1 — Buat Folder Template

```
src/templates/[kategori]/[nama]/
├── index.tsx    ← komponen (wajib)
└── styles.css   ← CSS khusus template (wajib)
```

```tsx
// index.tsx
import { TemplateProps } from '@/templates/_types';
import './styles.css';

export default function NamaTemplate({ data, guestName }: TemplateProps) {
    return (
        <main data-template="nama-template">
            {/* desain Anda */}
        </main>
    );
}
```

### Langkah 2 — Daftar di `_index.ts` Kategori

Buka `src/templates/[kategori]/_index.ts` dan tambahkan:

```ts
{
    id: 'nama-baru',
    name: 'Nama Template',
    description: 'Deskripsi singkat...',
    previewImage: '/images/templates/nama-baru.png',
    features: ['Fitur 1', 'Fitur 2'],
    category: 'modern',           // kategori template
    status: 'active',             // 'active' | 'draft' | 'deprecated'
    tier: 'free',                 // 'free' | 'premium' | 'enterprise'
    tags: ['tag1', 'tag2'],
    loader: () => import('@/templates/modern/nama-baru'),
    photoSlots: [SLOT_BRIDE_PORTRAIT, SLOT_GROOM_PORTRAIT],
},
```

**Selesai!** Template otomatis muncul di seluruh dashboard dan routing.

> Lihat panduan lengkap di [`src/templates/README.md`](./src/templates/README.md)

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/register` | Daftar akun + kirim OTP |
| `POST` | `/api/auth/verify-otp` | Verifikasi OTP email |
| `PUT` | `/api/auth/verify-otp` | Kirim ulang OTP |
| `POST` | `/api/auth/[...nextauth]` | Login / Logout (NextAuth) |

### Undangan
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/weddings` | Ambil semua undangan milik user |
| `POST` | `/api/weddings` | Buat undangan baru |
| `PUT` | `/api/weddings/[id]` | Update undangan |
| `DELETE` | `/api/weddings/[id]` | Hapus undangan |

### Tamu & RSVP
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/guests?weddingId=` | Daftar tamu undangan |
| `POST` | `/api/guests` | Tambah tamu baru |
| `PATCH` | `/api/guests/[id]` | Tandai undangan terkirim |
| `DELETE` | `/api/guests/[id]` | Hapus tamu |
| `GET` | `/api/greetings?weddingId=` | Ucapan dari tamu |

### Upload & Storage
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/upload` | Upload foto ke storage lokal |
| `GET` | `/api/storage/info` | Info penggunaan storage |

### Admin
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/admin/users` | Daftar semua user |
| `PATCH` | `/api/admin/users/[id]` | Block/unblock user |
| `GET` | `/api/admin/weddings` | Daftar semua undangan |
| `GET` | `/api/admin/stats` | Statistik platform |
| `GET` | `/api/admin/export/users` | Export data user (CSV) |
| `GET` | `/api/admin/export/weddings` | Export data undangan (CSV) |
| `GET/PUT` | `/api/admin/settings` | Pengaturan global platform |

---

## 🌐 URL Undangan

| URL | Keterangan |
|---|---|
| `/{slug}` | Halaman undangan publik |
| `/{slug}?to=Nama+Tamu` | Undangan dengan nama personal |
| `/{slug}?theme=elegant` | Live preview template lain |
| `/preview/{themeId}` | Demo template dengan data dummy |

---

## 🔐 Alur Autentikasi

```
Register → Isi nama, email, password
        → OTP dikirim ke email (berlaku 10 menit)
        → Input 6 digit OTP
        → Akun aktif → Redirect ke login

Login   → Email + password
        → Cek: email sudah terverifikasi?
        → Ya: masuk dashboard
        → Tidak: tampil pesan error + arahkan ke register
```

---

## 📦 Scripts

```bash
npm run dev        # Development server (dengan Turbopack)
npm run build      # Build production
npm run start      # Jalankan production build
npm run lint       # ESLint check

npx prisma studio  # GUI database browser
npx prisma migrate dev --name [nama]  # Buat migrasi baru
npx prisma generate                    # Regenerate Prisma Client
```

---

## 🚢 Deploy ke Production

### Vercel (Direkomendasikan)

1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variables di dashboard Vercel
4. Vercel auto-deploy setiap `git push`

### VPS / Self-hosted

```bash
npm run build
npm run start
```

Gunakan **Nginx** sebagai reverse proxy dan **PM2** untuk process manager:

```bash
pm2 start npm --name "vowify" -- start
pm2 save
```

---

## 📝 Lisensi

MIT License — bebas digunakan untuk keperluan personal dan komersial.

---

<div align="center">

Dibuat dengan ❤️ untuk pasangan yang sedang merencanakan hari istimewa mereka

**Vowify.id** — _Undangannya digital, momennya tetap abadi_

</div>
