import { game } from "..";
import { nextInt } from "../util/random";
import WeightedList from "../util/weighted_list";
import type Box from "./box";

export type LootTableName = "normal" | "good" | "explosive" | "money" | "mini";

export type Loot =
    { type: "player_health_increase"; } |
    { type: "spawn_new_box"; } |
    { type: "lane_speed_increase"; } |
    { type: "lane_speed_decrease"; } |
    { type: "explode"; } |
    { type: "coin"; amount: () => number; };

export const lootTable = {
    normal: new WeightedList<Loot>()
        .add({ type: "lane_speed_increase" }, 1)
        // .add({ type: "lane_speed_decrease" }, 1)
        .add({ type: "spawn_new_box" }, 1)
        .add({ type: "coin", amount: () => 1 }, 2)
        .add({ type: "coin", amount: () => 2 }, 1),

    good: new WeightedList<Loot>()
        .add({ type: "player_health_increase" }, 1)
        .add({ type: "lane_speed_decrease" }, 1)
        .add({ type: "coin", amount: () => 1 }, 1),

    explosive: new WeightedList<Loot>()
        .add({ type: "explode" }, 1),

    money: new WeightedList<Loot>()
        .add({ type: "coin", amount: () => nextInt(2, 5) }, 1),

    mini: new WeightedList<Loot>()
        .add({ type: "coin", amount: () => 1 }, 1)
};

export function apply(loot: Loot, box: Box) {
    const player = game.getPlayer();
    const lane = box.getLane();

    console.log(loot.type);

    switch (loot.type) {
        case "player_health_increase":
            player.addHealth(1);
            break;

        case "lane_speed_increase":
            lane.addSpeed(0.25);
            break;

        case "lane_speed_decrease":
            lane.addSpeed(-0.25);
            break;

        case "coin":
            const amount = loot.amount();
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
                    coin.style.top = `50%`;
                    coin.style.left = `100%`;
                }, 400);

                setTimeout(() => {
                    coin.style.scale = `0`;
                }, 1200);

                setTimeout(() => {
                    coin.remove();
                }, 2000);
            }
            break;

        case "spawn_new_box":
            game.getSpawner().spawn({
                laneNumber: lane.getNumber(),
                health: 1,
                pos: box.pos,
                type: "mini",
                speed: 1.5
            });
            break;

        case "explode":
            player.addHealth(-1);
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
            break;
    }
}
