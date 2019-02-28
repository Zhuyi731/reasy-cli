import BasePage from "@assets/baseClass/BasePage";
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';

export default class Page extends BasePage {
    constructor() {
        super(...arguments);
    }

    init() {
        hljs.registerLanguage('javascript', javascript);
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }

}