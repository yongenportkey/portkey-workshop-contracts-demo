---
title: Smart Contract
sidebar_position: 6
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

- Open a terminal and type the following command. You can install the contract template from nuget repo to your local.

```bash copy
dotnet new install AElf.Contract --nuget-source http://192.168.68.107:8081/repository/nuget-group/index.json
```

- Create a folder to place the workshop project

```bash copy
mkdir workshop
cd workshop
```

- Type the following command, and create a new template project locally

```bash copy
dotnet new aelfcontract -n HelloWorld
```

You can add customised parameters of command to define contract names and namespace, e.g. -n HelloWorld , which means contract name will be HelloWorld, -N AElf.Contracts.HelloWorld, which means namespace will be AElf.Contracts.HelloWorld.

Type the following command to understand usage of all the customised parameters.

```bash copy
dotnet new aelfcontract --help
```

### 1.3 High level scope of the project

If you open your project folder, you should see two newly generated directories: src and test. These correspond to the smart contract code and the unit test code for the contract, respectively.

#### 1.3.a src

The src folder contains several proto files used to describe blockchain smart contract services and data structures. It also includes specific implementations of smart contract methods and definition files for managing contract state in communication with the blockchain, such as HelloWorldState.cs here.

```
- src
  - Protobuf
  - AElf.Contracts.HelloWorld.csproj
  - HelloWorld.cs
  - HelloWorldState.cs
```

#### 1.3.b test

The test folder similarly contains a proto subfolder, along with a setup file used to establish the unit testing environment for blockchain smart contracts. It defines test module classes and a base test class, facilitating context loading, stub class retrieval, and stub acquisition methods. As a result, these classes and methods are employed in unit tests to conduct various tests on the smart contract.

```
- test
  - Protobuf
  - _Setup.cs
  - AElf.Contracts.HelloWorld.Tests.csproj
  - HelloWorldTests.cs
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

Add the following code to the `src/Protobuf/contract/hello_world_contract.proto` file. These lines of code will introduce three new methods called `Initialize`, `CreateCharacter` and `GetMyCharacter` and also define a data structure called Character.

```protobuf copy
    rpc Initialize (google.protobuf.Empty) returns (google.protobuf.Empty);
    rpc CreateCharacter (google.protobuf.Empty) returns (Character);
```

```protobuf copy
    rpc GetMyCharacter (google.protobuf.Empty) returns (Character) {
        option (aelf.is_view) = true;
    }
```

```protobuf copy
message Character {
    int32 health = 1;
    int32 strength = 2;
    int32 speed = 3;
}
```

And also add these lines of code into HelloWorldState.cs, they will create a storage space for Character and Initialized, import and encapsulate ACS6 reference state.

```csharp copy
using AElf.Standards.ACS6;
using AElf.Types;
```

```csharp copy
//create a storage space for Character
public BoolState Initialized { get; set; }
public MappedState<Address, Character> Characters { get; set; }

//encapsulate ACS6 reference state
internal RandomNumberProvideacsrContractContainer.RandomNumberProvideacsrContractReferenceState
    RandomNumberContract { get; set; }
