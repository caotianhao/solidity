// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Test2 {
    uint256 public a;
    uint256[] public b;

    // function t2() public {
    //     uint256[] c;
    //     c.push(1);
    //     b = c;
    // }

    // 上面代码有错误，可改成下面

    function t2() public payable  {
        uint256[] storage c = b;
        c.push(13);
    }
}
