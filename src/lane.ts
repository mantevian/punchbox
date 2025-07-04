import { game } from ".";
import type Box from "./box/box";

export default class Lane extends HTMLElement {
    speed = 1.5;

    connectedCallback() {
        this.style.animationDuration = `${13 / this.speed}s`;

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

        next.addHealth(-1);
    }

    getNextBox(): Box | null {
        return this.firstChild as Box;
    }

    addSpeed(amount: number) {
        this.speed = Math.max(this.speed + amount, 0.5);
        this.style.animationDuration = `${13 / this.speed}s`;
    }
}
