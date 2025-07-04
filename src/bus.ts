export default class Bus {
    private target: Element;

    constructor(target: Element) {
        this.target = target;
    }

    on<T extends keyof PBEventMap>(eventName: T, callback: (e: CustomEvent<PBEventMap[T]>) => void) {
        this.target.addEventListener(eventName, callback as any);
    }

    off<T extends keyof PBEventMap>(eventName: T, callback: (e: CustomEvent<PBEventMap[T]>) => void) {
        this.target.removeEventListener(eventName, callback as any);
    }

    once<T extends keyof PBEventMap>(eventName: T, callback: (e: CustomEvent<PBEventMap[T]>) => void) {
        this.target.addEventListener(eventName, callback as any, { once: true });
    }

    emit<T extends keyof PBEventMap>(eventName: T, detail: PBEventMap[T]) {
        this.target.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
    }
}
