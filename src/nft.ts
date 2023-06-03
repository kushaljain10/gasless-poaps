import * as anchor from "@project-serum/anchor";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import base58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

export const mint = async (walletAddress: string) => {
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
        uri: "https://res.cloudinary.com/dnjbui12k/raw/upload/v1685618330/the_lollypop_metadata_mb7j7t.json",
        name: "Lollypop Galaxy",
        symbol: "LG",
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
};