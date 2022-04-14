declare namespace setTimeout {
    export function async(interval: number): Promise<void>;
}

setTimeout.async = (interval: number): Promise<void> => {
    return new Promise<void>(resolve => setTimeout(resolve, interval));
}