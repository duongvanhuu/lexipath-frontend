"use client";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CollectionFormRow } from "./collection-form-row";
import type { AdminAccessRule } from "@/features/admin-collections/types";
import { COLL_PLAN_OPTS } from "@/features/admin-collections/types";

export interface CollectionAccessTabProps {
  rule: AdminAccessRule;
  onChange: <K extends keyof AdminAccessRule>(key: K, value: AdminAccessRule[K]) => void;
}

const TOGGLE_FIELDS: Array<{
  key: keyof AdminAccessRule;
  label: string;
  desc: string;
}> = [
  {
    key: "allow_trial",
    label: "Cho phép dùng thử",
    desc: "Người dùng có thể học thử vài từ trong bài khóa",
  },
  {
    key: "allow_one_time_purchase",
    label: "Cho phép mua một lần",
    desc: "Học viên có thể mua quyền truy cập riêng bộ sưu tập này",
  },
];

export function CollectionAccessTab({ rule, onChange }: CollectionAccessTabProps) {
  const tierLabel =
    COLL_PLAN_OPTS.find((o) => o.v === rule.required_tier)?.l ?? rule.required_tier;

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardContent className="pt-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Quy tắc quyền truy cập
            </p>
            <label className="flex cursor-pointer items-center gap-2">
              <Switch
                checked={rule.is_active}
                onCheckedChange={(v) => onChange("is_active", v)}
                aria-label="Bật/tắt quy tắc"
              />
              <span
                className={
                  rule.is_active ? "text-sm text-primary" : "text-sm text-text-muted"
                }
              >
                {rule.is_active ? "Đang áp dụng" : "Tắt"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CollectionFormRow
              label="Gói yêu cầu"
              hint="Gói tối thiểu để truy cập toàn bộ."
            >
              <Select
                value={rule.required_tier}
                onValueChange={(v) =>
                  onChange("required_tier", v as AdminAccessRule["required_tier"])
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLL_PLAN_OPTS.map((o) => (
                    <SelectItem key={o.v} value={o.v}>
                      {o.l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CollectionFormRow>

            <CollectionFormRow
              label="Số bài miễn phí"
              hint="Bài mở cho tất cả người dùng."
            >
              <Input
                type="number"
                min={0}
                value={rule.free_lesson_count}
                className="h-9"
                onChange={(e) =>
                  onChange("free_lesson_count", parseInt(e.target.value) || 0)
                }
              />
            </CollectionFormRow>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3.5">
            {TOGGLE_FIELDS.map(({ key, label, desc }) => (
              <label key={key} className="flex cursor-pointer items-center gap-3">
                <Switch
                  checked={!!rule[key]}
                  onCheckedChange={(v) => onChange(key, v as AdminAccessRule[typeof key])}
                />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-[11px] text-text-muted">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-muted border-transparent">
        <CardContent className="pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Tóm tắt quyền truy cập
          </p>
          <p className="text-sm leading-relaxed text-text-secondary">
            {rule.is_active ? (
              <>
                Gói <strong>{tierLabel}</strong> trở lên.
                {rule.free_lesson_count > 0 &&
                  ` ${rule.free_lesson_count} bài đầu mở miễn phí.`}
                {rule.allow_trial && " Cho phép học thử."}
                {rule.allow_one_time_purchase && " Hỗ trợ mua riêng."}
              </>
            ) : (
              "Quy tắc đang tắt — áp dụng cài đặt mặc định."
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
