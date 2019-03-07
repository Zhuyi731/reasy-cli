import "@babel/polyfill";
import "@assets/scss/iconfont.scss";
import "@assets/scss/index.scss";
import "@components/formComponents/lib";
import "@components/css/component.scss";

import Loading from "@assets/components/loading/loading";
import routerCfg from "../routerCfg";
import moduleInfo from "../moduleInfo";
import Menu from "@assets/components/menu/menu";
import Router from "@assets/components/router/router";
import BasePage from "@assets/baseClass/BasePage";


class MainLogic {
    //constructor用于初始化部分数据
    //在new MainLogic()这行代码执行时会执行constructor中的代码
    constructor() {
        //需要先清空hash
        this.firstMenu = "/module2_1";
        this.$menu = [];
        this.$loading = new Loading();
    }

    init() {
        this.initGlobalVariables();
        this.initMenu();
        this.initRouter();

        if (process.env.NODE_ENV == "development") { //开发环境下暴露最顶层引用,方便查看数据与调试
            top.window.main = this;
        }
    }

    // 导出全局变量
    initGlobalVariables() {
        window.G = {};
    }

    //初始化路由
    initRouter() {
        this.$route = new Router({
            elements: ["routerView1", "routerView2"],
            routerCfg,
            defaultPage: "/module2_1",
            beforeRouting: this.beforeRouting,
            afterRouting: this.afterRouting
        });
        //然后再将hash重置为初始菜单
        this.$route.push(this.firstMenu);
    }

    beforeRouting = (previous, current, level, previousLevel) => {
        if (current != this.$menu[level].getCurrentMenu() || level != previousLevel) {
            //这种情况说明是通过返回键来进行的跳转  
            this.$menu[level].setMenu(current);
        }
        this.$loading.addLoading({ element: "#" + this.$route.$elements[level], content: _("加载页面中") });
    }

    //使用箭头函数这种写法会将this绑定至main对象(详情请关注babel-plugin-transform-class-properties插件)
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
                    element: "#" + this.$route.$elements[level]
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
    initMenu() {
        this.$menu[0] = new Menu({
            element: $("#menu-aside"),
            menus: moduleInfo.menus,
            onMenuChange: (lastPath, currentPath) => {
                this.$route.push(currentPath);
            }
        });
    }
}

const main = new MainLogic();
main.init();