# Truther Coinbase

Project developed as tech challenge for Truther Company

# Dependencies

- [Git](https://git-scm.com/downloads)
- [Node+npm](https://nodejs.org/en)
- [VSCode](https://code.visualstudio.com)
- [Docker](https://www.docker.com/get-started)
- [Pnpm](https://pnpm.io/installation)

> [!IMPORTANT] To to pnpm works correctly on Windows (v10+), you need to enable the Developer Mode.

# Get started

- Clone repository using command:
  
  ```bash
  $ git clone https://github.com/leandroluk/truther-coinbase.git
  ```

- Move to repository path and install dependencies:
  
  ```bash
  $ cd ./truther-coinbase
  $ pnpm install
  ```

# Entity Relationship Diagram

```mermaid
---
  config:
    class:
      hideEmptyMembersBox: true
---
classDiagram
    direction LR

    enum UserRole

    class User {
        id: BIGINT
        updatedAt: TIMESTAMPTZ[3]
        createdAt: TIMESTAMPTZ[3]
        name: VARCHAR[100]
        email: VARCHAR[100]
        password: TEXT
        role: ENUM[UserRole]
    }

    class Coin {
        id: BIGINT
        updatedAt: TIMESTAMPTZ[3]
        createdAt: TIMESTAMPTZ[3]
        name: VARCHAR[100]
        symbol: VARCHAR[10]
        thumb: URL
        slug: VARCHAR[100]
    }

    class CoinPrice {
        id: BIGINT
        updatedAt: TIMESTAMPTZ[3]
        marketCap: VARCHAR[100]
        value: FLOAT
        coinId: Coin(id)
    }

    Coin --|> CoinPrice : coinId
```

# Tips

1. Add command to you shell to move to root of workspace to improve coding process

    <details>

    <summary>On Windows (PowerShell)</summary>

    Use the command `code $PROFILE` to open the shell profile and add this line

    ```pwsh

    function cdroot {
      $current = Get-Location
      while (-not (Test-Path "pnpm-workspace.yaml") -and $current.Path -ne [System.IO.Path]::GetPathRoot($current.Path)) {
        Set-Location ..
        $current = Get-Location
      }
    }
    ```

    Execute the command to refresh terminal `. $PROFILE`

    </details>

    <details>

    <summary>On Linux or Macos</summary>

    Use the command `code ~/.bashrc` to open the shell profile and add this line

    ```bash
    #
    alias cdworkspace='while [ ! -f "pnpm-workspace.yaml" ] && [ "$PWD" != "/" ]; do cd ..; done'
    ```

    Execute the command to refresh terminal `source ~/.bashrc`

    </details>