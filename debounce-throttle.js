// 防抖和节流的作用都是防止函数多次调用。
// 区别在于，假设一个用户一直触发这个函数，且每次触发函数的间隔小于wait，
// 防抖的情况下只会调用一次，将多次执行变为最后一次执行
// 节流的情况会每隔一定时间（参数wait）调用函数,缓存知性操作，依次执行。

// 简易版 防抖
const debounce = (fn, wait = 500) => {
    let timer
    return () => { 
        if (timer) clearTimeout
        timer = setTimeout((...args) => {
            fn.apply(this, args)
        }, wait)
    } 
}

// 立即执行版 防抖
function Debounce(fn, wait = 50, immediate = true) {
    let timer, context, args

    const later = () => setTimeout(() => {
        timer = null
        if (!immediate) {
            fn.apply(context, args)
        }
    }, wait)
    
    return function(...params) {
        if (!timer) {
            timer = later()
            if (immediate) {
                fn.apply(this, params)
            } else {
                context = this
                args = params
            }
        } else {
            clearTimeout(timer)
            timer = later()
        }
    }
}

const a = Debounce(() => {
    console.log(1)
}, 1000, true)

a()
a()
setTimeout(() => {
    a()
},1001)
a()