import { bus, game } from ".";
import type Box from "./box/box";

export default class Lane extends HTMLElement {
    speed = 1.5;
    attacking = false;

    connectedCallback() {
        this.style.animationDuration = `${13 / this.speed}s`;

        this.addEventListener("mousedown", () => {
            this.attacking = true;
        });

        document.addEventListener("mouseup", () => {
            this.attacking = false;
        });

        this.addEventListener("touchstart", () => {
            this.attacking = true;
        });

        document.addEventListener("touchend", () => {
            this.attacking = false;
        });

        bus.on("tick", () => {
            if (!this.attacking) {
                return;
            }

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

    attack(): boolean {
        const next = this.getClosestBox();

        if (!next) {
            return false;
        }

        if (next.pos < 30) {
            return false;
        }

        next.addHealth(-1);

        return true;
    }

    getBoxes(): Box[] {
        const boxes = [...this.querySelectorAll("pb-box")] as Box[];
        return boxes.sort((a, b) => b.pos - a.pos);
    }

    getClosestBox(): Box | null {
        return this.getBoxes()[0];
    }

    addSpeed(amount: number, bypass?: boolean) {
        this.speed = Math.max(this.speed + amount, bypass ? 0 : 1);
        this.style.animationDuration = `${13 / this.speed}s`;
    }

    getNumber(): number {
        return parseInt(this.getAttribute("n")!);
    }

    canSpawn(): boolean {
        const hasCloseBoxes = this.getBoxes().find(box => box.pos < 200);
        return !hasCloseBoxes;
    }
}
