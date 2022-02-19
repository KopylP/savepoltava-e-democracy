export class Guard {
    static greaterThen (date1: number, date2: number): void {
        if (date1 < date2)
            throw new Error(`Date ${nameof(date1)} should be greater then ${nameof(date2)}`);
    }

    static notEmpty(str: string, name: string): void {
        if (str == null || str.trim() == '')
            throw new Error(`String ${name} is null or empty`);
    }

    static equals(str1: string, str2: string): void {
        if (str1 !== str2)
            throw new Error("Strings aren`t equal to each other");
    }

    static notNull<T>(obj: T, name: string): void {
        if (obj == null) {
            throw new Error(`Object ${name} is null`);
        }
    }

    static arrayNullOrEmpty<T>(arr: T[]): void {
        if (arr == null || arr.length == 0) {
            throw new Error("Array is null or empty");
        }
    }
}