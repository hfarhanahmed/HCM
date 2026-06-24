import { corsPreflightResponse, jsonWithCors } from "@/lib/hcm/cors";
import { getAllBalances, startAnniversaryBonusInterval } from "@/lib/hcm/store";
import type { BatchResponse } from "@/lib/hcm/types";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function OPTIONS() {
  return corsPreflightResponse();
}

export async function GET() {
  startAnniversaryBonusInterval();
  await delay(1500);

  const response: BatchResponse = {
    balances: getAllBalances(),
    asOf: new Date().toISOString(),
  };

  return jsonWithCors(response);
}
