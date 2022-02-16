import { context } from "near-sdk-as";
import { SUPER_USER } from "../constants";
import { editors, voters } from "./permissions";

export class User {
    static accountId = context.sender;
    static balance = context.accountBalance;
    static isSignIn = User._isSignIn();
    static isVoter = User._isVoter();
    static isEditor = User._isEditor();
    static isSuperUser = User._isSuperUser();

    private static _isSignIn() : bool {
        return (context.sender || '') !== '';
    }

    private static _isVoter() : bool {
        return voters.has(context.sender) || SUPER_USER === context.sender;
    }
    
    private static  _isEditor() : bool {
        return editors.has(context.sender) || SUPER_USER === context.sender;
    }
    
    private static  _isSuperUser() : bool {
        return SUPER_USER === context.sender;
    }
}
