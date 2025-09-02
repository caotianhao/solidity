// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Loc {
    uint256[] arr1;
    uint256[] arr2;

    function append1() public {
        doAppend(arr1);
    }

    function append2() public {
        doAppend(arr2);
    }

    function doAppend(uint256[] storage arr) internal {
        arr.push(1);
    }

    function getArr() public view returns (uint256[] memory, uint256[] memory) {
        return (arr1, arr2);
    }
}
