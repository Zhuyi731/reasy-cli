/*eslint-disable*/
const path = require("path");
const webpack = require('webpack');
const uglifyJs = require("uglifyjs-webpack-plugin");
const es3ifyPlugin = require("es3ify-webpack-plugin");
const cleanDist = require("clean-webpack-plugin");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");


module.exports = merge(baseConfig, {
    plugins: [
        new es3ifyPlugin(),
        // new uglifyJs({
        //     cache: 'node_modules/.cache_uglify/',
        //     parallel: 4,
        //     uglifyOptions: {
        //         ie8: true
        //     }
        // }),
        new cleanDist(["dist/*"], {
            root: path.join(__dirname, "../"),
            verbose: true,
            dry: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});