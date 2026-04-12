import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import EditProductClient from "./EditProductClient";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const product = await db.product.findUnique({
    where: { id }
  });

  const categories = await db.category.findMany({
    where: { type: 'product' },
    orderBy: { name: 'asc' }
  });

  return <EditProductClient product={product} categories={categories} />;
}
