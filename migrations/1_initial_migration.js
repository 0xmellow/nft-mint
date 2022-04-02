var NFTContract = artifacts.require("NFT.sol");
var MinterContract = artifacts.require("Minter.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await NFT(deployer, network, accounts); 
        await Minter(deployer, network, accounts); 
        await perms(deployer, network, accounts); 
        // await testVerify(deployer, network, accounts); 
        // await testMint(deployer, network, accounts); 
    });
};

async function NFT(deployer, network, accounts) {
  NFTInstance = await NFTContract.new("Test", "TST", "https://gateway.pinata.cloud/ipfs/QmaAbzY59uSPg5w26v12gHPa28gGVFCHVeqabHGLSBFkMZ/", {from: accounts[3]})
  console.log(NFTInstance.address + " NFTInstance")
}

async function Minter(deployer, network, accounts) {
  MinterInstance = await MinterContract.new(NFTInstance.address, '0x39ed386158d68982f8e55868ceed4450a5e9c406e1d488af5193b13e9bcb7357', '0x2c3a4568425b1453d805c433852df2a3d34ef324ef36bc02e240b11340ad9f05', {from: accounts[3]})
    console.log(MinterInstance.address + " MinterInstance")
}

async function perms(deployer, network, accounts) {
  await NFTInstance.setMinter(MinterInstance.address, true, {from: accounts[3]})
}

async function testVerify(deployer, network, accounts) {
  var bool1 = await MinterInstance.verifyPresaleOne(['0xb1f58f70664b685e09f08e88966f12671c5fdc9c89fe7790bac65fe4dfe215a0','0x1b8ad64872b19351b588ad7775b9ef83dadee61616a7a141ed369b5519cc6ae6','0xf16218e8536264d1b52ab2bcacca339bb40c41912d0e525b7ab757f57602bba0'],'0x0F09F8d44A1731B30F6ABBAE0E545b6ab8Cd335a', {from: accounts[3]})
  var bool2 = await MinterInstance.verifyPresaleTwo(['0x99bb638cf5ebae695d773f881c238e3580b4f52a69e2098897a4241f5ba220e0','0x2ea4291f6a260f6b00862b64a65583e99cf1ae2257829f5340d677ab004be8a2','0xfd07b2f68162be1e8832b5a9e470027b2042695b7c60da1c7eff2de4f423f9fe'],'0x0F09F8d44A1731B30F6ABBAE0E545b6ab8Cd335a',{from: accounts[3]})
  var bool3 = await MinterInstance.verifyPresaleOne(['0x3ef0fb8696610f7b1bf0c8f9ba7fd3f7df293f2499fae35c42159cf5488d08fd'],'0x3FDD931A1c1d4F3B86946D21A552b18A4CeC7A3C',{from: accounts[3]})
  var bool4 = await MinterInstance.verifyPresaleTwo(['0x3ef0fb8696610f7b1bf0c8f9ba7fd3f7df293f2499fae35c42159cf5488d08fd'],'0x3FDD931A1c1d4F3B86946D21A552b18A4CeC7A3C',{from: accounts[3]})
  console.log(bool1)
  console.log(bool2)
  console.log(bool3)
  console.log(bool4)
}

async function testMint(deployer, network, accounts) {
  await MinterInstance.mintPresaleOne(['0xb1f58f70664b685e09f08e88966f12671c5fdc9c89fe7790bac65fe4dfe215a0','0x1b8ad64872b19351b588ad7775b9ef83dadee61616a7a141ed369b5519cc6ae6','0xf16218e8536264d1b52ab2bcacca339bb40c41912d0e525b7ab757f57602bba0'], {from: accounts[3]})
}
