"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./upload";

export async function updateSettings(settings: Record<string, any>) {
  try {
    for (const [key, value] of Object.entries(settings)) {
      let finalValue = value;
      
      // Handle file upload for logo if it's a File-like object (handled in client via regular logic usually)
      // but here we expect strings. If we need to upload, we'll do it in Client or here.
      
      await db.setting.upsert({
        where: { key },
        update: { value: String(finalValue) },
        create: { key, value: String(finalValue) },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Settings update error:", error);
    return { error: "Gagal memperbarui pengaturan." };
  }
}
