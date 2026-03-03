import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Create demo user
    const hashed = await bcrypt.hash('password123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'demo@vowify.id' },
        update: {},
        create: {
            name: 'Demo User',
            email: 'demo@vowify.id',
            password: hashed,
        },
    });
    console.log('Created user:', user.email);

    // 2. Create demo wedding linked to user
    const adityaRatna = await prisma.wedding.upsert({
        where: { slug: 'aditya-ratna' },
        update: { userId: user.id },
        create: {
            userId: user.id,
            slug: 'aditya-ratna',
            brideName: 'Siti Ratna Sari',
            brideShort: 'Ratna',
            brideImage: '/images/bride_groom.png',
            brideParents: 'Bapak Ahmad S. & Ibu Maria K.',
            groomName: 'Aditya Wijaya',
            groomShort: 'Aditya',
            groomImage: '/images/bride_groom.png',
            groomParents: 'Bapak Bambang W. & Ibu Sri M.',
            date: new Date('2026-08-20T09:00:00'),
            akadTime: '09.00 - 10.00 WIB',
            akadLocation: 'Masjid Agung Jawa Tengah',
            akadAddress: 'Jl. Gajah Raya, Sambirejo, Kec. Gayamsari, Kota Semarang',
            akadMapUrl: 'https://maps.app.goo.gl/xxx',
            resepsiTime: '11.00 - 14.00 WIB',
            resepsiLocation: 'Grand Ballroom Hotel Majestic',
            resepsiAddress: 'Jl. Pemuda No. 123, Kota Semarang',
            resepsiMapUrl: 'https://maps.app.goo.gl/yyy',
            gallery: [
                '/images/gallery_1.png',
                '/images/gallery_2.png',
                '/images/gallery_3.png',
            ],
            qris: '/images/qris_placeholder.png',
            themeId: 'javanese',
            timeline: {
                create: [
                    { year: '2022', title: 'First Meeting', description: 'Pertemuan pertama kami di sebuah konferensi di Yogyakarta.' },
                    { year: '2023', title: 'Mulai Berpacaran', description: 'Memulai perjalanan cinta kami bersama.' },
                    { year: '2024', title: 'Khitbah', description: 'Prosesi lamaran secara resmi.' },
                    { year: '2026', title: 'Hari Pernikahan', description: '20 Agustus 2026 – Hari yang paling ditunggu.' },
                ]
            },
            bankAccounts: {
                create: [
                    { bank: 'BCA', number: '1234567890', holder: 'Aditya Wijaya' },
                    { bank: 'Mandiri', number: '0987654321', holder: 'Siti Ratna Sari' },
                ]
            },
            greetings: {
                create: [
                    { name: 'Budi Santoso', status: 'Hadir', message: 'Selamat menempuh hidup baru! Barakallahu lakum.' },
                    { name: 'Siti Aminah', status: 'Hadir', message: 'Semoga menjadi keluarga sakinah mawaddah warahmah!' },
                    { name: 'Dani Pratama', status: 'Tidak Hadir', message: 'Maaf tidak bisa hadir, semoga bahagia selalu!' },
                ]
            }
        },
    });

    console.log('Created wedding:', adityaRatna.slug);
    console.log('\n✅ Seed selesai!');
    console.log('📧 Login: demo@vowify.id | 🔑 Password: password123');
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
