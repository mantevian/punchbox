import { bus, game } from "..";
import type { CustomEventCallback } from "../util/bus";
import type Lane from "../lane";
import { apply, lootTable } from "./loot";

export default class Box extends HTMLElement {
    pos = 0;
    health = 1;
    maxHealth = 1;
    speed = 1;
    isDead = -1;
    healthBar: HTMLDivElement | null = null;
    private tickCallback: CustomEventCallback<"tick"> | null = null;

    connectedCallback() {
        const type = this.getAttribute("type") as BoxType;

        this.tickCallback = bus.on("tick", () => {
            this.pos += this.getLane().speed * this.speed;

            this.style.top = `${this.pos}px`;

            if (this.pos > 700) {
                this.style.scale = `${(730 - this.pos) / 30}`;
            }
            else if (this.pos < 30) {
                this.style.scale = `${this.pos / 30}`;
            }
            else {
                this.style.scale = `1`;
            }

            if (this.pos > 730) {
                if (type != "skull" && type != "explosive") {
                    game.getPlayer().addHealth(-1);
                }

                this.remove();
            }

            if (this.isDead > 0) {
                this.style.scale = `${this.isDead / 10}`;
                this.isDead--;
            }

            if (this.isDead == 0) {
                this.remove();
            }
        });

        this.healthBar = document.createElement("div");
        this.appendChild(this.healthBar);
    }

    disconnectedCallback() {
        bus.off("tick", this.tickCallback!);
    }

    getLane(): Lane {
        return this.parentElement as Lane;
    }

    addHealth(amount: number) {
        this.health += amount;

        this.healthBar!.style.backgroundSize = `${(this.health / this.maxHealth) * 100}% 100%, 100% 100%`;

        if (this.health <= 0) {
            this.onDeath();
        } else {
            this.style.animation = "box-hit 0.5s ease";

            setTimeout(() => {
                this.style.animation = "";
            }, 500);
        }
    }

    onDeath() {
        this.isDead = 10;

        let type = this.getAttribute("type") as BoxType;

        const loot = lootTable[type].next();

        if (loot) {
            apply(loot, this);
        }

        game.getPlayer().boxesDestroyed += 1;
    }
}

export type BoxType = "normal" | "good" | "explosive" | "money" | "mini" | "skull" | "mystery";

export type BoxStats = {
    health: number;
};

export const boxTypes: { [key in BoxType]: BoxStats } = {
    normal: {
        health: 1,
    },
    good: {
        health: 2,
    },
    explosive: {
        health: 2,
    },
    money: {
        health: 2,
    },
    mini: {
        health: 1,
    },
    skull: {
        health: 1,
    },
    mystery: {
        health: 1,
    },
};
