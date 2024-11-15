export const validateEmail = (
  email: string
): { isEmailRequired: boolean; isFormatInvalid: boolean } => {
  let isEmailRequired = false;
  let isFormatInvalid = false;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    isEmailRequired = true;
  } else if (!emailPattern.test(email)) {
    isFormatInvalid = true;
  }

  return { isEmailRequired, isFormatInvalid };
};
