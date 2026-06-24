import { corsPreflightResponse, jsonWithCors } from "@/lib/hcm/cors";
import { deductBalance, getBalance } from "@/lib/hcm/store";
import type {
  ApiErrorResponse,
  ChaosMode,
  RequestSuccessResponse,
  TimeOffRequest,
} from "@/lib/hcm/types";

const CHAOS_MODES: ChaosMode[] = [
  "success",
  "insufficient",
  "silent_failure",
  "timeout",
];

function parseChaosMode(headerValue: string | null): ChaosMode | null | "unknown" {
  if (!headerValue) {
    return null;
  }

  const normalized = headerValue.toLowerCase() as ChaosMode;

  if (!CHAOS_MODES.includes(normalized)) {
    return "unknown";
  }

  return normalized;
}

function isValidRequest(body: unknown): body is TimeOffRequest {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const candidate = body as Partial<TimeOffRequest>;

  return (
    typeof candidate.empId === "string" &&
    candidate.empId.length > 0 &&
    typeof candidate.locId === "string" &&
    candidate.locId.length > 0 &&
    typeof candidate.days === "number" &&
    candidate.days > 0
  );
}

export function OPTIONS() {
  return corsPreflightResponse();
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonWithCors<ApiErrorResponse>(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!isValidRequest(body)) {
    return jsonWithCors<ApiErrorResponse>(
      { error: "empId, locId, and days (> 0) are required" },
      { status: 400 },
    );
  }

  const chaosMode = parseChaosMode(request.headers.get("x-chaos-mode"));

  if (chaosMode === "unknown") {
    return jsonWithCors<ApiErrorResponse>(
      { error: "Unknown chaos mode" },
      { status: 400 },
    );
  }

  if (chaosMode === "timeout") {
    return jsonWithCors<ApiErrorResponse>(
      { error: "Simulated server timeout" },
      { status: 500 },
    );
  }

  if (chaosMode === "insufficient") {
    return jsonWithCors<ApiErrorResponse>(
      { error: "Insufficient balance" },
      { status: 400 },
    );
  }

  const currentBalance = getBalance(body.empId, body.locId);

  if (currentBalance === null) {
    return jsonWithCors<ApiErrorResponse>(
      { error: "Balance not found for employee/location" },
      { status: 404 },
    );
  }

  if (chaosMode === "silent_failure") {
    const response: RequestSuccessResponse = {
      status: "approved",
      empId: body.empId,
      locId: body.locId,
      daysRequested: body.days,
      remainingBalance: currentBalance - body.days,
    };

    return jsonWithCors(response);
  }

  const result = deductBalance(body.empId, body.locId, body.days);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return jsonWithCors<ApiErrorResponse>(
        { error: "Balance not found for employee/location" },
        { status: 404 },
      );
    }

    return jsonWithCors<ApiErrorResponse>(
      { error: "Insufficient balance" },
      { status: 400 },
    );
  }

  const response: RequestSuccessResponse = {
    status: "approved",
    empId: body.empId,
    locId: body.locId,
    daysRequested: body.days,
    remainingBalance: result.remaining,
  };

  return jsonWithCors(response);
}
