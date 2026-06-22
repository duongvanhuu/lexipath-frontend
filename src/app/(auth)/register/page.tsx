"use client";

import * as React from "react";
import Link from "next/link";

import {
  AuthCard,
  RegisterForm,
  SocialLoginButton,
  VerificationStateCard,
  useRegisterMutation,
  type AuthProvider,
  type RegisterValues,
} from "@/features/auth";
import { LexiLogo } from "@/features/marketing";
import { ApiError } from "@/lib/api/api-error";
import { Separator } from "@/components/ui/separator";

/**
 * Register demo route. On success, swaps the form for the email-verification
 * state card. Wires `RegisterForm` to `useRegisterMutation` (auth.api).
 */
export default function RegisterPage() {
  const register = useRegisterMutation();
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [registeredEmail, setRegisteredEmail] = React.useState<string>();

  async function handleSubmit(values: RegisterValues) {
    setErrorMessage(undefined);
    try {
      await register.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      setRegisteredEmail(values.email);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Đăng ký thất bại. Vui lòng thử lại."
      );
    }
  }

  function handleSocial(provider: AuthProvider) {
    setErrorMessage(undefined);
    void provider;
  }

  if (registeredEmail) {
    return (
      <div className="mx-auto w-full max-w-md">
        <VerificationStateCard
          state="sent"
          email={registeredEmail}
          onResend={() => {
            /* re-trigger verification email */
          }}
          onChangeEmail={() => setRegisteredEmail(undefined)}
        />
      </div>
    );
  }

  return (
    <AuthCard
      logo={<LexiLogo />}
      title="Tạo tài khoản"
      description="Bắt đầu lộ trình học từ vựng miễn phí trong 2 phút."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <SocialLoginButton provider="google" onSelect={handleSocial} disabled />
          <SocialLoginButton provider="apple" onSelect={handleSocial} disabled />
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-text-muted">hoặc</span>
          <Separator className="flex-1" />
        </div>

        <RegisterForm
          onSubmit={handleSubmit}
          isSubmitting={register.isPending}
          {...(errorMessage !== undefined ? { errorMessage } : {})}
        />
      </div>
    </AuthCard>
  );
}
