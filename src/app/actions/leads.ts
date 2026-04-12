"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteLead(id: string) {
  try {
    await db.lead.delete({ where: { id } });
    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus pesan." };
  }
}

export async function markLeadAsRead(id: string) {
  try {
    await db.lead.update({
      where: { id },
      data: { status: "read" }
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Gagal memperbarui status." };
  }
}
