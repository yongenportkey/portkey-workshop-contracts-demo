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

Before we start the token creation process, we need to do some initialization steps. We have prepared an initialization script for each developer present here, which needs to be run first. In this script, you will do some actions, such as setting up environment variables (including your address, testnet URL, and contract name), and load the aelf account we've applied for you to your local environment.

Why are we doing this? The reason is that currently, if we want to create an FT or NFT, we need to get a seed NFT. The seed NFT defines the symbol name of the FT or NFT you are going to create. The name of the created FT or NFT must be consistent with the name defined in this seed NFT. we applied for the seed NFT for each person and sent it to your accounts.

Additionally, a small amount of transaction fee is required, so we transfer some ELF tokens to your account in advance. This is to enable everyone to proceed with the subsequent steps. Now let's take a look at this script.

Then we can run it. Once the script has been executed, I will teach you how to check the information of your account.

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
chmod +x setup.sh
source setup.sh
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```bash copy
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

```bash copy
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

Let me introduce the aelf-command usage first.

```bash copy
# The basic format of aelf-command is aelf-command send/call,
# Then followed by a contract name, it stands for the target contract of this command. For example, here is the token contract.
# Then -a $WALLET_ADDRESS -p $WALLET_PASSWORD, which represents your account and password.
# Next, it's endpoint, which is a url.
# Finally, Create "$CREATE_PARAMS_FT" means method name and parameters.
aelf-command send $TOKEN_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $TESTNET_ENDPOINT \
Create "$CREATE_PARAMS_FT"
```

