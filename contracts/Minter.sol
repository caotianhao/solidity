// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Minter {
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error TransferToZeroAddress();
    error ExceedsBalance(uint256 balance, uint256 amount);

    mapping(address => uint256) public balance;

    constructor(uint256 initValue) {
        balance[msg.sender] = initValue;
    }

    function send(address receiver, uint256 amount) external returns (bool success) {
        if (receiver == address(0)) revert TransferToZeroAddress();
        uint256 fromBalance = balance[msg.sender];
        if (fromBalance < amount) revert ExceedsBalance(fromBalance, amount);

        balance[msg.sender] = fromBalance - amount;
        balance[receiver] += amount;

        emit Transfer(msg.sender, receiver, amount);
        return true;
    }
}
