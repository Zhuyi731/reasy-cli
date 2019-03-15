# 优化部分   
webpack 优化了编译及增量编译的速度  

## 如何查看webpack编译速度及瓶颈  

使用如下指令，可以查看webpack编译各个部分占时  
> webpack --progress --profile  

## 当前性能 
版本@v1.0.0    
调试环境编译: 10888ms~13654ms 平均12s    
调试环境增量编译:214ms ~ 1156ms 平均0.5s  
生产环境: 8824ms ~ 19254ms    平均14s

# 具体优化措施

## 并行编译  

###uglify.js 

- 开启并行编译 
- 开启缓存  
- 替代es3ify-plugin处理ie8关键字问题  

``` 
    new uglifyJs({
        cache: 'node_modules/.cache_uglify/',
        parallel: 4,
        uglifyOptions: {
            ie8: true
        }
    }),
```

### happyPack  

> happyPack可以并行处理webpack assets。适用于部分loader。  
> 具体配置在build/webpack.base.js下   
> 参考连接  
> 1.[https://segmentfault.com/a/1190000005770042](https://segmentfault.com/a/1190000005770042)  
> 2.[https://www.cnblogs.com/imwtr/p/7801973.html](https://www.cnblogs.com/imwtr/p/7801973.html)

fast-sass-loader  

> 利用fast-sass-loader替换sass-loader可以并行编译sass   
> 实测能大幅提高编译速度

## dll加速  
通过webpack的dll机制预先打包一些不会去更改的包。    
避免每次编译时重复编译没有改动的部分。 

当前导出的包的libraryTarget设置为window    
需要从html手动引入对应dll包    
也可以将libraryTarget设置为umd，然后从代码里import  
参考链接：   [https://webpack.js.org/plugins/dll-plugin/#root](https://webpack.js.org/plugins/dll-plugin/#root)  
[https://webpack.js.org/plugins/dll-plugin/#dllreferenceplugin](https://webpack.js.org/plugins/dll-plugin/#dllreferenceplugin)  

## resolve解析  
通过配置resolve字段，让webpack在解析时确定一些解析细节。从而加快解析速度。   
文档 [https://www.webpackjs.com/configuration/resolve/](https://www.webpackjs.com/configuration/resolve/)


