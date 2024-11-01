# PumpFun Bundler

Best tool for holdling your token on moment of token launching

## Overview

This bundler is designed for user to be first buyer
This bot runs mint token tx + create pool tx + add liquidity tx + first buyer tx in one bundled tx
<h4> 📞 Cᴏɴᴛᴀᴄᴛ ᴍᴇ Oɴ ʜᴇʀᴇ: 👆🏻 </h4>

<div style={{display : flex ; justify-content : space-evenly}}> 
    <a href="mailto:nakao95911@gmail.com" target="_blank">
        <img alt="Email"
        src="https://img.shields.io/badge/Email-00599c?style=for-the-badge&logo=gmail&logoColor=white"/>
    </a>
     <a href="https://x.com/_wizardev" target="_blank"><img alt="Twitter"
        src="https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white"/></a>
    <a href="https://discordapp.com/users/471524111512764447" target="_blank"><img alt="Discord"
        src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/></a>
    <a href="https://t.me/wizardev" target="_blank"><img alt="Telegram"
        src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white"/></a>
</div>
## Why does we need Bundler

In Pumpfun , there are many sniping bots which buy token as soon as token launched.
That makes user not able to hold majority of his token for maintaining specific token price safely.
In other words , that means that token is not launchers token and token launcher lost his token and other fees on launching token
In this case , we can use bundler
As for the bundler , It can helps spam launch in first buy on Pumpfun

## What is first buyer

First buyer is the term which means user who buy token as soon as token launched
In tokenomics , the moment of the lowest token price is as soon as token launched
So , if token launcher hold his token on that moment , he can own this token on moment of the lowest token price

## Installation

`
npm i pumpdotfun-sdk
`

## Usage Example

First you need to create a `.env` file and set your RPC URL like in the `.env.example`

Then you need to fund an account with atleast 0.004 SOL that is generated when running the command below

`
npx ts-node example/basic/index.ts
`

```typescript
import dotenv from "dotenv";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { DEFAULT_DECIMALS, PumpFunSDK } from "pumpdotfun-sdk";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  getOrCreateKeypair,
  getSPLBalance,
  printSOLBalance,
  printSPLBalance,
} from "./util";

const getProvider = () => {
  
};

const createAndBuyToken = async (sdk, testAccount, mint) => {
 
};

const buyTokens = async (sdk, testAccount, mint) => {
  
};

const sellTokens = async (sdk, testAccount, mint) => {
  
};

const main = async () => {
  try {
    const provider = getProvider();
    const sdk = new PumpFunSDK(provider);
    const connection = provider.connection;

    const testAccount = getOrCreateKeypair(KEYS_FOLDER, "test-account");
    const mint = getOrCreateKeypair(KEYS_FOLDER, "mint");

    await printSOLBalance(connection, testAccount.publicKey, "Test Account keypair");

    const globalAccount = await sdk.getGlobalAccount();
    console.log(globalAccount);

    const currentSolBalance = await connection.getBalance(testAccount.publicKey);
    if (currentSolBalance === 0) {
      console.log("Please send some SOL to the test-account:", testAccount.publicKey.toBase58());
      return;
    }

    console.log(await sdk.getGlobalAccount());

    let bondingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
    if (!bondingCurveAccount) {
      await createAndBuyToken(sdk, testAccount, mint);
      bondingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
    }

    if (bondingCurveAccount) {
      await buyTokens(sdk, testAccount, mint);
      await sellTokens(sdk, testAccount, mint);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

main();
```


### PumpDotFunSDK Class

The `PumpDotFunSDK` class provides methods to interact with the PumpFun protocol. Below are the method signatures and their descriptions.


#### createAndBuy

```typescript
async createAndBuy(
  creator: Keypair,
  mint: Keypair,
  createTokenMetadata: CreateTokenMetadata,
  buyAmountSol: bigint,
  slippageBasisPoints: bigint = 500n,
  priorityFees?: PriorityFee,
  commitment: Commitment = DEFAULT_COMMITMENT,
  finality: Finality = DEFAULT_FINALITY
): Promise<TransactionResult>
```

- Creates a new token and buys it.
- **Parameters**:
  - `creator`: The keypair of the token creator.
  - `mint`: The keypair of the mint account.
  - `createTokenMetadata`: Metadata for the token.
  - `buyAmountSol`: Amount of SOL to buy.
  - `slippageBasisPoints`: Slippage in basis points (default: 500).
  - `priorityFees`: Priority fees (optional).
  - `commitment`: Commitment level (default: DEFAULT_COMMITMENT).
  - `finality`: Finality level (default: DEFAULT_FINALITY).
