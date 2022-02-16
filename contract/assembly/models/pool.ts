import { Vote, votes } from './vote';
import { Answer } from './answer';
import { PersistentSet, PersistentMap } from "near-sdk-as";
import { Guard } from "../helpers/guard";
import guid from "../helpers/guid";
import { throwIf } from '../helpers/error';

@nearBindgen
export class Pool {
    guid: string;
    votingStartDate: Date;
    votingEndDate: Date;
    name: string;
    createdDate: Date;
    modifiedDate: Date;
    isMultiple: bool;
    revoteCount: u8;
    answers: Map<u16, Answer> = new Map<u16, Answer>();
    
    constructor(votingStartDate: Date,
        votingEndDate: Date,
        question: string,
        isMultiple: bool = false,
        revoteCount: u16 = 0) {
        const now = new Date(Date.now());

        Guard.greaterThen(votingStartDate, now);
        Guard.greaterThen(votingEndDate, votingStartDate);
        Guard.notEmpty(question, nameof(question));
        this.createdDate = now;
        this.modifiedDate = now;
        this.name = question;
        this.votingStartDate = votingStartDate;
        this.votingEndDate = votingEndDate;
        this.guid = guid.generate();
        this.isMultiple = isMultiple;
        this.revoteCount = revoteCount;
    }

    addAnswer(position: u16, content: string): void {
        this.answers.set(position, new Answer(content));
    }

    isActive(): bool {
        const now = new Date(Date.now());
        return this.votingStartDate <= now && this.votingEndDate >= now;
    }

    addVote(accountId: string, selectedAnswerPositions: u16[]) {
    
        throwIf(!this.isMultiple && selectedAnswerPositions.length > 1, "This pool supports vote for one answer only!");

        var prevVotesCount = votes.values().filter(x => x.accountId === accountId && x.poolGuid === this.guid)
            .length;
        
        throwIf((prevVotesCount === this.revoteCount + 1), "You can no longer vote!");
        throwIf(this._checkIfSelectedNumbersIsCorrect(selectedAnswerPositions), "Answers are incorrect!");
        
        const vote = new Vote(accountId, this.guid, selectedAnswerPositions);
        votes.add(vote);
    }

    private _checkIfSelectedNumbersIsCorrect(selectedAnswerPositions: u16[]): bool {
        for (let i : u16 = 0; i < selectedAnswerPositions.length; i++) {
            if (!this.answers.has(i))
                return false;
        }

        return true;
    }
}

export const pools = new PersistentSet<Pool>("pools");