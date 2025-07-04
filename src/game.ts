import { bus } from "./index";

export default class Game extends HTMLElement {
    keysPressed: { [key: string]: boolean } = {};
    time = 0;

    connectedCallback() {
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
}
