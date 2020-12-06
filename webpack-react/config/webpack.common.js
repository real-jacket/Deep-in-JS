const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    module: {
        rules: [
            // 处理 js
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                include: /src/,
                loader: 'babel-loader'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
            filename: "index.html",
            title: 'webpack-react-template'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    }
}