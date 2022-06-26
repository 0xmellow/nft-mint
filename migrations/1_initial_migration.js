var Web3 = require('web3');

var NFTContract = artifacts.require("NFT.sol");
var MinterContract = artifacts.require("Minter.sol");

// NFT
var NFTName = "Beks Artwalk Genesis"
var NFTSymbol = "BEKS"
var NFTBaseUri = "https://boredapeyachtclub.com/api/mutants/"
// Minter
var root_presale = "0x37d7c26b00334df99d50391aaedbd72f8b8d5554161ca54b45a1a61e1c3e5923";
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
        // await perms(deployer, network, accounts); 
        // await testVerify(deployer, network, accounts); 
        // await testMint(deployer, network, accounts); 
    });
};

async function NFT(deployer, network, accounts) {
  NFTInstance = await NFTContract.new(NFTName, NFTSymbol)
  console.log("NFTInstance " + NFTInstance.address)
  console.log("Tx " + NFTInstance.transactionHash)
  await NFTInstance.transferOwnership("0xB30077c4bDb0e23001C4b9297e231201bADA49E4")
  // await NFTInstance.setBaseUri(NFTBaseUri, true, {from: accounts[3]})
  // await NFTInstance.mint(accounts[4], {from: accounts[3]})
}

async function Minter(deployer, network, accounts) {

  for (i = 0; i < token_id_brackets.length; i++)
  {
    token_id_brackets[i] = Web3.utils.toWei(token_id_brackets[i], 'ether')
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

async function testVerify(deployer, network, accounts) {
  var bool1 = await MinterInstance.verifyPresale(['0xd1b6ff36893ff713bdcdf3699fb8a8c736a7215bca0241ee757554b5c7749253','0xe30fc3b8f6ddb0cdc5815005c62cbda977cec5ed9fe11458b6754ccd6b62817c','0xe1eeb7955ea5b71efb55237ae8e901bc6d26d5bd78bb9fadba4d383926d823d5'],'0x7DdC72Eb160F6A325A5927299b2715Abd0bEA55B', 4, {from: accounts[3]})
  var bool2 = await MinterInstance.verifyPresale(['0xa11b023860687d0c3f4a20ea9cbc14df29e6e91adbad60b4aa335d5b27ddf73f'],'0x8de806462823aD25056eE8104101F9367E208C14', 2, {from: accounts[3]})
 var rootPresale = await MinterInstance.root_presale()
  console.log(rootPresale)
  console.log(bool1) 
  console.log(bool2)

  // console.log(bool4)
}

async function testMint(deployer, network, accounts) {
  await MinterInstance.mintPresaleOne(['0xb1f58f70664b685e09f08e88966f12671c5fdc9c89fe7790bac65fe4dfe215a0','0x1b8ad64872b19351b588ad7775b9ef83dadee61616a7a141ed369b5519cc6ae6','0xf16218e8536264d1b52ab2bcacca339bb40c41912d0e525b7ab757f57602bba0'], {from: accounts[3]})
}
