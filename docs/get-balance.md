---
sidebar_position: 4
---

# Get Balance

## 1. Preparation

- Follow the example at [Portkey Sign In](/docs/sign-in).

## 2. Add new files

### 2.1. Token Contract Hook

This hook will return an instance of the token contract for other components to use.

```tsx title="src/useTokenContract.ts" showLineNumbers
import { IPortkeyProvider, IChain, ChainId } from "@portkey/provider-types";
import { useEffect, useState } from "react";
import AElf from "aelf-sdk";

function useTokenContract(provider: IPortkeyProvider | null, chainId: ChainId) {
  const [tokenContract, setTokenContract] =
    useState<ReturnType<IChain["getContract"]>>();

  useEffect(() => {
    (async () => {
      if (!provider) return null;

      try {
        // 1. get the chain using provider.getChain
        const chain = await provider?.getChain(chainId);
        if (!chain) throw new Error("No chain");

        // 2. get the chainStatus
        const chainStatus = await chain?.getChainStatus();
        if (!chainStatus) throw new Error("No chain status");

        // 3. get chainStatus.GenesisContractAddress
        const genesisContractAddress = chainStatus?.GenesisContractAddress;
        if (!genesisContractAddress)
          throw new Error("No genesis contract address");

        // 4. get the genesis contract
        const genesisContract = chain?.getContract(genesisContractAddress);
        if (!genesisContract) throw new Error("No genesis contract");

        // 5. call view method GetContractAddressByName to get the token contract address
        const { data: tokenContractAddress } =
          await genesisContract.callViewMethod<string>(
            "GetContractAddressByName",
            AElf.utils.sha256("AElf.ContractNames.Token")
          );
        if (!tokenContractAddress) throw new Error("No token contract address");

        // 6. get the token contract
        const tokenContract = chain?.getContract(tokenContractAddress);
        setTokenContract(tokenContract);
      } catch (error) {
        console.log(error, "====error");
      }
    })();
  }, [provider, chainId]);

  return tokenContract;
}

export default useTokenContract;
```

### 2.2. Add a new file `src/Balance.tsx` and copy/paste the following:

```tsx title="src/Balance.tsx" showLineNumbers
import {
  IPortkeyProvider,
  MethodsBase,
  ChainId,
} from "@portkey/provider-types";
import BigNumber from "bignumber.js";
import { useState } from "react";
import useTokenContract from "./useTokenContract";

function Balance({
  provider,
  chainId,
  symbol,
}: {
  provider: IPortkeyProvider | null;
  chainId: ChainId;
  symbol: string;
}) {
  const [balance, setBalance] = useState<string>();
  const tokenContract = useTokenContract(provider, chainId);

  const onClick = async () => {
    setBalance("Fetching...");
    try {
      const accounts = await provider?.request({
        method: MethodsBase.ACCOUNTS,
      });
      if (!accounts) throw new Error("No accounts");

      const result = await tokenContract?.callViewMethod<{
        balance: string;
        owner: string;
        symbol: string;
      }>("GetBalance", {
        symbol,
        owner: accounts?.[chainId]?.[0],
      });

      if (result) {
        const balance = result.data?.balance;

        if (balance) {
          setBalance(new BigNumber(balance).dividedBy(10 ** 8).toFixed(5));
        }
      }
    } catch (error) {
      console.log(error, "====error");
      setBalance("Failed.");
    }
  };

  if (!provider) return null;

  return (
    <div>
      <button onClick={onClick}>
        Get {chainId} {symbol} Balance
      </button>
      <div>
        {balance} {symbol}
      </div>
    </div>
  );
}

export default Balance;
```

## 3. Edit `src/App.tsx`:

```tsx title="src/App.tsx" showLineNumbers
import { useEffect, useState } from "react";
import { IPortkeyProvider, MethodsBase } from "@portkey/provider-types";
import "./App.css";
import detectProvider from "@portkey/detect-provider";
// highlight-next-line
import Balance from "./Balance";

function App() {
  const [provider, setProvider] = useState<IPortkeyProvider | null>(null);

  const init = async () => {
    try {
      setProvider(await detectProvider());
    } catch (error) {
      console.log(error, "=====error");
    }
  };

  const connect = async () => {
    await provider?.request({
      method: MethodsBase.REQUEST_ACCOUNTS,
    });
  };

  useEffect(() => {
    if (!provider) init();
  }, [provider]);

  if (!provider) return <>Provider not found.</>;

  return (
    <>
      <button onClick={connect}>Connect</button>
      // highlight-start
      <div style={{ display: "flex" }}>
        <Balance provider={provider} chainId="AELF" symbol="ELF" />
        <Balance provider={provider} chainId="tDVW" symbol="ELF" />
        <Balance provider={provider} chainId="AELF" symbol="AELFWSFTBF" />
      </div>
      // highlight-end
    </>
  );
}
```

## 4. Faucet

You may top up your testnet wallet using the [Faucet](https://testnet-faucet.aelf.io).

After topping up, you can click the `Get Balance` button to retrieve the new balance.
