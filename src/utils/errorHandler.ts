export const logError = (context: string, error: unknown) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.error(`[SafeNest][${context}]`, error);
  } else {
    // In production, this could be wired to a logging/monitoring service.
    // eslint-disable-next-line no-console
    console.error(`[SafeNest][${context}]`, error);
  }
};

export const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
};

