import BasePage from "@pages/DocPage";
import Menu from "@assets/components/menu/menu";
import "./module2_2.scss";

export default class Page extends BasePage {
    constructor() {
        super(...arguments);
        this.docName = "nest_router";
    }

    beforeInit() {
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