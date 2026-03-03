import { getWeddingBySlug } from "@/services/wedding";
import { resolveTemplate } from "@/lib/templates";
import { notFound } from "next/navigation";

export default async function WeddingPage(props: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ to?: string; theme?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const data = await getWeddingBySlug(params.slug);

    if (!data) {
        notFound();
    }

    // Support theme override for live preview (e.g. ?theme=elegant)
    const activeThemeId = searchParams.theme || data.themeId;
    const Template = resolveTemplate(activeThemeId);

    if (!Template) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Template &quot;{activeThemeId}&quot; tidak ditemukan.</p>
            </div>
        );
    }

    return <Template data={data} guestName={searchParams.to} />;
}
