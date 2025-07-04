export type CustomEventCallback<T extends keyof PBEventMap> = (e: CustomEvent<PBEventMap[T]>) => void;

export default class Bus {
    private target: Element;

    constructor(target: Element) {
        this.target = target;
    }

    on<T extends keyof PBEventMap>(eventName: T, callback: CustomEventCallback<T>): CustomEventCallback<T> {
        this.target.addEventListener(eventName, callback as any);
        return callback;
    }

    off<T extends keyof PBEventMap>(eventName: T, callback: CustomEventCallback<T>) {
        this.target.removeEventListener(eventName, callback as any);
    }

    once<T extends keyof PBEventMap>(eventName: T, callback: CustomEventCallback<T>): CustomEventCallback<T> {
        this.target.addEventListener(eventName, callback as any, { once: true });
        return callback;
    }

    emit<T extends keyof PBEventMap>(eventName: T, detail: PBEventMap[T]) {
        this.target.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
    }
}

