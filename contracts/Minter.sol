// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract Minter {
    mapping(address => uint) public balance;

    event Send(address from, address to, uint amount);

    // 从 Solidity 0.7.0 开始，constructor 不再允许 public 或 external 修饰符，默认就是可部署的
    constructor(uint initValue) {
        balance[msg.sender] = initValue;
    }

    function send(address receiver, uint amount) public returns (bool success){
        require(balance[msg.sender] >= amount);
        require(balance[receiver] + amount >= balance[receiver]);
        balance[receiver] += amount;
        balance[msg.sender] -= amount;

        emit Send(msg.sender, receiver, amount);
        return true;
    }
}
