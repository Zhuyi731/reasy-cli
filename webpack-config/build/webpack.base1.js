/*eslint-disable*/
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成html
const CopyWebpackPlugin = require('copy-webpack-plugin'); //将特定文件输出指定位置
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 4 });

module.exports = {
    resolve: {
        extensions: ['.js', ".json"],
        alias: { //设置别名，方便引入文件
            "@modules": path.join(__dirname, "../src/modules"),
            "@assets": path.join(__dirname, "../src/assets"),
            "@utils": path.join(__dirname, "../src/assets/js/utils")
        },
        mainFields: ['browser', 'main']
    },
    entry: {
        index: [path.join(__dirname, '../src/modules/index/index.js')]
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name]_[chunkhash:5].js',
        chunkFilename: "chunks/[name]_[chunkhash:5].js"
    },
    module: {
        noParse: function(contentPath) {
            //contentPath   构成   loader1Path!loader2Path!assetsPath  
            //我们只需要过滤webpack解析资源的路径   而不需要过滤loader的路径
            contentPath = contentPath.split("!").pop();
            //配置不需要通过webpack去解析的文件
            let shouldNotParse = false,
                filename = contentPath.split("\\").pop(),
                prefixPath = contentPath.split("\\"),
                noParseFolders = [/static/, /node_modules/], //不需要解析的文件夹名称的正则表达式
                noParseFiles = [/jquery/]; //不需要解析的文件名称

            shouldNotParse = prefixPath.find(curPath => {
                return noParseFolders.find(folderExp => folderExp.test(curPath));
            });

            !shouldNotParse && (shouldNotParse = noParseFiles.find(exp => exp.test(filename)));


            // if (shouldNotParse) {
            //     console.log(`contentPath: ${contentPath}\n\n`);
            //     console.log(`filename: ${filename}\n\n`);
            //     console.log(`${prefixPath}\n\n`);
            // }

            return false;
        },
        rules: [{
            enforce: 'pre', // ESLint 优先级高于其他 JS 相关的 loader
            test: /\.js$/,
            exclude: /node_modules/,
            use: "eslint-loader"
        }, {
            test: /\.js$/, //匹配所有.js文件
            loader: 'HappyPack/loader?id=js',
            exclude: /node_modules|static/ //排除node_module下的所有文件
        }, {
            test: /\.(html)$/, //处理html中的图片文件
            loader: 'HappyPack/loader?id=html',
            exclude: /node_modules|static/ //排除node_module下的所有文件
        }, {
            test: /\.css$/,
            loader: "HappyPack/loader?id=css"
        }, {
            test: /\.scss$/,
            loader: "HappyPack/loader?id=scss",
            exclude: /node_modules|static/ //排除node_module下的所有文件
        }, {
            test: /\.(png|jpg|png|jpeg|bmp|webp|gif)$/, //处理css和js中的图片文件
            loader: 'url-loader',
            options: {
                limit: 8,
                name: 'assets/images/[name]_[hash:5].[ext]'
            },
            exclude: /node_modules|static/ //排除node_module下的所有文件
        }, { //处理字体文件
            test: /\.(eot|woff2|woff|ttf|svg)/,
            loader: 'url-loader',
            options: {
                name: 'assets/fonts/[name]_[hash:5].min.[ext]',
                limit: 5000
            },
            include: /src/,
            exclude: /node_modules|static/ //排除node_module下的所有文件
        }]
    },
    plugins: [
        new HappyPack({
            id: 'js',
            loaders: [{
                loader: 'babel-loader',
                query: {
                    cacheDirectory: './node_modules/babel_cache/',
                },
                options: {
                    "presets": [
                        "es2015-loose"
                    ],
                    "plugins": [
                        "syntax-dynamic-import",
                        "transform-class-properties"
                    ]
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