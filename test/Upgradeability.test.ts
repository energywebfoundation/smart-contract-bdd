import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe('Upgradeability tests', function () {
  it('should successfully upgrade contract', async () => {
    const KycTokenUpgradeable = await ethers.getContractFactory("KycTokenUpgradeable")
    const kycToken = await upgrades.deployProxy(KycTokenUpgradeable, ["KYC Token", "KCT"]);

    const firstVersion = await kycToken.version();

    expect(firstVersion).to.equal('v0.1');

    const KycTokenUpgradeTest = await ethers.getContractFactory("KycTokenUpgradeTest");
    const upgradedKycToken = await upgrades.upgradeProxy(kycToken.address, KycTokenUpgradeTest);

    const secondVersion = await upgradedKycToken.version();

    expect(secondVersion).to.equal('v0.2');
  });

});
