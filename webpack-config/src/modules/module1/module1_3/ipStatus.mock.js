module.exports = {
    url: "mock/xxx3", //拦截该请求
    data: function(req, server) {
        let data = server.getFrom("ipStatus");
        if (!data) {
            data = Mock.mock({
                "lanType|1": ["dhcp", "static"], //mock语法，返回数组中随机一个数
                "lanIp": "@ip", //返回一个随机IP
                "lanMask": "@ip",
                "lanGw": "@ip",
                "preDns": "@ip",
                "altDns": "@ip",
                "deviceName|1-32": "@string" //返回一个1-32位长度的随机字符串  
            });
        }
        return data;
    }
};