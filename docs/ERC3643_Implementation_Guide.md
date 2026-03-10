# ERC-3643 官方标准合约实施指南

> Unichain Sepolia 测试网部署完整记录

---

## 一、项目概述

本指南记录在 Unichain Sepolia (ChainID: 1301) 上部署 ERC-3643 官方标准合约的完整流程。

### 网络配置

| 参数 | 值 |
|------|-----|
| 网络 | Unichain Sepolia |
| ChainID | 1301 |
| RPC | `https://astrochain-sepolia.gateway.tenderly.co/5neqYQoinBsj3Cc3O36Dun` |
| 浏览器 | https://sepolia.uniscan.xyz |

### 仓库

```bash
git clone https://github.com/ERC-3643/ERC-3643.git
cd ERC-3643
npm install
```

---

## 二、部署合约清单

### 2.1 最终部署地址

| 合约 | 地址 | 用途 |
|------|------|------|
| **Token** | `0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51` | ERC-3643 代币 |
| **IdentityRegistry** | `0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9` | 身份注册表 |
| **ModularCompliance** | `0x2eef320EaD21bE8c767761187496aB465bBC5Dd3` | 模块化合规引擎 |
| **CountryRestrictModule** | `0xB0f9724bC0266D5bef81177C1eB885Ece483c528` | 国别限制模块 |
| **ClaimTopicsRegistry** | `0x2aaEccECE9d921d58758E44583C73d894a9e8E7e` | 声明主题注册表 |
| **TrustedIssuersRegistry** | `0x00FF6788A7093B98E3C50A4606a770811A4b443C` | 可信发行者注册表 |
| **IdentityRegistryStorage** | `0x977a79AE6c5a5d5763205f3826bA8820f095D283` | 身份存储 |

### 2.2 Identity 合约（每个投资者）

| 投资者 | 国家 | Identity 地址 |
|--------|------|--------------|
| A | USA (840) | 部署时创建 |
| B | France (250) | 部署时创建 |
| C | Germany (276) | 部署时创建 |

---

## 三、部署步骤

### 3.1 环境准备

```bash
# 1. 克隆仓库
git clone https://github.com/ERC-3643/ERC-3643.git
cd ERC-3643
npm install

# 2. 配置网络 (hardhat.config.ts)
```

### 3.2 hardhat.config.ts 配置

```typescript
import '@xyrusworx/hardhat-solidity-json';
import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';
import '@openzeppelin/hardhat-upgrades';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    unichain: {
      url: 'https://astrochain-sepolia.gateway.tenderly.co/5neqYQoinBsj3Cc3O36Dun',
      accounts: ['PRIVATE_KEY'],
      chainId: 1301,
    },
  },
};
export default config;
```

### 3.3 自定义合规模块 (CountryRestrictModule)

创建 `contracts/compliance/modular/modules/CountryRestrictModule.sol`:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "../IModularCompliance.sol";
import "../../../registry/interface/IIdentityRegistry.sol";
import "../../../token/IToken.sol";
import "./AbstractModuleUpgradeable.sol";

