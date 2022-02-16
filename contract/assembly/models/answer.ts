import { Guard } from "../helpers/guard";

export class Answer {
    content: string;

    constructor (content: string) {
        Guard.notEmpty(content, nameof(content));
        this.content = content;
    }
}