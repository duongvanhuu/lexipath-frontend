import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Circle,
  Lock,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { CheckpointState, JourneyCheckpoint } from "../types";
import { checkpointVariants } from "./checkpoint-node";

/* -------------------------------------------------------------------------- */
/* State icon map                                                              */
/* -------------------------------------------------------------------------- */

const STATE_ICONS: Record<CheckpointState, React.ReactElement> = {
  current: <ChevronRight className="size-4 shrink-0" aria-hidden />,
  due: <Circle className="size-4 shrink-0" aria-hidden />,
  weak: <AlertTriangle className="size-4 shrink-0" aria-hidden />,
  premium: <Star className="size-4 shrink-0" aria-hidden />,
  completed: <CheckCircle2 className="size-4 shrink-0" aria-hidden />,
  locked: <Lock className="size-4 shrink-0" aria-hidden />,
  available: <Circle className="size-4 shrink-0" aria-hidden />,
};

/* -------------------------------------------------------------------------- */
/* JourneyCheckpointCard                                                       */
/* -------------------------------------------------------------------------- */

export type JourneyCheckpointCardProps = {
  checkpoint: JourneyCheckpoint;
  isLast?: boolean;
  className?: string;
};

function JourneyCheckpointCardInner({
  checkpoint,
}: {
  checkpoint: JourneyCheckpoint;
}) {
  return (
    <>
      {STATE_ICONS[checkpoint.state]}
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {checkpoint.label}
        </span>
        {checkpoint.sublabel ? (
          <span className="block truncate text-xs opacity-70">
            {checkpoint.sublabel}
          </span>
        ) : null}
      </div>
    </>
  );
}

/**
 * JourneyCheckpointCard — a single macro-level journey checkpoint.
 * Wraps content in a <Link> when href is provided and state is not locked.
 */
function JourneyCheckpointCard({
  checkpoint,
  isLast: _isLast,
  className,
}: JourneyCheckpointCardProps) {
  const base = cn(
    checkpointVariants({ state: checkpoint.state }),
    "w-full",
    className
  );

  if (checkpoint.href && checkpoint.state !== "locked") {
    return (
      <Link href={checkpoint.href as Route} className={base}>
        <JourneyCheckpointCardInner checkpoint={checkpoint} />
      </Link>
    );
  }

  return (
    <div
      className={base}
      aria-disabled={checkpoint.state === "locked" ? true : undefined}
    >
      <JourneyCheckpointCardInner checkpoint={checkpoint} />
    </div>
  );
}

export { JourneyCheckpointCard };
