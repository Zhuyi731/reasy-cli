/*eslint-disable*/
const path = require("path");
const os = require('os');
const webpack = require('webpack');
const es3ifyPlugin = require('es3ify-webpack-plugin'); //解决IE8保留字冲突问题
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成html
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //分离css和js
const CopyWebpackPlugin = require('copy-webpack-plugin'); //将特定文件输出指定位置
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const vendorManifest = require('./vendor-manifest.json');

module.exports = {
    resolve: {
        extensions: ['.js'],
    },
    entry: {
        'index': path.join(__dirname, '../app/index.js'),
        'login': path.join(__dirname, '../app/module/login/login.js')
    },
    output: {
        path: path.resolve('./publish'),
        filename: '[name]_[chunkhash:5].js'
    },
    module: {
        rules: [{
                enforce: 'pre', // ESLint 优先级高于其他 JS 相关的 loader
                test: /\.js$/,
                exclude: /node_modules|assets/,
                use: "eslint-loader"
            },
            {
                test: /\.js$/, //匹配所有.js文件
                use: [{
                    loader: 'babel-loader?cacheDirectory=true'
                }],
                exclude: /node_modules|jquery|lodash/
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader' //生成的css插入到html
                }, {
                    loader: 'css-loader' //使js中能加载css
                }, {
                    loader: 'postcss-loader' //添加兼容性前缀
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings 
                }, {
                    loader: "css-loader" // translates CSS into CommonJS 
                }, {
                    loader: "fast-sass-loader" // compiles Sass to CSS 
                }]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.DllReferencePlugin({
            manifest: vendorManifest,
            name: "vendor",
            sourceType: "window"
        }),
        // new es3ifyPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../app/index.html'),
            filename: "main.html", //编译后的入口文件名字
            chunks: ['index'], //入口文件所需要用到的js
            inject: "body" //注入body标签?
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../app/module/login/login.html'),
            filename: 'login.html',
            chunks: ['login'],
            inject: "body"
        }),
        new CopyWebpackPlugin([ //reference from：https://www.npmjs.com/package/copy-webpack-plugin
            {
                from: './app/module/**/*.html',
                to: './html',
                flatten: true
            },
            {
                from: './app/module/**/*.txt',
                to: './goform/[name]/index.html',
                flatten: true
            }, {
                from: './app/other_fake_data/login',
                to: './login/[name]/index.html',
                flatten: true
            }, {
                from: './app/other_fake_data/cgi-bin',
                to: './cgi-bin/[name]/index.html',
                flatten: true
            },
            {
                from: './app/assets',
                to: './assets'
            }, {
                from: './app/config',
                to: './config'
            }, {
                from: './app/dll',
                to: "./dll"
            }
        ])
    ]
}