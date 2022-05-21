// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Token.sol';

contract DBank {
    Token private token;
    // 31668017 -interest(10% APY) per second (seconds in 365.25 days);

    mapping(address => uint) public balance;
    mapping(address => uint) public depositStart;
    mapping(address => bool) public isDeposited;

     //add events
    event Deposit(address indexed user, uint256 etherAmount, uint256 timeStart);
    event Withdraw(
        address indexed user,
        uint256 etherAmount,
        uint256 timeStart,
        uint256 interest
    );

    constructor(Token _token)  {
        token = _token;
     }

    receive() external payable {}

    function deposit() public payable {
        require(isDeposited[msg.sender] == false, "You already deposit funds");
        require(msg.value >=  0.01 ether, "Minimun amount is 0.01 ETH");
        balance[msg.sender] += msg.value;
        depositStart[msg.sender] += block.timestamp;
        isDeposited[msg.sender] = true;
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        require(isDeposited[msg.sender],  "Error, deposit doesn't exist" );
        //assign msg.sender ether deposit balance to variable for event
        uint userBalance = balance[msg.sender];
        //check user's hodl time
        uint depositTime = block.timestamp - depositStart[msg.sender];
         //calc interest per second
        uint256 interestPerSecond = 31668017 * (balance[msg.sender] / 1e16); 
         //calc accrued interest
        uint256 interest = interestPerSecond * depositTime;

        //send interest in tokens to user 
        token.mint(msg.sender, interest);

        //send eth to user
        payable(msg.sender).transfer(userBalance);

        //reset depositer ether balance
        balance[msg.sender] = 0;
        depositStart[msg.sender]= 0;
        isDeposited[msg.sender] = false;
        //emit event
        emit Withdraw(msg.sender, userBalance, block.timestamp, interest);
    }

    function borrow() public payable {
        //check if collateral is >= than 0.01 ETH
        //check if user doesn't have active loan
        //add msg.value to ether collateral
        //calc tokens amount to mint, 50% of msg.value
        //mint&send tokens to user
        //activate borrower's loan status
        //emit event
    }

    function payOff() public {
        //check if loan is active
        //transfer tokens from user back to the contract
        //calc fee
        //send user's collateral minus fee
        //reset borrower's data
        //emit event
    }
}