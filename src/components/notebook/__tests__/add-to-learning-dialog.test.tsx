import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AddToLearningDialog } from "../add-to-learning-dialog";

const collections = [
  { id: "col-1", name: "JLPT N4" },
  { id: "col-2", name: "Business Japanese" },
];

describe("AddToLearningDialog", () => {
  it("renders collection options when open", () => {
    render(
      <AddToLearningDialog
        open={true}
        onOpenChange={vi.fn()}
        word="猫"
        collections={collections}
        onSelectedCollectionChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText("JLPT N4")).toBeInTheDocument();
    expect(screen.getByText("Business Japanese")).toBeInTheDocument();
  });

  it("calls onSelectedCollectionChange when radio changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AddToLearningDialog
        open={true}
        onOpenChange={vi.fn()}
        word="猫"
        collections={collections}
        selectedCollectionId="col-1"
        onSelectedCollectionChange={onChange}
        onConfirm={vi.fn()}
      />
    );
    await user.click(screen.getByLabelText("Business Japanese"));
    expect(onChange).toHaveBeenCalledWith("col-2");
  });

  it("calls onConfirm when confirm button clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AddToLearningDialog
        open={true}
        onOpenChange={vi.fn()}
        word="猫"
        collections={collections}
        selectedCollectionId="col-1"
        onSelectedCollectionChange={vi.fn()}
        onConfirm={onConfirm}
      />
    );
    await user.click(screen.getByRole("button", { name: "Thêm" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
