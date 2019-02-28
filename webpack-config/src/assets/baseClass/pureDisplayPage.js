import BasePage from "./BasePage";

export default class PureDisplayPage extends BasePage {
    constructor() {
        super(...arguments);
        this.refresh = this.refresh.bind(this);
    }

    /**
     * 刷新函数
     * @param {*刷新配置} refreshSetting 
     * @param {*刷新间隔} timeout 
     * @param {*刷新时需要隐藏的元素} showHideElement 
     */
    refresh(refreshSetting, timeout, showHideElement = null) {
        this.timer.refreshTimer = setTimeout(() => {
            Promise.all(refreshSetting.map(setting => {
                    return this.post(setting.url);
                }))
                .then(datas => {
                    if (showHideElement) {
                        this.$showHideElements(showHideElement, "hide");
                    }
                    datas.forEach((data, index) => {
                        refreshSetting[index].reloadFunction(data);
                    });
                    this.$showHideElements(showHideElement, "show");
                })
                .then(() => {
                    setTimeout(() => {
                        this.refresh(...arguments);
                    }, timeout);
                })
                .catch(err => {
                    clearTimeout(this.timer.refreshTimer);
                    throw err;
                });
        }, timeout);
    }

    /**
     * 显示隐藏元素的函数，加入$前缀不给外部调用
     * @param {*} elements 
     * @param {*} type 
     */
    $showHideElements(elements, type) {
        this.differentTypeSolution(elements, el => {
            el.css("visibility", type == "hide" ? "hidden" : "visible");
        });
    }
}