```

Add implementation of CreateCharacter and GetMyCharacter methods in HelloWorld.cs as well:

```csharp copy
using AElf.Standards.ACS6;
```

```csharp copy
public override Empty Initialize(Empty input)
{
    Assert(!State.Initialized.Value, "already initialized");
    State.RandomNumberContract.Value =
        Context.GetContractAddressByName(SmartContractConstants.ConsensusContractSystemName);
    return new Empty();
}
```

```csharp copy
public override Character CreateCharacter(Empty input)
{
    var existing = State.Characters[Context.Sender];
    Assert(existing == null, "already has a character");
    var randomBytes = State.RandomNumberContract.GetRandomBytes
        .Call(new Int64Value { Value = Context.CurrentHeight - 1 }.ToBytesValue()).Value.ToByteArray();
    var hash = HashHelper.ComputeFrom(Context.Sender).Value.ToByteArray();

    var character = new Character
    {
        Health = 60 + (randomBytes[0] ^ hash[0]) % 41, // Health is 60 ~ 100
        Strength = 40 + (randomBytes[1] ^ hash[1]) % 61, // Strength is 40 ~ 100
        Speed = 100 + (randomBytes[2] ^ hash[2]) % 101 // Strength is 100 ~ 200
    };
    State.Characters[Context.Sender] = character;
    return character;
}
```

```csharp copy
public override Character GetMyCharacter(Empty input)
{
    return State.Characters[Context.Sender] ?? new Character();
}
```

This code generates a random character's attributes based on a randomBytes obtained from the ACS6. The 3 element of byte will do exclusive OR operation with 3 elements of a computed hash, each result transformed into an attribute. The attributes determine health, strength, and speed proportions. The resulting character's attributes are then formatted into a Character data structure and returned, providing details of HP, strength, and speed.

Next, we need to add a unit test case for the Character methods. We go to the test folder and add these lines of code to `test/Protobuf/contract/hello_world_contract.proto`.

```protobuf copy
    rpc Initialize (google.protobuf.Empty) returns (google.protobuf.Empty);
    rpc CreateCharacter (google.protobuf.Empty) returns (Character);
```

```protobuf copy
    rpc GetMyCharacter (google.protobuf.Empty) returns (Character) {
        option (aelf.is_view) = true;
    }
```

```protobuf copy
message Character {
    int32 health = 1;
    int32 strength = 2;
    int32 speed = 3;
}
```

Then add unit test for RandomCharacter method in HelloWorldTests.cs:

```csharp copy
        [Fact]
        public async Task Rng_Test()
        {
            await HelloWorldStub.Initialize.SendAsync(new Empty());
            var result = await HelloWorldStub.CreateCharacter.SendAsync(new Empty());
            var character = await HelloWorldStub.GetMyCharacter.CallAsync(new Empty());

            Assert.NotEqual(new Character(), character);
            Assert.Equal(result.Output, character);
        }
```

## 3. Deploy the contract

Deployment on AElf test net is very simple, it can be done on the website: https://explorer-test-side02.aelf.io/

Deployment procedure:

1. Go to https://explorer-test-side02.aelf.io/proposal/proposals and login your portkey account

If you haven't don't have test tokens on your account, you may go to https://testnet-faucet.aelf.io/ to get some free test tokens.

2. Submit a proposal

Click "Apply", and select "Deploy/Update Contract", upload the /AElf.Contracts.HelloWorld.dll.patched file in project folder

```bash copy
workshop/src/bin/Debug/net6.0
```

3. Deploy the contract

After uploading your contarct file, click "Apply" at bottom then click "OK" in pop-up window, it will do code check and deployment automatically.

Here is a gif of the whole deployment process.
![](/img/output.gif)

## 4. Call the contract

- Send aelf commands.
  - Open terminal, type aelf-command send, fill the parameters

```bash copy
aelf-command send 27RVyw1vKbWNdeTMfwFXeAtzQ36eM5c5cgfXzNydhNtD8NSpBk -e http://35.77.60.71:8000 -a 29zekTc31moEh33B6QiFuyPfbmG3fZfgMWoRqEwvgf2EsTPyfK -p xibo123
```

```bash copy
aelf-command send 27RVyw1vKbWNdeTMfwFXeAtzQ36eM5c5cgfXzNydhNtD8NSpBk -e http://35.77.60.71:8000 -a 27a3Hcn3esyHwFTdaUNQBL7dH8gg4BkRaZ7uv7SRoLAoLuS7Go -p xibo123
```

```
aelf-command [call|send] [contract-address|contract-name] [params]
-a, --account <account>
-e, --endpoint <URI>
-p, --password <password>
```
