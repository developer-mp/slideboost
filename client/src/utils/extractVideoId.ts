export const extractVideoId = (link: string): string => {
  const regex = /[?&]?(?:v=|vi?=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = link.match(regex);
  return match ? match[1] : "";
};
