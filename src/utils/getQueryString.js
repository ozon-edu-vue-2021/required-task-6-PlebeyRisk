const getQueryArray = (obj, path = [], result = []) =>
  Object.entries(obj).reduce((acc, [ k, v ]) => {
    path.push(k);

    if (v instanceof Object) {
      getQueryArray(v, path, acc);
    } else {
      acc.push(`${path.map((n, i) => i ? `[${n}]` : n).join('')}=${v}`);
    }

    path.pop();

    return acc;
  }, result);

const getQueryString = obj => getQueryArray(obj).join('&');

export default getQueryString;
