"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function upsertArticle(data: {
  id?: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  categoryId?: string;
}) {
  try {
    const articleData = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      coverImage: data.coverImage,
      published: data.published,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      categoryId: data.categoryId,
    };

    if (data.id) {
      await db.article.update({
        where: { id: data.id },
        data: articleData,
      });
    } else {
      await db.article.create({
        data: articleData,
      });
    }

    revalidatePath("/admin/articles");
    revalidatePath("/articles");
    revalidatePath(`/articles/${data.slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error upserting article:", error);
    return { error: "Gagal menyimpan artikel." };
  }
}

export async function deleteArticle(id: string) {
  try {
    await db.article.delete({ where: { id } });
    revalidatePath("/admin/articles");
    revalidatePath("/articles");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus artikel." };
  }
}
