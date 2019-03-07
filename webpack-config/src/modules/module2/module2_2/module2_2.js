import BasePage from "@assets/baseClass/BasePage";
import Menu from "@assets/components/menu/menu";
// import hljs from "highlight.js";
// import javascript from 'highlight.js/lib/languages/javascript';
import "./module2_2.scss";
import 'highlight.js/styles/github.css';

export default class Page extends BasePage {
    constructor() {
        super(...arguments);
    }

    init() {
        // try {  //IE下不支持highlightjs渲染
        //     hljs.registerLanguage('javascript', javascript);
        //     hljs.highlightBlock($("pre code")[0]);

        // } catch (e) {}
        this.$parent.$menu[1] = new Menu({
            element: $("#third-menu"),
            menus: [{
                path: "/module2_2/nest_router1",
                title: "嵌套路由1"
            }, {
                path: "/module2_2/nest_router2",
                title: "嵌套路由2"
            }, {
                path: "/module2_2/nest_router3",
                title: "嵌套路由3"
            }],
            onMenuChange: (lastPath, currentPath) => {
                if (lastPath === currentPath) {
                    this.$parernt.$route.load(currentPath);
                } else {
                    this.$parent.$route.push(currentPath);
                }
            }
        });

    }
}