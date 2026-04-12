import { db } from "@/lib/db";
import { TestimonialFormClient } from "@/components/TestimonialFormClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const testimonial = await db.testimonial.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/testimonials" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Kembali ke Daftar Testimoni
        </Link>
        <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '4px' }}>Edit Testimoni</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Ubah data ulasan untuk {testimonial.name}.</p>
      </div>

      <TestimonialFormClient initialData={testimonial} />
    </div>
  );
}
