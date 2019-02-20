export default [{
    path: "/moduleA/aa",
    template: "moduleA",
    component: () => import( /* webpackChunkName: 'modules/moduleA'*/ "@modules/moduleA/moduleA.js")
}, {
    template: "moduleA",
    path: "/moduleA/dd",
    component: () => import( /* webpackChunkName: 'moduleA'*/ "@modules/moduleA/moduleA.js")
}, {
    template: "moduleA",
    path: "/moduleA",
    component:() => import( /* webpackChunkName: 'moduleA'*/ "@modules/moduleA/moduleA.js"),
    children: [{
        path: "ff",
        template: "moduleA",
        component:() => import( /* webpackChunkName: 'moduleA'*/ "@modules/moduleA/moduleA.js"),
    }, {
        path: "ee",
        template: "moduleA",
        component:() => import( /* webpackChunkName: 'moduleA'*/ "@modules/moduleA/moduleA.js"),
    }]
}];