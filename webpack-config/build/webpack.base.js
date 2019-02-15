/*eslint-disable*/
const path = require("path");
const webpack = require('webpack');
const es3ifyPlugin = require('es3ify-webpack-plugin'); //解决IE8保留字冲突问题
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成html
const CopyWebpackPlugin = require('copy-webpack-plugin'); //将特定文件输出指定位置

module.exports = {
    resolve: {
        extensions: ['.js'],
        alias: {
            "@modules": path.join(__dirname, "../src/modules"),
            "@components": path.join(__dirname, "../src/components"),
            "@assets": path.join(__dirname, "../src/assets"),
        }
    },
    entry: {
        index: path.join(__dirname, '../src/modules/index/index.js')
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name]_[chunkhash:5].js'
    },
    module: {
        rules: [{
            enforce: 'pre', // ESLint 优先级高于其他 JS 相关的 loader
            test: /\.js$/,
            exclude: /node_modules|assets/,
            use: "eslint-loader"
        }, {
            test: /\.js$/, //匹配所有.js文件
            use: [{
                loader: 'babel-loader?cacheDirectory=true',
                options: {
                    presets: [
                        "@babel/preset-env"
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-class-properties"]
                    ]
                }
            }],
            exclude: /node_modules|jquery|lodash/
        }, {
            test: /\.css$/,
            use: [{
                loader: 'style-loader' //生成的css插入到html
            }, {
                loader: 'css-loader' //使js中能加载css
            }, {
                loader: 'postcss-loader' //添加兼容性前缀
            }]
        }, {
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings 
            }, {
                loader: "css-loader" // translates CSS into CommonJS 
            }, {
                loader: "fast-sass-loader" // compiles Sass to CSS 
            }]
        }, {
            test: /\.(eot|woff2|woff|ttf|svg)/,
            use: [{
                loader: 'url-loader',
                options: {
                    name: '[name][hash:5].min.[ext]',
                    limit: 5000,
                    publicPath: '',
                    outputPath: 'dist/',
                    useRelativePath: true
                }
            }]
        }]
    },
    plugins: [
        // new es3ifyPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/modules/index/index.html'),
            filename: "index.html",
            chunks: ['index'],
            inject: "body"
        }),
        new CopyWebpackPlugin([{ //reference from：https://www.npmjs.com/package/copy-webpack-plugin
            from: './src/module/**/*.html',
            to: './pages',
            flatten: true
        }, {
            from: './src/module/**/*.mock.js',
            to: './mock',
            flatten: true
        }, {
            from: './src/static',
            to: './static'
        }])
    ]
}