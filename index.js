const {
  Client,
  AccountId,
  PublicKey,
  PrivateKey,
  TokenId,
  Hbar,
  AccountCreateTransaction,
  TokenCreateTransaction,
  TokenAssociateTransaction,
  TokenDissociateTransaction,
  TransferTransaction,
  AccountBalanceQuery,
  TokenDeleteTransaction,
  TokenInfoQuery,
  TokenInfo,
} = require('@hashgraph/sdk');
const { hethers } = require('@hashgraph/hethers');
require('dotenv').config();

const contractJSON = require('./contracts/abi/combined.json');

console.clear();

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);

const accountId = AccountId.fromString(process.env.ACCOUNT_ID);
const accountKey = PrivateKey.fromString(process.env.ACCOUNT_KEY);

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

async function createToken(client, name, symbol, decimals, initialSupply, accountId) {
  const createTokenTx = await new TokenCreateTransaction()
    .setTokenName(name)
    .setTokenSymbol(symbol)
    .setDecimals(decimals)
    .setInitialSupply(initialSupply)
    .setTreasuryAccountId(accountId)
    .execute(client);

  const { tokenId } = await createTokenTx.getReceipt(client);

  return tokenId;
}

async function associateToken(client, accountId, keyId, tokenId) {
  const associateTokenTx = await new TokenAssociateTransaction()
    .setAccountId(accountId)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(keyId);

  const submitTx = await associateTokenTx.execute(client);
  const associateReceipt = await submitTx.getReceipt(client);

  console.log('associateReceipt', associateReceipt);
}

async function dissociateToken(client, accountId, keyId, tokenId) {
  const dissociateTokenTx = await new TokenDissociateTransaction()
    .setAccountId(accountId)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(keyId);

  const submitTx = await dissociateTokenTx.execute(client);
  const dissociateReceipt = await submitTx.getReceipt(client);

  console.log('dissociateReceipt', dissociateReceipt);
}

async function deleteToken(client, keyId, tokenId) {
  const deleteTokenTx = await new TokenDeleteTransaction()
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(keyId);

  const submitTx = await deleteTokenTx.execute(client);
  const deleteReceipt = await submitTx.getReceipt(client);

  console.log('deleteReceipt', deleteReceipt);
}

async function transferToken(client, fromId, toId, tokenId) {
  const transferTx = await new TransferTransaction()
    .addTokenTransfer(tokenId, fromId, -10)
    .addTokenTransfer(tokenId, toId, 10)
    .execute(client);

  const transferReceipt = await transferTx.getReceipt(client);

  console.log('transferReceipt', transferReceipt);
}

async function checkBalance(client, accountId) {
  const checkBalanceTx = await new AccountBalanceQuery().setAccountId(accountId).execute(client);

  console.log('checkBalanceTx', checkBalanceTx.tokens.toString());
}

async function tokenInfo(client, _tokenId) {
  const { tokenId, name, symbol, totalSupply, expirationTime, decimals } =
    await new TokenInfoQuery().setTokenId(_tokenId).execute(client);

  const tokenInfo = {
    tokenId: tokenId.toString(),
    name,
    symbol,
    decimals,
    totalSupply: totalSupply.toString(),
    expirationTime: expirationTime.toString(),
  };

  console.log('tokenInfo', tokenInfo);
}

async function main() {
  // Get provider
  const defaultProvider = hethers.providers.getDefaultProvider('testnet');

  // Get operator balance
  const operatorBalance = await defaultProvider.getBalance(operatorId);

  // Create Token with HTS
  // const tokenId = await createToken(client, 'Test 12345', 'TEST12345', 0, 1000, operatorId);

  const currentTokenId = new TokenId(0, 0, 34250874);

  // Associate token to id
  // await associateToken(client, accountId, accountKey, tokenId);

  // Dissociate token to id
  // await dissociateToken(client, accountId, accountKey, currentTokenId);

  // Delete token
  // await deleteToken(client, accountKey, currentTokenId);

  // Transfer token
  // await transferToken(client, accountId, operatorId, currentTokenId);

  // Get token info
  await tokenInfo(client, currentTokenId);

  // Check account balance
  await checkBalance(client, accountId);

  // Create Hethers wallet
  /*
  const { accountId, privateKey } = await createHethersWallet(client, 100000000000);
  console.log('accountId', accountId);
  console.log('privateKey', privateKey);
  */

  // Init Hethers wallet
  /*
  const wallet = getWallet(defaultProvider);
  */

  // Deploy contract
  /*
  const contractAddress = await deployContract(wallet);
  console.log('contractAddress', contractAddress);
  */

  // Get contract instance
  /*
  const contractInstance = new hethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractJSON.contracts['contracts/Todo.sol:Todo'].abi,
    wallet,
  );
  */
}

main();
