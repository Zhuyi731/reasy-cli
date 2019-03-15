import DocPage from "@pages/DocPage";

export default class Page extends DocPage {
    constructor() {
        super(...arguments);
        this.docName = "yapi";
    }
}