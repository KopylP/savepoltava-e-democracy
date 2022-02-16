export function throwIf(condition: bool, message: string = '') {
    if (condition) {
        throw new Error(message);
    }
}