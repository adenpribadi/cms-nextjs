"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertBanner } from "@/app/actions/banners";
import { uploadImage } from "@/app/actions/upload";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Save, X, Image as ImageIcon, Type, Layout, Link as LinkIcon, Hash } from "lucide-react";

export default function BannerFormClient({ banner }: { banner?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(banner?.imageUrl || null);
  
  const [formData, setFormData] = useState({
    id: banner?.id,
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    description: banner?.description || "",
    buttonText: banner?.buttonText || "",
    buttonLink: banner?.buttonLink || "",
    order: banner?.order || 0,
    active: banner?.active ?? true,
  });

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
      let imageUrl = banner?.imageUrl || "";
      
      if (imageFile) {
        toast.info("Mengunggah gambar banner...");
        const result = await uploadImage(imageFile);
        if (result) {
          imageUrl = result;
        } else {
          toast.error("Gagal mengunggah gambar.");
          setLoading(false);
          return;
        }
      }

      const res = await upsertBanner({
        ...formData,
        imageUrl
      });

      if (res.success) {
        toast.success(`Banner berhasil ${banner ? 'diperbarui' : 'dibuat'}!`);
        router.push("/admin/banners");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menyimpan banner.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/banners" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <h1 className="font-heading" style={{ fontSize: '1.8rem' }}>
          {banner ? 'Edit Banner Promo' : 'Tambah Banner Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg-grid-cols-3" style={{ gap: '32px' }}>
        <div className="lg-col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="premium-card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Informasi Visual & Teks</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Type size={16} /> Judul Utama (Heading)
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="misal: Koleksi Furnitur Premium"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layout size={16} /> Subjudul
                </label>
                <input 
                  type="text" 
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="misal: Diskon hingga 50%"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Deskripsi Singkat</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Berikan penjelasan singkat tentang promo ini..."
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={16} /> Gambar Banner (Ratio 16:9 disarankan)
                </label>
                <div style={{ 
                  border: '2px dashed var(--border)', 
                  padding: '32px', 
                  borderRadius: '12px', 
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  position: 'relative'
                }}>
                  {preview ? (
                    <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', display: 'block', margin: '0 auto' }} />
                  ) : (
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <ImageIcon size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
                      <p>Pilih atau Drag gambar ke sini</p>
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
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="premium-card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Aksi & Pengaturan</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Teks Tombol</label>
                <input 
                  type="text" 
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="misal: Cek Produk"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LinkIcon size={16} /> Link Tujuan
                </label>
                <input 
                  type="text" 
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="misal: /products atau link eksternal"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Hash size={16} /> Urutan Tampil
                </label>
                <input 
                  type="number" 
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                <input 
                  type="checkbox" 
                  id="active" 
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                />
                <label htmlFor="active" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Banner Aktif</label>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ flex: 1, padding: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Banner'}
            </button>
            <Link href="/admin/banners" className="btn btn-secondary" style={{ padding: '16px' }}>
              <X size={20} />
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
