export const validateForm = (
  name: string,
  email: string,
  message: string
): {
  isNameRequired: boolean;
  isEmailRequired: boolean;
  isMessageRequired: boolean;
} => {
  let isNameRequired = false;
  let isEmailRequired = false;
  let isMessageRequired = false;

  if (!name.trim()) {
    isNameRequired = true;
  }

  if (!email.trim()) {
    isEmailRequired = true;
  }

  if (!message.trim()) {
    isMessageRequired = true;
  }

  return { isNameRequired, isEmailRequired, isMessageRequired };
};
