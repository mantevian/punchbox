export function choose(...options: any): any {
    return options[nextInt(0, options.length)];
}

export function nextInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}
