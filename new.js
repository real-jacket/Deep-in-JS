function Person(name, age) {
	this.name = name
	this.age = age
}

const Jack = new Person('Jack', 22)

console.log(Jack)

// 实现 new

function create() {
	// 1. 创建一个空对象
	const obj = {}

	// 2. 链接原型
	// 获取构造函数
	const con = [].shift.call(arguments)
	// 原型指向
	obj.__proto__ = con.prototype

	// 3. 绑定this
	const result = con.apply(obj, arguments)
	// 4. 返回对象
	return typeof result === 'object' ? result : obj
}

// 另一种
function _new(F, ...args) {
	const obj = Object.create(F.prototype)

	const result = F.apply(obj, args)

	return typeof result === 'object' ? result : obj
}

const _Jack = create(Person, 'jack', 22)

console.log(_Jack)

// 实现继承
// es6 继承
class Animal_ {
	constructor(color) {
		this.color = color
	}
	move() {}
}

class Cat extends Animal_ {
	constructor(color, name) {
		super(color)
		this.name = name
	}
	say() {}
}

// es5 实现继承

/********原型链继承*********/
function Parent1() {
	this.name = ['kevin']
}

Parent1.prototype.say = function () {
	console.log('say')
}

function Child1() {}

Child1.prototype = new Parent1()

// 问题：
// 1. 引用类型的属性被所有实例共享
// 2. 在创建 Child 的实例时，不能向Parent传参

/********经典继承*********/

function Person2() {
	this.name = ['kevin']
}

Person2.prototype.say = function () {
	console.log('say')
}

function Child2() {
	Person2.call(this)
}

// 优点：
// 1. 避免了引用类型的属性被所有实例共享
// 2. 可以在 Child 中向 Parent 传参
// 缺点：
// 方法都在构造函数中定义，每次创建实例都会创建一遍方法。

/********组合继承*********/

function Parent3(name) {
	this.name = name
	this.names = ['kevin']
}

Parent3.prototype.say = function () {
	console.log('hi')
}

function Child3(name, age) {
	Parent3.call(this, name)
	this.age = age
}

Child3.prototype = new Parent3()
Child3.prototype.constructor = Child3

/********原型式继承*********/
// 模拟实现 Object.create
function createObj(o) {
	function F() {}
	F.prototype = o
	return new F()
}

/********寄生式继承*********/

// 创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。

function createObj(o) {
	var clone = Object.create(o)
	clone.sayName = function () {
		console.log('hi')
	}
	return clone
}

/********寄生组合式继承*********/

function Person4(name) {
	this.name = name
	this.names = ['kevin']
}

Person4.prototype.say = function () {
	console.log('hi')
}

function Child4(name, age) {
	Person4.call(this, name)
	this.age = age
}

function F() {}
F.prototype = Person4.prototype
Child4.prototype = new F()
Child4.prototype.constructor = Child4

// 对上述封装一下

function object(o) {
    function F() { }
    F.prototype = o
    return new F()
}

function prototype(child,parent) {
    var prototype = object(parent.prototype)
    prototype.constructor = child
    child.prototype = prototype
}