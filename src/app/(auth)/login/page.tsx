"use client";

import * as React from "react";
import Link from "next/link";

import {
  AuthCard,
  LoginForm,
  SocialLoginButton,
  useLoginMutation,
  type AuthProvider,
  type LoginValues,
} from "@/features/auth";
import { LexiLogo } from "@/features/marketing";
import { ApiError } from "@/lib/api/api-error";
import { Separator } from "@/components/ui/separator";

/**
 * Login demo route. Wires `LoginForm` to the real `useLoginMutation` (auth.api)
 * — the form stays API-agnostic; this page owns the call + error mapping.
 */
export default function LoginPage() {
  const login = useLoginMutation();
  const [errorMessage, setErrorMessage] = React.useState<string>();

  async function handleSubmit(values: LoginValues) {
    setErrorMessage(undefined);
    try {
      await login.mutateAsync({
        email: values.email,
        password: values.password,
        ...(values.rememberMe !== undefined
          ? { rememberMe: values.rememberMe }
          : {}),
      });
      // On success a router push to /dashboard would go here.
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Đăng nhập thất bại. Vui lòng thử lại."
      );
    }
  }

  function handleSocial(provider: AuthProvider) {
    // Placeholder — OAuth redirect handled by the backend in a real flow.
    setErrorMessage(undefined);
    void provider;
  }

  return (
    <AuthCard
      logo={<LexiLogo />}
      title="Đăng nhập"
      description="Tiếp tục lộ trình học từ vựng của bạn."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Đăng ký
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <SocialLoginButton provider="google" onSelect={handleSocial} />
          <SocialLoginButton provider="apple" onSelect={handleSocial} />
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-text-muted">hoặc</span>
          <Separator className="flex-1" />
        </div>

        <LoginForm
          onSubmit={handleSubmit}
          isSubmitting={login.isPending}
          {...(errorMessage !== undefined ? { errorMessage } : {})}
        />
      </div>
    </AuthCard>
  );
}
