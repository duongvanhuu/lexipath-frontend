import { toast } from "sonner";

/**
 * Toast helpers built on `sonner` — the production replacement for the
 * prototype `SuccessToast` component. The `<Toaster />` surface is mounted once
 * (see `src/providers/toaster.tsx`); emit toasts imperatively from anywhere.
 */
type ToastOptions = Parameters<typeof toast.success>[1];

export function showSuccessToast(message: string, options?: ToastOptions) {
  return toast.success(message, options);
}

export function showErrorToast(message: string, options?: ToastOptions) {
  return toast.error(message, options);
}

export function showInfoToast(message: string, options?: ToastOptions) {
  return toast.info(message, options);
}

export function showWarningToast(message: string, options?: ToastOptions) {
  return toast.warning(message, options);
}

export { toast, type ToastOptions };
