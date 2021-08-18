Feature: Mint tokens
  In order to manage the token supply
  As the contract owner
  I want to mint new tokens when required

Scenario: Minting tokens
  Given The token contract has been deployed
  And The total supply is 0
  When 1000 new tokens are minted by address 0 into address 1
  Then The total supply is 1000
  And The balance of address 1 is 1000

Scenario: Unauthorized Minting
  Given The token contract has been deployed
  When 1000 new tokens are minted by address 1 into address 0
  Then The transaction is reverted with the message "Ownable: caller is not the owner"
