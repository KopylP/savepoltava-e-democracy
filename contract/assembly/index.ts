import { editors } from './models/permissions';

import { context } from 'near-sdk-as'
import { Guard } from './helpers/guard'
import { voters } from './models/permissions'
import { throwIf } from './helpers/error';
import { pools } from './models/pool';

const super_user = "p_kopyl.testnet";

export function addEditor(editorAccountId: string): void {
  Guard.equals(super_user, context.sender);
  if (!editors.has(editorAccountId)) {
    editors.add(editorAccountId);
  }
}

export function addVoter(voterAccountId: string): void {
  Guard.equals(super_user, context.sender);
  if (!voters.has(voterAccountId)) {
    voters.add(voterAccountId);
  }
}

export function addVote(poolGuid: string, selectedAnswerPositions: u16[]) {
  const accountId = context.sender;
  throwIf(!voters.has(accountId), "You cannot vote!");
  
  var poolsArray = pools.values();
  const poolIndex = poolsArray.findIndex(p => p.guid == poolGuid);
  throwIf(poolIndex == -1, "Pool not found!");

  const pool = poolsArray[poolIndex];
  throwIf(!pool.isActive(), "Pool is not active!");

  pool.addVote(context.sender, selectedAnswerPositions);
}