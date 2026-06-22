import type { Metadata } from "next";
import { BookOpenCheck, Flame } from "lucide-react";

import {
  DiagnosisCard,
  ExamQuestionPreviewCard,
  ExamToSrsFlow,
  FAQAccordion,
  FinalCTABand,
  FloatingMetricCard,
  GoldenTimeExplainer,
  GoldenTimeQueuePreview,
  HeroProductMockup,
  LandingHero,
  LanguageSupportCard,
  LearningLoopFlow,
  MarketingSection,
  MarketingSectionHeader,
  PricingPlanCard,
  ProblemCard,
  SolutionStepCard,
  TrustPillarCard,
} from "@/features/marketing";
import {
  DIAGNOSIS_SKILLS,
  EXAM_TO_SRS_STEPS,
  FAQS,
  GOLDEN_TIME_QUEUE,
  GOLDEN_TIME_REASONS,
  LANGUAGES,
  LEARNING_LOOP_STEPS,
  PRICING_PLANS,
  PROBLEMS,
  SOLUTION_STEPS,
  TRUST_PILLARS,
} from "@/features/marketing/constants/landing-content";

export const metadata: Metadata = {
  title: "LexiPath — Học từ vựng theo lộ trình của bạn",
  description:
    "LexiPath dựng lộ trình học từ vựng cá nhân hóa, nhắc ôn đúng Golden Time và biến mỗi lỗi sai trong bài thi thành bài ôn tiếp theo. Tiếng Anh, Nhật, Trung.",
};

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <LandingHero
        eyebrow="Học từ vựng theo lộ trình"
        headline={
          <>
            Học từ vựng theo{" "}
            <em className="text-primary not-italic">lộ trình của bạn</em>
          </>
        }
        sub="LexiPath dựng lộ trình học riêng, nhắc ôn đúng Golden Time, và biến mỗi lỗi sai trong bài thi thành bài ôn tiếp theo."
        ctaLabel="Bắt đầu miễn phí"
        ctaHref="/register"
        secondaryLabel="Thiết lập lộ trình"
        secondaryHref="/onboarding"
      >
        <div className="relative">
          <HeroProductMockup>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <GoldenTimeQueuePreview
                items={GOLDEN_TIME_QUEUE}
                count={12}
                className="shadow-none"
              />
              <DiagnosisCard
                level="TOEIC ~650"
                score={648}
                description="Lộ trình hôm nay tập trung vào Cách dùng và Nghe."
                skills={DIAGNOSIS_SKILLS}
              />
            </div>
          </HeroProductMockup>

          <FloatingMetricCard
            icon={<BookOpenCheck aria-hidden />}
            metric="2.847"
            label="từ đã học"
            className="absolute -top-5 -left-3 hidden sm:flex"
          />
          <FloatingMetricCard
            icon={<Flame aria-hidden />}
            metric="28 ngày"
            label="chuỗi học liên tục"
            className="absolute -right-3 -bottom-5 hidden sm:flex"
          />
        </div>
      </LandingHero>

      {/* Problems */}
      <MarketingSection tone="muted">
        <MarketingSectionHeader
          eyebrow="Vì sao học mãi không nhớ"
          title="Vấn đề bạn đang gặp"
          subtitle="Học nhiều chưa chắc nhớ lâu. Đa số người học mắc đúng ba điểm sau."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <ProblemCard
              key={p.id}
              icon={p.icon}
              title={p.title}
              description={p.description}
            />
          ))}
        </div>
      </MarketingSection>

      {/* Solution / how it works */}
      <MarketingSection id="features">
        <MarketingSectionHeader
          eyebrow="Cách hoạt động"
          title="Được thiết kế cho kết quả thật"
          subtitle="Ba cơ chế cốt lõi giúp bạn nhớ lâu hơn và ôn đúng lúc."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {SOLUTION_STEPS.map((s) => (
            <SolutionStepCard
              key={s.id}
              number={s.number}
              title={s.title}
              description={s.description}
            />
          ))}
        </div>
        <div className="mt-12 rounded-card border border-border bg-card p-6 sm:p-8">
          <LearningLoopFlow steps={LEARNING_LOOP_STEPS} />
        </div>
      </MarketingSection>

      {/* Trust pillars */}
      <MarketingSection tone="muted">
        <div className="grid gap-5 md:grid-cols-3">
          {TRUST_PILLARS.map((t) => (
            <TrustPillarCard
              key={t.id}
              icon={t.icon}
              stat={t.stat}
              label={t.label}
              description={t.description}
            />
          ))}
        </div>
      </MarketingSection>

      {/* Golden Time */}
      <MarketingSection id="golden-time">
        <MarketingSectionHeader
          eyebrow="Golden Time"
          eyebrowTone="golden"
          title="Ôn đúng cửa sổ thời gian vàng"
          subtitle="Không quá sớm, không quá muộn — LexiPath nhắc bạn ôn ngay khi trí nhớ sắp phai."
        />
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <GoldenTimeExplainer
            title="Mỗi từ có một thời điểm ôn tối ưu"
            description="Sau buổi học, LexiPath mở Golden Time cho từng từ dựa trên lịch sử của bạn — đó là lúc ôn lại hiệu quả nhất để chuyển vào trí nhớ dài hạn."
            reasons={GOLDEN_TIME_REASONS}
          />
          <GoldenTimeQueuePreview items={GOLDEN_TIME_QUEUE} count={12} />
        </div>
      </MarketingSection>

      {/* Exam to SRS loop */}
      <MarketingSection tone="muted">
        <MarketingSectionHeader
          eyebrow="Luyện thi thông minh"
          title="Mỗi lỗi sai là một bài ôn"
          subtitle="LexiPath biến từ bạn trả lời sai trong đề thi thành mục ôn tập trong Golden Time."
        />
        <ExamToSrsFlow steps={EXAM_TO_SRS_STEPS} className="mb-8" />
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <ExamQuestionPreviewCard
            type="Trắc nghiệm · TOEIC Part 5"
            question="The new policy will take ____ next month."
            options={["affect", "effect", "effective", "affection"]}
            selectedIndex={0}
            correctIndex={1}
          />
          <DiagnosisCard
            level="TOEIC ~650"
            score={648}
            description="Phân tích sau bài thi chỉ ra kỹ năng cần ưu tiên."
            skills={DIAGNOSIS_SKILLS}
          />
        </div>
      </MarketingSection>

      {/* Languages */}
      <MarketingSection id="languages">
        <MarketingSectionHeader
          eyebrow="Ngôn ngữ hỗ trợ"
          title="Ba thứ tiếng, ba hệ chữ viết"
          subtitle="Mỗi ngôn ngữ có đặc thù phát âm và chữ viết riêng — LexiPath xử lý đúng từng loại."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {LANGUAGES.map((lang) => (
            <LanguageSupportCard
              key={lang.id}
              language={lang.language}
              flag={lang.flag}
              scripts={lang.scripts}
              features={lang.features}
            />
          ))}
        </div>
      </MarketingSection>

      {/* Pricing */}
      <MarketingSection id="pricing" tone="muted">
        <MarketingSectionHeader
          eyebrow="Bảng giá"
          title="Bắt đầu miễn phí, nâng cấp khi cần"
          subtitle="Không cần thẻ tín dụng. Huỷ bất cứ lúc nào."
        />
        <div className="grid gap-6 pt-3 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <PricingPlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </MarketingSection>

      {/* FAQ */}
      <MarketingSection id="faq" containerClassName="max-w-3xl">
        <MarketingSectionHeader eyebrow="Hỏi đáp" title="Câu hỏi thường gặp" />
        <FAQAccordion items={FAQS} />
      </MarketingSection>

      {/* Final CTA */}
      <FinalCTABand
        headline="Sẵn sàng bắt đầu lộ trình của bạn?"
        sub="Miễn phí. Không cần thẻ tín dụng. Bắt đầu trong 2 phút."
        ctaLabel="Tạo tài khoản miễn phí"
        ctaHref="/register"
        secondaryLabel="Đăng nhập"
        secondaryHref="/login"
      />
    </main>
  );
}
