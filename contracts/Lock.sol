// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./utils/Address.sol";

contract Lock {
    event Withdrawal(uint256 amount, uint256 when);

    error UnlockTimeNotInFuture();
    error CannotWithdrawYet();
    error NotOwner();

    uint256 public unlockTime;
    address payable public owner;

    constructor(uint256 _unlockTime) payable {
        if (block.timestamp >= _unlockTime) revert UnlockTimeNotInFuture();
        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() external {
        if (block.timestamp < unlockTime) revert CannotWithdrawYet();
        if (msg.sender != owner) revert NotOwner();

        uint256 amount = address(this).balance;
        emit Withdrawal(amount, block.timestamp);
        Address.sendValue(owner, amount);
    }
}
