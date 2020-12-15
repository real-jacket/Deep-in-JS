// 类型声明空间
class Person {}
interface Information {
	age: number
	name: string
	gender?: 'man' | 'woman'
}
type Hobbies = string[]

// 将类型声明作为注解使用

let person: Person
let information: Information
let hobbies: Hobbies = ['read', 'sing']

const jack: Information = {
	name: 'jack',
	age: 18,
	gender: 'man',
}

// 变量声明空间
const someClass = Person
const someNumber = 1234
