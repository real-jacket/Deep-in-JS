import 'style/global.css'
import Head from 'next/head'
import React from 'react'

// This default export is required in a new `pages/_app.js` file.
export default function App({Component, pageProps}) {
    return <>
            <Head>
                <title>lll</title>
            </Head>
            <Component className={'xxx'} {...pageProps} />
        </>
}
