var NFTContract = artifacts.require("NFT.sol");
var MinterContract = artifacts.require("Minter.sol");
var NFTERC721AContract = artifacts.require("NFT_ERC721A.sol");
var MinterERC721AContract = artifacts.require("Minter_erc721A.sol");

var mintTotal = 30

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await NFT(deployer, network, accounts); 
        await Minter(deployer, network, accounts); 
        await perms(deployer, network, accounts); 
        await mintABunch(deployer, network, accounts); 
        
        await mintABunchERC721A(deployer, network, accounts); 
    });
};

async function NFT(deployer, network, accounts) {
  NFTInstance = await NFTContract.new("https://gateway.pinata.cloud/ipfs/QmaAbzY59uSPg5w26v12gHPa28gGVFCHVeqabHGLSBFkMZ/", "Test", "TST", {from: accounts[3]})
  console.log(NFTInstance.address + " NFTInstance")
  NFTERC721AInstance = await NFTERC721AContract.new("https://gateway.pinata.cloud/ipfs/QmaAbzY59uSPg5w26v12gHPa28gGVFCHVeqabHGLSBFkMZ/", "Test", "TST", {from: accounts[3]})
  console.log(NFTERC721AInstance.address + " NFTERC721AInstance")
}

async function Minter(deployer, network, accounts) {
  MinterInstance = await MinterContract.new(NFTInstance.address, "0x00", "0x00", {from: accounts[3]})
    console.log(MinterInstance.address + " MinterInstance")
  MinterERC721AInstance = await MinterERC721AContract.new(NFTERC721AInstance.address, "0x00", "0x00", {from: accounts[3]})
    console.log(MinterERC721AInstance.address + " MinterERC721AInstance")
}

async function perms(deployer, network, accounts) {
  await NFTInstance.setMinter(MinterInstance.address, true, {from: accounts[3]})
  await NFTERC721AInstance.setMinter(MinterERC721AInstance.address, true, {from: accounts[3]})
}

async function mintABunch(deployer, network, accounts) {
  console.log("#################### ERC721 Classic")
  
  var tx = await MinterInstance.mint({from: accounts[4]});
  
  tx = await MinterInstance.mint({from: accounts[4]});
  var nftSingleMintCost = tx.receipt.gasUsed
  console.log("Single mints cost " + nftSingleMintCost + "/NFT")

  var tx = await NFTInstance.transferFrom(accounts[4], accounts[6], 1, {from: accounts[4]});
  var transferSingleMintCost = tx.receipt.gasUsed
  console.log("Single mints transfer cost " + transferSingleMintCost + "/NFT")

  tx = await MinterInstance.multiMint(mintTotal, {from: accounts[4]});
  var nftMultiMintCost = tx.receipt.gasUsed
  console.log("Multi mints cost (" + mintTotal+ ") " + nftMultiMintCost / mintTotal  + "/NFT")

  var tx = await NFTInstance.transferFrom(accounts[4], accounts[6], 2, {from: accounts[4]});
  var transferMultiMintCost = tx.receipt.gasUsed
  for ( i = 3; i < 2+mintTotal; i++)
  {
    var tx = await NFTInstance.transferFrom(accounts[4], accounts[6], i, {from: accounts[4]});
    transferMultiMintCost += tx.receipt.gasUsed
  }
  console.log("Multi mints transfer cost " + transferMultiMintCost/mintTotal + "/NFT")
  var totalCostSingleMint = nftSingleMintCost + transferSingleMintCost
  var totalCostMultiMint = (nftMultiMintCost + transferMultiMintCost)/mintTotal
  console.log("Total cost for single mint " + totalCostSingleMint + "/NFT")
  console.log("Total cost for multi mint " + totalCostMultiMint + "/NFT")
}

async function mintABunchERC721A(deployer, network, accounts) {
  console.log("#################### ERC721A ")
  var tx = await MinterERC721AInstance.mint({from: accounts[4]});
  tx = await MinterERC721AInstance.mint({from: accounts[4]});
  var nftSingleMintCost = tx.receipt.gasUsed
  console.log("Single mints cost " + nftSingleMintCost + "/NFT")

  var tx = await NFTERC721AInstance.transferFrom(accounts[4], accounts[6], 1, {from: accounts[4]});
  var transferSingleMintCost = tx.receipt.gasUsed
  console.log("Single mints transfer cost " + transferSingleMintCost + "/NFT")


  tx = await MinterERC721AInstance.multiMint(mintTotal, {from: accounts[4]});
  var nftMultiMintCost = tx.receipt.gasUsed
  console.log("Multi mints cost (" +mintTotal + ") " + nftMultiMintCost / mintTotal  + "/NFT")

  var tx = await NFTERC721AInstance.transferFrom(accounts[4], accounts[6], 2, {from: accounts[4]});
  var transferMultiMintCost = tx.receipt.gasUsed
  for ( i = 3; i < 2+mintTotal; i++)
  {
    var tx = await NFTERC721AInstance.transferFrom(accounts[4], accounts[6], i, {from: accounts[4]});
    transferMultiMintCost += tx.receipt.gasUsed
  }
  console.log("Multi mints transfer cost " + transferMultiMintCost/mintTotal + "/NFT")

  var totalCostSingleMint = nftSingleMintCost + transferSingleMintCost
  var totalCostMultiMint = (nftMultiMintCost + transferMultiMintCost)/mintTotal
  console.log("Total cost for single mint " + totalCostSingleMint + "/NFT")
  console.log("Total cost for multi mint " + totalCostMultiMint + "/NFT")

}
