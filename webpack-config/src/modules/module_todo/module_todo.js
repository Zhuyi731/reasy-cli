import DocPage from "@page/DocPage";

export default class Page extends DocPage {
    constructor() {
        super(...arguments);
        this.docName = "module_todo";
    }
}