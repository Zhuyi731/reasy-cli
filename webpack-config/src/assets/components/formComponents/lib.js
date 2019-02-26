
import * as $ from "jquery";
window.$ = window.jQuery = $;
/*!
 * reasy-ui.js v1.0.5 2015-06-19
 * Copyright 2015 ET.W
 * Licensed under Apache License v2.0
 *
 * The REasy UI for router, and themes built on top of the HTML5 and CSS3..
 */
"use strict";
document.querySelector = document.querySelector || function(selector) {
    let $node = $(selector);
    if ($node.length > 0) {
        return $node[0];
    }
    return;
};

let rnative = /^[^{]+\{\s*\[native code/,
    _ = window._;


/**
 * jquery 数据操作拓展
 */

// ReasyUI 全局变量对象
$.reasyui = {};

// 记录已加载的 REasy模块
$.reasyui.mod = 'core ';

// ReasyUI 多语言翻译对象
$.reasyui.b28n = {};

$.getType = function(val) {
    return Object.prototype.toString.call(val);
};


// HANDLE: When $ is jQuery extend include function 
if (!$.include) {
    $.include = function(obj) {
        $.extend($.fn, obj);
    };
}

$.extend({
    keyCode: {
        ALT: 18,
        BACKSPACE: 8,
        CAPS_LOCK: 20,
        COMMA: 188,
        COMMAND: 91,
        COMMAND_LEFT: 91, // COMMAND
        COMMAND_RIGHT: 93,
        CONTROL: 17,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        INSERT: 45,
        LEFT: 37,
        MENU: 93, // COMMAND_RIGHT
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38,
        WINDOWS: 91 // COMMAND
    },
    //创建伪Guid，用法:$.IGuid()
    IGuid: function(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        len = len || 8;
        radix = radix || chars.length;

        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix];
        }

        return uuid.join('');
    },

    isNotNullOrEmpty: function(str) {
        if (typeof str === "undefined" || str === "") {
            return false;
        }
        return true;
    },

    //设置文本框中光标位置，ctrl为你要设置的输入框，pos为位置
    setCursorPos: function(ctrl, pos) {
        let range;

        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        } else if (ctrl.createTextRange) {
            range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }

        return ctrl;
    },

    getUtf8Length: function(str) {
        let totalLength = 0,
            charCode,
            len = str.length,
            i;

        for (i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode < 0x007f) {
                totalLength++;
            } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                totalLength += 2;
            } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                totalLength += 3;
            } else {
                totalLength += 4;
            }
        }
        return totalLength;
    },

    /**
     * For feature detection
     * @param {Function} fn The function to test for native support
     */
    isNative: function(fn) {
        return rnative.test(String(fn));
    },

    isHidden: function(elem) {
        if (!elem) {
            return;
        }

        return $.css(elem, "display") === "none" ||
            $.css(elem, "visibility") === "hidden" ||
            (elem.offsetHeight == 0 && elem.offsetWidth == 0);
    },

    getValue: function(elem) {
        if (typeof elem.value !== "undefined") {
            return elem.value;
        } else if ($.isFunction(elem.val)) {
            return elem.val();
        }
    }
});

