var Web3 = require('web3');

var NFTContract = artifacts.require("NFT.sol");
var MinterContract = artifacts.require("Minter.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await NFT(deployer, network, accounts); 
        await Minter(deployer, network, accounts); 
        await perms(deployer, network, accounts); 
        await testVerify(deployer, network, accounts); 
        // await testMint(deployer, network, accounts); 
    });
};

async function NFT(deployer, network, accounts) {
  NFTInstance = await NFTContract.new("Test", "TST", "https://boredapeyachtclub.com/api/mutants/", {from: accounts[3]})
  console.log(NFTInstance.address + " NFTInstance")
}

async function Minter(deployer, network, accounts) {
  var _bracket_prices = [242, 842, 3042, 4042, 4142, 4200]
  var _token_id_brackets = ['0.16', '0.2', '0.24', '0.42', '1.42', '4.2']
  for (i = 0; i < _token_id_brackets.length; i++)
  {
    
    _token_id_brackets[i] = Web3.utils.toWei(_token_id_brackets[i], 'ether')
  }
  console.log(_token_id_brackets)
  MinterInstance = await MinterContract.new(NFTInstance.address, '0x37d7c26b00334df99d50391aaedbd72f8b8d5554161ca54b45a1a61e1c3e5923', '0x37d7c26b00334df99d50391aaedbd72f8b8d5554161ca54b45a1a61e1c3e5923', ['0x0F09F8d44A1731B30F6ABBAE0E545b6ab8Cd335a'], [1], {from: accounts[3]})
    console.log(MinterInstance.address + " MinterInstance")
}

async function perms(deployer, network, accounts) {
  await NFTInstance.setMinter(MinterInstance.address, true, {from: accounts[3]})
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
