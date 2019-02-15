import BaseComponent from "@components/BaseComponent";
import $ from "jquery";

export default class Menu extends BaseComponent {
    constructor(element, options) {
        super(...arguments);
    }

    init() {

    }

    creat() {
        let options = this.options;

        this.$getMenuTemplate(options.menus);

        this.$element.append($(this.template));
    }

    $iterator(menus, depth) {
        ++depth;
        menus.forEach(menu => {
            this.template += `<li class="menu-li menu-li-${depth} menu-parent">
                                <div class="menu-content">
                                    ${menu.icon?'<i class="menu-icon menu-icon-'+ depth + ' icon-' + menu.icon + '"></i>':""}
                                    <a href="#${menu.path}" >${menu.title}</a>
                                </div>`;

            if (menu.children && menu.children.length > 0) {
                this.template += `<ul class="menu-ul menu-ul-${depth+1}">`;
                this.$iterator(menu.children, depth);
                this.template += `</ul></li>`;
            } else {
                this.template += `</li>`;
            }
        });
    }

    $getMenuTemplate(menus) {
        this.template = `<ul class="menu-ul menu-ul-1">`;
        this.$iterator(menus, 0);
        this.template += "</ul>";
    }
}