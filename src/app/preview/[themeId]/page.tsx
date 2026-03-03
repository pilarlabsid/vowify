import { resolveTemplate, TEMPLATES } from "@/lib/templates";
import { DUMMY_WEDDING_DATA } from "@/lib/dummy-data";
import { notFound } from "next/navigation";

export default async function PreviewPage(props: {
    params: Promise<{ themeId: string }>;
    searchParams: Promise<{ to?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const themeId = params.themeId;

    const Template = resolveTemplate(themeId);

    if (!Template) {
        notFound();
    }

    const data = { ...DUMMY_WEDDING_DATA, themeId };

    return <Template data={data} guestName={searchParams.to || "Nama Tamu"} />;
}

// Generate static params from registry — auto-updates when new template is added
export function generateStaticParams() {
    return TEMPLATES.map(t => ({ themeId: t.id }));
}
