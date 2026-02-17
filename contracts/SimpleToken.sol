// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleToken {
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error InsufficientBalance(uint256 balance, uint256 amount);
    error TransferToZeroAddress();

    string public constant name = "SimpleToken";
    string public constant symbol = "STK";
    uint8 public constant decimals = 18;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    address public owner;

    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        totalSupply = _initialSupply;
        balanceOf[owner] = _initialSupply;
    }

    function transfer(address _to, uint256 _amount) external returns (bool) {
        if (_to == address(0)) revert TransferToZeroAddress();
        uint256 fromBalance = balanceOf[msg.sender];
        if (fromBalance < _amount) revert InsufficientBalance(fromBalance, _amount);

        balanceOf[msg.sender] = fromBalance - _amount;
        balanceOf[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
        return true;
    }
}
