// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public owner;    

    constructor() ERC20("Dacether Bank", "DCTB") {        
        owner = msg.sender;        
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not allowed");
        _;
    }

    event MinterChange(address indexed from, address indexed to);
    // change owner on deploy dbank is new owner
    function changeMinter(address _dbank) public onlyOwner returns(bool) {
        owner = _dbank;
        emit MinterChange(msg.sender, _dbank);
        return true;
    }

    function mint(address _account, uint _amount ) public onlyOwner  {
        _mint(_account, _amount);        
    }
}
