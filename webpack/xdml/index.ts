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
	if (Object.keys(depRelation).includes(filepath)) {
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
				const depPath = fileObj.node.source.value

				depRelation[filepath].deps.push(depPath)

				const dirName = path.dirname(filepath)
				const depRelativePath = `./${path.join(dirName, depPath)}`
				analysisModule(depRelativePath)
			}
		},
	})
}
