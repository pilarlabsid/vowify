import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-elegant text-cream flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl md:text-7xl font-script text-gold mb-6">Vowify.id</h1>
      <p className="text-lg md:text-xl font-serif max-w-2xl mx-auto mb-12 opacity-80 leading-relaxed">
        Platform Undangan Pernikahan Digital Elegan & Eksklusif.
        Buat momen spesialmu lebih berkesan dengan teknologi modern bergaya tradisional.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/aditya-ratna"
          className="bg-gold text-primary px-8 py-4 rounded-full font-bold hover:bg-cream transition-all shadow-xl"
        >
          Lihat Demo Undangan
        </Link>
        <Link
          href="/login"
          className="border border-gold text-gold px-8 py-4 rounded-full font-bold hover:bg-gold hover:text-primary transition-all shadow-xl"
        >
          Mulai Buat Undangan
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-sm opacity-60">
        <div className="p-6 border border-gold/20 rounded-2xl">
          <h3 className="text-gold font-bold mb-2">Multi-Tema</h3>
          <p>Pilih berbagai tema premium sesuai gaya pernikahan impianmu.</p>
        </div>
        <div className="p-6 border border-gold/20 rounded-2xl">
          <h3 className="text-gold font-bold mb-2">Custom Dashboard</h3>
          <p>Atur isi undangan, musik, dan galeri semudah mengisi formulir.</p>
        </div>
        <div className="p-6 border border-gold/20 rounded-2xl">
          <h3 className="text-gold font-bold mb-2">RSVP & Ucapan</h3>
          <p>Kelola konfirmasi kehadiran dan simpan ucapan doa dari tamu ke database.</p>
        </div>
      </div>
    </main>
  );
}
