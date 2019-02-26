import $ from "jquery";


/**
 * @Usage 
 * import Router from "RouterComponentPath"
 * const router = new Router(options);
 * 
 * options:
 * @type object 
 * {
 *   @param elemetns: @type Array  各级路由的router-view的选择器
 *   @param defaultPage:@type String 当没有匹配到任何路由时，应该跳转至哪个页面  
 *   @param temolateLoadingPrefix : @type String 编译后的html存放的路径，与html-webpack-plugin插件有关  
 *   @param routerCfg :@type Array  路由配置
 * }
 */

export default class Router {
    constructor({ elements, defaultPage, templateLoadingPrefix, routerCfg }) {

        this.$validateOptions(...arguments);
        this.$init(...arguments);
        this.$registRouterCfg(routerCfg);
        this.$watchHashChange(); //监视hash变化
    }

    $validateOptions({ elements, defaultPage, templateLoadingPrefix, routerCfg }) {
        if (!Promise in window) {
            throw new Error("You need Promise polyfill");
        }
        if (!elements) throw new Error("router.elements is required");
        if (!routerCfg) throw new Error("router.routerCfg is required");

        if (!Array.isArray(elements)) throw new Error("router.elements is supposed to be an Array");
    }

    $init({ elements, defaultPage, templateLoadingPrefix, routerCfg }) {
        this.$elements = elements;
        this.$defaultPage = defaultPage;
        this.$templateLoadingPrefix = templateLoadingPrefix || "pages/";
        this.routerCfg = {}; //路由配置
        this.cache = {}; //模板缓存
        this.current = null; //当前路由
        this.previous = null; //前一个路由
        this.$currentPage = null; //前一个页面实例的引用
        this.$previousPage = null; //当前页面实例的应用
        this.historys = [];
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
                this.$registRouterCfg(cfg.children, currentPath, ++depth);
            }
        });
    }

    $watchHashChange() {
        window.addEventListener('hashchange', this.$hashChanged, false);
    }

    getPreviousPage() {
        return this.$previousPage;
    }

    getCurrentPage() {
        return this.$currentPage;
    }

    push = (url) => {
        if (url in this.routerCfg) {
            this.previous = this.current;
            this.current = url;
            this.historys.push(this.current);
            //路由处理
            this.beforeRouting();

            Promise.all([this.$loadComponent(), this.$loadTemplate()])
                .then(pages => {
                    return pages[0];
                })
                .then(this.afterRouting)
                .catch(err => {
                    throw err;
                });
        } else {
            //如果路由没有找到对应的页面，则重定向至默认页面
            this.redirectToDefault();
        }
    }

    $hashChanged = (e) => {
        let newHash = e.newURL.split("#").pop().split("?")[0];
        this.push(newHash);
    }

    redirectToDefault() {

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
                this.$elements[depth].innerHTML = cfg.html;
                resolve();
            } else {
                let templateUrl = this.$templateLoadingPrefix + cfg.template + `.html?version=${Math.random()}`;
                $.get(templateUrl, template => {
                    cfg.html = template;
                    this.$elements[depth].innerHTML = template;
                    resolve();
                });
            }
        });
    }

    beforeRouting() {
        //eslint-disable-next-line
        if (process && process.env && process.env.NODE_ENV == "development") {
            console.log(`now routing to ${this.current}`);
        }
    }

    /**
     * 路由仅会加载js，不会进行js调用，需要手动设置afterRouting函数来调用
     * @param {*} Page 
     */
    afterRouting = (Page) => {

    }
}