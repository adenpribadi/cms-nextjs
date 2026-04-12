import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsArray = await db.setting.findMany();
  const settings = settingsArray.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <>
      <Navbar settings={settings} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
