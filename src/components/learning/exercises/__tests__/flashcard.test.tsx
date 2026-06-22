import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Flashcard } from "../flashcard";

const baseProps = {
  word: "猫",
  meaning: "Con mèo",
};

describe("Flashcard", () => {
  it("shows front face by default (unflipped)", () => {
    render(<Flashcard {...baseProps} />);
    expect(screen.getByText("Nhấn vào thẻ để xem nghĩa")).toBeInTheDocument();
  });

  it("flips to back face on click", async () => {
    const user = userEvent.setup();
    render(<Flashcard {...baseProps} />);
    await user.click(screen.getByRole("button", { name: /xem nghĩa/i }));
    expect(screen.getByRole("button", { name: /ẩn nghĩa/i })).toBeInTheDocument();
  });

  it("calls onFlip with toggled value when controlled", async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(<Flashcard {...baseProps} isFlipped={false} onFlip={onFlip} />);
    await user.click(screen.getByRole("button", { name: /xem nghĩa/i }));
    expect(onFlip).toHaveBeenCalledWith(true);
  });

  it("flips on Enter key press", async () => {
    const user = userEvent.setup();
    render(<Flashcard {...baseProps} />);
    const card = screen.getByRole("button", { name: /xem nghĩa/i });
    card.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: /ẩn nghĩa/i })).toBeInTheDocument();
  });

  it("renders audio buttons with aria-labels", () => {
    render(<Flashcard {...baseProps} audioLabel="Nghe" />);
    expect(screen.getByRole("button", { name: "Nghe" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nghe chậm" })).toBeInTheDocument();
  });
});
