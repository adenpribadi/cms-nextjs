"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-layout" style={{ 
      display: 'flex',
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
    }}>
      {/* Sidebar Container */}
      <aside className={`glass-sidebar sidebar ${isSidebarOpen ? 'is-open' : ''}`} style={{ 
        borderRight: '1px solid var(--border)', 
        padding: '32px 24px', 
        position: 'fixed', 
        top: 0, 
        left: 0,
        bottom: 0,
        width: '280px',
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: '10px 0 30px rgba(0,0,0,0.02)',
      }}>
        <div style={{ padding: '0 8px', marginBottom: '48px' }}>
          <h2 className="font-heading" style={{ color: 'var(--accent)', fontSize: '1.4rem' }}>
            UMKM Dashboard
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Professional Edition
          </p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <Link href="/admin/dashboard" onClick={() => setIsSidebarOpen(false)} className="nav-item">📊 &nbsp; Dashboard</Link>
          <Link href="/admin/banners" onClick={() => setIsSidebarOpen(false)} className="nav-item">🖼️ &nbsp; Banner Hero</Link>
          <div style={{ margin: '16px 8px 8px', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Manajemen</div>
          <Link href="/admin/products" onClick={() => setIsSidebarOpen(false)} className="nav-item">📦 &nbsp; Produk</Link>
          <Link href="/admin/categories" onClick={() => setIsSidebarOpen(false)} className="nav-item">🗂️ &nbsp; Kategori</Link>
          <Link href="/admin/articles" onClick={() => setIsSidebarOpen(false)} className="nav-item">📝 &nbsp; Artikel</Link>
          <Link href="/admin/gallery" onClick={() => setIsSidebarOpen(false)} className="nav-item">🖼️ &nbsp; Galeri</Link>
          
          <div style={{ margin: '16px 8px 8px', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Interaksi</div>
          <Link href="/admin/testimonials" onClick={() => setIsSidebarOpen(false)} className="nav-item">⭐ &nbsp; Testimoni</Link>
          <Link href="/admin/leads" onClick={() => setIsSidebarOpen(false)} className="nav-item">📧 &nbsp; Pesan Masuk</Link>
          <Link href="/admin/settings" onClick={() => setIsSidebarOpen(false)} className="nav-item">⚙️ &nbsp; Pengaturan</Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
              {session?.user?.name?.[0].toUpperCase() || 'A'}
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{session?.user?.name || 'Administrator'}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Admin Status</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn btn-secondary" 
            style={{ width: '100%', textAlign: 'left', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            🚪 &nbsp; Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Navbar */}
        <header className="mobile-only" style={{ 
          background: 'rgba(255,255,255,0.8)', 
          backdropFilter: 'blur(10px)',
          padding: '0 20px', 
          height: '64px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 500
        }}>
          <h2 className="font-heading" style={{ color: 'var(--accent)', fontSize: '1rem' }}>Admin Panel</h2>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ 
              background: 'var(--accent)', 
              color: 'white',
              padding: '6px 12px', 
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            {isSidebarOpen ? '✕' : 'Menu'}
          </button>
        </header>

        {/* Desktop Title Bar (Sticky) */}
        <header className="mobile-hide" style={{ 
          height: '80px', 
          padding: '0 40px', 
          display: 'flex', 
          alignItems: 'center', 
          background: 'transparent',
          position: 'sticky',
          top: 0,
          zIndex: 400
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Admin / <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Overview</span>
          </div>
        </header>

        <main style={{ padding: '0 40px 40px', minWidth: 0 }} className="admin-main">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="mobile-only"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.3)', 
            zIndex: 900,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.3s ease'
          }} 
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar {
          transform: translateX(-110%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar.is-open {
          transform: translateX(0);
        }
        
        .nav-item {
          padding: 10px 16px;
          border-radius: 10px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          display: block;
        }
        .nav-item:hover {
          background: var(--bg-secondary);
          color: var(--accent);
          transform: translateX(4px);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @media (min-width: 769px) {
          .sidebar {
            transform: translateX(0) !important;
            position: sticky !important;
          }
          .admin-layout {
            padding-left: 0;
          }
        }
        
        @media (max-width: 768px) {
          .admin-main {
            padding: 24px 16px !important;
          }
        }
      `}} />
    </div>
  );
}
