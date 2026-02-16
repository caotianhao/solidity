import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying HelloWorld2 with account:", deployer.address);

    const HelloWorld2 = await ethers.getContractFactory("HelloWorld2");
    const hello = await HelloWorld2.deploy();
    await hello.waitForDeployment();
    console.log("HelloWorld2 deployed at:", await hello.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
