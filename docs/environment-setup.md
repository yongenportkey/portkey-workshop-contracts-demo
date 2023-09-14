---
title: Environment Setup
sidebar_position: 2
---

# 1. Environment Setup

In this workshop, we will make use of the IDE [Visual Studio Code (VS Code)](https://code.visualstudio.com/) and [Docker](https://www.docker.com/) to perform development inside a container.

This will allow us to iterate faster without polluting the environment of the host machine.

## 2. Download

- [VS Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/)

## 3. Install

Once you have downloaded the software above, please install in your local machine.

## 4. Start Docker

Ensure that Docker is started.

## 5. At the Terminal/Command Prompt

Open a new Terminal/Command Prompt, and create a new folder for our workshop:

```bash
cd ~
mkdir portkey-workshop
cd portkey-workshop
code .
```

The last command will open the current folder `portkey-workshop` in Visual Studio Code.

## 6. Install the `Dev Containers` extension

Open the Extensions panel.

Search for the extension `Dev Containers` by Microsoft.

![devcontainer extension](/img/extensions.png)

Click on the extension, and on the right panel, click on `Install` to install it.

## 7. Configure the Dev Container

### 7.1. Add configuration files

Open the Command Palette (View > Command Palette) and search for the following command:

`Dev Containers: Add Dev Container Configuration Files...`.

![add config](/img/add-dev-container-config-files.png)

Press `enter` to execute it.

### 7.2. Select a container configuration template

#### 7.2.1. Click on `Show All Definitions...`

![show all definitions](/img/show-all-definitions.png)

#### 7.2.2. Type `Node.js` and press `enter` to install the template from `csutter`.

![node](/img/node.png)

Press `enter` again to choose the default version for the image tag.

![node version](/img/node-version.png)

#### 7.2.3. Search for `dotnet` and select `Dotnet CLI`.

![dotnet](/img/dotnet.png)

Click on the `OK` button.

Choose `Configure Options`.

![dotnet configure options](/img/dotnet-configure-options.png)

Choose version `7`.

![dotnet 7](/img/dotnet-7.png)

After a while, a `.devcontainer` folder appears, visible in the Explorer panel.

![.devcontainer](/img/devcontainer.png)

### 7.3. Customise the container configuration template

Click on the Dockerfile inside the `.devcontainer` folder to open it.

At the bottom of the Dockerfile, add the following lines and save the file:

```dockerfile
# Install aelf-command
RUN npm install -g aelf-command
```

At this point, the files should look like this:

```json title=.devcontainer/devcontainer.json
// See https://containers.dev/implementors/json_reference/ for configuration reference
{
  "name": "Untitled Node.js project",
  "build": {
    "dockerfile": "Dockerfile"
  },
  "remoteUser": "node",
  "features": {
    "ghcr.io/devcontainers/features/dotnet:2": {
      "version": "7.0"
    }
  }
}
```

```dockerfile title=.devcontainer/Dockerfile
FROM node:18

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Install aelf-command
RUN npm install -g aelf-command
```

### 7.4. Start the Dev Container

Open the Command Palette (View > Command Palette) and search for the following command:

`Dev Containers: Rebuild and Reopen in Container`.

![devcontainer rebuild](/img/devcontainer-rebuild.png)

Press `enter` to execute it.

Wait for a few minutes for the container to start.

## 8. Using the Dev Container

You may now open a new terminal within VS Code by using the shortcut `Command+Shift+P` on macOS or `Ctrl+Shift+P` on Windows.

### 8.1. `aelf-command`

At the terminal, type `aelf-command -h` and press `enter`.

![aelf command](/img/aelf-command.png)

Observe that the `aelf-command` cli is available.

### 8.2. `dotnet`

At the terminal, type `dotnet --version` and press `enter`. Type `dotnet --help` and press `enter`.

![dotnet](/img/dotnet-version.png)

Observe that the `dotnet` cli is available.

## 9. Configuration completed

You may proceed to the next tutorial.
