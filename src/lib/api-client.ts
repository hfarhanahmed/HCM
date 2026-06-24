import type {
  ApiErrorResponse,
  BalanceResponse,
  BatchResponse,
  ChaosMode,
  RequestSuccessResponse,
  TimeOffRequest,
} from "@/lib/hcm/types";

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorResponse;
    return body.error ?? `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

export async function fetchBatchBalances(): Promise<BatchResponse> {
  const response = await fetch("/api/hcm/batch");

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<BatchResponse>;
}

export async function fetchSingleBalance(
  empId: string,
  locId: string,
): Promise<BalanceResponse> {
  const params = new URLSearchParams({ empId, locId });
  const response = await fetch(`/api/hcm/balance?${params.toString()}`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<BalanceResponse>;
}

export async function submitTimeOffRequest(
  payload: TimeOffRequest,
  chaosMode?: ChaosMode,
): Promise<RequestSuccessResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (chaosMode) {
    headers["x-chaos-mode"] = chaosMode;
  }

  const response = await fetch("/api/hcm/request", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<RequestSuccessResponse>;
}
