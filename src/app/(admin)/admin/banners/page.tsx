import { db } from "@/lib/db";
import Link from "next/link";
import { BannerActions } from "@/components/BannerActions";

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '2rem' }}>Manajemen Banner</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Atur banner promo yang akan tampil di halaman utama.</p>
        </div>
        <Link href="/admin/banners/new" className="btn btn-primary" style={{ padding: '10px 24px' }}>
          + Tambah Banner
        </Link>
      </div>

      <div className="admin-table-wrapper">
        {banners.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🖼️</div>
            <h3>Belum Ada Banner</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Mulai buat banner profesional untuk menarik perhatian pelanggan.</p>
            <Link href="/admin/banners/new" className="btn btn-primary">Buat Banner Sekarang</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3" style={{ gap: '24px' }}>
            {banners.map((banner) => (
              <div key={banner.id} className="premium-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {!banner.active && (
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      background: 'rgba(0,0,0,0.5)', 
                      backdropFilter: 'blur(2px)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>
                      NONAKTIF
                    </div>
                  )}
                </div>
                <div style={{ padding: '0 4px', flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{banner.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                    {banner.subtitle || "Tidak ada subjudul"}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href={`/admin/banners/edit/${banner.id}`} style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem' }}>Edit</Link>
                    <BannerActions bannerId={banner.id} active={banner.active} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Urutan: {banner.order}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
