import { db } from "@/lib/db";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="products-page">
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container animate-fade-in" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Katalog Produk</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Temukan berbagai pilihan produk berkualitas terbaik yang kami sediakan khusus untuk Anda.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <p>Belum ada produk yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3" style={{ gap: '32px' }}>
              {products.map((p) => (
                <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '1/1', 
                    background: 'var(--bg-secondary)', 
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        Tidak Ada Foto
                      </div>
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>{p.category || 'Umum'}</span>
                    <h3 style={{ margin: '4px 0 8px' }}>{p.name}</h3>
                    <p style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: '1.2rem' }}>
                      Rp {p.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <Link href={`/products/${p.slug}`} className="btn btn-primary" style={{ textAlign: 'center', marginTop: 'auto' }}>
                    Detail Produk
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
