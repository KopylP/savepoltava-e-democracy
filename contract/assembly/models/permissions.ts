import { PersistentSet } from 'near-sdk-as';

export const editors = new PersistentSet<string>("editors");
export const voters = new PersistentSet<string>("voters");
