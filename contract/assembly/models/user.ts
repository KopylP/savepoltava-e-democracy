import { context } from "near-sdk-as";
import { SUPER_USER } from "../constants";
import { editors, voters } from "./permissions";

@nearBindgen
export class User {
    static accountId: string = context.sender;
    static isSignIn: bool = User._isSignIn();
    static isVoter: bool = User._isVoter();
    static isEditor: bool = User._isEditor();
    static isSuperUser: bool = User._isSuperUser();

    private static _isSignIn() : bool {
        return context.sender != null && context.sender != '';
    }

    private static _isVoter() : bool {
        return voters.has(context.sender) || SUPER_USER == context.sender;
    }
    
    private static  _isEditor() : bool {
        return editors.has(context.sender) || SUPER_USER == context.sender;
    }
    
    private static  _isSuperUser() : bool {
        return SUPER_USER == context.sender;
    }
}
