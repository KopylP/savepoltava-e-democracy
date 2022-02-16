import { PersistentSet } from 'near-sdk-as';
import { Guard } from './../helpers/guard';

@nearBindgen
export class Vote {
    accountId: string;
    poolGuid: string;
    selectedAnswerPositions: u16[];
    date: Date;

    constructor (accountId: string, poolGuid: string, selectedAnswerPositions: u16[]) {
        Guard.notEmpty(accountId, nameof(accountId));
        Guard.notEmpty(poolGuid, nameof(poolGuid));
        Guard.arrayNullOrEmpty(selectedAnswerPositions);

        this.accountId = accountId;
        this.poolGuid = poolGuid;
        this.selectedAnswerPositions = selectedAnswerPositions;
        this.date = new Date(Date.now());
    }
}

export const votes = new PersistentSet<Vote>("votes");
