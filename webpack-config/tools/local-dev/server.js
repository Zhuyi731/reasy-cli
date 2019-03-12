const express = require("express");
const proxy = require('http-proxy-middleware')
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const userConfig = require("../../config/user.config");

class Server {
    constructor() {
        this.distPath = path.join("../../dist");
        this.mockConfig = userConfig.mock;
        this.server = null; //server entity
        //express实例   当webpack环境下时，指向webpack的express服务器  
        //本地环境下时，指向本地的express服务器
        this.app = null;
    }

    init() {
        this.app = new express();

        this.useMiddleware();

        switch (this.mockConfig.type) {
            case "local":
                {

                }
                break;
            case "yapi":
                {
                    this.proxyYapiData();
                }
                break;
        }

        this.startServer();
    }

    /**
     * 代理yapi的数据
     */
    proxyYapiData() {
        this.app.use("/**", proxy({ target: this.mockConfig.apiPrefix }));
    }

    /**
     * 使用express中间件
     */
    useMiddleware() {
        // let workingDir = this.config.httpRootPath,
        let app = this.app;
        app.set("views", path.join(__dirname, "../../dist"));
        app.set("view engine", "html");
        app.use(express.static(path.join(__dirname, '../../dist')));
        //使用bodyPaser解析请求的参数
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));

        //使用cookiePaser解析请求cookie
        app.use(cookieParser());
    }

    startServer() {
        this.server = this.app.listen(8081, () => {
            console.log(`server is listening at http://localhost:${this.server.address().port}`);
        });
    }

    /**
     * 拦截请求，并返回对应的解析后的数据
     */
    _interceptRequest() {

    }

    _debug(message, noWrap) {
        if (!this.config.debug) return;
        if (noWrap) {
            console.log(message);
            return;
        }
        console.log("");
        console.log("");
        console.log(`[DEBUG]: ${message}`);
        console.log("");
        console.log("");
    }
}
let server = new Server();
server.init();
module.exports = server;