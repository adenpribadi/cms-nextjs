import { db } from "@/lib/db";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  Clock,
  ArrowRightCircle,
  MapPin
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import { TestimonialSection } from "@/components/TestimonialSection";

export default async function Home() {
  const siteName = await db.setting.findUnique({ where: { key: "site_name" } });
  const siteDesc = await db.setting.findUnique({ where: { key: "site_description" } });
  
  const products = await db.product.findMany({
    where: { featured: true },
    take: 3
  });

  const latestArticles = await db.article.findMany({
    where: { published: true },
    take: 2,
    orderBy: { createdAt: 'desc' }
  });

  const activeBanners = await db.banner.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  });

  const galleryItems = await db.gallery.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  const activeTestimonials = await db.testimonial.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="home-page overflow-x-hidden">
      {/* Dynamic Hero Slider */}
      <HeroSlider 
        banners={activeBanners} 
        siteName={siteName?.value} 
        siteDesc={siteDesc?.value} 
      />

      {/* About The Story Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="grid grid-cols-1 md-grid-cols-2" style={{ alignItems: 'center', gap: '40px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: 'var(--shadow)',
                transform: 'rotate(-1deg)'
              }}>
                <img src="/umkm_story_about.png" alt="Our Story" style={{ width: '100%', display: 'block' }} />
              </div>
              <div className="mobile-hide" style={{ 
                position: 'absolute', 
                top: '-20px', 
                right: '-20px', 
                background: 'var(--accent)', 
                color: 'white', 
                padding: '24px', 
                borderRadius: '12px',
                zIndex: 1
              }}>
                <p style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>10+</p>
                <p style={{ fontSize: '0.8rem' }}>Tahun Berkarya</p>
              </div>
            </div>
            
            <div style={{ paddingTop: '20px' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Warisan & Kualitas</span>
              <h2 className="font-heading" style={{ margin: '12px 0 20px' }}>Dedikasi Kami untuk Kualitas Terbaik</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '20px', lineHeight: 1.7 }}>
                Berawal dari semangat untuk menghargai kearifan lokal, kami hadir untuk menjembatani antara tradisi dan tren masa kini.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.7 }}>
                Kami percaya bahwa kualitas bukan hanya tentang hasil akhir, tetapi tentang proses panjang yang penuh cinta dan ketelitian di setiap detailnya.
              </p>
              <Link href="/contact" className="btn btn-secondary" style={{ padding: '14px 28px', display: 'inline-block' }}>Selengkapnya Tentang Kami</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Enhanced */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
            <h2 className="font-heading" style={{ marginBottom: '16px' }}>Komitmen Kami</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Pelajari standar pelayanan yang kami berikan untuk kepuasan setiap pelanggan kami.</p>
          </div>

          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
            <div className="premium-card hover-lift">
              <div style={{ color: 'var(--accent)', marginBottom: '16px', background: 'var(--accent-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ marginBottom: '10px' }}>Garansi Kepuasan</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Kami memberikan jaminan retur jika produk tidak sesuai dengan standar kualitas yang kami janjikan.</p>
            </div>
            <div className="premium-card hover-lift">
              <div style={{ color: 'var(--accent)', marginBottom: '16px', background: 'var(--accent-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ marginBottom: '10px' }}>Standar Ekspor</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Setiap produk didesain dan diproduksi dengan standar yang dapat bersaing di pasar mancanegara.</p>
            </div>
            <div className="premium-card hover-lift">
              <div style={{ color: 'var(--accent)', marginBottom: '16px', background: 'var(--accent-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ marginBottom: '10px' }}>Pengiriman Aman</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sistem pengemasan berlapis memastikan produk sampai ke tangan Anda dalam kondisi sempurna.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="flex-between-responsive" style={{ marginBottom: '40px' }}>
            <div>
              <h2 className="font-heading">Koleksi Pilihan</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Dapatkan produk unggulan kami yang paling banyak dicari</p>
            </div>
            <Link href="/products" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
              Katalog Lengkap <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
            {products.map((p) => (
              <div key={p.id} className="premium-card hover-lift" style={{ display: 'flex', flexDirection: 'column', padding: '14px' }}>
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '1/1', 
                  background: 'var(--bg-primary)', 
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : null}
                </div>
                <div style={{ padding: '0 4px 12px' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{p.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.05rem' }}>
                      Rp {p.price.toLocaleString('id-ID')}
                    </p>
                    <Link href={`/products/${p.slug}`} style={{ color: 'var(--text-secondary)' }}>
                      <ArrowRightCircle size={24} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      {latestArticles.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="font-heading">Edisi Terbaru</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Informasi terkini dan tips inspiratif untuk Anda</p>
            </div>

            <div className="grid grid-cols-1 lg-grid-cols-2">
              {latestArticles.map((article) => (
                <Link href={`/articles/${article.slug}`} key={article.id} className="premium-card hover-lift" style={{ 
                  display: 'flex', 
                  flexDirection: 'row',
                  gap: '20px', 
                  alignItems: 'center',
                  padding: '20px',
                  background: 'white'
                }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={article.coverImage || ""} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>Update UMKM</span>
                    <h3 style={{ margin: '4px 0 8px', fontSize: '1.15rem', lineHeight: 1.3 }}>{article.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} /> {new Date(article.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <TestimonialSection testimonials={activeTestimonials} />

      {/* FAQ Section */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="font-heading">Tanya Jawab (FAQ)</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Temukan jawaban cepat untuk pertanyaan umum Anda.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { q: "Bagaimana cara melakukan pemesanan kustom?", a: "Anda dapat menghubungi kami melalui tombol WhatsApp yang tersedia di pojok kanan bawah atau halaman kontak untuk mendiskusikan desain yang Anda inginkan." },
              { q: "Berapa lama waktu pengerjaan produk?", a: "Untuk produk Ready Stock akan dikirim dalam 1-2 hari kerja. Untuk produk kustom, waktu pengerjaan berkisar antara 7-14 hari kerja tergantung kerumitan." },
              { q: "Apakah bisa kirim ke luar kota?", a: "Tentu! Kami bekerjasama dengan berbagai ekspedisi terpercaya untuk melayani pengiriman ke seluruh penjuru Indonesia dengan packing yang sangat aman." },
              { q: "Apakah ada garansi kerusakan?", a: "Ya, setiap produk kami dilindungi garansi. Jika produk sampai dalam kondisi rusak karena pengiriman, silakan lampirkan video unboxing dan kami akan kirimkan produk pengganti." }
            ].map((faq, idx) => (
              <details key={idx} className="faq-item">
                <summary className="faq-question">
                  <span style={{ paddingRight: '12px' }}>{faq.q}</span>
                  <ArrowRight size={18} className="faq-icon" style={{ transform: 'rotate(90deg)', flexShrink: 0 }} />
                </summary>
                <div style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Map Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="grid grid-cols-1 md-grid-cols-2" style={{ gap: '40px', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Kunjungi Kami</span>
              <h2 className="font-heading" style={{ margin: '12px 0 20px' }}>Lokasi Workshop Kami</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '24px', lineHeight: 1.7 }}>
                Hubungi kami atau datang langsung ke workshop kami untuk berkonsultasi mengenai kebutuhan Anda.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ background: 'var(--accent-light)', padding: '10px', borderRadius: '10px', color: 'var(--accent)' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Alamat Workshop</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Jl. Inovasi No. 123, Indonesia</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ background: 'var(--accent-light)', padding: '10px', borderRadius: '10px', color: 'var(--accent)' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Jam Operasional</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Senin - Sabtu: 09.00 - 17.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              height: '350px', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border)'
            }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24172036737!2d106.78915570000001!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e25d6fd6ad%3A0xa4364405973787a2!2sJakarta%20Pusat%2C%20Kota%20Jakarta%20Pusat%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1712918400000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--accent-dark)', overflow: 'hidden', position: 'relative', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: 'var(--accent)', borderRadius: '50%', opacity: 0.1 }}></div>
        
        <div className="container animate-fade-in" style={{ color: 'white', position: 'relative', zIndex: 1 }}>
          <h2 className="font-heading" style={{ color: 'white', marginBottom: '16px' }}>Mulai Perjalanan Anda Bersama Kami</h2>
          <p style={{ fontSize: '1rem', marginBottom: '32px', opacity: 0.8, maxWidth: '600px', margin: '0 auto 32px' }}>
            Jangan ragu untuk berkonsultasi tentang kebutuhan produk Anda. Tim kami siap membantu memberikan solusi terbaik bagi Anda.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/contact" className="btn btn-primary" style={{ background: 'white', color: 'var(--accent-dark)', padding: '14px 32px', fontWeight: 700 }}>
              Konsultasi WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        details summary::-webkit-details-marker { display: none; }
        summary { cursor: pointer; list-style: none; }
      `}} />
    </div>
  );
}
