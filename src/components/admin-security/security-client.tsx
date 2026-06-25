"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layouts/page-header";
import { SessionsTab } from "@/components/admin-security/sessions-tab";
import { DevicesTab } from "@/components/admin-security/devices-tab";
import { EventsTab } from "@/components/admin-security/events-tab";
import { LocksTab } from "@/components/admin-security/locks-tab";
import type {
  AccountLockRecord,
  DeviceRecord,
  SecurityEventRecord,
  SessionRecord,
} from "@/features/admin-security";

export type SecurityClientProps = {
  sessions: SessionRecord[];
  devices: DeviceRecord[];
  events: SecurityEventRecord[];
  locks: AccountLockRecord[];
};

export function SecurityClient({
  sessions,
  devices,
  events,
  locks,
}: SecurityClientProps) {
  const activeLocks = locks.filter((l) => l.status === "active").length;
  const criticalEvents = events.filter((e) => e.severity === "critical").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bảo mật"
        description={`${sessions.length} phiên hoạt động · ${activeLocks} tài khoản bị khóa · ${criticalEvents} sự kiện nghiêm trọng`}
      />

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Phiên đăng nhập</TabsTrigger>
          <TabsTrigger value="devices">Thiết bị</TabsTrigger>
          <TabsTrigger value="events">Sự kiện bảo mật</TabsTrigger>
          <TabsTrigger value="locks">Khóa tài khoản</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-6">
          <SessionsTab sessions={sessions} />
        </TabsContent>

        <TabsContent value="devices" className="mt-6">
          <DevicesTab initialDevices={devices} />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <EventsTab events={events} />
        </TabsContent>

        <TabsContent value="locks" className="mt-6">
          <LocksTab locks={locks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
