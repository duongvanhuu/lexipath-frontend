"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import type { UserProfile } from "@/features/profile/types";

const TIMEZONES = [
  { value: "Asia/Ho_Chi_Minh", label: "Hà Nội / TP.HCM (UTC+7)" },
  { value: "Asia/Tokyo", label: "Tokyo (UTC+9)" },
  { value: "Asia/Shanghai", label: "Thượng Hải (UTC+8)" },
  { value: "Asia/Bangkok", label: "Bangkok (UTC+7)" },
  { value: "America/Los_Angeles", label: "Los Angeles (UTC-8)" },
  { value: "America/New_York", label: "New York (UTC-5)" },
  { value: "Europe/London", label: "London (UTC+0)" },
] as const;

const editProfileSchema = z.object({
  name: z.string().min(2, "Tên hiển thị phải có ít nhất 2 ký tự."),
  phone: z.string().optional(),
  timezone: z.string(),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile;
  onSave?: (values: EditProfileValues) => Promise<void>;
};

function EditProfileDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: EditProfileDialogProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = React.useState(false);

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      timezone: user.timezone,
    },
  });

  const isDirty = form.formState.isDirty;

  function handleRequestClose(requestedOpen: boolean) {
    if (!requestedOpen && isDirty) {
      setShowUnsavedConfirm(true);
      return;
    }
    onOpenChange(requestedOpen);
  }

  function handleDiscardChanges() {
    setShowUnsavedConfirm(false);
    form.reset();
    onOpenChange(false);
  }

  async function handleSave(values: EditProfileValues) {
    try {
      setIsSaving(true);
      if (onSave) {
        await onSave(values);
      } else {
        // Simulate API delay in mock mode
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      form.reset(values);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }

  function handleAvatarUpload() {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => setIsUploading(false), 1500);
  }

  const initials = getInitials(user.name);

  return (
    <>
      <Dialog open={open} onOpenChange={handleRequestClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="flex flex-col gap-4"
            >
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="size-20">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="text-xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    aria-label="Tải ảnh đại diện mới"
                    disabled={isUploading}
                    onClick={handleAvatarUpload}
                    className={cn(
                      "absolute bottom-0 right-0 flex size-[26px] items-center justify-center rounded-full bg-primary text-primary-foreground",
                      "ring-2 ring-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
                    )}
                  >
                    {isUploading ? (
                      <Loader2 className="size-3 animate-spin" aria-hidden />
                    ) : (
                      <Camera className="size-3" aria-hidden />
                    )}
                  </button>
                </div>
                {isUploading ? (
                  <p className="text-xs text-text-muted" role="status" aria-live="polite">
                    Đang tải ảnh lên…
                  </p>
                ) : null}
              </div>

              {/* Display name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên hiển thị</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tên của bạn"
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email (read-only) */}
              <div className="grid gap-2">
                <label className="text-sm font-medium text-text-primary">
                  Email
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-2.5 py-2">
                  <span className="flex-1 text-sm text-text-secondary">
                    {user.email}
                  </span>
                  <Badge
                    className={cn(
                      user.emailVerified
                        ? "bg-success-soft text-success-foreground"
                        : "bg-warning-soft text-warning-foreground"
                    )}
                  >
                    {user.emailVerified ? (
                      <CheckCircle className="size-3" aria-hidden />
                    ) : null}
                    {user.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
                  </Badge>
                </div>
              </div>

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+84 90 000 0000"
                        type="tel"
                        autoComplete="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timezone */}
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Múi giờ</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn múi giờ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRequestClose(false)}
                  disabled={isSaving}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      Đang lưu…
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Unsaved changes confirmation */}
      <AlertDialog
        open={showUnsavedConfirm}
        onOpenChange={setShowUnsavedConfirm}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Bỏ thay đổi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có thay đổi chưa được lưu. Nếu rời đi, các thay đổi sẽ bị
              mất.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnsavedConfirm(false)}>
              Tiếp tục chỉnh sửa
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDiscardChanges}
            >
              Bỏ thay đổi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { EditProfileDialog };
