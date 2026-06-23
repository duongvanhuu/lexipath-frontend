import type { SecurityDevice } from "./types";
import type { SecurityEvent } from "@/components/security/types";

export const MOCK_DEVICES: SecurityDevice[] = [
  {
    id: "d1",
    deviceName: "MacBook Pro",
    deviceType: "desktop",
    browserLabel: "Chrome 124",
    locationLabel: "Hà Nội, Việt Nam",
    lastActiveLabel: "Đang hoạt động",
    current: true,
    trusted: true,
    ipAddress: "IP 14.241.x.x",
    sessionExpiryLabel: "Phiên hết hạn sau 13 ngày",
  },
  {
    id: "d2",
    deviceName: "iPhone 15",
    deviceType: "mobile",
    browserLabel: "Safari 17",
    locationLabel: "Hà Nội, Việt Nam",
    lastActiveLabel: "2 giờ trước",
    current: false,
    trusted: true,
    ipAddress: "IP 14.241.x.x",
  },
  {
    id: "d3",
    deviceName: "iPad Air",
    deviceType: "tablet",
    browserLabel: "LexiPath App",
    locationLabel: "Hà Nội, Việt Nam",
    lastActiveLabel: "Hôm qua",
    current: false,
    trusted: false,
  },
  {
    id: "d4",
    deviceName: "Windows 11",
    deviceType: "desktop",
    browserLabel: "Edge 123",
    locationLabel: "TP. Hồ Chí Minh, Việt Nam",
    lastActiveLabel: "3 ngày trước",
    current: false,
    trusted: false,
    ipAddress: "IP 118.70.x.x",
  },
];

export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: "e1",
    title: "Đăng nhập thành công",
    description: "Chrome · MacBook Pro · Hà Nội",
    severity: "info",
    createdAtLabel: "Hôm nay, 08:15",
  },
  {
    id: "e2",
    title: "Đổi mật khẩu",
    description: "Từ cài đặt bảo mật",
    severity: "info",
    createdAtLabel: "3 ngày trước",
  },
  {
    id: "e3",
    title: "Đăng nhập từ thiết bị mới",
    description: "Edge · Windows 11 · TP. Hồ Chí Minh",
    severity: "warning",
    createdAtLabel: "3 ngày trước",
    ipAddress: "IP 118.70.x.x",
  },
  {
    id: "e4",
    title: "Đăng nhập thành công",
    description: "Safari · iPhone 15 · Hà Nội",
    severity: "info",
    createdAtLabel: "1 tuần trước",
  },
  {
    id: "e5",
    title: "Bật thông báo đăng nhập lạ",
    description: "Từ cài đặt bảo mật",
    severity: "info",
    createdAtLabel: "2 tuần trước",
  },
];
