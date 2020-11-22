import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generator from '@babel/generator'

const code = `let a = 'left';let b = 2`
const ast = parse(code, { sourceType: 'module' })
console.log(ast)
