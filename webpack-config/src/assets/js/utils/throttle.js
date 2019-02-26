/**
 * 节流
 */
function throttle(fn, interval) {
    var timer = null,
        oldTime;

    return function() {
        var that = this,
            curTime = +new Date(),
            _args = arguments;

        if (oldTime && curTime - oldTime < interval) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                oldTime = curTime;
                fn.apply(that, _args);
            }, interval);
        } else {
            oldTime = curTime;
            fn.apply(that, _args);
        }
    }
}

export default throttle;