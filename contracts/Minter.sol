// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NFT.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Minter {

  NFT public myNFT;
  bytes32 immutable public root_presale_one;
  bytes32 immutable public root_presale_two;


  constructor(NFT _myNFT, bytes32 _root_presale_one, bytes32 _root_presale_two)
  {
    myNFT = _myNFT;
    root_presale_one = _root_presale_one;
    root_presale_two = _root_presale_two;
  }

  function mintPresaleOne(bytes32[] calldata proof) public 
  {
    require(_verify(proof, root_presale_one,_leaf(msg.sender)), "Invalid merkle proof");
    myNFT.mint(msg.sender);
  }

  function mintPresaleTwo(bytes32[] calldata proof) public 
  {
    require(_verify(proof, root_presale_two, _leaf(msg.sender)), "Invalid merkle proof");
    myNFT.mint(msg.sender);
  }
  function mint() public 
  {
    myNFT.mint(msg.sender);
  }

  function multiMint(uint256 nftQuantity) public 
  {
    for (uint256 i = 0; i< nftQuantity; i++)
    {
      myNFT.mint(msg.sender);
    }
    
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

  function verifyPresaleOne(bytes32[] calldata proof, address sender)
  public
  view
  returns (bool)
  {
    return _verify(proof, root_presale_one,_leaf(sender));
  }

  function verifyPresaleTwo(bytes32[] calldata proof, address sender)
  public
  view
  returns (bool)
  {
    return _verify(proof, root_presale_two,_leaf(sender));
  }

}
