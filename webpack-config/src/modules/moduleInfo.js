//todo  完善Icon组件
const productInfo = {
    product: "xxx",
    productLine: "",
    ignoredMenus: [],
    menus: [{
        title: "基础页面模板",
        icon: "icon_shezhi",
        children: [{
            title: "基础页面",
            path: "/module1_1",
            icon: "luyouqi2"
        }, {
            path: "/module1_2",
            title: "纯展示页面"
        }, {
            path: "/module1_3",
            title: "表单页面"
        }]
    }, {
        title: "路由功能",
        icon: "luyouqi",
        children: [{
            path: "/module2_1",
            title: "基础路由"
        }, {
            path: "/module2_2",
            title: "嵌套路由"
        }]
    }, {
        title: "单个菜单",
        icon: "wuxupailie",
        path: "/module3"
    }]
};

export default productInfo;