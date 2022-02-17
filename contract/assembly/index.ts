import { User } from './models/user';
import { throwIf } from './helpers/error';
import { pools, Pool } from './models/pool';
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

export function getActivePools() {
  return pools.values().filter(p => p.isActive()).map(p => p.toDto());
}

export function getFinishedPools() {
  return pools.values().filter(p => p.isFinished()).map(p => p.toDto());
}

export function getNotStartedPools() {
  return pools.values().filter(p => p.isNotStarted()).map(p => p.toDto());
}

export function deletePool(poolGuid: string) {
  const poolIndex = pools.values().findIndex(p => p.guid == poolGuid);
  throwIf(poolIndex == -1, "Pool not found!");

  const pool = pools.values()[poolIndex];
  throwIf(!pool.isNotStarted(), "Pool has been already started");
  throwIf(pool.creator !== User.accountId && !User.isSuperUser, "You do not have permissions");

  pools.delete(p => p.guid == pool.guid);
}

export function addPool(
  votingStartDate: Date,
  votingEndDate: Date,
  question: string,
  isMultiple: bool = false,
  revoteCount: u16 = 0,
  answers = []) {
    const pool = new Pool(votingStartDate,
      votingEndDate,
      question,
      User.accountId,
      isMultiple,
      revoteCount,
      answers);
    
    pools.add(pool);
}