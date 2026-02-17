// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HelloWorld {
    event MessageSet(string previousMessage, string newMessage);

    string public message;

    constructor(string memory initMessage) {
        message = initMessage;
    }

    function setMessage(string memory newMessage) external {
        string memory previous = message;
        message = newMessage;
        emit MessageSet(previous, newMessage);
    }
}
