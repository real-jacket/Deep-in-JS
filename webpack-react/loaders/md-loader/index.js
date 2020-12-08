const marked = require("marked");

module.exports = function (source) {
    console.log('run md-loader');
    console.log('marked:', source)
    const html = JSON.stringify(marked(source));
    // this.callback是官方提供的api
    this.callback(null, `export default ${html}`);
    return;
}