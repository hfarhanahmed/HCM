"use client";

import { FormEvent, useState } from "react";

export type TimeOffRequestFormProps = {
  availableDays: number;
  isSubmitting: boolean;
  error?: string;
  onSubmit: (days: number) => void;
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
    />
  );
}

export function TimeOffRequestForm({
  availableDays,
  isSubmitting,
  error,
  onSubmit,
}: TimeOffRequestFormProps) {
  const [daysInput, setDaysInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const days = Number.parseInt(daysInput, 10);

    if (Number.isNaN(days) || days < 1) {
      return;
    }

    onSubmit(days);
  }

  const isDisabled = isSubmitting || availableDays === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
      aria-labelledby="time-off-request-form-title"
    >
      <h2
        id="time-off-request-form-title"
        className="text-sm font-medium text-zinc-900"
      >
        Request Time Off
      </h2>

      <p className="mt-1 text-xs text-zinc-500">
        {availableDays === 0
          ? "No days available to request"
          : `${availableDays} ${availableDays === 1 ? "day" : "days"} available`}
      </p>

      <div className="mt-4">
        <label
          htmlFor="days-requested"
          className="block text-sm font-medium text-zinc-700"
        >
          Days requested
        </label>
        <input
          id="days-requested"
          name="daysRequested"
          type="number"
          min={1}
          max={availableDays > 0 ? availableDays : undefined}
          value={daysInput}
          onChange={(event) => setDaysInput(event.target.value)}
          disabled={isDisabled}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-zinc-100"
        />
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isDisabled}
        aria-busy={isSubmitting}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Spinner />
            Submitting...
          </>
        ) : (
          "Submit request"
        )}
      </button>
    </form>
  );
}
