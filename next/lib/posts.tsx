import fs, { promises as fsPromise } from 'fs'
import path from 'path'
import matter from 'gray-matter'

const markdownDir = path.join(process.cwd(), 'markdown')
export const getPosts = async () => {
	const fileNames = await fsPromise.readdir(markdownDir)
	return fileNames.map((fileName) => {
		const id = fileName.replace(/\.md$/, '')
		const fullPath = path.join(markdownDir, fileName)
		const text = fs.readFileSync(fullPath, 'utf-8')
		const {
			data: { title, date },
			content,
		} = matter(text)
		return { id, title, date, content }
	})
}

export const getPost = async (id: string) => {
	const fullPath = path.join(markdownDir, id + '.md')
	const text = fs.readFileSync(fullPath, 'utf-8')
	const {
		data: { title, date },
		content,
	} = matter(text)
	return { id, title, date, content }
}
