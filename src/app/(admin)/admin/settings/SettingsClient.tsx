"use client";

import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { uploadImage } from "@/app/actions/upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Layout, Share2, BarChart3, Globe, Save, Upload, Camera, Link as LinkIcon, MessageCircle, AlertCircle } from "lucide-react";

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings.site_logo || null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data: Record<string, string> = {};
      
      formData.forEach((value, key) => {
        if (key !== "logo_file") {
          data[key] = value as string;
        }
      });

      // Handle logo upload
      if (logoFile) {
        toast.info("Mengunggah logo baru...");
        const logoUrl = await uploadImage(logoFile);
        if (logoUrl) {
          data["site_logo"] = logoUrl;
        }
      }

      const result = await updateSettings(data);
      if (result.success) {
        toast.success("Pengaturan profesional berhasil diperbarui!");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal memperbarui pengaturan.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="font-heading" style={{ fontSize: '2rem' }}>Konfigurasi Website Profesional</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Atur identitas brand, media sosial, dan integrasi analitik Anda.</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', maxWidth: '1000px' }}>
        
        <div className="grid grid-cols-1 md-grid-cols-2" style={{ gap: '32px' }}>
          {/* Identity & Branding */}
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layout size={20} color="var(--accent)" /> Identitas & Branding
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Logo Website</label>
              <div style={{ 
                border: '2px dashed var(--border)', 
                padding: '20px', 
                borderRadius: '12px', 
                textAlign: 'center',
                background: 'var(--bg-secondary)',
                position: 'relative'
              }}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" style={{ maxHeight: '60px', margin: '0 auto', display: 'block' }} />
                ) : (
                  <div style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                    <Upload size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.8rem' }}>Upload Logo (PNG/SVG)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  name="logo_file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nama Bisnis</label>
              <input 
                name="site_name" 
                defaultValue={initialSettings.site_name}
                type="text" 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email Publik</label>
              <input 
                name="contact_email" 
                defaultValue={initialSettings.contact_email}
                type="email" 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
            </div>
          </div>

          {/* Social Media Hub */}
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Share2 size={20} color="var(--accent)" /> Media Sosial & WhatsApp
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ color: '#E1306C' }}><Camera size={20} /></div>
                <input 
                  name="social_instagram" 
                  defaultValue={initialSettings.social_instagram}
                  placeholder="Link Instagram"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ color: '#1877F2' }}><LinkIcon size={20} /></div>
                <input 
                  name="social_facebook" 
                  defaultValue={initialSettings.social_facebook}
                  placeholder="Link Facebook"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ color: '#25D366' }}><MessageCircle size={20} /></div>
                <input 
                  name="contact_phone" 
                  defaultValue={initialSettings.contact_phone}
                  placeholder="Nomor WhatsApp (misal: 62812...)"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ color: '#000000' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </div>
                <input 
                  name="social_tiktok" 
                  defaultValue={initialSettings.social_tiktok}
                  placeholder="Link TikTok"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
              <AlertCircle size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Link ini akan otomatis terhubung ke ikon di bagian bawah (footer) website.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md-grid-cols-2" style={{ gap: '32px' }}>
          {/* SEO & Meta */}
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={20} color="var(--accent)" /> Global SEO
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Meta Description Utama</label>
              <textarea 
                name="site_description" 
                defaultValue={initialSettings.site_description}
                rows={3}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }}
              ></textarea>
            </div>
          </div>

          {/* Analytics integration */}
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={20} color="var(--accent)" /> Integrasi & Analitik
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Google Analytics Tag ID (G-XXXXXXX)</label>
              <input 
                name="analytics_id" 
                defaultValue={initialSettings.analytics_id}
                placeholder="G-ABC123XYZ"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Masukkan ID dari Google Analytics 4 untuk melacak performa kunjungan.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1" style={{ gap: '32px' }}>
          {/* Notification Settings */}
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageCircle size={20} color="var(--accent)" /> Pengaturan Notifikasi Leads
            </h3>
            <div className="grid grid-cols-1 md-grid-cols-2" style={{ gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>WhatsApp Notifikasi Admin</label>
                <input 
                  name="notification_whatsapp" 
                  defaultValue={initialSettings.notification_whatsapp}
                  placeholder="62812345678"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nomor ini akan menerima redirect chat dari pengunjung.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email Notifikasi Admin</label>
                <input 
                  name="notification_email" 
                  defaultValue={initialSettings.notification_email}
                  placeholder="admin@email.com"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email untuk alert pesan masuk baru.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', bottom: '24px', zIndex: 10 }}>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '18px', 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              boxShadow: '0 10px 20px rgba(74, 103, 65, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <Save size={20} /> {loading ? "Menyimpan Perubahan..." : "Simpan Semua Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
