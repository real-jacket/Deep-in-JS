function observe(obj) {
	if (!obj || typeof obj !== 'object') {
		return
	}
	Object.keys(obj).forEach((key) => {
		defineReactive(obj, key, obj[key])
	})
}

function defineReactive(obj, key, val) {
	observe(val)
	let dep = new Dep()
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function reactiveGetter() {
			console.log('get val:', val)
			if (Dep.target) {
				dep.addSub(Dep.target)
			}
			return val
		},
		set: function reactiveSetter(newVal) {
			console.log('set newVal:', newVal)
			val = newVal
			dep.notify()
		},
	})
}

class Dep {
	constructor() {
		this.subs = []
	}
	// 添加依赖
	addSub(sub) {
		this.subs.push(sub)
	}
	notify() {
		this.subs.forEach((sub) => {
			sub.update()
		})
	}
}

Dep.target = null

class Watcher {
	constructor(obj, key, cb) {
		// 将 Dep.target 指向自己
        // 然后触发属性的 getter 添加监听
        // 这里事真正第一次手机依赖的地方
		// 最后将 Dep.target 置空
		Dep.target = this
		this.cb = cb
		this.obj = obj
		this.key = key
		debugger
		this.value = obj[key]
		Dep.target = null
	}

	update() {
		this.value = this.obj[this.key]
		this.cb(this.value)
	}
}

var data = { name: 'yck' }
var bata = { age: 18 }
var cata = {
    name: 'cc',
    age:60
}
observe(data)
observe(bata)
observe(cata)

function init() {
    document.querySelector('#app').innerText = data.name
    document.querySelector('#bpp').innerText = bata.age
}

function updateName(value) {
	document.querySelector('#app').innerText = value
}
function updatebAge(value) {
	document.querySelector('#bpp').innerText = value
}

// 模拟解析到 `{{name}}` 触发的操作
new Watcher(data, 'name', updateName)
new Watcher(bata, 'age', updatebAge)
new Watcher(cata, 'name', updateName)
new Watcher(cata, 'age', updatebAge)
// update Dom innerText
// data.name = 'yyy'
init()

document.querySelector('#name').onchange = function (val) {
	data.name = val.target.value
}
document.querySelector('#age').onchange = function (val) {
	bata.age = val.target.value
}

document.querySelector('#all').onchange = function (val) {
    data.name = val.target.value
	bata.age = val.target.value
}

document.querySelector('#cname').onchange = function (val) {
	cata.name = val.target.value
}
document.querySelector('#cage').onchange = function (val) {
	cata.age = val.target.value
}


