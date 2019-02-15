import * as $ from "jquery";

export default class BaseComponent {
    constructor(element, options) {
        this.DEFAULT_OPTION = {
            css: "",
            visible: true //是否可见
            // beforeCreat: null,
            // created: null,
            // beforeMount: null,
            // mounted: null,
            // beforeUpdate: null,
            // updated: null,
            // beforeDestroy: null,
            // destroyed: null,
        };

        this.options = $.extend({}, this.DEFAULT_OPTION, options);
        this.$element = $(element);

        this.init();
        this.beforeCreat();
        this.creat();
        this.created();
        this.beforeMount();
        this.mounted();
    }

    //初始化组件
    init() {}

    beforeCreat() {

    }

    creat() {

    }

    created() {

    }

    beforeMount() {

    }

    mounted() {

    }

    beforeUpdate() {

    }

    updated() {

    }

}