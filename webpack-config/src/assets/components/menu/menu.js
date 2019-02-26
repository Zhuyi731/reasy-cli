import BaseComponent from "@components/BaseComponent";
import $ from "jquery";
import "./menu.scss";

export default class Menu extends BaseComponent {
    constructor(element, options) {
        super(...arguments);
    }

    creat() {
        let options = this.options;

        this.$getMenuTemplate(options.menus);

        this.$element.append($(this.template));
        let that = this;
        this.$element.on("click", "li", function(e) {
            e.stopPropagation();
            that.changeActiveMenu.call(this);
        });
    }

    changeActiveMenu() {
        let $this = $(this),
            className = $this.attr("class"),
            isParentNode = /menu-parent/.test(className),
            isOpen = /open/.test(className),
            isActive = /active/.test(className),
            menuLevel = $this.data("level"),
            originalOpenMenu = $(`.menu-li-${menuLevel}.open`),
            originalActiveMenu = $(`.menu-li-${menuLevel}.active`);


        //如果原来就有一个开启的菜单，则需要遍历将菜单下的子菜单收缩
        if (originalOpenMenu.length > 0) {
            originalOpenMenu.find(".menu-li").children(".menu-ul").slideUp();
            originalOpenMenu.children(".menu-ul").slideUp();
            originalOpenMenu.removeClass("open");
        }

        if (originalActiveMenu.length > 0) {
            originalActiveMenu.removeClass("active");
        }

        $(`.menu-li`).removeClass("active");
        //如果是母节点
        //需要展开，然后将其与同级节点关闭
        if (isParentNode) {
            if (isOpen) {
                $this.removeClass("open");
                $this.children(".menu-ul").slideUp();
            } else {
                $this.addClass("open");
                $this.children(".menu-ul").slideDown();
            }
        } else {
            if (!isActive) {
                $this.addClass("active");
            }
        }

    }

    $iterator(menus, depth) {
        ++depth;
        menus.forEach((menu, index) => {
            let hasChildren = menu.children && menu.children.length > 0,
                contentLabel = menu.path ? "a" : "div",
                iconClassName = `menu-icon menu-icon-${depth} `,
                liClassName = `menu-li menu-li-${depth}`;
            //添加类名
            iconClassName += menu.icon ? `icon-${menu.icon}` : "icon-empty";
            (index == 0 && depth == 1) && (liClassName += " menu-top");
            hasChildren && (liClassName += " menu-parent");

            this.template += `<li class="${liClassName}" data-level="${depth}">
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
        this.template = `<ul class="menu-top-wrapper menu-ul menu-ul-1 menu-top">`;
        this.$iterator(menus, 0);
        this.template += "</ul>";
    }
}