export const zero_pad = (x: number): string => {
  return x > 9 ? `${x}` : `0${x}`;
};
