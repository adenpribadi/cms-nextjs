import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="product-detail">
      <section className="section">
        <div className="container">
          <Link href="/products" style={{ color: 'var(--accent)', marginBottom: '32px', display: 'inline-block' }}>
            &larr; Kembali ke Katalog
          </Link>
          
          <div className="grid grid-cols-2" style={{ gap: '32px' }}>
            <div style={{ 
              width: '100%', 
              aspectRatio: '1/1', 
              background: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}>
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
              ) : (
                "Foto Produk"
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>{product.category || 'Pilihan Utama'}</span>
                <h1 style={{ fontSize: '3rem', margin: '8px 0 16px' }}>{product.name}</h1>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <h4 style={{ marginBottom: '12px' }}>Deskripsi Produk</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  {product.description || "Belum ada deskripsi untuk produk ini."}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                <a 
                  href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan produk ${product.name}. Apakah masih tersedia?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'block', textAlign: 'center', padding: '18px' }}
                >
                  Pesan via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
