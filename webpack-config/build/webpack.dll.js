const webpack = require('webpack');
const path = require('path');
const fs = require("fs");
const uglifyJs = require("uglifyjs-webpack-plugin");
const cleanDist = require("clean-webpack-plugin");
const es3ifyPlugin = require('es3ify-webpack-plugin');

module.exports = {
    output: {
        // 将会生成./dll/vendor.js文件
        library: '[name]',
        path: path.join(__dirname, "../src/dll"),
        filename: '[name].js',
        libraryTarget: "window"
    },
    module: {
        rules: [{
            test: /\.js$/, //匹配所有.js文件
            use: [{
                loader: 'babel-loader?cacheDirectory=true'
            }],
            exclude: /node_modules|jquery|lodash/
        }]
    },
    entry: {
        "polyfill": []
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new uglifyJs({
            cache: 'node_modules/.cache_uglify/',
            parallel: 3,
            uglifyOptions: {
                ie8: true
            }
        }),
        new webpack.DllPlugin({
            // 生成的映射关系文件 放在根目录下
            path: './build/[name]-manifest.json',
            name: '[name]'
        }),
        new cleanDist(["app/dll/*"], {
            root: __dirname,
            verbose: true,
            dry: false
        })
        // , new es3ifyPlugin()
    ],
};