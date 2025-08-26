// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleToken {
    string public name = "SimpleToken";
    string public symbol = "STK";
    uint8 public decimals = 18;
    uint public totalSupply;

    mapping(address => uint) public balanceOf;

    address public owner;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor(uint _initialSupply) {
        owner = msg.sender;
        totalSupply = _initialSupply;
        balanceOf[owner] = _initialSupply;
    }

    function transfer(address _to, uint _amount) public returns (bool) {
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
        return true;
    }
}
