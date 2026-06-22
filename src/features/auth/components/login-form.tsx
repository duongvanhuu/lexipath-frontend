"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { loginSchema, type LoginValues } from "../schemas/auth.schemas";

export type LoginFormProps = {
  /** Submit handler — wire the real API call (auth.api) at the page level. */
  onSubmit: (values: LoginValues) => void | Promise<void>;
  /** Drives the submit button's loading/disabled state. */
  isSubmitting?: boolean;
  /** Server-side error message (e.g. mapped from `ApiError`). */
  errorMessage?: string;
  /** Href for "Quên mật khẩu?" — defaults to /forgot-password. */
  forgotPasswordHref?: string;
};

/**
 * LoginForm — email/password sign-in built on React Hook Form + Zod + shadcn
 * Form. It never calls the API itself; the page passes `onSubmit`.
 */
function LoginForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  forgotPasswordHref = "/forgot-password",
}: LoginFormProps) {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="email@example.com"
                    className="h-11 pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Mật khẩu</FormLabel>
                <Link
                  href={forgotPasswordHref}
                  className="text-xs text-primary hover:underline"
                  tabIndex={0}
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    className="h-11 pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage ? (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
        </Button>
      </form>
    </Form>
  );
}

export { LoginForm };
