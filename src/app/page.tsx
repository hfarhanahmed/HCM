"use client";

import { useState } from "react";

type ApiResult = {
  label: string;
  status: number;
  body: string;
};

async function callApi(
  label: string,
  input: RequestInfo,
  init?: RequestInit,
): Promise<ApiResult> {
  const response = await fetch(input, init);
  const body = await response.text();

  return {
    label,
    status: response.status,
    body: body || "(empty body)",
  };
}

export default function Home() {
  const [results, setResults] = useState<ApiResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  async function runSmokeTests() {
    setIsRunning(true);
    setResults([]);

    const nextResults: ApiResult[] = [];

    nextResults.push(
      await callApi("GET /api/hcm/batch", "/api/hcm/batch"),
    );

    nextResults.push(
      await callApi(
        "GET /api/hcm/balance",
        "/api/hcm/balance?empId=emp-001&locId=loc-us",
      ),
    );

    nextResults.push(
      await callApi("POST success", "/api/hcm/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-chaos-mode": "success",
        },
        body: JSON.stringify({
          empId: "emp-001",
          locId: "loc-us",
          days: 1,
        }),
      }),
    );

    nextResults.push(
      await callApi("POST natural insufficient", "/api/hcm/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId: "emp-002",
          locId: "loc-us",
          days: 2,
        }),
      }),
    );

    setResults(nextResults);
    setIsRunning(false);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">ExampleHR — Phase 1 Mock API</h1>
        <p className="text-sm text-zinc-600">
          Smoke-test panel for the in-memory HCM route handlers.
        </p>
      </header>

      <button
        type="button"
        onClick={runSmokeTests}
        disabled={isRunning}
        className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isRunning ? "Running tests..." : "Run API smoke tests"}
      </button>

      {results.length > 0 && (
        <section className="space-y-4">
          {results.map((result) => (
            <article
              key={result.label}
              className="rounded-md border border-zinc-200 p-4"
            >
              <h2 className="font-medium">
                {result.label}{" "}
                <span className="text-zinc-500">({result.status})</span>
              </h2>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-zinc-700">
                {result.body}
              </pre>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
