// test/MerkleProofVerify.test.js
// SPDX-License-Identifier: MIT
// based upon https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.1/test/cryptography/MerkleProof.test.js
const { ethers } = require('ethers');
// const { MerkleTree } = require('merkletreejs');
const { MerkleTree } = require('./merkleTree.js');
// const { keccak256 } = require('keccak256');
const attributionsGiveAway = require('./walletsAndAllowanceList-giveAway.json');

const { keccak256, bufferToHex } = require('ethereumjs-util');
var fs = require('fs');

function  _leaf(account, amount) {
  // return Buffer.from(ethers.utils.solidityKeccak256(['uint256', 'address'], [amount, account]).slice(2), 'hex')
  return ethers.utils.solidityPack([ 'address','uint256'], [account, amount])
}
// const jsonPresaleOne = JSON.parse(fs.readFileSync('walletsAndAllowanceList-presale.json', { encoding: 'utf8' }))
// const jsonPresaleTwo = JSON.parse(fs.readFileSync('walletsAndAllowanceList-team.json', { encoding: 'utf8' }))


// if (typeof jsonGiveaway !== 'object') throw new Error('Invalid JSON')
const elementsGiveAway = []
for (const [key, value] of Object.entries(attributionsGiveAway)) {
  elementsGiveAway.push(_leaf(key, value))
}

console.log(elementsGiveAway)
// const elementsGiveAway = jsonGiveaway.allowances;
// const merkleTreeOne = new MerkleTree(elementsPresaleOne);
// const merkleTreeOne = new MerkleTree(elementsPresaleOne);
const merkleTreeGiveAway = new MerkleTree(elementsGiveAway, {sortPairs: true })
// const merkleTreeGiveAway = new MerkleTree(Object.entries(attributionsGiveAway).map(token => hashToken(...token).toString('hex')), keccak256, {sortPairs: true });
// const rootOne = merkleTreeOne.getHexRoot();
// console.log(rootOne)
// const rootTwo = merkleTreeTwo.getHexRoot();
// console.log(rootTwo)
const rootGiveAway = merkleTreeGiveAway.getHexRoot();
console.log(rootGiveAway)

for (const [account, amount] of Object.entries(attributionsGiveAway)) 
{
	console.log(_leaf(account, amount))
	const proof = merkleTreeGiveAway.getHexProof(_leaf(account, amount).toString('hex'));
	console.log(account, amount)
	console.log(proof)
}
