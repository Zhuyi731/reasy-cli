/*eslint-disable*/
const path = require("path");
const fs = require("fs");
const webpack = require('webpack');
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");
const sesame = require("sesame-http");

module.exports = merge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    devServer: {
        before(app) { //解决post没响应的问题
            // sesame.webpack(app, path.join(__dirname, "../app"));
            app.post('/goform|login|cgi-bin/**', (req, res) => {
                //重定向到对应路径
                res.redirect(req.originalUrl);
            });
        }
    }
});