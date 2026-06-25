export type RiskLevel = "low" | "medium" | "high";
export type DeviceType = "desktop" | "mobile" | "tablet";
export type LockType = "auto" | "manual";
export type LockStatus = "active" | "released";
export type EventSeverity = "critical" | "warning" | "info";

export interface SessionRecord {
  id: string;
  user: string;
  email: string;
  device: string;
  type: DeviceType;
  ip: string;
  location: string;
  started: string;
  lastActive: string;
  current: boolean;
  risk: RiskLevel;
}

export interface DeviceRecord {
  id: string;
  user: string;
  name: string;
  type: DeviceType;
  os: string;
  browser: string;
  firstSeen: string;
  lastSeen: string;
  trusted: boolean;
  sessions: number;
}

export interface SecurityEventRecord {
  id: string;
  user: string;
  email: string;
  event: string;
  type: string;
  description: string;
  timestamp: string;
  severity: EventSeverity;
  risk: RiskLevel;
  device?: string;
  ip?: string;
  location?: string;
}

export interface AccountLockRecord {
  id: string;
  user: string;
  email: string;
  reason: string;
  type: LockType;
  status: LockStatus;
  lockedAt: string;
  unlockAt: string;
  by: string;
}
