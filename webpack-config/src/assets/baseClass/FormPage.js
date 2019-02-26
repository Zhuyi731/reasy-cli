import BasePage from "./BasePage";
import $ from "jquery";

export default class FormPage extends BasePage {
    constructor() {
        super(...arguments);
    }

    onDataBack = res => {
        this.dataLoaded(!!res ? res[0] : "");
        this.$bindSubmitEvent();
    }

    $bindSubmitEvent() {
        if (this.componentManager) {
            this.componentManager.option.beforeSubmit = this.$beforeSubmit;
            this.componentManager.option.afterSubmit = this.$afterSubmit;
        }
    }

    $beforeSubmit = data => {
        return this.beforeSubmit(data);
    }

    beforeSubmit() {

    }

    $afterSubmit = res => {
        //如果输出false ,中断后续操作
        if (this.afterSubmit(res) === false) {
            return;
        }

        res = this.parseData(res);
        if (res.errCode === "0") {
            $.formMessage("保存成功");
        } else {
            $.formMessage("保存失败");
        }
    }

    afterSubmit() {

    }
}