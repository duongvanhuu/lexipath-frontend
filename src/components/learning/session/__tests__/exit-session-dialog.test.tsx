import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ExitSessionDialog } from "../exit-session-dialog";

describe("ExitSessionDialog", () => {
  it("does not render content when open=false", () => {
    render(
      <ExitSessionDialog
        open={false}
        onOpenChange={vi.fn()}
        onExit={vi.fn()}
      />
    );
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("renders when open=true", () => {
    render(
      <ExitSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onExit={vi.fn()}
      />
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Thoát buổi học?")).toBeInTheDocument();
  });

  it("calls onExit when exit button clicked", async () => {
    const user = userEvent.setup();
    const onExit = vi.fn();
    render(
      <ExitSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onExit={onExit}
      />
    );
    await user.click(screen.getByRole("button", { name: "Thoát" }));
    expect(onExit).toHaveBeenCalledOnce();
  });

  it("shows progress bar when progress prop provided", () => {
    render(
      <ExitSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onExit={vi.fn()}
        progress={60}
      />
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText(/60%/)).toBeInTheDocument();
  });
});
