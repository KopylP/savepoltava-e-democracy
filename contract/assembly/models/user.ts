import { Context }from "near-sdk-as";
import { SUPER_USER } from "../constants";
import { editors, voters } from "./permissions";

@nearBindgen
export class User {
    accountId: string;
    isSignIn: bool;
    isVoter: bool;
    isEditor: bool;
    isSuperUser: bool;

    constructor (accountId: string) {
        this.accountId = accountId;
        this.isSignIn = this.accountId != null && this.accountId != '';
        this.isVoter = voters.has(this.accountId) || SUPER_USER == this.accountId;
        this.isEditor = editors.has(this.accountId) || SUPER_USER == this.accountId;
        this.isSuperUser = SUPER_USER == this.accountId;
    }
}
