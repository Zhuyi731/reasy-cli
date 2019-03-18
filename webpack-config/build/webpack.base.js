/*eslint-disable*/
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成html
const CopyWebpackPlugin = require('copy-webpack-plugin'); //将特定文件输出指定位置
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 4 });
const userConfig = require("../config/user.config");

let webpackConfig = {
    resolve: {
        modules: [
            path.join(__dirname, "../node_modules")
        ],
        extensions: ['.js', ".json"],
        alias: { //设置别名，方便引入文件
            "@pages": path.join(__dirname, "../src/assets/baseClass"),
            "@utils": path.join(__dirname, "../src/assets/js/utils"),
            "@assets": path.join(__dirname, "../src/assets"),
            "@modules": path.join(__dirname, "../src/modules"),
            "@components": path.join(__dirname, "../src/assets/components")
        },
        mainFields: ['browser', 'main']
    },
    entry: {
        // index: [path.join(__dirname, '../src/modules/index/index.js')]
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name]_[chunkhash:5].js',
        chunkFilename: "chunks/[name]_[chunkhash:5].js"
    },
    module: {
        rules: [{
            enforce: 'pre', // ESLint 优先级高于其他 JS 相关的 loader
            test: /\.js$/,
            use: "eslint-loader",
            include: /src/
        }, {
            test: /\.js$/, //匹配所有.js文件
            loader: 'HappyPack/loader?id=js',
            include: /src/,
            exclude: /static/ //排除node_module下的所有文件
        }, {
            test: /\.(html)$/, //处理html中的图片文件
            loader: 'HappyPack/loader?id=html',
            include: /src/ //排除node_module下的所有文件
        }, {
            test: /\.css$/,
            loader: "HappyPack/loader?id=css"
        }, {
            test: /\.scss$/,
            loader: "HappyPack/loader?id=scss",
            include: /src/ //排除node_module下的所有文件
        }, {
            test: /\.(png|jpg|png|jpeg|bmp|webp|gif)$/, //处理css和js中的图片文件
            loader: 'url-loader',
            options: {
                limit: 8,
                name: 'assets/images/[name]_[hash:5].[ext]'
            },
            include: /src/ //排除node_module下的所有文件
        }, { //处理字体文件
            test: /\.(eot|woff2|woff|ttf|svg)/,
            loader: 'url-loader',
            options: {
                name: 'assets/fonts/[name]_[hash:5].min.[ext]',
                limit: 5000
            },
            include: /src/
        }]
    },
    plugins: [
        //对于预打包的库，通过Manifest文件来加载至webpack    
        new webpack.DllReferencePlugin({
            manifest: require("./dll/dependencies-manifest.json"),
            name: "dependencies",
            sourceType: "window"
        }),
        new webpack.DllReferencePlugin({
            manifest: require("./dll/polyfill-manifest.json"),
            name: "polyfill",
            sourceType: "window"
        }),
        new HappyPack({
            id: 'js',
            loaders: [{
                loader: 'babel-loader',
                query: {
                    "cacheDirectory": "./node_modules/.cache_babel/"
                }
            }],
            threadPool: happyThreadPool
        }),
        new HappyPack({
            id: "html",
            loaders: [{
                loader: 'html-loader',
                options: {
                    attrs: ['img:src', 'img:data-src', 'audio:src'],
                    minimize: true
                }
            }]
        }),
        new HappyPack({
            id: "css",
            loaders: [{
                loader: 'style-loader' //生成的css插入到html
            }, {
                loader: 'css-loader' //使js中能加载css
            }, {
                loader: 'postcss-loader' //添加兼容性前缀
            }]
        }),
        new HappyPack({
            id: "scss",
            loaders: [{
                loader: "style-loader" // creates style nodes from JS strings 
            }, {
                loader: "css-loader" // translates CSS into CommonJS 
            }, {
                loader: "fast-sass-loader" // compiles Sass to CSS 
            }],
            verbose: true,
            threadPool: happyThreadPool
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        // new HtmlWebpackPlugin({
        //     template: path.join(__dirname, '../src/modules/index/index.html'),
        //     filename: "index.html",
        //     chunks: ['index'],
        //     inject: "body"
        // }),
        new CopyWebpackPlugin([{ //reference from：https://www.npmjs.com/package/copy-webpack-plugin
            from: './src/modules/**/!(login|index|quickset).html', //TO REPLACE
            to: './pages',
            flatten: true
        }, {
            from: './src/static',
            to: './static'
        }, {
            from: './src/dll',
            to: './dll'
        }]),
        new CopyWebpackPlugin([{ //reference from：https://www.npmjs.com/package/copy-webpack-plugin
            from: './src/modules/**/*.md',
            to: './markdown',
            flatten: true
        }])
    ]
};

Object.keys(userConfig.pages).forEach(prop => {
    let pagePath = `../src/modules/${prop}/${prop}`;

    webpackConfig.entry[prop] = [path.join(__dirname, `${pagePath}.js`)];

    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.join(__dirname, `${pagePath}.html`),
            filename: `${prop}.html`,
            chunks: [prop],
            inject: "body"
        })
    );
    
});


module.exports = webpackConfig;