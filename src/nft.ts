import * as anchor from "@project-serum/anchor";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import base58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

export type PoapKeys = 'yoga' | 'crossfit' | 'sundowner' | 'pool-party' | 'fifa' | 'hiking' | 'open-mic' | 'mortal-kombat' | 'binge-watch' | 'deep-work' | 'card-game' | 'chai-pe-charcha' | 'tech-talks';

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
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832503/crossfit_zlr67i.json",
        'name': "CrossFit @ BLRxZo",
        'symbol': "CF"
      },
      'sundowner': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832504/sundowner_kd5yke.json",
        'name': "Sundowner @ BLRxZo",
        'symbol': "SUNDOWNER"
      },
      'pool-party': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832504/pool-party_xqciek.json",
        'name': "Pool Party @ BLRxZo",
        'symbol': "POOL"
      },
      'fifa': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832504/fifa_fjnfqe.json",
        'name': "FIFA @ BLRxZo",
        'symbol': "FIFA"
      },
      'hiking': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832504/hiking_sindto.json",
        'name': "Hiking @ BLRxZo",
        'symbol': "HIKING"
      },
      'open-mic': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832504/open-mic_tqhemf.json",
        'name': "Open Mic @ BLRxZo",
        'symbol': "OPENMIC"
      },
      'mortal-kombat': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832504/mortal-combat_v7bsxw.json",
        'name': "Mortal Kombat @ BLRxZo",
        'symbol': "MORTAL"
      },
      'binge-watch': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832504/binge-watch_mfxw2f.json",
        'name': "Binge Watch @ BLRxZo",
        'symbol': "BINGE"
      },
      'deep-work': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832503/deep-work_zsb6qy.json",
        'name': "Deep Work @ BLRxZo",
        'symbol': "DW"
      },
      'chai-pe-charcha': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832503/chai-pe-charcha_arbtzd.json",
        'name': "Deep Work @ BLRxZo",
        'symbol': "DW"
      },
      'card-game': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832503/card-game_yqzkev.json",
        'name': "Card Games @ BLRxZo",
        'symbol': "CG"
      },
      'tech-talks': {
        'uri': "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685832503/deep-work_zsb6qy.json",
        'name': "Tech Talk @ BLRxZo",
        'symbol': "TECHTALK"
      }
  }

export const mint = async (walletAddress: string, poap: PoapKeys) => {
    console.log(poap);
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