

function Person(name,age) {
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

const _Jack = create(Person, 'jack', 22)

console.log(_Jack)


// 实现继承

function Animal(color) {
    this.color = color
}

Animal.prototype.move = function () {
    console.log('move')
}

function Dog(color,name) {
    Animal.call(Animal, color) // 继承属性
    this.name = name
}

function temp() { }
temp.prototype = Animal.prototype
Dog.prototype = new temp()

// 上述代码可以修改一下

// Dog.prototype.__proto__ = Animal.prototype

Dog.prototype.constructor = Dog
Dog.prototype.say = function () { 
    console.log('汪')
}

const dog = new Dog('黄色','阿黄')

console.log(dog)

// es6 继承

class Animal_ {
    constructor(color) {
        this.color = color
    }
    move(){}
}

class Cat extends Animal_ {
    constructor(color,name) {
        super(color)
        this.name = name
    }
    say() {}
}

const cat = new Dog('白色', '草莓')

console.log(cat)