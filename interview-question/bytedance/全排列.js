const arr = ['a', 'b', 'c'];

function bracket(arr) {
  const res = [];
  const path = [];
  function backing(used = []) {
    if (path.length === arr.length) {
      res.push([...path]);
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue;
      path.push(arr[i]);
      used[i] = true;
      backing(used);
      path.pop();
      used[i] = false;
    }
  }
  backing();
  return res;
}

const res = bracket(arr);
console.log('res: ', res);
