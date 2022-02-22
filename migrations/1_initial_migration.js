var NFTContract = artifacts.require("NFT.sol");
var MinterContract = artifacts.require("Minter.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await NFT(deployer, network, accounts); 
        await Minter(deployer, network, accounts); 
        await perms(deployer, network, accounts); 
    });
};

async function NFT(deployer, network, accounts) {
  NFTInstance = await NFTContract.new("http://my-uri.com", "Test", "TST", {from: accounts[3]})
  console.log(NFTInstance.address + " NFTInstance")
}

async function Minter(deployer, network, accounts) {
  MinterInstance = await MinterContract.new(NFTInstance.address, {from: accounts[3]})
    console.log(MinterInstance.address + " MinterInstance")
}

async function perms(deployer, network, accounts) {
  await NFTInstance.setMinter(MinterInstance.address, true, {from: accounts[3]})
}

