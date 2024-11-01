import dotenv from "dotenv";
import fs, { openAsBlob } from "fs";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { DEFAULT_DECIMALS, PumpFunSDK } from "../../src";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  getOrCreateKeypair,
  getSPLBalance,
  printSOLBalance,
  printSPLBalance,
} from "../src/util";
import metadata from "../../src/metadata";
import { getUploadedMetadataURI } from "../../src/uploadToIpfs";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

const KEYS_FOLDER = __dirname + "/.keys";
const SLIPPAGE_BASIS_POINTS = 100n;

async function createKeypair() {
  // Generate a new keypair
  const keypair = Keypair.generate();

  // Extract the public key and secret key
  const publicKey = keypair.publicKey;
  const secretKey = keypair.secretKey;

  // Convert keys to base58 strings (for display or storage)
  const publicKeyBase58 = publicKey.toBase58();
  const secretKeyBase58 = bs58.encode(secretKey);

  const data = {
    "publicKey": publicKeyBase58,
    "secretKey": secretKeyBase58
  }
  const metadataString = JSON.stringify(data);
  const bufferContent = Buffer.from(metadataString, 'utf-8');
  fs.writeFileSync("./example/basic/.keys/mint.json", bufferContent);

  return keypair; // Return the keypair object if needed
}

const main = async () => {
  dotenv.config();

  if (!process.env.HELIUS_RPC_URL) {
    console.error("Please set HELIUS_RPC_URL in .env file");
    console.error(
      "Example: HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=<your api key>"
    );
    console.error("Get one at: https://www.helius.dev");
    return;
  }

  let connection = new Connection(process.env.HELIUS_RPC_URL || "");

  let wallet = new NodeWallet(new Keypair()); //note this is not used
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "finalized",
  });

  await createKeypair();

  const testAccount = getOrCreateKeypair(KEYS_FOLDER, "test-account");
  const buyer1 = getOrCreateKeypair(KEYS_FOLDER, "buyer1");
  const buyer2 = getOrCreateKeypair(KEYS_FOLDER, "buyer2");
  const buyer3 = getOrCreateKeypair(KEYS_FOLDER, "buyer3");
  const mint = getOrCreateKeypair(KEYS_FOLDER, "mint");

  await printSOLBalance(
    connection,
    testAccount.publicKey,
    "Test Account keypair"
  );

  let sdk = new PumpFunSDK(provider);

  let globalAccount = await sdk.getGlobalAccount();
  console.log(globalAccount);

  let currentSolBalance = await connection.getBalance(testAccount.publicKey);
  if (currentSolBalance == 0) {
    console.log(
      "Please send some SOL to the test-account:",
      testAccount.publicKey.toBase58()
    );
    return;
  }

  //Check if mint already exists
  let boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
  if (!boundingCurveAccount) {
    let tokenMetadata = {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      showName: metadata.showName,
      createOn: metadata.createdOn,
      twitter: metadata.twitter,
      telegram: metadata.telegram,
      website: metadata.website,
      file: await openAsBlob("./upload/bolt.jpg"),
    };

    let createResults = await sdk.createAndBuy(
      testAccount,
      mint,
      [testAccount, buyer1, buyer2, buyer3], // buyers
      tokenMetadata,
      BigInt(0.0001 * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 5_000_000,
        unitPrice: 200_000,
      },
    );

    if (createResults.confirmed) {
      console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
      console.log(createResults.jitoTxsignature);
      boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
      console.log("Bonding curve after create and buy", boundingCurveAccount);
      printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
    }
  } else {
    console.log("boundingCurveAccount", boundingCurveAccount);
    console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
    printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
  }

  // Buy and sell
  if (boundingCurveAccount) {
    // buy 0.0001 SOL worth of tokens
    let buyResults = await sdk.buy(
      testAccount,
      // mint.publicKey,
      new PublicKey("3ZQuEN9gE14TXxYnMvWq86RBvh6wTdvtSaM1hhdXb2xQ"),
      BigInt(0.0001 * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 5_000_000,
        unitPrice: 200_000,
      },
    );
    if (buyResults.success) {
      printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
      console.log("Bonding curve after buy", await sdk.getBondingCurveAccount(mint.publicKey));
    } else {
      console.log("Buy failed");
    }

    // buy 0.0001 SOL worth of tokens
    let buyResultsByBuyer = await sdk.buy(
      buyer,
      // mint.publicKey,
      new PublicKey("p89evAyzjd9fphjJx7G3RFA48sbZdpGEppRcfRNpump"),
      BigInt(0.0001 * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 5_000_000,
        unitPrice: 200_000,
      },
    );

    if (buyResultsByBuyer.success) {
      printSPLBalance(connection, mint.publicKey, buyer.publicKey);
      console.log("Bonding curve after buy ", await sdk.getBondingCurveAccount(mint.publicKey));
    } else {
      console.log("Buy failed");
    }

    // sell all tokens
    let currentSPLBalance = await getSPLBalance(
      connection,
      mint.publicKey,
      testAccount.publicKey
    );
    console.log("currentSPLBalance ", currentSPLBalance);
    if (currentSPLBalance) {
      let sellResults = await sdk.sell(
        testAccount,
        mint.publicKey,
        BigInt(currentSPLBalance * Math.pow(10, DEFAULT_DECIMALS)),
        SLIPPAGE_BASIS_POINTS,
        {
          unitLimit: 5_000_000,
          unitPrice: 200_000,
        },
      );
      if (sellResults.success) {
        await printSOLBalance(
          connection,
          testAccount.publicKey,
          "Test Account keypair"
        );

        printSPLBalance(connection, mint.publicKey, testAccount.publicKey, "After SPL sell all");
        console.log("Bonding curve after sell", await sdk.getBondingCurveAccount(mint.publicKey));
      } else {
        console.log("Sell failed");
      }
    }
  }
};

main();
