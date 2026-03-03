# 📁 Template System

Semua template undangan dikelola melalui **Template Registry** yang terpusat.

---

## Cara Menambah Template Baru

### Langkah 1 — Buat Komponen Template

Buat folder dan file baru:

```
src/templates/[nama-template]/
├── index.tsx          ← entry point (wajib)
└── components/        ← sub-komponen (opsional)
    ├── Hero.tsx
    ├── BrideGroom.tsx
    └── ...
```

**Struktur `index.tsx`:**
```tsx
import { WeddingData } from "@/lib/types";

interface Props {
    data: WeddingData;
    guestName?: string;
}

export default function NamaTemplate({ data, guestName }: Props) {
    return (
        <main>
            {/* desain undangan Anda */}
        </main>
    );
}
```

---

### Langkah 2 — Daftarkan di Registry

Buka **satu file ini saja**: `src/lib/templates.ts`

1. Import komponen di bagian atas:
```ts
import NamaTemplate from '@/templates/nama-template';
```

2. Tambahkan ke array `TEMPLATES`:
```ts
{
    id: 'nama-template',       // ID unik, saved di database
    name: 'Nama Template',     // Tampil di dashboard
    description: 'Deskripsi singkat...',
    previewImage: '/images/templates/nama-template.png',
    features: ['Fitur 1', 'Fitur 2', 'Fitur 3'],
    isPremium: false,          // optional: true = badge PRO
    badge: 'Baru',             // optional: badge kustom
    component: NamaTemplate,
},
```

3. Tambahkan gambar preview di `public/images/templates/nama-template.png`

**Selesai!** Template otomatis muncul di:
- ✅ Dashboard → Koleksi Template (dengan tombol preview & apply)
- ✅ Dashboard → Form Buat/Edit Undangan (visual selector)
- ✅ Route `/preview/nama-template` (demo preview)
- ✅ Route `/{slug}?theme=nama-template` (live preview)
- ✅ Route `/{slug}` (dirender ke user)

---

## Deploy ke Production

Karena template adalah React components (kode), menambah template **selalu memerlukan deploy ulang**.  
Ini normal — template bukan konten dinamis, melainkan kode UI.

### Alur Deployment yang Direkomendasikan:

```
1. Tambah template (2 langkah di atas)
2. Test locally: npm run dev
3. Push ke git: git push origin main
4. Deploy otomatis (Vercel/Railway/dll) atau manual:
   npm run build && npm start
```

### Tips untuk Zero-Downtime:

- Gunakan **Vercel** → setiap push ke `main` auto-deploy tanpa downtime
- Template baru tidak merusak data lama — user yang sudah pilih template lama tetap aman
- Anda bisa tambah template kapanpun tanpa mengganggu undangan yang sudah live

---

## Struktur File Template Registry

```
src/lib/templates.ts      ← SATU-SATUNYA file yang perlu diubah
src/templates/
├── javanese/             ← Template 1
│   ├── index.tsx
│   └── components/
├── minimalist/           ← Template 2
│   └── index.tsx
├── elegant/              ← Template 3
│   └── index.tsx
└── [template-baru]/      ← Template baru Anda
    └── index.tsx
```

---

## Tips Desain Template

- Gunakan `data.brideName`, `data.groomName`, dll dari `WeddingData`
- `guestName` diisi dari query `?to=Nama` di URL
- Gunakan `framer-motion` untuk animasi
- Template dirender **server-side** di production (Next.js SSR)
