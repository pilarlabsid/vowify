import { WeddingData } from "./types";

export const getDummyData = (themeId: string): WeddingData => {
    const isJavanese = themeId === 'wayang-black-gold' || themeId === 'javanese';
    const imagePrefix = isJavanese ? '/images/javanese' : '/images/general';

    return {
        id: "dummy-id",
        slug: "demo-undangan",
        brideName: "Siti Ratna Sari, S.Kom",
        brideShort: "Ratna",
        brideImage: `${imagePrefix}/bride.png`,
        brideParents: "Putri dari Bpk. Ahmad & Ibu Siti",
        groomName: "Aditya Wijaya, M.T",
        groomShort: "Aditya",
        groomImage: `${imagePrefix}/groom.png`,
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
            `${imagePrefix}/galery_1.png`,
            `${imagePrefix}/galery_2.png`,
            `${imagePrefix}/galery_3.png`,
            `${imagePrefix}/galery_4.png`,
            `${imagePrefix}/galery_5.png`,
        ],
        photos: {
            hero_couple: isJavanese ? `${imagePrefix}/Hero.png` : `${imagePrefix}/hero.png`,
            bride_portrait: `${imagePrefix}/bride.png`,
            groom_portrait: `${imagePrefix}/groom.png`,
            gallery_1: `${imagePrefix}/galery_1.png`,
            gallery_2: `${imagePrefix}/galery_2.png`,
            gallery_3: `${imagePrefix}/galery_3.png`,
            gallery_4: `${imagePrefix}/galery_4.png`,
            gallery_5: `${imagePrefix}/galery_5.png`,
        },
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
        qris: "/images/qris_placeholder.webp",
        themeId: themeId,
    };
};
