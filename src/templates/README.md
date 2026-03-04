# 📁 Template System — Vowify.id

Dokumentasi lengkap sistem template undangan digital.

---

## Struktur Folder

```
src/templates/
│
├── _types.ts                ← Semua definisi tipe (TemplateConfig, PhotoSlot, dll)
├── _slots.ts                ← Canonical photo slots (dishare lintas template)
├── registry.ts              ← Agregator — mengumpulkan semua kategori
├── README.md                ← Panduan ini
│
├── tradisional/             ← Kategori tema budaya nusantara
│   ├── _index.ts            ← ✏️  Daftar template tradisional ← EDIT DI SINI
│   └── javanese/            ← Komponen template Javanese
│       ├── index.tsx
│       ├── styles.css
│       └── components/
│
├── modern/                  ← Kategori tema modern & kontemporer
│   ├── _index.ts            ← ✏️  Daftar template modern ← EDIT DI SINI
│   ├── minimalist/          ← Komponen template Minimalist
│   │   ├── index.tsx
│   │   └── styles.css
│   └── elegant/             ← Komponen template Elegant Night
│       ├── index.tsx
│       └── styles.css
│
└── [kategori-baru]/         ← Buat folder kategori baru kapanpun
    ├── _index.ts            ← ✏️  Daftar template kategori ini
    └── [nama-template]/
        ├── index.tsx
        └── styles.css
```

---

## Cara Menambah Template Baru

### Langkah 1 — Buat Folder Template

Buat folder template di **dalam folder kategori**:

```
src/templates/[kategori]/[nama-template]/
├── index.tsx          ← entry point (wajib)
├── styles.css         ← CSS khusus template ini (wajib)
└── components/        ← sub-komponen (opsional)
```

**Struktur `index.tsx`:**
```tsx
'use client';

import { TemplateProps } from '@/templates/_types';
import './styles.css';

export default function NamaTemplate({ data, guestName }: TemplateProps) {
    return (
        <main data-template="nama-template">
            {/* desain undangan */}
        </main>
    );
}
```

**Struktur `styles.css`:**
```css
/* Gunakan prefix unik agar tidak bentrok dengan template lain */
[data-template="nama-template"] {
  --nt-bg:   #ffffff;
  --nt-gold: #c6a75e;

  background: var(--nt-bg);
  color: var(--nt-text);
}
```

---

### Langkah 2 — Daftarkan di `_index.ts` Kategori

Buka `src/templates/[kategori]/_index.ts` yang sesuai lalu tambahkan entry:

```ts
// loader path menyertakan nama kategori
loader: () => import('@/templates/tradisional/sundanese'),
```

Contoh lengkap:

```ts
import { TemplateConfig } from '../_types';
import { SLOT_BRIDE_PORTRAIT, SLOT_GROOM_PORTRAIT } from '../_slots';

export const TRADISIONAL_TEMPLATES: TemplateConfig[] = [
    // ... template yang sudah ada ...

    // ← Tambahkan entry baru di sini
    {
        id: 'sundanese',                          // ← ID unik, disimpan di DB
        name: 'Sundanese Elegance',
        description: 'Keanggunan budaya Sunda dengan motif khas.',
        previewImage: '/images/templates/sundanese.png',
        features: ['Motif Sunda', 'Kecapi Music', 'Floral Accent'],
        badge: 'Baru',                            // opsional
        category: 'tradisional',
        status: 'active',                         // 'active' | 'draft' | 'deprecated'
        tier: 'free',                             // 'free' | 'premium' | 'enterprise'
        tags: ['sunda', 'tradisional', 'budaya'],
        loader: () => import('@/templates/tradisional/sundanese'),
        photoSlots: [
            SLOT_BRIDE_PORTRAIT,
            SLOT_GROOM_PORTRAIT,
        ],
    },
];
```

**Selesai!** Tidak ada file lain yang perlu disentuh. Template otomatis muncul di:

| Lokasi | Keterangan |
|---|---|
| `/dashboard/templates` | Kartu template dengan filter kategori & search |
| `/preview/sundanese` | Demo preview dengan data dummy |
| `/{slug}?theme=sundanese` | Live preview dengan data nyata |
| `/{slug}` | Dirender ke tamu setelah dipilih |
| `/dashboard/gallery` | Tab upload foto slot otomatis |

---

### Langkah 3 — Tambah Gambar Preview

Letakkan file gambar di:
```
public/images/templates/sundanese.png
```

> Disarankan ukuran **400×600px** (rasio 2:3), format WebP, max 100KB.

---

