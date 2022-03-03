/** @jsx Didact.createElement */
function App(props) {
  const [state, setState] = Didact.useState(1);
  return <h1>hi {props.name}</h1>;
}

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <App name="bar" />
    <a>bar </a>
    <b />
  </div>
);
const container = document.getElementById('root')!;

Didact.render(element, container);
