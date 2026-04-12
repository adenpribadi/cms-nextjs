"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar({ settings }: { settings: Record<string, string> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar" style={{ 
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      background: 'rgba(252, 253, 250, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        height: '80px'
      }}>
        <Link href="/" className="font-heading" style={{ display: 'flex', alignItems: 'center' }}>
          {settings.site_logo ? (
            <img src={settings.site_logo} alt={settings.site_name} style={{ height: '40px', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '1.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>
              {settings.site_name || "UMKM KECE"}
            </span>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="mobile-hide" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/products" style={{ fontWeight: 500 }}>Produk</Link>
          <Link href="/articles" style={{ fontWeight: 500 }}>Artikel</Link>
          <Link href="/gallery" style={{ fontWeight: 500 }}>Galeri</Link>
          <Link href="/contact" className="btn btn-primary">Hubungi Kami</Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-only" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', fontSize: '1.5rem', padding: '8px' }}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-only" style={{ 
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          borderBottom: '1px solid var(--border)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 10px 15px rgba(0,0,0,0.05)',
          animation: 'fadeInUp 0.3s ease'
        }}>
          <Link href="/products" onClick={() => setIsOpen(false)} style={{ fontWeight: 500, fontSize: '1.1rem' }}>Produk</Link>
          <Link href="/articles" onClick={() => setIsOpen(false)} style={{ fontWeight: 500, fontSize: '1.1rem' }}>Artikel</Link>
          <Link href="/gallery" onClick={() => setIsOpen(false)} style={{ fontWeight: 500, fontSize: '1.1rem' }}>Galeri</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ textAlign: 'center' }}>Hubungi Kami</Link>
        </div>
      )}
    </nav>
  );
}
