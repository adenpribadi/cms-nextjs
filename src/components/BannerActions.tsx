"use client";

import { deleteBanner, toggleBannerActive } from "@/app/actions/banners";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function BannerActions({ bannerId, active }: { bannerId: string, active: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await toggleBannerActive(bannerId, !active);
      if (res.success) {
        toast.success(`Banner ${!active ? 'diaktifkan' : 'dinonaktifkan'}`);
        router.refresh();
      } else {
        toast.error(res.error || "Gagal merubah status");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;
    
    setLoading(true);
    try {
      const res = await deleteBanner(bannerId);
      if (res.success) {
        toast.success("Banner berhasil dihapus");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menghapus banner");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <button 
        onClick={handleToggle}
        disabled={loading}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: active ? '#f39c12' : '#2ecc71', 
          cursor: 'pointer', 
          fontSize: '0.85rem', 
          fontWeight: 600, 
          padding: 0 
        }}
      >
        {active ? 'Nonaktifkan' : 'Aktifkan'}
      </button>
      <button 
        onClick={handleDelete}
        disabled={loading}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#e74c3c', 
          cursor: 'pointer', 
          fontSize: '0.85rem', 
          fontWeight: 600, 
          padding: 0 
        }}
      >
        Hapus
      </button>
    </div>
  );
}
