"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTestimonials() {
  try {
    return await db.testimonial.findMany({
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function createTestimonial(data: any) {
  try {
    const testimonial = await db.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        content: data.content,
        avatarUrl: data.avatarUrl,
        rating: parseInt(data.rating) || 5,
        active: data.active === undefined ? true : data.active,
        order: parseInt(data.order) || 0,
      }
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, testimonial };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: "Gagal membuat testimoni." };
  }
}

export async function updateTestimonial(id: string, data: any) {
  try {
    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        content: data.content,
        avatarUrl: data.avatarUrl,
        rating: parseInt(data.rating) || 5,
        active: data.active,
        order: parseInt(data.order) || 0,
      }
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, testimonial };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: "Gagal memperbarui testimoni." };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await db.testimonial.delete({
      where: { id }
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Gagal menghapus testimoni." };
  }
}

export async function toggleTestimonialActive(id: string, active: boolean) {
  try {
    await db.testimonial.update({
      where: { id },
      data: { active }
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
