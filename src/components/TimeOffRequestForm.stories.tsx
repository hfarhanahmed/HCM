import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TimeOffRequestForm } from "./TimeOffRequestForm";

const meta = {
  title: "Components/TimeOffRequestForm",
  component: TimeOffRequestForm,
  parameters: {
    layout: "centered",
  },
  args: {
    availableDays: 10,
    isSubmitting: false,
    onSubmit: fn(),
  },
} satisfies Meta<typeof TimeOffRequestForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    availableDays: 10,
    isSubmitting: false,
  },
};

export const OptimisticPending: Story = {
  args: {
    availableDays: 10,
    isSubmitting: true,
  },
};

export const OptimisticRolledBack: Story = {
  args: {
    availableDays: 10,
    isSubmitting: false,
    error: "HCM System rejected the request: Insufficient Balance",
  },
};

export const UserFlowSubmit: Story = {
  args: {
    availableDays: 10,
    isSubmitting: false,
    onSubmit: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.clear(canvas.getByLabelText(/days requested/i));
    await userEvent.type(canvas.getByLabelText(/days requested/i), "2");
    await userEvent.click(canvas.getByRole("button", { name: /submit request/i }));

    await expect(args.onSubmit).toHaveBeenCalledWith(2);
  },
};
