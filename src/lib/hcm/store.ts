import type { BalanceCell, DeductBalanceResult } from "./types";

type BalanceKey = `${string}:${string}`;

function toKey(empId: string, locId: string): BalanceKey {
  return `${empId}:${locId}`;
}

function createSeedBalances(): Map<BalanceKey, number> {
  const seed: BalanceCell[] = [
    { empId: "emp-001", locId: "loc-us", days: 12 },
    { empId: "emp-001", locId: "loc-eu", days: 14 },
    { empId: "emp-002", locId: "loc-us", days: 1 },
    { empId: "emp-002", locId: "loc-eu", days: 11 },
    { empId: "emp-003", locId: "loc-us", days: 15 },
    { empId: "emp-003", locId: "loc-eu", days: 0 },
  ];

  return new Map(seed.map((cell) => [toKey(cell.empId, cell.locId), cell.days]));
}

type HcmGlobal = typeof globalThis & {
  __hcmBalances?: Map<BalanceKey, number>;
  __hcmBonusStarted?: boolean;
};

// In-memory state resets when the server process restarts (acceptable for this mock).
function getBalanceMap(): Map<BalanceKey, number> {
  const globalStore = globalThis as HcmGlobal;

  if (!globalStore.__hcmBalances) {
    globalStore.__hcmBalances = createSeedBalances();
  }

  return globalStore.__hcmBalances;
}

export function getAllBalances(): BalanceCell[] {
  const balances = getBalanceMap();
  const cells: BalanceCell[] = [];

  for (const [key, days] of balances.entries()) {
    const [empId, locId] = key.split(":") as [string, string];
    cells.push({ empId, locId, days });
  }

  return cells.sort((a, b) =>
    a.empId.localeCompare(b.empId) || a.locId.localeCompare(b.locId),
  );
}

export function getBalance(empId: string, locId: string): number | null {
  const balances = getBalanceMap();
  const value = balances.get(toKey(empId, locId));
  return value === undefined ? null : value;
}

export function deductBalance(
  empId: string,
  locId: string,
  days: number,
): DeductBalanceResult {
  const balances = getBalanceMap();
  const key = toKey(empId, locId);
  const current = balances.get(key);

  if (current === undefined) {
    return { ok: false, reason: "not_found" };
  }

  if (days > current) {
    return { ok: false, reason: "insufficient" };
  }

  const remaining = current - days;
  balances.set(key, remaining);

  return { ok: true, remaining };
}

export function addBonusDay(empId: string, locId: string): number {
  const balances = getBalanceMap();
  const key = toKey(empId, locId);
  const current = balances.get(key) ?? 0;
  const updated = current + 1;
  balances.set(key, updated);
  return updated;
}

export function startAnniversaryBonusInterval(): void {
  const globalStore = globalThis as HcmGlobal;

  if (globalStore.__hcmBonusStarted) {
    return;
  }

  globalStore.__hcmBonusStarted = true;

  setInterval(() => {
    const cells = getAllBalances();

    if (cells.length === 0) {
      return;
    }

    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    const updatedBalance = addBonusDay(randomCell.empId, randomCell.locId);

    console.log(
      `[HCM] Work Anniversary Bonus: +1 day for ${randomCell.empId}/${randomCell.locId} (now ${updatedBalance} days)`,
    );
  }, 45_000);
}
