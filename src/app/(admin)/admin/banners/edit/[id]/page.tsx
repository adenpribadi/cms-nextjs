import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import BannerFormClient from "../../BannerFormClient";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banner = await db.banner.findUnique({
    where: { id }
  });

  if (!banner) return notFound();

  return <BannerFormClient banner={banner} />;
}
