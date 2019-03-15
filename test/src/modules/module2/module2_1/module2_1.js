import BasePage from "@pages/DocPage";

export default class Page extends BasePage {
    constructor() {
        super(...arguments);
        this.docName = "basic_router";
    }
}