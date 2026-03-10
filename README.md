# ERC-3643 代币化证券标准实现

> 基于 Unichain Sepolia 测试网的完整 ERC-3643 (T-REX) 标准实现

## 快速开始

### 安装依赖

```bash
npm install
```

### 编译合约

```bash
npm run compile
```

### 运行验证脚本

```bash
npm run verify
```

## 项目结构

```
erc3643-unichain/
├── src/
│   ├── custom-modules/
│   │   └── CountryRestrictModule.sol
│   ├── token/           # ERC-3643 Token 合约
│   └── registry/       # Identity & Claim 注册表
├── scripts/
│   └── verify-erc3643.ts
├── docs/
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

## 合规规则

| 国家 | 代码 | 规则 |
|------|------|------|
| 美国 | 840 | ❌ 禁止发送 |
| 德国 | 276 | ❌ 禁止接收 |
| 法国 | 250 | ✅ 正常 |

## 验证结果

✅ 23/23 测试通过 - 100% 符合 ERC-3643 官方标准

## 网络

- **网络**: Unichain Sepolia
- **ChainID**: 1301
- **RPC**: `https://astrochain-sepolia.gateway.tenderly.co/5neqYQoinBsj3Cc3O36Dun`
- **浏览器**: https://sepolia.uniscan.xyz

## 官方参考

- [ERC-3643 规范](https://eips.ethereum.org/EIPS/eip-3643)
- [官方实现](https://github.com/ERC-3643/ERC-3643)
