// test/MerkleProofVerify.test.js
// SPDX-License-Identifier: MIT
// based upon https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.1/test/cryptography/MerkleProof.test.js


const { MerkleTree } = require('./merkleTree.js');
var fs = require('fs');


const jsonPresaleOne = JSON.parse(fs.readFileSync('walletsList-presaleOne.json', { encoding: 'utf8' }))
const jsonPresaleTwo = JSON.parse(fs.readFileSync('walletsList-presaleTwo.json', { encoding: 'utf8' }))

if (typeof jsonPresaleOne !== 'object') throw new Error('Invalid JSON')
if (typeof jsonPresaleTwo !== 'object') throw new Error('Invalid JSON')

const elementsPresaleOne = jsonPresaleOne.addresses;
const elementsPresaleTwo = jsonPresaleTwo.addresses;
const merkleTreeOne = new MerkleTree(elementsPresaleOne);
const merkleTreeTwo = new MerkleTree(elementsPresaleTwo);

const rootOne = merkleTreeOne.getHexRoot();
console.log(rootOne)
const rootTwo = merkleTreeTwo.getHexRoot();
console.log(rootTwo)
const proofOne = merkleTreeOne.getHexProof(elementsPresaleOne[4]);
console.log(proofOne)
const proofTwo = merkleTreeTwo.getHexProof(elementsPresaleTwo[3]);
console.log(proofTwo)