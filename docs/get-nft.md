---
sidebar_position: 5
---

# Get NFT

## 1. Preparation

- Follow the example at [Get Balance](/docs/get-balance).

## 2. Add a new file `src/Nft.tsx` and copy/paste the following:

:::warning

Amend the NFT symbol highlighted below to your own.

:::

```tsx title="src/Nft.tsx" showLineNumbers
import { IPortkeyProvider, MethodsBase } from "@portkey/provider-types";
import { useState } from "react";
import useTokenContract from "./useTokenContract";

function Nft({ provider }: { provider: IPortkeyProvider | null }) {
  const [imgUrl, setImgUrl] = useState<string>();
  const tokenContract = useTokenContract(provider);

  const onClick = async () => {
    try {
      const accounts = await provider?.request({
        method: MethodsBase.ACCOUNTS,
      });
      if (!accounts) throw new Error("No accounts");

      const result = await tokenContract?.callViewMethod<{
        symbol: string;
        tokenName: string;
        supply: string;
        totalSupply: string;
        decimals: number;
        issuer: string;
        isBurnable: boolean;
        issueChainId: number;
        issued: string;
        externalInfo: {
          value: {
            __nft_image_url: string;
          };
        };
        owner: string;
      }>("GetTokenInfo", {
        // highlight-next-line
        symbol: "AELFWSNFTAC-1",
        owner: accounts?.AELF?.[0],
      });

      if (result) {
        const imgUrl = result.data?.externalInfo.value.__nft_image_url;

        if (imgUrl) {
          setImgUrl(imgUrl);
        }
      }
    } catch (error) {
      console.log(error, "====error");
    }
  };

  if (!provider) return null;

  return (
    <>
      <button onClick={onClick}>Get NFT</button>
      <div>
        Your NFT is: <img src={imgUrl} alt="nft" />
      </div>
    </>
  );
}

export default Nft;
```

## 3. Edit `src/App.tsx`:

```tsx title="src/App.tsx" showLineNumbers
import { useEffect, useState } from "react";
import { IPortkeyProvider, MethodsBase } from "@portkey/provider-types";
import "./App.css";
import detectProvider from "@portkey/detect-provider";
import Balance from "./Balance";
// highlight-next-line
import Nft from "./Nft";

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
      // highlight-next-line
      <Nft provider={provider} />
    </>
  );
}

export default App;
```

After Sign in, click on the `Get NFT` button.

If the NFT exists, it will be displayed in the page.
