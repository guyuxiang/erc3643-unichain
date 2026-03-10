# 合约验证指南

## 手动验证 (推荐)

由于 Blockscout API 不稳定，建议手动验证：

### 步骤 1: 打开验证页面

访问任一合约的 Unican 页面，点击 "Verify & Publish"

例如: https://sepolia.uniscan.xyz/address/0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51

### 步骤 2: 选择验证方式

选择 "Solidity (Single File)" 

### 步骤 3: 填写参数

| 参数 | 值 |
|------|-----|
| Compiler | v0.8.17 |
| EVM Version | default |
| Optimization | ✅ Enabled |
| Runs | 200 |

### 步骤 4: 上传源码

从 `src/` 目录选择对应合约:

| 合约 | 源码文件 |
|------|-----------|
| Token | `src/token/Token.sol` |
| IdentityRegistry | `src/registry/implementation/IdentityRegistry.sol` |
| ModularCompliance | `src/compliance/modular/ModularCompliance.sol` |
| CountryRestrictModule | `src/custom-modules/CountryRestrictModule.sol` |
| ClaimTopicsRegistry | `src/registry/implementation/ClaimTopicsRegistry.sol` |
| TrustedIssuersRegistry | `src/registry/implementation/TrustedIssuersRegistry.sol` |

## 已部署合约

```
Token:                    0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51
IdentityRegistry:        0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9
ModularCompliance:       0x2eef320EaD21bE8c767761187496aB465bBC5Dd3
CountryRestrictModule:   0xB0f9724bC0266D5bef81177C1eB885Ece483c528
ClaimTopicsRegistry:    0xCA17fF41E55F03CFef64d898a5f6106A562Ab29e
TrustedIssuersRegistry: 0x622249bf42135e5C537E83def29141a9917B3d21
```

## API 验证 (备选)

如果 Blockscout API 恢复，可以使用:

```bash
# 验证 Token
curl -X POST "https://blockscout.com/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51",
    "sourceCode": "$(cat src/token/Token.sol)",
    "compilerVersion": "v0.8.17+commit.8df45f5f",
    "optimization": true,
    "optimizationRuns": 200
  }'
```

## 使用 Etherscan API Key 验证

如果您有 Etherscan API key，可以配置 hardhat-verify:

```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

然后运行:
```bash
npx hardhat verify --network unichain <CONTRACT_ADDRESS>
```

## Etherscan API V2 测试结果

### 测试结果

```json
{"status":"0","message":"NOTOK","result":"Error!"}
```

### 问题

Etherscan API V2 虽然支持 Unichain Sepolia (chainid: 1301)，但验证功能返回通用错误。

### 原因

- Unichain Sepolia 使用 Blockscout 作为浏览器
- Etherscan API 对 Multichain 的验证支持有限

### 建议

**推荐手动验证**:
1. 打开 https://sepolia.uniscan.xyz/address/0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51
2. 点击 Contract → Verify & Publish
3. 上传源码

或者使用 Tenderly 进行验证（如果有 Tenderly 账户）。
