"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { uploadImage } from "@/app/actions/upload";
import { upsertProduct } from "@/app/actions/products";
import { Package, Tag, DollarSign, Image as ImageIcon, Star, ArrowLeft } from "lucide-react";

export default function EditProductClient({ 
  product, 
  categories 
}: { 
  product: any, 
  categories: any[] 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    price: product.price,
    category: product.category || "",
    categoryId: product.categoryId || "",
    featured: product.featured,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product.image;
      if (imageFile) {
        toast.info("Mengunggah foto produk baru...");
        imageUrl = await uploadImage(imageFile) || product.image;
      }

      const result = await upsertProduct({
        ...formData,
        image: imageUrl,
      });

      if (result.success) {
        toast.success("Produk berhasil diperbarui!");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal memperbarui produk.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/products" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'var(--accent)', 
          fontSize: '0.95rem', 
          fontWeight: 600,
          marginBottom: '16px',
          textDecoration: 'none'
        }}>
          <ArrowLeft size={18} /> Kembali ke Koleksi Produk
        </Link>
        <h1 className="font-heading" style={{ fontSize: '2rem' }}>Edit Produk: {product.name}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg-grid-cols-3" style={{ gap: '32px' }}>
        {/* Main Info */}
        <div className="lg-col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="premium-card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Informasi Dasar
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} /> Nama Produk
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Slug URL (Unik)</label>
                <input 
                  required
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: '#f9f9f9', color: '#666' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Deskripsi Produk</label>
                <textarea 
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', resize: 'vertical' }}
                  placeholder="Ceritakan kelebihan dan detail produk Anda..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Price & Category */}
          <div className="premium-card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Detail Penjualan
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} /> Harga (Rp)
                </label>
                <input 
                  required
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={16} /> Kategori
                </label>
                <select 
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: 'white' }}
                >
                  <option value="">Pilih Kategori...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Gunakan <Link href="/admin/categories" style={{ color: 'var(--accent)', fontWeight: 600 }}>Manajemen Kategori</Link> untuk menambah pilihan.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <input 
                  type="checkbox" 
                  id="featured" 
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                />
                <label htmlFor="featured" style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={14} fill={formData.featured ? 'gold' : 'none'} color={formData.featured ? 'gold' : 'currentColor'} />
                  Produk Unggulan
                </label>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="premium-card">
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Foto Produk
            </h3>
            <div style={{ 
              border: '2px dashed var(--border)', 
              padding: '16px', 
              borderRadius: '12px', 
              textAlign: 'center',
              background: 'var(--bg-secondary)',
              position: 'relative'
            }}>
              {preview ? (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '8px', display: 'block' }} />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '8px', 
                    right: '8px', 
                    background: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    Ganti Foto
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>
                  <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem' }}>Klik untuk upload</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
              * Gunakan rasio 1:1 untuk tampilan terbaik di katalog.
            </p>
          </div>

          {/* Action Button */}
          <div style={{ marginTop: '8px' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ padding: '16px 24px', width: '100%', fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? "Menyimpan..." : "Update Produk"}
            </button>
            <Link href="/admin/products" style={{ 
              display: 'block', 
              textAlign: 'center', 
              marginTop: '16px', 
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              Batal
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
