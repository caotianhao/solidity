import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const ONE_YEAR_SECS = 365 * 24 * 60 * 60;

async function main() {
    const [deployer] = await ethers.getSigners();
    const unlockInYears = process.env.LOCK_YEARS ?? process.argv[2] ?? "1";
    const lockValue = process.env.LOCK_VALUE_ETH ?? process.argv[3] ?? "0.01";

    const latest = await time.latest();
    const unlockTime = latest + Number(unlockInYears) * ONE_YEAR_SECS;

    console.log("Deploying Lock with account:", deployer.address);
    console.log("Unlock time (timestamp):", unlockTime, "Value (ETH):", lockValue);

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: ethers.parseEther(lockValue) });
    await lock.waitForDeployment();
    console.log("Lock deployed at:", await lock.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
