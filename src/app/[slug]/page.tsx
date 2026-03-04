import { getWeddingBySlug } from "@/services/wedding";
import { resolveTemplate } from "@/templates/registry";
import { notFound } from "next/navigation";

/** Default template sebagai fallback jika themeId di DB tidak valid */
const DEFAULT_TEMPLATE_ID = 'javanese';

export default async function WeddingPage(props: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ to?: string; theme?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const data = await getWeddingBySlug(params.slug);

    if (!data) notFound();

    // Support theme override untuk live preview (e.g. ?theme=elegant)
    const requestedThemeId = searchParams.theme || data.themeId;

    // Graceful fallback: jika themeId tidak valid (template dihapus/renamed),
    // gunakan default template agar undangan tetap bisa dibuka tamu.
    let Template = await resolveTemplate(requestedThemeId);
    if (!Template) {
        console.warn(`[WeddingPage] Template "${requestedThemeId}" tidak ditemukan untuk slug "${params.slug}". Fallback ke "${DEFAULT_TEMPLATE_ID}".`);
        Template = await resolveTemplate(DEFAULT_TEMPLATE_ID);
    }

    // Ini seharusnya tidak pernah terjadi (default template selalu ada)
    if (!Template) notFound();

    return <Template data={data} guestName={searchParams.to} />;
}
