import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { GetServerSideProps, NextPage, NextPageContext } from 'next'
import { UAParser } from 'ua-parser-js'

type Props = {
	browser: string
}

const Home: NextPage<Props> = (props) => {
	const { browser } = props
	return (
		<div>
			{/*<Head>*/}
			{/*    <title>Next-index</title>*/}
			{/*</Head>*/}
			<h1>Hello world!</h1>
			<Link href={'/posts/first-post'}>
				<a>To First Post</a>
			</Link>
			<br></br>
			<Link href={'/posts'}>
				<a>To Posts</a>
			</Link>
			<h2>你的浏览器是 {browser}</h2>
		</div>
	)
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ua = context.req.headers['user-agent']
	const result = new UAParser(ua).getResult()
	console.log(result)
	return {
		props: {
			browser: result.browser.name,
		},
	}
}
