var Web3 = require('web3');

var NFTContract = artifacts.require("NFT.sol");
var MinterContract = artifacts.require("Minter.sol");

// NFT
var NFTName = "Beks Artwalk Genesis"
var NFTSymbol = "BEKS"
var NFTBaseUri = "https://nftstorage.link/ipfs/bafybeiap3c6smnkeunwvecox5ylh67n5ipeq4sb2ugaunllv3jwulp3jky/"
// Minter
var root_presale = "0xa54f29f2b01ba40825adf3b119b8b2e18e960cd03039f329dd07764973d9a813";
var root_team_alloc = "0x87525b124af1bd33e1177ec2b92e76d5c22c5ef867105ae5cf9a352632e8b3b3";
var root_giveaway = "0x4701b7fc78e117718c4ff2289be0eabd04eb78718ae7e58c2fb0e402bf181c5b";
var teamAddresses  = ['0x853cBBBd1F88CEB029dc93c18dC3C0a6E4e34D4F', '0xFf452405679aDB1A5452fFCbA33fd7f22C7d8CFd', '0xbd96382d887ad8a96DBad1B47eC813F2CadAa8bB', '0x9EB514d4c34FF6A76fcD633813fBF00d172807f8', '0x1D63C5b343A82b65947DB9983c7E6614917f1f28', '0xAacffB873ABCbD2a37253a7C5674A6EF1E0C2205', '0xbcE28D7B7b9a010d6eBA503f1E128F2197dA000e', '0xE74C0E19425c27E6Fb08254B7E1C5bd24EAc4A01']
var teamShares = [475, 365, 50, 50, 20, 20, 10, 10]
var token_id_brackets = [0, 3041, 4242]
var bracket_prices = ['0.17', '0.24', '0.42']

var token_id_brackets = [0, 3041, 4242]
var bracket_prices = ['0.17',  '0.24', '0.42']
// var salesTimes = [1,2,3]
var salesTimes = [1656774000,1656860400,1656946800, 1658761200]

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        // await NFT(deployer, network, accounts); 
        await Minter(deployer, network, accounts); 
        // await perms(deployer, network, accounts); 
        // await test(deployer, network, accounts); 
    });
};

async function NFT(deployer, network, accounts) {
  // NFTInstance = await NFTContract.new(NFTName, NFTSymbol, {from: accounts[3]})
  // console.log("NFTInstance " + NFTInstance.address)
  // console.log("Tx " + NFTInstance.transactionHash)
  // NFTInstance = await NFTContract.at("0xbd96382d887ad8a96DBad1B47eC813F2CadAa8bB")
  // await NFTInstance.setBaseUri(NFTBaseUri, true, {from: accounts[3]})
  // await NFTInstance.mint(accounts[4], {from: accounts[3]})
  // Mainnet
  // NFTInstance = await NFTContract.at("0xb2481691b251bcddd5201ad03684c2487b0f03f7")
  // await NFTInstance.setBaseUri(NFTBaseUri, true)
  // await NFTInstance.mint("0xB30077c4bDb0e23001C4b9297e231201bADA49E4")
  // Testnet 
    NFTInstance = await NFTContract.at("0x2d5713883db1caab5c838f5887bf20881a8d9523")

}

async function Minter(deployer, network, accounts) {

  for (i = 0; i < bracket_prices.length; i++)
  {
    bracket_prices[i] = Web3.utils.toWei(bracket_prices[i], 'ether')
  }
  // MinterInstance = await MinterContract.new(NFTInstance.address,teamAddresses, teamShares, {from: accounts[3]})
  // console.log( "MinterInstance " + MinterInstance.address)
  // MinterInstance = await MinterContract.at("0x59BAf1D3e9f445f64f33844a119575C320419e53")
  // console.log("Tx " + MinterInstance.transactionHash)
  // Mainnet
  MinterInstance = await MinterContract.at("0x044c9b5aed360a7e0facca0af30b3f202d456081")
  // var setupSales = await MinterInstance.setUpSales(bracket_prices, token_id_brackets, salesTimes)
  await MinterInstance.updateRoots(root_giveaway, root_presale, root_team_alloc)
  // await MinterInstance.mintTeamAlloc( ['0x884464d8df6ad2b5fbe3e6caac307c7dee132258617f6b43e7a629d4edf104fb','0xf7caf8e76c0b0efc9cce0ea557d3e34b864faa18623282616d855edb2b98ffc7','0x82ff9fbf50931fef73edb92af186928562f2abec26954cc42315f9e18677dad8' ], 5,2)
 
  // testnet
   // MinterInstance = await MinterContract.at("0x19bf86cd9eb46e9ae61489038f92fc75d6527d6d")
   // await MinterInstance.updateRoots(root_giveaway, root_presale, root_team_alloc, {from: accounts[3]})
   // testnet
   // MinterInstance = await MinterContract.at("0x727Df917378c1535b364217038Fc69720E7e09B1")
   // await MinterInstance.updateRoots(root_giveaway, root_presale, root_team_alloc, {from: accounts[3]})
   // var setupSales = await MinterInstance.updateBracketAfterPresale({from: accounts[3]})
  // var setupSales = await MinterInstance.setUpSales(bracket_prices, token_id_brackets, salesTimes, {from: accounts[3]})
  // var test = await MinterInstance.updateRoots(root_giveaway, root_presale, root_team_alloc, {from: accounts[3]})
  // console.log(test)
}

async function perms(deployer, network, accounts) {
  var setPerms = await NFTInstance.setMinter(MinterInstance.address, true, {from: accounts[3]})
}

async function test(deployer, network, accounts) {
  // MinterInstance = await MinterContract.at("0x727Df917378c1535b364217038Fc69720E7e09B1")

  console.log(accounts[4])
  console.log(accounts[5])
  // var setPerms = await MinterInstance.mintPresale(['0xf7c774af32109c9e522e72d3debc304f84eb43368544f87b6f53a926a04cccee', '0x2607c6271fcbe05d8ed39c476bf4fb8b979c08659c1348eb197acf8e8d28b216'], 2, {value:4800000000000000, from: accounts[4]})
  var test1 = await MinterInstance.testProof1(['0xf7c774af32109c9e522e72d3debc304f84eb43368544f87b6f53a926a04cccee', '0x2607c6271fcbe05d8ed39c476bf4fb8b979c08659c1348eb197acf8e8d28b216'],'0xCCF6CbAbCf1F36f3F3B558DA4D8eeA0289D96240')
  var test2 = await MinterInstance.testProof2 (['0xf7c774af32109c9e522e72d3debc304f84eb43368544f87b6f53a926a04cccee', '0x2607c6271fcbe05d8ed39c476bf4fb8b979c08659c1348eb197acf8e8d28b216'], 0, '0xCCF6CbAbCf1F36f3F3B558DA4D8eeA0289D96240')
  console.log('test1 ' + test1)
  console.log('test2 ' + test2)

}


