/*eslint-disable*/
const path = require("path");
const fs = require("fs");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");
const webpack = require("webpack");

module.exports = merge(baseConfig, {
    devtool: '#source-map',
    devServer: {
        before(app) {
            app.post('/mock/**', (req, res) => {
                //重定向到对应路径
                res.redirect(`${req.originalUrl.split("?")[0]}.mock.json`);
            });
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }),
    ]
});