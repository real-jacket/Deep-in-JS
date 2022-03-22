const all = function (arr) {
	const args = Array.prototype.slice.call(arr)
	return new Promise((resolve, reject) => {
		if (args.length === 0) return resolve([])
		let remaining = args.length

		function res(i, val) {
			try {
				if (val && (typeof val === 'object' || typeof val === 'function')) {
					const { then } = val
					if (typeof then === 'function') {
						then.call(
							val,
							(val) => {
								res(i, val)
							},
							reject
						)
						return
					}
				}
				args[i] = val
				if (--remaining === 0) {
					resolve(args)
				}
			} catch (ex) {
				reject(ex)
			}
		}
		for (let i = 0; i < args.length; i++) {
			res(i, args[i])
		}
	})
}

const race = function (values) {
	return new Promise((resolve, reject) => {
		for (let i = 0, len = values.length; i < len; i++) {
			values[i].then(resolve, reject)
		}
	})
}

const any = function (arr) {
    const args = Array.prototype.slice.call(arr)
    return new Promise((resolve,reject) => {
        if (args.length === 0) return resolve([])
        let remaining = args.length

        function res(p) {
            p.then(resolve, () => {
                if (--remaining === 0) {
                    reject(new AggregateError('no any promise fulfilled'))   
                }
            })
        }

        for (let i = 0; i < remaining; i++){
            res(i,args[i])
        }
    })
    
}

const allSettle = function (arr) {
    return new Promise((resolve) => {
        let l = arr.length
        const result = []
        if (l === 0) {
            resolve(result)
        } else {
            arr.forEach((p,i) => {
                p.then((val) => {
                    result[i] = {
                        status: 'fulfilled',
                        val
                    }
                    l--
                }, (reason) => {
                    result[i] = {
                        status: 'rejected',
                        val:reason
                    }
                    l--
                }).finally(() => {
                    if (l === 0) {
                        resolve(result)
                    }
                })
            });
        }
    })
    
}

const settleA = function (arr) {
	return arr.reduce((s, v) => {
        return s.then(() => v)
	}, Promise.resolve())
}
const settleB = function (arr) {
    (function inter() {
        if(arr.length)
        arr.shift().then(() => {
            return inter()
        })
    })()
}

// let fa,fb,fc
const a = new Promise((resolve) => {
    fa =resolve
})

const b = new Promise((resolve) => {
    fb = resolve
})

const c = new Promise((resolve) => {
    fc = resolve
})

const arr = [a, b, c]

// const result = settleB(arr)
setTimeout(() => {
    fb('b')
}, 2000)

setTimeout(() => {
    fa('a')
}, 1000);

setTimeout(() => {
    fc('c')
}, 3000);

const result = allSettle(arr).then(res => {
    console.log(res)
})

