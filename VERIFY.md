# 合约验证指南

## 已部署合约

以下合约已在 Unichain Sepolia 测试网部署，可以在 Blockscout (Uniscan) 上手动验证：

| 序号 | 合约 | 地址 | 编译器 |
|------|------|------|--------|
| 1 | Token | `0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51` | v0.8.17 |
| 2 | IdentityRegistry | `0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9` | v0.8.17 |
| 3 | ModularCompliance | `0x2eef320EaD21bE8c767761187496aB465bBC5Dd3` | v0.8.17 |
| 4 | CountryRestrictModule | `0xB0f9724bC0266D5bef81177C1eB885Ece483c528` | v0.8.17 |
| 5 | ClaimTopicsRegistry | `0xCA17fF41E55F03CFef64d898a5f6106A562Ab29e` | v0.8.17 |
| 6 | TrustedIssuersRegistry | `0x622249bf42135e5C537E83def29141a9917B3d21` | v0.8.17 |

## 手动验证步骤

1. 打开 https://sepolia.uniscan.xyz
2. 搜索合约地址
3. 点击 "Contract" → "Verify & Publish"
4. 选择以下参数：
   - Compiler: v0.8.17
   - Optimization: Yes (200 runs)
   - Contract: 选择对应的合约源码
5. 点击 "Verify"

## 合约源码位置

| 合约 | 源码位置 |
|------|----------|
| Token | `src/token/Token.sol` |
| IdentityRegistry | `src/registry/implementation/IdentityRegistry.sol` |
| ModularCompliance | `src/compliance/modular/ModularCompliance.sol` |
| CountryRestrictModule | `src/custom-modules/CountryRestrictModule.sol` |
| ClaimTopicsRegistry | `src/registry/implementation/ClaimTopicsRegistry.sol` |
| TrustedIssuersRegistry | `src/registry/implementation/TrustedIssuersRegistry.sol` |

## Blockscan API 验证

如果使用 API 验证：

```bash
# 验证 Token
curl -X POST "https://sepolia.uniscan.xyz/api/contract_verifications" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51",
    "compiler_version": "v0.8.17+commit.8df45f5f",
    "optimization": true,
    "optimization_runs": 200,
    "source_code": "$(cat src/token/Token.sol)"
  }'
```
