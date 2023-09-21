---
title: Smart Contract
sidebar_position: 7
---

# Develop, deploy and call a smart contract

## 1. Development

### 1.1 Preparation


- Install dotnet sdk.

  - Follow this doc https://dotnet.microsoft.com/en-us/download to install dotnet sdk. You can choose the 7.x version.
  - Type `dotnet --version`, if return the version of dotnet sdk, the installation is successful.

- Install node.
  - Follow this doc https://nodejs.org/en/download to install node and npm.
  - Type `node -v` and `npm -v`, if return the versions, the installation is successful.

### 1.2 Create a new project

- Download the AElf templates first, this will install a package contains serveral AElf smart contract templates.

```sh copy
dotnet new install AElf.ContractTemplates
```

- Create a folder to place the workshop project

```bash copy
mkdir workshop
cd workshop
```

- Run the following command, and create a new template project locally

```bash copy
dotnet new aelf -n HelloWorld
```

### 1.3 High level scope of the project

If you open your project folder, you should see two newly generated directories: `src` and `test`. These correspond to the smart contract code and the unit test code for the contract, respectively.
```
.
├── src
│   ├── HelloWorld.cs
│   ├── HelloWorld.csproj
│   ├── HelloWorldState.cs
│   └── Protobuf
│       ├── contract
│       │   └── hello_world_contract.proto
│       └── message
│           └── authority_info.proto
└── test
    ├── HelloWorld.Tests.csproj
    ├── HelloWorldTests.cs
    ├── Protobuf
    │   ├── message
    │   │   └── authority_info.proto
    │   └── stub
    │       └── hello_world_contract.proto
    └── _Setup.cs
```

#### 1.3.a src

The src folder contains several proto files used to describe blockchain smart contract services and data structures. It also includes specific implementations of smart contract methods and definition files for managing contract state in communication with the blockchain, such as HelloWorldState.cs here.

```
src
├── Protobuf
│   ├── contract
│   │   └── hello_world_contract.proto
│   └── message
│       └── authority_info.proto
├── workshop.cs
├── workshop.csproj
└── workshopState.cs
```

#### 1.3.b test

The test folder similarly contains a proto subfolder, along with a setup file used to establish the unit testing environment for blockchain smart contracts. It defines test module classes and a base test class, facilitating context loading, stub class retrieval, and stub acquisition methods. As a result, these classes and methods are employed in unit tests to conduct various tests on the smart contract.

```
test
├── Protobuf
│   ├── message
│   │   └── authority_info.proto
│   └── stub
│       └── hello_world_contract.proto
├── _Setup.cs
├── workshop.Tests.csproj
└── workshopTests.cs
```

In the process of writing smart contracts using AElf tools, the recommended approach involves modifying or creating proto files first, as on aelf we use grpc format to define the apis in the contract as well as the input and output message types. The interfaces are defined in the protobuf files. Subsequently, the methods defined in the proto files should be implemented, followed by the addition of unit tests and their execution to verify if these tests pass.

```
Protos -> implementation -> unit test cases
```

### 1.4 Create or modify project files

- Create new proto files and modify existing project files according to your requirements.

### 1.5 Build

- Run the following command and check the result. If you encounter any errors, please resolve them according to the error messages.

```bash copy
cd src
dotnet build
```

- After building successfully, run `dotnet test` command. And check the result. If you encounter any errors, please resolve them according to the error messages.

## 2. RNG (Random number generator) Introduction

RNG is a very important part of the AElf project, AElf currently employs the Verifiable Random Function (VRF) algorithm as its underlying mechanism for generating random numbers. The essence of the VRF algorithm is rooted in mathematical operations on elliptic curves.

You can find the source code of AElf VRF here: https://github.com/AElfProject/AElf/blob/dev/src/AElf.Cryptography/ECVRF/Vrf.cs

### 2.1 RNG Application in AElf

There are many applications of RNG in AElf projects, basic flow is:

```
Get Random Hash/Bytes -> one/more random numbers
```

### 2.2 RNG Practice

Next, we can do a simple practice of RNG on the workshop project we just created.

