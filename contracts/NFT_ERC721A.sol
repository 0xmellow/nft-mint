// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC721A.sol";

contract NFT_ERC721A is ERC721A {

  uint256 public nextTokenId;
  string public baseUri;
  mapping(address => bool) public minters;

  constructor(string memory tokenName, string memory tokenSymbol, string memory _baseUri) ERC721A(tokenName, tokenSymbol) 
  {
    baseUri = _baseUri;
    minters[msg.sender] = true;
  }

  function mint(address receiver, uint256 quantity) public onlyMinter
  {
    _safeMint(receiver, quantity);
  }

  function _baseURI() internal view virtual override returns (string memory) 
  {
        return baseUri;
  }

  modifier onlyMinter()
  {
    require(minters[msg.sender]);
    _;
  }

  function setMinter(address minter, bool permission) public onlyMinter returns (bool)
  {
    if (!minters[msg.sender])
    {
      return false;
    }
    else
    {
      minters[minter] = permission;
      return true;
    }
  }
}
