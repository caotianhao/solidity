// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/// @title Minter
/// @notice 简单内部账本：部署时给部署者初始余额，支持向其他地址转账。
/// @dev 非 ERC20，仅用于演示 mapping 与事件。
contract Minter {
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error TransferToZeroAddress();
    error ExceedsBalance(uint256 balance, uint256 amount);

    mapping(address => uint256) public balance;

    /// @param initValue 部署者初始余额
    constructor(uint256 initValue) {
        balance[msg.sender] = initValue;
    }

    /// @notice 将 amount 从调用方转给 receiver
    /// @param receiver 接收地址
    /// @param amount 数量
    /// @return success 恒为 true（revert 时代码不执行到 return）
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
