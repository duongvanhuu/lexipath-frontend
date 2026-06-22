"use client";

import { X } from "lucide-react";

import { IconButton } from "@/components/shared/icon-button";

type FocusCloseButtonProps = {
  onClose: () => void;
  label: string;
};

function FocusCloseButton({ onClose, label }: FocusCloseButtonProps) {
  return (
    <IconButton variant="quiet" label={label} onClick={onClose}>
      <X />
    </IconButton>
  );
}

export { FocusCloseButton };