## Membuat Kategori Baru

Jika tidak ada kategori yang sesuai, buat kategori baru:

1. Buat folder: `src/templates/[kategori]/`
2. Buat file: `src/templates/[kategori]/_index.ts`
3. Import di `registry.ts`:

```ts
// registry.ts — tambahkan 2 baris ini
import { FLORAL_TEMPLATES } from './floral/_index';

export const TEMPLATES = [
    ...TRADISIONAL_TEMPLATES,
    ...MODERN_TEMPLATES,
    ...FLORAL_TEMPLATES,   // ← tambahkan di sini
];
```

Kategori yang tersedia di `_types.ts`:
- `tradisional` — tema budaya nusantara
- `modern` — clean, minimalist, contemporary
- `floral` — nuansa bunga dan alam
- `rustic` — earthy, vintage
- `islamic` — nuansa islami, arabesque
- `elegant` — mewah, dark, gold accents
- `other` — kategori lain

---

## Field `status` dan `tier`

### Status

| Nilai | Tampil di dashboard? | Bisa dipakai user? |
|---|---|---|
| `active` | ✅ Ya | ✅ Ya |
| `draft` | ❌ Tidak | ❌ Tidak |
| `deprecated` | ❌ Tidak | ✅ Ya (jika sudah terlanjur dipakai) |

Gunakan `status: 'draft'` saat template masih dalam pengembangan.

### Tier

| Nilai | Siapa yang bisa memakai? |
|---|---|
| `free` | Semua user |
| `premium` | User dengan paket berbayar |
| `enterprise` | Klien khusus |

---

## Photo Slots — Cara Kerja

Photo slots mendefinisikan foto apa saja yang bisa diunggah untuk template tertentu.
Dashboard Gallery menampilkan uploader secara otomatis berdasarkan `photoSlots`.

### Canonical Slots (dishare lintas template)

Slot dengan **key yang sama** di dua template berbeda → satu upload berlaku untuk keduanya.
Gunakan konstanta dari `_slots.ts` agar key tidak typo:

```ts
import {
    SLOT_BRIDE_PORTRAIT,    // key: 'bride_portrait'
    SLOT_GROOM_PORTRAIT,    // key: 'groom_portrait'
    SLOT_HERO_LANDSCAPE,    // key: 'hero_couple'
    SLOT_HERO_FULLSCREEN,   // key: 'hero_fullscreen'
    SLOT_COUPLE_SQUARE,     // key: 'couple_together'
} from '../_slots';
```

### Slot Khusus Template

Jika template butuh foto yang tidak ada di `_slots.ts`, definisikan inline:

```ts
photoSlots: [
    SLOT_BRIDE_PORTRAIT,
    {
        key: 'background_mosque',      // key unik untuk slot ini
        label: 'Foto Masjid/Venue',
        hint: 'Landscape 16:9',
        aspect: '16/9',
        required: false,
        section: 'Venue',
        description: 'Foto latar tempat akad nikah.',
    },
],
```

### Membaca Foto di Komponen Template

```tsx
import { resolvePhoto } from '@/templates/registry';

// Di dalam komponen:
const bridePhoto = resolvePhoto(data.photos, 'bride_portrait', data.brideImage);
//                                            ↑ key slot       ↑ legacy fallback
```

---

## CSS Isolation

Setiap template memiliki file `styles.css` sendiri yang **hanya dimuat saat template tersebut dirender**.

```
[data-zone="template"]         ← wraps semua template (dari [slug]/layout.tsx)
  └── [data-template="javanese"]  ← scope CSS khusus template Javanese
```

**Konvensi prefix token CSS:**

| Template | Prefix | Contoh |
|---|---|---|
| Javanese | `--jv-*` | `--jv-gold: #C6A75E` |
| Minimalist | `--mn-*` | `--mn-bg: #FAFAFA` |
| Elegant | `--el-*` | `--el-bg: #0D0B09` |
| Template baru | `--[2-huruf]-*` | `--sd-*` untuk Sundanese |

> ⚠️ Jangan gunakan `--ui-*` — itu milik zona dashboard/admin.

---

## Deploy

Template adalah kode React — menambah template **selalu memerlukan deploy ulang**.

```bash
# 1. Kembangkan & test lokal
npm run dev

# 2. Pastikan TypeScript tidak ada error
npx tsc --noEmit

# 3. Push & deploy
git add .
git commit -m "feat: tambah template sundanese"
git push origin main
# → Vercel/Railway auto-deploy
```

> Menambah template baru tidak merusak data lama. User yang sudah memilih template lain tetap aman.
