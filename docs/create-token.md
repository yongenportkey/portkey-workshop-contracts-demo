---
title: Create Token
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Token Creation on AElf

## 1. Preparation

### 1.1 Install node

- Follow this doc https://nodejs.org/en/download to install node and npm.
- Type `node -v` and `npm -v`, if return the versions, the installation is successful.

### 1.2 Install aelf-command tool

Run the following command to install it.

```bash copy
npm i aelf-command -g
```

## 2. FT Creation

### 2.1 Initialization

Run the following command to setup local environment variables and the keystore.

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
source setup.sh
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
setup.bat
```

  </TabItem>
</Tabs>

### 2.2 Check account information

After running the script, let's check your account information.
Firstly run the following commands to check them.

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
echo $SEED_FOR_FT
echo $SEED_FOR_NFT
echo $SYMBOL_FT
echo $SYMBOL_NFT
echo $WALLET_ADDRESS
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
echo %SEED_FOR_FT%^
echo %SEED_FOR_NFT%^
echo %SYMBOL_FT%^
echo %SYMBOL_NFT%^
echo %WALLET_ADDRESS%
```

  </TabItem>
</Tabs>

Then you will see your account information.

### 2.3 Create new FT

```bash
# The basic format of aelf-command is aelf-command send/call,
# Then followed by a contract name, it stands for the target contract of this command. For example, here is the token contract.
# Then -a $WALLET_ADDRESS -p $WALLET_PASSWORD, which represents your account and password.
# Next, it's endpoint, which is a url.
# Finally, Create "$CREATE_PARAMS_FT" means method name and parameters.
aelf-command send $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
Create "$CREATE_PARAMS_FT"
```

Run the following commands to create a new FT.

:::tip

Please note that the symbol of the created token must be consistent with the symbol applied for in the seed NFT.

:::

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export CREATE_PARAMS_FT=$(cat << EOL
{
    "symbol": "$SYMBOL_FT",
    "tokenName": "$SYMBOL_FT token",
    "totalSupply": "10000000000",
    "decimals": 8,
    "issuer": "$WALLET_ADDRESS",
    "isBurnable": "true",
    "lockWhiteList": null,
    "issueChainId": 9992731,
    "externalInfo.value": null,
    "owner": "$WALLET_ADDRESS"
}
EOL
)
aelf-command send $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
Create "$CREATE_PARAMS_FT"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "CREATE_PARAMS_FT={\"symbol\":\"%SYMBOL_FT%\",\"tokenName\":\"%SYMBOL_FT%token\",\"totalSupply\":\"10000000000\",\"decimals\":8,\"issuer\":\"%WALLET_ADDRESS%\",\"isBurnable\":\"true\",\"lockWhiteList\":null,\"issueChainId\":9992731,\"externalInfo.value\":null,\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Create "%CREATE_PARAMS_FT%"
```

  </TabItem>
</Tabs>

| Parameter   | Description                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| symbol      | The symbol represents the name of the FT you are creating, it should be the same as defined in seed FT. |
| totalSupply | The totalSupply represents the maximum quantity that can be issued.                                     |
| decimals    | The decimals stands for the maximum number of decimal places your FT can have. For ELF, it's 8.         |

#### 2.3.1 Use AElf Explorer to check the result

Check the transaction result using AElf Explorer: https://explorer-test.aelf.io/.

### 2.4 Issue token

Follow the steps below to issue token.

#### 2.4.1 Check Balance

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export BALANCE_BEFORE_PARAMS_FT=$(cat << EOL
{
    "symbol": "$SYMBOL_FT",
    "owner": "$WALLET_ADDRESS"
}
EOL
)
aelf-command call $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
GetBalance "$BALANCE_BEFORE_PARAMS_FT"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "BALANCE_BEFORE_PARAMS_FT={\"symbol\":\"%SYMBOL_FT%\",\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command call %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% GetBalance "%BALANCE_BEFORE_PARAMS_FT%"
```

  </TabItem>
</Tabs>

