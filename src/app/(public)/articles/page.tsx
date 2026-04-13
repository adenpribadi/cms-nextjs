import { db } from "@/lib/db";
import Link from "next/link";

export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="articles-page">
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container animate-fade-in" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Berita & Artikel</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Baca informasi terbaru seputar kegiatan kami, tips menarik, dan kabar terkini dari dunia UMKM.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <p>Belum ada artikel yang diterbitkan saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2" style={{ gap: '48px' }}>
              {articles.map((a) => (
                <div key={a.id} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '16/9', 
                    background: 'var(--bg-secondary)', 
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden'
                  }}>
                    {a.coverImage ? (
                      <img src={a.coverImage} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                      {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <h2 style={{ fontSize: '1.8rem', margin: '8px 0 16px' }}>{a.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {a.content.replace(/<[^>]*>?/gm, '').substring(0, 200)}...
                    </p>
                    <Link href={`/articles/${a.slug}`} style={{ color: 'var(--accent)', fontWeight: 600, borderBottom: '2px solid var(--accent)' }}>
                      Baca Selengkapnya
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
