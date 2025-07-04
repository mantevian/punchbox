import { game } from ".";

export default class Lane extends HTMLElement {
    connectedCallback() {
        this.addEventListener("click", () => {
            const player = game.getPlayer();

            if (player.hasAttribute("attacking")) {
                return;
            }

            const left = this.offsetLeft + this.offsetWidth * 0.5;
            
            player.style.left = `${left + 100}px`;
            player.attack();
        });
    }
}
