//按需加载，注释为编译后文件名称 
//webpack中支持请关注 @babel/plugin-syntax-dynamic-import 插件
export default [{
    path: "/module1_1",
    template: "module1_1",
    component: () => import( /* webpackChunkName: 'modules/module1_1'*/ "@modules/module1/module1_1/module1_1.js")
}, {
    template: "module1_2",
    path: "/module1_2",
    component: () => import( /* webpackChunkName: 'module1_2'*/ "@modules/module1/module1_2/module1_2.js")
}, {
    template: "module1_3",
    path: "/module1_3",
    component: () => import( /* webpackChunkName: 'module1_3'*/ "@modules/module1/module1_3/module1_3.js")
}, {
    path: "/module2_1",
    template: "module2_1",
    component: () => import( /* webpackChunkName: 'modules/module2_1'*/ "@modules/module2/module2_1/module2_1.js")
}];