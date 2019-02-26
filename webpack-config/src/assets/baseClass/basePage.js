import $ from "jquery";
export default class BasePage {
    constructor() {
        this.pageName = "";
        this.pageDescription = "";
        this.timer = {};
        this.components = {};
        this.componentManager = null;
        this.timeOutPrefix = /^<!DOCTYPE/;
        this.loginPage = "./login.html";
        this.getUrl = null;
        this.setUrl = null;
    }

    //当进入页面时由主逻辑调用，进入页面生命周期
    onPageEnter = () => {
        return new Promise((resolve, reject) => {
            this.beforeInit();
            this.init();
            this.afterInit();
            resolve();
        });
    }

    onPageLeave = () => {
        this.clean();
        this.destory();
    }

    //hooks below
    beforeInit() {}

    init() {}

    afterInit() {}

    onDataBack = res => { this.dataLoaded(!!res ? res[0] : ""); }

    dataLoaded() {}

    //清除定时器
    clean() {
        this.timer && this.differentTypeSolution(this.timer, timer => {
            clearTimeout(timer);
            clearInterval(timer);
        });
    }

    destory() {}

    /**
     * 处理数据,处理数据超时情况以及各式错误情况
     * @param {*接受到的数据} data 
     */
    parseData(data) {
        if (this.timeOutPrefix.test(data)) {
            top.location.href = this.loginPage;
        } else {
            if (typeof data == "string") {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    throw new Error(`Invalid JSON format. Error when parsing data ${data}.`);
                }
            }
            return data;
        }
    }

    post(url) {
        return new Promise((resolve, reject) => {
            $.post(url, data => {
                resolve(this.parseData(data));
            });
        });
    }

    get(url) {
        return new Promise((resolve, reject) => {
            $.get(url, data => {
                resolve(this.parseData(data));
            });
        });
    }

    /**
     * 将不同类型的数据最后都按同一种方法处理  array  object  single
     * @param {*} func 
     * @param {*} input 
     */
    differentTypeSolution(input, dealFunction) {
        let type = Object.prototype.toString.call(input);
        switch (type) {
            case "[object Object]":
                {
                    Object.keys(input).forEach(key => {
                        dealFunction(input[key]);
                    });
                }
                break;
            case "[object Array]":
                {
                    input.forEach(el => {
                        dealFunction(el);
                    });
                }
                break;
            default:
                {
                    dealFunction(input);
                }
        }
    }
}