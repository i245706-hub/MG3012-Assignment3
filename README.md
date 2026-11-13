# MG3012 Assignment 3 – Task Manager dApp (Truffle + Ganache)

**Name:** Sibgha Sheraz
**Roll No:** i24-5706
**Course:** MG3012 – Blockchain Technology for Business (BSFT, 5th Semester, Fall 2026)
**Instructor:** Dr. Usama Arshad

## Overview

This project extends Assignment 2 by deploying the `TaskManager` smart contract with the **Truffle Suite** to a local **Ganache** blockchain instead of Remix. A simple HTML/CSS/JavaScript frontend uses **Web3.js** and **MetaMask** to interact with the deployed contract.

The contract lets a user:

- add a task (`addTask`)
- mark a task as done or pending (`toggleTask`)
- read a single task (`getTask`) and the number of tasks (`getTaskCount`)

## Tools and Versions

- Node.js (LTS recommended)
- Truffle v5.11.5
- Ganache CLI v7.9.x
- Solidity compiler 0.8.20 (EVM version `london`)
- Web3.js 1.10.0 (loaded from CDN)
- MetaMask browser extension

## Project Structure

```
MG3012-Assignment3/
├── contracts/
│   └── SmartContract.sol        # contains the TaskManager contract
├── migrations/
│   └── 1_deploy_contract.js     # deploys TaskManager
├── test/
│   └── taskmanager.test.js      # 4 automated tests
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── TaskManager.json         # compiled artifact (ABI + address)
├── screenshots/                 # compile, migrate, test and UI screenshots
├── truffle-config.js
└── README.md
```

## Prerequisites

1. Install Node.js from https://nodejs.org (LTS version).
2. Install Truffle and Ganache:
   ```
   npm install -g truffle ganache
   ```
3. Install the MetaMask browser extension.

## Setup and Run

1. **Start Ganache** in its own terminal and keep it open:
   ```
   ganache --port 7545 --chain.chainId 1337 --chain.networkId 5777 --wallet.deterministic
   ```
2. **Open a second terminal** in the project folder and compile:
   ```
   truffle compile
   ```
3. **Deploy** the contract to Ganache:
   ```
   truffle migrate --reset
   ```
4. **Run the tests:**
   ```
   truffle test
   ```
5. **Copy the compiled artifact** to the frontend (repeat after every redeploy):
   ```
   copy build\contracts\TaskManager.json frontend\
   ```
   (Mac/Linux: `cp build/contracts/TaskManager.json frontend/`)
6. **Serve the frontend** from a third terminal:
   ```
   cd frontend
   npx http-server -p 3000 -c-1
   ```
7. **Configure MetaMask:**
   - Add a custom network: name `Ganache Local`, RPC URL `http://127.0.0.1:7545`, Chain ID `1337`, symbol `ETH`.
   - Import a funded account using a private key from the Ganache terminal (account 0).
8. Open **http://127.0.0.1:3000/index.html** and click **Connect MetaMask**.

## Configuration Notes

`truffle-config.js` connects to Ganache at `127.0.0.1:7545` and compiles with Solidity `0.8.20` using `evmVersion: "london"`, because Ganache does not support the `PUSH0` opcode used by newer EVM versions.

Ganache is started with chain ID `1337` and network ID `5777`. The frontend switches MetaMask to chain `1337` automatically and reads the contract address from the `networks` field of `TaskManager.json`.

## Testing

Automated tests (Truffle + Mocha/Chai):

```
truffle test
```

The test suite covers:

1. A new contract starts with zero tasks.
2. Adding a task stores its description and a pending status.
3. Toggling a task flips its completed status.
4. Reading an invalid index reverts with "Invalid task number".

Result: **4 passing**.

Manual testing is also possible in the Truffle console:

```
truffle console
```
```javascript
let t = await TaskManager.deployed()
await t.addTask("Learn Truffle")
await t.getTaskCount()
await t.getTask(0)
await t.toggleTask(0)
await t.getTask(0)
```

## How to Use the dApp

1. Click **Connect MetaMask** and approve the connection and the network switch.
2. The page shows the connected account, the contract address and the list of tasks.
3. Type a description and click **Add Task**. Confirm the transaction in MetaMask.
4. Click **Mark Done** or **Mark Pending** next to a task and confirm in MetaMask.
5. Click **Refresh** to reload the task list from the blockchain.

## Commands Used

```
truffle init
truffle compile
truffle migrate --reset
truffle test
truffle console
npx http-server -p 3000 -c-1
```

## Screenshots

All screenshots are in the `screenshots/` folder:

| File | Shows |
|---|---|
| `01_truffle_version.png` | Truffle installation |
| `02_ganache_running.png` | Ganache running with accounts |
| `03_truffle_init.png` | Project initialisation |
| `04_compile.png` | Successful compilation |
| `05_migrate.png` | Successful deployment with contract address |
| `06_ganache_blocks.png` | Ganache activity after deployment |
| `07_console.png` | Interaction through the Truffle console |
| `08_tests_passing.png` | 4 passing tests |
| `09_dapp_connected.png` | dApp connected to MetaMask |
| `10_metamask_confirm.png` | MetaMask transaction confirmation |
| `11_dapp_updated.png` | Task added and shown in the UI |
| `12_ganache_transactions.png` | Ganache log of the dApp transaction |

## Troubleshooting

| Problem | Fix |
|---|---|
| `Could not find artifacts for ...` | The name in `artifacts.require("...")` must match the contract name (`TaskManager`). |
| Compiler version error | `solc.version` in `truffle-config.js` must satisfy the `pragma` in the contract. |
| µWS "not compatible with your Node.js build" message | Harmless warning; Ganache falls back to a JavaScript implementation. |
| Page shows "not deployed on this network" | Switch MetaMask to Ganache Local, or recopy `TaskManager.json` after redeploying. |
| MetaMask nonce error after restarting Ganache | MetaMask → Settings → Advanced → Clear activity tab data. |
| Transaction fails with insufficient funds | Use the imported Ganache account, not the default MetaMask account. |

## Author

Sibgha Sheraz – i24-5706
