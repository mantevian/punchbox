import { game } from ".";
import type Lane from "./lane";

export default class Player extends HTMLElement {
    speed = 750;
    health = 20;
    money = 0;
    upgradeCost = 10;

    healthAnimation?: number;
    moneyAnimation?: number;

    connectedCallback() {
        this.displayStats();

        game.querySelector("button#upgrade-attack-speed")!.addEventListener("click", () => {
            if (this.money >= this.upgradeCost) {
                this.addMoney(-this.upgradeCost);
                this.upgradeCost += 1;
                this.multiplySpeed(0.945);
            }
        });
    }

    attack() {
        this.setAttribute("attacking", "");

        const lane = this.getLane();

        const boxPos = lane.getClosestBox()?.pos ?? -100;
        const height = 680 - boxPos;

        const glove: HTMLDivElement = this.querySelector("div.glove")!;
        glove.style.height = `${height}px`;

        const spring: HTMLDivElement = this.querySelector("div.spring")!;
        spring.style.scale = `1 ${(height - 100) / 800}`;

        setTimeout(() => {
            if (!lane.attack()) {
                game.addHealth(-1);
            }
        }, 100);

        setTimeout(() => {
            glove.style.height = `0px`;
            spring.style.scale = `1 0`;
        }, Math.min(this.speed - 100, 400));

        setTimeout(() => {
            this.removeAttribute("attacking");
        }, this.speed);
    }

    getLane(): Lane {
        return game.querySelector(`pb-lane[n="${this.getAttribute("lane")}"]`) as Lane;
    }

    addHealth(amount: number) {
        this.health += amount;

        if (this.health <= 0) {
            console.log("ded");
        }

        const healthDisplay = game.querySelector<HTMLElement>("#health")!;
        healthDisplay.style.animation = "text-hit 0.5s ease";

        clearTimeout(this.healthAnimation);

        this.healthAnimation = setTimeout(() => {
            healthDisplay.style.animation = "";
        }, 500);

        this.displayStats();
    }

    addSpeed(amount: number) {
        this.speed = Math.max(this.speed + amount, 0);

        if (this.speed <= 200) {
            const button = game.querySelector<HTMLButtonElement>("button#upgrade-attack-speed")!;
            button.disabled = true;
            button.innerHTML = `MAX`;
        }

        this.displayStats();
    }

    multiplySpeed(factor: number) {
        this.speed = Math.max(Math.floor(this.speed * factor), 1);

        if (this.speed <= 200) {
            const button = game.querySelector<HTMLButtonElement>("button#upgrade-attack-speed")!;
            button.disabled = true;
            button.innerHTML = `MAX`;
        }

        this.displayStats();
    }

    addMoney(amount: number) {
        this.money = Math.max(this.money + amount, 0);
        this.displayStats();

        const moneyDisplay = game.querySelector<HTMLElement>("#money")!;
        moneyDisplay.style.animation = "text-hit 0.5s ease";

        clearTimeout(this.moneyAnimation);

        this.moneyAnimation = setTimeout(() => {
            moneyDisplay.style.animation = "";
        }, 500);
    }

    displayStats() {
        game.querySelector("#money")!.innerHTML = `${this.money}`;
        game.querySelector("#attack-speed")!.innerHTML = `${this.speed}`;
        game.querySelector("#health")!.innerHTML = `${this.health}`;
        game.querySelector("#upgrade-attack-speed > span")!.innerHTML = `${this.upgradeCost}`;
    }
}
