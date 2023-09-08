---
sidebar_position: 3
---

# Portkey Sign In

## 1. Preparation

- Install [Node.js](https://nodejs.org/en/download).

## 2. Create a sample project using react

In a terminal:

```sh copy
npx create-react-app my-app
```

Enter the project folder.

```sh copy
cd my-app
```

## 3. Install Portkey UI sdk

```sh copy
npm install @portkey/did-ui-react
```

## 4. Integrate SignIn Component

### 4.1 Copy below sample code and replace the codes in src/App.js

```js filename="src/App.js" copy showLineNumbers
import { SignIn, PortkeyProvider } from "@portkey/did-ui-react";
import { useRef, useState } from "react";
import "@portkey/did-ui-react/dist/assets/index.css"; // import portkey css
import "./App.css";

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
        {wallet && (
          <p>
            Wallet address: ELF_{wallet?.caInfo.caAddress}_{wallet?.chainId}
          </p>
        )}
      </div>
    </PortkeyProvider>
  );
};

export default App;
```

### 4.2 Copy below sample code and replace the codes in src/App.css

:::tip

For the purposes of this workshop, let's amend the css to the below, so that
we can see it clearly on screen. It is up to the DApp developer to implement
their own styling in their projects.

:::

```css filename="src/App.css" copy showLineNumbers
.my-app button,
.my-app p {
  margin: 1rem;
  font-size: 2rem;
}
```

## 5. Setting up the proxy to connect to testnet for testing

As during Sign In process, there are number of api calls that is retrieving holder info or guardians info from chain.

Edit `package.json` and add the following:

```json filename="package.json"
"proxy": "https://did-portkey-test.portkey.finance" //testnet
```

## 6. Start the development server

```sh
npm run start
```

## 7. Result

Click on the Sign in button and complete the sign in process.

When successful, your wallet address will be displayed on the frontend.
