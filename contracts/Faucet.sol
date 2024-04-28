//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.24;

contract Faucet {

  address public owner;

  constructor() {
    owner = msg.sender;
  }
  
  function withdraw(uint _amount) public {
    // users can only withdraw .1 ETH at a time, feel free to change this!
    require(address(this).balance >= _amount, "Insufficient balance in the contract");
    require(_amount <= 100000000000000000, "amount must be less than .1 ETH");
    payable(msg.sender).transfer(_amount);
  }

  // fallback function
  receive() external payable {}
}