// var a = {
//     a:1,
//     fn: function(b,c){
//         return this.a + b + c
//     }
// }

// var _a = {
//     a:3
// }
// console.log(a.fn(2,3));


Function.prototype.myCall = function (context) {
    const _context = context || window
    _context.fn = this
    const args = [...arguments].slice(1)
    const result = _context.fn(...args)
    delete _context.fn
    return result
}

// console.log(a.fn.call(_a, 2,3))
// console.log(a.fn.myCall(_a, 2,3))

Function.prototype.myApply = function (context) {
    const _context = context || window
    _context.fn = this

    let result

    if (arguments[1]) {
        result = _context.fn(...arguments[1])
    } else {
        result = _context.fn()
    }

    delete _context.fn
    return result
}

// console.log(a.fn.apply(_a,[3,3]))
// console.log(a.fn.myApply(_a,[3,3]))

Function.prototype.myBind = function (context) {
    const _context = context || window

    const _this = this
    const args = [...arguments].slice(1)


    return function F() {
        if (_this instanceof F) {
            return new _this(...args,...arguments)
        }
        return _this.apply(_context,args.concat(...arguments))
    }
}


// const _fn = a.fn.bind(_a,1,1)
// console.log(_fn(2, 3))
// console.log(_fn.call(a, 2, 3))
// const _fn1 = a.fn.bind(_a, 1, 1)
// console.log(_fn1(2, 3))
// console.log(_fn1.call(a,2,3))


