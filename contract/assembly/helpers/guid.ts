import { base64, math } from "near-sdk-as";

export default {
    generate: () => base64.encode(math.randomSeed())
}