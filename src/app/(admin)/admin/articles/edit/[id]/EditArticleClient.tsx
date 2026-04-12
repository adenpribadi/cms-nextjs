"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { uploadImage } from "@/app/actions/upload";
import { upsertArticle } from "@/app/actions/articles";
import RichTextEditor from "@/components/RichTextEditor";
import { Search, Globe, ChevronRight } from "lucide-react";

export default function EditArticleClient({ 
  article, 
  categories 
}: { 
  article: any, 
  categories: any[] 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  
  const [formData, setFormData] = useState({
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    published: article.published,
    categoryId: article.categoryId || "",
    seoTitle: article.seoTitle || "",
    seoDescription: article.seoDescription || "",
    seoKeywords: article.seoKeywords || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(article.coverImage || null);

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
      let imageUrl = article.coverImage;
      if (imageFile) {
        toast.info("Mengunggah foto cover baru...");
        imageUrl = await uploadImage(imageFile) || article.coverImage;
      }

      const result = await upsertArticle({
        ...formData,
        coverImage: imageUrl,
      });

      if (result.success) {
        toast.success("Artikel berhasil diperbarui!");
        router.push("/admin/articles");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal memperbarui artikel.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/articles" style={{ color: 'var(--accent)', fontSize: '0.9rem', display: 'inline-block', marginBottom: '12px' }}>
          &larr; Kembali ke Daftar
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="font-heading" style={{ fontSize: '1.8rem' }}>Edit Artikel</h1>
          
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', gap: '4px' }}>
            <button 
              onClick={() => setActiveTab("content")}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                fontWeight: 600,
                background: activeTab === "content" ? 'white' : 'transparent',
                boxShadow: activeTab === "content" ? 'var(--shadow-sm)' : 'none',
                color: activeTab === "content" ? 'var(--accent)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Konten Utama
            </button>
            <button 
              onClick={() => setActiveTab("seo")}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                fontWeight: 600,
                background: activeTab === "seo" ? 'white' : 'transparent',
                boxShadow: activeTab === "seo" ? 'var(--shadow-sm)' : 'none',
                color: activeTab === "seo" ? 'var(--accent)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Pengaturan SEO
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {activeTab === "content" ? (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="grid grid-cols-1 md-grid-cols-3">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Judul Artikel</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Kategori</label>
                <select 
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: 'white' }}
                >
                  <option value="">Pilih Kategori...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Slug URL</label>
                <input 
                  required
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: '#f9f9f9' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Cover Artikel</label>
              <div style={{ 
                border: '2px dashed var(--border)', 
                padding: '32px', 
                borderRadius: '12px', 
                textAlign: 'center',
                background: 'var(--bg-secondary)',
                position: 'relative'
              }}>
                {preview ? (
                  <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', display: 'block', margin: '0 auto 16px' }} />
                ) : (
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <span style={{ fontSize: '2.5rem' }}>🖼️</span>
                    <p style={{ marginTop: '12px' }}>Ganti foto cover</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Isi Artikel (Visual Editor)</label>
              <RichTextEditor 
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Google Preview Simulation */}
            <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px', border: '1px solid #dfe1e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#70757a', fontSize: '0.85rem' }}>
                <Search size={14} />
                <span>Pratinjau Hasil Pencarian Google</span>
              </div>
              
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(32,33,36,.28)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: '#202124', marginBottom: '4px' }}>
                  <Globe size={14} style={{ color: '#70757a' }} />
                  <span>umkm-kece.id</span>
                  <ChevronRight size={14} style={{ color: '#70757a' }} />
                  <span style={{ color: '#70757a' }}>articles</span>
                  <ChevronRight size={14} style={{ color: '#70757a' }} />
                  <span style={{ color: '#70757a' }}>{formData.slug || 'slug-artikel'}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#1a0dab', margin: '0 0 4px', fontWeight: 'normal' }}>
                  {formData.seoTitle || formData.title || "Judul SEO Artikel Muncul di Sini"}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#4d5156', margin: 0, lineHeight: 1.5 }}>
                  {formData.seoDescription || "Tulis deskripsi meta yang menarik agar pelanggan mengklik artikel Anda. Jika dibiarkan kosong, Google akan mengambil potongan isi artikel secara otomatis."}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>SEO Title (Meta Title)</label>
                  <span style={{ fontSize: '0.8rem', color: (formData.seoTitle || formData.title).length > 60 ? 'red' : 'var(--text-secondary)' }}>
                    {(formData.seoTitle || formData.title).length}/60 karakter
                  </span>
                </div>
                <input 
                  type="text" 
                  placeholder="Kosongkan untuk menyamakan dengan judul artikel"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>SEO Description (Meta Description)</label>
                  <span style={{ fontSize: '0.8rem', color: formData.seoDescription.length > 160 ? 'red' : 'var(--text-secondary)' }}>
                    {formData.seoDescription.length}/160 karakter
                  </span>
                </div>
                <textarea 
                  rows={3}
                  placeholder="Tulis ringkasan singkat artikel di sini..."
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>SEO Keywords (Kata Kunci)</label>
                <input 
                  type="text" 
                  placeholder="bisnis lokal, tips umkm, kesuksesan digital"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="checkbox" 
            id="published" 
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
          />
          <label htmlFor="published" style={{ fontWeight: 500 }}>Terbitkan artikel ini</label>
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ padding: '14px 24px', flex: 1 }}
          >
            {loading ? "Menyimpan Perubahan..." : "Update Artikel"}
          </button>
          <Link href="/admin/articles" className="btn btn-secondary" style={{ padding: '14px 24px' }}>
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
