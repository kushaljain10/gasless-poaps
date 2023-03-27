### Gasless POAPs Creator

Create minting QR Codes for gasless POAPs/NFTs on the Solana blockchain! follow these simple steps to get started,

Note: This is an open-sourced, example implementation, security of private keys being used to pay for gas behind the scenes is at your risk!

## 1. Fork & Edit

Fork the repo and edit the following details based on your NFT details,
 - Custom RPC URL under `./nft.ts` for better speed (optional)
 - `uri` under the `./nft.ts` file. This holds the metadata details of your NFT. Create a new JSON file with required details, host on pltaforms like Shadow.storage or Cloudinary and paste the hosted url here to mint NFT with your required metadata (required)

## 2. [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/ClTh95?referralCode=vamp) 
Deploy on Railway and make sure to add value to the env `SOL_PRIVATE_KEY` with private key of wallet that will pay for gas fees behind the scenes! (Each NFT mint costs ~0.012 SOL, fund according to your expected mint numbers!)

## 3. Encode URL of the hosted server

 - After deployment on railway, your server will be hosted! Create a domain for your server under `custom domain` settings and copy the URL.
 - Visit [URL Encoder](https://www.urlencoder.org/), psste your server URL, click encode, an encoded URL will be generated. Copy it for the final step

## 4. Create QR Code

 - Visit [QR Code Monkey](https://www.qrcode-monkey.com/#), under your URL section, add a text `solana:` in start and then paste your encoded server url. Note- Adding the `solana:` text is reuired and minting will not work if this process is not followed properly!
 ![qr-code-monkey](https://shdw-drive.genesysgo.net/BfBZRXtX2ad9dVyJnc6Tbww8egupegtiV2xiwWCBYH1h/Screenshot%202023-03-27%20234846.png)
 - Design your QR Code according to your needs and download the final image.

 That's all! you're all set to mint and share some gasless NFTs on the Solana blockchain!
