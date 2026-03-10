/**
 * ERC-3643 完整部署脚本
 * 
 * 部署所有必需的 ERC-3643 组件：
 * 1. ClaimTopicsRegistry
 * 2. TrustedIssuersRegistry
 * 3. IdentityRegistryStorage
 * 4. IdentityRegistry
 * 5. ModularCompliance
 * 6. CountryRestrictModule
 * 7. Token
 */

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("═══════════════════════════════════════════════════════════");
  console.log("   ERC-3643 Full Deployment Script");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  console.log("Deployer:", deployer.address);
  console.log("");

  // ============================================================
  // Step 1: Deploy ClaimTopicsRegistry
  // ============================================================
  console.log("📦 Step 1: Deploying ClaimTopicsRegistry...");
  const ClaimTopicsRegistry = await ethers.getContractFactory("ClaimTopicsRegistry");
  const claimTopicsRegistry = await ClaimTopicsRegistry.deploy();
  await claimTopicsRegistry.deployed();
  await claimTopicsRegistry.init();
  console.log("   ✅ ClaimTopicsRegistry:", claimTopicsRegistry.address);

  // Add claim topics
  await claimTopicsRegistry.addClaimTopic(1); // KYC
  await claimTopicsRegistry.addClaimTopic(2); // AML
  await claimTopicsRegistry.addClaimTopic(3); // Accredited
  await claimTopicsRegistry.addClaimTopic(4); // Country
  console.log("   ✅ Added Claim Topics: [1, 2, 3, 4]");

  // ============================================================
  // Step 2: Deploy TrustedIssuersRegistry
  // ============================================================
  console.log("\n📦 Step 2: Deploying TrustedIssuersRegistry...");
  const TrustedIssuersRegistry = await ethers.getContractFactory("TrustedIssuersRegistry");
  const trustedIssuersRegistry = await TrustedIssuersRegistry.deploy();
  await trustedIssuersRegistry.deployed();
  await trustedIssuersRegistry.init();
  console.log("   ✅ TrustedIssuersRegistry:", trustedIssuersRegistry.address);

  // ============================================================
  // Step 3: Deploy IdentityRegistryStorage
  // ============================================================
  console.log("\n📦 Step 3: Deploying IdentityRegistryStorage...");
  const IdentityRegistryStorage = await ethers.getContractFactory("IdentityRegistryStorage");
  const identityRegistryStorage = await IdentityRegistryStorage.deploy();
  await identityRegistryStorage.deployed();
  await identityRegistryStorage.init();
  console.log("   ✅ IdentityRegistryStorage:", identityRegistryStorage.address);

  // ============================================================
  // Step 4: Deploy IdentityRegistry
  // ============================================================
  console.log("\n📦 Step 4: Deploying IdentityRegistry...");
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.deployed();
  await identityRegistry.init(
    trustedIssuersRegistry.address,
    claimTopicsRegistry.address,
    identityRegistryStorage.address
  );
  await identityRegistry.addAgent(deployer.address);
  console.log("   ✅ IdentityRegistry:", identityRegistry.address);

  // Bind IdentityRegistry to Storage
  await identityRegistryStorage.bindIdentityRegistry(identityRegistry.address);
  console.log("   ✅ Bound IdentityRegistry to Storage");

  // ============================================================
  // Step 5: Deploy ModularCompliance
  // ============================================================
  console.log("\n📦 Step 5: Deploying ModularCompliance...");
  const ModularCompliance = await ethers.getContractFactory("ModularCompliance");
  const modularCompliance = await ModularCompliance.deploy();
  await modularCompliance.deployed();
  await modularCompliance.init();
  console.log("   ✅ ModularCompliance:", modularCompliance.address);

  // ============================================================
  // Step 6: Deploy and configure CountryRestrictModule
  // ============================================================
  console.log("\n📦 Step 6: Deploying CountryRestrictModule...");
  const CountryRestrictModule = await ethers.getContractFactory("CountryRestrictModule");
  const countryRestrictModule = await CountryRestrictModule.deploy();
  await countryRestrictModule.deployed();
  await countryRestrictModule.initialize();
  console.log("   ✅ CountryRestrictModule:", countryRestrictModule.address);

  // Add module to compliance
  await modularCompliance.addModule(countryRestrictModule.address);
  console.log("   ✅ Added module to Compliance");

  // Configure restrictions
  // USA (840) cannot send
  await countryRestrictModule.blockSenderCountry(modularCompliance.address, 840);
  // Germany (276) cannot receive
  await countryRestrictModule.blockReceiverCountry(modularCompliance.address, 276);
  await countryRestrictModule.enableCountryRestrictions(modularCompliance.address);
  console.log("   ✅ Configured: USA=block send, Germany=block receive");

  // ============================================================
  // Step 7: Deploy Token
  // ============================================================
  console.log("\n📦 Step 7: Deploying Token...");
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  
  // Initialize Token
  await token.init(
    identityRegistry.address,
    modularCompliance.address,
    "RWA Token",
    "RWA",
    6,
    ethers.constants.AddressZero
  );
  console.log("   ✅ Token:", token.address);

  // Bind token to compliance
  await modularCompliance.bindToken(token.address);
  console.log("   ✅ Bound Token to Compliance");

  // Add deployer as agent and unpause
  await token.addAgent(deployer.address);
  await token.unpause();
  console.log("   ✅ Agent added, Token unpaused");

  // ============================================================
  // Summary
  // ============================================================
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("   DEPLOYMENT SUMMARY");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  console.log("📋 Core Contracts:");
  console.log("   Token:              ", token.address);
  console.log("   IdentityRegistry:   ", identityRegistry.address);
  console.log("   ModularCompliance:  ", modularCompliance.address);
  console.log("   ClaimTopicsRegistry:", claimTopicsRegistry.address);
  console.log("   TrustedIssuersRegistry:", trustedIssuersRegistry.address);
  console.log("   IdentityRegistryStorage:", identityRegistryStorage.address);
  console.log("   CountryRestrictModule:", countryRestrictModule.address);
  
  console.log("\n📋 Claim Topics: [1, 2, 3, 4]");
  console.log("📋 Compliance Rules:");
  console.log("   - USA (840): Cannot send");
  console.log("   - Germany (276): Cannot receive");
  console.log("   - France (250): Normal");
  
  console.log("\n═══════════════════════════════════════════════════════════");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
