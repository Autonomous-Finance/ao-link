export const truncateId = (text: string) => {
  if (text.length <= 16) return text;
  return text.slice(0, 8) + "....." + text.slice(-8);
};
