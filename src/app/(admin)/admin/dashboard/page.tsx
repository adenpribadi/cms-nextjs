import { db } from "@/lib/db";
import { LeadTrendChart, CategoryDistributionChart } from "@/components/DashboardCharts";
import { 
  Package, 
  FileText, 
  MessageCircle, 
  Layout, 
  TrendingUp,
  Clock,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const productCount = await db.product.count();
  const articleCount = await db.article.count();
  const leadCount = await db.lead.count({ where: { status: "new" } });
  const galleryCount = await db.gallery.count();
  const bannerCount = await db.banner.count();
  
  // Aggregate Leads by Month (Last 6 Months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const leadsTrendRaw = await db.lead.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true }
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const trendsMap: Record<string, number> = {};
  
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = months[d.getMonth()];
    trendsMap[label] = 0;
  }

  leadsTrendRaw.forEach(lead => {
    const label = months[lead.createdAt.getMonth()];
    if (trendsMap[label] !== undefined) {
      trendsMap[label]++;
    }
  });

  const trendsData = Object.entries(trendsMap)
    .map(([name, total]) => ({ name, total }))
    .reverse();

  const categoriesRaw = await db.category.findMany({
    where: { type: 'product' },
    include: { _count: { select: { products: true } } }
  });

  const categoryData = categoriesRaw.map(cat => ({
    name: cat.name,
    value: cat._count.products
  })).filter(c => c.value > 0);

  const recentLeads = await db.lead.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in">
      <div className="flex-between-responsive" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '4px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Statistik performa konten dan interaksi pelanggan Anda.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: 'max-content' }}>
            <Link href="/" target="_blank" className="btn" style={{ background: 'white', border: '1px solid var(--border)', fontSize: '0.85rem', width: '100%', textAlign: 'center' }}>
                <ArrowUpRight size={16} style={{ marginRight: '6px' }} /> Lihat Web
            </Link>
        </div>
      </div>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-4" style={{ marginBottom: '40px' }}>
        <div className="premium-card" style={{ background: 'var(--accent)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ opacity: 0.8, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leads Baru</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '8px 0' }}>{leadCount}</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
              <MessageCircle size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> Perlu ditanggapi segera
          </p>
        </div>

        <div className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Produk</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>{productCount}</h2>
            </div>
            <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '12px', color: 'var(--accent)' }}>
              <Package size={24} />
            </div>
          </div>
          <Link href="/admin/products" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Kelola Produk <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Artikel</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>{articleCount}</h2>
            </div>
            <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '12px', color: 'var(--accent)' }}>
              <FileText size={24} />
            </div>
          </div>
          <Link href="/admin/articles" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Kelola Blog <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hero Banner</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>{bannerCount}</h2>
            </div>
            <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '12px', color: 'var(--accent)' }}>
              <Layout size={24} />
            </div>
          </div>
          <Link href="/admin/banners" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Atur Hero <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md-grid-cols-2" style={{ marginBottom: '40px' }}>
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="font-heading" style={{ fontSize: '1.2rem' }}>Pertumbuhan Leads (6 Bulan)</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '4px 12px', borderRadius: '20px' }}>Tren Bulanan</span>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <LeadTrendChart data={trendsData} />
          </div>
        </div>
        
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="font-heading" style={{ fontSize: '1.2rem' }}>Distribusi Produk</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '4px 12px', borderRadius: '20px' }}>Per Kategori</span>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <CategoryDistributionChart data={categoryData} />
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="premium-card">
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="font-heading" style={{ fontSize: '1.2rem' }}>Pesan Kontak Terbaru</h3>
            <Link href="/admin/leads" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>Lihat Semua</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {recentLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Clock size={40} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                <p style={{ color: 'var(--text-secondary)' }}>Belum ada pesan masuk dari pengunjung.</p>
            </div>
          ) : (
            recentLeads.map((lead, i) => (
              <div key={lead.id} style={{ 
                padding: '16px 0', 
                borderBottom: i === recentLeads.length - 1 ? 'none' : '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: 0 }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: lead.status === 'new' ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: lead.status === 'new' ? 'white' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{lead.name}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.subject || lead.message}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(lead.createdAt))}
                  </p>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '3px 12px', 
                    borderRadius: '20px', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: lead.status === 'new' ? 'var(--accent-light)' : 'var(--bg-secondary)',
                    color: lead.status === 'new' ? 'var(--accent)' : 'var(--text-secondary)'
                  }}>
                    {lead.status === 'new' ? 'Baru' : 'Selesai'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
