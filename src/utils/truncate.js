/**
 * trauncate string by allow symbols count
 * @param {String} str
 * @param {Number} allowSymbolsCount
 * @param {Boolean} useWordBoundary
 * @returns {String}
 */
const truncate = (str, allowSymbolsCount, useWordBoundary = false) => {
  if (str.length <= allowSymbolsCount) {
    return str;
  }

  const subString = str.substr(0, allowSymbolsCount - 1);

  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(' '))
      : subString) + '…'
  );
};

export default truncate;

