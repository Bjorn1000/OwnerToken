// solium-disable linebreak-style
pragma solidity ^0.4.2;

import "./OwnerToken.sol";

contract TokenSale {
    address admin;
    OwnerToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    
    event Sell(address _buyer, uint256 _amount);

    constructor (OwnerToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        // validates the msg.value what is that exactly?
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        // ensures you don't send too many tokens
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        // 
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);

    }



    function endSale() public {

        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        
        selfdestruct(admin);

    }
}
