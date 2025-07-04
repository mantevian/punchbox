import { game } from ".";
import type Lane from "./lane";

export default class Player extends HTMLElement {
    speed = 500;
    health = 20;
    money = 0;

    connectedCallback() {
        this.displayStats();
    }

    attack() {
        this.setAttribute("attacking", "");

        const lane = this.getLane();

        const boxPos = lane.getNextBox()?.pos ?? 300;
        const height = 700 - boxPos;

        const glove: HTMLDivElement = this.querySelector("div.glove")!;
        glove.style.height = `${height}px`;

        setTimeout(() => {
            lane.attack();
        }, 100);

        setTimeout(() => {
            glove.style.height = `0px`;
        }, this.speed - 100);

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

        this.displayStats();
    }

    addSpeed(amount: number) {
        this.speed = Math.max(this.speed + amount, 200);
        this.displayStats();
    }

    addMoney(amount: number) {
        this.money = Math.max(this.money + amount, 1);
        this.displayStats();
    }

    displayStats() {
        game.querySelector("span#money")!.innerHTML = `${this.money}`;
        game.querySelector("span#attack-speed")!.innerHTML = `${this.speed}`;
        game.querySelector("span#health")!.innerHTML = `${this.health}`;
    }
}
