import { corsPreflightResponse, jsonWithCors } from "@/lib/hcm/cors";
import { getBalance } from "@/lib/hcm/store";
import type { ApiErrorResponse, BalanceResponse } from "@/lib/hcm/types";

export function OPTIONS() {
  return corsPreflightResponse();
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const empId = searchParams.get("empId");
  const locId = searchParams.get("locId");

  if (!empId || !locId) {
    return jsonWithCors<ApiErrorResponse>(
      { error: "empId and locId query parameters are required" },
      { status: 400 },
    );
  }

  const days = getBalance(empId, locId);

  if (days === null) {
    return jsonWithCors<ApiErrorResponse>(
      { error: "Balance not found for employee/location" },
      { status: 404 },
    );
  }

  const response: BalanceResponse = { empId, locId, days };
  return jsonWithCors(response);
}
