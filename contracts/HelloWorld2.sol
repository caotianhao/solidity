// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HelloWorld2 {
    event RunCalled(address indexed caller);

    string public message;

    constructor() {
        message = "Hello, Solidity!";
    }

    function run() external returns (string memory) {
        emit RunCalled(msg.sender);
        return "Running main logic...";
    }
}
