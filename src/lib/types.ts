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
    /**
     * @deprecated Gunakan photos.gallery_1 s/d photos.gallery_6 (canonical slots).
     * Field ini dipertahankan untuk backward compat dengan data lama.
     */
    gallery: string[];
    /**
     * Semua foto template disimpan di sini, termasuk canonical slots:
     *   - bride_portrait, groom_portrait   → foto mempelai
     *   - hero_couple                      → foto cover (wajib)
     *   - gallery_1 .. gallery_6           → galeri (1-3 wajib, 4-6 opsional)
     *
     * Template opsional bisa tambah key sendiri (hero_fullscreen, dll).
     * Dashboard membaca photoSlots dari registry untuk menampilkan uploader.
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
