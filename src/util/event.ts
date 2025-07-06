import { bus } from "..";

export default class PBEventElement extends HTMLElement {
    connectedCallback() {
        this.parentElement!.addEventListener(this.getAttribute("on") ?? "click", () => {
            bus.emit(this.getAttribute("name") as keyof PBEventMap, this.getAttribute("data") ?? "");
        });
    }
}

declare global {
    interface PBEventMap {
        "tick": number;
        "change_scene": string;
        "start_game": void;
        "how_to_play": void;
        "menu": void;
        "win": void;
        "lose": void;
        "refresh": void;
    }
}
