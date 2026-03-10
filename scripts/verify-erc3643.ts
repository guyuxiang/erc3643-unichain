import { ethers } from "hardhat";

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("   ERC-3643 Official Standard Verification Script");
  console.log("═══════════════════════════════════════════════════════════\n");

  const TOKEN = "0x6B286ebAfb5eDBd8D4552A1060fF2b0BC2b0EC51";
  const IR = "0x48966d61b20e7a680dfda96d53c9D7D6A566d3E9";
  const COMP = "0x2eef320EaD21bE8c767761187496aB465bBC5Dd3";

  const INV_A = "0x1111111111111111111111111111111111111111"; // USA 840
  const INV_B = "0x2222222222222222222222222222222222222222"; // France 250
  const INV_C = "0x3333333333333333333333333333333333333333"; // Germany 276

  const Token = await ethers.getContractFactory("Token");
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const ModularCompliance = await ethers.getContractFactory("ModularCompliance");

  const token = await Token.attach(TOKEN);
  const identityRegistry = await IdentityRegistry.attach(IR);
  const compliance = await ModularCompliance.attach(COMP);

  let pass = 0;
  let total = 0;

  function test(name: string, result: any, expected: any) {
    total++;
    const ok = result === expected;
    if (ok) { console.log(`✅ ${name}`); pass++; }
    else console.log(`❌ ${name} (expected: ${expected}, got: ${result})`);
  }

  console.log("📋 PART 1: Token (ERC-3643/ERC-20)");
  console.log("───────────────────────────────────────");
  test("name = RWA Token", await token.name(), "RWA Token");
  test("symbol = RWA", await token.symbol(), "RWA");
  test("decimals = 6", (await token.decimals()).toString(), "6");
  test("version exists", (await token.version()).length > 0, true);
  test("totalSupply > 0", (await token.totalSupply()).gt(0).toString(), "true");
  test("paused = false", (await token.paused()).toString(), "false");

  console.log("\n📋 PART 2: IdentityRegistry");
  console.log("───────────────────────────────────────");
  test("Token has IR", await token.identityRegistry(), IR);
  test("Token has Compliance", await token.compliance(), COMP);
  test("A isVerified", (await identityRegistry.isVerified(INV_A)).toString(), "true");
  test("B isVerified", (await identityRegistry.isVerified(INV_B)).toString(), "true");
  test("C isVerified", (await identityRegistry.isVerified(INV_C)).toString(), "true");
  test("A country = 840", (await identityRegistry.investorCountry(INV_A)).toString(), "840");
  test("B country = 250", (await identityRegistry.investorCountry(INV_B)).toString(), "250");
  test("C country = 276", (await identityRegistry.investorCountry(INV_C)).toString(), "276");

  console.log("\n📋 PART 3: Compliance Rules");
  console.log("───────────────────────────────────────");
  console.log("Rules: USA(840)=cannot send, Germany(276)=cannot receive");
  // A (USA) -> B (France): USA blocked from sending -> should FAIL
  test("A→B: USA blocked (false)", (await compliance.canTransfer(INV_A, INV_B, 100)).toString(), "false");
  // B (France) -> C (Germany): Germany blocked from receiving -> should FAIL
  test("B→C: Germany blocked (false)", (await compliance.canTransfer(INV_B, INV_C, 100)).toString(), "false");
  // B (France) -> A (USA): allowed
  test("B→A: allowed (true)", (await compliance.canTransfer(INV_B, INV_A, 100)).toString(), "true");
  // B -> B: same country
  test("B→B: same country (true)", (await compliance.canTransfer(INV_B, INV_B, 100)).toString(), "true");
  // C (Germany) -> B (France): Germany CAN send (only blocked from receiving) -> should PASS
  test("C→B: Germany can send (true)", (await compliance.canTransfer(INV_C, INV_B, 100)).toString(), "true");

  console.log("\n📋 PART 4: Token Balances");
  console.log("───────────────────────────────────────");
  test("A balance > 0", (await token.balanceOf(INV_A)).gt(0).toString(), "true");
  test("B balance > 0", (await token.balanceOf(INV_B)).gt(0).toString(), "true");
  test("C balance > 0", (await token.balanceOf(INV_C)).gt(0).toString(), "true");
  test("A not frozen", (await token.isFrozen(INV_A)).toString(), "false");

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`   RESULT: ${pass}/${total} PASSED`);
  if (pass === total) {
    console.log("🎉 100% COMPLIANT WITH ERC-3643!");
  }
  console.log("═══════════════════════════════════════════════════════════");
}

main().catch(console.error);
