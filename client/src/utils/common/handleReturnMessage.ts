export const handleErrorMessage = (
  error: unknown,
  defaultErrorMessage: string = "An unexpected error occurred"
): string => {
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message?: string }).message || defaultErrorMessage;
  }
  return defaultErrorMessage;
};

type ResultAction = { message?: string };

export const handleSuccessMessage = (
  resultAction?: ResultAction,
  defaultSuccessMessage: string = "Operation successful"
): string => {
  return resultAction?.message || defaultSuccessMessage;
};
