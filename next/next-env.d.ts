/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.png' {
	const value: String
	export default value
}

type Post = {
	id: string
	date: string
	title: string
}
