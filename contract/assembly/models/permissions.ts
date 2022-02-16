import { PersistentSet } from 'near-sdk-as';

export const editors = new PersistentSet<string>("editors");
export const voters = new PersistentSet<string>("voters");

export function addEditor(accountId: string) : void {
    if (!editors.has(accountId)) {
        editors.add(accountId);
    }
}

export function addVoter(accountId: string) : void {
    if (!voters.has(accountId)) {
        voters.add(accountId);
    }
}
