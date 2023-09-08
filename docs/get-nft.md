---
sidebar_position: 5
---

# Get NFT

## 1. Preparation

- Follow the example at [Portkey Sign In](/docs/sign-in).

## 2. Add a new file `src/Nft.js` and copy/paste the following:

:::warning

Amend the NFT symbol highlighted below to your own.

:::

```jsx title="src/Nft.js" showLineNumbers
import { did } from "@portkey/did-ui-react";
import { getContractBasic } from "@portkey/contracts";
import { useState } from "react";
import { aelf } from "@portkey/utils";
import { CHAIN_ID } from "./App";

export const Nft = ({ wallet }) => {
  const [imgUrl, setImgUrl] = useState("");

  const getNft = async () => {
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

      const { data } = await multiTokenContract.callViewMethod("GetTokenInfo", {
        // highlight-next-line
        symbol: "AELFWSNFTAC-1",
        owner: caInfo.caAddress,
      });

      setImgUrl(data?.externalInfo?.value?.["__nft_image_url"]);
    } catch (err) {
      console.log(err);
    }
  };

  if (!wallet) return null;

  return (
    <>
      <button onClick={() => getNft(wallet)}>getNFT</button>
      <img src={imgUrl} width="600" alt="NFT image" />
    </>
  );
};
```

## 3. Edit `src/App.js`:

```jsx title="src/App.js" showLineNumbers
import { SignIn, PortkeyProvider } from "@portkey/did-ui-react";
import { useRef, useState } from "react";
import "@portkey/did-ui-react/dist/assets/index.css"; // import portkey css
import "./App.css";
// highlight-next-line
import { Nft } from "./Nft";

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
        {wallet ? (
          <>
            <p>
              Wallet address: ELF_{wallet.caInfo.caAddress}_{CHAIN_ID}
            </p>
            // highlight-next-line
            <Nft wallet={wallet} />
          </>
        ) : null}
      </div>
    </PortkeyProvider>
  );
};

export default App;
```

After Sign in, click on the getNFT button.

If the NFT exists, it will be displayed in the page.
