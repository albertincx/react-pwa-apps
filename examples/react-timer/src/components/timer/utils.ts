export const getRandomMs = () => Math.random();

export const getTimeStr = (t: number) => `${t < 10 ? `0${t}` : t}`;
