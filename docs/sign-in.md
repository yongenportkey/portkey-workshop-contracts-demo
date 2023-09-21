---
sidebar_position: 3
---

# Portkey Sign In

## 2. Create a sample project using react

In a terminal:

```bash copy
npm create vite@latest my-app -- --template react-swc-ts
```

Enter the project folder.

```bash copy
cd my-app
```

## 3. Install SDKs

```bash copy
npm install @portkey/detect-provider aelf-sdk
```

| Library                  | Description                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| @portkey/detect-provider | This library allows the developer to interact with the Portkey chrome extension.                                                |
| aelf-sdk                 | aelf-sdk.js is a collection of libraries which allow you to interact with a local or remote aelf node, using a HTTP connection. |

## 4. Integrate SignIn Component

### 4.1 Copy below sample code and replace the codes in src/App.tsx

```tsx title="src/App.tsx" showLineNumbers
import { useEffect, useState } from "react";
import { IPortkeyProvider, MethodsBase } from "@portkey/provider-types";
import "./App.css";
import detectProvider from "@portkey/detect-provider";

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
    </>
  );
}

export default App;
```

## 5. Start the development server

```bash
npm run dev
```

## 6. Result

Click on the `connect` button.

If successful, the chrome extension should pop up requesting the user to connect to the application.