Run the following commands to create a new FT. Please note that the symbol of the created token must be consistent with the symbol applied for in the seed NFT.

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export CREATE_PARAMS_FT=$(cat << EOL
{
    "symbol": "$SYMBOL_FT",
    "tokenName": "$SYMBOL_FT token",
    "totalSupply": "1000000000",
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

```bash copy
# Need to split 2 commands on Windows.
set "CREATE_PARAMS_FT={\"symbol\":\"%SYMBOL_FT%\",\"tokenName\":\"%SYMBOL_FT%token\",\"totalSupply\":\"1000000000\",\"decimals\":8,\"issuer\":\"%WALLET_ADDRESS%\",\"isBurnable\":\"true\",\"lockWhiteList\":null,\"issueChainId\":9992731,\"externalInfo.value\":null,\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Create "%CREATE_PARAMS_FT%"
```

  </TabItem>
</Tabs>

Let me explain some important parameters.

1. symbol: The symbol represents the name of the FT you are creating, it should be the same as defined in seed NFT.
2. totalSupply: The totalSupply represents the maximum quantity that can be issued.
3. decimals: The decimals stands for the maximum number of decimal places your FT can have. For ELF, it's 8.

After running the command, you can use `event` to check the result. Like this

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
aelf-command event <transactionId> -e $TESTNET_ENDPOINT
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```bash copy
aelf-command event <transactionId> -e %TESTNET_ENDPOINT%
```

  </TabItem>
</Tabs>

### 2.4 Issue token

After creating, it is only registering the metadata of this token. We still need to issue it.
For you understand issue clearly, we will check the balance before issuing and after issuing so that you can see the difference. Run the following commands.

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

```bash copy
# Need to split 2 commands on Windows.
set "BALANCE_BEFORE_PARAMS_FT={\"symbol\":\"%SYMBOL_FT%\",\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command call %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% GetBalance "%BALANCE_BEFORE_PARAMS_FT%"
```

  </TabItem>
</Tabs>

Then run issue command.

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export ISSUE_PARAMS_FT=$(cat << EOL
{
    "symbol": "$SYMBOL_FT",
    "amount": 100,
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

```bash copy
# Need to split 2 commands on Windows.
set "ISSUE_PARAMS_FT={\"symbol\":\"%SYMBOL_FT%\",\"amount\":100,\"memo\":\"test\",\"to\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Issue "%ISSUE_PARAMS_FT%"
```

  </TabItem>
</Tabs>

After this, run GetBalance method again, and check the result.

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

```bash copy
# Need to split 2 commands on Windows.
set "BALANCE_AFTER_PARAMS_FT={\"symbol\":\"%SYMBOL_FT%\",\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command call %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% GetBalance "%BALANCE_AFTER_PARAMS_FT%"
```

  </TabItem>
</Tabs>

## 3. NFT Creation

### 3.1 Create new NFT collection

Before creating a new NFT, we need to create a new NFT collection. The NFT collection is like a box, and NFTs are like cards inside it.

![NFT-diagram](/img/NFT-diagram.png "NFT diagram")

Run the following commands to create a new NFT collection. NFT collection name should be `<SYMBOL>-0`. For example, `TEST-0`.
Please note that the symbol of the created token must be consistent with the symbol applied for in the seed NFT.

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

```bash copy
# Need to split 2 commands on Windows.
set "CREATE_PARAMS_NFT_COLLECTION={\"symbol\":\"%SYMBOL_NFT%-0\",\"tokenName\":\"Collecion of %SYMBOL_NFT%\",\"totalSupply\":\"1\",\"decimals\":0,\"issuer\":\"%WALLET_ADDRESS%\",\"isBurnable\":\"true\",\"lockWhiteList\":null,\"issueChainId\":9992731,\"externalInfo\":{\"value\":{\"__nft_image_url\":\"%NFT_COLLECTION_IMAGE%\"}},\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Create "%CREATE_PARAMS_NFT_COLLECTION%"
```

  </TabItem>
</Tabs>

The most of parameters are the same as FT. Let me explain the differences.

1. The symbol represents the name of the NFT collection you are creating, it should be `<SYMBOL>-0`. For example, `TEST-0`. `-0` stands for collection, it's fixed.
2. The totalSupply represents the maximum quantity that can be issued. For NFT collection, it should be 1.
3. The decimals of NFT collection and NFT should be 0.
4. The externalInfo.value is used to attach an image to the NFT collection.

### 3.2 Create new NFT item.

After creating a new NFT collection, we can create a new NFT item.
Run the following commands to create a new NFT item. NFT item name should be `<SYMBOL>-1/2/3`. For example, `TEST-1`.
Please note that the symbol of the created token must be consistent with the symbol applied for in the seed NFT.

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

```bash copy
# Need to split 2 commands on Windows.
set "CREATE_PARAMS_NFT={\"symbol\":\"%SYMBOL_NFT%-1\",\"tokenName\":\"%SYMBOL_NFT% item\",\"totalSupply\":\"1\",\"decimals\":0,\"issuer\":\"%WALLET_ADDRESS%\",\"isBurnable\":\"true\",\"lockWhiteList\":null,\"issueChainId\":9992731,\"externalInfo\":{\"value\":{\"__nft_image_url\":\"%NFT_ITEM_IMAGE%\"}},\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Create "%CREATE_PARAMS_NFT%"
```

  </TabItem>
</Tabs>

The most of parameters are the same as NFT collection. Let me explain the differences.

1. The symbol represents the name of the NFT you are creating, it should be `<SYMBOL>-1/2/3`, it can't be `-0`. For example, `TEST-1`.
2. The externalInfo.value is used to attach an image to the NFT.

### 3.3 Issue token

After creating the NFT, it is also just creating the NFT metadata. We still need to issue it before we can use the token.
we also check the balance before issuing and after issuing so that you can see the difference. Run the following commands.

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

```bash copy
# Need to split 2 commands on Windows.
set "BALANCE_BEFORE_PARAMS_NFT={\"symbol\":\"%SYMBOL_NFT%-1\",\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command call %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% GetBalance "%BALANCE_BEFORE_PARAMS_NFT%"
```

  </TabItem>
</Tabs>

Then run the issue command.

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

```bash copy
# Need to split 2 commands on Windows.
set "ISSUE_PARAMS_NFT={\"symbol\":\"%SYMBOL_NFT%-1\",\"amount\":1,\"memo\":\"test\",\"to\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Issue "%ISSUE_PARAMS_NFT%"
```

  </TabItem>
</Tabs>

After this, run GetBalance method again, and check the result.

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

```bash copy
# Need to split 2 commands on Windows.
set "BALANCE_AFTER_PARAMS_NFT={\"symbol\":\"%SYMBOL_NFT%-1\",\"owner\":\"%WALLET_ADDRESS%\"}"

aelf-command call %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% GetBalance "%BALANCE_AFTER_PARAMS_NFT%"
```

  </TabItem>
</Tabs>

## 4. Token Transfer

We will transfer the FT or NFT from your current address to your portkey wallet address.
Here I'll use Transfer FT token as an example. Firstly, you need to find your portkey wallet address.

<Tabs groupId="os">
  <TabItem value="macOS" label="Mac OS">

```bash copy
export TRANSFER_PARAMS=$(cat << EOL
{
    "symbol": "$SYMBOL_FT",
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

```bash copy
# Need to split 2 commands on Windows.
set "TRANSFER_PARAMS={\"symbol\":\"%SYMBOL_FT%\",\"amount\":1,\"memo\":\"test\",\"to\":\"%WALLET_ADDRESS%\"}"

aelf-command send %TOKEN_CONTRACT_ADDRESS% -a %WALLET_ADDRESS% -p %WALLET_PASSWORD% -e %TESTNET_ENDPOINT% Transfer "%TRANSFER_PARAMS%"
```

  </TabItem>
</Tabs>

After completing all the steps, we can open the app and get result of transfer.
