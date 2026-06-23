import type { Metadata } from "next";

import { SettingsClient } from "./settings-client";

export const metadata: Metadata = {
  title: "Cài đặt thông báo",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
