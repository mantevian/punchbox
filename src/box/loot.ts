import WeightedList from "../util/weighted_list";

type Loot =
    { type: "player_player_health_decrease_increase"; } |
    { type: "player_player_health_decrease_decrease"; } |
    { type: "player_health_increase"; } |
    { type: "player_health_decrease"; } |
    { type: "player_speed_increase"; } |
    { type: "player_speed_decrease"; } |
    { type: "spawn_new_box"; } |
    { type: "lane_speed_increase"; } |
    { type: "lane_speed_decrease"; } |
    { type: "coin"; amount: number; };

const lootTable = {
    normal: new WeightedList<Loot>()
        .add({ type: "player_player_health_decrease_increase" }, 1)
        .add({ type: "player_player_health_decrease_decrease" }, 1)
        .add({ type: "player_health_increase" }, 1)
        .add({ type: "player_health_decrease" }, 1)
        .add({ type: "player_speed_increase" }, 1)
        .add({ type: "player_speed_decrease" }, 1)
        .add({ type: "lane_speed_increase" }, 1)
        .add({ type: "lane_speed_decrease" }, 1)
        .add({ type: "spawn_new_box" }, 1)
        .add({ type: "coin", amount: 1 }, 5)
        .add({ type: "coin", amount: 2 }, 1),

    good: new WeightedList<Loot>()
        .add({ type: "player_player_health_decrease_increase" }, 1)
        .add({ type: "player_health_increase" }, 1)
        .add({ type: "player_speed_increase" }, 1)
        .add({ type: "lane_speed_decrease" }, 1)
        .add({ type: "coin", amount: 2 }, 1),

    bad: new WeightedList<Loot>()
        .add({ type: "player_player_health_decrease_decrease" }, 1)
        .add({ type: "player_health_decrease" }, 1)
        .add({ type: "player_speed_decrease" }, 1)
        .add({ type: "lane_speed_increase" }, 1),

    money: new WeightedList<Loot>()
        .add({ type: "coin", amount: 2 }, 3)
        .add({ type: "coin", amount: 3 }, 2)
        .add({ type: "coin", amount: 4 }, 1)
};

export default lootTable;
