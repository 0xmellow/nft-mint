// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NFT.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Minter is Ownable, PaymentSplitter {

  NFT public myNFT;
  bytes32 immutable public root_presale;
  bytes32 immutable public root_team_alloc;
  bytes32 public root_giveaway;
  uint256[] public token_id_brackets;
  uint256[] public bracket_prices;
  uint256 public current_bracket;
  uint256 public preSaleOpenTime;
  uint256 public preSaleCloseTime;
  uint256 public generalPublicOpenTime;
  mapping(address => uint256) public mintedFromPresale;
  mapping(address => uint256) public mintedFromTeam;
  uint256 public totalMintedGiveaway;

  constructor(NFT _myNFT, bytes32 _root_presale, bytes32 _root_team_alloc, bytes32 _root_giveaway, address[] memory payees, uint256[] memory shares_) PaymentSplitter(payees, shares_)
  {
    myNFT = _myNFT;
    root_presale = _root_presale;
    root_team_alloc = _root_team_alloc;
    root_giveaway = _root_giveaway;
  }

  function mintPresale(bytes32[] calldata proof, uint256 authorizedAmount, uint256 mintAmount) public payable
  {
    // Check if whitelisted
    require(_verify(proof, root_presale,_leaf(msg.sender, authorizedAmount)), "Invalid merkle proof");
    // Check if open
    require(block.timestamp > preSaleOpenTime, "Presale not open");
    // Check if closed
    require(block.timestamp < preSaleCloseTime, "Presale closed");
    // Check if user has minted the maximum personally allowed
    require(mintedFromPresale[msg.sender] + mintAmount <= authorizedAmount, "Already minted max amount");
    // Check price brackets
    _checkPriceBrackets();
    // Check if amount moves total minted above current bracket
    require(myNFT.nextTokenId() + mintAmount < token_id_brackets[current_bracket], "Not enough NFT left in current bracket");
    // Check if max reached
    require(1 > current_bracket, "Max reached");
    // Check payment
    require(msg.value >= mintAmount * bracket_prices[current_bracket]);
    // Increment presale counter
    mintedFromPresale[msg.sender] += mintAmount;
    // Mint
    for (uint256 i = 0; i < mintAmount; i++)
    {
      myNFT.mint(msg.sender);
    }
    // Increment presale counter
    mintedFromPresale[msg.sender] += 1;
  }

  function mintTeamAlloc(bytes32[] calldata proof, uint256 authorizedAmount, uint256 mintAmount)  public
  {
    // Check if whitelisted
    require(_verify(proof, root_team_alloc,_leaf(msg.sender, authorizedAmount)), "Invalid merkle proof");
    // Check if user has minted the maximum personally allowed
    require(block.timestamp < generalPublicOpenTime, "Team claim finished");
    // Increment presale counter
    mintedFromTeam[msg.sender] += mintAmount;
    // Mint
    for (uint256 i = 0; i < mintAmount; i++)
    {
      myNFT.mint(msg.sender);
    }
    // Check price brackets
    _checkPriceBrackets();
  }

  function mint() public payable
  {
    // Check if open
    require(block.timestamp > generalPublicOpenTime, "Sale not open");
    // Check price brackets
    _checkPriceBrackets();
    // Check payment
    require(msg.value >= bracket_prices[current_bracket], "Payment too low");
    // Mint
    myNFT.mint(msg.sender);
  }

  function multiMint(uint256 amount) public payable
  {
    // Check if open
    require(block.timestamp > generalPublicOpenTime, "Sale not open");
    // Check if amount moves brackets one step up
    _checkPriceBrackets();
    // Check if amount moves above current bracket
    require(myNFT.nextTokenId() + amount < token_id_brackets[current_bracket], "Not enough NFT left in current bracket");

    // Check payment
    require(msg.value >= amount * bracket_prices[current_bracket]);
    // Mint
    for (uint256 i = 0; i < amount; i++)
    {
      myNFT.mint(msg.sender);
    }
  }

  function mintGiveaway(bytes32[] calldata proof, uint256 authorizedAmount, uint256 mintAmount)  public
  {
    // Check if whitelisted
    require(_verify(proof, root_giveaway,_leaf(msg.sender, authorizedAmount)), "Invalid merkle proof");
    // Check if total of giveaway is coherent
    require(totalMintedGiveaway + mintAmount <= 100, "Max minted for giveaway");
    // Increment giveaway counter
    totalMintedGiveaway += mintAmount;
    // Mint
    for (uint256 i = 0; i < mintAmount; i++)
    {
      myNFT.mint(msg.sender);
    }
    // Check price brackets
    _checkPriceBrackets();
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

  function updateBracketAfterPresale()
  public  
  {
    // Check presale closed
    require(block.timestamp > preSaleCloseTime, "Presale not closed");
    // Check if brackets needs updating
      if (1 > current_bracket)
      {
        current_bracket += 1;
      }
  }

  function verifyPresale(bytes32[] calldata proof, address sender, uint256 amount)
  public
  view
  returns (bool)
  {
    return _verify(proof, root_presale,_leaf(sender, amount));
  }

  function setUpSales(uint256[] memory _bracket_prices, uint256[] memory _token_id_brackets, uint256[3] memory _sale_open_times) public
  onlyOwner
  {
    require(_bracket_prices.length == _token_id_brackets.length);
    bracket_prices = _bracket_prices;
    token_id_brackets = _token_id_brackets;
    preSaleOpenTime = _sale_open_times[0];
    preSaleCloseTime = _sale_open_times[1];
    generalPublicOpenTime = _sale_open_times[2];
  }

  function updateGiveAwayRoot(bytes32 _root_giveaway) public
  onlyOwner
  {
    root_giveaway = _root_giveaway;
  }



  function _leaf(address account, uint256 amount)
  internal pure returns (bytes32)
  {
      return keccak256(abi.encodePacked(account, amount));
  }

  function _verify(bytes32[] memory proof, bytes32 root, bytes32 leaf)
  internal pure returns (bool)
  {
      return MerkleProof.verify(proof, root, leaf);
  }


  function _checkPriceBrackets()
  internal  
  {
      if (myNFT.nextTokenId() >= token_id_brackets[current_bracket])
      {
        current_bracket += 1;
      }
  }



}
