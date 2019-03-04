
import "./loading.scss";

export default class Loading {
    constructor() {

    }

    addLoading({ element, content = "" }) {
        $(element).attr("data-content", content).addClass("loading");
    }

    removeLoading({ element }) {
        $(element).removeAttr("data-content").removeClass("loading");
    }
}