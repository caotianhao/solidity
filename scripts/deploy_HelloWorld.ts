import { ethers } from "hardhat";

const DEFAULT_MESSAGE = "Hello, Hardhat!";

async function main() {
    const [deployer] = await ethers.getSigners();
    const message = process.env.HELLO_MESSAGE ?? process.argv[2] ?? DEFAULT_MESSAGE;

    console.log("Deploying HelloWorld with account:", deployer.address);
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy(message);
    await hello.waitForDeployment();
    console.log("HelloWorld deployed at:", await hello.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
