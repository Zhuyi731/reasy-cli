import $ from "jquery";
export default class Router {
    constructor({ element, defaultPage, templateLoadingPrefix, routerCfg }) {
        if (!Promise in window) {
            throw new Error("You need Promise polyfill");
        }
        this.$init(...arguments);
        this.$registRouterCfg(routerCfg);
        this.$watchHashChange(); //监视hash变化
    }

    $init({ element, defaultPage, templateLoadingPrefix, routerCfg }) {
        this.$element = element;
        this.$defaultPage = defaultPage;
        this.$templateLoadingPrefix = templateLoadingPrefix || "pages/";
        this.routerCfg = {}; //路由配置
        this.cache = {}; //模板缓存
        this.current = null; //当前路由
        this.previous = null; //前一个路由
        this.historys = [];
        this.$hashChanged = this.$hashChanged.bind(this);
        this.$loadComponent = this.$loadComponent.bind(this);
    }


    $registRouterCfg(routerCfg, parentPath = "") {
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
                template: cfg.template
            };

            if (cfg.children && cfg.children.length > 0) {
                this.$registRouterCfg(cfg.children, currentPath);
            }
        });
    }

    $watchHashChange() {
        window.addEventListener('hashchange', this.$hashChanged, false);
    }

    $hashChanged(e) {
        let newHash = e.newURL.split("#").pop().split("?")[0];
        if (newHash in this.routerCfg) {
            this.previous = this.current;
            this.current = newHash;
            this.historys.push(this.current);
            this.$loadTemplate()
                .then(this.$loadComponent)
                .then(this.loaded)
                .catch(err => {
                    throw err;
                });
        } else {
            //如果路由没有找到对应的页面，则重定向至默认页面
            this.redirectToDefault();
        }
    }

    redirectToDefault() {

    }

    $loadComponent() {
        return new Promise((resolve, reject) => {
            this.routerCfg[this.current].component()
                .then(component => {
                    console.log(component);
                })
                .catch(err => {
                    throw err;
                });
        });
    }

    $loadTemplate() {
        return new Promise((resolve, reject) => {
            if (this.cache[this.current]) {
                resolve();
            } else {
                let templateUrl = this.$templateLoadingPrefix + this.routerCfg[this.current].template + `.html?version=${Math.random()}`;
                $.get(templateUrl, template => {
                    this.cache[this.current] = template;
                    this.$element.innerHTML = template;
                    resolve();
                });
            }
        });
    }

    loaded() {

    }
}