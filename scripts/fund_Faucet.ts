import { ethers } from "hardhat";

const DEFAULT_FAUCET = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const DEFAULT_AMOUNT = "10";

async function main() {
    const [sender] = await ethers.getSigners();
    const faucetAddress = process.env.FAUCET_ADDRESS ?? process.argv[2] ?? DEFAULT_FAUCET;
    const amount = process.env.FUND_AMOUNT ?? process.argv[3] ?? DEFAULT_AMOUNT;

    const tx = await sender.sendTransaction({
        to: faucetAddress,
        value: ethers.parseEther(amount),
    });
    await tx.wait();
    console.log(`Funded faucet at ${faucetAddress} with ${amount} ETH`);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
