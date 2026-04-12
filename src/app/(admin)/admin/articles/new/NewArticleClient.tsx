"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { uploadImage } from "@/app/actions/upload";
import { upsertArticle } from "@/app/actions/articles";
import RichTextEditor from "@/components/RichTextEditor";
import { Search, Globe, ChevronRight } from "lucide-react";

export default function NewArticleClient({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugModified, setSlugModified] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    published: true,
    categoryId: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!slugModified && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, slugModified]);

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
      let imageUrl = "";
      if (imageFile) {
        toast.info("Mengunggah foto cover...");
        imageUrl = await uploadImage(imageFile) || "";
      }

      const result = await upsertArticle({
        ...formData,
        coverImage: imageUrl,
      });

      if (result.success) {
        toast.success("Artikel berhasil diterbitkan!");
        router.push("/admin/articles");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal membuat artikel.");
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
          <h1 className="font-heading" style={{ fontSize: '1.8rem' }}>Buat Artikel Baru</h1>
          
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
                  placeholder="Contoh: Tips Sukses UMKM..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Pilih Kategori</label>
                <select 
                  required
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
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setSlugModified(true);
                  }}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: '#f9f9f9' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Isi Artikel</label>
              <RichTextEditor 
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Tulis konten artikel Anda di sini..."
              />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Same SEO UI as Edit */}
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
          <label htmlFor="published" style={{ fontWeight: 500 }}>Terbitkan langsung artikel ini</label>
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ padding: '14px 24px', flex: 1 }}
          >
            {loading ? "Menyimpan..." : "Simpan & Publikasikan Artikel"}
          </button>
          <Link href="/admin/articles" className="btn btn-secondary" style={{ padding: '14px 24px' }}>
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
