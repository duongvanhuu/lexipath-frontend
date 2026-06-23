export type BrowserPermState = "default" | "granted" | "denied";

export interface AccountNotifState {
  enabled: boolean;
  email: boolean;
  push: boolean;
}

export interface LangScheduleState {
  enabled: boolean;
  time: string;
}

export interface NotificationPrefsState {
  goldenTime: boolean;
  dailyNew: boolean;
  streakWarn: boolean;
  weeklySummary: boolean;
  paymentStatus: AccountNotifState;
  subChanges: AccountNotifState;
  secEvents: AccountNotifState;
  newDevice: AccountNotifState;
  langSchedules: Record<string, LangScheduleState>;
}
