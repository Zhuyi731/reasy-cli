//@ts-ignore
const Mock = require("mockjs");
const path = require("path");
const chokidar = require("chokidar");
const bodyParser = require("body-parser");

class MockServer {
    constructor(prefix = "../../src") {
        this.prefix = prefix; //相对于src的路径前缀
        this.mockRules = {};
        this.cacheData = {};
        this.debug = true;
        this.init();
    }

    bindThis() {
        global.Mock = Mock;
        this.add = this.add.bind(this);
        this.before = this.before.bind(this);
        this.change = this.change.bind(this);
        this.unlink = this.unlink.bind(this);
    }

    init() {
        this.bindThis();
        let watcher = chokidar.watch("**/*.mock.js", {
            cwd: path.join(__dirname, this.prefix)
        });

        watcher
            .on('add', this.add)
            .on('change', this.change)
            .on('unlink', this.unlink);
    }

    add(filename) {
        try {
            let config,
                filePath = path.join(this.prefix, filename);

            this._clearCache(filePath);
            config = require(filePath);
            this.addRule(config, filename);
        } catch (e) { this._debug(e); }
    }

    change(filename) {
        this.unlink(filename);
        this.add(filename);
    }

    unlink(filename) {
        for (let prop in this.mockRules) {
            if (this.mockRules[prop] && this.mockRules[prop].filename == filename) {
                console.log(`${prop}模拟数据删除成功`);
                delete this.mockRules[prop];
            }
        }
    }

    addRule(config, filename) {
        if (!config.url || !config.data) { return; }
        if (config.method && typeof config.method != "string") { return; }
        if (config.method) {
            config.method = config.method.toUpperCase();
            if (!["GET", "POST", "PULL", "DELETE", "HEAD", "OPTIONS", "PATCH"].includes(config.method)) {
                console.warn(`invalid method: ${config.method}`);
                return;
            }
        }

        let url = config.url;
        if (!/^\//.test(url)) {
            url = `/${url}`;
        }

        this.mockRules[url] = {
            filename,
            data: config.data,
            method: config.method || "POST",
            delay: config.delay || 0,
            getFrom: config.getFrom,
            setTo: config.setTo
        };
        console.log(`${config.url}模拟数据添加成功`);
    }

    before(app) {
        //使用bodyPaser解析请求的参数
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.use((req, res, next) => {
            let url = req.originalUrl.split("?")[0],
                rule = this.mockRules[url],
                data;

            if (rule && rule.method == req.method) {
                if (typeof rule.data == "function") {
                    data = rule.data(req, this);
                } else {
                    data = Mock.mock(rule.data);
                    if (rule.getFrom) {
                        data = this.getFrom(rule.getFrom);
                        !data && (data = Mock.mock(rule.data));
                    } else {
                        data = Mock.mock(rule.data);
                    }

                    if (rule.setTo) {
                        console.log(req.body);
                        this.setTo(rule.setTo, req.body);
                    }
                }
                setTimeout(() => { res.json(data); }, rule.delay);
            } else if (rule && rule.method != req.method) {
                res.json({
                    errMessage: `当前${url}请求方法为${req.method}定义mock方法为${rule.method}`
                });
            } else {
                next();
            }
        });
    }

    getFrom(where) {
        console.log(`get from ${where}`);
        if (this.cacheData[where]) {
            return this.cacheData[where];
        } else {
            return null;
        }
    }

    setTo(where, val) {
        console.log(`set to ${where}`);
        console.log(val);

        this.cacheData[where] = val;
    }

    _clearCache(modulePath) { //清除nodejs中的缓存
        let mod = require.resolve(modulePath);
        if (!!mod && require.cache[mod]) {
            require.cache[mod].children.forEach(child => {
                this._clearCache(child.filename);
            });
            require.cache[mod] = null;
        }

        Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
            if (cacheKey.indexOf(modulePath) > 0) {
                delete module.constructor._pathCache[cacheKey];
            }
        });
    }

    _debug(msg) {
        if (this.debug) {
            console.log("");
            console.log(`[Debug]: ${msg}`);
            console.log("");
        }
    }
}

module.exports = MockServer;