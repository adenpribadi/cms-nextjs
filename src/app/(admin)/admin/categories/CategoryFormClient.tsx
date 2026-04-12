"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { upsertCategory } from "@/app/actions/categories";
import { ArrowLeft, Save, X } from "lucide-react";

export default function CategoryFormClient({ category }: { category?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: category?.id,
    name: category?.name || "",
    slug: category?.slug || "",
    type: category?.type || "product",
  });

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await upsertCategory(formData);
      if (result.success) {
        toast.success(`Kategori berhasil ${category ? 'diperbarui' : 'dibuat'}!`);
        router.push("/admin/categories");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menyimpan kategori.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/categories" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'var(--accent)', 
          fontSize: '0.9rem', 
          fontWeight: 600,
          marginBottom: '12px',
          textDecoration: 'none'
        }}>
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <h1 className="font-heading" style={{ fontSize: '1.8rem' }}>
          {category ? 'Edit Kategori' : 'Tambah Kategori Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Tipe Kategori</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '8px', 
              border: `2px solid ${formData.type === 'product' ? 'var(--accent)' : 'var(--border)'}`,
              background: formData.type === 'product' ? 'var(--accent-light)' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <input 
                type="radio" 
                name="type" 
                value="product" 
                checked={formData.type === 'product'} 
                onChange={() => setFormData({ ...formData, type: 'product' })}
                style={{ accentColor: 'var(--accent)' }}
              />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>📦 Produk</span>
            </label>
            <label style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '8px', 
              border: `2px solid ${formData.type === 'article' ? '#1976d2' : 'var(--border)'}`,
              background: formData.type === 'article' ? '#e3f2fd' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <input 
                type="radio" 
                name="type" 
                value="article" 
                checked={formData.type === 'article'} 
                onChange={() => setFormData({ ...formData, type: 'article' })}
                style={{ accentColor: '#1976d2' }}
              />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>📝 Artikel</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nama Kategori</label>
          <input 
            required
            type="text" 
            placeholder="misal: Furniture Lokal"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Slug URL</label>
          <input 
            required
            type="text" 
            placeholder="furniture-lokal"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: '#f9f9f9', color: 'var(--text-secondary)' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Digunakan untuk URL halaman kategori.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Kategori'}
          </button>
          <Link href="/admin/categories" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <X size={18} /> Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
