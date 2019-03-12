import BasePage from "@assets/baseClass/DocPage";

export default class Page extends BasePage {
    constructor() {
        super(...arguments);
        this.docName = "basic_router";
    }
}