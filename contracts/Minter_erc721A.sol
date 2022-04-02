// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NFT_ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Minter_erc721A {

  NFT_ERC721A public myNFT;
  bytes32 immutable public root_presale_one;
  bytes32 immutable public root_presale_two;


  constructor(NFT_ERC721A _myNFT, bytes32 _root_presale_one, bytes32 _root_presale_two)
  {
    myNFT = _myNFT;
    root_presale_one = _root_presale_one;
    root_presale_two = _root_presale_two;
  }

  function mint() public 
  {
    myNFT.mint(msg.sender, 1);
  }

  function multiMint(uint256 nftQuantity) public 
  {
      myNFT.mint(msg.sender, nftQuantity); 
  }

  function _leaf(address account)
  internal pure returns (bytes32)
  {
      return keccak256(abi.encodePacked(account));
  }

  function _verify(bytes32[] memory proof, bytes32 root, bytes32 leaf)
  internal pure returns (bool)
  {
      return MerkleProof.verify(proof, root, leaf);
  }

}
