import * as $ from 'jquery'
// 这里引入的是实际的 jquery 模块，并不包含 jquery 的类型声明
const personal = $.name

export const foo = 123

export default interface person {
	name: string
	age: number
}

export interface person2 {
	name: string
}

export const someVar = 123
export type someType = {
	foo: string
}
