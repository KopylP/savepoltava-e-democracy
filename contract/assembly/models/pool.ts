import { Vote, votes } from './vote';
import { Answer } from './answer';
import { PersistentSet, PersistentMap } from "near-sdk-as";
import { Guard } from "../helpers/guard";
import guid from "../helpers/guid";
import { throwIf } from '../helpers/error';
import { PersistentList } from '../framework/structures/persistent-list';
import { stringifyJsonOrBytes } from 'near-api-js/lib/transaction';

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
    answers: Answer[];
    creator: string;
    
    constructor(votingStartDate: Date,
        votingEndDate: Date,
        question: string,
        creator: string,
        isMultiple: bool = false,
        revoteCount: u16 = 0,
        answers = []) {
        const now = new Date(Date.now());

        Guard.greaterThen(votingStartDate, now);
        Guard.greaterThen(votingEndDate, votingStartDate);
        Guard.notEmpty(question, nameof(question));
        Guard.notEmpty(creator, nameof(creator));
        this.createdDate = now;
        this.modifiedDate = now;
        this.name = question;
        this.votingStartDate = votingStartDate;
        this.votingEndDate = votingEndDate;
        this.guid = guid.generate();
        this.isMultiple = isMultiple;
        this.revoteCount = revoteCount;
        this.answers = answers;
        this.creator = creator;
    }

    isActive(): bool {
        const now = new Date(Date.now());
        return this.votingStartDate <= now && this.votingEndDate >= now;
    }

    isFinished(): bool {
        const now = new Date(Date.now());
        return this.votingEndDate < now;
    }

    isNotStarted(): bool {
        const now = new Date(Date.now());
        return this.votingStartDate > now;
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

    public toDto()  {
        const now = new Date(Date.now());
        const voteEnds = this.votingEndDate < now;
        return {
            name: this.name,
            isActive: this.isActive(),
            votingStartDate: this.votingStartDate,
            votingEndDate: this.votingEndDate,
            isMultiple: this.isMultiple,
            answers: voteEnds ? this._getAnswersWithVoters()
                : this.answers.map(p => {
                    return {
                        content: p.content,
                        voters: []
                    }
                })
        }
    }

    private _getAnswersWithVoters() {
        const poolVotes = votes.values()
            .filter(x => x.poolGuid === this.guid)
            .sort(p => p.date.getTime());
        
        const currentAccountVotes = poolVotes.reduce((group, vote) => {
            group.set(vote.accountId, vote);
            return group;
        }, new Map<string, Vote>()).values();

        const voteAnswerPositions = currentAccountVotes.map(p => {
            const result = [];
            for (let i = 0; i <= p.selectedAnswerPositions.length; i++) {
                result.push({
                    accountId: p.accountId,
                    answerPosition: p.selectedAnswerPositions[i]
                });
            }
            return result;
        }).flat();

        const votersGroupByPosition = voteAnswerPositions.reduce((group, voteAnswerPosition) => {
            let currentVoters = group.get(voteAnswerPosition.answerPosition) || [];
            currentVoters = [...currentVoters, voteAnswerPosition.accountId];
            group.set(voteAnswerPosition.answerPosition, currentVoters);
            return group;
        }, new Map<number, string[]>());

        return this.answers.map((p, i) => {
            return {
                content: p.content,
                voters: votersGroupByPosition.get(i) || []
            }
        });
    }

    private _checkIfSelectedNumbersIsCorrect(selectedAnswerPositions: u16[]): bool {
        for (let i : u16 = 0; i < selectedAnswerPositions.length; i++) {
            if (selectedAnswerPositions[i] < 0 || selectedAnswerPositions[i] >= this.answers.length)
                return false;
        }

        return true;
    }
}

export const pools = new PersistentList<Pool>("pools");