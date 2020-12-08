const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 分析 bundle 打包速度的
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();

// 分析 打包内容的
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 手写的 plugin 
const HelloWordPlugin = require('../plugins/Hello')
const FileListPlugin = require('../plugins/FileList')


const webpackConfig = merge(common, {
    // mode: 'production',
    // devtool: 'source-map',
    optimization: {
        // minimize: true,
        // 代码打包分析时，避免 webpack 合并
        // concatenateModules: false,
        splitChunks: {
            chunks: 'all',
            //  缓存分组
            cacheGroups: {
                common: {
                    name: 'common', // chunk 的名字
                    priority: 0, // 优先级
                    minSize: 0,  // 公共模块的大小限制
                    minChunks: 2  // 公共模块最少复用过几次
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vender',
                    // name(module, chunks, cacheGroupKey) {
                    //     const moduleFileName = module.identifier().split('/').reduceRight(item => item);
                    //     const allChunksNames = chunks.map((item) => item.name).join('~');
                    //     return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                    // },
                    priority: 1, // 权限更高，优先抽离，重要！！！
                    minSize: 0,  // 大小限制
                    minChunks: 1  // 最少复用过几次
                }
            }
        }
    },
    module: {
        rules: [
            // 处理 图片
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 5 * 1024,
                            // 输出到制定目录
                            outputPath: '/img/',
                        },
                    },
                ]
            },
            // 处理 scss
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Translate css into CommonJs
                    "css-loader",
                    // Compile Sass to css
                    "sass-loader",
                    "postcss-loader",
                ]
            },
            // 处理 css
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                ]
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
    resolveLoader: {
        modules: ['node_modules', 'loaders']
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css'
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HelloWordPlugin(),
        new FileListPlugin()
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    }
})
// 暂时不支持webpack 5
// module.exports = smp.wrap(webpackConfig)
module.exports = webpackConfig