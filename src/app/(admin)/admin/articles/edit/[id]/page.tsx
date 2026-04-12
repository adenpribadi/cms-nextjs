import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import EditArticleClient from "./EditArticleClient";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id }
  });

  const categories = await db.category.findMany({
    where: { type: 'article' },
    orderBy: { name: 'asc' }
  });

  return <EditArticleClient article={article} categories={categories} />;
}
