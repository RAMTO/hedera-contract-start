const {
  Client,
  AccountId,
  PublicKey,
  PrivateKey,
  Hbar,
  AccountCreateTransaction,
} = require('@hashgraph/sdk');
const { hethers } = require('@hashgraph/hethers');
require('dotenv').config();

const contractJSON = require('./contracts/abi/combined.json');

console.clear();

const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);

if (operatorId == null || operatorKey == null) {
  throw new Error('Environment variables ACCOUNT_ID and PRIVATE_KEY must be present');
}

// Init client
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function createHethersWallet(client, amount) {
  // Create random wallet
  const randomWallet = hethers.Wallet.createRandom();

  const tx = await new AccountCreateTransaction()
    .setKey(PublicKey.fromString(randomWallet._signingKey().compressedPublicKey))
    .setInitialBalance(Hbar.fromTinybars(amount))
    .execute(client);

  const getReceipt = await tx.getReceipt(client);

  return {
    accountId: getReceipt.accountId.toString(),
    privateKey: randomWallet._signingKey().privateKey,
  };
}

async function deployContract(signer) {
  const contractBytecode = contractJSON.contracts['contracts/Todo.sol:Todo'].bin;
  const contractAbi = contractJSON.contracts['contracts/Todo.sol:Todo'].abi;

  // Create factory
  const factory = new hethers.ContractFactory(contractAbi, contractBytecode, signer);

  // Deploy an instance of the contract
  const contract = await factory.deploy({ gasLimit: 300000 });

  await contract.deployTransaction.wait();

  // Get address
  const contractAddress = contract.address;

  return contractAddress;
}

function getWallet(provider) {
  const eoaAddress = {
    account: process.env.HETHERS_ACCOUNT_ID,
    privateKey: process.env.HETHERS_PRIVATE_KEY,
  };

  const wallet = new hethers.Wallet(eoaAddress, provider);

  return wallet;
}

async function main() {
  // Get provider
  const defaultProvider = hethers.providers.getDefaultProvider('testnet');

  // Get operator balance
  const operatorBalance = await defaultProvider.getBalance(operatorId);

  // Create Hethers wallet
  /*
  const { accountId, privateKey } = await createHethersWallet(client, 100000000000);
  console.log('accountId', accountId);
  console.log('privateKey', privateKey);
  */

  // Init Hethers wallet
  const wallet = getWallet(defaultProvider);

  // Deploy contract
  /*
  const contractAddress = await deployContract(wallet);
  console.log('contractAddress', contractAddress);
  */
}

main();