contract CountryRestrictModule is AbstractModuleUpgradeable {
    mapping(address => mapping(uint16 => bool)) private _blockedSenderCountries;
    mapping(address => mapping(uint16 => bool)) private _blockedReceiverCountries;
    mapping(address => bool) private _countryRestrictionsEnabled;

    function initialize() external initializer {
        __AbstractModule_init();
    }

    function moduleCheck(
        address _from,
        address _to,
        uint256 _value,
        address _compliance
    ) external view override returns (bool) {
        if (_from == address(0)) return true; // Allow minting
        if (!_countryRestrictionsEnabled[_compliance]) return true;

        IModularCompliance compliance = IModularCompliance(_compliance);
        address token = compliance.getTokenBound();
        IToken tokenContract = IToken(token);
        IIdentityRegistry identityRegistry = tokenContract.identityRegistry();
        
        uint16 fromCountry = identityRegistry.investorCountry(_from);
        uint16 toCountry = identityRegistry.investorCountry(_to);

        if (_blockedSenderCountries[_compliance][fromCountry]) return false;
        if (_blockedReceiverCountries[_compliance][toCountry]) return false;
        return true;
    }

    function enableCountryRestrictions(address _compliance) external onlyOwner {
        _countryRestrictionsEnabled[_compliance] = true;
    }

    function blockSenderCountry(address _compliance, uint16 _country) external onlyOwner {
        _blockedSenderCountries[_compliance][_country] = true;
    }

    function blockReceiverCountry(address _compliance, uint16 _country) external onlyOwner {
        _blockedReceiverCountries[_compliance][_country] = true;
    }

    function moduleTransferAction(address, address, uint256) external override onlyComplianceCall {}
    function moduleMintAction(address, uint256) external override onlyComplianceCall {}
    function moduleBurnAction(address, uint256) external override onlyComplianceCall {}
    function canComplianceBind(address) external pure returns (bool) { return true; }
    function isPlugAndPlay() external pure returns (bool) { return true; }
    function name() public pure returns (string memory) { return "CountryRestrictModule"; }
}
```

### 3.4 完整部署脚本

```typescript
// scripts/deploy-with-compliance.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // 1. 部署 ClaimTopicsRegistry
  const ClaimTopicsRegistry = await ethers.getContractFactory("ClaimTopicsRegistry");
  const ctr = await ClaimTopicsRegistry.deploy();

  // 2. 部署 TrustedIssuersRegistry
  const TrustedIssuersRegistry = await ethers.getContractFactory("TrustedIssuersRegistry");
  const tir = await TrustedIssuersRegistry.deploy();

  // 3. 部署 IdentityRegistryStorage
  const IdentityRegistryStorage = await ethers.getContractFactory("IdentityRegistryStorage");
  const irStorage = await IdentityRegistryStorage.deploy();
  await irStorage.init();

  // 4. 部署 IdentityRegistry
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const ir = await IdentityRegistry.deploy();
  await ir.init(tir.address, ctr.address, irStorage.address);
  await ir.addAgent(deployer.address);
  await irStorage.bindIdentityRegistry(ir.address);

  // 5. 部署 ModularCompliance
  const ModularCompliance = await ethers.getContractFactory("ModularCompliance");
  const compliance = await ModularCompliance.deploy();
  await compliance.init();

  // 6. 部署 CountryRestrictModule
  const CountryRestrictModule = await ethers.getContractFactory("CountryRestrictModule");
  const countryModule = await CountryRestrictModule.deploy();
  await countryModule.initialize();

  // 7. 配置合规规则
  await compliance.addModule(countryModule.address);
  await countryModule.enableCountryRestrictions(compliance.address);
  await countryModule.blockSenderCountry(compliance.address, 840);  // USA 禁止发送
  await countryModule.blockReceiverCountry(compliance.address, 276); // Germany 禁止接收

  // 8. 部署 Token
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.init(ir.address, compliance.address, "RWA Token", "RWA", 6, ethers.constants.AddressZero);

  // 9. 绑定 Token 到 Compliance
  await compliance.bindToken(token.address);

  // 10. 添加 Agent 并铸造代币
  await token.addAgent(deployer.address);
  await token.unpause();

  // 11. 部署 Identity 合约并注册投资者
  const Identity = await ethers.getContractFactory("Identity");
  const idA = await Identity.deploy(deployer.address, false);
  const idB = await Identity.deploy(deployer.address, false);
  const idC = await Identity.deploy(deployer.address, false);
  
  await ir.registerIdentity(investorA, idA.address, 840); // USA
  await ir.registerIdentity(investorB, idB.address, 250); // France
  await ir.registerIdentity(investorC, idC.address, 276); // Germany

  // 12. 铸造代币
  await token.mint(investorA, 1000000);
  await token.mint(investorB, 1000000);
  await token.mint(investorC, 1000000);
}

main().catch(console.error);
```

### 3.5 运行部署

```bash
npx hardhat run scripts/deploy-with-compliance.ts --network unichain
```

---

## 四、合规规则配置

### 4.1 国别代码 (ISO-3166)

| 国家 | 代码 |
|------|------|
| USA | 840 |
| France | 250 |
| Germany | 276 |

### 4.2 当前规则

```
USA (840):     禁止发送 (blockSenderCountry)
Germany (276): 禁止接收 (blockReceiverCountry)  
France (250):  允许转账
```

---

## 五、验证步骤

### 5.1 验证合约部署

```bash
# Token 信息
cast call <TOKEN> "name()(string)" --rpc-url <RPC>
cast call <TOKEN> "symbol()(string)" --rpc-url <RPC>
cast call <TOKEN> "decimals()(uint8)" --rpc-url <RPC>

# IdentityRegistry 验证
cast call <IR> "isVerified(address)" <INVESTOR> --rpc-url <RPC>
cast call <IR> "investorCountry(address)" <INVESTOR> --rpc-url <RPC>

# 余额查询
cast call <TOKEN> "balanceOf(address)" <INVESTOR> --rpc-url <RPC>
```

### 5.2 合规测试

```bash
# 测试 canTransfer
cast call <COMPLIANCE> "canTransfer(address,address,uint256)" <FROM> <TO> <AMOUNT> --rpc-url <RPC>
# 返回 true = 允许, false = 阻止
```

---

## 六、常见问题

### Q1: "AgentRole: caller does not have the Agent role"

**解决**: 添加部署者为 Agent
```typescript
await identityRegistry.addAgent(deployer.address);
await token.addAgent(deployer.address);
```

### Q2: "Pausable: paused"

**解决**: 解除暂停
```typescript
await token.unpause();
```

### Q3: IdentityRegistryStorage owner 为 0

**解决**: 初始化 Storage
```typescript
await identityRegistryStorage.init();
```

---

## 七、Explorer 链接

| 合约 | Explorer |
|------|----------|
| Token | https://sepolia.uniscan.xyz/address/0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51 |
| IdentityRegistry | https://sepolia.uniscan.xyz/address/0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9 |
| ModularCompliance | https://sepolia.uniscan.xyz/address/0x2eef320EaD21bE8c767761187496aB465bBC5Dd3 |

---

## 八、总结

本指南提供了在 Unichain Sepolia 测试网上部署 ERC-3643 官方标准合约的完整流程，包括：

1. ✅ 核心合约部署 (Token, IdentityRegistry, ModularCompliance)
2. ✅ 自定义合规模块 (CountryRestrictModule)
3. ✅ 国别转账限制配置
4. ✅ KYC 投资者注册
5. ✅ 代币铸造与分发

**关键地址**: `0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51`

---

*最后更新: 2026-03-10*
