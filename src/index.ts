import Bus from "./bus";
import Game from "./game";

export const game = document.querySelector<Game>("pb-game")!;
export const bus = new Bus(game);

const elements = {
    "game": Game,
};

for (let [k, v] of Object.entries(elements)) {
    customElements.define(`si-${k}`, v);
    import(`../style/component/${k}.css`);
}

declare global {
    interface PBEventMap {
        "tick": number;
    }
}
