"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const subject = formData.get("subject") as string || "Contact Form Submission";

  if (!name || !email || !message || !phone) {
    return { error: "Semua kolom wajib diisi." };
  }

  try {
    await db.lead.create({
      data: {
        name,
        email,
        phone,
        message,
        subject,
        status: "new",
      },
    });

    // Get notification settings
    const adminWA = await db.setting.findUnique({ where: { key: "notification_whatsapp" } });
    const waNumber = adminWA?.value || "6281234567890";
    
    // Prepare pre-filled message
    const waMessage = `Halo, saya ${name}. Pesan saya: ${message}`;
    const waUrl = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`;

    revalidatePath("/admin/leads");
    return { 
      success: "Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.",
      waUrl 
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return { error: "Terjadi kesalahan. Silakan coba lagi nanti." };
  }
}
