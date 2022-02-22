// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol"; 

contract NFT is IERC721Metadata, ERC721 {

  uint256 public nextTokenId;
  string public baseUri;
  mapping(address => bool) public minters;

  constructor(string memory tokenName, string memory tokenSymbol, string memory _baseUri) ERC721(tokenName, tokenSymbol) 
  {
    baseUri = _baseUri;
    minters[msg.sender] = true;
  }

  function mint(address receiver) public onlyMinter
  {
    _mint(receiver, nextTokenId);
    nextTokenId +=1;
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
