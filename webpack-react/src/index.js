import React, { useState } from 'react';
import ReactDom from 'react-dom'
import Cat from './components/Cat.js'

import hello from './hello.hello'
console.log('hello content:', hello)

import helloMd from './hello.md'
console.log(helloMd)

function App() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <Cat />
            <div dangerouslySetInnerHTML={{ __html: helloMd }}></div>
        </div>
    );
}

ReactDom.render(<App />, document.getElementById('app'))

