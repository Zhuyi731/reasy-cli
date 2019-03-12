const Mock = require("mockjs");
const path = require("path");
const chokidar = require("chokidar");

class MockServer {
    constructor() {
        this.prefix = "../../"; //相对于src的路径前缀
        this.mockRules = {};
        this.cacheData = {};
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
        let watcher = chokidar.watch("src/**/*.mock.js", {
            cwd: path.join(__dirname, this.prefix)
        });

        watcher
            .on('add', this.add)
            .on('change', this.change)
            .on('unlink', this.unlink);
    }

    add(filename) {
        console.log("add:" + filename);
        try {
            let config,
                filePath = path.join(this.prefix, filename);

            this._clearCache(filePath);
            config = require(filePath);
            this.addRule(config, filename);
        } catch (e) {}
    }

    change(filename) {
        console.log("change:" + filename);

        this.deleteRule(filename);
        try {
            let config,
                filePath = path.join(this.prefix, filename);

            this._clearCache(filePath);
            config = require(filePath);
            this.addRule(config, filename);
        } catch (e) {}
    }

    unlink(filename) {
        console.log("unlink:" + filename);
        this.deleteRule(filename);
    }

    addRule(config, filename) {
        if (config.url && config.data) {
            console.log(`${config.url}模拟数据添加成功`);
        } else {
            return;
        }

        if (config.method && !["GET", "POST", "PULL", "DELETE", "HEAD", "OPTIONS", "PATCH"].includes(config.method)) {
            console.warn(`invalid method: ${config.method}`);
        }

        let url = config.url;
        if (!/^\//.test(url)) {
            url = `/${url}`;
        }
        this.mockRules[url] = {
            filename,
            data: config.data,
            method: config.method || "POST",
            delay: config.delay || 0
        };
    }

    deleteRule(filename) {
        for (let prop in this.mockRules) {
            if (this.mockRules[prop].filename == filename) {
                console.log(`${this.mockRules[prop].filename}模拟数据删除成功`);
                delete this.mockRules[prop];
                return;
            }
        }
    }

    before(app) {
        app.use((req, res, next) => {
            let filename = req.originalUrl.split("?")[0],
                rule = this.mockRules[filename],
                data;

            if (rule && rule.method == req.method) {
                console.log(filename);

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
                        this.setTo(rule.setTo, req.body);
                    }
                }

                setTimeout(() => { res.json(data); }, rule.delay);
            } else {
                next();
            }
        });
    }

    getFrom(where) {
        if (this.cacheData[where]) {
            return this.cacheData[where];
        } else {
            return null;
        }
    }

    setTo(where, val) {
        this.cacheData[where] = val;
    }


    _clearCache(modulePath) {
        let mod = require.resolve(modulePath);

        if (!!mod && require.cache[mod]) {
            require.cache[mod].children.forEach(child => {
                this._clearCache(child.filename);
            });
            delete require.cache[mod];
        }

        console.log(`clear cache ${modulePath} ok`);
    }
}

module.exports = new MockServer();