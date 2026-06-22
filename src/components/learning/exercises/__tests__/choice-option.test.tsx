import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChoiceOption } from "../choice-option";

describe("ChoiceOption", () => {
  it("renders children and optionKey", () => {
    render(
      <ChoiceOption optionKey="A" state="idle">
        Tokyo
      </ChoiceOption>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
  });

  it("calls onClick when idle and clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChoiceOption state="idle" onClick={onClick}>
        Tokyo
      </ChoiceOption>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when state is correct", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChoiceOption state="correct" onClick={onClick}>
        Tokyo
      </ChoiceOption>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows check icon on correct state", () => {
    render(<ChoiceOption state="correct">Tokyo</ChoiceOption>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
