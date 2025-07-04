import Box from "./box/box";
import Spawner from "./box/spawner";
import Bus from "./util/bus";
import PBEventElement from "./util/event";
import Game from "./game";
import Lane from "./lane";
import Player from "./player";
import Scene from "./scene";

const styles = import.meta.glob(`../style/**/*.css`);
for (const path in styles) {
    styles[path]().then(style => style);
}

export const game = document.querySelector<Game>("pb-game")!;
export const bus = new Bus(game);

const elements = {
    "game": Game,
    "scene": Scene,
    "event": PBEventElement,
    "lane": Lane,
    "player": Player,
    "box": Box,
    "spawner": Spawner,
};

for (let [k, v] of Object.entries(elements)) {
    customElements.define(`pb-${k}`, v);
}
