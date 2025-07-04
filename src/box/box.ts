import { bus } from "..";
import type { CustomEventCallback } from "../bus";
import type Lane from "../lane";

export default class Box extends HTMLElement {
    private pos = 0;
    private tickCallback: CustomEventCallback<"tick"> | null = null;
    
    connectedCallback() {
        this.tickCallback = bus.on("tick", () => {
            this.pos += this.getLane().speed;

            this.style.marginTop = `${this.pos}px`;

            if (this.pos > this.getLane().offsetHeight) {
                this.remove();
            }
        });
    }

    disconnectedCallback() {
        bus.off("tick", this.tickCallback!);
    }

    getLane(): Lane {
        return this.parentElement as Lane;
    }
}
