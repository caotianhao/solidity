// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title HelloWorld2
/// @notice 只读消息与纯函数示例：固定初始消息，run() 返回固定字符串。
contract HelloWorld2 {
    event RunCalled(address indexed caller);

    string public message;

    constructor() {
        message = "Hello, Solidity!";
    }

    /// @return 固定字符串，用于演示纯逻辑
    function run() external returns (string memory) {
        emit RunCalled(msg.sender);
        return "Running main logic...";
    }
}
