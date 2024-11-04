export const truncateText = (text: string, maxLength: number = 10): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
