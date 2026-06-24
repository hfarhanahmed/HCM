const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-chaos-mode",
};

export function jsonWithCors<T>(
  data: T,
  init?: ResponseInit,
): Response {
  const headers = new Headers(init?.headers);

  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }

  headers.set("Content-Type", "application/json");

  return Response.json(data, {
    ...init,
    headers,
  });
}

export function corsPreflightResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
