import Link from "next/link";
import { Mail, MapPin, Phone, Camera, Globe, MessageCircle } from "lucide-react";

export default function Footer({ settings }: { settings: Record<string, string> }) {
  const whatsappNumber = settings.contact_phone || "6281234567890";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <footer style={{ background: '#1a1d1a', color: 'white', padding: '80px 0 40px', marginTop: 'auto' }}>
      <div className="container">
        <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3" style={{ gap: '40px', marginBottom: '60px' }}>
          {/* Brand Column */}
          <div>
            <h3 className="font-heading" style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--accent-light)' }}>
              {settings.site_name || "UMKM KECE"}
            </h3>
            <p style={{ color: '#a0a0a0', fontSize: '0.95rem', lineHeight: 1.8 }}>
              {settings.site_description || "Membantu usaha kecil menengah naik kelas dengan teknologi digital yang modern dan elegan."}
            </p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '32px' }}>
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#a0a0a0', transition: 'color 0.3s' }}>
                  <Camera size={22} />
                </a>
              )}
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#a0a0a0' }}>
                  <Globe size={22} />
                </a>
              )}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#a0a0a0' }}>
                <MessageCircle size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '24px', color: 'white' }}>Navigasi Cepat</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><Link href="/products" style={{ color: '#a0a0a0', fontSize: '0.95rem' }}>Katalog Produk</Link></li>
              <li><Link href="/articles" style={{ color: '#a0a0a0', fontSize: '0.95rem' }}>Berita & Artikel</Link></li>
              <li><Link href="/gallery" style={{ color: '#a0a0a0', fontSize: '0.95rem' }}>Galeri Foto</Link></li>
              <li><Link href="/contact" style={{ color: '#a0a0a0', fontSize: '0.95rem' }}>Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '24px', color: 'white' }}>Hubungi Kami</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <li style={{ display: 'flex', gap: '12px', color: '#a0a0a0', fontSize: '0.95rem' }}>
                <MapPin size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>Jl. Inovasi No. 123, Indonesia</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', color: '#a0a0a0', fontSize: '0.95rem' }}>
                <Phone size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{settings.contact_phone || "+62 812-3456-7890"}</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', color: '#a0a0a0', fontSize: '0.95rem' }}>
                <Mail size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{settings.contact_email || "halo@umkm-kece.id"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ paddingTop: '40px', borderTop: '1px solid #333', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} {settings.site_name || "UMKM KECE"}. All rights reserved. 
        </div>
      </div>
    </footer>
  );
}
