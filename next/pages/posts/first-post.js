import Link from 'next/link'
import {useCallback} from 'react'
import Head from 'next/head'
import png from 'assets/images/test.png'

export default function FirstPost() {
    const click = useCallback(() => {
        console.log('you click me ')
    }, [])
    return (<div>
        <Head>
            <title>First Post</title>
        </Head>
        <div onClick={click}>First Post</div>
        <Link href={'/'}>
            <a>Go Back Home</a>
        </Link>
        <img src={png} />
    </div>)
}
