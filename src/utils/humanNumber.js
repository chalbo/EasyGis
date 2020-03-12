
export default (string = '') => {
  if (!string) {
    return;
  }

  if (+string < 100000) {
    // eslint-disable-next-line consistent-return
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const count = (+string / 1000).toFixed(1);

  if (count.slice(-1) === '0') {
    // eslint-disable-next-line consistent-return
    return `${count.slice(0, count.length - 2)}K`;
  }

  // eslint-disable-next-line consistent-return
  return `${count}K`;
};
