import { bus, game } from "..";
import type Lane from "../lane";
import type Box from "./box";

export default class Spawner extends HTMLElement {
    connectedCallback() {
        bus.on("tick", e => {
            if (game.getCurrentScene() != "board") {
                return;
            }

            const time = e.detail;

            if (time % 180 != 0) {
                return;
            }

            const laneNumber = Math.floor(Math.random() * 5);
            const lane = this.querySelector(`pb-lane[n="${laneNumber}"]`)! as Lane;
            const box = document.createElement("pb-box") as Box;
            lane.appendChild(box);
            
        });
    }

    spawn() {

    }
}
