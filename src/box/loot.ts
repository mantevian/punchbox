import { game } from "..";
import WeightedList from "../util/weighted_list";
import type Box from "./box";

export type LootTableName = "normal" | "good" | "bad" | "money" | "mini";

export type Loot =
    { type: "player_health_increase"; } |
    { type: "player_health_decrease"; } |
    { type: "player_speed_increase"; } |
    { type: "player_speed_decrease"; } |
    { type: "spawn_new_box"; } |
    { type: "lane_speed_increase"; } |
    { type: "lane_speed_decrease"; } |
    { type: "coin"; amount: number; };

export const lootTable = {
    normal: new WeightedList<Loot>()
        .add({ type: "lane_speed_increase" }, 1)
        .add({ type: "lane_speed_decrease" }, 1)
        .add({ type: "spawn_new_box" }, 1)
        .add({ type: "coin", amount: 1 }, 2)
        .add({ type: "coin", amount: 2 }, 1),

    good: new WeightedList<Loot>()
        .add({ type: "player_health_increase" }, 1)
        .add({ type: "player_speed_increase" }, 1)
        .add({ type: "lane_speed_decrease" }, 1)
        .add({ type: "coin", amount: 1 }, 1),

    bad: new WeightedList<Loot>()
        .add({ type: "player_health_decrease" }, 1)
        .add({ type: "player_speed_decrease" }, 1)
        .add({ type: "lane_speed_increase" }, 1)
        .add({ type: "coin", amount: 5 }, 1),

    money: new WeightedList<Loot>()
        .add({ type: "coin", amount: 2 }, 3)
        .add({ type: "coin", amount: 3 }, 2)
        .add({ type: "coin", amount: 4 }, 1),

    mini: new WeightedList<Loot>()
        .add({ type: "coin", amount: 1 }, 1)
};

export function apply(loot: Loot, box: Box) {
    const player = game.getPlayer();

    console.log(loot.type);

    switch (loot.type) {
        case "player_health_increase":
            player.addHealth(1);
            break;

        case "player_health_decrease":
            player.addHealth(-1);
            break;

        case "player_speed_increase":
            player.addSpeed(-50);
            break;

        case "player_speed_decrease":
            player.addSpeed(50);
            break;

        case "lane_speed_increase":
            box.getLane().addSpeed(0.5);
            break;

        case "lane_speed_decrease":
            box.getLane().addSpeed(-0.5);
            break;

        case "coin":
            player.addMoney(loot.amount);
            break;

        case "spawn_new_box":
            game.getSpawner().spawn({
                laneNumber: parseInt(box.getLane().getAttribute("n")!),
                health: 1,
                pos: box.pos,
                type: "mini"
            });
            break;
    }
}
