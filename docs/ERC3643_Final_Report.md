# ERC-3643 完整测试报告 - Claims 签发与验证

> Unichain Sepolia | 2026-03-10

---

## 一、新增组件

### 1.1 ClaimIssuer 合约

| 合约 | 地址 |
|------|------|
| **ClaimIssuer** | `0xAE4dbD1D32479038e69506a8543bc501D8C7f4eE` |

### 1.2 ClaimVerifyModule 合规模块

| 合约 | 地址 |
|------|------|
| **ClaimVerifyModule** | `0x420Ab3260De911627B8b86110B835A92f8C40FC5` |

---

## 二、完整 ERC-3643 架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Token (0x6B28...)                           │
│                      name: RWA Token, symbol: RWA                  │
└─────────────────────────────────────────────────────────────────────┘
                    ↓                                    ↓
┌────────────────────────────────┐    ┌────────────────────────────────┐
│      IdentityRegistry          │    │      ModularCompliance        │
│      (0x48966d6...)           │    │      (0x2eef3...)             │
│                                │    │                                │
│  A(USA,840) ✓  B(France,250)✓ │    │  Modules:                     │
│  C(Germany,276) ✓              │    │  1. CountryRestrictModule    │
│                                │    │  2. ClaimVerifyModule        │
└────────────────────────────────┘    └────────────────────────────────┘
         ↓                                    ↓
┌────────────────────────────────┐    ┌────────────────────────────────┐
│   ClaimTopicsRegistry          │    │   ClaimVerifyModule            │
│   (0xCA17fF...)               │    │   (0x420Ab3...)               │
│                                │    │                                │
│  Topics: [1,2,3,4]           │    │  Verified Claims:               │
│  1:KYC 2:AML 3:Accr 4:Country│    │  A ✓  B ✓  C ✓               │
└────────────────────────────────┘    └────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│  TrustedIssuersRegistry        │
│  (0x622249...)                │
│                                │
│  Issuers:                     │
│  - ClaimIssuer (0xAE4d...)   │
│    Topics: [1,2,3,4]         │
└────────────────────────────────┘
```

---

## 三、Claims 签发与验证流程

### 3.1 完整流程

```
1. 发行方设置 Claim Topics [1,2,3,4]
          ↓
2. 部署可信发行者 (ClaimIssuer)
          ↓
3. 将 ClaimIssuer 添加到 TrustedIssuersRegistry
          ↓
4. 部署 ClaimVerifyModule 并添加到 Compliance
          ↓
5. 验证投资者 Claims (KYC Topic 1)
          ↓
6. 转账时自动验证 Claims + 国别限制
```

### 3.2 测试结果

#### Claim 验证测试

| 投资者 | KYC (Topic 1) | 状态 |
|--------|---------------|------|
| A (USA) | ✅ 验证通过 | ✅ |
| B (France) | ✅ 验证通过 | ✅ |
| C (Germany) | ✅ 验证通过 | ✅ |

#### 合规规则测试 (Claims + 国别)

| 测试 | 发送方 | 接收方 | 规则 | 结果 | 状态 |
|------|--------|--------|------|------|------|
| 1 | A (USA) | B (France) | USA禁止发送 | ❌ 阻止 | ✅ |
| 2 | B (France) | C (Germany) | Germany禁止接收 | ❌ 阻止 | ✅ |
| 3 | B (France) | A (USA) | 允许 | ✅ 允许 | ✅ |

---

## 四、完整合约清单

| # | 合约 | 地址 |
|---|------|------|
| 1 | Token | `0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51` |
| 2 | IdentityRegistry | `0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9` |
| 3 | ModularCompliance | `0x2eef320EaD21bE8c767761187496aB465bBC5Dd3` |
| 4 | CountryRestrictModule | `0xB0f9724bC0266D5bef81177C1eB885Ece483c528` |
| 5 | ClaimVerifyModule | `0x420Ab3260De911627B8b86110B835A92f8C40FC5` |
| 6 | ClaimTopicsRegistry | `0xCA17fF41E55F03CFef64d898a5f6106A562Ab29e` |
| 7 | TrustedIssuersRegistry | `0x622249bf42135e5C537E83def29141a9917B3d21` |
| 8 | ClaimIssuer | `0xAE4dbD1D32479038e69506a8543bc501D8C7f4eE` |

---

## 五、测试通过率

| 测试类别 | 通过/总数 | 状态 |
|----------|----------|------|
| Token 配置 | 4/4 | ✅ |
| IdentityRegistry | 3/3 | ✅ |
| 代币余额 | 3/3 | ✅ |
| Claim Topics | 4/4 | ✅ |
| Trusted Issuers | 2/2 | ✅ |
| Claims 验证 | 3/3 | ✅ |
| 合规规则 | 3/3 | ✅ |

**总计: 22/22 (100%)** 🎉

---

## 六、Explorer 链接

- Token: https://sepolia.uniscan.xyz/address/0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51
- ClaimIssuer: https://sepolia.uniscan.xyz/address/0xAE4dbD1D32479038e69506a8543bc501D8C7f4eE

---

## 七、结论

✅ 所有 ERC-3643 官方标准组件已部署
✅ Claims 签发流程已实现
✅ Claim 验证模块已添加
✅ 完整合规测试通过 (100%)

**完全符合 ERC-3643 官方规范**

---

*报告生成: 2026-03-10*
*网络: Unichain Sepolia (ChainID: 1301)*
