import { context } from 'near-sdk-as';
import { User } from './models/user';
import { throwIf } from './helpers/error';
import { pools, Pool, PoolDto } from './models/pool';
import * as permissions from './models/permissions';

export function addEditor(editorAccountId: string): void {
  const user = new User(context.sender);
  throwIf(!user.isSuperUser, "You do not have permissions");
  permissions.addEditor(editorAccountId);
}

export function addVoter(voterAccountId: string): void {
  const user = new User(context.sender);
  throwIf(!user.isSuperUser, "You do not have permissions");
  permissions.addVoter(voterAccountId);
}

let vote_poolGuid: string;

export function vote(poolGuid: string, selectedAnswerPositions: i32[]) : void {
  const user = new User(context.sender);
  throwIf(!user.isVoter, "You do not have permissions");
  
  const poolsArray = pools.values();
  vote_poolGuid = poolGuid;
  const poolIndex = poolsArray.findIndex(p => p.guid === vote_poolGuid);
  throwIf(poolIndex == -1, "Pool not found!");

  const pool = poolsArray[poolIndex];
  throwIf(!pool.isActive(), "Pool is not active!");

  pool.addVote(user.accountId, selectedAnswerPositions);
}

export function getUserData(accountId: string): User {
  return new User(accountId);
}

export function getActivePools(): PoolDto[] {
  return pools.values().filter(p => p.isActive()).map<PoolDto>((p: Pool): PoolDto => p.toDto());
}

export function getFinishedPools(): PoolDto[] {
  return pools.values().filter(p => p.isFinished()).map<PoolDto>((p: Pool): PoolDto => p.toDto());
}

export function getNotStartedPools(): PoolDto[] {
  return pools.values().filter(p => p.isNotStarted()).map<PoolDto>((p: Pool): PoolDto => p.toDto());
}

let deletePool_poolGuid: string;

export function deletePool(poolGuid: string) : void {
  const user = new User(context.sender);
  deletePool_poolGuid = poolGuid;
  const poolIndex = pools.values().findIndex(p => p.guid == deletePool_poolGuid);
  throwIf(poolIndex == -1, "Pool not found!");

  const pool = pools.values()[poolIndex];
  throwIf(!pool.isNotStarted(), "Pool has been already started");
  throwIf(pool.creator !== user.accountId && !user.isSuperUser, "You do not have permissions");

  pools.delete(p => p.guid == deletePool_poolGuid);
}

export function addPool(
  votingStartDate: number,
  votingEndDate: number,
  question: string,
  isMultiple: bool = false,
  revoteCount: u8 = 0,
  answers: string[] = []) : void {
    const user = new User(context.sender);
    const pool = new Pool(votingStartDate,
      votingEndDate,
      question,
      user.accountId,
      isMultiple,
      revoteCount,
      answers);
    
    pools.add(pool);
}