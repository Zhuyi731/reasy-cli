import BasePage from "@assets/baseClass/BasePage";
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';

export default class Page extends BasePage {
    constructor() {
        super(...arguments);
    }

    init() {
        try {  //IE下不支持highlightjs渲染
            hljs.registerLanguage('javascript', javascript);
            hljs.highlightBlock($('pre code')[0]);
        }catch(e){}
    }

}