import FormPage from "@assets/baseClass/FormPage";
import checkIsVoidIpMask from "@utils/checkIsVoildIpMask";
import checkIPInSameSegment from "@utils/checkIPInSameSegment";
import "@components/formComponents/BaseComponent";
import "@components/formComponents/FormInput";
import "@components/formComponents/FormSelect";
import "@components/formComponents/ComponentManage";

export default class Page extends FormPage {
    constructor() {
        super(...arguments);
        this.getUrl = "/mock/xxx3";
    }

    init() {
        this.initComponent();
    }

    dataLoaded(data) {
        this.componentManager.updateComponents(data);
    }

    beforeSubmit(data) {
        if (data.lanType == "static") {
            let ipCheck = checkIsVoidIpMask(data.lanIp, data.lanMask, _("IP地址"));
            if (ipCheck) {
                $.formMessage(ipCheck);
                return false;
            }

            let gwCheck = checkIsVoidIpMask(data.lanGw, data.lanMask, _("网关"));
            if (gwCheck) {
                $.formMessage(gwCheck);
                return false;
            }

            if (!checkIPInSameSegment(data.lanIp, data.lanMask, data.lanGw, data.lanMask)) {
                $.formMessage("IP同网关应该在同一网段");
                return false;
            }
        }
        return data;
    }

    afterSubmit(res) {
        console.log(res);

    }

    initComponent() {
        this.componentManager = $.componentManager({
            container: "#cmp-manager",
            showSubmitBar: true,
            submitUrl: "/mock/submitForm",
            formCfg: {
                lanType: {
                    dataTitle: _("IP 类型"),
                    selectArray: {
                        dhcp: _("DHCP"),
                        static: _("静态IP")
                    },
                    changeCallBack: () => {
                        let cmp = this.componentManager,
                            isDhcp = cmp.getComponent("lanType").getValue() === "dhcp";

                        ["lanIp", "lanMask", "lanGw", "preDns", "altDns"].forEach(el => {
                            cmp.getComponent(el).setEditable(isDhcp ? false : true);
                        });
                    }
                },
                lanIp: {
                    dataTitle: _("IP地址"),
                    dataOptions: [{ type: "ip.all" }]
                },
                lanMask: {
                    dataTitle: _("子网掩码"),
                    dataOptions: [{ type: "lanMask" }]
                },
                lanGw: {
                    dataTitle: _("网关"),
                    dataOptions: [{ type: "ip.all" }]
                },
                preDns: {
                    dataTitle: _("首选DNS"),
                    dataOptions: [{ type: "lanDns.all" }]
                },
                altDns: {
                    dataTitle: _("备用DNS"),
                    dataOptions: [{ type: "lanDns.all" }]
                },
                deviceName: {
                    dataTitle: _("设备名称"),
                    dataOptions: [{ type: "ssid" }]
                }
            }
        });
    }
}