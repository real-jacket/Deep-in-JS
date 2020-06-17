import { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import { getPost } from '../../lib/posts'

type Props = {
	post: {
		content: string
	}
}

const Post: NextPage<Props> = (props) => {
	const { post } = props
	return (
		<div>
			<h1>文章</h1>
			<p>{post.content}</p>
		</div>
	)
}

export default Post

export const getStaticProps: GetStaticProps = async (props: any) => {
	const id = props.params.id
	const post = await getPost(id)
	return {
		props: {
			post: JSON.parse(JSON.stringify(post)),
		},
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [{ params: { id: '第一篇博客' } }, { params: { id: '第二篇博客' } }],
		fallback: false,
	}
}
