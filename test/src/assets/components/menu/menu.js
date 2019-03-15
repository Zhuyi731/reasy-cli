import "./menu.scss";

export default class Menu {
    constructor(options) {
        this.currentMenu = "";
        this.options = options;
        this.init();
    }

    init() {
        this.guid = $.IGuid();
        this.$element = this.options.element;
        this.$getMenuTemplate(this.options.menus);
        this.$element.append(this.template);

        let that = this;
        this.$element.on("click", ".menu-li", function(e) {
            e.stopPropagation();
            that.$changeActiveMenu($(this));
        });
    }

    $changeActiveMenu($menu) {
        let menuClasses = $menu.attr("class").split(" "),
            level = $menu.data("level"),
            originalPath = $(".menu-li.active").data("path"),
            currentPath;

        if (level == "1") { //一级菜单  
            if (menuClasses.includes("menu-parent")) { //不是单个一级菜单
                this.$toggleFirstClassMenu($menu, menuClasses); //展开或折叠一级菜单
                return;
            } else { //单个一级菜单
                $(`#${this.guid} .menu-li.active`).removeClass("active");
                $(`#${this.guid} .menu-li-1.menu-open`).removeClass("menu-open").children(".menu-ul").slideUp();
            }
        } else { //点击的是二级菜单
            $(`#${this.guid} .menu-li.active`).removeClass("active");
        }

        $menu.addClass("active");
        currentPath = $menu.data("path");
        this.currentMenu = currentPath;
        this.onMenuChange(originalPath, currentPath);
    }

    $toggleFirstClassMenu($menu, menuClasses) {
        //根据一级菜单展开情况，来展开或者折叠以及菜单
        let originalPath = $(".menu-li.active").data("path"),
            currentPath,
            $activeMenu;
        if (menuClasses.includes("menu-open")) { //原本就是展开的，需要折叠
            $menu.removeClass("menu-open").children(".menu-ul").slideUp();
        } else { //该菜单是折叠的，需要展开
            if ($menu.find(".menu-li.active").length > 0) {
                //说明之前这个菜单是折叠的，但是下面有活动的二级菜单
                $menu.addClass("menu-open").children(".menu-ul").slideDown();
            } else {
                //说明是新点开了一个一级菜单
                $(`#${this.guid} .menu-li.active`).removeClass("active");
                $(`#${this.guid} .menu-li-1.menu-open`).removeClass("menu-open").children(".menu-ul").slideUp();
                $menu.addClass("menu-open").children(".menu-ul").slideDown();
                $activeMenu = $menu.find(".menu-li").eq(0);

                $activeMenu.addClass("active");
                currentPath = $activeMenu.data("path");
                this.currentMenu = currentPath;
                this.onMenuChange(originalPath, currentPath);
            }
        }
    }

    setMenu(path) {
        if ($(`.menu-li[data-path="${path}"]`).length == 0) return;
        let $menu = $(`.menu-li[data-path="${path}"]`),
            level = $menu.data("level");

        if (level == 2) {
            let classes = $menu.parent().parent().attr("class");
            if (!classes.includes("menu-open")) {
                $(`#${this.guid} .menu-li-1.menu-open`).removeClass("menu-open").children(".menu-ul").slideUp();
                $menu.parent().parent().addClass("menu-open").children(".menu-ul").slideDown();
            }
        }

        this.currentMenu = path;
        $(`#${this.guid} .menu-li.active`).removeClass("active");
        $menu.addClass("active");
    }

    getCurrentMenu() {
        return this.currentMenu;
    }

    onMenuChange(before, after) {
        if (this.options.onMenuChange) {
            this.options.onMenuChange(before, after, this.guid);
        }
    }

    $iterator(menus, depth) {
        ++depth;
        menus.forEach((menu, index) => {
            if (menu.path && !/^\//.test(menu.path)) {
                menu.path = "/" + menu.path;
            }

            let hasChildren = menu.children && menu.children.length > 0,
                iconClassName = `menu-icon menu-icon-${depth} `,
                liClassName = `menu-li menu-li-${depth}`,
                dataPath = menu.path ? `data-path="${menu.path}"` : "";
            // dataPath = "";
            //添加类名
            iconClassName += menu.icon ? `icon-${menu.icon}` : "icon-empty";
            (index == 0 && depth == 1) && (liClassName += " menu-top");
            hasChildren && (liClassName += " menu-parent");

            this.template += `
                            <div class="${liClassName}" ${dataPath} data-level="${depth}">
                                <div class="menu-content menu-content-${depth}">
                                    <i class="${iconClassName}"></i>
                                    <p>${menu.title}</p>
                                </div>
                                `;
            //如果有子节点，遍历处理
            if (hasChildren) {
                this.template += `<div class="menu-ul menu-ul-${depth + 1}">`;
                this.$iterator(menu.children, depth);
                this.template += `</div>`;
            }

            this.template += `</div>`;
        });
    }

    $getMenuTemplate(menus) {
        this.template = `<div class="menu-top-wrapper menu-ul menu-ul-1 menu-top" id="${this.guid}">`;
        this.$iterator(menus, 0);
        this.template += `
        </div>`;
    }
}