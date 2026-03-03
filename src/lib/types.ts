export interface WeddingData {
    id: string;
    slug: string;
    brideName: string;
    brideShort: string;
    brideImage: string;
    brideParents: string;
    groomName: string;
    groomShort: string;
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
