# 基础路由  
 
因为Router需要兼容IE8，采用的是hashRouter。

## 原理  
当浏览器hash改变时，会触发hashchange事件,通过监听这个事件来加载对应页面

## Router使用

`

    const $router = new Router({  
        elements:["id1","id2"],  //一级路由的DOM元素的id  类似于vue-router中router-view标签的id  
        beforeRouting:(previous,current)=>{},  //路由前的钩子函数    
        afterRouting:page=>{},   //路由后的钩子函数  
        routerCfg:{  //路由配置  
            path:"/module1_1",   //匹配的hash路径  
            template:"module1_1", //html文件名称  
            component:()=>{ //js加载    这里可以使用懒加载，也可以即时加载，看具体需求来定  
                //懒加载，当需要加载这个js时，才会去请求  
                import("src/modules/module1/module1_1/module1_1.js");  
           },  
            //即时加载，当new Router的时候就已经加载进来了  
            //component:require("src/modules/module1/module1_1/module1_1.js")     
        }  
    });  

    //Router和菜单栏 Menu 是两个独立的组件，是没有关联的。所以点击菜单栏加载对应页面的逻辑需要自己写。
    //$router方法
    $router.push(url)  //跳转至新的url 
    $router.getCurrentPage(); // 获取当前页面js对象的引用
    $router.getPreviousPage(); //获取上一个页面js对象的引用 
    $router.load(url); //加载url模块的html和js

    //$router hooks

    //在路由跳转前触发该钩子函数，
    //previous,current为之前页面与当前页面的hash
    beforeRouting(previous,current){}  

    //路由跳转后出发的函数  
    //page为当前页面js的引用，在这里调用当前页面的主逻辑  
    afterRouting(page){}

    //当没有找到匹配的路由时，应当进行的行为 
    redirectToDefault(){ }
`