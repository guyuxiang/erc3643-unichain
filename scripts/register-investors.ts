/**
 * 投资者注册脚本
 * 
 * 注册 3 个投资者：
 * - A: USA (840)
 * - B: France (250)  
 * - C: Germany (276)
 * 
 * 并铸造代币
 */

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("═══════════════════════════════════════════════════════════");
  console.log("   Investor Registration Script");
  console.log("═══════════════════════════════════════════════════════════\n");

  // Contract addresses from previous deployment
  const IDENTITY_REGISTRY = "0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9";
  const TOKEN = "0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51";

  // Investor addresses
  const INVESTOR_A = "0x1111111111111111111111111111111111111111";
  const INVESTOR_B = "0x2222222222222222222222222222222222222222";
  const INVESTOR_C = "0x3333333333333333333333333333333333333333";

  console.log("Investor A:", INVESTOR_A, "(USA - 840)");
  console.log("Investor B:", INVESTOR_B, "(France - 250)");
  console.log("Investor C:", INVESTOR_C, "(Germany - 276)");
  console.log("");

  // Attach to contracts
  const Identity = await ethers.getContractFactory("Identity");
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const Token = await ethers.getContractFactory("Token");

  const identityRegistry = await IdentityRegistry.attach(IDENTITY_REGISTRY);
  const token = await Token.attach(TOKEN);

  // ============================================================
  // Step 1: Deploy Identity contracts
  // ============================================================
  console.log("📦 Step 1: Deploying Identity contracts...");

  const identityA = await Identity.deploy(deployer.address, false);
  await identityA.deployed();
  console.log("   ✅ Identity A:", identityA.address);

  const identityB = await Identity.deploy(deployer.address, false);
  await identityB.deployed();
  console.log("   ✅ Identity B:", identityB.address);

  const identityC = await Identity.deploy(deployer.address, false);
  await identityC.deployed();
  console.log("   ✅ Identity C:", identityC.address);

  // ============================================================
  // Step 2: Register investors
  // ============================================================
  console.log("\n📝 Step 2: Registering investors...");

  // Register Investor A (USA)
  await identityRegistry.registerIdentity(INVESTOR_A, identityA.address, 840);
  console.log("   ✅ Registered A (USA, 840)");

  // Register Investor B (France)
  await identityRegistry.registerIdentity(INVESTOR_B, identityB.address, 250);
  console.log("   ✅ Registered B (France, 250)");

  // Register Investor C (Germany)
  await identityRegistry.registerIdentity(INVESTOR_C, identityC.address, 276);
  console.log("   ✅ Registered C (Germany, 276)");

  // ============================================================
  // Step 3: Verify registration
  // ============================================================
  console.log("\n🔍 Step 3: Verifying registration...");

  const isVerifiedA = await identityRegistry.isVerified(INVESTOR_A);
  const isVerifiedB = await identityRegistry.isVerified(INVESTOR_B);
  const isVerifiedC = await identityRegistry.isVerified(INVESTOR_C);

  console.log("   A verified:", isVerifiedA);
  console.log("   B verified:", isVerifiedB);
  console.log("   C verified:", isVerifiedC);

  const countryA = await identityRegistry.investorCountry(INVESTOR_A);
  const countryB = await identityRegistry.investorCountry(INVESTOR_B);
  const countryC = await identityRegistry.investorCountry(INVESTOR_C);

  console.log("   A country:", countryA.toString());
  console.log("   B country:", countryB.toString());
  console.log("   C country:", countryC.toString());

  // ============================================================
  // Step 4: Mint tokens
  // ============================================================
  console.log("\n💰 Step 4: Minting tokens...");

  // Mint 1,000,000 tokens to each investor (6 decimals)
  const MINT_AMOUNT = ethers.utils.parseUnits("1000000", 6);

  await token.mint(INVESTOR_A, MINT_AMOUNT);
  console.log("   ✅ Minted to A:", MINT_AMOUNT.toString());

  await token.mint(INVESTOR_B, MINT_AMOUNT);
  console.log("   ✅ Minted to B:", MINT_AMOUNT.toString());

  await token.mint(INVESTOR_C, MINT_AMOUNT);
  console.log("   ✅ Minted to C:", MINT_AMOUNT.toString());

  // ============================================================
  // Step 5: Check balances
  // ============================================================
  console.log("\n💵 Step 5: Checking balances...");

  const balanceA = await token.balanceOf(INVESTOR_A);
  const balanceB = await token.balanceOf(INVESTOR_B);
  const balanceC = await token.balanceOf(INVESTOR_C);

  console.log("   A balance:", ethers.utils.formatUnits(balanceA, 6), "RWA");
  console.log("   B balance:", ethers.utils.formatUnits(balanceB, 6), "RWA");
  console.log("   C balance:", ethers.utils.formatUnits(balanceC, 6), "RWA");

  // ============================================================
  // Summary
  // ============================================================
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("   REGISTRATION COMPLETE");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  console.log("📋 Identity Contracts:");
  console.log("   A:", identityA.address);
  console.log("   B:", identityB.address);
  console.log("   C:", identityC.address);
  
  console.log("\n📋 Token Balances:");
  console.log("   A:", ethers.utils.formatUnits(balanceA, 6), "RWA");
  console.log("   B:", ethers.utils.formatUnits(balanceB, 6), "RWA");
  console.log("   C:", ethers.utils.formatUnits(balanceC, 6), "RWA");
  
  console.log("\n═══════════════════════════════════════════════════════════");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
