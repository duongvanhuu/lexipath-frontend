export interface SecurityDevice {
  id: string;
  deviceName: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  browserLabel?: string;
  locationLabel: string;
  lastActiveLabel: string;
  current: boolean;
  trusted: boolean;
  ipAddress?: string;
  sessionExpiryLabel?: string;
}
