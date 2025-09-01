// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract exe {
    uint256 public myv;

    function setValue(uint256 data) public {
        myv = data;
    }

    function getValue() public view returns (uint256) {
        return myv;
    }

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
}