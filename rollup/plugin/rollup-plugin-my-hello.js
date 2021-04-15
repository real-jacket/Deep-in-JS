export default function myHello() {
  return {
    name: 'my-hello', // this name will show up in warnings and errors
    resolveId(source) {
      console.log('source: ', source);
      if (source === 'virtual-module') {
        return source; // this signals that rollup should not ask other plugins or check the file system to find this id
      }
      return null; // other ids should be handled as usually
    },
    load(id) {
      if (id.includes('virtual-module')) {
        console.log('exec:', id);
        return 'export default "This is virtual!"'; // the source code for "virtual-module"
      }
      return null; // other ids should be handled as usually
    },
  };
}
