// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/// @title Lock
/// @notice 时间锁：部署时存入 ETH，仅在到达解锁时间后由 owner 一次性提走。
contract Lock {
    event Withdrawal(uint256 amount, uint256 when);

    error UnlockTimeNotInFuture();
    error CannotWithdrawYet();
    error NotOwner();

    uint256 public unlockTime;
    address payable public owner;

    /// @param _unlockTime 解锁时间戳（必须大于 block.timestamp）
    constructor(uint256 _unlockTime) payable {
        if (block.timestamp >= _unlockTime) revert UnlockTimeNotInFuture();
        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    /// @notice 取回合约内全部 ETH，仅 owner 且在解锁时间之后可调用
    function withdraw() external {
        if (block.timestamp < unlockTime) revert CannotWithdrawYet();
        if (msg.sender != owner) revert NotOwner();

        uint256 amount = address(this).balance;
        emit Withdrawal(amount, block.timestamp);
        (bool ok,) = owner.call{value: amount}("");
        require(ok, "Transfer failed");
    }
}
