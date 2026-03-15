import { resolveTemplate, ACTIVE_TEMPLATES } from "@/templates/registry";
import { getDummyData } from "@/lib/dummy-data";
import { notFound } from "next/navigation";

// Render on-demand — tidak perlu pre-build semua halaman preview saat deploy.
// generateStaticParams dihapus agar build time tidak O(n templates).
export const dynamic = 'force-dynamic';

export default async function PreviewPage(props: {
    params: Promise<{ themeId: string }>;
    searchParams: Promise<{ to?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const themeId = params.themeId;

    // Hanya izinkan preview template yang statusnya 'active'
    const isValid = ACTIVE_TEMPLATES.some(t => t.id === themeId);
    if (!isValid) notFound();

    const Template = await resolveTemplate(themeId);
    if (!Template) notFound();

    const data = getDummyData(themeId);

    return <Template data={data} guestName={searchParams.to || "Nama Tamu"} />;
}
