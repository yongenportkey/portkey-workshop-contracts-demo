---
title: Environment Setup
sidebar_position: 2
---

# Environment Setup

In this workshop, we will make use of the IDE [Visual Studio Code (VS Code)](https://code.visualstudio.com/) and [Docker](https://www.docker.com/) to perform development inside a container.

This will allow us to iterate faster without polluting the environment of the host machine.

## 1. Download

- [VS Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/)

## 2. Install

Once you have downloaded the software above, please install in your local machine.

## 3. Start Docker

Ensure that Docker is started.

## 4. Clone the starting repository

Open a new Terminal/Command Prompt, and clone the starting repository:

```bash
git clone https://github.com/yongenaelf/aelfinity-workshop.git
cd aelfinity-workshop
code .
```

The last command will open the current folder `aelfinity-workshop` in Visual Studio Code.

## 5. Install the `Dev Containers` extension

Open the Extensions panel.

Search for the extension `Dev Containers` by Microsoft.

![devcontainer extension](/img/extensions.png)

Click on the extension, and on the right panel, click on `Install` to install it.

## 6. Configure the Dev Container

### 6.1. Add a new folder `.devcontainer`

```bash
mkdir .devcontainer
```

### 6.2. Add `devcontainer.json`

Create a new file `devcontainer.json` inside the `.devcontainer` folder:

```json title=.devcontainer/devcontainer.json
{
  "image": "aelf/aelfinity-workshop"
}
```

### 6.3. Start the Dev Container

Open the Command Palette (View > Command Palette) and search for the following command:

`Dev Containers: Reopen in Container`.

![devcontainer reopen](/img/devcontainer-reopen.png)

Press `enter` to execute it.

Wait for a few minutes for the container to start.

## 7. Using the Dev Container

You may now open a new terminal within VS Code by using the shortcut `Command+Shift+P` on macOS or `Ctrl+Shift+P` on Windows.

### 7.1. `aelf-command`

At the terminal, type `aelf-command -h` and press `enter`.

![aelf command](/img/aelf-command.png)

Observe that the `aelf-command` cli is available.

### 7.2. `dotnet`

At the terminal, type `dotnet --version` and press `enter`. Type `dotnet --help` and press `enter`.

![dotnet](/img/dotnet-version.png)

Observe that the `dotnet` cli is available.

## 8. Configuration completed

You may proceed to the next tutorial.
