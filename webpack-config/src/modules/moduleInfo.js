const productInfo = {
    product: "xxx",
    productLine: "",
    ignoredMenus: [],
    menus: [{
        title: "11111111aa",
        icon: "luyouqi",
        path: "/moduleA/aa",
        template: "moduleA",
        module: cb => {
            require.ensure([], require => {
                cb(require("@modules/moduleA/moduleA.js"));
            }, "moduleA");
        },
        children: [{
            title: "222bb",
            template: "moduleB",
            path: "/moduleA/bb",
            children: [{
                title: "333xx",
                path: "/moduleA/xx",
            }]
        }, {
            path: "/moduleA/cc",
            title: "222222cc",
        }]
    }, {
        title: "11111112dd",
        template: "moduleB",
        path: "/moduleA/dd",
        module: cb => {
            require.ensure([], require => {
                cb(require("@modules/moduleA/moduleA.js"));
            }, "moduleA");
        }
    }, {
        title: "111111113ee",
        template: "moduleA",
        path: "/moduleA/ee",
        module: cb => {
            require.ensure([], require => {
                cb(require("@modules/moduleA/moduleA.js"));
            }, "moduleA");
        },
        children: [{
            path: "/moduleA/ff",
            title: "222",
            template: "moduleA",
        }]
    }]
};

export default productInfo;