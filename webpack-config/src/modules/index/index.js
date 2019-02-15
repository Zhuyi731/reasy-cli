import "es5-shim";
import "babel-polyfill";

import "@assets/css/initial.css";
import "@assets/css/iconfont.css";

import "@assets/basicStyleSheet/ap.scss";


import * as $ from "jquery";
import Menu from "@components/menu";

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
        this.initMenuLists();
    }

    /**
     * 初始化菜单
     */
    initMenuLists() {
        let menu = new Menu($("#menu-aside"), { menus: moduleInfo.menus });
    }

    //static方法属于Main对象,而不是其实例
    static resize() {

    }

}

const main = new MainLogic();
main.init();

top.window.MainLogic = MainLogic;