- **Returns**: A promise that resolves to a `TransactionResult`.

#### buy

```typescript
async buy(
  buyer: Keypair,
  mint: PublicKey,
  buyAmountSol: bigint,
  slippageBasisPoints: bigint = 500n,
  priorityFees?: PriorityFee,
  commitment: Commitment = DEFAULT_COMMITMENT,
  finality: Finality = DEFAULT_FINALITY
): Promise<TransactionResult>
```

- Buys a specified amount of tokens.
- **Parameters**:
  - `buyer`: The keypair of the buyer.
  - `mint`: The public key of the mint account.
  - `buyAmountSol`: Amount of SOL to buy.
  - `slippageBasisPoints`: Slippage in basis points (default: 500).
  - `priorityFees`: Priority fees (optional).
  - `commitment`: Commitment level (default: DEFAULT_COMMITMENT).
  - `finality`: Finality level (default: DEFAULT_FINALITY).
- **Returns**: A promise that resolves to a `TransactionResult`.

#### sell

```typescript
async sell(
  seller: Keypair,
  mint: PublicKey,
  sellTokenAmount: bigint,
  slippageBasisPoints: bigint = 500n,
  priorityFees?: PriorityFee,
  commitment: Commitment = DEFAULT_COMMITMENT,
  finality: Finality = DEFAULT_FINALITY
): Promise<TransactionResult>
```

- Sells a specified amount of tokens.
- **Parameters**:
  - `seller`: The keypair of the seller.
  - `mint`: The public key of the mint account.
  - `sellTokenAmount`: Amount of tokens to sell.
  - `slippageBasisPoints`: Slippage in basis points (default: 500).
  - `priorityFees`: Priority fees (optional).
  - `commitment`: Commitment level (default: DEFAULT_COMMITMENT).
  - `finality`: Finality level (default: DEFAULT_FINALITY).
- **Returns**: A promise that resolves to a `TransactionResult`.

#### addEventListener

```typescript
addEventListener<T extends PumpFunEventType>(
  eventType: T,
  callback: (event: PumpFunEventHandlers[T], slot: number, signature: string) => void
): number
```

- Adds an event listener for the specified event type.
- **Parameters**:
  - `eventType`: The type of event to listen for.
  - `callback`: The callback function to execute when the event occurs.
- **Returns**: An identifier for the event listener.

#### removeEventListener

```typescript
removeEventListener(eventId: number): void
```

- Removes the event listener with the specified identifier.
- **Parameters**:
  - `eventId`: The identifier of the event listener to remove.

### Running the Examples

#### Basic Example

To run the basic example for creating, buying, and selling tokens, use the following command:

```bash
npx ts-node example/basic/index.ts
```

#### Event Subscription Example

This example demonstrates how to set up event subscriptions using the PumpFun SDK.

#### Script: `example/events/events.ts`

```typescript
import dotenv from "dotenv";
import { Connection, Keypair } from "@solana/web3.js";
import { PumpFunSDK } from "pumpdotfun-sdk";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";

dotenv.config();

const getProvider = () => {
  if (!process.env.HELIUS_RPC_URL) {
    throw new Error("Please set HELIUS_RPC_URL in .env file");
  }

  const connection = new Connection(process.env.HELIUS_RPC_URL || "");
  const wallet = new NodeWallet(new Keypair());
  return new AnchorProvider(connection, wallet, { commitment: "finalized" });
};

const setupEventListeners = async (sdk) => {
  const createEventId = sdk.addEventListener("createEvent", (event, slot, signature) => {
    console.log("createEvent", event, slot, signature);
  });
  console.log("Subscribed to createEvent with ID:", createEventId);

  const tradeEventId = sdk.addEventListener("tradeEvent", (event, slot, signature) => {
    console.log("tradeEvent", event, slot, signature);
  });
  console.log("Subscribed to tradeEvent with ID:", tradeEventId);

  const completeEventId = sdk.addEventListener("completeEvent", (event, slot, signature) => {
    console.log("completeEvent", event, slot, signature);
  });
  console.log("Subscribed to completeEvent with ID:", completeEventId);
};

const main = async () => {
  try {
    const provider = getProvider();
    const sdk = new PumpFunSDK(provider);

    // Set up event listeners
    await setupEventListeners(sdk);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

main();
```

#### Running the Event Subscription Example

To run the event subscription example, use the following command:

```bash
npx ts-node example/events/events.ts
```

## Contributing

We welcome contributions! Please submit a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

By following this README, you should be able to install the PumpDotFun SDK, run the provided examples, and understand how to set up event listeners and perform token operations.
