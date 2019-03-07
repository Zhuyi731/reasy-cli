//按需加载，注释为编译后文件名称 
//webpack中支持请关注 @babel/plugin-syntax-dynamic-import 插件
export default [{
    path: "/",
    template: "module2_1",
    component: () => import( /* webpackChunkName: 'modules/modules2/module2_1'*/ "@modules/module2/module2_1/module2_1.js")
}, {
    path: "/module1_1",
    template: "module1_1",
    component: () => import( /* webpackChunkName: 'modules/modules1/module1_1'*/ "@modules/module1/module1_1/module1_1.js")
}, {
    template: "module1_2",
    path: "/module1_2",
    component: () => import( /* webpackChunkName: 'modules/modules1/module1_2'*/ "@modules/module1/module1_2/module1_2.js")
}, {
    template: "module1_3",
    path: "/module1_3",
    component: () => import( /* webpackChunkName: 'modules/modules1/module1_3'*/ "@modules/module1/module1_3/module1_3.js")
}, {
    path: "/module2_1",
    template: "module2_1",
    component: () => import( /* webpackChunkName: 'modules/modules2/module2_1'*/ "@modules/module2/module2_1/module2_1.js")
}, {
    path: "/module2_2",
    template: "module2_2",
    component: () => import( /* webpackChunkName: 'modules/modules2/module2_2'*/ "@modules/module2/module2_2/module2_2.js"),
    children: [{
        path: "/nest_router1",
        template: "nest_router1",
        component: () => import( /* webpackChunkName: 'modules/modules2/module2_2/nest_router1/nest_router1'*/ "@modules/module2/module2_2/nest_router1/nest_router1.js")
    }, {
        path: "/nest_router2",
        template: "nest_router2",
        component: () => import( /* webpackChunkName: 'modules/modules2/module2_2/nest_router2/nest_router2'*/ "@modules/module2/module2_2/nest_router2/nest_router2.js")
    }, {
        path: "/nest_router3",
        template: "nest_router3",
        component: () => import( /* webpackChunkName: 'modules/modules2/module2_1/nest_router3/nest_router3'*/ "@modules/module2/module2_2/nest_router3/nest_router3.js")
    }]
}, {
    path: "/module3",
    template: "module3",
    component: () => import( /* webpackChunkName: 'modules/modules3/module3'*/ "@modules/module3/module3.js")
}];