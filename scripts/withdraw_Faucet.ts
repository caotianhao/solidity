import { ethers } from "hardhat";

const DEFAULT_FAUCET = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const DEFAULT_WITHDRAW = "0.5";

async function main() {
    const [caller] = await ethers.getSigners();
    const faucetAddress = process.env.FAUCET_ADDRESS ?? process.argv[2] ?? DEFAULT_FAUCET;
    const amount = process.env.WITHDRAW_AMOUNT ?? process.argv[3] ?? DEFAULT_WITHDRAW;

    const faucet = await ethers.getContractAt("Faucet", faucetAddress);
    const tx = await faucet.connect(caller).withdraw(ethers.parseEther(amount));
    await tx.wait();
    console.log(`Withdrawn ${amount} ETH to ${caller.address}`);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
