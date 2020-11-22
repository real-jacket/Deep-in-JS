import { parse } from '@babel/parser'
import * as babel from '@babel/core'
import * as fs from 'fs'
import * as path from 'path'

const code = fs.readFileSync(path.resolve(__dirname, './file_to_es5.js')).toString()
const ast = parse(code, { sourceType: 'module' })
const result = babel.transformFromAstSync(ast, code, {
	presets: ['@babel/preset-env'],
})

console.log(result.code)
