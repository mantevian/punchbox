import { game } from ".";
import type Box from "./box/box";

export default class Lane extends HTMLElement {
    speed = 1;

    connectedCallback() {
        this.addEventListener("click", () => {
            const player = game.getPlayer();

            if (player.hasAttribute("attacking")) {
                return;
            }

            const left = this.offsetLeft + this.offsetWidth * 0.5;

            player.style.left = `${left + 200}px`;
            player.setAttribute("lane", this.getAttribute("n") ?? "1");
            player.attack();
        });
    }

    attack() {
        const next = this.getNextBox();

        if (!next) {
            return;
        }

        next.remove();
    }

    getNextBox(): Box | null {
        return this.firstChild as Box;
    }
}
