"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCategories(type: "product" | "article") {
  return await db.category.findMany({
    where: { type },
    orderBy: { name: 'asc' }
  });
}

export async function upsertCategory(data: {
  id?: string;
  name: string;
  slug: string;
  type: string;
}) {
  try {
    const category = await db.category.upsert({
      where: { id: data.id || "new" },
      update: {
        name: data.name,
        slug: data.slug,
        type: data.type,
      },
      create: {
        name: data.name,
        slug: data.slug,
        type: data.type,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Category upsert error:", error);
    return { error: "Gagal menyimpan kategori. Pastikan slug belum digunakan." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({
      where: { id }
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Category delete error:", error);
    return { error: "Gagal menghapus kategori. Kategori ini mungkin masih digunakan oleh produk atau artikel." };
  }
}

export async function migrateLegacyCategories() {
  try {
    // Migrate products
    const products = await db.product.findMany({ where: { categoryId: null, category: { not: null } } });
    for (const p of products) {
      if (!p.category) continue;
      
      const slug = p.category.toLowerCase().replace(/ /g, '-');
      let cat = await db.category.findUnique({ where: { slug } });
      
      if (!cat) {
        cat = await db.category.create({
          data: { name: p.category, slug, type: 'product' }
        });
      }
      
      await db.product.update({
        where: { id: p.id },
        data: { categoryId: cat.id }
      });
    }

    // Migrate articles (articles don't have legacy category string currently, but good to have)
    
    return { success: true };
  } catch (error) {
    console.error("Migration error:", error);
    return { error: "Gagal migrasi data kategori lama." };
  }
}
