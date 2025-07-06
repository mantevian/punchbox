import type Spawner from "./box/spawner";
import { bus } from "./index";
import type Player from "./player";
import type Scene from "./scene";
import GameAudio from "./util/audio";
import { nextInt } from "./util/random";
import { formatTicks } from "./util/util";

export default class Game extends HTMLElement {
    keysPressed: { [key: string]: boolean; } = {};
    time = 0;
    health = 500;
    healthAnimation?: number;
    ticking: boolean = false;

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
            this.ticking = true;
        });

        bus.on("how_to_play", () => {
            bus.emit("change_scene", "how_to_play");
        });

        bus.on("menu", () => {
            bus.emit("change_scene", "menu");
        });

        bus.on("win", () => {
            const interval = setInterval(() => {
                for (let i = 0; i < 10; i++) {
                    this.getSpawner().getLanes()[nextInt(0, 5)].addSpeed(-0.05, true);
                }
            }, 20);

            this.getScene("final")!.querySelector("h1")!.innerHTML = `You destroyed the factory!`;
            this.getScene("final")!.setAttribute("status", "win");
            this.querySelector("#total-money-collected")!.innerHTML = `${this.getPlayer().totalMoneyCollected}`;
            this.querySelector("#boxes-destroyed")!.innerHTML = `${this.getPlayer().boxesDestroyed}`;
            this.querySelector("#time-played")!.innerHTML = formatTicks(this.time);

            setTimeout(() => {
                clearInterval(interval);
                this.ticking = false;

                bus.emit("change_scene", "final");
            }, 3000);
        });

        bus.on("lose", () => {
            setTimeout(() => {
                this.ticking = false;

                bus.emit("change_scene", "final");
                this.getScene("final")!.querySelector("h1")!.innerHTML = `You couldn't destroy the factory...`;
                this.getScene("final")!.setAttribute("status", "lose");
                this.querySelector("#total-money-collected")!.innerHTML = `${this.getPlayer().totalMoneyCollected}`;
                this.querySelector("#boxes-destroyed")!.innerHTML = `${this.getPlayer().boxesDestroyed}`;
                this.querySelector("#time-played")!.innerHTML = formatTicks(this.time);
            }, 1500);
        });

        bus.on("refresh", () => {
            location.reload();
        });

        document.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                GameAudio.click();
            });
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
        if (this.ticking) {
            bus.emit("tick", this.time);

            this.time++;

            this.querySelector("#game-time")!.innerHTML = `${this.time}`;
        }

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

    getScene(name: string): Scene | null {
        return this.querySelector(`pb-scene[name="${name}"]`);
    }

    addHealth(amount: number) {
        this.health = Math.max(this.health + amount, 0);

        const factoryHealth = this.querySelector("#factory-health")! as HTMLSpanElement;

        factoryHealth.innerHTML = `${this.health}`;

        factoryHealth.style.animation = "text-hit 0.5s ease";

        clearTimeout(this.healthAnimation);

        this.healthAnimation = setTimeout(() => {
            factoryHealth.style.animation = "";
        }, 500);

        if (this.health <= 0) {
            bus.emit("win", void {});

            const explosion = document.createElement("div");
            explosion.classList.add("explosion");
            explosion.style.top = `100px`;
            explosion.style.left = `500px`;
            explosion.style.rotate = `${Math.random() * Math.PI * 2}rad`;
            this.getScene(this.getCurrentScene())!.appendChild(explosion);

            requestAnimationFrame(() => {
                explosion.style.scale = `20`;
                explosion.style.backgroundSize = `4%`;
                explosion.style.opacity = `0`;
            });

            setTimeout(() => {
                explosion.remove();
            }, 1000);

            GameAudio.explosion();
            GameAudio.explosion();
        }
    }
}
