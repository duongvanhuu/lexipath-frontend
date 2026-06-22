import { z } from "zod";

/**
 * Zod schemas for the auth + onboarding forms. Inferred types are the canonical
 * form-value shapes consumed by React Hook Form (`zodResolver`). Uses the Zod 4
 * error API (`error` replaces `message` / `errorMap` / `invalid_type_error`).
 */

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  rememberMe: z.boolean().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Vui lòng nhập họ tên"),
    email: z.email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    acceptTerms: z.literal(true, {
      error: "Bạn cần đồng ý với điều khoản",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const languagePreferenceSchema = z.object({
  language: z.enum(["en", "ja", "zh"], { error: "Vui lòng chọn ngôn ngữ" }),
  /** Script preference id (e.g. furigana on/off, pinyin on/off). Optional. */
  scriptId: z.string().optional(),
});

export type LanguagePreferenceValues = z.infer<typeof languagePreferenceSchema>;

export const onboardingGoalSchema = z.object({
  goal: z.enum(["exam", "travel", "work", "academic", "hobby"], {
    error: "Vui lòng chọn mục tiêu",
  }),
  /** Words/day target. */
  dailyGoal: z
    .number({ error: "Vui lòng chọn mục tiêu mỗi ngày" })
    .int()
    .min(1, "Tối thiểu 1 từ/ngày")
    .max(100, "Tối đa 100 từ/ngày"),
});

export type OnboardingGoalValues = z.infer<typeof onboardingGoalSchema>;
