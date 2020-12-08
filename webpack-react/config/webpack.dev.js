const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            // 处理 图片
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: 'file-loader',
            },
            // 处理 scss
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // create 'style' nodes from JS string
                    "style-loader",
                    // Translate css into CommonJs
                    "css-loader",
                    "postcss-loader",
                    // Compile Sass to css
                    "sass-loader"
                ]
            },
            // 处理 css
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader", "postcss-loader"]
            },
            // 自定义 loader 
            {
                test: /\.hello$/i,
                exclude: /node_modules/,
                use: ['hello-loader']
            },
            {
                test: /\.md$/i,
                exclude: /node_modules/,
                use: ['md-loader']
            }
        ]
    },
    // 配置 webpack 如何寻找 loader，先去 node_modules 中寻找，然后再去根目录下 loaders 文件夹寻找
    resolveLoader: {
        modules: ['node_modules', 'loaders']
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        progress: true,
        // open: true,
        port: 9000,
        hot: true,
    }
})