export default class Player extends HTMLElement {
    connectedCallback() {
        
    }

    attack() {
        this.setAttribute("attacking", "");

        const glove: HTMLDivElement = this.querySelector("div.glove")!;
        glove.style.height = `500px`;

        setTimeout(() => {
            glove.style.height = `0px`;
        }, 400);

        setTimeout(() => {
            this.removeAttribute("attacking");
        }, 500);
    }
}