#### 2.4.2 Issue

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export ISSUE_PARAMS_FT=$(cat << EOL
{
    "symbol": "$SYMBOL_FT",
    "amount": 10000000000,
    "memo": "test",
    "to": "$WALLET_ADDRESS"
}
EOL
)
aelf-command send $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
Issue "$ISSUE_PARAMS_FT"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "ISSUE_PARAMS_FT={\"symbol\":\"%SYMBOL_FT%\",\"amount\":10000000000,\"memo\":\"test\",\"to\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Issue "%ISSUE_PARAMS_FT%"
```

  </TabItem>
</Tabs>

#### 2.4.3 Check balance again

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export BALANCE_AFTER_PARAMS_FT=$(cat << EOL
{
    "symbol": "$SYMBOL_FT",
    "owner": "$WALLET_ADDRESS"
}
EOL
)
aelf-command call $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
GetBalance "$BALANCE_AFTER_PARAMS_FT"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "BALANCE_AFTER_PARAMS_FT={\"symbol\":\"%SYMBOL_FT%\",\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command call %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% GetBalance "%BALANCE_AFTER_PARAMS_FT%"
```

  </TabItem>
</Tabs>

## 3. NFT Creation

### 3.1 Create new NFT collection

Before creating a new NFT, we need to create a new NFT collection.

![NFT-diagram](/img/NFT-diagram.jpeg "NFT diagram")

Run the following commands to create a new NFT collection.

NFT collection name should be `<SYMBOL>-0`. For example, `TEST-0`.

:::tip

Please note that the symbol of the created token must be consistent with the symbol applied for in the seed NFT.

:::

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export CREATE_PARAMS_NFT_COLLECTION=$(cat << EOL
{
    "symbol": "$SYMBOL_NFT-0",
    "tokenName": "Collecion of $SYMBOL_NFT",
    "totalSupply": "1",
    "decimals": 0,
    "issuer": "$WALLET_ADDRESS",
    "isBurnable": "true",
    "lockWhiteList": null,
    "issueChainId": 9992731,
    "externalInfo": {"value":{"__nft_image_url":"$NFT_COLLECTION_IMAGE"}},
    "owner": "$WALLET_ADDRESS"
}
EOL
)
aelf-command send $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
Create "$CREATE_PARAMS_NFT_COLLECTION"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "CREATE_PARAMS_NFT_COLLECTION={\"symbol\":\"%SYMBOL_NFT%-0\",\"tokenName\":\"Collecion of %SYMBOL_NFT%\",\"totalSupply\":\"1\",\"decimals\":0,\"issuer\":\"%WALLET_ADDRESS%\",\"isBurnable\":\"true\",\"lockWhiteList\":null,\"issueChainId\":9992731,\"externalInfo\":{\"value\":{\"__nft_image_url\":\"%NFT_COLLECTION_IMAGE%\"}},\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Create "%CREATE_PARAMS_NFT_COLLECTION%"
```

  </TabItem>
</Tabs>

| Parameter          | Description                                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol             | The symbol represents the name of the NFT collection you are creating, it should be `<SYMBOL>-0`. For example, `TEST-0`. `-0` stands for collection, it's fixed. |
| totalSupply        | The totalSupply represents the maximum quantity that can be issued. For NFT collection, it should be 1.                                                          |
| decimals           | The decimals of NFT collection and NFT should be 0.                                                                                                              |
| externalInfo.value | The externalInfo.value is used to attach an image to the NFT collection.                                                                                         |

### 3.2 Create new NFT item.

Run the following commands to create a new NFT item.

NFT item name should be `<SYMBOL>-1/2/3`. For example, `TEST-1`.

:::tip

Please note that the symbol of the created token must be consistent with the symbol applied for in the seed NFT.

:::

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export CREATE_PARAMS_NFT=$(cat << EOL
{
    "symbol": "$SYMBOL_NFT-1",
    "tokenName": "$SYMBOL_NFT item",
    "totalSupply": "1",
    "decimals": 0,
    "issuer": "$WALLET_ADDRESS",
    "isBurnable": "true",
    "lockWhiteList": null,
    "issueChainId": 9992731,
    "externalInfo": {"value":{"__nft_image_url":"$NFT_ITEM_IMAGE"}},
    "owner": "$WALLET_ADDRESS"
}
EOL
)
aelf-command send $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
Create "$CREATE_PARAMS_NFT"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "CREATE_PARAMS_NFT={\"symbol\":\"%SYMBOL_NFT%-1\",\"tokenName\":\"%SYMBOL_NFT% item\",\"totalSupply\":\"1\",\"decimals\":0,\"issuer\":\"%WALLET_ADDRESS%\",\"isBurnable\":\"true\",\"lockWhiteList\":null,\"issueChainId\":9992731,\"externalInfo\":{\"value\":{\"__nft_image_url\":\"%NFT_ITEM_IMAGE%\"}},\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Create "%CREATE_PARAMS_NFT%"
```

  </TabItem>
