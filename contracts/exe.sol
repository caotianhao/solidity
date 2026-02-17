// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract exe {
    event ValueSet(uint256 indexed previousValue, uint256 indexed newValue);

    uint256 public myv;

    function setValue(uint256 data) external {
        uint256 previous = myv;
        myv = data;
        emit ValueSet(previous, data);
    }

    function getValue() external view returns (uint256) {
        return myv;
    }

    function add(uint256 a, uint256 b) external pure returns (uint256) {
        return a + b;
    }
}
