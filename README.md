# Hello Contract — 多合约工作区

基于 Hardhat + Solidity 0.8.28 的示例工作区，包含多份生产向合约：事件、自定义错误、NatSpec、测试与部署脚本齐全，适合作为本地开发与学习模板。

## 项目结构

```
hello-contract/
├── contracts/               # 所有 Solidity 合约（统一参与编译）
│   ├── MyVote.sol           # 投票 DApp（不可升级）
│   ├── MyVoteUpgradeable.sol # 可升级版投票（initialize 初始化）
│   ├── Minter.sol / Faucet.sol / SimpleToken.sol / Lock.sol
│   ├── HelloWorld.sol / HelloWorld2.sol / exe.sol
│   ├── utils/               # Address、StorageSlot（Faucet/Lock 与 Proxy 使用）
│   ├── interfaces/          # IERC1967、IERC1822（ERC1967 代理用）
│   └── beacon/              # Proxy、ERC1967（Upgrade、ERC1967Proxy）、BeaconProxy
├── scripts/
│   ├── deploy_MyVote.ts / deploy_MyVoteUpgradeable.ts
│   ├── deploy_Faucet.ts、deploy_Minter.ts、deploy_SimpleToken.ts、deploy_Lock.ts 等
│   ├── fund_Faucet.ts、withdraw_Faucet.ts
├── test/
├── frontend/
└── hardhat.config.ts
```

## 合约一览

| 合约 | 说明 | 要点 |
|------|------|------|
| **MyVote** | 链上投票 | 主席授权、委托链、直接投票、事件、getSummary |
| **MyVoteUpgradeable** | 可升级投票 | 同 MyVote 逻辑，`initialize` 初始化，配合 ERC1967Proxy 部署 |
| **ERC1967Proxy** | EIP-1967 代理 | 委托调用实现合约，与 MyVoteUpgradeable 配合使用 |
| **Minter** | 内部余额 | mapping 余额、send 转账、Transfer 事件 |
| **Faucet** | ETH 水龙头 | receive 入金、withdraw ≤1 ether、**Address.sendValue** |
| **SimpleToken** | 极简代币 | name/symbol/decimals、transfer |
| **Lock** | 时间锁 | 到期后 owner 可 withdraw、**Address.sendValue** |
| **HelloWorld** | 消息存储 | 可 setMessage、MessageSet 事件 |
| **HelloWorld2** | 只读 + run | 固定 message、run() 触发 RunCalled |
| **exe** | 存储 + 计算 | setValue/getValue、add 纯函数、ValueSet 事件 |

所有合约均含 **NatSpec**（@title / @notice / @param / @return），写操作配有 **事件**，错误处理使用 **自定义错误**（Custom Errors）以节省 gas 并便于前端解析。

## 快速开始

### 安装与编译

```bash
npm install
npx hardhat compile
```

### 运行测试

```bash
npm run test
npm run test:vote    # 仅 MyVote
REPORT_GAS=true npx hardhat test   # 带 Gas 报告
```

### 本地节点 + 部署

终端一启动节点：

```bash
npm run node
```

终端二按需部署（`--network localhost` 可省略，脚本内可再通过 `--network` 指定）：

```bash
npm run deploy:local       # MyVote（不可升级）
npm run deploy:upgradeable # MyVoteUpgradeable + ERC1967Proxy（可升级，前端用 Proxy 地址）
npm run deploy:faucet      # Faucet
npm run deploy:minter    # Minter（可选参数：初始余额，默认 10000）
npm run deploy:token     # SimpleToken（可选参数：供应量，默认 1000000）
npm run deploy:lock      # Lock（可选参数：锁定年数、ETH 数量）
npm run deploy:hello     # HelloWorld（可选参数：初始消息）
npm run deploy:exe       # exe
```

Faucet 充值/提款（地址可用环境变量或脚本参数覆盖）：

```bash
# 使用默认地址 0x5FbDB2315678afecb367f032d93F642f64180aa3
npm run fund:faucet
npm run withdraw:faucet

# 或指定地址/金额
FAUCET_ADDRESS=0x... npm run fund:faucet
FAUCET_ADDRESS=0x... WITHDRAW_AMOUNT=0.3 npm run withdraw:faucet
```

### MyVote 前端

合约编译后同步 ABI，再启动前端：

```bash
npm run sync-abi
cd frontend && npm install && npm run dev
```

在 `frontend/src/App.tsx` 中把 `CONTRACT_ADDRESS` 改为本地部署的 MyVote 地址（默认与 Hardhat 第一个账户部署的地址一致）。

## 配置说明

- **hardhat.config.ts**：Solidity 0.8.28、optimizer 200 runs、`hardhat` / `localhost` 网络。
- **.env.example**：示例环境变量（Faucet 地址、金额、测试网 RPC/私钥等）；复制为 `.env` 后按需填写，勿提交 `.env`。

## 脚本与 NPM 命令

| 命令 | 说明 |
|------|------|
| `npm run compile` | 编译合约 |
| `npm run test` | 全量测试 |
| `npm run test:vote` | 仅 MyVote 测试 |
| `npm run node` | 启动本地节点 |
| `npm run deploy:local` | 部署 MyVote 到 localhost |
| `npm run deploy:upgradeable` | 部署可升级 MyVote（实现 + Proxy） |
| `npm run deploy:faucet` | 部署 Faucet |
| `npm run deploy:minter` | 部署 Minter |
| `npm run deploy:token` | 部署 SimpleToken |
| `npm run deploy:lock` | 部署 Lock |
| `npm run deploy:hello` | 部署 HelloWorld |
| `npm run deploy:exe` | 部署 exe |
| `npm run fund:faucet` | 给 Faucet 充值 |
| `npm run withdraw:faucet` | 从 Faucet 提款 |
| `npm run sync-abi` | 将 MyVote 编译产物同步到 frontend |

## 技术栈

- **合约**：Solidity 0.8.28，自定义错误、事件、NatSpec
- **测试**：Hardhat + Mocha + Chai，Custom Error 与事件断言
- **前端（MyVote）**：React 19 + TypeScript + Vite 7 + ethers.js 6

## 许可证

见各文件 SPDX 标识及仓库说明。