</Tabs>

| Parameter          | Description                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| symbol             | The symbol represents the name of the NFT you are creating, it should be `<SYMBOL>-1/2/3`, it can't be `-0`. For example, `TEST-1`. |
| externalInfo.value | The externalInfo.value is used to attach an image to the NFT.                                                                       |

### 3.3 Issue token

Follow the steps below to issue token.

#### 3.3.1 Check Balance

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export BALANCE_BEFORE_PARAMS_NFT=$(cat << EOL
{
    "symbol": "$SYMBOL_NFT-1",
    "owner": "$WALLET_ADDRESS"
}
EOL
)
aelf-command call $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
GetBalance "$BALANCE_BEFORE_PARAMS_NFT"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "BALANCE_BEFORE_PARAMS_NFT={\"symbol\":\"%SYMBOL_NFT%-1\",\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command call %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% GetBalance "%BALANCE_BEFORE_PARAMS_NFT%"
```

  </TabItem>
</Tabs>

#### 3.3.2 Issue

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export ISSUE_PARAMS_NFT=$(cat << EOL
{
    "symbol": "$SYMBOL_NFT-1",
    "amount": 1,
    "memo": "test",
    "to": "$WALLET_ADDRESS"
}
EOL
)
aelf-command send $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
Issue "$ISSUE_PARAMS_NFT"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "ISSUE_PARAMS_NFT={\"symbol\":\"%SYMBOL_NFT%-1\",\"amount\":1,\"memo\":\"test\",\"to\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Issue "%ISSUE_PARAMS_NFT%"
```

  </TabItem>
</Tabs>

#### 3.3.3 Check balance again

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export BALANCE_AFTER_PARAMS_NFT=$(cat << EOL
{
    "symbol": "$SYMBOL_NFT-1",
    "owner": "$WALLET_ADDRESS"
}
EOL
)
aelf-command call $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
GetBalance "$BALANCE_AFTER_PARAMS_NFT"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "BALANCE_AFTER_PARAMS_NFT={\"symbol\":\"%SYMBOL_NFT%-1\",\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command call %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% GetBalance "%BALANCE_AFTER_PARAMS_NFT%"
```

  </TabItem>
</Tabs>

## 4. Token Transfer

Transfer the FT or NFT from your current address to your portkey wallet address.

:::tip

If you have not installed the portkey extension, please visit https://chrome.google.com/webstore/detail/portkey-did-crypto-nft/hpjiiechbbhefmpggegmahejiiphbmij?hl=en-GB on Chrome to install.

:::

### 4.1. Transfer FT

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export TRANSFER_PARAMS=$(cat << EOL
{
    "symbol": "$SYMBOL_FT",
    "amount": 1000000000,
    "memo": "test",
    "to": "$WALLET_ADDRESS"
}
EOL
)
aelf-command send $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
Transfer "$TRANSFER_PARAMS"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "TRANSFER_PARAMS={\"symbol\":\"%SYMBOL_FT%\",\"amount\":1000000000,\"memo\":\"test\",\"to\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Transfer "%TRANSFER_PARAMS%"
```

  </TabItem>
</Tabs>

### 4.2. Transfer NFT

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export TRANSFER_PARAMS=$(cat << EOL
{
    "symbol": "$SYMBOL_NFT-1",
    "amount": 1,
    "memo": "test",
    "to": "$WALLET_ADDRESS"
}
EOL
)
aelf-command send $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
Transfer "$TRANSFER_PARAMS"
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell copy
# Need to split 2 commands on Windows.
set "TRANSFER_PARAMS={\"symbol\":\"%SYMBOL_NFT%-1\",\"amount\":1,\"memo\":\"test\",\"to\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Transfer "%TRANSFER_PARAMS%"
```

  </TabItem>
</Tabs>

After completing all the steps, we can open the app and get result of transfer.
