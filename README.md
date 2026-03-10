# ERC-3643 Implementation on Unichain Sepolia

> Complete ERC-3643 (T-REX) standard token deployment with full Claims verification

## Overview

This project implements the **complete** ERC-3643 standard for security tokens on Unichain Sepolia testnet, including:
- Full Identity (ONCHAINID) contracts
- Claims verification (KYC)
- Trusted Issuers Registry
- Compliance modules

## Deployed Contracts

| Contract | Address |
|----------|---------|
| Token | `0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51` |
| IdentityRegistry | `0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9` |
| ModularCompliance | `0x2eef320EaD21bE8c767761187496aB465bBC5Dd3` |
| ClaimTopicsRegistry | `0xCA17fF41E55F03CFef64d898a5f6106A562Ab29e` |
| TrustedIssuersRegistry | `0x622249bf42135e5C537E83def29141a9917B3d21` |
| ClaimIssuer | `0xDC3f95D359C3Fb6d906aF3291D8F7610c159950e` |

## Identity Contracts (ONCHAINID)

| Investor | Identity Address | Country | Claims |
|----------|-----------------|---------|--------|
| A (USA) | `0x41C861e3d535Bee3e991C73A73a5c9Ea428E3E5F` | 840 | ✅ KYC |
| B (France) | `0x71765Da072c89094A601a57B885b1bE185dF148B` | 250 | ✅ KYC |
| C (Germany) | `0x630c159d3aa8D57D3aCb45557e578aB834065837` | 276 | ✅ KYC |

## Compliance Rules

| Country | Code | Rule |
|---------|------|------|
| USA | 840 | ❌ Cannot send |
| Germany | 276 | ❌ Cannot receive |
| France | 250 | ✅ Normal |

## Full Claims Verification Flow

```
transferFrom(sender, receiver, amount)
    ↓
1. Token checks (paused, frozen, balance)
    ↓
2. IdentityRegistry.isVerified(receiver)
    ├── Get Identity contract
    ├── Check Claims exist (KYC Topic 1)
    └── Verify Claims signed by Trusted Issuer
    ↓
3. Compliance.canTransfer()
    └── CountryRestrictModule checks
```

## Test Results

| Test | Result |
|------|--------|
| isVerified(A) | ✅ true |
| isVerified(B) | ✅ true |
| isVerified(C) | ✅ true |
| A→B (blocked) | ✅ false |
| B→C (blocked) | ✅ false |
| B→A (allowed) | ✅ true |

## Network

- **Network**: Unichain Sepolia
- **ChainID**: 1301
- **RPC**: `https://astrochain-sepolia.gateway.tenderly.co/5neqYQoinBsj3Cc3O36Dun`
- **Explorer**: https://sepolia.uniscan.xyz

## Documentation

- [Full Implementation](./docs/ERC3643_Full_Implementation.md)

## Test Results: 100% ✅

## Official Reference

Based on: https://github.com/ERC-3643/ERC-3643
