var Web3 = require('web3');

var NFTContract = artifacts.require("NFT.sol");
var MinterContract = artifacts.require("Minter.sol");

// NFT
var NFTName = "Beks Artwalk Genesis"
var NFTSymbol = "BEKS"
var NFTBaseUri = "https://nftstorage.link/ipfs/bafybeiap3c6smnkeunwvecox5ylh67n5ipeq4sb2ugaunllv3jwulp3jky/"
// Minter
var root_presale = "0xbf5b237f64097225b3c644bde4ceb420e55312ea83a523067250e3d0df618c71";
var root_team_alloc = "0xc6d66a209758720734c21d250e6500bf54d4dd562bd07c979f3e7f0705aeed8b";
var root_giveaway = "0xf27d40f4e7a90553aa929b81c5be6c5aa645a2d6d7f1d2f1ae3f8fa462e6a110";
var teamAddresses  = ['0x853cBBBd1F88CEB029dc93c18dC3C0a6E4e34D4F', '0xFf452405679aDB1A5452fFCbA33fd7f22C7d8CFd', '0xbd96382d887ad8a96DBad1B47eC813F2CadAa8bB', '0x9EB514d4c34FF6A76fcD633813fBF00d172807f8', '0x1D63C5b343A82b65947DB9983c7E6614917f1f28', '0xAacffB873ABCbD2a37253a7C5674A6EF1E0C2205', '0xbcE28D7B7b9a010d6eBA503f1E128F2197dA000e', '0xE74C0E19425c27E6Fb08254B7E1C5bd24EAc4A01']
var teamShares = [475, 365, 50, 50, 20, 20, 10, 10]
var token_id_brackets = [0, 3041, 4242]
var bracket_prices = ['0.17', '0.24', '0.42']
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
  // await NFTInstance.transferOwnership("0xB30077c4bDb0e23001C4b9297e231201bADA49E4", {from: accounts[3]})
  NFTInstance = await NFTContract.at("0xbd96382d887ad8a96DBad1B47eC813F2CadAa8bB")
  // await NFTInstance.setBaseUri(NFTBaseUri, true, {from: accounts[3]})
  // await NFTInstance.mint(accounts[4], {from: accounts[3]})
  // Testnet
  // NFTInstance = await NFTContract.at("0xb2481691b251bcddd5201ad03684c2487b0f03f7")
  // await NFTInstance.setBaseUri(NFTBaseUri, true)
  // await NFTInstance.mint("0xB30077c4bDb0e23001C4b9297e231201bADA49E4")

}

async function Minter(deployer, network, accounts) {

  for (i = 0; i < bracket_prices.length; i++)
  {
    bracket_prices[i] = Web3.utils.toWei(bracket_prices[i], 'ether')
  }
  // MinterInstance = await MinterContract.new(NFTInstance.address,teamAddresses, teamShares)
  // console.log( "MinterInstance " + MinterInstance.address)
  // console.log("Tx " + MinterInstance.transactionHash)
  // Mainnet
  MinterInstance = await MinterContract.at("0x044c9b5aed360a7e0facca0af30b3f202d456081")
  await MinterInstance.updateRoots(root_giveaway, root_presale, root_team_alloc)
  // testnet
   // MinterInstance = await MinterContract.at("0x19bf86cd9eb46e9ae61489038f92fc75d6527d6d")
   // await MinterInstance.updateRoots(root_giveaway, root_presale, root_team_alloc, {from: accounts[3]})
   // testnet
   // MinterInstance = await MinterContract.at("0x727Df917378c1535b364217038Fc69720E7e09B1")
   // await MinterInstance.updateRoots(root_giveaway, root_presale, root_team_alloc, {from: accounts[3]})
   // var setupSales = await MinterInstance.updateBracketAfterPresale({from: accounts[3]})
  // var setupSales = await MinterInstance.setUpSales(bracket_prices, token_id_brackets, salesTimes)
  // var test = await MinterInstance.updateRoots(root_giveaway, root_presale, root_team_alloc, {from: accounts[3]})
  // console.log(test)
}

async function perms(deployer, network, accounts) {
  var setPerms = await NFTInstance.setMinter(MinterInstance.address, true)
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


