import {expect, use} from "chai";
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import KycTokenContract from "../artifacts/contracts/kyc-token.sol/KycToken.json";
import {KycToken} from "../src/types"
import {Wallet} from "ethers";

use(solidity);

// Start test block
describe('KYC-Token', function () {
  let wallets: Wallet[]
  let kyct: KycToken

  beforeEach(async function () {
    wallets = new MockProvider().getWallets();
    kyct = (await deployContract(wallets[0], KycTokenContract, ["KYC Token", "KCT"])) as KycToken;
    await kyct.deployed();
  });

  // Test case
  it('has address 0 as owner', async function () {
    expect((await kyct.owner()).toString()).to.equal(wallets[0].address);
  });

  it('allows the owner to mint', async function () {
    await kyct.mint(wallets[1].address, '10000000000000000000')
    expect((await kyct.balanceOf(wallets[1].address)).toString()).to.equal('10000000000000000000')
  })

  it('allows the owner to transfer without KYC', async function () {
    await kyct.mint(wallets[1].address, '10000000000000000000')
    await kyct.transferFrom(wallets[1].address, wallets[2].address, '1000000000000000000')
    expect((await kyct.balanceOf(wallets[2].address)).toString()).to.equal('1000000000000000000')
  })

  it('does not allow address 1 to mint tokens', async function () {
    await expect(kyct.connect(wallets[1]).mint(wallets[1].address, '10000000000000000000'))
      .to.be.revertedWith("Ownable: caller is not the owner")
  })

  it('does not allow address 1 to burn tokens from address 2', async function () {
    await expect(kyct.connect(wallets[1]).burnFrom(wallets[2].address, '10000000000000000000'))
      .to.be.revertedWith("Ownable: caller is not the owner")
  })

  it('does not allow address 1 to transfer tokens before being Kyced', async function () {
    await expect(kyct.connect(wallets[1]).transfer(wallets[2].address, '10000000000000000000'))
      .to.be.revertedWith("account not Kyced")
  })

  it('does not allow address 1 to transfer tokens before being Kyced', async function () {
    await expect(kyct.connect(wallets[1]).transferFrom(wallets[2].address, wallets[3].address, '10000000000000000000'))
      .to.be.revertedWith("account not Kyced")
  })

  it('does not allow address 1 to Kyc itself', async function () {
    await expect(kyct.connect(wallets[1]).setKyc(wallets[1].address, true))
      .to.be.revertedWith("Ownable: caller is not the owner")
  })

  it('allows owner to KYC address1', async function () {
    await kyct.setKyc(wallets[1].address, true)
    expect((await kyct.kyced(wallets[1].address)).toString()).to.equal('true')
  })

  it('allows owner to un KYC address2', async function () {
    await kyct.setKyc(wallets[2].address, true)
    expect((await kyct.kyced(wallets[2].address)).toString()).to.equal('true')
    await kyct.setKyc(wallets[2].address, false)
    expect((await kyct.kyced(wallets[2].address)).toString()).to.equal('false')
  })

  describe('minting, transfer and burning', function () {
    beforeEach(async function () {
      await kyct.mint(wallets[1].address, '10000000000000000000')
      await kyct.mint(wallets[2].address, '10000000000000000000')
      await kyct.setKyc(wallets[1].address, true)
      await kyct.setKyc(wallets[2].address, true)
      expect((await kyct.balanceOf(wallets[1].address)).toString()).to.equal('10000000000000000000')
      expect((await kyct.kyced(wallets[1].address)).toString()).to.equal('true')
      expect((await kyct.balanceOf(wallets[2].address)).toString()).to.equal('10000000000000000000')
      expect((await kyct.kyced(wallets[2].address)).toString()).to.equal('true')
    })

    it('allows a user to transfer their own tokens', async function () {
      await kyct.connect(wallets[1]).transfer(wallets[3].address, '1000000000000000000')
      expect((await kyct.balanceOf(wallets[3].address)).toString()).to.equal('1000000000000000000')
    })

    it('allows account1 to burn its own tokens', async function () {
      await kyct.connect(wallets[1]).burn('1000000000000000000')
      expect((await kyct.balanceOf(wallets[1].address)).toString()).to.equal('9000000000000000000')
    })

    it('allows account0 to burn tokens of account1', async function () {
      await kyct.connect(wallets[0]).burnFrom(wallets[1].address, '1000000000000000000')
      expect((await kyct.balanceOf(wallets[1].address)).toString()).to.equal('9000000000000000000')
    })

    it('allows address0 to transfer all the tokens from account1 and account2', async function () {
      await kyct.transferFrom(wallets[1].address, wallets[3].address, '10000000000000000000')
      expect((await kyct.balanceOf(wallets[3].address)).toString()).to.equal('10000000000000000000')

      await kyct.transferFrom(wallets[2].address, wallets[4].address, '10000000000000000000')
      expect((await kyct.balanceOf(wallets[4].address)).toString()).to.equal('10000000000000000000')

      expect((await kyct.balanceOf(wallets[1].address)).toString()).to.equal('0')
      expect((await kyct.balanceOf(wallets[2].address)).toString()).to.equal('0')
    })

    it('does not allow address 1 to transfer tokens from account 2', async function () {
      await expect(kyct.connect(wallets[1]).transferFrom(wallets[2].address, wallets[3].address, '10000000000000000000'))
        .to.be.revertedWith("ERC20: transfer amount exceeds allowance")
    })

    it('can transfer to multiple accounts at once', async function () {
      await kyct.connect(wallets[1]).batchTransfer([wallets[3].address, wallets[4].address, wallets[5].address, wallets[6].address],
        ['100000000000000000', '100000000000000000', '100000000000000000', '100000000000000000'])
      expect((await kyct.balanceOf(wallets[3].address)).toString()).to.equal('100000000000000000')
      expect((await kyct.balanceOf(wallets[4].address)).toString()).to.equal('100000000000000000')
      expect((await kyct.balanceOf(wallets[5].address)).toString()).to.equal('100000000000000000')
      expect((await kyct.balanceOf(wallets[6].address)).toString()).to.equal('100000000000000000')
    })

    it('the transfer fails if one of multiple transfer fails', async function () {
      await expect(kyct.connect(wallets[1]).batchTransfer([wallets[3].address, wallets[4].address, wallets[5].address, wallets[6].address],
        ['100000000000000000', '100000000000000000', '100000000000000000', '10000000000000000000']))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance")
      expect((await kyct.balanceOf(wallets[3].address)).toString()).to.equal('0')
      expect((await kyct.balanceOf(wallets[4].address)).toString()).to.equal('0')
      expect((await kyct.balanceOf(wallets[5].address)).toString()).to.equal('0')
      expect((await kyct.balanceOf(wallets[6].address)).toString()).to.equal('0')
    })

  })

});
