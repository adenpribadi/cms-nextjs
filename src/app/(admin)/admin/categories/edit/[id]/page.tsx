import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CategoryFormClient from "../../CategoryFormClient";

export default async function EditCategoryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const category = await db.category.findUnique({
    where: { id }
  });

  if (!category) return notFound();

  return <CategoryFormClient category={category} />;
}
