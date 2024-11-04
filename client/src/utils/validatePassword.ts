export const validatePassword = (
  password: string,
  confirmPassword: string
): {
  isPasswordRequired: boolean;
  isNotPattern: boolean;
  isNotMatch: boolean;
} => {
  let isPasswordRequired = false;
  let isNotPattern = false;
  let isNotMatch = false;

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password) {
    isPasswordRequired = true;
  } else if (!passwordPattern.test(password)) {
    isNotPattern = true;
  }
  if (password !== confirmPassword) {
    isNotMatch = true;
  }

  return { isPasswordRequired, isNotPattern, isNotMatch };
};
