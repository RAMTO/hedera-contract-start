# ๐ Hedera Contract Start

Boilerplate for Hedera contract depoloyment and interaction.

## ๐ฌ Prerequisites and dependencies

โ ๏ธ **Node.js version:** `16.14.2`

If you use another version, please use [n](https://github.com/tj/n) to manage.

## โ๏ธ Install dependencies

Run in console:

```
yarn
```

## ๐ Before running the project

Create a `.env` file in the project root:

```
ACCOUNT_ID=<HEDERA_ACCOUNT_ID>
PRIVATE_KEY=<HEDERA_ACCOUNT_PRIVATE_KEY>
HETHERS_ACCOUNT_ID=<HEDERA_ACCOUNT_ID>
HETHERS_PRIVATE_KEY=<HEDERA_ACCOUNT_PRIVATE_KEY>
```

## ๐ Available Scripts

๐ **To run the project:**

```
yarn start
```

โณ **Compile sample contract:**

```
yarn compile
```

๐งจ **Delete abi folder:**

```
yarn clean
```
