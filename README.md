# ERC-3643 Official Implementation - Unichain Sepolia

> Complete ERC-3643 standard token deployment on Unichain Sepolia testnet

## Overview

This project implements the complete ERC-3643 (T-REX) standard for security tokens, including:
- Identity Registry with KYC
- Claim Topics Registry
- Trusted Issuers Registry
- Modular Compliance with country restrictions
- Claim verification

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

## Documentation

- [Implementation Guide](./docs/ERC3643_Implementation_Guide.md)
- [Complete Test Report](./docs/ERC3643_Complete_Test_Report.md)

## Network

- **Network**: Unichain Sepolia
- **ChainID**: 1301
- **RPC**: `https://astrochain-sepolia.gateway.tenderly.co/5neqYQoinBsj3Cc3O36Dun`
- **Explorer**: https://sepolia.uniscan.xyz

## Compliance Rules

| Country | Code | Rule |
|---------|------|------|
| USA | 840 | ❌ Cannot send |
| Germany | 276 | ❌ Cannot receive |
| France | 250 | ✅ Normal |

## Test Results: 100% Pass

- Token configuration: ✅
- Identity Registry: ✅
- KYC Registration: ✅
- Token Minting: ✅
- Claim Topics: ✅
- Trusted Issuers: ✅
- Claims Verification: ✅
- Compliance Rules: ✅

## Explorer Links

- [Token](https://sepolia.uniscan.xyz/address/0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51)
- [IdentityRegistry](https://sepolia.uniscan.xyz/address/0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9)
- [ModularCompliance](https://sepolia.uniscan.xyz/address/0x2eef320EaD21bE8c767761187496aB465bBC5Dd3)
