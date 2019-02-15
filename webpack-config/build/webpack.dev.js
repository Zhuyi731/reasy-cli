/*eslint-disable*/
const path = require("path");
const fs = require("fs");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
    mode:"development",
    devtool: '#source-map',
    devServer: {
        before(app) {
            app.post('/goform|login|cgi-bin/**', (req, res) => {
                //重定向到对应路径
                res.redirect(req.originalUrl);
            });
        }
    }
});