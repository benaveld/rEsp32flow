import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Source: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

export interface ErrorWithMessage {
  message: string;
}

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 * Source: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
 */
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error))
    return "error" in error ? error.error : JSON.stringify(error.data);
  return toErrorWithMessage(error).message;
}
