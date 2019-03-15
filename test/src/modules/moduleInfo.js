//todo  完善Icon组件
const productInfo = {
    product: "xxx",
    productLine: "ap",
    customStyle: "ipcom||tenda",
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
        title: "webpack配置",
        icon: "wuxupailie",
        children: [{
            path: "/module3_1",
            title: "按需兼容IE8"
        }, {
            path: "/module3_2",
            title: "webpack优化"
        }]
    },  {
        title: "数据模拟",
        icon: "wuxupailie",
        children: [{
            path: "/module4_1",
            title: "Yapi方式"
        }, {
            path: "/module4_2",
            title: "本地模拟方式"
        }]
    }, {
        title: "TODO",
        path: "module_todo"
    }]
};

export default productInfo;