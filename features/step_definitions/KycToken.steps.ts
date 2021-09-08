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

When('the address {int} sets the KYC status of address {int} to {string}', async function (owner, user, status) {
  try {
    await this.kyct.connect(this.wallets[owner]).setKyc(this.wallets[user].address, status.toLowerCase() === 'true')
  } catch (err) {
    this.kycTokenError = err
  }
});

When('address {int} transfers {int} tokens to address {int}', async function (sender, stash, recipient) {
  try {
    await this.kyct.connect(this.wallets[sender]).transfer(this.wallets[recipient].address, stash)
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

Then('address {int} has a KYC status of {string}', async function (user, status) {
  expect((await this.kyct.kyced(this.wallets[user].address)).toString()).to.be.equal(status)
});
