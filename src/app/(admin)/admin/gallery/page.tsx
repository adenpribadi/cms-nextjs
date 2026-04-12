import { db } from "@/lib/db";
import { addGalleryItem } from "@/app/actions/gallery";
import { GalleryActions } from "@/components/GalleryActions";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/app/actions/upload";

export default async function AdminGalleryPage() {
  const items = await db.gallery.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function handleAdd(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const imageFile = formData.get("image") as File;
    
    if (imageFile && imageFile.size > 0) {
      // Use our uploadImage fallback utility
      const imageUrl = await uploadImage(imageFile);
      
      if (imageUrl) {
        await addGalleryItem({ title, imageUrl });
        revalidatePath("/admin/gallery");
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Galeri Foto</h1>
      </div>

      <div className="card" style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px' }}>Unggah Foto Baru</h3>
        <form action={handleAdd} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Pilih Foto</label>
            <input 
              name="image" 
              type="file" 
              required 
              accept="image/*"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white' }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Judul (Opsional)</label>
            <input 
              name="title" 
              type="text" 
              placeholder="Kegiatan UMKM..."
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', height: '46px' }}>
            Tambah
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        {items.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Belum ada foto di galeri.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="card" style={{ padding: '12px' }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', marginBottom: '12px' }}>
                <img 
                  src={item.imageUrl} 
                  alt={item.title || ""} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.title || "Tanpa Judul"}</p>
                <GalleryActions itemId={item.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
