import {ethers} from "hardhat";

async function main() {
    const MyVote = await ethers.getContractFactory("MyVote");
    const proposals = ["Alice", "Bob", "Charlie"]
    const myVote = await MyVote.deploy(proposals);

    await myVote.waitForDeployment();
    console.log(`MyVote deployed successfully at ${myVote.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})