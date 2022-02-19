import { PersistentSet } from 'near-sdk-as';
import { Guard } from './../helpers/guard';
import { datetime } from "near-sdk-as";

@nearBindgen
export class Vote {
    accountId: string;
    poolGuid: string;
    selectedAnswerPositions: i32[];
    date: number = datetime.block_datetime().second;

    constructor (accountId: string, poolGuid: string, selectedAnswerPositions: i32[]) {
        Guard.notEmpty(accountId, nameof(accountId));
        Guard.notEmpty(poolGuid, nameof(poolGuid));
        Guard.arrayNullOrEmpty(selectedAnswerPositions);

        this.accountId = accountId;
        this.poolGuid = poolGuid;
        this.selectedAnswerPositions = selectedAnswerPositions;
    }
}

export const votes = new PersistentSet<Vote>("votes");
