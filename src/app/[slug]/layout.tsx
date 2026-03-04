/**
 * Layout zona template undangan.
 *
 * Zona ini benar-benar terpisah dari dashboard/admin/landing:
 * - Dibungkus data-zone="template" agar selector CSS terisolasi
 * - Dark mode tidak berlaku di zona ini (undangan selalu light)
 *
 * Catatan CSS:
 * Setiap template memuat CSS-nya SENDIRI langsung di index.tsx masing-masing:
 *   - javanese/styles.css   → token --jv-*, diimport di javanese/index.tsx
 *   - minimalist/styles.css → token --mn-*, diimport di minimalist/index.tsx
 *   - elegant/styles.css    → token --el-*, diimport di elegant/index.tsx
 *
 * Layout ini TIDAK perlu mengimport CSS apapun.
 */
export default function TemplateZoneLayout({ children }: { children: React.ReactNode }) {
    return (
        <div data-zone="template">
            {children}
        </div>
    );
}
