export function throwIf(condition: bool, message: string = ''): void {
    if (condition) {
        throw new Error(message);
    }
}