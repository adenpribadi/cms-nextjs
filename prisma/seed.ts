import "dotenv/config";
import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  // Seed User
  const user = await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin UMKM",
      password: hashedPassword,
    },
  });

  console.log("Seeded user:", user.email);

  // Seed default settings
  const settings = [
    { key: "site_name", value: "Arta Furniture & Craft" },
    { key: "site_description", value: "Eksplorasi Keindahan Kayu dalam Desain Modern Minimalis." },
    { key: "site_keywords", value: "furniture, kayu, kerajinan, umkm, minimalis" },
    { key: "contact_email", value: "halo@artafurniture.id" },
    { key: "contact_phone", value: "08123456789" },
  ];

  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // Seed Products
  const products = [
    {
      name: "Kursi Makan Oak Minimalis",
      slug: "kursi-makan-oak-minimalis",
      price: 1250000,
      description: "Kursi makan dengan desain ergonomis terbuat dari kayu Oak pilihan. Finishing natural yang menonjolkan serat kayu asli.",
      category: "Furniture",
      featured: true,
      image: "/seed/chair.png"
    },
    {
      name: "Meja Kerja Arta Series",
      slug: "meja-kerja-arta-series",
      price: 2450000,
      description: "Meja kerja luas dengan laci penyimpanan tersembunyi. Cocok untuk produktivitas maksimal di rumah.",
      category: "Furniture",
      featured: true,
      image: "/seed/tips.png" // Using the workspace image for desk context
    },
    {
      name: "Lampu Meja Bambu Kriya",
      slug: "lampu-meja-bambu-kriya",
      price: 450000,
      description: "Lampu meja anyaman bambu yang memberikan efek cahaya hangat dan estetik di ruangan Anda.",
      category: "Craft",
      featured: true,
      image: "/seed/chair.png" 
    }
  ];

  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // Seed Articles
  const articles = [
    {
      title: "5 Tips Merawat Furniture Kayu Agar Tahan Lama",
      slug: "tips-merawat-furniture-kayu",
      content: "<h1>Rahasia Furniture Awet</h1><p>Furniture kayu adalah investasi jangka panjang. Berikut adalah tipsnya:</p><ul><li>Jauhkan dari sinar matahari langsung</li><li>Gunakan kain microfiber untuk debu</li><li>Oleskan wax setiap 6 bulan sekali</li></ul><p>Dengan perawatan yang tepat, furniture Anda akan tetap cantik hingga puluhan tahun.</p>",
      published: true,
      coverImage: "/seed/tips.png",
      seoTitle: "Rahasia Awet: 5 Tips Merawat Furniture Kayu | Arta Furniture",
      seoDescription: "Ingin furniture kayu Anda tahan hingga puluhan tahun? Temukan 5 tips merawat kayu jati dan oak agar tetap mengkilap dan bebas rayap di sini.",
      seoKeywords: "merawat furniture kayu, tips kayu jati, cleaning furniture, arta furniture"
    },
    {
      title: "Tren Desain Interior Minimalis 2024",
      slug: "tren-desain-interior-2024",
      content: "<h2>Back to Nature</h2><p>Tahun ini, penggunaan material alami seperti kayu dan batu menjadi primadona. Warna-warna bumi (earth tone) memberikan kesan tenang dan lapang di rumah yang sempit.</p>",
      published: true,
      coverImage: "/seed/chair.png",
      seoTitle: "7 Tren Desain Interior Minimalis 2024 yang Wajib Anda Tahu",
      seoDescription: "Tahun 2024 adalah tentang fungsionalitas dan estetika alami. Pelajari bagaimana tren warna earth tone dan material kayu mendominasi interior rumah masa kini.",
      seoKeywords: "desain interior 2024, minimalis modern, rumah estetik, tren interior"
    }
  ];

  for (const a of articles) {
    await db.article.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Adapter handled
  });
