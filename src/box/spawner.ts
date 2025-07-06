import { bus, game } from "..";
import type Lane from "../lane";
import { nextInt } from "../util/random";
import WeightedList from "../util/weighted_list";
import { boxTypes, type BoxType } from "./box";
import type Box from "./box";

export default class Spawner extends HTMLElement {
    interval = 240;
    bigWave = 0;
    bigWaveType: BoxType = "normal";

    connectedCallback() {
        bus.on("tick", e => {
            if (game.getCurrentScene() != "board") {
                return;
            }

            const time = e.detail;

            if (time % this.interval == 0) {
                this.spawnDefault();
                console.log("[SPAWN] default interval");
            }

            if (time > (60 * 60) && nextInt(0, this.interval) == 0) {
                this.spawnDefault();
                console.log("[SPAWN] default chance");
            }

            if (time % (60 * 4) == 0) {
                this.interval = Math.max(this.interval - 1, 30);
                console.log(`new interval: ${this.interval}`);
            }

            if (time > (60 * 60) && nextInt(0, this.interval * 5) == 0) {
                this.bigWave = nextInt(2, 6);
                this.bigWaveType = spawnTypesUniform.next()!;
                console.log(`big wave started: ${this.bigWave} of ${this.bigWaveType}`);
            }

            if (this.bigWave > 0) {
                if (nextInt(0, this.interval / 2) == 0) {
                    this.spawnDefaultType(this.bigWaveType);
                    this.bigWave--;
                    console.log(`[SPAWN] big wave`);
                }
            }

            game.querySelector("#big-wave")!.innerHTML = `${this.bigWave}`;
        });
    }

    spawn(options: { laneNumber: number, pos: number, health: number; type: BoxType; speed: number; }) {
        const lane = this.querySelector(`pb-lane[n="${options.laneNumber}"]`)! as Lane;
        const box = document.createElement("pb-box") as Box;
        box.setAttribute("type", options.type);
        box.health = options.health;
        box.maxHealth = box.health;
        box.pos = options.pos;
        box.speed = options.speed;
        lane.prepend(box);
    }

    spawnDefault() {
        let laneNumber: number;
        let attempts = 20;

        while (true) {
            if (attempts <= 0) {
                return;
            }

            laneNumber = nextInt(0, 5);
            if (this.getLanes()[laneNumber].canSpawn()) {
                break;
            }

            attempts--;
        }

        this.spawnFromTypes({
            types: spawnTypes,
            laneNumber,
            pos: 0
        });
    }

    spawnDefaultType(type: BoxType) {
        let laneNumber: number;
        let attempts = 20;

        do {
            laneNumber = nextInt(0, 5);
            attempts--;
        } while (attempts > 0 && !this.getLanes()[laneNumber].canSpawn());

        this.spawnFromTypes({
            types: new WeightedList<BoxType>().add(type, 1),
            laneNumber,
            pos: 0
        });
    }

    spawnFromTypes(options: { types: WeightedList<BoxType>; laneNumber: number; pos: number; addHealth?: number; addSpeed?: number; }) {
        const type = options.types.next()!;

        this.spawn({
            laneNumber: options.laneNumber,
            type,
            pos: options.pos,
            health: boxTypes[type].health + (options.addHealth ?? 0),
            speed: 1 + (options.addSpeed ?? 0)
        });
    }

    getLanes(): Lane[] {
        return [...this.querySelectorAll("pb-lane")] as Lane[];
    }
}

export const spawnTypes = new WeightedList<BoxType>()
    .add("normal", 10)
    .add("money", 3)
    .add("good", 2)
    .add("explosive", 3)
    .add("skull", 4)
    .add("mystery", 1);

export const spawnTypesUniform = new WeightedList<BoxType>()
    .add("normal", 1)
    .add("money", 1)
    .add("good", 1)
    .add("explosive", 1)
    .add("mini", 1)
    .add("skull", 1)
    .add("mystery", 1);
