export const validateName = (name: string): boolean => {
  let isValid = true;

  if (!name || name.trim() === "") {
    isValid = false;
  }

  return isValid;
};
