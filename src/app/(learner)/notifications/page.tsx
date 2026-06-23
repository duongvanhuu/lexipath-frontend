import type { Metadata } from "next";

import { NotificationsClient } from "./notifications-client";

export const metadata: Metadata = {
  title: "Thông báo",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
