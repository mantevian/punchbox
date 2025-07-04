import { bus } from ".";

export default class PBEventElement extends HTMLElement {
    connectedCallback() {
        this.parentElement!.addEventListener(this.getAttribute("on") ?? "click", () => {
            bus.emit(this.getAttribute("name") as keyof PBEventMap, this.getAttribute("data") ?? "");
        });
    }
}
