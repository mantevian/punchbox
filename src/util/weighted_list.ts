export default class WeightedList<T> {
    private entries: Array<{ item: T, cumulative: number }> = [];
    private sum: number = 0;

    add(value: T, weight: number): WeightedList<T> {
        this.entries.push({
            item: value,
            cumulative: this.sum + weight
        });

        this.sum += weight;

        return this;
    }

    next(): T | null {
        const rand = Math.floor(Math.random() * this.sum);

        for (let i = 0; i < this.entries.length; i++) {
            const e = this.entries[i];

            if (e.cumulative > rand) {
                return e.item;
            }
        }

        return null;
    }

    clear() {
        this.entries = [];
    }
}

