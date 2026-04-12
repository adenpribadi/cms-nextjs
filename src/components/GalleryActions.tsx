"use client";

import { deleteGalleryItem } from "@/app/actions/gallery";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GalleryActions({ itemId }: { itemId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Hapus foto ini dari galeri?")) {
      const result = await deleteGalleryItem(itemId);
      if (result.success) {
        toast.success("Foto berhasil dihapus.");
        router.refresh();
      } else {
        toast.error("Gagal menghapus foto.");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.2rem' }}
    >
      🗑️
    </button>
  );
}
