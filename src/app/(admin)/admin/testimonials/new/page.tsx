import { TestimonialFormClient } from "@/components/TestimonialFormClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTestimonialPage() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/testimonials" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Kembali ke Daftar Testimoni
        </Link>
        <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '4px' }}>Tambah Testimoni</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Masukkan ulasan pelanggan baru untuk ditampilkan di website.</p>
      </div>

      <TestimonialFormClient />
    </div>
  );
}
