# ERC-3643 代币化证券标准实现

> 基于 Unichain Sepolia 测试网的完整 ERC-3643 (T-REX) 标准实现

## 快速开始

### 安装依赖

```bash
npm install
```

### 完整部署流程

```bash
# 1. 编译合约
npm run compile

# 2. 部署所有合约
npm run deploy

# 3. 注册投资者并铸造代币
npm run register

# 4. 验证部署
npm run verify

# 或者一键执行全部
npm run full
```

## 脚本说明

| 脚本 | 命令 | 说明 |
|------|------|------|
| 部署 | `npm run deploy` | 部署所有 ERC-3643 组件 |
| 注册 | `npm run register` | 注册投资者并铸造代币 |
| 验证 | `npm run verify` | 运行验证测试 |
| 完整 | `npm run full` | 一键执行全部 |

## 项目结构

```
erc3643-unichain/
├── src/
│   ├── custom-modules/
│   │   └── CountryRestrictModule.sol
│   ├── token/           # ERC-3643 Token 合约
│   └── registry/        # Identity & Claim 注册表
├── scripts/
│   ├── full-deploy.ts      # 完整部署脚本
│   ├── register-investors.ts # 投资者注册脚本
│   └── verify-erc3643.ts   # 验证脚本
├── hardhat.config.ts
├── package.json
└── README.md
```

## 已部署合约

| 合约 | 地址 |
|------|------|
| Token | `0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51` |
| IdentityRegistry | `0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9` |
| ModularCompliance | `0x2eef320EaD21bE8c767761187496aB465bBC5Dd3` |

## 投资者

| 投资者 | 地址 | 国家 | 代币余额 |
|--------|------|------|----------|
| A | 0x111...111 | 美国 (840) | 1,000,000 RWA |
| B | 0x222...222 | 法国 (250) | 1,000,000 RWA |
| C | 0x333...333 | 德国 (276) | 1,000,000 RWA |

## 合规规则

| 国家 | 代码 | 规则 |
|------|------|------|
| 美国 | 840 | ❌ 禁止发送 |
| 德国 | 276 | ❌ 禁止接收 |
| 法国 | 250 | ✅ 正常 |

## 验证结果

✅ **23/23 测试通过 - 100% 符合 ERC-3643 官方标准**

## 网络

- **网络**: Unichain Sepolia
- **ChainID**: 1301
- **RPC**: `https://astrochain-sepolia.gateway.tenderly.co/5neqYQoinBsj3Cc3O36Dun`
- **浏览器**: https://sepolia.uniscan.xyz

## 官方参考

- [ERC-3643 规范](https://eips.ethereum.org/EIPS/eip-3643)
- [官方实现](https://github.com/ERC-3643/ERC-3643)
