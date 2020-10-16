function deepClone(source) {
  // 避免循环引用
  const cache = []

  function findCache(source) {
    for (let i = 0; i < cache.length; i++) {
      if (cache[i][0] == source) {
        return cache[i][1]
      }
    }
    return undefined
  }

  if (source instanceof Object) {
    let dist
    //  对四种类型进行判断
    let cachedDist = findCache(source);
    if (cachedDist) {
      return cachedDist
    } else {
      if (source instanceof Array) {
        dist = new Array()
      } else if (source instanceof Function) {
        dist = function () {
          return source.apply(this,arguments)
        }
        console.log(dist.name)
        dist.name = dist
      } else if (source instanceof Date) {
        dist = new Date(source)
      } else if (source instanceof RegExp) {
        dist = new RegExp(source.source,source.flags)
      }else {
        dist = new Object()
      }
    }

    cache.push([source,dist])

    // 进行遍历对象 copy
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        // 递归遍历
        dist[key] = deepClone(source[key])
      }
    }

    return dist
  }

  return source
}

const a = {
  a: '1',
  name: function () {
    console.log('name')
  },
  date: new Date(),
  array: [1, 2, 3],
}
// 环，存在爆栈，暂不考虑
// a.a = a

const b = deepClone(a)

console.log('a:', a)
console.log('b:', b)

console.log(b.name.name)
