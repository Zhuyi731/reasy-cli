export default class BasePage {
    constructor() {
        this.pageName = "";
        this.pageDescription = "";
    }

    onPageEnter() {
        this.beforeInit();
        this.init();
        this.initEvent();
        this.initComponent();
    }

    onPageLeave() {
        this.destory();
    }

    //hooks below
    beforeInit() {

    }

    init() {

    }

    initEvent() {

    }

    initComponent() {

    }

    destory() {

    }
}