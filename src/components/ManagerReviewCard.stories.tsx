import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ManagerReviewCard } from "./ManagerReviewCard";

const meta = {
  title: "Components/ManagerReviewCard",
  component: ManagerReviewCard,
  parameters: {
    layout: "centered",
  },
  args: {
    request: {
      empId: "emp-002",
      locId: "loc-us",
      daysRequested: 2,
    },
    currentLiveBalance: null,
    onVerify: fn(),
    onApprove: fn(),
    onDeny: fn(),
  },
} satisfies Meta<typeof ManagerReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unverified: Story = {
  args: {
    verificationState: "unverified",
    currentLiveBalance: null,
  },
};

export const Verifying: Story = {
  args: {
    verificationState: "verifying",
    currentLiveBalance: null,
  },
};

export const VerifiedSufficient: Story = {
  args: {
    verificationState: "verified-sufficient",
    currentLiveBalance: 12,
  },
};

export const VerifiedInsufficient: Story = {
  args: {
    verificationState: "verified-insufficient",
    currentLiveBalance: 1,
  },
};
