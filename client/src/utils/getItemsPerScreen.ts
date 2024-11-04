export const getItemsPerScreen = () => {
  const width = window.innerWidth;
  if (width >= 1200) return 4;
  if (width >= 992) return 3;
  if (width >= 768) return 2;
  if (width >= 576) return 1;
  return 2;
};
