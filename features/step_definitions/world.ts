import { setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber'
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import {use} from "chai";
import KycTokenContract from "../../artifacts/contracts/kyc-token.sol/KycToken.json";
import {KycToken} from "../../src/types"
import {Wallet} from "ethers";

use(solidity);

setDefaultTimeout(20 * 1000);

class KycTokenWorld {
  public owner: string
  public wallets: Wallet[]
  public kyct: KycToken | undefined
  public ready: boolean = false
  private _initialized: Promise<boolean>

  constructor() {
    this.wallets = new MockProvider().getWallets();
    this.owner = this.wallets[0].address

    const that = this
    this._initialized = new Promise(async (resolve, reject) => {
      try {
        that.kyct = (await deployContract(that.wallets[0], KycTokenContract, ["KYC Token", "KCT"])) as KycToken;
        that.ready = true
        resolve(true)
      }catch (err) {
        reject(err)
      }
    })
  }

}

setWorldConstructor(KycTokenWorld);