Firstly, we need create a new subfolder called `reference` under `workshop/Protobuf` folder.

Then create a new file called `acs6.proto`, this is a standard aelf package for getting random bytes.
```protobuf copy
syntax = "proto3";

package acs6;

import "aelf/options.proto";
import "aelf/core.proto";
import "google/protobuf/wrappers.proto";

option (aelf.identity) = "acs6";
option csharp_namespace = "AElf.Standards.ACS6";

service RandomNumberProvideacsrContract {
    rpc GetRandomBytes (google.protobuf.BytesValue) returns (google.protobuf.BytesValue) {
        option (aelf.is_view) = true;
    }
}

// Events

message RandomBytesGenerated {
    option (aelf.is_event) = true;
    bytes argument = 1;
    bytes random_bytes = 2;
}
```

Replace the `src/Protobuf/contract/hello_world_contract.proto` file by following codes. These heighlighted lines of code will introduce three new methods called `Initialize`, `CreateCharacter` and `GetMyCharacter` and also define a data structure called Character.

```protobuf copy
syntax = "proto3";

import "aelf/core.proto";
import "aelf/options.proto";
import "google/protobuf/empty.proto";
import "google/protobuf/wrappers.proto";
// The namespace of this class
option csharp_namespace = "AElf.Contracts.HelloWorld";

service HelloWorld {
  // The name of the state class the smart contract is going to use to access blockchain state
  option (aelf.csharp_state) = "AElf.Contracts.HelloWorld.HelloWorldState";

  // Actions (methods that modify contract state)
  // Stores the value in contract state
  rpc Update (google.protobuf.StringValue) returns (google.protobuf.Empty) {
  }
  // highlight-next-line
  rpc Initialize (google.protobuf.Empty) returns (google.protobuf.Empty);
  // highlight-next-line
  rpc CreateCharacter (google.protobuf.Empty) returns (Character);

  // Views (methods that don't modify contract state)
  // Get the value stored from contract state
  rpc Read (google.protobuf.Empty) returns (google.protobuf.StringValue) {
    option (aelf.is_view) = true;
  }
  // highlight-next-line
  rpc GetMyCharacter (aelf.Address) returns (Character) {
    // highlight-next-line
    option (aelf.is_view) = true;
    // highlight-next-line
  }
}

// An event that will be emitted from contract method call
message UpdatedMessage {
  option (aelf.is_event) = true;
  string value = 1;
}
// highlight-next-line
message Character {
    // highlight-next-line
    int32 health = 1;
    // highlight-next-line
    int32 strength = 2;
    // highlight-next-line
    int32 speed = 3;
    // highlight-next-line
}
```


Replace `HelloWorldState.cs` by following codes, these heighlighted lines of code will create a storage space for Character and Initialized, import and encapsulate ACS6 reference state.

```csharp copy
using AElf.Sdk.CSharp.State;
using AElf.Standards.ACS6;
using AElf.Types;

namespace AElf.Contracts.HelloWorld
{
    // The state class is access the blockchain state
    public class HelloWorldState : ContractState 
    {
        // A state that holds string value
        public StringState Message { get; set; }
        //create a storage space for Character
        // highlight-next-line
        public BoolState Initialized { get; set; }
        // highlight-next-line
        public MappedState<Address, Character> Characters { get; set; }

        //encapsulate ACS6 reference state
        // highlight-next-line
        internal RandomNumberProvideacsrContractContainer.RandomNumberProvideacsrContractReferenceState
        // highlight-next-line
            RandomNumberContract { get; set; }
    }
}
```

