
import "./module1_1.scss";
import BasePage from "@assets/baseClass/BasePage";

export default class Page extends BasePage {
    constructor() {
        super(...arguments);
        this.name = "基础页面展示";
        //b28n-no-translate-next-line
        this.description = "基础页面生命周期展示";
        this.timer = {};
    }

    init() {
        let timer1Ct = 0,
            timer2Ct = 100;

        this.timer.timer1 = setInterval(() => {
            $(".timer1").text(`timer1:${++timer1Ct}s`);
            console.log(`timer1:${timer1Ct}s`);
        }, 1000);
        
        this.timer.timer2 = setInterval(() => {
            $(".timer2").text(`timer2:${++timer2Ct}s`);
            console.log(`timer2:${timer2Ct}s`);
        }, 1000);
    }
}