import { GetStaticProps, NextPage } from 'next'
import { getPosts } from '../../lib/posts'
import Link from 'next/link'

type Props = {
	posts: Post[]
}

const PostsIndex: NextPage<Props> = (props) => {
	const { posts } = props
	console.log(posts)
	return (
		<div>
			<h1>文章列表</h1>
			{posts.map((p) => (
				<div key={p.id}>
					<Link href={`/posts/${p.id}`}>
						<a>{p.id}</a>
					</Link>
					<Link href={`/posts/bar/${p.id}`}>
						<a> {'bar' + p.id}</a>
					</Link>
				</div>
			))}
		</div>
	)
}

export default PostsIndex

export const getStaticProps: GetStaticProps = async () => {
	const posts = await getPosts()
	console.log(posts)
	return {
		props: {
			posts: JSON.parse(JSON.stringify(posts)),
		},
	}
}
