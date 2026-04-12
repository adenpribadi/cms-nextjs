"use client";

import { deleteTestimonial, toggleTestimonialActive } from "@/app/actions/testimonials";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export function TestimonialActions({ id, active }: { id: string, active: boolean }) {
  const router = useRouter();

  const handleToggle = async () => {
    const result = await toggleTestimonialActive(id, !active);
    if (result.success) {
      toast.success(active ? "Testimoni disembunyikan." : "Testimoni ditampilkan.");
      router.refresh();
    } else {
      toast.error("Gagal mengubah status testimoni.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      const result = await deleteTestimonial(id);
      if (result.success) {
        toast.success("Testimoni berhasil dihapus.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button 
        onClick={handleToggle}
        title={active ? "Sembunyikan" : "Tampilkan"}
        style={{ 
          background: active ? '#fff1f1' : 'var(--accent-light)', 
          border: 'none', 
          color: active ? '#ff4d4f' : 'var(--accent)', 
          cursor: 'pointer', 
          padding: '8px', 
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {active ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <Link 
        href={`/admin/testimonials/edit/${id}`}
        title="Edit"
        style={{ 
          background: 'var(--bg-secondary)', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          padding: '8px', 
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Pencil size={16} />
      </Link>
      <button 
        onClick={handleDelete}
        title="Hapus"
        style={{ 
          background: '#fff1f1', 
          border: 'none', 
          color: '#ff4d4f', 
          cursor: 'pointer', 
          padding: '8px', 
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
