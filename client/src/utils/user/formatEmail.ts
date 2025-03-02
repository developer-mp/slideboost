export const formatEmail = (email: string): string => {
  if (email.length < 6) {
    return email;
  }

  const atIndex = email.indexOf("@");
  if (atIndex === -1) {
    return email;
  }

  const firstChar = email[0];
  const lastChar = email[atIndex - 1];
  const domainAndRest = email.slice(atIndex);
  const maskedPart = "*".repeat(5);

  return `${firstChar}${maskedPart}${lastChar}${domainAndRest}`;
};
