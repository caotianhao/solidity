import {ethers} from "hardhat";

async function main() {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();
    await faucet.waitForDeployment();
    console.log(`Faucet deployed to: ${faucet.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
