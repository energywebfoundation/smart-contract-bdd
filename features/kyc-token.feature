Feature: KYC enabled Token contract
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

Scenario: KYC user
  Given The token contract has been deployed
  And address 1 has a KYC status of "false"
  When the address 0 sets the KYC status of address 1 to "true"
  Then address 1 has a KYC status of "true"

Scenario: unKYC user
  Given The token contract has been deployed
  And the address 0 sets the KYC status of address 1 to "true"
  When the address 0 sets the KYC status of address 1 to "false"
  Then address 1 has a KYC status of "false"

Scenario: transfer fails without KYC
  Given The token contract has been deployed
  And address 1 has a KYC status of "false"
  And 1000 new tokens are minted by address 0 into address 1
  When address 1 transfers 100 tokens to address 2
  Then The transaction is reverted with the message "account not Kyced"

  Scenario: transfer succeeds with KYC
  Given The token contract has been deployed
  And the address 0 sets the KYC status of address 1 to "true"
  And 1000 new tokens are minted by address 0 into address 1
  When address 1 transfers 100 tokens to address 2
  Then The balance of address 1 is 900
    And The balance of address 2 is 100
