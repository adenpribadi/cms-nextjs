"use client";

import { migrateLegacyCategories } from "@/app/actions/categories";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryListActions() {
  const [migrating, setMigrating] = useState(false);
  const router = useRouter();

  const handleMigrate = async () => {
    if (!confirm("Ini akan mendeteksi kategori teks lama pada produk dan mengubahnya menjadi sistem kategori resmi. Lanjutkan?")) return;
    
    setMigrating(true);
    try {
      const res = await migrateLegacyCategories();
      if (res.success) {
        toast.success("Migrasi kategori berhasil!");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal migrasi.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setMigrating(false);
    }
  };

  return (
    <button 
      onClick={handleMigrate}
      disabled={migrating}
      className="btn btn-secondary"
      style={{ padding: '10px 20px', fontSize: '0.85rem' }}
    >
      {migrating ? "🔄 Migrasi..." : "🪄 Sinkron Data Lama"}
    </button>
  );
}