Add implementation of CreateCharacter and GetMyCharacter methods in `HelloWorld.cs` as well:
```csharp copy
using AElf.Sdk.CSharp;
using Google.Protobuf.WellKnownTypes;
using AElf.Types;

namespace AElf.Contracts.HelloWorld
{
    // Contract class must inherit the base class generated from the proto file
    public class HelloWorld : HelloWorldContainer.HelloWorldBase
    {
        // adding this line is for preparing the contract deployment later, 
        // to differentiate each person's contract. 
        // This is because our testnet does not allow the deployment of two identical contracts.
        // highlight-next-line
        const string author = "xibo";
        // A method that modifies the contract state
        public override Empty Update(StringValue input)
        {
            // Set the message value in the contract state
            State.Message.Value = input.Value;
            // Emit an event to notify listeners about something happened during the execution of this method
            Context.Fire(new UpdatedMessage
            {
                Value = input.Value
            });
            return new Empty();
        }

        // A method that read the contract state
        public override StringValue Read(Empty input)
        {
            // Retrieve the value from the state
            var value = State.Message.Value;
            // Wrap the value in the return type
            return new StringValue
            {
                Value = value
            };
        }
        // highlight-next-line
        public override Empty Initialize(Empty input)
        // highlight-next-line
        {
            // highlight-next-line
            Assert(!State.Initialized.Value, "already initialized");
            // highlight-next-line
            State.RandomNumberContract.Value =
            // highlight-next-line
                Context.GetContractAddressByName(SmartContractConstants.ConsensusContractSystemName);
                // highlight-next-line
            return new Empty();
            // highlight-next-line
        }

        // highlight-next-line
        public override Character CreateCharacter(Empty input)
        // highlight-next-line
        {
            // highlight-next-line
            var existing = State.Characters[Context.Sender];
            // highlight-next-line
            Assert(existing == null, "already has a character");
            // highlight-next-line
            var randomBytes = State.RandomNumberContract.GetRandomBytes
            // highlight-next-line
                .Call(new Int64Value { Value = Context.CurrentHeight - 1 }.ToBytesValue()).Value.ToByteArray();
                // highlight-next-line
            var hash = HashHelper.ComputeFrom(Context.Sender).Value.ToByteArray();
            // highlight-next-line
            var character = new Character
            // highlight-next-line
            {
                // highlight-next-line
                Health = 60 + (randomBytes[0] ^ hash[0]) % 41, // Health is 60 ~ 100
                // highlight-next-line
                Strength = 40 + (randomBytes[1] ^ hash[1]) % 61, // Strength is 40 ~ 100
                // highlight-next-line
                Speed = 100 + (randomBytes[2] ^ hash[2]) % 101 // Speed is 100 ~ 200
                // highlight-next-line
            };
            // highlight-next-line
            State.Characters[Context.Sender] = character;
            // highlight-next-line
            return character;
            // highlight-next-line
        }

        // highlight-next-line
        public override Character GetMyCharacter(Address input)
        // highlight-next-line
        {
            // highlight-next-line
            return State.Characters[Context.Sender] ?? new Character();
            // highlight-next-line
        }
    }
    
}
```

This code generates a random character's attributes based on a randomBytes obtained from the ACS6. The 3 element of byte will do exclusive OR operation with 3 elements of a computed hash, each result transformed into an attribute. The attributes determine health, strength, and speed proportions. The resulting character's attributes are then formatted into a Character data structure and returned, providing details of HP, strength, and speed.

## 3. Deploy the contract

Deployment on AElf test net is very simple, it can be done on the website: https://explorer-test-side02.aelf.io/

Deployment procedure:

1. Implement acs12.proto

We need create a new file called `acs12.proto` under `src/Protobuf/reference` folder, this is a standard aelf package for showing users gas fee. `Acs12.proto` is necessary for depoyment on AElf test net.

```protobuf copy
/**
 * AElf Standards ACS12(User Contract Standard)
 *
 * Used to manage user contract.
 */
syntax = "proto3";

package acs12;

import public "aelf/options.proto";
import public "google/protobuf/empty.proto";
import public "google/protobuf/wrappers.proto";
import "aelf/core.proto";

option (aelf.identity) = "acs12";
option csharp_namespace = "AElf.Standards.ACS12";

service UserContract{
    
}

//Specified method fee for user contract.
message UserContractMethodFees {
  // List of fees to be charged.
  repeated UserContractMethodFee fees = 2;
  // Optional based on the implementation of SetConfiguration method.
  bool is_size_fee_free = 3;
}

message UserContractMethodFee {
  // The token symbol of the method fee.
  string symbol = 1;
  // The amount of fees to be charged.
  int64 basic_fee = 2;
}
```

