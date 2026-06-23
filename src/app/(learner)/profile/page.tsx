import type { Metadata } from "next";
import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "Hồ sơ",
  description: "Quản lý thông tin cá nhân và cài đặt tài khoản LexiPath của bạn.",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-6">
      <ProfileClient />
    </div>
  );
}
