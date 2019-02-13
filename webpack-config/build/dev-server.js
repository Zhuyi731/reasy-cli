const webpack = require('webpack');
// const opn = require("opn")
// 服务器框架
const express = require('express');
const config = require('./webpack.dev.js');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const PORT = 8080;

Object.keys(config.entry).forEach(function (name) {
    config.entry[name] = ['webpack-hot-middleware/client?noInfo=true&reload=true'].concat(config.entry[name])
});


//开启服务器；
const app = express();
const compiler = webpack(config);

console.log(compiler);
//热更新；
app.use(hotMiddleware(compiler,{
    log: false,
    heartbeat: 2000
}))

app.use(devMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
    colors: true,
    chunks: false
    }
}));

devMiddleware.waitUntilValid(() => {
    app.listen(PORT);
});

// 启动服务
app.listen(PORT, (err) => {
    console.log(' start server at port ' + '4000');
});