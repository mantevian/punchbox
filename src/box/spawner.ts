import { bus, game } from "..";
import type Lane from "../lane";
import { nextInt } from "../util/random";
import WeightedList from "../util/weighted_list";
import type Box from "./box";
import type { LootTableName } from "./loot";

export default class Spawner extends HTMLElement {
    interval = 300;
    bigWave = 0;

    connectedCallback() {
        bus.on("tick", e => {
            if (game.getCurrentScene() != "board") {
                return;
            }

            const time = e.detail;

            if (nextInt(0, this.interval) == 0) {
                this.spawnDefault();
            }

            if (time % this.interval == 0) {
                this.spawnDefault();
            }

            if (time % 600 == 0) {
                this.interval = Math.max(this.interval - 3, 30);
            }

            if (time > 2400 && nextInt(0, 1200) == 0) {
                this.bigWave = nextInt(2, 8);
            }

            if (this.bigWave > 0) {
                if (nextInt(0, this.interval) == 0) {
                    this.spawnDefault();
                    this.bigWave--;
                }
            }

            game.querySelector("span#big-wave")!.innerHTML = `${this.bigWave}`;
        });
    }

    spawn(options: { laneNumber: number, pos: number, health: number; type: LootTableName; }) {
        const lane = this.querySelector(`pb-lane[n="${options.laneNumber}"]`)! as Lane;
        const box = document.createElement("pb-box") as Box;
        box.setAttribute("type", options.type);
        box.health = options.health;
        box.maxHealth = box.health;
        box.pos = options.pos;
        lane.appendChild(box);
    }

    spawnDefault() {
        this.spawn({
            laneNumber: nextInt(0, 5),
            pos: 0,
            health: nextInt(1, 4),
            type: spawnTypes.next()!
        });
    }
}

const spawnTypes = new WeightedList<LootTableName>()
    .add("normal", 5)
    .add("money", 2)
    .add("good", 1)
    .add("bad", 3);
