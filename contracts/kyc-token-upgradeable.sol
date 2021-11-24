// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract KycTokenUpgradeable is Initializable, OwnableUpgradeable, ERC20Upgradeable {

    uint256 constant MAX_INT = 2**256 - 1;

    mapping(address => bool) public kyced;

    modifier onlyKyc(address account) {
        require(msg.sender == owner() || kyced[account], "account not Kyced");
        _;
    }

    function initialize(string memory name_, string memory symbol_) public initializer {
        ERC20Upgradeable.__ERC20_init(name_, symbol_);
        OwnableUpgradeable.__Ownable_init();
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }

    function setKyc(address account, bool value) public onlyOwner {
        kyced[account] = value;
    }

    function transfer(address recipient, uint256 amount) public override onlyKyc(msg.sender) returns (bool) {
        return ERC20Upgradeable.transfer(recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override onlyKyc(msg.sender) returns (bool) {
        if(msg.sender == owner() && allowance(sender, msg.sender) == 0) {
            _approve(sender, msg.sender, MAX_INT);
        }
        return ERC20Upgradeable.transferFrom(sender, recipient, amount);
    }

    function batchTransfer(address[] memory recipients, uint256[] memory amounts) public onlyKyc(msg.sender) returns (bool) {
        require(recipients.length > 0, "there must be at least one recipient");
        require(recipients.length == amounts.length, "the number of recipients must match the number of amounts");

        for(uint8 i = 0; i < recipients.length; i++) {
            require(transfer(recipients[i], amounts[i]));
        }

        return true;
    }

    function batchTransferFrom(address sender, address[] memory recipients, uint256[] memory amounts) public onlyKyc(msg.sender) returns (bool) {
        require(recipients.length > 0, "there must be at least one recipient");
        require(recipients.length == amounts.length, "the number of recipients must match the number of amounts");

        for(uint8 i = 0; i < recipients.length; i++) {
            require(transferFrom(sender, recipients[i], amounts[i]));
        }

        return true;
    }

    function version() external pure returns (string memory) {
        return "v0.1";
    }
}
