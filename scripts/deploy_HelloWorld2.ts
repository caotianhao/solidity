import {ethers} from "hardhat";

async function main() {
    const HelloWorld2 = await ethers.getContractFactory("HelloWorld2");
    const hello = await HelloWorld2.deploy();

    await hello.waitForDeployment();

    console.log(`Deployed to: ${hello.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
