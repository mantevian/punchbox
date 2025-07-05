import { bus, game } from "..";
import type { CustomEventCallback } from "../util/bus";
import type Lane from "../lane";
import { apply, lootTable, type LootTableName } from "./loot";

export default class Box extends HTMLElement {
    pos = 0;
    health = 1;
    maxHealth = 1;
    speed = 1;
    isDead = -1;
    healthBar: HTMLDivElement | null = null;
    sprite: HTMLImageElement | null = null;
    private tickCallback: CustomEventCallback<"tick"> | null = null;

    connectedCallback() {
        const type = this.getAttribute("type") as LootTableName;

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
                if (type != "explosive") {
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

        this.sprite = document.createElement("img");
        this.sprite.src = `/img/box/${type}.svg`;
        this.appendChild(this.sprite);
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

        this.sprite!.style.animation = "box-hit 0.5s ease";

        setTimeout(() => {
            this.sprite!.style.animation = "";
        }, 500);

        if (this.health <= 0) {
            this.onDeath();
        }
    }

    onDeath() {
        this.isDead = 10;

        let type = this.getAttribute("type") as LootTableName;

        const loot = lootTable[type].next();

        if (loot) {
            apply(loot, this);
        }
    }
}
