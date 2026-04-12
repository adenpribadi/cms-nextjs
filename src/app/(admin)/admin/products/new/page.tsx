import { db } from "@/lib/db";
import NewProductClient from "./NewProductClient";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    where: { type: 'product' },
    orderBy: { name: 'asc' }
  });

  return <NewProductClient categories={categories} />;
}
