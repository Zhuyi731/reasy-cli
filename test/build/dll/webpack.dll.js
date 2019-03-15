const webpack = require('webpack');
const path = require('path');
const uglifyJs = require("uglifyjs-webpack-plugin");
const cleanDist = require("clean-webpack-plugin");

module.exports = {
    output: {
        // 将会生成./dll/vendor.js文件
        library: '[name]',
        path: path.join(__dirname, "../../src/dll"),
        filename: '[name].js',
        libraryTarget: "window"
    },
    module: {
        rules: [{
            test: /\.js$/, //匹配所有.js文件
            use: [{
                loader: 'babel-loader',
                query: {
                    "cacheDirectory": "./node_modules/.cache_dll_babel/"
                }
            }],
            exclude: /node_modules/
        }]
    },
    entry: {
        "dependencies": ["jquery"], //jquery并不需要通过babel解析，只是预打包一下
        "polyfill": ["@babel/polyfill"]
    },
    plugins: [
        new uglifyJs({
            cache: 'node_modules/.cache_uglify_dll/',
            parallel: 4,
            uglifyOptions: {
                ie8: true
            }
        }),
        new webpack.DllPlugin({
            // 生成的映射关系文件 放在根目录下
            path: './build/dll/[name]-manifest.json',
            name: '[name]'
        }),
        new cleanDist(["src/dll/*"], {
            root: __dirname,
            verbose: true,
            dry: false
        })
    ],
};