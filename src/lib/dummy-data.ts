import { WeddingData } from "./types";

export const DUMMY_WEDDING_DATA: WeddingData = {
    id: "dummy-id",
    slug: "demo-undangan",
    brideName: "Siti Ratna Sari, S.Kom",
    brideShort: "Ratna",
    brideImage: "/images/bride_groom.png",
    brideParents: "Putri dari Bpk. Ahmad & Ibu Siti",
    groomName: "Aditya Wijaya, M.T",
    groomShort: "Aditya",
    groomImage: "/images/bride_groom.png",
    groomParents: "Putra dari Bpk. Bambang & Ibu Retno",
    date: "2024-12-31T09:00:00.000Z",
    akad: {
        time: "09.00 - 10.00 WIB",
        location: "Masjid Agung Al-Barkah",
        address: "Jl. Veteran No.1, Bekasi Selatan, Kota Bekasi",
        mapUrl: "https://maps.google.com",
    },
    resepsi: {
        time: "11.00 - 14.00 WIB",
        location: "Gedung Serbaguna IPHI",
        address: "Jl. Kalimalang No.12, Bekasi",
        mapUrl: "https://maps.google.com",
    },
    gallery: [
        "/images/gallery_1.png",
        "/images/gallery_2.png",
        "/images/gallery_3.png",
    ],
    timeline: [
        {
            year: "2020",
            title: "Pertemuan Pertama",
            description: "Awal mula kami bertemu di bangku perkuliahan.",
        },
        {
            year: "2022",
            title: "Menjalin Kedekatan",
            description: "Mulai menjalin komitmen untuk melangkah bersama.",
        },
        {
            year: "2024",
            title: "Khitanan & Lamaran",
            description: "Melakukan ikatan janji suci di depan keluarga.",
        }
    ],
    bankAccounts: [
        {
            bank: "BCA",
            number: "1234567890",
            holder: "Aditya Wijaya",
        },
        {
            bank: "Mandiri",
            number: "0987654321",
            holder: "Siti Ratna Sari",
        }
    ],
    qris: "/images/qris_placeholder.png",
    themeId: "javanese",
};
