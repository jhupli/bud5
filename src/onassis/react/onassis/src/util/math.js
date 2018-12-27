function isEven(n) {
  n = Number(n);
  return n === 0 || !!(n && !(n%2));
}

export {isEven}