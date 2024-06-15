const obj = {
  a: {
    b: 1,
    c: 2,
    d: { e: 5 },
  },
  b: [1, 3, { a: 2, b: 3 }],
  c: 3,
};

// {
//   a.b: 1,
//   a.c: 2,
//   a.d.e: 5,
//   b[0]: 1,
//   b[1]: 3,
//   b[2].a: 2,
//   b[2].b: 3,
//   c: 3
// }

function joinKeys(keyPath) {
  let realKey = keyPath.join('.');
  realKey = realKey.replace('.[', '[');
  return realKey;
}

function getPathObj(obj, result = {}, keyPath = []) {
  if (!(obj instanceof Object)) {
    const realKey = joinKeys(keyPath);
    result[realKey] = obj;
    return result;
  }

  for (let key in obj) {
    const itemVal = obj[key];
    if (Array.isArray(itemVal)) {
      for (let i = 0; i < itemVal.length; i++) {
        getPathObj(itemVal[i], result, [...keyPath, key, `[${i}]`]);
      }
    } else if (itemVal instanceof Object) {
      getPathObj(itemVal, result, [...keyPath, key]);
    } else {
      const realKey = joinKeys([...keyPath, key]);
      result[realKey] = itemVal;
    }
  }

  return result;
}

const result = getPathObj({
  a: {
    b: 1,
    c: 2,
    d: { e: 5 },
  },
  b: [1, 3, { a: 2, b: 3 }],
  c: 3,
});
console.log('result: ', result);
