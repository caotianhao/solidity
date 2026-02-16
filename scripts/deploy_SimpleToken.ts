import { ethers } from "hardhat";

const DEFAULT_SUPPLY = "1000000";

async function main() {
    const [deployer] = await ethers.getSigners();
    const supply = process.env.TOKEN_SUPPLY ?? process.argv[2] ?? DEFAULT_SUPPLY;

    console.log("Deploying SimpleToken with account:", deployer.address, "supply:", supply);
    const SimpleToken = await ethers.getContractFactory("SimpleToken");
    const token = await SimpleToken.deploy(ethers.parseEther(supply));
    await token.waitForDeployment();
    console.log("SimpleToken deployed at:", await token.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
