import { db } from "@/lib/db";
import NewArticleClient from "./NewArticleClient";

export default async function NewArticlePage() {
  const categories = await db.category.findMany({
    where: { type: 'article' },
    orderBy: { name: 'asc' }
  });

  return <NewArticleClient categories={categories} />;
}
