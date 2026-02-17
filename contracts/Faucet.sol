// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./utils/Address.sol";

contract Faucet {
    event Withdrawn(address indexed recipient, uint256 amount);
    event Received(address indexed from, uint256 amount);

    error WithdrawAmountTooLarge(uint256 requested, uint256 maxAllowed);
    error WithdrawFailed();

    uint256 public constant MAX_WITHDRAWAL = 1 ether;

    function withdraw(uint256 amount) external {
        if (amount > MAX_WITHDRAWAL) revert WithdrawAmountTooLarge(amount, MAX_WITHDRAWAL);

        Address.sendValue(payable(msg.sender), amount);

        emit Withdrawn(msg.sender, amount);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        revert("Faucet: use receive() to fund");
    }
}
