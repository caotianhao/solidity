import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying exe with account:", deployer.address);

    const Exe = await ethers.getContractFactory("exe");
    const exe = await Exe.deploy();
    await exe.waitForDeployment();
    console.log("exe deployed at:", await exe.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
