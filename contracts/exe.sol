// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title exe
/// @notice 简单存储与纯计算示例：存一个数值，并提供加法纯函数。
contract exe {
    event ValueSet(uint256 indexed previousValue, uint256 indexed newValue);

    uint256 public myv;

    /// @param data 要存储的值
    function setValue(uint256 data) external {
        uint256 previous = myv;
        myv = data;
        emit ValueSet(previous, data);
    }

    /// @return 当前存储的值
    function getValue() external view returns (uint256) {
        return myv;
    }

    /// @param a 加数
    /// @param b 加数
    /// @return 和
    function add(uint256 a, uint256 b) external pure returns (uint256) {
        return a + b;
    }
}
