"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { upsertProduct, checkSlugExists } from "@/app/actions/products";
import { uploadImage } from "@/app/actions/upload";
import { toast } from "sonner";
import Link from "next/link";
import { Package, Tag, DollarSign, Image as ImageIcon, Star, ArrowLeft, Save, X } from "lucide-react";

export default function NewProductClient({ categories }: { categories: any[] }) {
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  
  const router = useRouter();

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };

  useEffect(() => {
    if (!slug) {
      setSlugError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      const exists = await checkSlugExists(slug);
      if (exists) {
        setSlugError("Slug sudah digunakan.");
      } else {
        setSlugError(null);
      }
      setIsCheckingSlug(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (slugError) {
      toast.error("Silakan perbaiki kesalahan pada slug.");
      return;
    }
    
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image") as File;
    let imageUrl = "";

    if (imageFile && imageFile.size > 0) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const data = {
      name: name,
      slug: slug,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      image: imageUrl,
      categoryId: categoryId,
      featured: formData.get("featured") === "on",
    };

    const result = await upsertProduct(data);

    if (result.success) {
      toast.success("Produk berhasil disimpan!");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error(result.error || "Terjadi kesalahan.");
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
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
          <ArrowLeft size={18} /> Kembali ke Koleksi
        </Link>
        <h1 className="font-heading" style={{ fontSize: '2rem' }}>Tambah Produk Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg-grid-cols-3" style={{ gap: '32px' }}>
        <div className="lg-col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="premium-card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Informasi Produk</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} /> Nama Produk
                </label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={handleNameChange}
                  placeholder="misal: Meja Minimalis"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Slug URL</label>
                <input 
                  required
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: `1px solid ${slugError ? 'red' : 'var(--border)'}`,
                    fontSize: '1rem' 
                  }}
                />
                {slugError && <p style={{ fontSize: '0.75rem', color: 'red' }}>{slugError}</p>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Deskripsi Lengkap</label>
                <textarea 
                  name="description"
                  rows={6}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="premium-card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Detail & Kategori</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} /> Harga (Rp)
                </label>
                <input 
                  required
                  name="price"
                  type="number" 
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={16} /> Pilih Kategori
                </label>
                <select 
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: 'white' }}
                >
                  <option value="">Pilih Kategori...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Belum ada kategori? <Link href="/admin/categories/new" style={{ color: 'var(--accent)', fontWeight: 600 }}>Tambah di sini</Link>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="featured" id="featured" />
                <label htmlFor="featured" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Produk Unggulan</label>
              </div>
            </div>
          </div>

          <div className="premium-card">
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Foto Utama</h3>
            <input 
              name="image" 
              type="file" 
              accept="image/*"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ flex: 1, padding: '16px', fontWeight: 700 }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
            <button type="button" onClick={() => router.back()} className="btn btn-secondary">
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
