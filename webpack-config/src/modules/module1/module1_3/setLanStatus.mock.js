 module.exports = {
    url:"mock/submitForm",
    data:function(req,server){
        server.setTo("ipStatus",req.body);//请求携带的数据在req.body上
        return {
            errCode:"0"
        }
    }
};