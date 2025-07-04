import { bus } from "./index";
import type Player from "./player";

export default class Game extends HTMLElement {
    keysPressed: { [key: string]: boolean } = {};
    time = 0;

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

        this.resize();

        this.tick();

        bus.emit("change_scene", "menu");
    }

    tick() {
        bus.emit("tick", this.time);

        this.time++;

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

    getCurrentScene(): string {
        return this.querySelector("pb-scene[enabled]")?.getAttribute("name") ?? "menu";
    }
}
