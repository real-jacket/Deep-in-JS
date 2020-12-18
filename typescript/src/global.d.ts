// 这是对 jquery 模块的描述，只对 ts 有用，我们无法在项目中使用这个类型
declare module 'jquery' {
	export default jack
	export var age: number
	export var name: string
}
