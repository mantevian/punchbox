import { bus } from "..";
import type { CustomEventCallback } from "../util/bus";
import type Lane from "../lane";
import { apply, lootTable, type LootTableName } from "./loot";

export default class Box extends HTMLElement {
    pos = 0;
    health = 1;
    maxHealth = 1;
    healthBar: HTMLDivElement | null = null;
    private tickCallback: CustomEventCallback<"tick"> | null = null;

    connectedCallback() {
        this.tickCallback = bus.on("tick", () => {
            this.pos += this.getLane().speed;

            this.style.top = `${this.pos}px`;

            if (this.pos > 730) {
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
        }
    }

    onDeath() {
        let type = this.getAttribute("type") as LootTableName;

        const loot = lootTable[type].next();

        if (loot) {
            apply(loot, this);
        }

        this.remove();
    }
}
