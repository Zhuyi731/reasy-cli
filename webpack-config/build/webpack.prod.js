/*eslint-disable*/
const path = require("path");
const webpack = require('webpack');
const uglifyJs = require("uglifyjs-webpack-plugin");
const cleanDist = require("clean-webpack-plugin");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");


module.exports = merge(baseConfig, {
    plugins: [
        // new uglifyJs({
        //     cache: 'node_modules/uglify_cache/',
        //     parallel: 3,
        //     uglifyOptions: {
        //         ie8: true
        //     }
        // }),
        // new cleanDist(["dist/*"], {
        //     root: path.join(__dirname, "../"),
        //     verbose: true,
        //     dry: false
        // }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});