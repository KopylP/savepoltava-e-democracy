import { User } from './models/user';
import { throwIf } from './helpers/error';
import { pools } from './models/pool';
import * as permissions from './models/permissions';

export function addEditor(editorAccountId: string): void {
  throwIf(!User.isSuperUser, "You do not have permissions");
  permissions.addEditor(editorAccountId);
}

export function addVoter(voterAccountId: string): void {
  throwIf(!User.isSuperUser, "You do not have permissions");
  permissions.addVoter(voterAccountId);
}

export function addVote(poolGuid: string, selectedAnswerPositions: u16[]) {
  throwIf(!User.isVoter, "You do not have permissions");
  
  var poolsArray = pools.values();
  const poolIndex = poolsArray.findIndex(p => p.guid == poolGuid);
  throwIf(poolIndex == -1, "Pool not found!");

  const pool = poolsArray[poolIndex];
  throwIf(!pool.isActive(), "Pool is not active!");

  pool.addVote(User.accountId, selectedAnswerPositions);
}

export function getUserData() {
  return {
    accountId: User.accountId,
    balance: User.balance,
    isSuperUser: User.isSuperUser,
    isVoter: User.isVoter,
    isEditor: User.isEditor
  }
}
