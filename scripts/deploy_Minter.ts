import { ethers } from "hardhat";

const DEFAULT_INIT_BALANCE = "10000";

async function main() {
    const [deployer] = await ethers.getSigners();
    const initBalance = process.env.MINTER_INIT_BALANCE ?? process.argv[2] ?? DEFAULT_INIT_BALANCE;

    console.log("Deploying Minter with account:", deployer.address, "initBalance:", initBalance);
    const Minter = await ethers.getContractFactory("Minter");
    const minter = await Minter.deploy(BigInt(initBalance));
    await minter.waitForDeployment();
    console.log("Minter deployed at:", await minter.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
