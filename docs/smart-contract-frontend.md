---
title: Smart Contract on Frontend
sidebar_position: 8
---

# Interacting with the deployed smart contract on the frontend

## 1. Preparation

- Follow the example at [Get NFT](/docs/get-nft).
- Follow the example at [Develop, deploy and call a smart contract](/docs/smart-contract).

## 2. Introduction

Now that a smart contract has been deployed successfully, it might be desireable to call the smart contract on the frontend.

This example will demonstrate how to do this.

## 3. Add new files

### 3.1. Add a new file `src/useSmartContract.ts` and copy/paste the following:

:::warning

Amend the address highlighted below to your own.

This is the address that has been deployed in [Develop, deploy and call a smart contract](/docs/smart-contract#3-deploy-the-contract).

:::

```ts title="src/useSmartContract.ts" showLineNumbers
import { IPortkeyProvider, IChain } from "@portkey/provider-types";
import { useEffect, useState } from "react";

function useSmartContract(provider: IPortkeyProvider | null) {
  const [smartContract, setSmartContract] =
    useState<ReturnType<IChain["getContract"]>>();

  useEffect(() => {
    (async () => {
      if (!provider) return null;

      try {
        // 1. get the sidechain tDVW using provider.getChain
        const chain = await provider?.getChain("tDVW");
        if (!chain) throw new Error("No chain");

        // highlight-next-line
        const address = "xqrvvgzTom5sbt5HTtiYSgxHoSAkdPK38D6iWmVvGpnoYrv7P";

        // 2. get the character contract
        const characterContract = chain?.getContract(address);
        setSmartContract(characterContract);
      } catch (error) {
        console.log(error, "====error");
      }
    })();
  }, [provider]);

  return smartContract;
}

export default useSmartContract;
```

### 3.2. Add a new file `src/SmartContract.tsx` and copy/paste the following:

```tsx title="src/SmartContract.tsx" showLineNumbers
import { IPortkeyProvider, MethodsBase } from "@portkey/provider-types";
import useSmartContract from "./useSmartContract";
import { useState } from "react";

function SmartContract({ provider }: { provider: IPortkeyProvider | null }) {
  const characterContract = useSmartContract(provider);
  const [result, setResult] = useState<object>();

  const onClick = async () => {
    try {
      const accounts = await provider?.request({
        method: MethodsBase.ACCOUNTS,
      });
      if (!accounts) throw new Error("No accounts");

      const account = accounts?.tDVW?.[0]!;
      if (!account) throw new Error("No account");

      // 1. if not initialized, it will be initialized
      await characterContract?.callSendMethod("Initialize", account, {});

      // 2. if a character has not been created yet, it will create a character
      await characterContract?.callSendMethod("CreateCharacter", account, {});

      // 3. get character
      const result = await characterContract?.callViewMethod(
        "GetMyCharacter",
        account
      );
      setResult(result);
    } catch (error) {
      console.log(error, "====error");
    }
  };

  if (!provider) return null;

  return (
    <>
      <button onClick={onClick}>Get Character</button>
      <div>Your character is: {JSON.stringify(result)}</div>
    </>
  );
}

export default SmartContract;
```

## 4. Edit `src/App.tsx`:

```tsx title="src/App.tsx" showLineNumbers
import { useEffect, useState } from "react";
import { IPortkeyProvider, MethodsBase } from "@portkey/provider-types";
import "./App.css";
import detectProvider from "@portkey/detect-provider";
import Balance from "./Balance";
import Nft from "./Nft";
// highlight-next-line
import SmartContract from "./SmartContract";

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
      <div style={{ display: "flex" }}>
        <Balance provider={provider} chainId="AELF" />
        <Balance provider={provider} chainId="tDVW" />
      </div>
      <Nft provider={provider} />
      // highlight-next-line
      <SmartContract provider={provider} />
    </>
  );
}

export default App;
```

After Sign in, click on the `Get Character` button.

If the character exists, it will be displayed in the page.
