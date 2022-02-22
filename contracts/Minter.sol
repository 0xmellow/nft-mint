// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NFT.sol";

contract Minter {

  NFT public myNFT;

  constructor(NFT _myNFT)
  {
    myNFT = _myNFT;
  }

  function mint() public 
  {
    myNFT.mint(msg.sender);
  }

}
