"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getBanners() {
  return await db.banner.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function getActiveBanners() {
  return await db.banner.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  });
}

export async function upsertBanner(data: {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  active?: boolean;
  order?: number;
}) {
  try {
    const bannerData = {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      imageUrl: data.imageUrl,
      buttonText: data.buttonText,
      buttonLink: data.buttonLink,
      active: data.active ?? true,
      order: data.order ?? 0,
    };

    if (data.id) {
      await db.banner.update({
        where: { id: data.id },
        data: bannerData,
      });
    } else {
      await db.banner.create({
        data: bannerData,
      });
    }

    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Banner upsert error:", error);
    return { error: "Gagal menyimpan banner." };
  }
}

export async function deleteBanner(id: string) {
  try {
    await db.banner.delete({ where: { id } });
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus banner." };
  }
}

export async function toggleBannerActive(id: string, active: boolean) {
  try {
    await db.banner.update({
      where: { id },
      data: { active }
    });
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Gagal merubah status banner." };
  }
}
