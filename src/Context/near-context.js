import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import React, { useContext, useEffect, useState } from "react";
import getConfig from "../config";
import ContractService from "../services/contract-service";

const config = getConfig(process.env.NODE_ENV || "development");

const NearContext = React.createContext({});

export const NearContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [contract, setContract] = useState();
  const [initialized, setInitialized] = useState(false);

  useEffect(async () => {
    const near = await connect(
      Object.assign(
        { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
        config
      )
    );
    const walletConnection = new WalletConnection(near);
    const contract = new Contract(
      walletConnection.account(),
      config.contractName,
      {
        viewMethods: [
          "getActivePools",
          "getFinishedPools",
          "getNotStartedPools",
          "getUserData",
        ],
        changeMethods: [
          "addEditor",
          "addVoter",
          "vote",
          "deletePool",
          "addPool",
        ],
      }
    );

    var contractService = new ContractService(
      config.contractName,
      contract,
      walletConnection
    );

    if (contractService.isSignedIn()) {
      const userData = await contractService.getUserData();
      setUser(userData);
    }

    setContract(contractService);
    setInitialized(true);
  }, []);

  return (
    <NearContext.Provider value={{ user, contract, initialized }}>
      {children}
    </NearContext.Provider>
  );
};

export const useNear = () => {
  const nearContext = useContext(NearContext);
  return nearContext;
};
