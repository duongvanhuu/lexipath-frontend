import * as React from "react";
import { MonitorSmartphone, ShieldAlert, Smartphone, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type StatItem = {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
};

type SecurityStatCardsProps = {
  activeSessions: number;
  highRiskSessions: number;
  mobileSessions: number;
  criticalEvents: number;
};

export function SecurityStatCards({
  activeSessions,
  highRiskSessions,
  mobileSessions,
  criticalEvents,
}: SecurityStatCardsProps) {
  const items: StatItem[] = [
    {
      label: "Phiên hoạt động",
      value: activeSessions,
      icon: <MonitorSmartphone className="size-5" aria-hidden />,
      colorClass: "text-primary",
    },
    {
      label: "Rủi ro cao",
      value: highRiskSessions,
      icon: <ShieldAlert className="size-5" aria-hidden />,
      colorClass: "text-danger-foreground",
    },
    {
      label: "Thiết bị di động",
      value: mobileSessions,
      icon: <Smartphone className="size-5" aria-hidden />,
      colorClass: "text-secondary",
    },
    {
      label: "Sự kiện nghiêm trọng",
      value: criticalEvents,
      icon: <TriangleAlert className="size-5" aria-hidden />,
      colorClass: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <span
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted",
                item.colorClass
              )}
            >
              {item.icon}
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none text-text-primary">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-text-secondary">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
