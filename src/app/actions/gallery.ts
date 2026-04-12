"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addGalleryItem(data: { imageUrl: string; title?: string; caption?: string }) {
  try {
    await db.gallery.create({ data });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menambah foto ke galeri." };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await db.gallery.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus foto." };
  }
}
