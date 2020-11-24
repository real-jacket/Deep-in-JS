import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as fs from 'fs'
import * as path from 'path'

type DepRelation = {
	[key: string]: {
		deps: string[]
		code: string
	}
}

const depRelation: DepRelation = {}

analysisModule('./preject1/index.js')

console.log(depRelation)

function analysisModule(filepath: string): void {
	// 利用 hash 对比,判断是否存在循环引入
	if (depRelation[filepath] !== undefined) {
		console.log(`duplicated dependency: ${filepath}`)
		return
	}

	const absolutePath = path.resolve(__dirname, filepath)
	const code = fs.readFileSync(absolutePath, 'utf-8').toString()

	depRelation[filepath] = {
		deps: [],
		code,
	}

	const ast = parse(code, { sourceType: 'module' })
	traverse(ast, {
		enter: function (fileObj) {
			if (fileObj.node.type === 'ImportDeclaration') {
				// 将当前依赖模块路径推入
				const depPath = fileObj.node.source.value
				depRelation[filepath].deps.push(depPath)

				// 获取当前目录
				const dirName = path.dirname(filepath)
				// 拼接依赖路径，递归处理依赖模块
				const depRelativePath = `./${path.join(dirName, depPath)}`
				analysisModule(depRelativePath)
			}
		},
	})
}
