// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NFT.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Minter is Ownable, PaymentSplitter {

  NFT public myNFT;
  bytes32 immutable public root_presale_one;
  bytes32 immutable public root_presale_two;
  uint256[] public token_id_brackets;
  uint256[] public bracket_prices;
  uint256 public current_bracket;
  uint256 preSaleOneOpenTime;
  uint256 preSaleTwoOpenTime;
  uint256 generalPublicOpenTime;

  constructor(NFT _myNFT, bytes32 _root_presale_one, bytes32 _root_presale_two, address[] memory payees, uint256[] memory shares_) PaymentSplitter(payees, shares_)
  {
    myNFT = _myNFT;
    root_presale_one = _root_presale_one;
    root_presale_two = _root_presale_two;
  }

  function setUpSales(uint256[] memory _bracket_prices, uint256[] memory _token_id_brackets, uint256[3] memory _sale_open_times) public
  onlyOwner
  {
    require(_bracket_prices.length == _token_id_brackets.length);
    bracket_prices = _bracket_prices;
    token_id_brackets = _token_id_brackets;
    preSaleOneOpenTime = _sale_open_times[0];
    preSaleTwoOpenTime = _sale_open_times[1];
    generalPublicOpenTime = _sale_open_times[2];
  }

  function mintPresaleOne(bytes32[] calldata proof) public payable
  {
    // Check if whitelisted
    require(_verify(proof, root_presale_one,_leaf(msg.sender)), "Invalid merkle proof");
    // Check if open
    require(block.timestamp > preSaleOneOpenTime, "Sale not open");
    // Check price brackets
    checkPriceBrackets();
    // Check if max reached
    require(0 >= current_bracket, "Max reached");
    // Check payment
    require(msg.value >= bracket_prices[current_bracket], "Payment too low");
    // Mint
    myNFT.mint(msg.sender);
  }

  function mintPresaleTwo(bytes32[] calldata proof) public payable
  {
    // Check if whitelisted
    require(_verify(proof, root_presale_two, _leaf(msg.sender)), "Invalid merkle proof");
    // Check if open
    require(block.timestamp > preSaleTwoOpenTime, "Sale not open");
    // Check price brackets
    checkPriceBrackets();
    // Check if max reached
    require(1 >= current_bracket, "Max reached");
    // Check payment
    require(msg.value >= bracket_prices[current_bracket], "Payment too low");
    // Mint
    myNFT.mint(msg.sender);
  }
  function mint() public payable
  {
    // Check if open
    require(block.timestamp > generalPublicOpenTime, "Sale not open");
    // Check price brackets
    checkPriceBrackets();
    // Check payment
    require(msg.value >= bracket_prices[current_bracket], "Payment too low");
    // Mint
    myNFT.mint(msg.sender);
  }

  function multiMint(uint256 amount) public payable
  {
    // Check if open
    require(block.timestamp > generalPublicOpenTime, "Sale not open");
    // Check price brackets
    bool shouldIncreaseBracket = false;
    if (myNFT.nextTokenId() + amount >= token_id_brackets[current_bracket])
    {
      amount = token_id_brackets[current_bracket] - myNFT.nextTokenId();
      shouldIncreaseBracket = true;
    }
    // Check payment
    require(msg.value >= amount * bracket_prices[current_bracket]);
    // Mint
    for (uint256 i = 0; i < amount; i++)
    {
      myNFT.mint(msg.sender);
    }
    if(shouldIncreaseBracket)
    {
      checkPriceBrackets();
    }
  }

  function checkPriceBrackets()
  internal  
  {
      if (myNFT.nextTokenId() >= token_id_brackets[current_bracket])
      {
        current_bracket += 1;
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

  function getPrice()
  public
  view
  returns (uint256)
  {
    if (myNFT.nextTokenId() >= token_id_brackets[current_bracket])
    {
      return bracket_prices[current_bracket + 1];
    }
    else
    { 
      return bracket_prices[current_bracket];
    }
    
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
