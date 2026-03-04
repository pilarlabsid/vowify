export interface WeddingData {
    id: string;
    slug: string;
    brideName: string;
    brideShort: string;
    /** @deprecated Use photos.bride_portrait instead */
    brideImage: string;
    brideParents: string;
    groomName: string;
    groomShort: string;
    /** @deprecated Use photos.groom_portrait instead */
    groomImage: string;
    groomParents: string;
    date: string;
    akad: {
        time: string;
        location: string;
        address: string;
        mapUrl: string;
    };
    resepsi: {
        time: string;
        location: string;
        address: string;
        mapUrl: string;
    };
    gallery: string[];
    /**
     * Template-specific photo slots, keyed by slot key (e.g. "bride_portrait").
     * Dashboard writes here; template components read from here via resolvePhoto().
     */
    photos: Record<string, string>;
    timeline: {
        year: string;
        title: string;
        description: string;
    }[];
    bankAccounts: {
        bank: string;
        number: string;
        holder: string;
    }[];
    qris: string;
    themeId: string;
}

export interface GuestGreeting {
    id: string;
    weddingId: string;
    name: string;
    status: string;
    message: string;
    createdAt: string;
}
