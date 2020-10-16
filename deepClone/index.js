function deepClone(source,map = new WeakMap()) {
  if (source instanceof Object) {
    let dist
    //  对四种类型进行判断
    if (map.get(source)) {
      return map.get(source);
    }
    
    if (source instanceof Array) {
      dist = new Array()
    } else if (source instanceof Function) {
      dist = function () {
        return source.apply(this,arguments)
      }
      dist.name = dist
    } else if (source instanceof Date) {
      dist = new Date(source)
    } else if (source instanceof RegExp) {
      dist = new RegExp(source.source,source.flags)
    }else {
      dist = new Object()
    }
    map.set(source, dist);

    // 进行遍历对象 copy
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        // 递归遍历,传入 map ，保证同一个
        dist[key] = deepClone(source[key],map)
      }
    }

    return dist
  }

  return source
}

const a = {
  name: function () {
    console.log('name')
  },
  date: new Date(),
  array: [1, 2, 3],
}
// 环，存在爆栈，暂不考虑
a.a = a

const b = deepClone(a)

console.log('a:', a)
console.log('b:', b)
