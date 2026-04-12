"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTestimonial, updateTestimonial } from "@/app/actions/testimonials";
import { toast } from "sonner";
import Image from "next/image";
import { Save, UploadCloud, Link as LinkIcon, Star } from "lucide-react";

export function TestimonialFormClient({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || "");
  const [rating, setRating] = useState(initialData?.rating || 5);

  const handleUploadClick = () => {
    document.getElementById("avatar-upload")?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) throw new Error("Upload gagal");

      const result = await response.json();
      setAvatarUrl(result.url);
      toast.success("Foto berhasil diunggah!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah foto.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      content: formData.get("content") as string,
      avatarUrl: avatarUrl,
      rating: rating,
      order: parseInt(formData.get("order") as string) || 0,
      active: formData.get("active") === "on",
    };

    let result;
    if (initialData?.id) {
      result = await updateTestimonial(initialData.id, data);
    } else {
      result = await createTestimonial(data);
    }

    setLoading(false);

    if (result.success) {
      toast.success(initialData ? "Testimoni diperbarui!" : "Testimoni ditambahkan!");
      router.push("/admin/testimonials");
      router.refresh();
    } else {
      toast.error(result.error || "Terjadi kesalahan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '800px' }}>
      <div className="grid md-grid-cols-2" style={{ gap: '32px' }}>
        
        {/* Kolom Kiri - Foto & Rating */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            <label style={{ display: 'block', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem' }}>Foto Pelanggan (Opsional)</label>
            
            {avatarUrl ? (
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '4px solid white', boxShadow: 'var(--shadow)' }}>
                <Image src={avatarUrl} alt="Avatar" fill style={{ objectFit: 'cover' }} />
                <button 
                  type="button" 
                  onClick={() => setAvatarUrl("")}
                  style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div 
                onClick={handleUploadClick}
                style={{ 
                  width: '120px', height: '120px', margin: '0 auto', 
                  borderRadius: '50%', background: 'white', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                  cursor: 'pointer', border: '1px solid var(--border)', color: 'var(--text-secondary)'
                }}
              >
                {uploading ? "..." : <><UploadCloud size={24} style={{ marginBottom: '8px' }} /> <span style={{ fontSize: '0.75rem' }}>Upload</span></>}
              </div>
            )}
            <input type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '16px' }}>Rasio 1:1 disarankan. Maks: 2MB.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Rating</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <div 
                  key={star} 
                  onClick={() => setRating(star)}
                  style={{ 
                    cursor: 'pointer', 
                    color: star <= rating ? '#FFD700' : 'var(--border)', 
                    transition: 'var(--transition)'
                  }}
                >
                  <Star size={32} fill={star <= rating ? '#FFD700' : 'none'} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Berikan penilaian 1 hingga 5 bintang.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="order" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Urutan Tampilan</label>
            <input 
              type="number" 
              id="order" 
              name="order" 
              defaultValue={initialData?.order || 0}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: 'var(--bg-secondary)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <input 
              type="checkbox" 
              id="active" 
              name="active" 
              defaultChecked={initialData === null ? true : initialData.active}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
            <label htmlFor="active" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Tampilkan di Website</label>
          </div>

        </div>

        {/* Kolom Kanan - Data Teks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="name" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Nama Pelanggan / Perusahaan <span style={{ color: 'red' }}>*</span></label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              defaultValue={initialData?.name}
              required 
              placeholder="Contoh: Budi Santoso"
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="role" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Peran / Predikat</label>
            <input 
              type="text" 
              id="role" 
              name="role" 
              defaultValue={initialData?.role}
              placeholder="Contoh: Pengusaha Restoran, Ibu Rumah Tangga"
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <label htmlFor="content" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Isi Ulasan / Testimoni <span style={{ color: 'red' }}>*</span></label>
            <textarea 
              id="content" 
              name="content" 
              defaultValue={initialData?.content}
              required 
              rows={6}
              placeholder="Tuliskan pengalaman pelanggan di sini..."
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

        </div>
      </div>

      <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button 
          type="button" 
          onClick={() => router.push("/admin/testimonials")}
          className="btn btn-secondary"
        >
          Batal
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || uploading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} /> {loading ? "Menyimpan..." : "Simpan Testimoni"}
        </button>
      </div>
    </form>
  );
}
