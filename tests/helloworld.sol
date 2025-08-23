// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloWorld {
    int256 a = 1;
    string s = "hello world";

    function sayHello() public view returns (string memory) {
        return s;
    }

    function modifyStr(string memory myStr) public {
        s = myStr;
    }

    function addInfo(string memory myStr) public view returns (string memory) {
        return string.concat(s, myStr);
    }
}
