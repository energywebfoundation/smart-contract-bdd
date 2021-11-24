/**
 * This script is used to generate a new (different) contract
 * that is used in the upgradeability tests.
 * 
 * It creates a new contract that's different than the original,
 * and then it is deleted after the test passes.
 */

const fs = require('fs');

const kycTokenContract = fs.readFileSync('./contracts/kyc-token-upgradeable.sol', 'utf8');

// Creates a different copy of the KycToken contract
const upgradedKycTokenContract = kycTokenContract
    .replace(`contract KycTokenUpgradeable is `, `contract KycTokenUpgradeTest is `)
    .replace(`return "v0.1";`, `return "v0.2";`);

fs.writeFileSync('./contracts/kyc-token-upgrade-test.sol', upgradedKycTokenContract);
