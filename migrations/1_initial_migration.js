var Web3 = require('web3');

var NFTContract = artifacts.require("NFT.sol");
var MinterContract = artifacts.require("Minter.sol");

// NFT
var NFTName = "Beks Artwalk Genesis"
var NFTSymbol = "BEKS"
var NFTBaseUri = "https://boredapeyachtclub.com/api/mutants/"
// Minter
var root_presale = "0xda6ab2b10d2dabe235d095389920dfe921dc88b1e83b8c475ab19f56c406e7ed";
var root_team_alloc = "0x37d7c26b00334df99d50391aaedbd72f8b8d5554161ca54b45a1a61e1c3e5923";
var root_giveaway = "0x37d7c26b00334df99d50391aaedbd72f8b8d5554161ca54b45a1a61e1c3e5923";
var teamAddresses  = ['0x0F09F8d44A1731B30F6ABBAE0E545b6ab8Cd335a']
var teamShares = [1]
var token_id_brackets = [0, 3041, 4242]
var bracket_prices = ['0.17', '0.24', '0.42']
var salesTimes = [1,2,3]

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await NFT(deployer, network, accounts); 
        await Minter(deployer, network, accounts); 
        await perms(deployer, network, accounts); 
    });
};

async function NFT(deployer, network, accounts) {
  NFTInstance = await NFTContract.new(NFTName, NFTSymbol, {from: accounts[3]})
  console.log("NFTInstance " + NFTInstance.address)
  console.log("Tx " + NFTInstance.transactionHash)
  // await NFTInstance.transferOwnership("0xB30077c4bDb0e23001C4b9297e231201bADA49E4", {from: accounts[3]})
  await NFTInstance.setBaseUri(NFTBaseUri, true, {from: accounts[3]})
  await NFTInstance.mint(accounts[4], {from: accounts[3]})
}

async function Minter(deployer, network, accounts) {

  for (i = 0; i < bracket_prices.length; i++)
  {
    bracket_prices[i] = Web3.utils.toWei(bracket_prices[i], 'ether')
  }
  MinterInstance = await MinterContract.new(NFTInstance.address,teamAddresses, teamShares, {from: accounts[3]})
  console.log( "MinterInstance " + MinterInstance.address)
  console.log("Tx " + MinterInstance.transactionHash)
  var setupSales = await MinterInstance.setUpSales(bracket_prices, token_id_brackets, salesTimes, {from: accounts[3]})
  var test = await MinterInstance.updateRoots(root_presale, root_team_alloc, root_giveaway,{from: accounts[3]})
  console.log(test)
}

async function perms(deployer, network, accounts) {
  var setPerms = await NFTInstance.setMinter(MinterInstance.address, true, {from: accounts[3]})
}


