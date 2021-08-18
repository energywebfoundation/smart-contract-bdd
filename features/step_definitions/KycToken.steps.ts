import {Given, When, Then} from "@cucumber/cucumber"
const {expect} = require('chai')

Given('The token contract has been deployed', async function () {
  expect(await this._initialized).to.be.true
  expect((await this.kyct.owner()).toString()).to.equal(this.owner);
});

Given('The total supply is {int}', async function (totalSupply) {
  expect(await this.kyct.totalSupply()).to.equal(totalSupply)
});

When('{int} new tokens are minted by address {int} into address {int}', async function (stash, minter, recipient) {
  try {
    await this.kyct.connect(this.wallets[minter]).mint(this.wallets[recipient].address, stash)
  } catch (err) {
    this.kycTokenError = err
  }
});

Then('The balance of address {int} is {int}', async function (recipient, totalSupply) {
  expect(await this.kyct.balanceOf(this.wallets[recipient].address)).to.equal(totalSupply)
});

Then('The transaction is reverted with the message {string}', async function (message) {
  expect(this.kycTokenError.message).to.contain(message)
});
