import { db } from "@/lib/db";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const settingsArray = await db.setting.findMany();
  const settings = settingsArray.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return <SettingsClient initialSettings={settings} />;
}
