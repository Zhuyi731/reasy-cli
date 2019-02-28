import $ from "jquery";
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
        this.$element.append($(this.template));

        let that = this;
        this.$element.on("click", "li", function(e) {
            e.stopPropagation();
            that.changeActiveMenu($(this));
        });
    }

    changeActiveMenu($menu) {
        let menuClasses = $menu.attr("class").split(" "),
            level = $menu.data("level");

        if (menuClasses.includes("menu-parent")) {
            if (menuClasses.includes("menu-open")) { //开启的
                $menu.removeClass("menu-open").find("ul").slideUp();
            } else {
                $(`#${this.guid} .menu-li-${level}.menu-open`).removeClass("menu-open").find("ul").slideUp();
                $menu.addClass("menu-open").children("ul").slideDown();
                this.changeActiveMenu($menu.children("ul").children("li").eq(0));
            }
        } else {
            $(`#${this.guid}  .menu-li-${level}.menu-open`).removeClass("menu-open").find("ul").slideUp();
            let originalPath = $("li.active").data("path"),
                currentPath = $menu.data("path");

            $("li.active").removeClass("active");
            $menu.addClass("active");
            this.currentMenu = currentPath;
            this.onMenuChange(originalPath, currentPath);
        }
    }

    setMenu(path) {
        if ($(`li[data-path="${path}"]`).length == 0) return;
        let $menu = $(`li[data-path="${path}"]`),
            ct = 1,
            parentNode = $menu.parent(),
            parrentClass = parentNode.attr("class").split(" "),
            grandMenu = parentNode.parent(),
            grandClass = grandMenu.attr("class").split(" ");

        while (!parrentClass.includes("menu-ul-1") && !grandClass.includes("menu-open")) {
            parentNode = grandMenu.parent();
            parrentClass = parentNode.attr("class").split(" ");
            grandMenu = parentNode.parent();
            grandClass = grandMenu.attr("class").split(" ");

            ++ct;
            if (ct > 4) break;
        }

        if (grandClass.includes("menu-open")) {
            let level = grandMenu.data("level");
            $(`#${this.guid}  .menu-li-${level}.menu-open`).removeClass("menu-open").find("ul").slideUp();
        } else {
            $(`#${this.guid}  .menu-li-1.menu-open`).removeClass("menu-open").find("ul").slideUp();
        }

        parentNode = $menu.parent();
        while (ct--) {
            parentNode = parentNode.slideDown();
            parentNode.parent().addClass("menu-open");
            parentNode = parentNode.parent().parent();
        }

        $("li.active").removeClass("active");
        $menu.addClass("active");
    }

    getCurrentMenu() {
        return this.currentMenu;
    }

    onMenuChange(before, after) {
        if (this.options.onMenuChange) {
            this.options.onMenuChange(before, after);
        }
    }

    $iterator(menus, depth) {
        ++depth;
        menus.forEach((menu, index) => {
            let hasChildren = menu.children && menu.children.length > 0,
                contentLabel = "div",
                iconClassName = `menu-icon menu-icon-${depth} `,
                liClassName = `menu-li menu-li-${depth}`,
                dataPath = menu.path ? `data-path="${menu.path}"` : "";
            //添加类名
            iconClassName += menu.icon ? `icon-${menu.icon}` : "icon-empty";
            (index == 0 && depth == 1) && (liClassName += " menu-top");
            hasChildren && (liClassName += " menu-parent");

            this.template += `<li class="${liClassName}" ${dataPath} data-level="${depth}" data-guid="${this.guid}">
                                <${contentLabel} class="menu-content menu-content-${depth}" ${menu.path?("href=\"#"+menu.path+"\""):""}>
                                    <i class="${iconClassName}"></i>
                                    ${menu.title}
                                </${contentLabel}>`;
            //如果有子节点，遍历处理
            if (hasChildren) {
                this.template += `<ul class="menu-ul menu-ul-${depth + 1}">`;
                this.$iterator(menu.children, depth);
                this.template += `</ul></li>`;
            } else {
                this.template += `</li>`;
            }
        });
    }

    $getMenuTemplate(menus) {
        this.template = `<ul class="menu-top-wrapper menu-ul menu-ul-1 menu-top" id="${this.guid}">`;
        this.$iterator(menus, 0);
        this.template += "</ul>";
    }
}