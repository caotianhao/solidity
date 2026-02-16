import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Faucet with:", deployer.address);

    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();
    await faucet.waitForDeployment();
    console.log("Faucet deployed at:", await faucet.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
