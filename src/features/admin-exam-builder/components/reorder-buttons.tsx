import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReorderButtonsProps {
  onUp: () => void;
  onDown: () => void;
  disabledUp: boolean;
  disabledDown: boolean;
}

export function ReorderButtons({ onUp, onDown, disabledUp, disabledDown }: ReorderButtonsProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-5 rounded"
        disabled={disabledUp}
        onClick={onUp}
        aria-label="Di chuyển lên"
      >
        <ChevronUp className="size-3" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-5 rounded"
        disabled={disabledDown}
        onClick={onDown}
        aria-label="Di chuyển xuống"
      >
        <ChevronDown className="size-3" aria-hidden />
      </Button>
    </div>
  );
}
