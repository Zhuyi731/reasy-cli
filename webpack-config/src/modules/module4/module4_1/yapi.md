# yapi  
yapi服务器暂时部署在192.168.99.123:3031端口。 
不熟悉使用的可以进入该路径尝试创建项目  

如果需要调试编译后的dist中文件   
需要进入tool->本地调试.bat  调用该脚本


##　配置　　
在服务器上创建完Ypai项目后，Yapi会给出一个项目路径。  
在项目创建时，配置  

> mock.type = "yapi" 
> mock.apiPrefix = 服务器地址 + 项目路径  

或者在项目创建后进入config-> user.config.js再配置也可以 

配置完成之后，会自动进行proxy代理。  

