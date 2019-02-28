import "./module1_2.scss";
import PureDisplayPage from "@assets/baseClass/PureDisplayPage";

export default class Page extends PureDisplayPage {
    constructor() {
        super(...arguments);
        this.getUrl = "/mock/xxx";
    }

    init() {
        this.initComponent();
    }

    initComponent() {
        this.components.lanStatus = $(".component-wrap").FormList({
            dataField: "lanStatus",
            css: "formlist-wrap",
            dataObj: { lanStatus: {} },
            titleObj: [{
                field: "lanStatus",
                title: _("LAN口状态"),
                items: [{
                    field: "lanIp",
                    title: _("LAN口IP")
                }, {
                    field: "lanMask",
                    title: _("子网掩码")
                }, {
                    field: "lanGateway",
                    title: _("网关:")
                }, {
                    field: "dns1",
                    title: _("主DNS:")
                }, {
                    field: "dns2",
                    title: _("备用DNS:")
                }]
            }]
        });
    }

    dataLoaded(data) {
        this.components.lanStatus.reLoad(data);
        this.refresh([{
            url: this.getUrl,
            reloadFunction: this.components.lanStatus.reLoad
        }], 5000, [$("component-wrap")]);
    }
}