/* Cookie */
$.cookie = {
    get: function(name) {
        let cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieEnd = document.cookie.indexOf(';', cookieStart),
            cookieValue = null;

        if (cookieStart > -1) {
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart +
                cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    set: function(name, value, path, domain, expires, secure) {
        let cookieText = encodeURIComponent(name) + "=" +
            encodeURIComponent(value);

        if (expires instanceof Date) {
            cookieText += "; expires =" + expires.toGMTString();
        }
        if (path) {
            cookieText += "; path =" + path;
        }
        if (domain) {
            cookieText += "; domain =" + domain;
        }
        if (secure) {
            cookieText += "; secure =" + secure;
        }
        document.cookie = cookieText;

    },
    unset: function(name, path, domain, secure) {
        this.set(name, '', path, domain, new Date(0), secure);
    }
};

$.isEqual = function(a, b) {
    for (let prop in a) {
        if ((!b.hasOwnProperty(prop) && a[prop] !== "") || a[prop] !== b[prop]) {
            return false;
        }
    }
    return true;
};

$.htmlEscape = function(str) {
    str = str + '';
    if (str) {
        str = str.replace(/\"/g, '&quot;').replace(/\'/g, '&#39;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
    }
    return str;
};

// 继承
Function.prototype.inherit = function(parent, overrides) {
    let F = function() {},
        obj;
    F.prototype = parent.prototype;
    obj = new F();

    //重写基类的属性和方法
    if (overrides) $.extend(obj, overrides);
    obj.constructor = this;

    this.prototype = obj;
};

//扩展String的原型链
//去除前后空格
String.prototype.trim = function() {
    return this.replace(/(^\s+)|(\s+$)/g, "");
};
//去除字符串中所有的空格
String.prototype.trimAll = function() {
    return this.replace(/[ ]/g, "");
};

//去除前面的空格
String.prototype.trimBefore = function() {
    return this.replace(/^\s+/g, "");
};

//去除后面的空格
String.prototype.trimEnd = function() {
    return this.replace(/\s+$/g, "");
};

/**
 * 对象克隆
 * @param  {[type]} myObj [description]
 * @return {[type]}       [description]
 */

function objClone(myObj) {
    if (typeof(myObj) != 'object') return myObj;
    if (myObj === null) return myObj;
    let myNewObj = {};
    for (let i in myObj)
        myNewObj[i] = objClone(myObj[i]);
    return myNewObj;
}
/**
 * 拓展数组对象深度克隆
 * @return {[type]} [description]
 */
Array.prototype.clone = function() { //为数组添加克隆自身方法，使用递归可用于多级数组
    let newArr = [];
    for (let i = 0; i <= this.length - 1; i++) {
        let itemi = this[i];
        if (itemi.length && itemi.push) itemi = itemi.clone(); //数组对象，进行递归
        else if (typeof(itemi) == "object") itemi = objClone(itemi); //非数组对象，用上面的objClone方法克隆
        newArr.push(itemi);
    }
    return newArr;
};

Array.prototype.map = Array.prototype.map || function(cb) {
    let newArr = [];
    for (let i = 0; i <= this.length - 1; i++) {
        newArr.push(cb(this[i]));
    }
    return newArr;
};

if (!Array.prototype.indexOf) { //解决IE8不支持数组使用indexOf方法
    Array.prototype.indexOf = function(searchStr) {
        let len = this.length || 0;
        let from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === searchStr)
                return from;
        }
        return -1;
    };
}

/**
 * AJAX
 */
$.GetSetData = {
    getData: function(data, handler, url = '/goform/module', type = 'post') {
        if (url.indexOf("?") < 0) {
            // url += "?" + (new Date().getTime());
            let key = '?';
            for (let t in data) {
                key += t + '&';
            }
            url += key;
        }

        if (data) {
            data = JSON.stringify(data);
        }

        return $.ajax({
            url: url,
            cache: false,
            type: type,
            dataType: "text",
            data: data,
            contentType: "application/json",
            async: true,
            success: function(data, status) {
                _handleResult(data);

                if (typeof handler == "function") {
                    data = JSON.parse(data);
                    handler.call(this, data);
                }
            },
            error: function(msg, status) {},
            complete: function(xhr) {
                xhr = null;
            }
        });
    },
    //跨域请求
    getDataCROS: function(data, handler, url = '/goform/module', type = 'post') {
        if (url.indexOf("?") < 0) {
            url += "?" + (new Date().getTime());
        }

        if (data) {
            data = JSON.stringify(data);
        }

        $.ajax({
            url: url,
            cache: false,
            type: type,
            dataType: "text",
            data: data,
            contentType: "text/plain", //CORS跨域content-type只能为text/plain, multipart/form-data, application/x-www-form-urlencoded中的一个，否则就是非简单请求
            async: true,
            success: function(data, status) {
                _handleResult(data);

                if (typeof handler == "function") {
                    handler.call(this, data);
                }
            },
            error: function(msg, status) {

            },
            complete: function(xhr) {
                xhr = null;
            }
        });
    },
    setData: function(data, handler, url = '/goform/module', type = 'post', handleError = true) {
        $('#module-save').prop('disabled', 'disabled');
        if (url.indexOf("?") < 0) {
            url += "?" + (new Date().getTime());
        }
        if (data) {
            data = JSON.stringify(data);
        }
        //禁用提交按钮
        $('.md-modal-wrap.md-show').find('.md-btn').not('.cancel').attr('disabled', true);

        $.ajax({
            url: url,
            cache: false,
            type: "post",
            dataType: "text",
            contentType: "application/json",
            async: true,
            data: data,
            success: function(data) {
                _handleResult(data);

                data = JSON.parse(data);
                //错误处理
                if (handleError) {
                    for (let key in data) {
                        if (data[key] === -1) {
                            //表示保存出错
                            $.formMessage(_("Save failed"));
                            return;
                        }
                    }
                }

                if ((typeof handler).toString() == "function") {
                    handler(data);
                }
            },
            complete: function() {
                $('#module-save').removeAttr('disabled');
                $('.md-toolbar').find('.md-btn').removeAttr('disabled');
            }
        });
    },
    setDataNoJson: function(data, handler, url = '/goform/module') {
        $.ajax({
            url: url,
            cache: false,
            type: "post",
            dataType: "text",
            async: true,
            data: data,
            success: function(data) {
                _handleResult(data);

                if ((typeof handler).toString() == "function") {
                    handler(data);
                }
            },
            complete: function() {
                $('#module-save').removeAttr('disabled');
                $('.md-toolbar').find('.md-btn').removeAttr('disabled');
            }
        });
    }
};

function _handleResult(data) {
    var version = (new Date().getHours()) + '' + (new Date().getMinutes());
    if (data.indexOf("login.js") > 0) {
        window.location.href = "login.html?v=" + version;
        return false;
    }
    if (data.indexOf("quickset.js") > 0) {
        window.location.href = "quickset.html?v=" + version;
        return false;
    }
}
