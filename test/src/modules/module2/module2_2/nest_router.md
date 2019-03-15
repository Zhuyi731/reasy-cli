# 嵌套路由 

当路由内部有子路由时，这种情况需要配置嵌套路由。   
嵌套路由配置同Vue一样，在路由配置中加入chidren属性即可。   

# 配置  
当匹配到/module2_2/nest_router1时，加载对应配置的nest_router1.html与nest_router1.js

# 例子  
具体效果往下拉，点击嵌套路由1、2、3。下方router-view加载不同的组件。  
配置看代码

```

    routerCfg = [{
        path: "/module2_2",
        template: "module2_2",
        component: () => import("@modules/module2/module2_2/module2_2.js"),
        children: [{
            path: "/nest_router1",
            template: "nest_router1",
            component: () => import("@modules/module2/module2_1/nest_router1/nest_router1.js")
        }, {
            path: "/nest_router2",
            template: "nest_router2",
            component: () => import("@modules/module2/module2_1/nest_router2/nest_router2.js")
        }, {
            path: "/nest_router3",
            template: "nest_router3",
            component: () => import("@modules/module2/module2_1/nest_router3/nest_router3.js")
    }}]

```