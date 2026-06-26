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
import type { AdminLesson } from "@/features/admin-collections/types";
import { COLL_PLAN_OPTS } from "@/features/admin-collections/types";

export interface LessonInfoTabProps {
  form: AdminLesson;
  onChange: <K extends keyof AdminLesson>(key: K, value: AdminLesson[K]) => void;
  itemCount: number;
}

const STATUS_OPTS = [
  { v: "draft", l: "Bản nháp" },
  { v: "review", l: "Đang duyệt" },
  { v: "published", l: "Đã xuất bản" },
];

const TOGGLE_FIELDS: Array<{
  key: keyof AdminLesson;
  label: string;
  desc: string;
}> = [
  { key: "is_free", label: "Bài miễn phí", desc: "Mở cho tất cả người dùng" },
  { key: "is_new", label: "Đánh dấu Mới", desc: "Hiển thị nhãn 'Mới'" },
];

export function LessonInfoTab({ form, onChange, itemCount }: LessonInfoTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px] items-start">
      <Card>
        <CardContent className="pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
            Thông tin bài học
          </p>

          <CollectionFormRow label="Tiêu đề bài học" required>
            <Input
              value={form.title}
              placeholder="Bài 1: Lời chào & Giới thiệu"
              className="h-9"
              onChange={(e) => onChange("title", e.target.value)}
            />
          </CollectionFormRow>

          <CollectionFormRow label="Tiêu đề phụ" hint="Mô tả ngắn hiển thị dưới tiêu đề.">
            <Input
              value={form.subtitle}
              placeholder="Từ cơ bản nhất để bắt đầu"
              className="h-9"
              onChange={(e) => onChange("subtitle", e.target.value)}
            />
          </CollectionFormRow>

          <CollectionFormRow label="URL thumbnail">
            <Input
              value={form.thumbnail_url}
              placeholder="https://…"
              className="h-9"
              onChange={(e) => onChange("thumbnail_url", e.target.value)}
            />
          </CollectionFormRow>

          <div className="grid grid-cols-2 gap-x-4">
            <CollectionFormRow label="Thời lượng (phút)">
              <Input
                type="number"
                min={0}
                value={form.estimated_minutes}
                className="h-9"
                onChange={(e) =>
                  onChange("estimated_minutes", parseInt(e.target.value) || 0)
                }
              />
            </CollectionFormRow>
            <CollectionFormRow label="Thứ tự">
              <Input
                type="number"
                min={1}
                value={form.sort_order}
                className="h-9"
                onChange={(e) =>
                  onChange("sort_order", parseInt(e.target.value) || 1)
                }
              />
            </CollectionFormRow>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3.5">
        <Card>
          <CardContent className="pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
              Trạng thái & Phát hành
            </p>

            <CollectionFormRow label="Trạng thái">
              <Select
                value={form.status_code}
                onValueChange={(v) =>
                  onChange("status_code", v as AdminLesson["status_code"])
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTS.map((o) => (
                    <SelectItem key={o.v} value={o.v}>
                      {o.l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CollectionFormRow>

            <CollectionFormRow label="Gói tối thiểu">
              <Select
                value={form.min_plan}
                onValueChange={(v) =>
                  onChange("min_plan", v as AdminLesson["min_plan"])
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

            <Separator className="my-3" />

            {TOGGLE_FIELDS.map(({ key, label, desc }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2.5 py-1.5"
              >
                <Switch
                  checked={!!form[key]}
                  onCheckedChange={(v) =>
                    onChange(key, v as AdminLesson[typeof key])
                  }
                />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-[11px] text-text-muted">{desc}</p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
              Thống kê
            </p>
            <div className="rounded-lg bg-surface-muted px-3 py-4 text-center">
              <p className="text-2xl font-bold">{itemCount}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                Từ vựng
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
