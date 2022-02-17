function createElement(type: any, props: any, ...children: any[]) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
