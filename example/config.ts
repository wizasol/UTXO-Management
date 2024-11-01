import { Connection, PublicKey, Keypair } from "@solana/web3.js"

const retrieveEnvVariable = (variableName: string) => {
    const variable = process.env[variableName] || ''
    if (!variable) {
        console.log(`${variableName} is not set`)
        process.exit(1)
    }
    return variable
}

export const cluster = retrieveEnvVariable("CLUSTER")
export const mainnetRpc = retrieveEnvVariable("MAINNET_RPC_URL")
export const devnetRpc = retrieveEnvVariable("DEVNET_RPC_URL")
export const connection = cluster == 'mainnet' ?
    new Connection(mainnetRpc) : new Connection(devnetRpc)