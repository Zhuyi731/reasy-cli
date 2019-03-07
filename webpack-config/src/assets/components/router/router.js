/**
 * @Usage 
 * import Router from "RouterComponentPath"
 * const router = new Router(options);
 * 
 * options:
 * @type object 
 * {
 *   @param elemetns: @type Array  各级路由的router-view的选择器
 *   @param temolateLoadingPrefix : @type String 编译后的html存放的路径，与html-webpack-plugin插件有关  
 *   @param routerCfg :@type Array  路由配置
 * }
 */

export default class Router {
    constructor({ routerCfg }) {
        this.$validateOptions(...arguments);
        this.$init(...arguments);
        this.$watchHashChange(); //监视hash变化
    }

    $validateOptions({ elements, routerCfg }) {
        if (!Promise in window) {
            throw new Error("You need Promise polyfill");
        }
        if (!elements) throw new Error("router.elements is required");
        if (!routerCfg) throw new Error("router.routerCfg is required");

        if (!Array.isArray(elements)) throw new Error("router.elements is supposed to be an Array");
    }

    $init({ elements, redirectToDefault, beforeRouting, afterRouting, templateLoadingPrefix, defaultPage, routerCfg }) {
        //attributes binding
        this.$elements = elements;
        this.$templateLoadingPrefix = templateLoadingPrefix || "pages/";

        //attributes initialize
        this.routerCfg = {}; //路由配置
        this.defaultPage = defaultPage;
        this.current = "/"; //当前路由
        this.previous = "/"; //前一个路由
        this.$currentPage = null; //前一个页面实例的引用
        this.$previousPage = null; //当前页面实例的应用
        this.historys = []; //历史记录

        //hooks binding
        this.beforeRouting = beforeRouting;
        this.afterRouting = afterRouting;
        redirectToDefault && (this.redirectToDefault = redirectToDefault);
        this.$registRouterCfg(routerCfg);

    }

    $registRouterCfg(routerCfg, parentPath = "", depth = 0) {
        //如果不是以/开头则添加/
        if (!/^\//.test(parentPath)) {
            parentPath = "/" + parentPath;
        }
        if (parentPath && !/\/$/.test(parentPath)) {
            parentPath += "/";
        }

        routerCfg.forEach(cfg => {
            if (!cfg.path || !cfg.template || !cfg.component) {
                throw new Error("path template component in router is required");
            }

            if (/^\//.test(cfg.path)) {
                cfg.path = cfg.path.substr(1, cfg.path.length);
            }

            let currentPath = parentPath + cfg.path;

            this.routerCfg[currentPath] = {
                component: cfg.component,
                template: cfg.template,
                depth
            };

            if (cfg.children && cfg.children.length > 0) {
                this.$registRouterCfg(cfg.children, currentPath, depth + 1);
            }
        });
    }

    $watchHashChange() {
        //to validate IE8 compatibility
        if (window.addEventListener) {
            window.addEventListener('hashchange', this.$load, false);
        } else {
            window.attachEvent("onhashchange", this.$load, false);
        }
    }

    getPreviousPage() {
        return this.$previousPage;
    }

    getCurrentPage() {
        return this.$currentPage;
    }

    $load = hash => {
        //如果是通过hashChangeEvent传进来的会是一个事件
        //IE8下此时间不存在oldURL 和 newURL属性，所以需要手动获取hash
        //TODO: Firefox下兼容性待检验
        typeof hash !== "string" && (hash = window.location.hash.split("#").pop().split("?")[0]);

        this.previous = this.current;
        this.current = hash;

        if (this.routerCfg[hash]) {
            this.historys.push(this.current);
            //路由处理
            this.$beforeRouting(this.previous, this.current);

            Promise.all([
                    this.$loadComponent(),
                    this.$loadTemplate()
                ])
                .then(pages => pages[0])
                .then(this.$afterRouting)
                .catch(err => {
                    throw err;
                });
        } else {
            //如果路由没有找到对应的页面，则重定向至默认页面
            this.redirectToDefault();
        }
    }

    push(hash) {
        if (this.current === hash) {
            this.$load(hash);
        } else {
            window.location.hash = hash;
        }
    }

    redirectToDefault() {
        this.push(this.defaultPage);
    }

    $loadComponent = () => {
        return new Promise((resolve, reject) => {
            let component = this.routerCfg[this.current].component;
            if (typeof component == "function") {
                this.routerCfg[this.current]
                    .component()
                    .then(Page => {
                        Page = Page.default;
                        let page = new Page();
                        this.$previousPage = this.$currentPage;
                        this.$currentPage = page;
                        resolve(page);
                    })
                    .catch(reject);
            } else {
                resolve(component);
            }
        });
    }

    $loadTemplate = () => {
        return new Promise((resolve, reject) => {
            let cfg = this.routerCfg[this.current],
                depth = cfg.depth;

            if (cfg.html) {
                $(`#${this.$elements[depth]}`).html(cfg.html);
                resolve();
            } else {
                let templateUrl = this.$templateLoadingPrefix + cfg.template + `.html?version=${Math.random()}`;
                $.get(templateUrl, template => {
                    cfg.html = template;
                    $(`#${this.$elements[depth]}`).html(template);
                    resolve();
                });
            }
        });
    }

    $beforeRouting(previous, current) {
        if (this.beforeRouting && typeof this.beforeRouting == "function") {
            this.beforeRouting(previous, current, this.routerCfg[this.current].depth, this.routerCfg[this.previous].depth);
        }
        //eslint-disable-next-line
        if (process && process.env && process.env.NODE_ENV == "development") {
            console.log(`now routing to ${this.current}`);
        }
    }

    /**
     * 路由仅会加载js，不会进行js调用，需要手动设置afterRouting函数来调用
     * @param {*} Page 
     */
    $afterRouting = page => {
        if (this.afterRouting && typeof this.afterRouting == "function") {
            this.afterRouting(page, this.routerCfg[this.current].depth);
        }
    }
}