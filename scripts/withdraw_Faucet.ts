import { ethers } from "hardhat";

async function main() {
    const [caller] = await ethers.getSigners();
    const faucetAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const faucet = await ethers.getContractAt("Faucet", faucetAddress);

    const tx = await faucet.connect(caller).withdraw(ethers.parseEther("0.5"));
    await tx.wait();
    console.log("Withdrawn 0.5 ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
