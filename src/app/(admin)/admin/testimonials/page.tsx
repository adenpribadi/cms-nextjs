import { db } from "@/lib/db";
import Link from "next/link";
import { TestimonialActions } from "@/components/TestimonialActions";
import { Plus, MessageSquareQuote } from "lucide-react";
import Image from "next/image";

export default async function TestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '4px' }}>Manajemen Testimoni</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Kelola ulasan dan testimoni pelanggan Anda.</p>
        </div>
        <Link href="/admin/testimonials/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Tambah Testimoni
        </Link>
      </div>

      <div className="admin-table-wrapper">
        {testimonials.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <MessageSquareQuote size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
            <p>Belum ada testimoni.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Klik tombol Tambah Testimoni untuk mulai menampilkan ulasan pelanggan.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pelanggan</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ulasan</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {testimonial.avatarUrl ? (
                        <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                          <Image src={testimonial.avatarUrl} alt={testimonial.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{testimonial.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{testimonial.role || 'Pelanggan'}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', maxWidth: '300px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{testimonial.content}"
                    </p>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', color: '#FFD700', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ opacity: i < testimonial.rating ? 1 : 0.3 }}>★</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      background: testimonial.active ? 'var(--accent-light)' : '#f0f0f0',
                      color: testimonial.active ? 'var(--accent)' : '#666',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {testimonial.active ? 'Aktif' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <TestimonialActions id={testimonial.id} active={testimonial.active} />
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
