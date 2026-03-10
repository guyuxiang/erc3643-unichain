# ERC-3643 Implementation on Unichain Sepolia

> Complete ERC-3643 (T-REX) standard token deployment

## Overview

This project implements the complete ERC-3643 standard for security tokens on Unichain Sepolia testnet.

## Project Structure

```
├── src/
│   ├── custom-modules/      # Custom compliance modules
│   │   ├── CountryRestrictModule.sol
│   │   └── ClaimVerifyModule.sol
│   ├── token/              # ERC-3643 Token contracts (from official repo)
│   └── registry/           # Identity & Claim registries (from official repo)
├── vendor/ERC-3643/       # Official ERC-3643 reference implementation
├── docs/                  # Documentation
└── foundry.toml           # Foundry configuration
```

## Deployed Contracts

| Contract | Address |
|----------|---------|
| Token | `0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51` |
| IdentityRegistry | `0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9` |
| ModularCompliance | `0x2eef320EaD21bE8c767761187496aB465bBC5Dd3` |
| CountryRestrictModule | `0xB0f9724bC0266D5bef81177C1eB885Ece483c528` |
| ClaimVerifyModule | `0x420Ab3260De911627B8b86110B835A92f8C40FC5` |
| ClaimTopicsRegistry | `0xCA17fF41E55F03CFef64d898a5f6106A562Ab29e` |
| TrustedIssuersRegistry | `0x622249bf42135e5C537E83def29141a9917B3d21` |
| ClaimIssuer | `0xAE4dbD1D32479038e69506a8543bc501D8C7f4eE` |

## Compliance Rules

| Country | Code | Rule |
|---------|------|------|
| USA | 840 | ❌ Cannot send |
| Germany | 276 | ❌ Cannot receive |
| France | 250 | ✅ Normal |

## Documentation

- [Implementation Guide](./docs/ERC3643_Implementation_Guide.md)
- [Test Report](./docs/ERC3643_Final_Report.md)

## Network

- **Network**: Unichain Sepolia
- **ChainID**: 1301
- **RPC**: `https://astrochain-sepolia.gateway.tenderly.co/5neqYQoinBsj3Cc3O36Dun`
- **Explorer**: https://sepolia.uniscan.xyz

## Test Results: 100% ✅

All components deployed and tested successfully.

## Official Reference

Based on: https://github.com/ERC-3643/ERC-3643

## Official Reference

The official ERC-3643 implementation is available at:
https://github.com/ERC-3643/ERC-3643
