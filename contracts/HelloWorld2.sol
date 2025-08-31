// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld2 {
    string public message;

    constructor() {
        message = "Hello, Solidity!";
    }

    function run() public pure returns (string memory) {
        return "Running main logic...";
    }
}
