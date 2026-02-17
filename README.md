# Hello Contract — Multi-Contract Workspace

A Hardhat + Solidity 0.8.28 sample workspace with production-style contracts: events, custom errors, tests and deploy scripts included.

## Project structure

```
hello-contract/
├── contracts/
│   ├── MyVote.sol
│   ├── MyVoteUpgradeable.sol
│   ├── Minter.sol / Faucet.sol / SimpleToken.sol / Lock.sol
│   ├── HelloWorld.sol / HelloWorld2.sol / exe.sol
│   ├── utils/
│   ├── interfaces/
│   └── beacon/
├── scripts/
├── test/
├── frontend/
└── hardhat.config.ts
```

## Contracts overview

| Contract | Description |
|----------|-------------|
| **MyVote** | On-chain voting: chair grants rights, delegate chain, direct vote, getSummary |
| **MyVoteUpgradeable** | Upgradeable voting: same logic, `initialize`, use with ERC1967Proxy |
| **ERC1967Proxy** | EIP-1967 proxy: delegatecall to implementation |
| **Minter** | Internal balances, send, Transfer event |
| **Faucet** | ETH faucet: receive, withdraw ≤1 ether, Address.sendValue |
| **SimpleToken** | Minimal token: name/symbol/decimals, transfer |
| **Lock** | Time lock: owner withdraws after unlock, Address.sendValue |
| **HelloWorld** | Message storage, setMessage, MessageSet event |
| **HelloWorld2** | Fixed message, run() triggers RunCalled |
| **exe** | Storage + add pure, ValueSet event |

## Quick start

### Install and compile

```bash
npm install
npx hardhat compile
```

### Run tests

```bash
npm run test
npm run test:vote
REPORT_GAS=true npx hardhat test
```

### Local node and deploy

Terminal 1:

```bash
npm run node
```

Terminal 2:

```bash
npm run deploy:local
npm run deploy:upgradeable
npm run deploy:faucet
npm run deploy:minter
npm run deploy:token
npm run deploy:lock
npm run deploy:hello
npm run deploy:exe
```

Faucet fund/withdraw (override via env or args):

```bash
npm run fund:faucet
npm run withdraw:faucet

FAUCET_ADDRESS=0x... npm run fund:faucet
FAUCET_ADDRESS=0x... WITHDRAW_AMOUNT=0.3 npm run withdraw:faucet
```

### MyVote frontend

```bash
npm run sync-abi
cd frontend && npm install && npm run dev
```

Set `CONTRACT_ADDRESS` in `frontend/src/App.tsx` to your deployed MyVote (or proxy) address.

## Config

- **hardhat.config.ts**: Solidity 0.8.28, optimizer 200 runs, hardhat / localhost.
- **.env.example**: Example env vars; copy to `.env` and do not commit.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile contracts |
| `npm run test` | Run all tests |
| `npm run test:vote` | MyVote tests only |
| `npm run node` | Start local node |
| `npm run deploy:local` | Deploy MyVote |
| `npm run deploy:upgradeable` | Deploy upgradeable MyVote |
| `npm run deploy:faucet` | Deploy Faucet |
| `npm run deploy:minter` | Deploy Minter |
| `npm run deploy:token` | Deploy SimpleToken |
| `npm run deploy:lock` | Deploy Lock |
| `npm run deploy:hello` | Deploy HelloWorld |
| `npm run deploy:exe` | Deploy exe |
| `npm run fund:faucet` | Fund Faucet |
| `npm run withdraw:faucet` | Withdraw from Faucet |
| `npm run sync-abi` | Copy MyVote ABI to frontend |

## Stack

- Contracts: Solidity 0.8.28, custom errors, events
- Tests: Hardhat, Mocha, Chai
- Frontend: React 19, TypeScript, Vite 7, ethers.js 6

## License

See SPDX identifiers and repo.
