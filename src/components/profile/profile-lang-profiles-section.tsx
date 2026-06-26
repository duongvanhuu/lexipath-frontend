import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { Languages, Flame, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { LangProfileSummary } from "@/features/profile/types";

const LANG_META: Record<
  "en" | "ja" | "zh",
  { label: string; flag: string }
> = {
  en: { label: "Tiếng Anh", flag: "🇬🇧" },
  ja: { label: "Tiếng Nhật", flag: "🇯🇵" },
  zh: { label: "Tiếng Trung", flag: "🇨🇳" },
};

export type ProfileLangProfilesSectionProps = {
  profiles: LangProfileSummary[];
};

function ProfileLangProfilesSection({
  profiles,
}: ProfileLangProfilesSectionProps) {
  return (
    <section aria-labelledby="lang-profiles-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2
          id="lang-profiles-heading"
          className="text-xs font-semibold uppercase tracking-wide text-text-muted"
        >
          Hồ sơ ngôn ngữ
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href={"/profile" as Route} aria-label="Quản lý hồ sơ ngôn ngữ">
            Quản lý →
          </Link>
        </Button>
      </div>

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border px-6 py-8 text-center">
          <Languages className="size-8 text-text-muted" aria-hidden />
          <p className="text-sm text-text-muted">Chưa có hồ sơ ngôn ngữ</p>
          <Button size="sm" asChild>
            <Link href={"/profile" as Route}>
              <Plus className="size-3.5" aria-hidden />
              Thêm ngôn ngữ
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {profiles.map((profile) => {
            const meta = LANG_META[profile.id];
            return (
              <Link
                key={profile.id}
                href={"/profile" as Route}
                className={cn(
                  "flex items-center gap-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                )}
                aria-label={`${meta.label} — ${profile.level.current}`}
              >
                {/* Flag */}
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-surface-muted text-lg"
                  aria-hidden
                >
                  {meta.flag}
                </span>

                {/* Name + level */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">
                      {meta.label}
                    </span>
                    {profile.active ? (
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <span
                          className="size-1.5 rounded-full bg-primary"
                          aria-hidden
                        />
                        Đang hoạt động
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-text-secondary truncate">
                    {profile.level.current}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex shrink-0 items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-0.5">
                    <Flame className="size-3 text-orange-500" aria-hidden />
                    {profile.streak}
                  </span>
                  <span>{profile.xp.toLocaleString()} xp</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export { ProfileLangProfilesSection };
