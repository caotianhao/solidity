import { ethers } from "hardhat";

async function main() {
    const [sender] = await ethers.getSigners();
    const faucetAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const tx = await sender.sendTransaction({
        to: faucetAddress,
        value: ethers.parseEther("10")
    });
    await tx.wait();
    console.log("Funded faucet with 10 ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
