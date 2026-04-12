import { db } from "@/lib/db";
import Link from "next/link";
import { deleteArticle } from "@/app/actions/articles";

export default async function AdminArticlesPage() {
  const articles = await db.article.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Manajemen Artikel</h1>
        <Link href="/admin/articles/new" className="btn btn-primary">+ Tambah Artikel</Link>
      </div>

      <div className="admin-table-wrapper">
        {articles.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Belum ada artikel. Klik "+ Tambah Artikel" untuk membuat berita pertama Anda.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Artikel</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Tanggal Terbit</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        {a.coverImage ? (
                          <img src={a.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : null}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{a.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/{a.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {a.published ? (
                      <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, background: 'var(--accent-light)', padding: '4px 10px', borderRadius: '20px' }}>Terbit</span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: '20px' }}>Draft</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Link href={`/admin/articles/edit/${a.id}`} style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>Edit</Link>
                      <form action={async () => {
                        "use server";
                        await deleteArticle(a.id);
                      }}>
                        <button style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, padding: 0 }}>
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
