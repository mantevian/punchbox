import type Spawner from "./box/spawner";
import { bus } from "./index";
import type Player from "./player";

export default class Game extends HTMLElement {
    keysPressed: { [key: string]: boolean; } = {};
    time = 0;
    health = 500;

    connectedCallback() {
        requestAnimationFrame(() => this.init());
    }

    init() {
        window.addEventListener("keydown", e => {
            this.keysPressed[e.code] = true;
        });

        window.addEventListener("keyup", e => {
            this.keysPressed[e.code] = false;
        });

        window.addEventListener("resize", () => {
            this.resize();
        });

        bus.on("start_game", () => {
            bus.emit("change_scene", "board");
            this.time = -120;
        });

        this.resize();

        this.tick();

        bus.emit("change_scene", "menu");

        setTimeout(() => {
            this.style.display = "block";
        }, 500);
    }

    tick() {
        bus.emit("tick", this.time);

        this.time++;

        this.querySelector("span#game-time")!.innerHTML = `${this.time}`;

        requestAnimationFrame(() => this.tick());
    }

    resize() {
        const scaleX = window.innerWidth / 1000;
        const scaleY = window.innerHeight / 1000;

        const scale = Math.min(scaleX, scaleY);

        this.style.scale = `${scale}`;
    }

    getPlayer(): Player {
        return this.querySelector("pb-player")!;
    }

    getSpawner(): Spawner {
        return this.querySelector("pb-spawner")!;
    }

    getCurrentScene(): string {
        return this.querySelector("pb-scene[enabled]")?.getAttribute("name") ?? "menu";
    }

    addHealth(amount: number) {
        this.health += amount;

        this.querySelector("#factory-health")!.innerHTML = `${this.health}`;
        if (this.health <= 0) {
            console.log("win");
        }
    }
}
