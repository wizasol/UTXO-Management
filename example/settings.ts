import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// define buyers wallet
export const swapWallets: Keypair[] = [
    Keypair.fromSecretKey(bs58.decode("")),
    Keypair.fromSecretKey(bs58.decode("")),
    Keypair.fromSecretKey(bs58.decode(""))
]

export const distributeWalletNum = 25