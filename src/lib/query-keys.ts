export const balanceKey = (empId: string, locId: string) =>
  ["balance", empId, locId] as const;
