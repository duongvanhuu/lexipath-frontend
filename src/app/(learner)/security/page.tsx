import type { Metadata } from "next";

import { SecurityClient } from "./security-client";

export const metadata: Metadata = {
  title: "Bảo mật tài khoản",
};

export default function SecurityPage() {
  return <SecurityClient />;
}
