import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generator from '@babel/generator'

const code = `let a = 'left';let b = 2`
const ast = parse(code, { sourceType: 'module' })
traverse(ast, {
	enter: (item) => {
		if (item.node.type === 'VariableDeclaration') {
			if (item.node.kind === 'let') {
				item.node.kind = 'var'
			}
		}
	},
})

const result = generator(ast, {}, code)

console.log(ast)
console.log(result.code)
