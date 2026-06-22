export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType?: "desktop" | "mobile" | "tablet" | "unknown";
  browserLabel?: string;
  locationLabel?: string;
  lastActiveLabel?: string;
  current?: boolean;
  ipAddress?: string;
}

export interface SecurityEvent {
  id: string;
  title: string;
  description?: string;
  severity: "info" | "warning" | "danger";
  createdAtLabel: string;
  ipAddress?: string;
}

export interface AccountLockInfo {
  reason?: string;
  lockedAtLabel?: string;
  unlockAtLabel?: string;
  contactSupport?: boolean;
}
