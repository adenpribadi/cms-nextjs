"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function upsertProduct(data: {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  categoryId?: string;
  featured?: boolean;
}) {
  try {
    const updateData = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      image: data.image,
      category: data.category,
      categoryId: data.categoryId,
      featured: data.featured,
    };

    if (data.id) {
      await db.product.update({
        where: { id: data.id },
        data: updateData,
      });
    } else {
      await db.product.create({
        data: updateData,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Product upsert error:", error);
    return { error: "Gagal menyimpan produk. Slug mungkin sudah digunakan." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus produk." };
  }
}

export async function checkSlugExists(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: { slug }
    });
    return !!product;
  } catch (error) {
    return false;
  }
}
