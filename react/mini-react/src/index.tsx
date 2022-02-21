import * as Didact from './DIdact';

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar </a>
    <b />
  </div>
);
const container = document.getElementById('root');

const node = document.createElement(element.type);
node['title'] = element.props.title;

const text = document.createTextNode('');
text['nodeValue'] = element.props.children;

node.appendChild(text);
container!.appendChild(node);
