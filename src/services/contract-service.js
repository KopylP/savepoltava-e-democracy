export default class ContractService {
  constructor(contractName, contract, walletConnection) {
    this.contract = contract;
    this.walletConnection = walletConnection;
    this.contractName = contractName;
  }

  login = async () => {
    await this.walletConnection.requestSignIn(this.contractName);
  };

  logout = () => {
    this.walletConnection.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  isSignedIn = () => {
    return this.walletConnection.isSignedIn();
  };

  getUserData = async () => {
    return await this.contract.getUserData({ accountId: walletConnection.getAccountId() });
  };
}
