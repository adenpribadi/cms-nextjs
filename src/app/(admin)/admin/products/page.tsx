import { db } from "@/lib/db";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/products";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Manajemen Produk</h1>
        <Link href="/admin/products/new" className="btn btn-primary">+ Tambah Produk</Link>
      </div>

      <div className="admin-table-wrapper">
        {products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Belum ada produk. Klik "+ Tambah Produk" untuk memulai.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Produk</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Kategori</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Harga</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Tampil</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '44px', height: '44px', background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden' }}>
                        {p.image ? (
                          <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : null}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', fontSize: '0.8rem' }}>
                      {p.category || 'Umum'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 500 }}>
                    Rp {p.price.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {p.featured ? (
                      <span style={{ color: '#e67e22', fontSize: '0.8rem', fontWeight: 600, background: '#fef5e7', padding: '4px 8px', borderRadius: '4px' }}>⭐ Unggulan</span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Reguler</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Link href={`/admin/products/edit/${p.id}`} style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>Edit</Link>
                      <form action={async () => {
                        "use server";
                        await deleteProduct(p.id);
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
