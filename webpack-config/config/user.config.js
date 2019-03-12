module.exports = {
    pages: {
        "index": {
            title: "O3V2.0",
            template: "index"
        },
        "login": {
            title: "Tenda | Login",
            template: "login"
        },
        "quickset": {
            title: "Tenda | 快速设置",
            template: "none"
        }
    },
    mock: {
        type: "local", // ypai  || local,
        apiPrefix: "http://192.168.99.123:3010/mock/29", //yapi的项目前缀，所有项目请求被代理转发至yapi服务器
        /* yapi 配置    
               ypai  webpack配置为  
               devServer: {  
                   //这种配置会代理所有的请求，包括html页面请求
                   //webpack会先匹配编译好的文件中有没有对应的文件，如果没有，才会进行代理。
                    proxy: {
                        "**": {
                            target: userConfig.mock.apiPrefix
                        }
                    }
               }   
        */
        // type:"local"    
        /**
         * local配置
         * 本地开发模式下，只需要书写一个  xxx.mock.js即可，可放在src下任意位置，最好放在对应模块内。不能重复命名。    
         * 该文件书写遵循mock规则   
         * 例子：
         * 
         * //Mock 已经被注册为全局对象，不需要引入
         * //mock语法  https://github.com/nuysoft/Mock/wiki/Getting-Started
         * // getStatus.mock.js
           // xxx.mock.js需要导出一个对象，对象对应三个属性  
           // @url : 需要匹配的路径
           // @data : 返回的数据,支持mock-schema  @type:Object || function (req){}
           //  如果是object  则会通过Mock.mock转换   如果是function(req){} 则接受一个参数req，为当前请求。返回对应数据。
           // @delay : 延迟返回时间  
           // 
            module.export = {
                url:"/goform/test1",   
                data:{
                    'list|1-10': [{
                        'id|+1': 1
                    }]
                },
                delay:2000,
            }
         */
    }
};