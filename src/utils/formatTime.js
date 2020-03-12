
export default (time) => {
  const hours = Math.floor(time / 60);
  const minutes = time - hours * 60;

  return `${hours} HOUR ${minutes} MINS`;
};
