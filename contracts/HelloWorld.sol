// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title HelloWorld
/// @notice 可变的链上消息存储，部署时与之后均可设置。
contract HelloWorld {
    event MessageSet(string previousMessage, string newMessage);

    string public message;

    /// @param initMessage 初始消息
    constructor(string memory initMessage) {
        message = initMessage;
    }

    /// @param newMessage 新消息（将覆盖当前 message）
    function setMessage(string memory newMessage) external {
        string memory previous = message;
        message = newMessage;
        emit MessageSet(previous, newMessage);
    }
}
