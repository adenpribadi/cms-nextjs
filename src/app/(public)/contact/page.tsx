"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setWaUrl(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);
    
    if (result.success) {
      toast.success(result.success);
      if (result.waUrl) {
        setWaUrl(result.waUrl);
      }
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error || "Gagal mengirim pesan.");
    }
    setLoading(false);
  }

  return (
    <div className="contact-page">
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container animate-fade-in" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Hubungi Kami</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Punya pertanyaan atau ingin melakukan pemesanan? Jangan ragu untuk mengirimkan pesan kepada kami.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '60px' }}>
            <div>
              <h2 style={{ marginBottom: '24px' }}>Informasi Kontak</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '50%', color: 'var(--accent)' }}>📍</div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Alamat</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>Jl. Wirausaha No. 123, Jakarta, Indonesia</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '50%', color: 'var(--accent)' }}>📞</div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Telepon / WhatsApp</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>+62 812 3456 7890</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '50%', color: 'var(--accent)' }}>✉️</div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Email</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>info@umkmkece.com</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '40px', padding: '24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                <h4 style={{ marginBottom: '12px' }}>Jam Operasional</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Senin - Jumat: 09:00 - 17:00</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sabtu: 10:00 - 14:00</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Minggu: Tutup</p>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '24px' }}>Kirim Pesan</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="name" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="email" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Alamat Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="phone" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Nomor WhatsApp (Aktif)</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="Contoh: 08123456789"
                    required 
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="subject" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Subjek (Opsional)</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="message" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Pesan</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required 
                    rows={4}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', resize: 'vertical' }}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                  style={{ marginTop: '8px', padding: '14px' }}
                >
                  {loading ? 'Mengirim...' : 'Kirim Sekarang'}
                </button>

                {waUrl && (
                  <div className="animate-fade-up" style={{ marginTop: '16px', padding: '16px', background: 'var(--accent-light)', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Ingin respon lebih cepat?
                    </p>
                    <a 
                      href={waUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ 
                        background: '#25D366', 
                        borderColor: '#25D366', 
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <MessageCircle size={18} /> Lanjutkan ke WhatsApp
                    </a>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
