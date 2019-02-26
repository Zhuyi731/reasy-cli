/*eslint-disable*/
const path = require("path");
const es3ifyPlugin = require('es3ify-webpack-plugin'); //解决IE8保留字冲突问题
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成html
const CopyWebpackPlugin = require('copy-webpack-plugin'); //将特定文件输出指定位置

module.exports = {
    resolve: {
        extensions: ['.js', ".json"],
        alias: { //设置别名，方便引入文件
            "@modules": path.join(__dirname, "../src/modules"),
            "@assets": path.join(__dirname, "../src/assets"),
            "@utils": path.join(__dirname, "../src/assets/js/utils")
        }
    },
    entry: {
        index: path.join(__dirname, '../src/modules/index/index.js')
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name]_[chunkhash:5].js',
        chunkFilename: "chunks/[name]_[chunkhash:5].js"
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
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-proposal-class-properties"
                    ]
                }
            }],
            exclude: /node_modules/ //排除node_module下的所有文件
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
            test: /\.(png|jpg|png|jpeg|bmp|webp|gif)$/, //处理css和js中的图片文件
            loader: 'url-loader',
            options: {
                limit: 20,
                name: 'assets/images/[name]_[hash:5].[ext]'
            }
        }, {
            test: /\.(html)$/, //处理html中的图片文件
            use: {
                loader: 'html-loader',
                options: {
                    attrs: ['img:src', 'img:data-src', 'audio:src'],
                    minimize: true
                }
            }
        }, { //处理字体文件
            test: /\.(eot|woff2|woff|ttf|svg)/,
            use: [{
                loader: 'url-loader',
                options: {
                    name: 'assets/fonts/[name]_[hash:5].min.[ext]',
                    limit: 5000
                }
            }]
        }]
    },
    plugins: [
        new es3ifyPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/modules/index/index.html'),
            filename: "index.html",
            chunks: ['index'],
            inject: "body"
        }),
        new CopyWebpackPlugin([{ //reference from：https://www.npmjs.com/package/copy-webpack-plugin
            from: './src/modules/**/!(login|index|quickset).html', //TO REPLACE
            to: './pages',
            flatten: true
        }, {
            from: './src/modules/**/*.mock.json',
            to: './mock',
            flatten: true
        }, {
            from: './src/static',
            to: './static'
        }])
    ]
}