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
| 🎨 **Koleksi Template** | 3 tema premium: Javanese, Minimalist, Elegant Night |
| 👥 **Manajemen Tamu** | Daftar tamu dengan nomor WhatsApp |
| 📱 **Kirim via WhatsApp** | Satu klik kirim undangan personal ke setiap tamu |
| 🔗 **Link Personal** | URL dengan nama tamu `?to=Nama+Tamu` |
| 💬 **RSVP & Ucapan** | Tamu bisa konfirmasi hadir dan kirim doa |
| 🖼️ **Galeri Foto** | Upload dan tampilkan foto kenangan |
| 👁️ **Live Preview** | Preview template dengan data nyata sebelum apply |
| ✉️ **Verifikasi Email** | OTP 6 digit ke email asli saat registrasi |
| 🔒 **Autentikasi** | Login aman dengan NextAuth + JWT |
| 📊 **Dashboard** | Ringkasan statistik undangan, RSVP, ucapan |

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
nikahyuk/
├── prisma/
│   ├── schema.prisma          # Schema database
│   ├── migrations/            # Riwayat migrasi
│   └── seed.ts                # Data awal
│
├── public/
│   ├── images/
│   │   └── templates/         # Gambar preview template
│   └── audio/                 # Musik gamelan (Javanese template)
│
└── src/
    ├── app/
    │   ├── [slug]/            # Halaman undangan public
    │   ├── preview/[themeId]/ # Preview template dengan dummy data
    │   ├── dashboard/         # Seluruh halaman dashboard
    │   │   ├── weddings/      # Kelola undangan
    │   │   ├── edit/          # Edit konten undangan
    │   │   ├── guests/        # Daftar tamu + kirim WA
    │   │   ├── greetings/     # Ucapan & doa dari tamu
    │   │   ├── gallery/       # Upload foto galeri
    │   │   ├── templates/     # Koleksi & ganti template
    │   │   └── settings/      # Pengaturan akun
    │   ├── api/
    │   │   ├── auth/          # Register, login, OTP
    │   │   ├── weddings/      # CRUD undangan
    │   │   ├── guests/        # CRUD daftar tamu
    │   │   └── greetings/     # CRUD ucapan tamu
    │   ├── login/             # Halaman login
    │   └── register/          # Halaman register (3 langkah)
    │
    ├── lib/
    │   ├── templates.ts       # ⭐ Template Registry (central config)
    │   ├── auth.ts            # Konfigurasi NextAuth
    │   ├── prisma.ts          # Prisma client
    │   ├── email.ts           # Nodemailer + template email OTP
    │   ├── types.ts           # TypeScript types
    │   └── dummy-data.ts      # Data dummy untuk preview template
    │
    ├── templates/             # Komponen template undangan
    │   ├── javanese/          # Tema tradisional Jawa
    │   ├── minimalist/        # Tema minimalis putih
    │   └── elegant/           # Tema gelap + emas
    │
    └── services/
        └── wedding.ts         # Data access layer
```

---

## 🎨 Menambah Template Baru

Sistem template menggunakan **Registry Pattern** — hanya perlu edit **1 file** setelah membuat komponen:

### Langkah 1 — Buat Komponen

```
src/templates/nama-baru/index.tsx
```

```tsx
import { WeddingData } from "@/lib/types";

interface Props {
    data: WeddingData;
    guestName?: string;
}

export default function NamaBaru({ data, guestName }: Props) {
    return <main>{/* desain Anda */}</main>;
}
```

### Langkah 2 — Daftar di Registry

Buka `src/lib/templates.ts` dan tambahkan:

```ts
import NamaBaru from '@/templates/nama-baru';

// Tambahkan ke array TEMPLATES:
{
    id: 'nama-baru',
    name: 'Nama Template',
    description: 'Deskripsi singkat...',
    previewImage: '/images/templates/nama-baru.png',
    features: ['Fitur 1', 'Fitur 2'],
    component: NamaBaru,
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
pm2 start npm --name "nikahyuk" -- start
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
