// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/// @title Faucet
/// @notice 水龙头：任何人可向合约充值，任何人可领取不超过单次上限的 ETH。
/// @dev 通过 receive() 接收 ETH；withdraw 限制单次最大 1 ether。
contract Faucet {
    event Withdrawn(address indexed recipient, uint256 amount);
    event Received(address indexed from, uint256 amount);

    error WithdrawAmountTooLarge(uint256 requested, uint256 maxAllowed);
    error WithdrawFailed();

    uint256 public constant MAX_WITHDRAWAL = 1 ether;

    /// @notice 领取 ETH，单次最多 MAX_WITHDRAWAL
    /// @param amount 领取数量（wei）
    function withdraw(uint256 amount) external {
        if (amount > MAX_WITHDRAWAL) revert WithdrawAmountTooLarge(amount, MAX_WITHDRAWAL);

        (bool ok,) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert WithdrawFailed();

        emit Withdrawn(msg.sender, amount);
    }

    /// @notice 接收 ETH（无 calldata 的转账）
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /// @notice 无 fallback，带 data 的转账会 revert
    fallback() external payable {
        revert("Faucet: use receive() to fund");
    }
}
