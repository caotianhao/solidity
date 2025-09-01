// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract Faucet {
    function withdraw(uint amount) public {
        require(amount <= 1 ether, "Too much");
        payable(msg.sender).transfer(amount);
    }

    receive() external payable {}
}
