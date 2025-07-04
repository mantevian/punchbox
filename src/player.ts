import { game } from ".";
import type Lane from "./lane";

export default class Player extends HTMLElement {
    connectedCallback() {
        
    }

    attack() {
        this.setAttribute("attacking", "");

        const lane = this.getLane();
        
        const boxPos = lane.getNextBox()?.offsetTop ?? 300;
        const height = 600 - boxPos;
        
        const glove: HTMLDivElement = this.querySelector("div.glove")!;
        glove.style.height = `${height}px`;
        
        setTimeout(() => {
            lane.attack();
        }, 100);

        setTimeout(() => {
            glove.style.height = `0px`;
        }, 400);

        setTimeout(() => {
            this.removeAttribute("attacking");
        }, 500);
    }

    getLane(): Lane {
        return game.querySelector(`pb-lane[n="${this.getAttribute("lane")}"]`) as Lane;
    }
}
