import { db } from "@/lib/db";
import { LeadActions } from "@/components/LeadActions";

export default async function LeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Pesan Masuk (Leads)</h1>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {leads.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Belum ada pesan masuk dari pengunjung.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '16px' }}>Tanggal</th>
                <th style={{ padding: '16px' }}>Nama</th>
                <th style={{ padding: '16px' }}>Kontak</th>
                <th style={{ padding: '16px' }}>Pesan</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontSize: '0.85rem' }}>
                    {new Date(lead.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{lead.name}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem' }}>
                    {lead.email}<br />
                    <span style={{ color: 'var(--accent)' }}>{lead.phone}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ maxWidth: '300px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>{lead.subject}</strong><br />
                      {lead.message}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      background: lead.status === 'new' ? 'var(--accent-light)' : '#f0f0f0',
                      color: lead.status === 'new' ? 'var(--accent)' : '#666'
                    }}>
                      {lead.status === 'new' ? 'Baru' : 'Sudah Dibaca'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <LeadActions leadId={lead.id} status={lead.status} leadName={lead.name} leadPhone={lead.phone} />
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
