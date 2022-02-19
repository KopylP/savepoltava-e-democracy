import { Vote, votes } from './vote';
import { Answer } from './answer';
import { Guard } from "../helpers/guard";
import guid from "../helpers/guid";
import { throwIf } from '../helpers/error';
import { PersistentList } from '../framework/structures/persistent-list';
import { datetime } from "near-sdk-as";

let addVote_AccountId: string;
let addVote_Guid: string;
let getAnswersWithVoters_guid: string;
let getAnswersWithVoters_votersGroupByPosition: Map<i32, string[]>;

@nearBindgen
class AnswerWithVoter {
    content: string;
    voters: string[];
}

class VoteAnswerPosition {
    accountId: string;
    answerPosition: i32;
}

@nearBindgen
export class PoolDto {
    name: string;
    isActive: bool;
    votingStartDate: number;
    votingEndDate: number;
    isMultiple: bool;
    answers: AnswerWithVoter[];
}
@nearBindgen
export class Pool {
    guid: string;
    votingStartDate: number = datetime.block_datetime().second;
    votingEndDate: number = datetime.block_datetime().second;
    name: string;
    isMultiple: bool;
    revoteCount: u8;
    answers: Answer[];
    creator: string;
    createdDate: number;

    
    constructor(votingStartDate: number,
        votingEndDate: number,
        question: string,
        creator: string,
        isMultiple: bool = false,
        revoteCount: u8 = 0,
        answers: string[] = []) {
        const now = datetime.block_datetime().second;

        Guard.greaterThen(votingStartDate, now);
        Guard.greaterThen(votingEndDate, votingStartDate);
        Guard.notEmpty(question, nameof(question));
        Guard.notEmpty(creator, nameof(creator));
        this.createdDate = now;
        this.name = question;
        this.votingStartDate = votingStartDate;
        this.votingEndDate = votingEndDate;
        this.guid = guid.generate();
        this.isMultiple = isMultiple;
        this.revoteCount = revoteCount;

        this.answers = answers.map<Answer>(p => new Answer(p));
        this.creator = creator;
    }

    isActive(): bool {
        const now = datetime.block_datetime().second;
        return this.votingStartDate <= now && this.votingEndDate >= now;
    }

    isFinished(): bool {
        const now = datetime.block_datetime().second;
        return this.votingEndDate < now;
    }

    isNotStarted(): bool {
        const now = datetime.block_datetime().second;
        return this.votingStartDate > now;
    }

    addVote(accountId: string, selectedAnswerPositions: i32[]): void {
    
        throwIf(!this.isMultiple && selectedAnswerPositions.length > 1, "This pool supports vote for one answer only!");

        addVote_AccountId = accountId;
        addVote_Guid = this.guid;

        var prevVotesCount = votes.values().filter(x => x.accountId === addVote_AccountId && x.poolGuid === addVote_Guid)
            .length;
        
        throwIf((prevVotesCount === this.revoteCount + 1), "You can no longer vote!");
        throwIf(this._checkIfSelectedNumbersIsCorrect(selectedAnswerPositions), "Answers are incorrect!");
        
        const vote = new Vote(accountId, this.guid, selectedAnswerPositions);
        votes.add(vote);
    }

    public toDto(): PoolDto {
        return {
            name: this.name,
            isActive: this.isActive(),
            votingStartDate: this.votingStartDate,
            votingEndDate: this.votingEndDate,
            isMultiple: this.isMultiple,
            answers: this.isFinished() ? this._getAnswersWithVoters(this)
                : this.answers.map<AnswerWithVoter>(p => {
                    return {
                        content: p.content,
                        voters: []
                    }
                })
        }
    }

    _getAnswersWithVoters(pool: Pool): AnswerWithVoter[] {
        getAnswersWithVoters_guid = pool.guid;
        
        const poolVotes = votes.values()
            .filter(x => x.poolGuid === getAnswersWithVoters_guid);
        
        const currentAccountVotes = poolVotes.reduce((group, vote) => {
            group.set(vote.accountId, vote);
            return group;
        }, new Map<string, Vote>()).values();

        const voteAnswerPositions = currentAccountVotes.map<VoteAnswerPosition[]>(p => {
            const result: VoteAnswerPosition[] = [];
            for (let i: i32 = 0; i <= p.selectedAnswerPositions.length; i++) {
                result.push({
                    accountId: p.accountId,
                    answerPosition: p.selectedAnswerPositions[i]
                });
            }
            return result;
        }).flat();

        const votersGroupByPosition = voteAnswerPositions.reduce((group: Map<i32, string[]>, voteAnswerPosition) => {
            let currentVoters = group.get(voteAnswerPosition.answerPosition);
            
            if (currentVoters == null)
                currentVoters = [];

            currentVoters.push(voteAnswerPosition.accountId);

            group.set(voteAnswerPosition.answerPosition, currentVoters);
            return group;
        }, new Map<i32, string[]>());

        getAnswersWithVoters_votersGroupByPosition = votersGroupByPosition;

        return this.answers.map<AnswerWithVoter>((p, i) => {
            return {
                content: p.content,
                voters: getAnswersWithVoters_votersGroupByPosition.get(i) || []
            }
        });
    }

    _checkIfSelectedNumbersIsCorrect(selectedAnswerPositions: i32[]): bool {
        for (let i: i32 = 0; i < selectedAnswerPositions.length; i++) {
            if (selectedAnswerPositions[i] < 0 || selectedAnswerPositions[i] >= this.answers.length)
                return false;
        }

        return true;
    }
}

export const pools = new PersistentList<Pool>("pools");