import Bus from "./bus";
import PBEventElement from "./event";
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
};

for (let [k, v] of Object.entries(elements)) {
    customElements.define(`pb-${k}`, v);
}

declare global {
    interface PBEventMap {
        "tick": number;
        "change_scene": string;
    }
}
