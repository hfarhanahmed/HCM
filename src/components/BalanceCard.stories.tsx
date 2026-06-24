import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BalanceCard } from "./BalanceCard";

const meta = {
  title: "Components/BalanceCard",
  component: BalanceCard,
  parameters: {
    layout: "centered",
  },
  args: {
    empId: "emp-001",
    locId: "loc-us",
    lastUpdated: new Date("2026-06-23T10:00:00"),
  },
} satisfies Meta<typeof BalanceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    daysAvailable: 10,
    status: "loading",
  },
};

export const Empty: Story = {
  args: {
    daysAvailable: 0,
    status: "idle",
  },
};

export const IdealState: Story = {
  args: {
    daysAvailable: 10,
    status: "idle",
    lastUpdated: new Date(),
  },
};

export const MidSessionRefresh: Story = {
  args: {
    daysAvailable: 11,
    status: "idle",
    bonusMessage: "Work Anniversary Bonus Applied!",
    lastUpdated: new Date(),
  },
};

export const DiscrepancyCaught: Story = {
  args: {
    daysAvailable: 10,
    status: "discrepancy",
    lastUpdated: new Date(),
  },
};
