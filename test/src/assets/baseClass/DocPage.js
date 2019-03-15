import "@assets/scss/doc.scss";
import BasePage from "./BasePage";
import { markdown } from "markdown";
/**
 * 专门用与写文档的page
 */

export default class DocPage extends BasePage {
    constructor() {
        super(...arguments);
    }

    init() {
        $.get(`/markdown/${this.docName}.md`, this.renderDoc);
    }

    renderDoc(md) {
        $(".markdown").append(markdown.toHTML(md));
    }
}