Then we can add implementation to `hello_world_contract.proto` 
```protobuf copy
syntax = "proto3";

import "aelf/core.proto";
import "aelf/options.proto";
import "google/protobuf/empty.proto";
import "google/protobuf/wrappers.proto";
// highlight-next-line
import "Protobuf/reference/acs12.proto";
// The namespace of this class
option csharp_namespace = "AElf.Contracts.HelloWorld";

service HelloWorld {
  // The name of the state class the smart contract is going to use to access blockchain state
  option (aelf.csharp_state) = "AElf.Contracts.HelloWorld.HelloWorldState";
  // highlight-next-line
  option (aelf.base) = "Protobuf/reference/acs12.proto";
  // Actions (methods that modify contract state)
  // Stores the value in contract state
  rpc Update (google.protobuf.StringValue) returns (google.protobuf.Empty) {
  }
  rpc Initialize (google.protobuf.Empty) returns (google.protobuf.Empty);
  rpc CreateCharacter (google.protobuf.Empty) returns (Character);

  // Views (methods that don't modify contract state)
  // Get the value stored from contract state
  rpc Read (google.protobuf.Empty) returns (google.protobuf.StringValue) {
    option (aelf.is_view) = true;
  }
  rpc GetMyCharacter (aelf.Address) returns (Character) {
    option (aelf.is_view) = true;
  }
}

// An event that will be emitted from contract method call
message UpdatedMessage {
  option (aelf.is_event) = true;
  string value = 1;
}
message Character {
    int32 health = 1;
    int32 strength = 2;
    int32 speed = 3;
}
```

Then build under src folder again.
```bash copy
dotnet build
```

2. Go to https://explorer-test-side02.aelf.io/proposal/proposals and login your portkey account

If you haven't don't have test tokens on your account, you may go to https://testnet-faucet.aelf.io/ to get some free test tokens.

3. Submit a proposal

Click "Apply", and select "Deploy/Update Contract", upload the `/AElf.Contracts.HelloWorld.dll.patched` file in project folder

```bash copy
workshop/src/bin/Debug/net6.0
```

4. Deploy the contract

After uploading your contarct file, click "Apply" at bottom then click "OK" in pop-up window, it will do code check and deployment automatically.

:::warning
Please do not close the pop-up window until it's done, the address will be shown in pop-up window.
:::

Here is a gif of the whole deployment process.
![](/img/output.gif)

## 4. Call the contract

- Send aelf commands.
  - Open terminal, type aelf-command send, fill the parameters

Initialize
```bash copy
aelf-command send "$DEMO_CONTRACT_ADDRESS" -e "$TESTNET_SIDECHAIN_ENDPOINT%" -a "$WALLET_ADDRESS" -p "$WALLET_PASSWORD" Initialize
```

CreateCharater
```bash copy
aelf-command send "$DEMO_CONTRACT_ADDRESS" -e "$TESTNET_SIDECHAIN_ENDPOINT%" -a "$WALLET_ADDRESS" -p "$WALLET_PASSWORD" CreateCharacter
```

GetMyCharacter
```bash copy
export GETCHAR_PARAMS=$(cat << EOL
"$WALLET_ADDRESS"
EOL
)
aelf-command call "$DEMO_CONTRACT_ADDRESS" -e "$TESTNET_SIDECHAIN_ENDPOINT%" -a "$WALLET_ADDRESS" -p "$WALLET_PASSWORD" GetMyCharacter "$GETCHAR_PARAMS"
```

Here is an example of my own account:
```bash copy
aelf-command send 2od863gNGon8cwzRWfVqVH2XgDzrePXEiZwyY6PfEYM8sFnbYw -e http://35.77.60.71:8000 -a 29zekTc31moEh33B6QiFuyPfbmG3fZfgMWoRqEwvgf2EsTPyfK -p xibo123
```

```
aelf-command [call|send] [contract-address|contract-name] [params]
-a, --account <account>
-e, --endpoint <URI>
-p, --password <password>
```
