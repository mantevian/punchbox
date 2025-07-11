import { game } from "..";
import GameAudio from "../util/audio";
import { nextInt } from "../util/random";
import WeightedList from "../util/weighted_list";
import type Box from "./box";
import { spawnTypesUniform } from "./spawner";

export type Loot =
    { type: "player_health_increase"; amount: () => number; } |
    { type: "spawn_mini_box"; } |
    { type: "spawn_random_box"; } |
    { type: "lane_speed_increase"; } |
    { type: "lane_speed_decrease"; } |
    { type: "explode"; } |
    { type: "coin"; amount: () => number; } |
    { type: "damage_player"; amount: () => number; };

export const lootTable = {
    normal: new WeightedList<Loot>()
        .add({ type: "lane_speed_increase" }, 1)
        .add({ type: "spawn_mini_box" }, 2)
        .add({ type: "coin", amount: () => 1 }, 3),

    good: new WeightedList<Loot>()
        .add({ type: "player_health_increase", amount: () => nextInt(1, 4) }, 1)
        .add({ type: "lane_speed_decrease" }, 1)
        .add({ type: "coin", amount: () => 1 }, 1),

    explosive: new WeightedList<Loot>()
        .add({ type: "explode" }, 1),

    money: new WeightedList<Loot>()
        .add({ type: "coin", amount: () => nextInt(1, 5) }, 1),

    mini: new WeightedList<Loot>()
        .add({ type: "coin", amount: () => 1 }, 1),

    skull: new WeightedList<Loot>()
        .add({ type: "damage_player", amount: () => 1 }, 1),

    mystery: new WeightedList<Loot>()
        .add({ type: "spawn_random_box" }, 1)
};

export function apply(loot: Loot, box: Box) {
    const player = game.getPlayer();
    const lane = box.getLane();

    let amount: number;

    console.log(loot.type);

    switch (loot.type) {
        case "player_health_increase":
            amount = loot.amount();
            player.addHealth(amount);

            for (let i = 0; i < amount; i++) {
                const heart = document.createElement("div");
                heart.classList.add("heart");
                heart.style.top = `${box.pos}px`;
                heart.style.left = `${lane.getNumber() * 125 + 50}px`;
                game.getSpawner().appendChild(heart);

                requestAnimationFrame(() => {
                    heart.style.scale = `1`;
                });

                if (amount > 1) {
                    setTimeout(() => {
                        heart.style.top = `${box.pos + nextInt(-100, 100)}px`;
                        heart.style.left = `${lane.getNumber() * 125 + 50 + nextInt(-100, 100)}px`;
                    }, 100);
                }

                setTimeout(() => {
                    heart.style.top = `calc(50% - 25px)`;
                    heart.style.left = `calc(-85px)`;
                }, 400);

                setTimeout(() => {
                    heart.style.scale = `0`;
                }, 1200);

                setTimeout(() => {
                    heart.remove();
                }, 2000);
            }
            break;

        case "lane_speed_increase":
            lane.addSpeed(0.25);
            break;

        case "lane_speed_decrease":
            lane.addSpeed(-0.25);
            break;

        case "coin":
            amount = loot.amount();
            player.addMoney(amount);

            for (let i = 0; i < amount; i++) {
                const coin = document.createElement("div");
                coin.classList.add("coin");
                coin.style.top = `${box.pos}px`;
                coin.style.left = `${lane.getNumber() * 125 + 50}px`;
                game.getSpawner().appendChild(coin);

                requestAnimationFrame(() => {
                    coin.style.scale = `1`;
                });

                if (amount > 1) {
                    setTimeout(() => {
                        coin.style.top = `${box.pos + nextInt(-100, 100)}px`;
                        coin.style.left = `${lane.getNumber() * 125 + 50 + nextInt(-100, 100)}px`;
                    }, 100);
                }

                setTimeout(() => {
                    coin.style.top = `calc(50% - 100px)`;
                    coin.style.left = `calc(100% + 100px)`;
                }, 400);

                setTimeout(() => {
                    coin.style.scale = `0`;
                }, 1200);

                setTimeout(() => {
                    coin.remove();
                }, 2000);
            }
            break;

        case "spawn_mini_box":
            game.getSpawner().spawn({
                laneNumber: lane.getNumber(),
                health: 1,
                pos: box.pos,
                type: "mini",
                speed: 1
            });
            break;

        case "spawn_random_box":
            game.getSpawner().spawnFromTypes({
                types: spawnTypesUniform,
                laneNumber: lane.getNumber(),
                pos: box.pos
            });
            break;

        case "explode":
            game.getSpawner().getLanes().forEach(lane => lane.getBoxes().filter(box => box.isDead == -1).forEach(box => box.addHealth(-1)));

            const explosion = document.createElement("div");
            explosion.classList.add("explosion");
            explosion.style.top = `${box.pos}px`;
            explosion.style.left = `${lane.getNumber() * 120 + 50}px`;
            explosion.style.rotate = `${Math.random() * Math.PI * 2}rad`;
            game.getSpawner().appendChild(explosion);

            requestAnimationFrame(() => {
                explosion.style.scale = `20`;
                explosion.style.backgroundSize = `4%`;
                explosion.style.opacity = `0`;
            });

            setTimeout(() => {
                explosion.remove();
            }, 1000);

            GameAudio.explosion();
            break;

        case "damage_player":
            player.addHealth(-loot.amount());
            break;
    }
}
