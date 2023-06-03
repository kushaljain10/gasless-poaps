import * as anchor from "@project-serum/anchor";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import base58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

export type PoapKeys = 'yoga' | 'crossfit';

interface Poap {
    uri: string;
    name: string;
    symbol: string;
  }
  
  const poaps: Record<PoapKeys, Poap> = {
    'yoga': {
      'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685797736/yoga_sdqjqm.json",
      'name': "Yoga @ BLRxZo",
      'symbol': "YOGA"
    },
    'crossfit': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685797736/yoga_sdqjqm.json",
        'name': "Yoga @ BLRxZo",
        'symbol': "YOGA"
      }
  }

export const mint = async (walletAddress: string, poap: PoapKeys) => {
    const connection = new anchor.web3.Connection(
        "https://solana-mainnet.rpc.extrnode.com"  // replace with your RPC
    );
    const user = new anchor.web3.PublicKey(walletAddress);
    const reference = anchor.web3.Keypair.generate().publicKey;
    const mint = anchor.web3.Keypair.generate();
    const keypair = anchor.web3.Keypair.fromSecretKey(
        base58.decode(process.env.SOL_PRIVATE_KEY!) // add your payer private key, this wallet is the actual creator of NFT
    );
    const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));

    const transactionBuilder = await metaplex.nfts().builders().create({
        uri: poaps[poap].uri,
        name: poaps[poap].name,
        symbol: poaps[poap].symbol,
        sellerFeeBasisPoints: 0,
        useNewMint: mint,
        tokenOwner: user,
    });

    const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
    const transaction = transactionBuilder.toTransaction({
        blockhash,
        lastValidBlockHeight,
    });

    transaction.instructions[0].keys.push({
        pubkey: user,
        isSigner: true,
        isWritable: false,
    });
    transaction.instructions[0].keys.push({
        pubkey: reference,
        isSigner: false,
        isWritable: false,
    });

    transaction.partialSign(mint, keypair);

    const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
    });
    const base64 = serializedTransaction.toString("base64");

    return base64;
}