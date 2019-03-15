module.exports = {
    browser: "ie8", //兼容至 ie8 || ie9
    pages: { //页面信息
        "index": { //index页面
            title: "O3V2.0", //页面title 必填
            template: "index", //页面使用的html模板 默认 none  暂时支持index 和 login
            cssTemplate: "ipcom" //页面使用的css模板  默认 none  
        },
        // "login": {
        //     title: "Tenda | Login",
        //     template: "login"
        // },
        // "quickset": {
        //     title: "Tenda | 快速设置",
        //     template: "none"
        // }
    },
    mock: {
        //数据模拟方式
        type: "local", // ypai  || local   
        //如果配置的是ypai，则需要配置apiPrefix字段   
        apiPrefix: "http://192.168.99.123:3010/mock/29" //yapi的项目前缀，所有项目请求被代理转发至yapi服务器
    }
};