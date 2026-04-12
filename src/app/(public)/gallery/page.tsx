import { db } from "@/lib/db";

export default async function GalleryPage() {
  const items = await db.gallery.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="gallery-page">
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container animate-fade-in" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Galeri UMKM</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Lihat berbagai momen dan kegiatan kami serta detail produk kami dari jarak dekat.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <p>Belum ada foto di galeri saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3" style={{ gap: '24px' }}>
              {items.map((item) => (
                <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.title || ""} 
                    style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} 
                  />
                  {item.title && (
                    <div style={{ padding: '16px' }}>
                      <p style={{ fontWeight: 500, textAlign: 'center' }}>{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
