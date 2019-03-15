# 本地数据模拟  
如果不想使用Yapi方式，也提供一种本地模拟数据的方式  

如果需要调试编译后的dist中文件   
需要进入tool->本地调试.bat  调用该脚本

## 配置  
在项目创建时，配置  

> mock.type = "yapi" 
> mock.apiPrefix = 服务器地址 + 项目路径  

或者在config->user.config.js中配置   

## 语法规则  
在src下任意路径都可以创建一个 xxx.mock.js文件(xxx为任意前缀)来进行数据模拟。  
xxx.mock.js返回一个对象; 
 
对象包含如下参数:    
**@param url<String>** 必填， 需要拦截的请求路径    
**@param method<String>** 选填  请求的方式，默认POST。   支持方式GET POST PULL DELETE等
**@param data<Object || function>** 必填， 支持mock格式，返回的数据实际上是 Mock.mock(data)     
**@param delay<Number>** 选填， 延迟时间，表明需要延迟多久返回  不配置则默认为0    

**特殊参数1**  
**@param getFrom<String>**  需要配合setTo使用，配置了getFrom之后，会优先从getFrom对应的缓存字段中取数据。     
**@param setTo<String>**    需要配合getFrom使用，配置了setTo之后，会将${url}请求中发送来的数据储存在setTo的缓存字段中  

## 例子  
基础页面模板->表单页面中，请求获取数据    

1. 创建ipStatus.mock.js   
2. 创建模拟数据   

```  
module.exports = {
    url: "mock/xxx3",//拦截该请求
    data: {
        "lanType|1": ["dhcp", "static"],//mock语法，返回数组中随机一个数
        "lanIp": "@ip", //返回一个随机IP
        "lanMask": "@ip",
        "lanGw": "@ip",
        "preDns": "@ip",
        "altDns": "@ip",
        "deviceName|1-32": "@string" //返回一个1-32位长度的随机字符串  
    },
    delay:1000 //延迟1s返回
};   
```   

### 配合setTo  getFrom使用   
保存数据时，配置模拟数据   

```
module.exports = {
    url:"mock/submitForm",
    data:{
        errCode:"0"
    },
    setTo:"ipStatus"  //会将url对应请求携带的数据全部保存至ipStatus缓存字段
}
```

请求数据多增加一个字段getFrom:"ipStatus"即可保存数据。  

## 自定义保存数据  
如果你只想获取部分数据(getFrom)，或者设置部分数据(setTo);   
那么你可以将data设置为一个function   
function(req, server){}接受两个参数  
req:请求的express实例  
server:服务器实例   
server包含三个方法  

> getFrom(where){}  //where为缓存字段  获取where缓存字段的数据

> setTo(where,val){} //设置where字段为val  

> Mock(){}  //mock方法调用    

上面的例子等价于   
//请求数据  
```
module.exports = {
    url: "mock/xxx3",//拦截该请求
    data: function(req,server){
        let data = server.getFrom("ipStatus");
        if(!data){
            data = server.Mock({
                "lanType|1": ["dhcp", "static"],//mock语法，返回数组中随机一个数
                "lanIp": "@ip", //返回一个随机IP
                "lanMask": "@ip",
                "lanGw": "@ip",
                "preDns": "@ip",
                "altDns": "@ip",
                "deviceName|1-32": "@string" //返回一个1-32位长度的随机字符串  
            });
        }
        return data;
    },
    delay:1000 //延迟1s返回
};  
```
//保存数据   
```
 module.exports = {
    url:"mock/submitForm",
    data:function(req,server){
        server.setTo("ipStatus",req.body);//请求携带的数据在req.body上
        return {
            errCode:"0"
        }
    }
}
```


