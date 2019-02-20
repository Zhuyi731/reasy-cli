import "es5-shim";
import "babel-polyfill";

import "@assets/css/initial.css";
import "@assets/css/iconfont.css";

import "@assets/basicStyleSheet/ap.scss";
import "@assets/basicStyleSheet/tenda.scss";

import * as $ from "jquery";
import Menu from "@components/menu/menu";
import routerCfg from "../routerCfg";
import Router from "../../components/router/router";
import moduleInfo from "@modules/moduleInfo";

class MainLogic {
    //constructor用于初始化部分数据
    //在new MainLogic()这行代码执行时会执行constructor中的代码
    constructor() {
        this.currentWorkingPage = "wizard";
        this.pageCaches = [];
    }

    //使用箭头函数这种写法会将this绑定至main对象(详情请关注@babel插件)
    //等价于 this.init = this.init.bind(this);
    //如果不需要绑定this也可以使用原始的方法init(){}
    init() {
        this.initGlobalVariables();
        this.initRouter();

        this.initMenuLists();
        this.initEvent();

        if (process.env.NODE_ENV == "development") { //开发环境下暴露最顶层引用，方便查看数据与调试
            top.window.main = this;
        }
    }

    /**
     * 导出全局变量
     */
    initGlobalVariables() {
        window.G = {};
        window.$ = $;
    }

    //初始化路由
    initRouter() {
        this.$route = new Router({element:document.getElementById("page-content"), routerCfg});
    }

    //初始化菜单
    initMenuLists() {
        let menu = new Menu($("#menu-aside"), { menus: moduleInfo.menus });

    }

    initEvent() {
        let registedRouterInfo;
        moduleInfo.menus.forEach(element => {

        });


        window.addEventListener('hashchange', function(e) {
            let p = e.newURL.split("#").pop();

            // e.newURL.hash
        }, false);

    }
}

const main = new MainLogic();
main.init();