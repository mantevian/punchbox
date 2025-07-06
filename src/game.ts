import type Spawner from "./box/spawner";
import { bus } from "./index";
import type Player from "./player";

export default class Game extends HTMLElement {
    keysPressed: { [key: string]: boolean; } = {};
    time = 0;
    health = 500;
    healthAnimation?: number;

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

        bus.on("how_to_play", () => {
            bus.emit("change_scene", "how_to_play");
        });

        bus.on("menu", () => {
            bus.emit("change_scene", "menu");
        });

        this.resize();

        this.tick();

        bus.emit("change_scene", "menu");

        setTimeout(() => {
            this.style.display = "block";
        }, 500);

        this.addHealth(0);
    }

    tick() {
        bus.emit("tick", this.time);

        this.time++;

        this.querySelector("#game-time")!.innerHTML = `${this.time}`;

        setTimeout(() => this.tick(), 1000 / 60);
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

        const factoryHealth = this.querySelector("#factory-health")! as HTMLSpanElement;

        factoryHealth.innerHTML = `${this.health}`;

        factoryHealth.style.animation = "text-hit 0.5s ease";

        clearTimeout(this.healthAnimation);

        this.healthAnimation = setTimeout(() => {
            factoryHealth.style.animation = "";
        }, 500);

        if (this.health <= 0) {
            console.log("win");
        }
    }
}
