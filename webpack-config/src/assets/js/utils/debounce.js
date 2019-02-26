/*
 * fn为待执行的函数
 * interval为函数执行最小时间间隔 {number}   
 */
function debounce(fn, interval) {
    var args = Array.prototype.slice.call(arguments, 2),
        timer = null,
        oldTime;
    return function() {
        var self = this,
            curTime = +new Date(),
            _arg = Array.prototype.slice.call(arguments, 1);

        if (!oldTime) { //第一次进该函数
            fn.apply(self, _arg.concat(args));
        } else {
            if (curTime - oldTime > interval) { //如果两次执行间隔时间大于interval
                fn.apply(self, _arg.concat(args));
            }
        }
        oldTime = curTime;
    };
}

export default debounce;