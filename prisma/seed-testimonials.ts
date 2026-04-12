import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  const testimonials = [
    {
      name: "Siti Rahayu",
      role: "Ibu Rumah Tangga, Jakarta",
      content:
        "Saya sangat puas dengan kualitas meja makan yang saya pesan dari Arta Furniture. Kayu jatinya benar-benar kokoh, seratnya cantik banget. Sudah 2 tahun dipakai dan kondisinya masih prima. Highly recommended!",
      rating: 5,
      active: true,
      order: 1,
    },
    {
      name: "Budi Prasetyo",
      role: "Pemilik Kafe, Bandung",
      content:
        "Kami memesan 20 set kursi untuk kafe kami dan hasilnya luar biasa! Desainnya modern, nyaman diduduki, dan tamu kami selalu memuji interiornya. Tim Arta sangat profesional dan pengiriman tepat waktu.",
      rating: 5,
      active: true,
      order: 2,
    },
    {
      name: "Dewi Kusuma",
      role: "Interior Designer, Surabaya",
      content:
        "Sebagai desainer interior, saya sangat selektif dalam memilih furnitur. Arta Furniture selalu menjadi pilihan utama saya karena kualitas finishing-nya konsisten dan bisa dikustom sesuai kebutuhan klien. Partner terbaik!",
      rating: 5,
      active: true,
      order: 3,
    },
    {
      name: "Reza Firmansyah",
      role: "Pengusaha Property, Medan",
      content:
        "Sudah 3 kali order di sini untuk kebutuhan apartment showroom. Setiap pesanan selalu memuaskan. Harga sangat reasonable untuk kualitas premium yang ditawarkan. Akan terus berlangganan!",
      rating: 5,
      active: true,
      order: 4,
    },
    {
      name: "Anita Wijaya",
      role: "Pelanggan Setia, Yogyakarta",
      content:
        "Awalnya ragu pesan online, tapi ternyata produknya jauh melebihi ekspektasi. Kemasannya sangat aman, tidak ada goresan sama sekali. Customer service-nya juga responsif dan ramah. Terima kasih Arta!",
      rating: 5,
      active: true,
      order: 5,
    },
  ];

  console.log("Seeding testimonials...");

  for (const t of testimonials) {
    // Use name + role as unique check (upsert not available without unique field in default)
    const existing = await db.testimonial.findFirst({
      where: { name: t.name, role: t.role },
    });

    if (!existing) {
      await db.testimonial.create({ data: t });
      console.log(`  ✓ Created testimonial: ${t.name}`);
    } else {
      await db.testimonial.update({
        where: { id: existing.id },
        data: t,
      });
      console.log(`  ↻ Updated testimonial: ${t.name}`);
    }
  }

  console.log(`\n✅ Seeded ${testimonials.length} testimonials successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Adapter handled by db client
  });
