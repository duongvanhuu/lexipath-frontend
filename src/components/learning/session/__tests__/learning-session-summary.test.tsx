import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { LearningSessionSummary } from "../learning-session-summary";
import type { SessionSkillBreakdownItem } from "@/features/learning/types/session.types";

const SKILL_BREAKDOWN: SessionSkillBreakdownItem[] = [
  { skill: "meaning",  label: "Ý nghĩa",   correct: 2, total: 3 },
  { skill: "spelling", label: "Chính tả",  correct: 1, total: 1 },
  { skill: "usage",    label: "Ứng dụng",  correct: 0, total: 1 },
];

const BASE_PROPS = {
  lessonTitle: "Từ vựng học thuật",
  correctCount: 3,
  incorrectCount: 2,
  totalXp: 55,
  durationLabel: "3:42",
  skillBreakdown: SKILL_BREAKDOWN,
  onHome: vi.fn(),
};

describe("LearningSessionSummary — header", () => {
  it("renders the completion title", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(screen.getByText("Phiên học hoàn thành!")).toBeInTheDocument();
  });

  it("renders the lesson title as context line", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(screen.getByText(/Từ vựng học thuật/)).toBeInTheDocument();
  });

  it("shows high accuracy subtitle when accuracy >= 90%", () => {
    render(
      <LearningSessionSummary
        {...BASE_PROPS}
        correctCount={9}
        incorrectCount={1}
      />
    );
    expect(
      screen.getByText("Xuất sắc! Bạn nắm vững bài học này.")
    ).toBeInTheDocument();
  });

  it("shows medium accuracy subtitle when accuracy is 70–89%", () => {
    render(
      <LearningSessionSummary
        {...BASE_PROPS}
        correctCount={7}
        incorrectCount={3}
      />
    );
    expect(
      screen.getByText("Tốt lắm! Tiếp tục ôn luyện để củng cố.")
    ).toBeInTheDocument();
  });

  it("shows low accuracy subtitle when accuracy < 70%", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    // 3/5 = 60%
    expect(
      screen.getByText("Cố gắng lên! Ôn lại bài sẽ giúp bạn tiến bộ nhanh hơn.")
    ).toBeInTheDocument();
  });
});

describe("LearningSessionSummary — stats", () => {
  it("renders correct count tile", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(screen.getByText("3/5")).toBeInTheDocument(); // 3 correct of 5 total
  });

  it("renders incorrect count tile", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders XP tile", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(screen.getByText("+55")).toBeInTheDocument();
  });

  it("renders duration tile", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(screen.getByText("3:42")).toBeInTheDocument();
  });
});

describe("LearningSessionSummary — skill breakdown", () => {
  it("renders a row for each skill in the breakdown", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(screen.getByText("Ý nghĩa")).toBeInTheDocument();
    expect(screen.getByText("Chính tả")).toBeInTheDocument();
    expect(screen.getByText("Ứng dụng")).toBeInTheDocument();
  });

  it("shows correct/total text for each skill row", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(screen.getByText("2/3 đúng")).toBeInTheDocument();
    expect(screen.getByText("1/1 đúng")).toBeInTheDocument();
    expect(screen.getByText("0/1 đúng")).toBeInTheDocument();
  });

  it("does not render the skill breakdown section when skillBreakdown is empty", () => {
    render(<LearningSessionSummary {...BASE_PROPS} skillBreakdown={[]} />);
    expect(
      screen.queryByText("Kỹ năng trong buổi học")
    ).not.toBeInTheDocument();
  });
});

describe("LearningSessionSummary — weak area hint", () => {
  it("shows weak area banner when a skill accuracy < 60%", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    // "Ứng dụng" is 0/1 = 0%, so weak
    expect(screen.getByText(/Ứng dụng.*cần ôn thêm/)).toBeInTheDocument();
  });

  it("shows positive banner when all skills >= 60%", () => {
    const goodBreakdown: SessionSkillBreakdownItem[] = [
      { skill: "meaning", label: "Ý nghĩa", correct: 3, total: 4 },
      { skill: "spelling", label: "Chính tả", correct: 2, total: 2 },
    ];
    render(
      <LearningSessionSummary
        {...BASE_PROPS}
        skillBreakdown={goodBreakdown}
      />
    );
    expect(
      screen.getByText("Bạn làm tốt tất cả kỹ năng trong buổi học!")
    ).toBeInTheDocument();
  });

  it("hides hint section when skillBreakdown is empty", () => {
    render(<LearningSessionSummary {...BASE_PROPS} skillBreakdown={[]} />);
    expect(
      screen.queryByText(/cần ôn thêm/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Bạn làm tốt tất cả kỹ năng trong buổi học!")
    ).not.toBeInTheDocument();
  });
});

describe("LearningSessionSummary — CTAs", () => {
  it("renders the home button always", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(
      screen.getByRole("button", { name: "Về trang chủ" })
    ).toBeInTheDocument();
  });

  it("calls onHome when home button clicked", async () => {
    const user = userEvent.setup();
    const onHome = vi.fn();
    render(<LearningSessionSummary {...BASE_PROPS} onHome={onHome} />);
    await user.click(screen.getByRole("button", { name: "Về trang chủ" }));
    expect(onHome).toHaveBeenCalledOnce();
  });

  it("does not render continue button when onContinue is not provided", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(
      screen.queryByRole("button", { name: "Học tiếp" })
    ).not.toBeInTheDocument();
  });

  it("renders continue button when onContinue is provided", () => {
    render(
      <LearningSessionSummary {...BASE_PROPS} onContinue={vi.fn()} />
    );
    expect(
      screen.getByRole("button", { name: "Học tiếp" })
    ).toBeInTheDocument();
  });

  it("calls onContinue when continue button clicked", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <LearningSessionSummary {...BASE_PROPS} onContinue={onContinue} />
    );
    await user.click(screen.getByRole("button", { name: "Học tiếp" }));
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it("does not render review-weak button when onReviewWeak is not provided", () => {
    render(<LearningSessionSummary {...BASE_PROPS} />);
    expect(
      screen.queryByRole("button", { name: "Ôn từ yếu" })
    ).not.toBeInTheDocument();
  });

  it("renders review-weak button when onReviewWeak is provided", () => {
    render(
      <LearningSessionSummary {...BASE_PROPS} onReviewWeak={vi.fn()} />
    );
    expect(
      screen.getByRole("button", { name: "Ôn từ yếu" })
    ).toBeInTheDocument();
  });
});
