const { Client, AccountId, PrivateKey, TokenCreateTransaction } = require('@hashgraph/sdk');
require('dotenv').config();

console.clear();

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);

// Init client
// const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const client = Client.forMainnet().setOperator(operatorId, operatorKey);

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

async function main() {
  const tokenId = await createToken(client, 'Test 001', 'TEST001', 10, 1000, operatorId);

  console.log('tokenId', tokenId);
}

main();
