---
sidebar_position: 4
---

# Get Balance

## 1. Preparation

- Follow the example at [Portkey Sign In](/docs/sign-in).

## 2. Add a new file `src/Balance.js` and copy/paste the following:

```jsx title="src/Balance.js" showLineNumbers
import { did } from "@portkey/did-ui-react";
import { getContractBasic } from "@portkey/contracts";
import { useState } from "react";
import BigNumber from "bignumber.js";
import { aelf } from "@portkey/utils";
import { CHAIN_ID } from "./App";

export const Balance = ({ wallet }) => {
  const [balance, setBalance] = useState(new BigNumber(0));

  const getBalance = async () => {
    try {
      const chainsInfo = await did.services.getChainsInfo();
      const chainInfo = chainsInfo.find((chain) => chain.chainId === CHAIN_ID);

      const caInfo = await did.didWallet.getHolderInfoByContract({
        caHash: wallet.caInfo.caHash,
        chainId: CHAIN_ID,
      });

      const multiTokenContract = await getContractBasic({
        contractAddress: chainInfo.defaultToken.address,
        rpcUrl: "https://aelf-test-node.aelf.io",
        account: aelf.getWallet(did.didWallet.managementAccount.privateKey),
      });

      const { data } = await multiTokenContract.callViewMethod("GetBalance", {
        symbol: "ELF",
        owner: caInfo.caAddress,
      });

      /**
       * for ELF, it is 8 decimals
       */
      const decimals = chainInfo.defaultToken.decimals;

      /**
       * use BigNumber to store and manipulate the balance to get the actual balance
       */
      const balance = new BigNumber(data?.balance).dividedBy(10 ** decimals);

      setBalance(balance);
    } catch (err) {
      console.log(err);
    }
  };

  if (!wallet) return null;

  return (
    <>
      <button onClick={() => getBalance(wallet)}>getBalance</button>
      <p>Balance: {balance.toFixed(2)} ELF</p>
    </>
  );
};
```

## 3. Edit `src/App.js`:

```jsx title="src/App.js" showLineNumbers
import { SignIn, PortkeyProvider } from "@portkey/did-ui-react";
import { useRef, useCallback, useState } from "react";
import "@portkey/did-ui-react/dist/assets/index.css"; // import portkey css
import "./App.css";
// highlight-next-line
import { Balance } from "./Balance";

// highlight-next-line
export const CHAIN_ID = "AELF";

const App = () => {
  const signInComponentRef = useRef();
  const [wallet, setWallet] = useState();

  return (
    <PortkeyProvider networkType={"TESTNET"}>
      <div className="my-app">
        <button
          onClick={() => {
            signInComponentRef.current?.setOpen(true);
          }}
        >
          Sign In
        </button>
        <SignIn
          ref={signInComponentRef}
          onFinish={(wallet) => {
            setWallet(wallet);
          }}
        />
        // highlight-start
        {wallet ? (
          <>
            <p>
              Wallet address: ELF_{wallet.caInfo.caAddress}_{CHAIN_ID}
            </p>
            <Balance wallet={wallet} />
          </>
        ) : null}
        // highlight-end
      </div>
    </PortkeyProvider>
  );
};

export default App;
```

## 3. Faucet

You may top up your testnet wallet using the [Faucet](https://testnet-faucet.aelf.io).

After topping up, you can click the `getBalance` button to retrieve the new balance.
