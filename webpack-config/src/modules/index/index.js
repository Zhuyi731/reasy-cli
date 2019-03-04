import "es5-shim";
import "babel-polyfill";
import Promise from "es6-promise";
import "@assets/css/initial.scss";
import "@assets/css/iconfont.css";
import "@assets/basicStyleSheet/ap.scss";


import "@assets/components/formComponents";
import Loading from "@assets/components/loading/loading";
import routerCfg from "../routerCfg";
import moduleInfo from "@modules/moduleInfo";
import Menu from "@assets/components/menu/menu";
import Router from "@assets/components/router/router";

import BasePage from "@assets/baseClass/BasePage";


class MainLogic {
    //constructor用于初始化部分数据
    //在new MainLogic()这行代码执行时会执行constructor中的代码
    constructor() {
        this.firstMenu = "wizard";
        this.$menu = [];
    }

    init() {
        this.initGlobalVariables();
        this.initRouter();
        this.initMenuLists();

        if (process.env.NODE_ENV == "development") { //开发环境下暴露最顶层引用,方便查看数据与调试
            top.window.main = this;
        }
    }

    // 导出全局变量
    initGlobalVariables() {
        window.G = {};
        window.Promise = Promise;
    }

    //初始化路由
    initRouter() {
        window.location.hash = "/";
        this.$route = new Router({
            elements: ["routerView1", "routerView2"],
            routerCfg,
            beforeRouting: this.beforeRouting,
            afterRouting: this.afterRouting
        });
    }

    beforeRouting = (previous, current, level, previousLevel) => {
        if (current != this.$menu[level].getCurrentMenu() || level != previousLevel) {
            //这种情况说明是通过返回键来进行的跳转  
            this.$menu[level].setMenu(current);
        }
        this.$loading = this.$loading || new Loading();
        this.$loading.addLoading({ element: `#${this.$route.$elements[level]}`, content: _("加载页面中") });
    }

    //使用箭头函数这种写法会将this绑定至main对象(详情请关注@babel/plugin-proposal-class-properties插件)
    //等价于 this.afterRouting = this.afterRouting.bind(this);
    //如果不需要绑定this也可以使用原始的方法afterRouting(){}
    afterRouting = (page, level) => {
        if (!(page instanceof BasePage)) {
            //b28n no translate
            console.error("You should use page template insteadof write it yourself");
        }

        let previousPage = this.$route.getPreviousPage();
        previousPage && previousPage.onPageLeave();
        page.$parent = this;
        Promise
            .all([this.loadData(), page.onPageEnter()])
            .then(res => {
                page.onDataBack(res);
                this.$loading.removeLoading({
                    element: `#${this.$route.$elements[level]}`
                });
            })
            .catch(err => {
                console.err(err);
            });
    }

    //预加载数据
    loadData() {
        return new Promise((resolve, reject) => {
            let currentPage = this.$route.getCurrentPage(),
                url = currentPage.getUrl;
            if (url) {
                $.post(`${url}?${Math.random()}`, data => {
                    resolve(currentPage.parseData(data));
                });
            } else {
                resolve();
            }
        });
    }

    //初始化菜单
    initMenuLists() {
        this.$menu[0] = new Menu({
            element: $("#menu-aside"),
            menus: moduleInfo.menus,
            onMenuChange: (lastPath, currentPath) => {
                if (lastPath === currentPath) {
                    this.$route.load(currentPath);
                } else {
                    this.$route.push(currentPath);
                }
            }
        });
    }
}

const main = new MainLogic();
main.init();