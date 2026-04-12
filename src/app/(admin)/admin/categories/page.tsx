import { db } from "@/lib/db";
import Link from "next/link";
import { deleteCategory, migrateLegacyCategories } from "@/app/actions/categories";
import CategoryListActions from "@/components/CategoryListActions";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { type: 'asc' },
    include: {
      _count: {
        select: { products: true, articles: true }
      }
    }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '2rem' }}>Manajemen Kategori</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Atur pengelompokan produk dan artikel Anda.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* <CategoryListActions /> */}
          <Link href="/admin/categories/new" className="btn btn-primary" style={{ padding: '10px 24px' }}>
            + Tambah Kategori
          </Link>
        </div>
      </div>

      <div className="admin-table-wrapper">
        {categories.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗂️</div>
            <h3 style={{ marginBottom: '8px' }}>Belum Ada Kategori</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px' }}>
              Buat kategori untuk memudahkan pelanggan mencari produk atau membaca berita Anda.
            </p>
            <Link href="/admin/categories/new" className="btn btn-primary">Mulai Buat Kategori</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Nama Kategori</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Tipe</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Jumlah Konten</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cat.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/{cat.slug}</p>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: cat.type === 'product' ? 'var(--accent-light)' : '#e3f2fd',
                      color: cat.type === 'product' ? 'var(--accent)' : '#1976d2',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {cat.type === 'product' ? '📦 Produk' : '📝 Artikel'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem' }}>
                    {cat.type === 'product' ? cat._count.products : cat._count.articles} Konten
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Link href={`/admin/categories/edit/${cat.id}`} style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem' }}>Edit</Link>
                      <form action={async () => {
                        "use server";
                        await deleteCategory(cat.id);
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
