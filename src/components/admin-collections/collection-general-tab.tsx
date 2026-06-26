"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { AdminCollection } from "@/features/admin-collections/types";
import {
  COLL_LANG_LABELS,
  COLL_TYPE_OPTS,
  COLL_PLAN_OPTS,
  CERT_OPTS,
  LEVEL_OPTS,
} from "@/features/admin-collections/types";

function autoSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface CollectionGeneralTabProps {
  form: AdminCollection;
  onChange: <K extends keyof AdminCollection>(key: K, value: AdminCollection[K]) => void;
}

export function CollectionGeneralTab({ form, onChange }: CollectionGeneralTabProps) {
  const levelOpts = (LEVEL_OPTS[form.language_code] ?? LEVEL_OPTS["en"]) as string[];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] items-start">
      {/* Left column */}
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
              Thông tin cơ bản
            </p>

            <div className="grid grid-cols-2 gap-x-4">
              <CollectionFormRow label="Ngôn ngữ" required>
                <Select
                  value={form.language_code}
                  onValueChange={(v) =>
                    onChange("language_code", v as AdminCollection["language_code"])
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(COLL_LANG_LABELS) as [AdminCollection["language_code"], string][]).map(
                      ([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </CollectionFormRow>

              <CollectionFormRow label="Loại bộ sưu tập" required>
                <Select
                  value={form.type}
                  onValueChange={(v) => onChange("type", v as AdminCollection["type"])}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLL_TYPE_OPTS.map((o) => (
                      <SelectItem key={o.v} value={o.v}>
                        {o.l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CollectionFormRow>
            </div>

            <CollectionFormRow label="Tên bộ sưu tập" required>
              <Input
                value={form.name}
                placeholder="Ví dụ: Từ vựng JLPT N5"
                className="h-9"
                onChange={(e) => {
                  onChange("name", e.target.value);
                  if (!form.slug || form.slug === autoSlug(form.name)) {
                    onChange("slug", autoSlug(e.target.value));
                  }
                }}
              />
            </CollectionFormRow>

            <CollectionFormRow
              label="Slug"
              required
              hint="URL-friendly identifier, dùng cho link và API."
            >
              <Input
                value={form.slug}
                placeholder="jlpt-n5"
                className="h-9"
                onChange={(e) =>
                  onChange(
                    "slug",
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
              />
            </CollectionFormRow>

            <CollectionFormRow label="Mô tả">
              <Textarea
                value={form.description}
                placeholder="Mô tả ngắn gọn về bộ sưu tập…"
                rows={3}
                onChange={(e) => onChange("description", e.target.value)}
              />
            </CollectionFormRow>

            <CollectionFormRow label="URL thumbnail" hint="Link ảnh đại diện cho bộ sưu tập.">
              <Input
                value={form.thumbnail_url}
                placeholder="https://…"
                className="h-9"
                onChange={(e) => onChange("thumbnail_url", e.target.value)}
              />
            </CollectionFormRow>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
              Chứng chỉ & Cấp độ
            </p>
            <div className="grid grid-cols-3 gap-x-4">
              <CollectionFormRow label="Loại chứng chỉ">
                <Select
                  value={form.cert_type}
                  onValueChange={(v) => onChange("cert_type", v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CERT_OPTS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CollectionFormRow>

              <CollectionFormRow label="Cấp độ từ">
                <Select
                  value={form.level_min}
                  onValueChange={(v) => onChange("level_min", v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOpts.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CollectionFormRow>

              <CollectionFormRow label="Cấp độ đến">
                <Select
                  value={form.level_max}
                  onValueChange={(v) => onChange("level_max", v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOpts.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CollectionFormRow>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="space-y-3.5">
        <Card>
          <CardContent className="pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
              Thống kê (tự động)
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  ["Tổng từ", form.total_items],
                  ["Tổng bài", form.total_lessons],
                ] as const
              ).map(([label, val]) => (
                <div
                  key={label}
                  className="rounded-lg bg-surface-muted px-3 py-2.5 text-center"
                >
                  <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                    {label}
                  </p>
                  <p className="text-xl font-bold">{(val as number).toLocaleString("vi-VN")}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
              Quy tắc gói học
            </p>
            <CollectionFormRow label="Gói tối thiểu">
              <Select
                value={form.min_plan}
                onValueChange={(v) =>
                  onChange("min_plan", v as AdminCollection["min_plan"])
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
            {form.min_plan !== "free" && (
              <CollectionFormRow
                label="Số bài miễn phí"
                hint="Bài đầu tiên mở cho người dùng Free."
              >
                <Input
                  type="number"
                  min={0}
                  value={form.free_lesson_count}
                  className="h-9"
                  onChange={(e) =>
                    onChange("free_lesson_count", parseInt(e.target.value) || 0)
                  }
                />
              </CollectionFormRow>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
              Hiển thị
            </p>
            <CollectionFormRow
              label="Thứ tự sắp xếp"
              hint="Số nhỏ hiển thị trước."
            >
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
            <Separator className="my-3" />
            <label className="flex cursor-pointer items-center gap-3 py-1">
              <Switch
                checked={form.is_featured}
                onCheckedChange={(v) => onChange("is_featured", v)}
              />
              <div>
                <p className="text-sm font-medium">Bộ sưu tập nổi bật</p>
                <p className="text-[11px] text-text-muted">
                  Hiển thị ở vị trí đầu trang chủ
                </p>
              </div>
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
