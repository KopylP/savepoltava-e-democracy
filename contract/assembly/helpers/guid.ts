import { base64, math } from "near-sdk-as";

export default class Guid {
    static generate(): string {
        return base64.encode(math.randomSeed());
    }
}