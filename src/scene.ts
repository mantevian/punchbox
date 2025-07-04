import { bus } from ".";

export default class Scene extends HTMLElement {
    static observedAttributes = ["name", "enabled"];

    connectedCallback() {
        bus.on("change_scene", e => {
            const name = e.detail;
            if (this.getAttribute("name") == name) {
                this.setAttribute("enabled", "");
            } else {
                this.removeAttribute("enabled");
            }
        });
    }
}
