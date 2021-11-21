# Test & Behaviour Driven Development of smart contracts

This is a demo repository of how to test smart contracts with Cucumber JS and Hardhat. It uses 
[hardhat](https://hardhat.org) with 
[Typescript](https://www.typescriptlang.org) and [Waffle](https://getwaffle.io) and 
[Cucumber.js](https://github.com/cucumber/cucumber-js#cucumberjs)

## Building

In order to build after a successful `clone`:

* `npm install`
* `npm run compile`

After all the code has been generated you can check if it actually works:

* `npm run test`
* `npm run cuke`

## Deploying

- Volta (testnet)
    - `npm run deploy:volta`
- Energy Web Chain (EWC)
    - `npm run deploy:ewc`

## Project structure

The project structure described here is the one you get once all dependecies have been installed and the contracts 
have been compiled. 

### artifacts

contains the result of the smart contract compilation. It will contain JSON files for all the contracts and their 
dependencies.

### build

conatains the output of the Typescript compiler. These are the Javascript files which get executed.

### cache

Contains a single file which allows hardhat to keep track of compilation changes

### contracts

The solidity contracts under development

### features

The Gherkin files and the related step implementations

### reports

Output of the `cucumber-js` execution

### src

Generated typings of the smart contract interfaces. This is used in the tests to allow compile time checking of 
parameter types.

### test

The Mocha tests to check the contract functionality

## Configuration

For the system to work as intended, some configuration is required

### Hardhat

Hardhat is configured in the `hardhat.config.ts` file. In order to allow `type-chain` to generate the `.d.ts` files 
for the smart-contracts, the JSON files have to be listed here.

### Cucumber

Cucumber-js is configured in the `cucumber.js` file. As we're using the generated version of the `*.ts` files, we 
need to tell cucumber where to find them. 

### Typescript

The normal `tsconfig.json` file is used. The notable change is:

* "resolveJsonModule": true - in order to import the JSON definitions of the compiled smart-contracts
